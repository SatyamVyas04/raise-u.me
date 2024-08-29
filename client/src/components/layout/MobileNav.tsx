"use client";
import React from "react";
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import Link from "next/link";
import { Button } from "../ui/button";
import { sidebarLinks } from "./../../../constants/";
import { usePathname } from "next/navigation";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { cn } from "@/lib/utils";

import { ClipboardDocumentCheckIcon } from "@heroicons/react/20/solid";
import { Bars3Icon } from "@heroicons/react/20/solid";

const MobileNav = () => {
	const pathname = usePathname();
	return (
		<section className="sm:hidden">
			<Sheet>
				<SheetTrigger asChild>
					<Button className="px-2">
						<Bars3Icon
							width={24}
							height={24}
							className="text-accent"
						></Bars3Icon>
					</Button>
				</SheetTrigger>
				<SheetContent
					side="left"
					className="w-full max-w-[264px] border-none"
				>
					<SheetHeader className="mb-4">
						<SheetTitle className="-mt-1">
							<SignedIn>
								<Link
									href="/home"
									className="flex items-center gap-1"
								>
									<div className="p-1 rounded-full bg-accent-foreground">
										<ClipboardDocumentCheckIcon
											height={"32px"}
											className="solid-background"
										/>
									</div>
									<h1 className="text-[24px] font-extrabold">
										raise-u.me
									</h1>
								</Link>
							</SignedIn>
							<SignedOut>
								<Link
									href="/"
									className="flex items-center gap-1"
								>
									<div className="p-1 rounded-full bg-accent-foreground">
										<ClipboardDocumentCheckIcon
											height={"32px"}
											className="solid-background"
										/>
									</div>
									<h1 className="text-[24px] font-extrabold">
										raise-u.me
									</h1>
								</Link>
							</SignedOut>
						</SheetTitle>
					</SheetHeader>
					<SheetDescription>
						{sidebarLinks.map((link) => {
							const isActive = pathname === link.route;
							return (
								<SheetClose asChild key={link.route}>
									<Link
										href={link.route}
										key={link.label}
										className={cn(
											"flex items-center justify-start gap-4 rounded-md p-4",
											{
												"bg-primary text-accent":
													isActive,
											}
										)}
									>
										<link.imgUrl className="h-6" />
										<p className="text-md font-bold">
											{link.label}
										</p>
									</Link>
								</SheetClose>
							);
						})}
					</SheetDescription>
				</SheetContent>
			</Sheet>
		</section>
	);
};

export default MobileNav;
