import { Routes, Route } from "react-router-dom"
import Landing from "@/pages/Landing"
import TripVisualizer from "@/pages/TripVisualizer"
export function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/visualizer" element={<TripVisualizer />} />
            {/* <Route element={<MainLayout />}>
                <Route path="/inbox" element={<Inbox />} />
            </Route>
            <Route path="/auth/callback" element={<Callback />}/> */}
        </Routes>
    )
}
