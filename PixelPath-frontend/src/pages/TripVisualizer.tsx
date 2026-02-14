import { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Polyline, Marker } from "react-leaflet";
import L from "leaflet";
import { useNavigate } from "react-router-dom";

type Segment = {
    id: number;
    mode: string;
    duration: number;
    color: string;
    path: [number, number][];
};

const routeSegments: Segment[] = [
    {
        id: 1,
        mode: "Walk",
        duration: 10,
        color: "blue",
        path: [
            [19.076, 72.8777],
            [19.078, 72.88],
        ],
    },
    {
        id: 2,
        mode: "Bus",
        duration: 45,
        color: "green",
        path: [
            [19.078, 72.88],
            [19.09, 72.89],
        ],
    },
    {
        id: 3,
        mode: "Train",
        duration: 120,
        color: "red",
        path: [
            [19.09, 72.89],
            [19.12, 72.92],
        ],
    },
];

const TripVisualizer = () => {
    const navigate = useNavigate();

    const [selectedSegment, setSelectedSegment] = useState<Segment | null>(null);
    const [playIndex, setPlayIndex] = useState<number>(0);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [speed, setSpeed] = useState<number>(1);

    const intervalRef = useRef<number | null>(null);


    const fullPath = routeSegments.flatMap((seg) => seg.path);

    useEffect(() => {
        if (isPlaying) {
            intervalRef.current = setInterval(() => {
                setPlayIndex((prev) => {
                    if (prev >= fullPath.length - 1) {
                        setIsPlaying(false);
                        return prev;
                    }
                    return prev + 1;
                });
            }, 1000 / speed);
        }

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [isPlaying, speed]);

    const resetPlayback = () => {
        setIsPlaying(false);
        setPlayIndex(0);
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
                <button
                    onClick={() => navigate("/")}
                    className="px-4 py-2 bg-gray-800 text-white rounded-lg"
                >
                    Back
                </button>

                <h1 className="text-2xl font-bold">
                    Trip Route Visualizer
                </h1>
            </div>

            {/* Main Layout */}
            <div className="flex gap-6">
                {/* Map */}
                <div className="w-2/3 h-[450px] rounded-xl overflow-hidden shadow-lg">
                    <MapContainer
                        center={[19.076, 72.8777]}
                        zoom={12}
                        style={{ height: "100%", width: "100%" }}
                    >
                        <TileLayer
                            attribution="&copy; OpenStreetMap"
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />

                        {routeSegments.map((segment) => (
                            <Polyline
                                key={segment.id}
                                positions={segment.path}
                                pathOptions={{
                                    color:
                                        selectedSegment?.id === segment.id
                                            ? "orange"
                                            : segment.color,
                                    weight: 6,
                                }}
                                eventHandlers={{
                                    click: () => setSelectedSegment(segment),
                                }}
                            />
                        ))}

                        <Marker position={fullPath[playIndex]} />
                    </MapContainer>
                </div>

                {/* Details Panel */}
                <div className="w-1/3 bg-white p-6 rounded-xl shadow-lg">
                    {selectedSegment ? (
                        <>
                            <h2 className="text-xl font-semibold mb-3">
                                Segment Details
                            </h2>
                            <p><strong>Mode:</strong> {selectedSegment.mode}</p>
                            <p><strong>Duration:</strong> {selectedSegment.duration} mins</p>
                            <p><strong>ID:</strong> {selectedSegment.id}</p>
                        </>
                    ) : (
                        <p className="text-gray-500">
                            Click on a route segment to view details.
                        </p>
                    )}
                </div>
            </div>

            {/* Timeline */}
            <div className="flex mt-6 h-12 rounded-lg overflow-hidden shadow">
                {routeSegments.map((segment) => (
                    <div
                        key={segment.id}
                        onClick={() => setSelectedSegment(segment)}
                        style={{ flex: segment.duration }}
                        className={`flex items-center justify-center cursor-pointer text-white font-medium transition ${selectedSegment?.id === segment.id
                            ? "bg-orange-500"
                            : "bg-gray-500"
                            }`}
                    >
                        {segment.mode}
                    </div>
                ))}
            </div>

            {/* Playback Controls */}
            <div className="flex gap-4 mt-6 items-center">
                <button
                    onClick={() => setIsPlaying(true)}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg"
                >
                    Play
                </button>

                <button
                    onClick={() => setIsPlaying(false)}
                    className="px-4 py-2 bg-yellow-500 text-white rounded-lg"
                >
                    Pause
                </button>

                <button
                    onClick={resetPlayback}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg"
                >
                    Reset
                </button>

                <select
                    onChange={(e) => setSpeed(Number(e.target.value))}
                    className="px-3 py-2 border rounded-lg"
                >
                    <option value={1}>1x</option>
                    <option value={2}>2x</option>
                    <option value={5}>5x</option>
                </select>
            </div>
        </div>
    );
};

export default TripVisualizer;
