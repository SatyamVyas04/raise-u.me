import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ClerkProvider } from "@clerk/clerk-react";
import Layout from "./components/layout/Layout";
import LandingPage from "./pages/LandingPage";
import About from "./pages/About";
import Builder from "./pages/Builder";
import Enhancer from "./pages/Enhancer";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Profile from "./pages/Profile";
import SavedResume from "./pages/SavedResume";
import GeneratedResume from "./pages/GeneratedResume";
import { useRouteProtection } from "./hooks/useRouteProtection";

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

function AppContent() {
	useRouteProtection();
	return (
		<Layout>
			<Routes>
				<Route path="/" element={<LandingPage />} />
				<Route path="/about" element={<About />} />
				<Route path="/login" element={<Login />} />
				<Route path="/signup" element={<SignUp />} />
				<Route path="/builder" element={<Builder />} />
				<Route path="/enhancer" element={<Enhancer />} />
				<Route path="/profile" element={<Profile />} />
				<Route path="/saved-resume" element={<SavedResume />} />
				<Route path="/generated-resume" element={<GeneratedResume />} />
			</Routes>
		</Layout>
	);
}

function App() {
	return (
		<ClerkProvider publishableKey={clerkPubKey}>
			<Router>
				<AppContent />
			</Router>
		</ClerkProvider>
	);
}

export default App;
