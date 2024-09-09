import React, { ReactNode } from "react";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";

const HomeLayout = ({ children }: { children: ReactNode }) => {
	return (
		<main className="relative">
			<Navbar />
			<div className="flex">
				<Sidebar />
				<section className="flex min-h-screen flex-1 flex-col px-8 py-8 pt-20 sm:px-12">
					{children}
				</section>
			</div>
		</main>
	);
};

export default HomeLayout;
