import { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import type { Feature, LineString } from "geojson";
import "maplibre-gl/dist/maplibre-gl.css";

type Props = {
    routeCoords: [number, number][]; // [lat, lng]
    center: [number, number] | null;
    activePosition: [number, number] | null;
    onMapClick: (lat: number, lng: number) => void;
};

const Map3D = ({
    routeCoords,
    center,
    activePosition,
    onMapClick
}: Props) => {

    const mapContainer = useRef<HTMLDivElement | null>(null);
    const mapRef = useRef<maplibregl.Map | null>(null);
    const markerRef = useRef<maplibregl.Marker | null>(null);
    const isLoadedRef = useRef(false);

    const [realPath, setRealPath] = useState<[number, number][]>([]);

    const MAPTILER_KEY = "U8efYCwQsX5Vp4ulQpjR";

    /* ==============================
       INIT MAP
    =============================== */
    useEffect(() => {
        if (!mapContainer.current) return;

        const map = new maplibregl.Map({
            container: mapContainer.current,
            style: `https://api.maptiler.com/maps/dataviz/style.json?key=${MAPTILER_KEY}`,
            center: center ? [center[1], center[0]] : [72.88, 19.1],
            zoom: 15,
            pitch: 75,
            bearing: -25
        });

        mapRef.current = map;

        map.on("load", () => {
            isLoadedRef.current = true;

            /* TERRAIN */
            map.addSource("terrain", {
                type: "raster-dem",
                url: `https://api.maptiler.com/tiles/terrain-rgb/tiles.json?key=${MAPTILER_KEY}`,
                tileSize: 256,
                maxzoom: 14
            });

            map.setTerrain({
                source: "terrain",
                exaggeration: 2
            });

            /* BUILDINGS */
            map.addLayer({
                id: "3d-buildings",
                source: "openmaptiles",
                "source-layer": "building",
                type: "fill-extrusion",
                minzoom: 14,
                paint: {
                    "fill-extrusion-color": "#e8e8ff",
                    "fill-extrusion-height": [
                        "interpolate",
                        ["linear"],
                        ["zoom"],
                        14, 0,
                        15, ["get", "height"]
                    ],
                    "fill-extrusion-base": ["get", "min_height"],
                    "fill-extrusion-opacity": 0.9
                }
            });

            /* MAP CLICK */
            map.on("click", (e) => {
                onMapClick(e.lngLat.lat, e.lngLat.lng);
            });
        });

        return () => map.remove();
    }, []);

    /* ==============================
       FETCH REAL ROAD ROUTE (OSRM)
    =============================== */
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

                if (!res.ok) throw new Error("Routing failed");

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

    /* ==============================
       DRAW ROUTE WITH ELEVATION
    =============================== */
    useEffect(() => {
        if (!mapRef.current || !isLoadedRef.current) return;
        if (realPath.length === 0) return;

        const map = mapRef.current;

        const elevatedCoords = realPath.map((c) => {
            const lngLat: [number, number] = [c[1], c[0]];
            const elevation =
                (map.queryTerrainElevation(lngLat) || 0) + 3;
            return [lngLat[0], lngLat[1], elevation];
        });

        const routeFeature: Feature<LineString> = {
            type: "Feature",
            properties: {},
            geometry: {
                type: "LineString",
                coordinates: elevatedCoords
            }
        };

        if (!map.getSource("route")) {
            map.addSource("route", {
                type: "geojson",
                data: routeFeature
            });

            map.addLayer({
                id: "route-line",
                type: "line",
                source: "route",
                paint: {
                    "line-color": "#00f5ff",
                    "line-width": 6
                }
            });

        } else {
            const source = map.getSource("route") as maplibregl.GeoJSONSource;
            source.setData(routeFeature);
        }

    }, [realPath]);

    /* ==============================
       CAMERA FOLLOW + MARKER
    =============================== */
    useEffect(() => {
        if (!mapRef.current || !activePosition) return;

        const map = mapRef.current;

        const lngLat: [number, number] = [
            activePosition[1],
            activePosition[0]
        ];

        map.flyTo({
            center: lngLat,
            zoom: 16,
            pitch: 75,
            bearing: -25,
            duration: 1200
        });

        if (!markerRef.current) {
            markerRef.current = new maplibregl.Marker({ color: "#00f5ff" })
                .setLngLat(lngLat)
                .addTo(map);
        } else {
            markerRef.current.setLngLat(lngLat);
        }

    }, [activePosition]);

    return <div ref={mapContainer} className="h-full w-full" />;
};

export default Map3D;
