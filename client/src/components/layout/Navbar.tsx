import React from "react";
import { ModeToggle } from "@/components/ui/mode-toggle";
import Link from "next/link";
import MobileNav from "./MobileNav";

import { ClipboardDocumentCheckIcon } from "@heroicons/react/24/outline";

import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { Button } from "../ui/button";

const Navbar = () => {
	return (
		<nav className="fixed z-50 flex w-full justify-between border-b-2 border-primary px-6 py-3 backdrop-blur-xl lg:px-10">
			<SignedIn>
				<Link href="/home" className="flex items-center gap-1">
					<div className="p-1 rounded-full bg-accent-foreground">
						<ClipboardDocumentCheckIcon
							height={"32px"}
							className="text-background"
						/>
					</div>
					<h1 className="text-[24px] font-extrabold">raise-u.me</h1>
				</Link>
			</SignedIn>
			<SignedOut>
				<Link href="/" className="flex items-center gap-1">
					<div className="p-1 rounded-full bg-accent-foreground">
						<ClipboardDocumentCheckIcon
							height={"32px"}
							className="text-background"
						/>
					</div>
					<h1 className="text-[24px] font-extrabold">raise-u.me</h1>
				</Link>
			</SignedOut>
			<div className="flex items-center justify-between gap-2 sm:gap-4">
				<SignedOut>
					<Button>
						<SignInButton />
					</Button>
				</SignedOut>
				<SignedIn>
					<UserButton />
				</SignedIn>
				<ModeToggle />
				<MobileNav />
			</div>
		</nav>
	);
};

export default Navbar;
