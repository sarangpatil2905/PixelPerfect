import { useEffect, useState } from "react";
import {
    MapContainer,
    TileLayer,
    Polyline,
    Marker,
    useMap
} from "react-leaflet";
import type { LatLngExpression } from "leaflet";
import axios from "axios";
import debounce from "lodash.debounce";

/* ---------------- MAP FOCUS ---------------- */

const FocusMap = ({ position }: { position: LatLngExpression }) => {
    const map = useMap();

    useEffect(() => {
        map.flyTo(position, 15, { duration: 0.8 });
    }, [position]);

    return null;
};

/* ---------------- MAIN COMPONENT ---------------- */

const TripVisualizer = () => {
    const [startQuery, setStartQuery] = useState("");
    const [endQuery, setEndQuery] = useState("");
    const [activeInput, setActiveInput] =
        useState<"start" | "end" | null>(null);

    const [startCoord, setStartCoord] = useState<any>(null);
    const [endCoord, setEndCoord] = useState<any>(null);

    const [routeCoords, setRouteCoords] = useState<[number, number][]>([]);
    const [steps, setSteps] = useState<any[]>([]);
    const [routeInfo, setRouteInfo] = useState<any>(null);

    const [mode, setMode] =
        useState<"driving" | "walking" | "cycling">("driving");

    const [selectedStepIndex, setSelectedStepIndex] = useState(0);

    const [suggestions, setSuggestions] = useState<any[]>([]);

    /* ---------------- SEARCH ---------------- */

    const searchLocation = async (query: string) => {
        const res = await axios.get(
            "https://nominatim.openstreetmap.org/search",
            { params: { q: query, format: "json", limit: 6 } }
        );
        setSuggestions(res.data);
    };

    const debouncedSearch = debounce(searchLocation, 400);

    useEffect(() => {
        const query = activeInput === "start" ? startQuery : endQuery;

        if (query.length > 2 && activeInput !== null) {
            debouncedSearch(query);
        } else {
            setSuggestions([]);
        }
    }, [startQuery, endQuery, activeInput]);

    /* ---------------- ROUTE ---------------- */

    const getRoute = async () => {
        if (!startCoord || !endCoord) return;

        const res = await axios.get(
            `https://router.project-osrm.org/route/v1/${mode}/${startCoord.lon},${startCoord.lat};${endCoord.lon},${endCoord.lat}`,
            {
                params: {
                    overview: "full",
                    geometries: "geojson",
                    steps: true
                }
            }
        );

        const route = res.data.routes[0];

        const coords = route.geometry.coordinates.map(
            (c: number[]) => [c[1], c[0]]
        );

        const formattedSteps = route.legs[0].steps.map((step: any) => ({
            instruction:
                step.maneuver.type +
                (step.name ? ` onto ${step.name}` : ""),
            distance: (step.distance / 1000).toFixed(2),
            duration: Math.ceil(step.duration / 60),
            location: [step.maneuver.location[1], step.maneuver.location[0]]
        }));

        setRouteCoords(coords);
        setSteps(formattedSteps);
        setRouteInfo(route);
        setSelectedStepIndex(0);
    };

    useEffect(() => {
        getRoute();
    }, [startCoord, endCoord, mode]);

    const currentPosition: LatLngExpression =
        steps.length > 0
            ? steps[selectedStepIndex].location
            : startCoord
                ? [startCoord.lat, startCoord.lon]
                : [19.076, 72.8777];

    const now = new Date();
    const totalMinutes = routeInfo
        ? Math.ceil(routeInfo.duration / 60)
        : 0;

    const arrivalTime = new Date(
        now.getTime() + totalMinutes * 60000
    );

    const formatTime = (date: Date) =>
        date.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit"
        });

    /* ---------------- UI ---------------- */

    return (
        <div className="h-screen w-full flex bg-slate-950">

            {/* MAP */}
            <div className="flex-1 relative">
                <MapContainer
                    center={currentPosition}
                    zoom={14}
                    style={{ height: "100%", width: "100%" }}
                >
                    <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                    />

                    {routeCoords.length > 0 && (
                        <Polyline
                            positions={routeCoords}
                            pathOptions={{ color: "#3b82f6", weight: 6 }}
                        />
                    )}

                    <Marker position={currentPosition} />
                    <FocusMap position={currentPosition} />
                </MapContainer>
            </div>

            {/* SIDE PANEL */}
            <div className="w-[420px] h-full bg-slate-900 text-white p-6 overflow-y-auto border-l border-slate-800">

                {/* HEADER */}
                <div className="mb-6 border-b border-slate-800 pb-5">
                    <div className="text-xl font-semibold">
                        PixelPath
                    </div>
                </div>

                {/* SEARCH */}
                <div className="space-y-4">

                    <input
                        value={startQuery}
                        onFocus={() => setActiveInput("start")}
                        onChange={(e) => setStartQuery(e.target.value)}
                        placeholder="From"
                        className="w-full p-3 bg-slate-800 rounded-xl text-sm"
                    />

                    <input
                        value={endQuery}
                        onFocus={() => setActiveInput("end")}
                        onChange={(e) => setEndQuery(e.target.value)}
                        placeholder="To"
                        className="w-full p-3 bg-slate-800 rounded-xl text-sm"
                    />

                    {suggestions.length > 0 && (
                        <div className="bg-slate-800 rounded-2xl shadow-xl overflow-hidden">
                            {suggestions.map((s, i) => {
                                const parts = s.display_name.split(",");
                                const title = parts[0];
                                const subtitle = parts.slice(1, 3).join(", ");

                                return (
                                    <div
                                        key={i}
                                        onClick={() => {
                                            const coord = {
                                                lat: parseFloat(s.lat),
                                                lon: parseFloat(s.lon)
                                            };

                                            if (activeInput === "start") {
                                                setStartCoord(coord);
                                                setStartQuery(title);
                                            } else {
                                                setEndCoord(coord);
                                                setEndQuery(title);
                                            }

                                            setSuggestions([]);
                                            setActiveInput(null);
                                        }}
                                        className="p-4 hover:bg-slate-700 cursor-pointer border-b border-slate-700 last:border-none"
                                    >
                                        <div className="text-sm font-medium">
                                            {title}
                                        </div>
                                        <div className="text-xs text-gray-400 mt-1">
                                            {subtitle}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* MODE */}
                    <div className="flex gap-2">
                        {["driving", "walking", "cycling"].map((m) => (
                            <button
                                key={m}
                                onClick={() => setMode(m as any)}
                                className={`flex-1 py-2 rounded-xl text-xs font-medium ${mode === m
                                    ? "bg-blue-600"
                                    : "bg-slate-800 hover:bg-slate-700"
                                    }`}
                            >
                                {m.toUpperCase()}
                            </button>
                        ))}
                    </div>
                </div>

                {/* ROUTE OVERVIEW */}
                {routeInfo && (
                    <div className="mt-8">

                        <div className="text-xs text-gray-400 uppercase tracking-wider mb-2">
                            Route Overview
                        </div>

                        <div className="text-lg font-semibold mb-4">
                            {startQuery} → {endQuery}
                        </div>

                        <div className="bg-slate-800 rounded-2xl p-4 space-y-2 text-sm">
                            <div>
                                <span className="text-gray-400">Distance:</span>{" "}
                                {(routeInfo.distance / 1000).toFixed(2)} km
                            </div>
                            <div>
                                <span className="text-gray-400">Duration:</span>{" "}
                                {totalMinutes} min
                            </div>
                            <div>
                                <span className="text-gray-400">Depart:</span>{" "}
                                {formatTime(now)}
                            </div>
                            <div>
                                <span className="text-gray-400">Arrive:</span>{" "}
                                {formatTime(arrivalTime)}
                            </div>
                        </div>

                        {/* STEPS */}
                        <div className="mt-6 space-y-4">
                            {steps.map((step, i) => (
                                <div
                                    key={i}
                                    onClick={() => setSelectedStepIndex(i)}
                                    className={`p-4 rounded-2xl cursor-pointer transition ${i === selectedStepIndex
                                        ? "bg-blue-600"
                                        : "bg-slate-800 hover:bg-slate-700"
                                        }`}
                                >
                                    <div className="text-xs text-gray-300 mb-2 uppercase tracking-wide">
                                        Step {i + 1}
                                    </div>
                                    <div className="text-sm font-medium">
                                        {step.instruction}
                                    </div>
                                    <div className="text-xs text-gray-400 mt-2">
                                        {step.distance} km • {step.duration} min
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default TripVisualizer;