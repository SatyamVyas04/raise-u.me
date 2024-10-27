/* eslint-disable @next/next/no-img-element */
// DashboardHome.tsx
"use client";
import React from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileEdit, Palette, Zap, Settings } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useLeaders } from "@/hooks/useLeaders";

const quickActions = [
	{
		title: "Resume Builder",
		description: "Create professional resumes",
		icon: <FileEdit className="w-5 h-5" />,
	},
	{
		title: "Template Gallery",
		description: "Browse resume templates",
		icon: <Palette className="w-5 h-5" />,
	},
	{
		title: "Resume Enhancer",
		description: "Improve your resume",
		icon: <Zap className="w-5 h-5" />,
	},
	{
		title: "Profile Settings",
		description: "Update your information",
		icon: <Settings className="w-5 h-5" />,
	},
];

const LeaderCard = ({
	leader,
	isLoading,
}: {
	leader: Leader | null;
	isLoading: boolean;
}) => {
	if (isLoading) {
		return (
			<Card className="overflow-hidden shadow-md hover:shadow-primary transition-shadow">
				<Skeleton className="w-full h-48" />
				<div className="p-6 flex flex-col justify-start items-start">
					<Skeleton className="h-6 w-48 mb-4" />
					<div className="flex flex-wrap gap-2 mb-4">
						<Skeleton className="h-5 w-20" />
						<Skeleton className="h-5 w-24" />
						<Skeleton className="h-5 w-16" />
					</div>
					<Skeleton className="h-10 w-24 ml-auto" />
				</div>
			</Card>
		);
	}

	if (!leader) return null;

	return (
		<Card className="overflow-hidden shadow-md hover:shadow-primary transition-shadow">
			<div className="relative w-full h-48 overflow-hidden">
				<img
					src={leader.image}
					alt={leader.name}
					className="w-full h-48 object-cover"
				/>
			</div>
			<div className="p-6 flex flex-col justify-between items-start">
				<h3 className="font-semibold text-lg mb-4">{leader.name}</h3>
				<div className="flex flex-wrap gap-2 mb-4">
					{leader.skills.slice(0, 3).map((skill) => (
						<Badge
							key={skill}
							className="rounded-full"
							variant="outline"
						>
							{skill}
						</Badge>
					))}
					{leader.skills.length > 3 && (
						<Badge variant="outline" className="rounded-full">
							+{leader.skills.length - 3} more
						</Badge>
					)}
				</div>
				<Link href={`/leader/${leader.id}`} className="ml-auto">
					<Button>Read More</Button>
				</Link>
			</div>
		</Card>
	);
};

const DashboardHome = () => {
	const { leaders, isLoading } = useLeaders();

	return (
		<div className="p-6 px-4 space-y-8">
			<h1 className="text-3xl font-bold text-primary">Welcome back!</h1>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
				{quickActions.map((action) => (
					<Card
						key={action.title}
						className="p-6 cursor-pointer shadow-md hover:shadow-primary transition-shadow"
					>
						<div className="flex items-center gap-3 mb-2">
							<div className="text-primary">{action.icon}</div>
							<h3 className="font-semibold">{action.title}</h3>
						</div>
						<p className="text-gray-500 text-sm">
							{action.description}
						</p>
					</Card>
				))}
			</div>

			<Separator className="w-full" />

			<div>
				<h2 className="text-2xl font-semibold mb-6">
					Featured Tech Leaders
				</h2>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
					<LeaderCard leader={leaders[0]} isLoading={isLoading} />
					<LeaderCard leader={leaders[1]} isLoading={isLoading} />
					<LeaderCard leader={leaders[2]} isLoading={isLoading} />
				</div>
			</div>
		</div>
	);
};

export default DashboardHome;
