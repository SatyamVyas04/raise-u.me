"use client";
import React from "react";
import Link from "next/link";
import { sidebarLinks } from "../../../constants";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const Sidebar = () => {
	const pathname = usePathname();
	return (
		<aside className="sticky left-0 top-0 h-screen w-fit flex-col justify-between bg-accent p-4 sm:pt-20 max-sm:hidden lg:w-[264px]">
			<div className="flex flex-1 flex-col gap-4">
				{sidebarLinks.map((link) => {
					const isActive = pathname === link.route;

					return (
						<Link
							href={link.route}
							key={link.label}
							className={cn(
								"flex items-center justify-start gap-4 rounded-md p-4",
								{
									"bg-primary text-accent": isActive,
								}
							)}
						>
							<link.imgUrl className="h-6" />
							<p className="text-md font-semibold max-lg:hidden">
								{link.label}
							</p>
						</Link>
					);
				})}
			</div>
		</aside>
	);
};

export default Sidebar;
