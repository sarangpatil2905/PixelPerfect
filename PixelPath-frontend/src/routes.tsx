import { Routes, Route } from "react-router-dom"
import Landing from "@/pages/Landing"

export function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Landing />} />
            {/* <Route element={<MainLayout />}>
                <Route path="/inbox" element={<Inbox />} />
            </Route>
            <Route path="/auth/callback" element={<Callback />}/> */}
        </Routes>
    )
}
