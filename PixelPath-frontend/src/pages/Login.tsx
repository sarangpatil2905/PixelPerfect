import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth"
import { auth } from "../firebase"
import { Loader2 } from "lucide-react"

function LoginPage() {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleGoogleLogin = async () => {
        try {
            setLoading(true)
            setError(null)

            const provider = new GoogleAuthProvider()
            const result = await signInWithPopup(auth, provider)

            const user = result.user

            localStorage.setItem(
                "user",
                JSON.stringify({
                    name: user.displayName,
                    email: user.email,
                    photo: user.photoURL,
                    uid: user.uid,
                })
            )

            navigate("/visualizer")
        } catch (err) {
            console.error("Login failed:", err)
            setError("Authentication failed. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 px-6">

            {/* Card */}
            <div className="w-full max-w-md bg-white/80 backdrop-blur-xl shadow-2xl rounded-2xl p-10 border border-gray-200">

                {/* Logo / Title */}
                <div className="mb-8 text-center">
                    <h1 className="text-2xl font-semibold text-gray-900">
                        Welcome to Pixel Path
                    </h1>
                    <p className="text-sm text-gray-500 mt-2">
                        Everything you love in your Journey.
                    </p>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-200 mb-6" />

                {/* Google Button */}
                <button
                    onClick={handleGoogleLogin}
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-3 rounded-xl border border-gray-300 bg-white py-3 font-medium text-gray-700 shadow-sm hover:shadow-md transition disabled:opacity-70"
                >
                    {loading ? (
                        <>
                            <Loader2 className="animate-spin" size={18} />
                            Signing in...
                        </>
                    ) : (
                        <>
                            <img
                                src="https://www.svgrepo.com/show/475656/google-color.svg"
                                alt="Google"
                                className="w-5 h-5"
                            />
                            Continue with Google
                        </>
                    )}
                </button>

                {/* Error */}
                {error && (
                    <p className="text-red-500 text-sm mt-4 text-center">
                        {error}
                    </p>
                )}

                {/* Footer */}
                <p className="text-xs text-gray-500 text-center mt-8 leading-relaxed">
                    By continuing, you agree to our{" "}
                    <span className="underline cursor-pointer">
                        Terms of Service
                    </span>{" "}
                    and{" "}
                    <span className="underline cursor-pointer">
                        Privacy Policy
                    </span>.
                </p>
            </div>
        </div>
    )
}

export default LoginPage
