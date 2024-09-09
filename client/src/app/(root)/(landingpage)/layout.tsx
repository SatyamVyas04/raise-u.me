import React, { ReactNode } from "react";
import Navbar from "@/components/layout/Navbar";

const HomeLayout = ({ children }: { children: ReactNode }) => {
	return (
		<main className="relative">
			<Navbar />
			<div className="flex">
				<section className="flex min-h-screen flex-1 flex-col">
					<div className="w-full">{children}</div>
				</section>
			</div>
		</main>
	);
};

export default HomeLayout;
