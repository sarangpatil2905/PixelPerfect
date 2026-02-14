import { useEffect, useRef } from "react";
import "./style.css";

export default function Hero() {
    const cuboidsRef = useRef<HTMLDivElement[]>([]);
    const scenesRef = useRef<HTMLDivElement[]>([]);
    const quadrantMap = ["top-left", "top-right", "bottom-left", "bottom-right"];

    const animateIndices = [0, 1, 2];

    const setCuboidRef = (el: HTMLDivElement | null, index: number) => {
        if (el) cuboidsRef.current[index] = el;
    };

    const setSceneRef = (el: HTMLDivElement | null, index: number) => {
        if (el) scenesRef.current[index] = el;
    };

    useEffect(() => {
        let isTabActive = true;
        let animationRunning = false;

        document.addEventListener("visibilitychange", () => {
            isTabActive = !document.hidden;
            if (isTabActive && !animationRunning) {
                animateCuboidsSequentially(0);
            }
        });

        const cuboids = cuboidsRef.current;
        const scenes = scenesRef.current;

        const flipped = [0, 0, 0, 0];
        let angles = [140, 50, 320, 90];

        function animateCuboidsSequentially(step = 0) {
            if (!isTabActive) {
                animationRunning = false;
                return;
            }

            animationRunning = true;

            if (step >= animateIndices.length) {
                setTimeout(() => animateCuboidsSequentially(0), 500);
                return;
            }

            const index = animateIndices[step];
            const cuboid = cuboids[index];
            const scene = scenes[index];

            if (!cuboid || !scene) return;

            cuboid.style.transform = `translateY(-90px) rotateX(-50deg) rotateY(${angles[index]}deg)`;

            setTimeout(() => {
                scene.style.zIndex = "3";

                angles[index] += 90;
                flipped[index] = (flipped[index] + 1) % 4;

                const front = cuboid.querySelector('.front') as HTMLElement;
                const back = cuboid.querySelector('.back') as HTMLElement;
                const left = cuboid.querySelector('.left') as HTMLElement;
                const right = cuboid.querySelector('.right') as HTMLElement;

                [front, back, left, right].forEach(face => face.classList.remove("flipped"));

                let deg = ((angles[index] % 360) + 360) % 360;

                if ((deg >= 0 && deg < 45) || (deg >= 315 && deg < 360)) {
                    front.classList.add("flipped");
                    left.classList.add("flipped");
                } else if (deg >= 45 && deg < 135) {
                    left.classList.add("flipped");
                    back.classList.add("flipped");
                } else if (deg >= 135 && deg < 225) {
                    back.classList.add("flipped");
                    right.classList.add("flipped");
                } else if (deg >= 225 && deg < 315) {
                    right.classList.add("flipped");
                    front.classList.add("flipped");
                }

                cuboid.style.transform = `translateY(-90px) rotateX(-50deg) rotateY(${angles[index]}deg)`;

                setTimeout(() => {
                    scene.style.zIndex = "2";
                    cuboid.style.transform = `translateY(0px) rotateX(-50deg) rotateY(${angles[index]}deg)`;

                    setTimeout(() => {
                        animateCuboidsSequentially(step + 1);
                    }, 400);
                }, 700);
            }, 700);
        }

        animateCuboidsSequentially();
    }, []);

    return (
        <div className="w-full min-h-screen flex  relative bg-[#FFD2FE] px-10 z-0 -top-40">


            {/* LEFT TEXT SECTION */}
            <div className="flex flex-col gap-6 max-w-lg z-100 ml-20 mt-60">
                <h1 className="text-5xl font-semibold tracking-tight leading-tight text-gray-900">
                    Inventory that Works <br />The Way You Do.
                </h1>

                <p className="text-lg text-gray-600 leading-relaxed">
                    StockMaster helps you track receipts, deliveries, transfers and ledger updates —
                    all in one clean and minimal interface.
                </p>

                <ul className="text-gray-700 text-[1rem] space-y-2">
                    <li>• Real-time warehouse syncing</li>
                    <li>• Automatic stock ledger entries</li>
                    <li>• Smart delivery + receipt workflows</li>
                </ul>

                <div className="flex gap-4 mt-4">
                    <button className="px-6 py-3 rounded-md bg-black text-white shadow-sm hover:bg-gray-900 transition">
                        Get Started
                    </button>
                    <button className="px-6 py-3 rounded-md border border-gray-300 hover:bg-gray-100 transition">
                        Learn More
                    </button>
                </div>
            </div>

            {/* RIGHT ANIMATION SECTION */}
            <div className="absolute top-0 left-40 mt-20 scale-120  pointer-events-none">
                <div className="main">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                        <div className={`dumy${num} dumy`} key={num}>
                            <div className="cuboid">
                                <div className="face front"></div>
                                <div className="face back"></div>
                                <div className="face right"></div>
                                <div className="face left"></div>
                                <div className="face top"></div>
                                <div className="face bottom"></div>
                            </div>
                        </div>
                    ))}

                    {[1, 2, 3, 4].map((num, idx) => (
                        <div key={num} className={`scene${num}`} ref={(el) => setSceneRef(el, idx)}>
                            <div
                                className="cuboid"
                                ref={(el) => setCuboidRef(el, idx)}
                                id={`cuboid${num}`}
                            >
                                <div className="face front"></div>
                                <div className="face back"></div>
                                <div className="face right"></div>
                                <div className="face left"></div>
                                <div className="face top overflow-hidden relative">
                                    <div className={`circle-quad ${quadrantMap[idx]}`} />
                                    <div className={`inner-circle-quad ${quadrantMap[idx]}`} />
                                </div>
                                <div className="face bottom"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
}
