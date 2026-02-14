import type { ReactNode } from "react"
// import { ThemeProvider } from "@/context/ThemeContext"
// import { AuthProvider } from "@/context/AuthContext"

type Props = {
    children: ReactNode
}
function AppProviders({ children }: Props) {
    return (
        // <ThemeProvider>
        //   <AuthProvider>
        <>
            {children}
        </>

        //   </AuthProvider>
        // </ThemeProvider>
    )
}
export default AppProviders