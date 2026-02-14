import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    MapContainer,
    TileLayer
} from "react-leaflet";
import "leaflet/dist/leaflet.css";

const FRONTEND_URL = import.meta.env.VITE_FRONTEND_URL;
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

function LoginPage() {
    const navigate = useNavigate();

    const [userInfo, setUserInfo] = useState<{
        name?: string;
        email?: string;
    }>({});

    /* ---------------- CHECK AUTH ---------------- */

    useEffect(() => {
        fetch(`${BACKEND_URL}/auth/check`, {
            method: "GET",
            credentials: "include",
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.loggedIn) {
                    setUserInfo({
                        name: data.user?.name,
                        email: data.user?.email,
                    });
                }
            })
            .catch((err) => console.error("Auth check failed:", err));
    }, []);

    /* ---------------- GOOGLE LOGIN ---------------- */

    function loginPopup() {
        const redirectUri = `${FRONTEND_URL}/auth/callback`;
        const scope = "openid email profile";

        const authUrl =
            "https://accounts.google.com/o/oauth2/v2/auth" +
            `?response_type=code` +
            `&client_id=${GOOGLE_CLIENT_ID}` +
            `&redirect_uri=${encodeURIComponent(redirectUri)}` +
            `&scope=${encodeURIComponent(scope)}` +
            `&access_type=offline` +
            `&prompt=consent`;

        const popup = window.open(
            authUrl,
            "googleLogin",
            "width=500,height=600,resizable,scrollbars"
        );

        if (!popup) {
            alert("Popup blocked");
            return;
        }

        function handleMessage(event: MessageEvent) {
            if (event.origin !== FRONTEND_URL) return;

            const { type, code } = event.data;

            if (type === "google-auth-success") {
                fetch(`${BACKEND_URL}/auth/google/callback`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body: JSON.stringify({ code }),
                })
                    .then(() => navigate("/"))
                    .catch((err) =>
                        console.error("Token exchange failed:", err)
                    );
            }

            window.removeEventListener("message", handleMessage);
        }

        window.addEventListener("message", handleMessage);
    }

    return (
        <div className="relative h-screen w-full">

            {/* ---------------- BACKGROUND MAP ---------------- */}
            <div className="absolute inset-0 -z-10">
                <MapContainer
                    center={[19.076, 72.8777]}
                    zoom={5}
                    style={{ height: "100%", width: "100%" }}
                    zoomControl={false}
                    dragging={false}
                    scrollWheelZoom={false}
                    doubleClickZoom={false}
                >
                    <TileLayer
                        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                    />
                </MapContainer>
            </div>

            {/* ---------------- OVERLAY ---------------- */}
            <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>

            {/* ---------------- LOGIN CARD ---------------- */}
            <div className="relative h-full flex items-center justify-center">

                <div className="w-[400px] bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl border border-white/40 p-8">

                    <div className="text-center mb-6">
                        <h1 className="text-3xl font-bold text-gray-900">
                            PixelPath
                        </h1>
                        <p className="text-sm text-gray-600 mt-2">
                            Visualize and Replay Your Travel Routes
                        </p>
                    </div>

                    <div className="h-px bg-gray-200 mb-6" />

                    {/* If Logged In → Show Info */}
                    {userInfo.name ? (
                        <div className="space-y-3 text-center">
                            <div className="text-gray-800 font-medium">
                                {userInfo.name}
                            </div>
                            <div className="text-sm text-gray-500">
                                {userInfo.email}
                            </div>

                            <button
                                onClick={() => navigate("/")}
                                className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                            >
                                Continue to Dashboard
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={loginPopup}
                            className="flex items-center justify-center gap-3 w-full h-11 rounded-lg bg-white border border-gray-300 shadow-sm hover:shadow-md hover:bg-gray-50 transition"
                        >
                            <svg fill="none" height="20" viewBox="0 0 20 20" width="20">
                                <path d="M19.6 10.2271C19.6 9.51804 19.5364 8.83624 19.4182 8.18164H10V12.0498H15.3818C15.15 13.2998 14.4455 14.3589 13.3864 15.068V17.5771H16.6182C18.5091 15.8362 19.6 13.2725 19.6 10.2271Z" fill="#4285F4" />
                                <path d="M10 20.0004C12.7 20.0004 14.9636 19.1049 16.6181 17.5777L13.3863 15.0686C12.4909 15.6686 11.3454 16.0231 10 16.0231C7.3954 16.0231 5.1909 14.264 4.4045 11.9004H1.0636V14.4913C2.7091 17.7595 6.0909 20.0004 10 20.0004Z" fill="#34A853" />
                                <path d="M4.4045 11.8997C4.2045 11.2997 4.0909 10.6588 4.0909 9.99969C4.0909 9.34059 4.2045 8.69969 4.4045 8.09969V5.50879H1.0636C0.3864 6.85879 0 8.38609 0 9.99969C0 11.6133 0.3864 13.1406 1.0636 14.4906L4.4045 11.8997Z" fill="#FBBC04" />
                                <path d="M10 3.9773C11.4681 3.9773 12.7863 4.4818 13.8227 5.4727L16.6909 2.6045C14.9591 0.9909 12.6954 0 10 0C6.0909 0 2.7091 2.2409 1.0636 5.5091L4.4045 8.1C5.1909 5.7364 7.3954 3.9773 10 3.9773Z" fill="#E94235" />
                            </svg>

                            <span className="text-sm font-medium text-gray-800">
                                Continue with Google
                            </span>
                        </button>
                    )}

                </div>
            </div>
        </div>
    );
}

export default LoginPage;