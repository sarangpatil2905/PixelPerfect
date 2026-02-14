import { useState } from "react";

type Props = {
    onSelectLocation: (lat: number, lng: number, name: string) => void;
};

const MAPTILER_KEY = "U8efYCwQsX5Vp4ulQpjR";

const SearchPanel = ({ onSelectLocation }: Props) => {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const handleSearch = async () => {
        if (!query.trim()) return;

        setLoading(true);

        try {
            const res = await fetch(
                `https://api.maptiler.com/geocoding/${encodeURIComponent(
                    query
                )}.json?key=${MAPTILER_KEY}`
            );

            const data = await res.json();
            setResults(data.features || []);
        } catch (err) {
            console.error("Search error:", err);
        }

        setLoading(false);
    };

    return (
        <div className="bg-white/70 backdrop-blur-md p-2   w-full">

            {/* INPUT */}
            {/* INPUT */}
            <div className="flex items-center gap-2 mb-2">
                <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    placeholder="Search location"
                    className="flex-1 
                   bg-transparent 
                   border-b border-gray-300 
                   text-sm
                   outline-none 
                   placeholder:text-gray-400
                   transition-colors"
                />

                <button
                    onClick={handleSearch}
                    className="text-xs font-medium text-black hover:opacity-60 transition"
                >
                    Go
                </button>
            </div>

            {/* RESULTS */}
            <div className="space-y-2 max-h-[180px] overflow-y-auto">
                {loading && (
                    <p className="text-xs text-gray-500">Searching...</p>
                )}

                {results.map((place, i) => (
                    <div
                        key={i}
                        onClick={() => {
                            const [lng, lat] = place.center;
                            onSelectLocation(
                                lat,
                                lng,
                                place.text
                            );
                            setResults([]);
                            setQuery("");
                        }}
                        className="p-2 rounded-xl cursor-pointer hover:bg-white/60 transition text-sm"
                    >
                        <div className="font-medium">
                            {place.text}
                        </div>
                        <div className="text-xs text-gray-600">
                            {place.place_name}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SearchPanel;
