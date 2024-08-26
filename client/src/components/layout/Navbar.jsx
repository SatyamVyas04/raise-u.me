import { Link } from "react-router-dom";
import { UserButton } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";

const Navbar = ({ isSignedIn }) => {
	return (
		<div className="relative top-0">
			<nav className="flex justify-between items-center p-4 bg-zinc-800 text-white">
				<Link to="/" className="text-xl font-bold">
					RAISE-U.ME
				</Link>
				<div className="flex items-center space-x-4">
					<Link to="/about">
						<Button variant="ghost">About</Button>
					</Link>
					{isSignedIn ? (
						<>
							<Link to="/builder">
								<Button variant="ghost">Builder</Button>
							</Link>
							<Link to="/enhancer">
								<Button variant="ghost">Enhancer</Button>
							</Link>
							<Link to="/profile">
								<Button variant="ghost">Profile</Button>
							</Link>
							<UserButton afterSignOutUrl="/" />
						</>
					) : (
						<>
							<Link to="/login">
								<Button variant="ghost">Login</Button>
							</Link>
							<Link to="/signup">
								<Button variant="ghost">Sign Up</Button>
							</Link>
						</>
					)}
				</div>
			</nav>
		</div>
	);
};

export default Navbar;
