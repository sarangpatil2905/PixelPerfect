import { useState, useRef, useEffect } from "react"
import { NavLink } from "react-router-dom"
import { signOut } from "firebase/auth"
import { auth } from "../firebase"
import {
    Clock,
    Route,
    Map,
    LogOut,
    PanelLeftClose,
    PanelLeftOpen
} from "lucide-react"

interface User {
    picture: string
    name?: string
    email?: string
}

export default function MainLayout() {
    const storedUser = localStorage.getItem("user")
    const user: User | null = storedUser ? JSON.parse(storedUser) : null

    const [open, setOpen] = useState(false)
    const [collapsed, setCollapsed] = useState(false)
    const dropdownRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(e.target as Node)
            ) {
                setOpen(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    const logout = async () => {
        await signOut(auth)
        localStorage.removeItem("user")
        window.location.href = "/"
    }

    return (
        <div
            className={`${collapsed ? "w-15 p-2 py-4" : "p-4 w-60"} 
        h-screen bg-white flex flex-col justify-between border-r border-[#E5E7EB]`}
        >
            {/* Top Section */}
            <div>
                <div
                    className={`flex items-center ${collapsed ? "justify-center" : "justify-between"
                        } mb-6 h-8`}
                >
                    {!collapsed && (
                        <div className="flex items-center gap-2">
                            <Map className="w-5 h-5 text-[#7C3AED]" />
                            <h1 className="text-lg font-bold text-[#111827]">
                                PixelPath
                            </h1>
                        </div>
                    )}

                    <button onClick={() => setCollapsed(!collapsed)}>
                        {collapsed ? (
                            <PanelLeftOpen className="w-5 h-5 text-[#4B5563]" />
                        ) : (
                            <PanelLeftClose className="w-5 h-5 text-[#4B5563]" />
                        )}
                    </button>
                </div>

                <nav className="flex flex-col gap-1">
                    {[
                        { to: "/trips", icon: Route, label: "My Trips" },
                        { to: "/visualizer", icon: Map, label: "Route Visualizer" },
                        { to: "/timeline", icon: Clock, label: "Trip Timeline" }
                    ].map(({ to, icon: Icon, label }) => (
                        <NavLink
                            key={to}
                            to={to}
                            className={({ isActive }) =>
                                `flex items-center ${collapsed ? "justify-center" : "gap-3"
                                } px-3 py-2 rounded-lg text-sm font-medium transition ${isActive
                                    ? "bg-[#EDE9FE] text-[#7C3AED]"
                                    : "text-[#4B5563] hover:bg-[#F5F3FF] hover:text-[#7C3AED]"
                                }`
                            }
                        >
                            <Icon className="w-5 h-5" />
                            {!collapsed && <span>{label}</span>}
                        </NavLink>
                    ))}
                </nav>
            </div>

            {/* User Section */}
            {user && (
                <div ref={dropdownRef} className="relative">
                    <div
                        onClick={() => !collapsed && setOpen(prev => !prev)}
                        className={`flex items-center ${collapsed ? "justify-center" : "justify-between"
                            } p-2 rounded-md cursor-pointer hover:bg-[#F5F3FF]`}
                    >
                        <div className="flex items-center gap-2">
                            <img
                                src={
                                    user.picture ||
                                    `https://ui-avatars.com/api/?name=${user.name}`
                                }
                                alt="Profile"
                                referrerPolicy="no-referrer"
                                className="w-8 h-8 rounded-full object-cover"
                            />
                            {!collapsed && (
                                <div className="flex flex-col">
                                    <div className="font-semibold text-sm text-[#111827]">
                                        {user.name}
                                    </div>
                                    <div className="text-xs text-[#4B5563]">
                                        {user.email}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {!collapsed && open && (
                        <div className="absolute bottom-14 left-0 w-full bg-white shadow-sm border border-[#E5E7EB] rounded-lg">
                            <button
                                onClick={logout}
                                className="flex items-center gap-2 w-full px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md transition"
                            >
                                <LogOut className="w-4 h-4 text-red-600" />
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    )


}
