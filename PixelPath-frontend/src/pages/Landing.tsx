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
                        <button
                            onClick={() => navigate("/login")}
                            className="px-5 py-2 bg-black text-white rounded-full shadow hover:bg-[#111] transition">
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



            < footer className="w-full bg-[#252525] border-t p-8 border-[rgba(255,255,255,0.1)]" >
                <div className="max-w-325 mx-auto px-6  grid grid-cols-4 gap-24 text-sm">

                    {/* Company */}
                    <div>
                        <h4 className="text-[13px] font-semibold text-white uppercase tracking-wide mb-4">
                            Product
                        </h4>
                        <ul className="space-y-2 text-gray-400">
                            <li className="hover:text-white cursor-pointer">Overview</li>
                            <li className="hover:text-white cursor-pointer">Features</li>
                            <li className="hover:text-white cursor-pointer">Pricing</li>
                            <li className="hover:text-white cursor-pointer">Updates</li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="text-[13px] font-semibold text-white uppercase tracking-wide mb-4">
                            Company
                        </h4>
                        <ul className="space-y-2 text-gray-400">
                            <li className="hover:text-white cursor-pointer">About</li>
                            <li className="hover:text-white cursor-pointer">Careers</li>
                            <li className="hover:text-white cursor-pointer">Contact</li>
                        </ul>
                    </div>

                    {/* Shop / Resources */}
                    <div>
                        <h4 className="text-[13px] font-semibold text-white uppercase tracking-wide mb-4">
                            Resources
                        </h4>
                        <ul className="space-y-2 text-gray-400">
                            <li className="hover:text-white cursor-pointer">Documentation</li>
                            <li className="hover:text-white cursor-pointer">API Reference</li>
                            <li className="hover:text-white cursor-pointer">Tutorials</li>
                        </ul>
                    </div>

                    {/* Newsletter Section */}
                    <div>
                        <h4 className="text-[13px] font-semibold text-white uppercase tracking-wide mb-4">
                            Subscribe
                        </h4>

                        <p className="text-gray-400 text-sm mb-4">
                            Subscribe to get updates and release notes.
                        </p>

                        <div className="flex flex-col space-y-3 pb-4">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="w-full bg-[#1e1e1e] border border-[rgba(255,255,255,0.15)] text-white px-4 py-3 rounded-md placeholder-gray-200 focus:outline-none focus:ring-0 "
                            />

                            <button className="bg-white text-black font-medium text-sm py-3 rounded-md hover:opacity-90 transition">
                                Sign Up
                            </button>
                        </div>
                    </div>

                </div>

                {/* Bottom Bar */}
                <div className="border-t border-[rgba(255,255,255,0.1)] pt-4 text-center text-xs text-gray-500">
                    © 2025 StockMaster — Inventory Management System.
                    <span className="ml-2 underline hover:text-white cursor-pointer">Privacy Policy</span> ·
                    <span className="ml-2 underline hover:text-white cursor-pointer">Terms of Service</span>
                </div>
            </footer >
        </div >
    );
}