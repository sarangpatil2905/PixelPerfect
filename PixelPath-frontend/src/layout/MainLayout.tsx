import { Outlet } from "react-router-dom"
import Sidebar from "./Sidebar"

export default function MainLayout() {
    return (
        <div className="flex h-screen overflow-hidden">
            <div className=" shrink-0 bg-[#f7f7f5]">
                <Sidebar />
            </div>
            <div className="flex-1 min-w-0">
                <Outlet />
            </div>
        </div>
    )
}
