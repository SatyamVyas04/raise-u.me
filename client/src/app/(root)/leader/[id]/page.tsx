/* eslint-disable @next/next/no-img-element */
// LeaderDetail.tsx
"use client";
import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, ExternalLink, Share } from "lucide-react";
import { useLeaderDetails } from "@/hooks/useLeaders";

const LeaderDetail = () => {
	const { id } = useParams();
	const { leader, isLoading } = useLeaderDetails(id as string);

	if (isLoading) {
		return (
			<div className="container mx-auto p-8">
				<Skeleton className="h-8 w-32 mb-8" />
				<Skeleton className="w-full h-96 rounded-lg mb-8" />
				<Skeleton className="h-6 w-3/4 mb-4" />
				<Skeleton className="h-4 w-full mb-2" />
				<Skeleton className="h-4 w-full mb-2" />
				<Skeleton className="h-4 w-3/4 mb-4" />
			</div>
		);
	}

	if (!leader) return null;

	return (
		<div className="container mx-auto p-8 space-y-10">
			{/* Back Button */}
			<Link href="/home">
				<Button variant="ghost" className="mb-4">
					<ArrowLeft className="mr-2 h-4 w-4" />
					Back
				</Button>
			</Link>

			{/* Content Layout */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:items-start">
				{/* Main Content on the left for large screens */}
				<div className="space-y-8 leading-relaxed text-lg order-2 lg:order-1">
					<header className="space-y-4 text-center lg:text-left">
						<h1 className="text-5xl font-bold text-primary">
							{leader.name}
						</h1>
						<p className="text-xl text-gray-600">
							{leader.subtitle || "Renowned Tech Leader"}
						</p>
					</header>

					{/* About Section */}
					<section>
						<h2 className="text-3xl font-semibold text-primary mb-4">
							About
						</h2>
						<p className="text-gray-700 dark:text-gray-300">
							{leader.summary}
						</p>
					</section>

					{/* Skills Section */}
					<section className="space-y-4">
						<h2 className="text-3xl font-semibold text-primary mb-4">
							Skills
						</h2>
						<div className="flex flex-wrap gap-3">
							{leader.skills.map((skill) => (
								<Badge
									key={skill}
									variant="outline"
									className="rounded-full px-4 py-1"
								>
									{skill}
								</Badge>
							))}
						</div>
					</section>

					{/* External Links Section */}
					{leader.url && (
						<section>
							<h2 className="text-3xl font-semibold text-primary mb-4">
								Learn More
							</h2>
							<Button
								variant="link"
								onClick={() =>
									window.open(leader.url, "_blank")
								}
								className="flex items-center text-blue-600"
							>
								Visit Website
								<ExternalLink className="ml-2 h-5 w-5" />
							</Button>
						</section>
					)}

					{/* Share Section */}
					<footer className="flex items-center gap-4 mt-10">
						<Button
							variant="ghost"
							className="flex items-center gap-2"
						>
							<Share className="h-5 w-5" />
							Share
						</Button>
					</footer>
				</div>

				{/* Image on the right for large screens */}
				<div className="w-full h-96 lg:h-full lg:max-h-[70vh] order-1 lg:order-2">
					<img
						src={leader.image}
						alt={leader.name}
						className="w-full h-full object-cover rounded-lg shadow-md"
					/>
				</div>
			</div>
		</div>
	);
};

export default LeaderDetail;
