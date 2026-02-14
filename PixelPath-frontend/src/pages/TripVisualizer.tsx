import { useState, useEffect } from "react";
import Map2D from "@/components/2dMap";
import Map3D from "@/components/3dMap";
import SearchPanel from "@/components/SearchPanel";

type RoutePoint = {
    lat: number;
    lng: number;
    name: string;
};

const TripVisualizer = () => {
    const [mapMode, setMapMode] = useState<"2d" | "3d">("2d");
    const [routePoints, setRoutePoints] = useState<RoutePoint[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [currentPosition, setCurrentPosition] =
        useState<[number, number] | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);

    /* -------- ADD LOCATION FROM SEARCH -------- */
    const addLocationFromSearch = (
        lat: number,
        lng: number,
        name: string
    ) => {
        setRoutePoints((prev) => [...prev, { lat, lng, name }]);
    };

    /* -------- MAP CLICK -------- */
    const handleMapClick = (lat: number, lng: number) => {
        setRoutePoints((prev) => [
            ...prev,
            {
                lat,
                lng,
                name: `Custom Location ${prev.length + 1}`
            }
        ]);
    };

    /* -------- PLAY / PAUSE ANIMATION -------- */
    useEffect(() => {
        if (!isPlaying || routePoints.length === 0) return;

        const interval = setInterval(() => {
            setCurrentIndex((prev) => {
                const next = prev + 1;

                if (next >= routePoints.length) {
                    clearInterval(interval);
                    setIsPlaying(false);
                    return prev;
                }

                setCurrentPosition([
                    routePoints[next].lat,
                    routePoints[next].lng
                ]);

                return next;
            });
        }, 800);

        return () => clearInterval(interval);
    }, [isPlaying, routePoints]);

    return (
        <div className="h-screen w-full relative bg-[#f3f4f6] overflow-hidden">

            {/* -------- FLOATING SIDEBAR -------- */}
            <div className="absolute top-6 left-6 w-[280px] h-[calc(100%-3rem)] 
                            bg-white/80 backdrop-blur-xl 
                            rounded-2xl shadow-xl 
                            flex flex-col z-[1000]">

                {/* HEADER */}
                <div className="px-5 pt-5 pb-3">
                    <h2 className="text-base font-semibold tracking-tight">
                        Route Planner
                    </h2>
                    <p className="text-[11px] text-gray-400 mt-1">
                        Search or click map to build route
                    </p>
                </div>

                {/* SEARCH */}
                <div className="px-4 pb-3">
                    <SearchPanel
                        onSelectLocation={addLocationFromSearch}
                    />
                </div>

                {/* TIMELINE */}
                <div className="flex-1 overflow-y-auto px-4 pb-4">
                    {routePoints.map((point, i) => (
                        <div
                            key={i}
                            onClick={() => {
                                setCurrentIndex(i);
                                setCurrentPosition([
                                    point.lat,
                                    point.lng
                                ]);
                            }}
                            className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer mb-1 transition-all
                                ${i === currentIndex
                                    ? "bg-black text-white"
                                    : "hover:bg-gray-100 text-gray-700"
                                }`}
                        >
                            <div
                                className={`w-2 h-2 rounded-full 
                                    ${i === currentIndex
                                        ? "bg-white"
                                        : "bg-gray-400"
                                    }`}
                            />

                            <div className="flex-1 overflow-hidden">
                                <div className="text-sm font-medium truncate">
                                    {point.name}
                                </div>
                                <div className="text-[11px] opacity-70 truncate">
                                    {point.lat.toFixed(4)}, {point.lng.toFixed(4)}
                                </div>
                            </div>
                        </div>
                    ))}

                    {routePoints.length === 0 && (
                        <p className="text-xs text-gray-400 mt-4">
                            No locations added yet.
                        </p>
                    )}
                </div>

                {/* PLAY / PAUSE */}
                <div className="px-4 pb-2">
                    <button
                        onClick={() => {
                            if (!isPlaying) {
                                if (currentIndex >= routePoints.length - 1) {
                                    setCurrentIndex(0);
                                    if (routePoints[0]) {
                                        setCurrentPosition([
                                            routePoints[0].lat,
                                            routePoints[0].lng
                                        ]);
                                    }
                                }
                            }
                            setIsPlaying((prev) => !prev);
                        }}
                        disabled={routePoints.length === 0}
                        className={`w-full py-2 text-sm rounded-lg transition
                            ${routePoints.length === 0
                                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                : isPlaying
                                    ? "bg-gray-800 text-white"
                                    : "bg-black text-white hover:opacity-90"
                            }`}
                    >
                        {isPlaying ? "Pause" : "Play"}
                    </button>
                </div>

                {/* CLEAR BUTTON */}
                <div className="p-4 pt-0">
                    <button
                        onClick={() => {
                            setRoutePoints([]);
                            setCurrentPosition(null);
                            setCurrentIndex(0);
                            setIsPlaying(false);
                        }}
                        className="w-full py-2 text-sm bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                    >
                        Clear Route
                    </button>
                </div>
            </div>

            {/* -------- MAP AREA -------- */}
            <div className="h-full w-full">
                {/* MAP MODE SWITCH */}
                <div className="absolute top-6 right-6 z-[1000]">
                    <button
                        onClick={() =>
                            setMapMode((prev) =>
                                prev === "2d" ? "3d" : "2d"
                            )
                        }
                        className="px-4 py-2 bg-black text-white rounded-xl text-sm shadow-lg"
                    >
                        Switch to {mapMode === "2d" ? "3D" : "2D"}
                    </button>
                </div>

                {mapMode === "2d" ? (
                    <Map2D
                        routeCoords={routePoints.map((p) => [p.lat, p.lng])}
                        activePosition={currentPosition}
                        onMapClick={handleMapClick}
                    />
                ) : (
                    <Map3D
                        routeCoords={routePoints.map((p) => [p.lat, p.lng])}
                        center={currentPosition}
                        activePosition={currentPosition}
                        onMapClick={handleMapClick}
                    />
                )}
            </div>
        </div>
    );
};

export default TripVisualizer;
