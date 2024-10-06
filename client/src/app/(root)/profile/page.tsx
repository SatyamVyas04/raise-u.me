"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	FileText,
	Briefcase,
	GraduationCap,
	Award,
	Link as LinkIcon,
} from "lucide-react";
import { useUser } from "@clerk/nextjs";

// Custom Badge component using Tailwind CSS classes
const Badge = ({
	children,
}: {
	children: React.ReactNode;
}): React.JSX.Element => (
	<span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
		{children}
	</span>
);

export default function ProfilePage() {
	const { user } = useUser();
	interface UserData {
		name: string;
		occupation: string;
		skills: string[];
		education: string[];
		positionsOfResponsibility: string[];
		experience: string[];
		urls: string[];
		resumeUrl: string;
	}

	const [userData, setUserData] = useState<UserData | null>(null);
	const [isResumePreviewOpen, setIsResumePreviewOpen] = useState(false);
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const fetchUserData = async () => {
			if (user?.username) {
				try {
					const response = await fetch(`/api/user/${user.username}`);
					if (response.ok) {
						const data = await response.json();
						setUserData(data);
					} else if (response.status !== 404) {
						console.error("Failed to fetch user data");
					}
				} catch (error) {
					console.error("Error fetching user data:", error);
				} finally {
					setIsLoading(false);
				}
			} else {
				setIsLoading(false);
			}
		};
		fetchUserData();
	}, [user]);

	if (!userData || isLoading) {
		return (
			<div className="flex justify-center items-center h-screen">
				<div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
			</div>
		);
	}

	return (
		<div className="container mx-auto p-4 space-y-6">
			<Card>
				<CardHeader className="flex flex-row items-center space-x-4 pb-2">
					<Avatar className="h-20 w-20">
						<AvatarImage src={user?.imageUrl} alt="user avatar" />
						<AvatarFallback>
							{userData?.name?.charAt(0)}
						</AvatarFallback>
					</Avatar>
					<div>
						<CardTitle className="text-2xl">
							{userData.name}
						</CardTitle>
						<p className="text-muted-foreground">
							{userData.occupation}
						</p>
					</div>
				</CardHeader>
				<CardContent>
					<div className="flex flex-wrap gap-2 mt-2">
						{userData.skills.map((skill, index) => (
							<Badge key={index}>{skill}</Badge>
						))}
					</div>
				</CardContent>
			</Card>

			<Tabs defaultValue="education" className="w-full">
				<TabsList className="grid w-full grid-cols-4">
					<TabsTrigger value="education">Education</TabsTrigger>
					<TabsTrigger value="responsibility">
						Responsibility
					</TabsTrigger>
					<TabsTrigger value="experience">Experience</TabsTrigger>
					<TabsTrigger value="urls">URLs</TabsTrigger>
				</TabsList>
				<TabsContent value="education">
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center">
								<GraduationCap className="mr-2" /> Education
							</CardTitle>
						</CardHeader>
						<CardContent>
							<ScrollArea className="h-[200px]">
								<ul className="list-disc list-inside space-y-2">
									{userData.education.map((edu, index) => (
										<li key={index}>{edu}</li>
									))}
								</ul>
							</ScrollArea>
						</CardContent>
					</Card>
				</TabsContent>
				<TabsContent value="responsibility">
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center">
								<Award className="mr-2" /> Positions of
								Responsibility
							</CardTitle>
						</CardHeader>
						<CardContent>
							<ScrollArea className="h-[200px]">
								<ul className="list-disc list-inside space-y-2">
									{userData.positionsOfResponsibility.map(
										(position, index) => (
											<li key={index}>{position}</li>
										)
									)}
								</ul>
							</ScrollArea>
						</CardContent>
					</Card>
				</TabsContent>
				<TabsContent value="experience">
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center">
								<Briefcase className="mr-2" /> Experience
							</CardTitle>
						</CardHeader>
						<CardContent>
							<ScrollArea className="h-[200px]">
								<ul className="list-disc list-inside space-y-2">
									{userData.experience.map((exp, index) => (
										<li key={index}>{exp}</li>
									))}
								</ul>
							</ScrollArea>
						</CardContent>
					</Card>
				</TabsContent>
				<TabsContent value="urls">
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center">
								<LinkIcon className="mr-2" /> URLs
							</CardTitle>
						</CardHeader>
						<CardContent>
							<ScrollArea className="h-[200px]">
								<ul className="list-disc list-inside space-y-2">
									{userData.urls.map((url, index) => (
										<li key={index}>
											<a
												href={url}
												target="_blank"
												rel="noopener noreferrer"
												className="text-primary hover:underline"
											>
												{url}
											</a>
										</li>
									))}
								</ul>
							</ScrollArea>
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>

			<Card>
				<CardHeader>
					<CardTitle className="flex items-center">
						<FileText className="mr-2" /> Resume
					</CardTitle>
				</CardHeader>
				<CardContent>
					<Sheet
						open={isResumePreviewOpen}
						onOpenChange={setIsResumePreviewOpen}
					>
						<SheetTrigger asChild>
							<Button variant="outline">View Resume</Button>
						</SheetTrigger>
						<SheetContent
							side="right"
							className="w-[400px] sm:w-[540px]"
						>
							<SheetHeader>
								<SheetTitle>Resume Preview</SheetTitle>
								<SheetDescription>
									Your uploaded resume
								</SheetDescription>
							</SheetHeader>
							<div className="p-4 pb-0">
								<div className="aspect-[8.5/11] bg-white">
									<iframe
										src={userData.resumeUrl}
										className="w-full h-full"
										title="Resume Preview"
									/>
								</div>
							</div>
							<SheetFooter>
								<SheetClose asChild>
									<Button variant="outline" className="mt-2">
										Close
									</Button>
								</SheetClose>
							</SheetFooter>
						</SheetContent>
					</Sheet>
				</CardContent>
			</Card>

			<div className="flex justify-end">
				<Button onClick={() => router.push("/onboarding")}>
					Edit Profile
				</Button>
			</div>
		</div>
	);
}
