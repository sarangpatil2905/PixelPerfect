import {
    MapContainer,
    TileLayer,
    Polyline,
    Marker,
    useMapEvents
} from "react-leaflet";
import { useEffect, useState } from "react";
import type { LatLngExpression } from "leaflet";

type Map2DProps = {
    routeCoords?: [number, number][];
    activePosition?: [number, number] | null;
    onMapClick?: (lat: number, lng: number) => void;
};


/* ---- CLICK HANDLER ---- */
const ClickHandler = ({ onMapClick }: { onMapClick?: any }) => {
    useMapEvents({
        click(e) {
            if (onMapClick) {
                onMapClick(e.latlng.lat, e.latlng.lng);
            }
        }
    });
    return null;
};

const Map2D = ({
    routeCoords = [],
    activePosition = null,
    onMapClick
}: Map2DProps) => {

    const [realPath, setRealPath] = useState<[number, number][]>([]);

    /* ---- FETCH REAL ROUTE ---- */
    useEffect(() => {
        if (routeCoords.length < 2) {
            setRealPath([]);
            return;
        }

        const fetchRoute = async () => {
            try {
                const coordinates = routeCoords
                    .map(([lat, lng]) => `${lng},${lat}`)
                    .join(";");

                const res = await fetch(
                    `https://router.project-osrm.org/route/v1/driving/${coordinates}?overview=full&geometries=geojson`
                );

                if (!res.ok) {
                    throw new Error("Routing failed");
                }

                const data = await res.json();

                const geometry =
                    data.routes?.[0]?.geometry?.coordinates;

                if (geometry) {
                    const converted = geometry.map(
                        (coord: [number, number]) => [
                            coord[1], // lat
                            coord[0]  // lng
                        ]
                    );

                    setRealPath(converted);
                }
            } catch (err) {
                console.error("Routing error:", err);
            }
        };

        fetchRoute();
    }, [routeCoords]);


    return (
        <MapContainer
            center={[19.1, 72.88]}
            zoom={12}
            zoomControl={false}
            style={{ height: "100%", width: "100%" }}
        >
            <TileLayer
                url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            />

            <ClickHandler onMapClick={onMapClick} />

            {/* REAL ROUTE LINE */}
            {realPath.length > 0 && (
                <Polyline
                    positions={realPath as LatLngExpression[]}
                    pathOptions={{
                        color: "#2563eb",
                        weight: 6
                    }}
                />
            )}

            {/* ACTIVE MARKER */}
            {activePosition && (
                <Marker position={activePosition} />
            )}
        </MapContainer>
    );
};

export default Map2D;
