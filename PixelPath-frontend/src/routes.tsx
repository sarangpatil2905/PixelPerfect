import { Routes, Route } from "react-router-dom"
import Landing from "@/pages/Landing"
import TripVisualizer from "@/pages/TripVisualizer"
import Mytrips from "@/pages/Mytrips"
import MainLayout from "./layout/MainLayout"
import LoginPage from "./pages/Login"
export function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Landing />} />
            <Route element={<MainLayout />}>
                <Route path="/visualizer" element={<TripVisualizer />} />
                <Route path="/trips" element={< Mytrips />} />
            </Route>
            <Route path="/login" element={<LoginPage />} />
        </Routes>
    )
}
