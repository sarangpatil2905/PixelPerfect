import Hero from "@/components/Hero";
import { useNavigate } from "react-router-dom";

export default function Landing() {
    const navigate = useNavigate();
    return (
        <div className="min-h-screen w-full  text-gray-900">

            {/* NAVIGATION BAR */}
            <nav className="w-full bg-white sticky top-0 z-100 p-0 border-b border-gray-100 shadow-xs">
                <div className=" mx-auto flex items-center justify-around p-2">

                    {/* Logo */}
                    <div className="text-[20px] font-semibold tracking-tight flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#6CCFF6]"></span>
                        <span className="w-2.5 h-2.5 rounded-full bg-[#FFD166]"></span>
                        <span className="w-2.5 h-2.5 rounded-full bg-[#06D6A0]"></span>
                        <span className="w-2.5 h-2.5 rounded-full bg-[#EF476F]"></span>
                        <span className="">PixelPath</span>
                    </div>

                    {/* Nav Items */}
                    <div className="flex items-center gap-8 text-[14px] font-medium text-gray-700">

                        <button className="hover:text-black transition">Features</button>
                        <button className="hover:text-black transition">Contacts</button>


                        <button
                            className="hover:text-black transition"
                            onClick={() => navigate("/login")}
                        >
                            Login
                        </button>

                        {/* Primary Button */}
                        <button className="px-5 py-2 bg-black text-white rounded-full shadow hover:bg-[#111] transition">
                            Get Started
                        </button>

                        {/* Menu Capsule */}
                        <button className="px-4 py-2 rounded-full border border-gray-300 hover:bg-gray-100 transition flex items-center gap-2">
                            <span className="w-5 h-0.5 bg-gray-700"></span>
                            <span className="w-5 h-0.5 bg-gray-700"></span>
                        </button>
                    </div>
                </div>
            </nav >

            < section className="w-full h-screen overflow-hidden" >
                <Hero />
            </section >




        </div >
    );
}