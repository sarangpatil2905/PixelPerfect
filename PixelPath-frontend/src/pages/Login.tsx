import { useNavigate } from "react-router-dom"
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth"
import { auth } from "../firebase"

function LoginPage() {
    const navigate = useNavigate()

    const handleGoogleLogin = async () => {
        try {
            const provider = new GoogleAuthProvider()
            const result = await signInWithPopup(auth, provider)

            const user = result.user

            localStorage.setItem("user", JSON.stringify({
                name: user.displayName,
                email: user.email,
                photo: user.photoURL,
                uid: user.uid
            }))

            navigate("/visualizer")
        } catch (error) {
            console.error("Login failed:", error)
        }
    }

    return (
        <div className="flex justify-center items-center h-screen flex-col">
            <div className="flex mt-[21vh] flex-1 gap-6 flex-col text-[#555] w-90 items-start">

                <div className="leading-6.5 text-[rgb(29,27,22)] flex flex-col gap-2">
                    <span className="text-[22px] font-semibold ">
                        Welcome to Intray Mail
                    </span>
                    <span className="text-[14px] text-[rgb(95,94,91)]">
                        Everything You love in your Inbox
                    </span>
                </div>

                <hr className="w-full opacity-10" />

                <button
                    onClick={handleGoogleLogin}
                    className="flex items-center justify-center gap-2 rounded-md bg-white px-4 py-2 shadow-md hover:shadow-lg transition"
                >
                    Continue with Google
                </button>
            </div>

            <footer className="text-center text-xs mt-auto pb-16 text-[rgb(95,94,91)]">
                By clicking "Connect with Google" above, you acknowledge that you agree to the Terms and Privacy Policy.
            </footer>
        </div>
    )
}

export default LoginPage
