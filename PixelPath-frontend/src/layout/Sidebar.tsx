import { useEffect, useState } from "react"
import { NavLink } from "react-router-dom"
import {
    Map,
    LayoutDashboard,
    Route,
    Clock,
    Settings,
    Power
} from "lucide-react"

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

interface User {
    picture: string
    name?: string
    email?: string
}

export default function MainLayout() {
    const [user, setUser] = useState<User | null>(null)

    useEffect(() => {
        fetch(`${BACKEND_URL}/auth/check`, {
            credentials: "include",
        })
            .then(res => res.json())
            .then(data => {
                if (data.loggedIn) {
                    setUser(data.user)
                }
            })
    }, [])

    const logout = async () => {
        await fetch(`${BACKEND_URL}/auth/logout`, {
            method: "POST",
            credentials: "include"
        })

        window.location.href = "/"
    }

    return (
        <div className="w-64 h-screen bg-white border-r flex flex-col justify-between p-4">

            {/* Top Section */}
            <div>
                {/* App Title */}
                <div className="flex items-center gap-2 mb-6">
                    <Map className="w-6 h-6 text-blue-600" />
                    <h1 className="text-lg font-bold">PixelPath</h1>
                </div>

                {/* Navigation */}
                <nav className="flex flex-col gap-1">
                    <NavLink
                        to="/trips"
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition ${isActive
                                ? "bg-blue-100 text-blue-700"
                                : "text-gray-600 hover:bg-gray-100"
                            }`
                        }
                    >
                        <Route className="w-4 h-4" />
                        My Trips
                    </NavLink>

                    <NavLink
                        to="/visualizer"
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition ${isActive
                                ? "bg-blue-100 text-blue-700"
                                : "text-gray-600 hover:bg-gray-100"
                            }`
                        }
                    >
                        <Map className="w-4 h-4" />
                        Route Visualizer
                    </NavLink>

                    <NavLink
                        to="/timeline"
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition ${isActive
                                ? "bg-blue-100 text-blue-700"
                                : "text-gray-600 hover:bg-gray-100"
                            }`
                        }
                    >
                        <Clock className="w-4 h-4" />
                        Trip Timeline
                    </NavLink>

                    <NavLink
                        to="/settings"
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition ${isActive
                                ? "bg-blue-100 text-blue-700"
                                : "text-gray-600 hover:bg-gray-100"
                            }`
                        }
                    >
                        <Settings className="w-4 h-4" />
                        Settings
                    </NavLink>

                </nav>
            </div>

            {/* Bottom Section */}
            <div className="border-t pt-4">
                <button
                    onClick={logout}
                    className="flex items-center gap-3 px-3 py-2 w-full rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition"
                >
                    <Power className="w-4 h-4" />
                    Logout
                </button>
            </div>

        </div>
    )
}
