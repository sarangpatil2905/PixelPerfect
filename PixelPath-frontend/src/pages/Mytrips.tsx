import { useState, useEffect, useRef } from "react";
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

/* ---------------- SAMPLE TRIPS ---------------- */

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
        map.flyTo(position, 13, { duration: 0.8 });
    }, [position]);

    return null;
};

/* ---------------- MAIN COMPONENT ---------------- */

const MyTrips = () => {
    const [selectedTrip, setSelectedTrip] = useState<Trip | null>(trips[0]);

    const [mode, setMode] = useState<"driving" | "walking" | "cycling">(
        "driving"
    );

    const [currentIndex, setCurrentIndex] = useState(0);
    const [playing, setPlaying] = useState(false);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const routePath: [number, number][] =
        selectedTrip?.places.map((p) => [p.lat, p.lng]) || [];

    const timelinePoints: LatLngExpression[] = routePath;
    const currentPosition =
        timelinePoints[currentIndex] || [19.076, 72.8777];

    /* ---- ROUTE INFO ---- */

    const distanceKm = selectedTrip?.distanceKm || 0;

    const speedMap = {
        driving: 50,
        cycling: 18,
        walking: 5,
    };

    const speed = speedMap[mode];
    const durationMinutes = Math.ceil((distanceKm / speed) * 60);

    const now = new Date();
    const arrivalTime = new Date(
        now.getTime() + durationMinutes * 60000
    );

    const formatTime = (date: Date) =>
        date.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        });

    /* ---------------- PLAYBACK ---------------- */

    useEffect(() => {
        if (playing && timelinePoints.length > 0) {
            intervalRef.current = setInterval(() => {
                setCurrentIndex((prev) => {
                    if (prev < timelinePoints.length - 1) {
                        return prev + 1;
                    } else {
                        setPlaying(false);
                        return prev;
                    }
                });
            }, 1200);
        }

        return () => {
            if (intervalRef.current)
                clearInterval(intervalRef.current);
        };
    }, [playing, timelinePoints.length]);

    const togglePlayback = () => {
        if (currentIndex === timelinePoints.length - 1) {
            setCurrentIndex(0);
        }
        setPlaying((prev) => !prev);
    };

    const steps =
        selectedTrip?.places.map((p) => p.name) || [];

    return (
        <div className="h-screen w-full bg-gray-100 p-4">
            <div className="h-full w-full flex gap-4">

                {/* FLOATING SIDEBAR */}
                <div className="w-1/3 bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200 p-6 overflow-y-auto">

                    <h2 className="text-lg font-semibold mb-6">
                        My Trips
                    </h2>

                    {trips.map((trip) => (
                        <div
                            key={trip.id}
                            onClick={() => {
                                setSelectedTrip(trip);
                                setCurrentIndex(0);
                                setPlaying(false);
                            }}
                            className={`cursor-pointer bg-white rounded-xl p-4 mb-4 transition-all ${selectedTrip?.id === trip.id
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

                    {selectedTrip && (
                        <div className="mt-6 bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">

                            {/* HEADER */}
                            <div className="px-6 py-3 border-b bg-gray-50 flex justify-between items-center">
                                <div>
                                    <h3 className="text-lg font-semibold">
                                        {selectedTrip.title}
                                    </h3>
                                    <p className="text-sm text-gray-500">
                                        Interactive Route Timeline
                                    </p>
                                </div>

                                <button
                                    onClick={togglePlayback}
                                    className="p-2 rounded-full hover:bg-gray-200 transition"
                                >
                                    {playing ? (
                                        <Pause className="w-5 h-5" />
                                    ) : (
                                        <Play className="w-5 h-5" />
                                    )}
                                </button>
                            </div>

                            {/* CONTENT */}
                            <div className="p-4 space-y-4">

                                {/* MODE SWITCH */}
                                <div className="flex gap-2 text-xs">
                                    {["driving", "walking", "cycling"].map((m) => (
                                        <button
                                            key={m}
                                            onClick={() => setMode(m as any)}
                                            className={`flex-1 py-2 rounded-lg font-medium transition ${mode === m
                                                ? "bg-black text-white"
                                                : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                                                }`}
                                        >
                                            {m.toUpperCase()}
                                        </button>
                                    ))}
                                </div>

                                {/* SUMMARY */}
                                <div className="bg-gray-50 rounded-xl p-3 border text-sm space-y-1.5">
                                    <div className="flex justify-between">
                                        <span>Distance</span>
                                        <span>{distanceKm} km</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Duration</span>
                                        <span>{durationMinutes} min</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Avg Speed</span>
                                        <span>{speed} km/h</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Arrival</span>
                                        <span>{formatTime(arrivalTime)}</span>
                                    </div>
                                </div>

                                {/* TIMELINE */}
                                <div>
                                    <h3 className="text-sm font-semibold mb-4">
                                        Timeline
                                    </h3>

                                    <div className="pl-8">
                                        {steps.map((step, i) => {
                                            const isStart = i === 0;
                                            const isEnd =
                                                i === steps.length - 1;
                                            const isActive =
                                                i === currentIndex;

                                            return (
                                                <div
                                                    key={i}
                                                    onClick={() => {
                                                        setCurrentIndex(i);
                                                        setPlaying(false);
                                                    }}
                                                    className="relative mb-8 last:mb-0 cursor-pointer"
                                                >
                                                    <div className="absolute left-0 top-1 flex flex-col items-center">
                                                        <div
                                                            className={`w-4 h-4 rounded-full shadow-md ${isStart
                                                                ? "bg-green-600"
                                                                : isEnd
                                                                    ? "bg-red-600"
                                                                    : isActive
                                                                        ? "bg-blue-600"
                                                                        : "bg-black"
                                                                }`}
                                                        />
                                                        {i !==
                                                            steps.length -
                                                            1 && (
                                                                <div className="w-[2px] h-8 bg-gray-300 mt-1"></div>
                                                            )}
                                                    </div>

                                                    <div
                                                        className={`ml-8 text-sm ${isActive ||
                                                            isEnd
                                                            ? "text-blue-600 font-semibold"
                                                            : "text-gray-700"
                                                            }`}
                                                    >
                                                        {step}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* FLOATING MAP */}
                <div className="w-2/3 h-full rounded-2xl overflow-hidden shadow-xl border border-gray-200">
                    <MapContainer
                        center={[19.076, 72.8777]}
                        zoom={5}
                        style={{ height: "100%", width: "100%" }}
                    >
                        <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />

                        {!selectedTrip && (
                            <>
                                <Marker position={[19.076, 72.8777]} />
                                <Marker position={[15.2993, 74.124]} />
                            </>
                        )}

                        {selectedTrip && (
                            <>
                                <Polyline
                                    positions={routePath}
                                    pathOptions={{
                                        color: "#2563eb",
                                        weight: 6,
                                    }}
                                />

                                <Marker position={currentPosition} />

                                <FocusMap
                                    position={currentPosition}
                                />
                            </>
                        )}
                    </MapContainer>
                </div>
            </div>
        </div>
    );
};

export default MyTrips;
