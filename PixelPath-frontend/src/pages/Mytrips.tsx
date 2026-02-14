import { useState, useEffect, useRef, useMemo } from "react";
import {
    MapContainer,
    TileLayer,
    Polyline,
    Marker,
    useMap,
} from "react-leaflet";
import type { LatLngExpression } from "leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Play, Pause } from "lucide-react";

/* ---------------- FIX LEAFLET ICON ---------------- */

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

/* ---------------- TYPES ---------------- */

type Place = {
    id: string;
    name: string;
    lat: number;
    lng: number;
};

type Trip = {
    id: string;
    title: string;
    date: string;
    distanceKm: number;
    places: Place[];
};

/* ---------------- SAMPLE TRIPS ---------------- */

const trips: Trip[] = [
    {
        id: "1",
        title: "Mumbai Heritage Trail",
        date: "March 15-17, 2026",
        distanceKm: 8.8,
        places: [
            { id: "1", name: "Gateway", lat: 18.922, lng: 72.8347 },
            { id: "2", name: "CST", lat: 18.9398, lng: 72.8355 },
            { id: "3", name: "Marine Drive", lat: 18.9432, lng: 72.8236 },
        ],
    },
    {
        id: "2",
        title: "Goa Beach Escape",
        date: "April 20-25, 2026",
        distanceKm: 12,
        places: [
            { id: "1", name: "Baga Beach", lat: 15.5559, lng: 73.7516 },
            { id: "2", name: "Bom Jesus", lat: 15.5008, lng: 73.9117 },
            { id: "3", name: "Dudhsagar", lat: 15.3144, lng: 74.3144 },
        ],
    },
];

/* ---------------- AUTO FOCUS ---------------- */

const FocusMap = ({ position }: { position: LatLngExpression }) => {
    const map = useMap();
    useEffect(() => {
        map.flyTo(position, 14, { duration: 0.8 });
    }, [position]);
    return null;
};

/* ---------------- MAIN COMPONENT ---------------- */

const MyTrips = () => {
    const [selectedTrip, setSelectedTrip] = useState<Trip | null>(trips[0]);
    const [realRoute, setRealRoute] = useState<[number, number][]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [playing, setPlaying] = useState(false);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    /* ---------------- FETCH ROUTE ---------------- */

    useEffect(() => {
        if (!selectedTrip || selectedTrip.places.length < 2) {
            setRealRoute([]);
            return;
        }

        const fetchRoute = async () => {
            try {
                const coords = selectedTrip.places
                    .map(p => `${p.lng},${p.lat}`)
                    .join(";");

                const res = await fetch(
                    `https://router.project-osrm.org/route/v1/driving/${coords}?overview=full&geometries=geojson`
                );

                const data = await res.json();
                const geometry = data.routes?.[0]?.geometry?.coordinates;

                if (geometry) {
                    const converted = geometry.map(
                        (c: [number, number]) => [c[1], c[0]]
                    );
                    setRealRoute(converted);
                    setCurrentIndex(0);
                }
            } catch (err) {
                console.error("Routing error:", err);
            }
        };

        fetchRoute();
    }, [selectedTrip]);

    /* ---------------- PLAYBACK ---------------- */

    useEffect(() => {
        if (playing && realRoute.length > 0) {
            intervalRef.current = setInterval(() => {
                setCurrentIndex(prev => {
                    if (prev < realRoute.length - 1) return prev + 1;
                    setPlaying(false);
                    return prev;
                });
            }, 40);
        }

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [playing, realRoute.length]);

    const togglePlayback = () => {
        if (currentIndex === realRoute.length - 1) {
            setCurrentIndex(0);
        }
        setPlaying(prev => !prev);
    };

    const progress = useMemo(() => {
        if (!realRoute.length) return 0;
        return Math.round(
            (currentIndex / (realRoute.length - 1)) * 100
        );
    }, [currentIndex, realRoute.length]);

    const currentPosition =
        realRoute[currentIndex] || [19.076, 72.8777];

    /* ---------------- UI ---------------- */

    return (
        <div className="h-screen w-full bg-gray-100 p-4">
            <div className="h-full w-full flex gap-4">

                {/* SIDEBAR */}
                <div className="w-1/3 bg-white rounded-2xl shadow-xl border p-6 overflow-y-auto">

                    <h2 className="text-lg font-semibold mb-6">
                        My Trips
                    </h2>

                    {trips.map((trip) => (
                        <div
                            key={trip.id}
                            onClick={() => {
                                setSelectedTrip(trip);
                                setPlaying(false);
                            }}
                            className={`cursor-pointer rounded-xl p-4 mb-4 transition-all ${selectedTrip?.id === trip.id
                                    ? "ring-2 ring-black shadow-md"
                                    : "hover:shadow-md"
                                }`}
                        >
                            <h3 className="font-semibold">
                                {trip.title}
                            </h3>
                            <p className="text-sm text-gray-500">
                                {trip.date}
                            </p>
                        </div>
                    ))}

                    {/* PLAY BUTTON */}
                    <button
                        onClick={togglePlayback}
                        className="w-full bg-black text-white py-3 rounded-xl font-medium flex items-center justify-center gap-2"
                    >
                        {playing ? <Pause size={18} /> : <Play size={18} />}
                        {playing ? "Pause Route" : "Play Route"}
                    </button>

                    {/* -------- PATH DETAILS -------- */}
                    {selectedTrip && (
                        <div className="mt-6 bg-gray-50 rounded-xl p-4 space-y-4 border">

                            <div className="text-sm space-y-2">
                                <div>
                                    Distance: {selectedTrip.distanceKm} km
                                </div>
                                <div>
                                    Stops: {selectedTrip.places.length}
                                </div>
                                <div>
                                    Progress: {progress}%
                                </div>
                            </div>

                            {/* Progress Bar */}
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                    className="bg-black h-2 rounded-full transition-all"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>

                            {/* Stops Timeline */}
                            <div>
                                <h4 className="text-sm font-semibold mb-3">
                                    Route Stops
                                </h4>

                                <div className="space-y-3">
                                    {selectedTrip.places.map(
                                        (place, index) => {
                                            const stopProgress =
                                                Math.round(
                                                    (index /
                                                        (selectedTrip
                                                            .places
                                                            .length -
                                                            1)) *
                                                    (realRoute.length -
                                                        1)
                                                );

                                            const isActive =
                                                currentIndex >=
                                                stopProgress;

                                            return (
                                                <div
                                                    key={place.id}
                                                    className="flex items-start gap-3"
                                                >
                                                    <div
                                                        className={`w-3 h-3 mt-1 rounded-full ${isActive
                                                                ? "bg-black"
                                                                : "bg-gray-300"
                                                            }`}
                                                    />

                                                    <div>
                                                        <div
                                                            className={`text-sm font-medium ${isActive
                                                                    ? "text-black"
                                                                    : "text-gray-500"
                                                                }`}
                                                        >
                                                            {place.name}
                                                        </div>
                                                        <div className="text-xs text-gray-400">
                                                            {place.lat.toFixed(
                                                                3
                                                            )}
                                                            ,{" "}
                                                            {place.lng.toFixed(
                                                                3
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        }
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* MAP */}
                <div className="w-2/3 h-full rounded-2xl overflow-hidden shadow-xl border">
                    <MapContainer
                        center={[19.076, 72.8777]}
                        zoom={13}
                        style={{ height: "100%", width: "100%" }}
                    >
                        <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />

                        {realRoute.length > 0 && (
                            <>
                                <Polyline
                                    positions={realRoute}
                                    pathOptions={{
                                        color: "#2563eb",
                                        weight: 6,
                                    }}
                                />
                                <Marker position={currentPosition} />
                                <FocusMap position={currentPosition} />
                            </>
                        )}
                    </MapContainer>
                </div>
            </div>
        </div>
    );
};

export default MyTrips;
