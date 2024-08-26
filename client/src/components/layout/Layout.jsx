import Navbar from "./Navbar";
import { useAuth } from "@clerk/clerk-react";

const Layout = ({ children }) => {
    const { isLoaded, isSignedIn } = useAuth();
    if (!isLoaded) {
        return <div>Loading...</div>;
    }
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar isSignedIn={isSignedIn} />
            <main className="flex-grow container mx-auto px-4 py-8">
                {children}
            </main>
            <footer className="bg-zinc-800 text-white text-center p-4 mt-auto">
                © 2024 RAISE-U.ME
            </footer>
        </div>
    );
};

export default Layout;
