/* eslint-disable react/no-unescaped-entities */
"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, FileText, Upload } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { useUser } from "@clerk/nextjs";
import { useMediaQuery } from "@/hooks/use-media-query";
import { CldUploadWidget } from "next-cloudinary";
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from "@/components/ui/drawer";
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

interface UserData {
	name: string;
	username: string;
	skills: string[];
	occupation: string;
	education: string[];
	positionsOfResponsibility: string[];
	experience: string[];
	urls: string[];
	resumeUrl: string;
	resumePublicId: string;
	projects: string[];
	certifications: string[];
}

export default function ResumeEnhancerPage() {
	const [isEnhancing, setIsEnhancing] = useState(false);
	const [enhancedData, setEnhancedData] = useState<UserData | null>(null);
	const [isResumePreviewOpen, setIsResumePreviewOpen] = useState(false);
	const [userData, setUserData] = useState<UserData | null>(null);
	const [jobDescriptionUrl, setJobDescriptionUrl] = useState<string | null>(
		null
	);
	const { user } = useUser();
	const isMobile = useMediaQuery("(max-width: 768px)");

	useEffect(() => {
		const fetchUserData = async () => {
			if (user?.username) {
				try {
					const response = await fetch(`/api/user/${user.username}`);
					if (response.ok) {
						const data = await response.json();
						setUserData(data);
					} else {
						console.error("Failed to fetch user data");
						toast.error(
							"Failed to fetch user data. Please try again."
						);
					}
				} catch (error) {
					console.error("Error fetching user data:", error);
					toast.error("An error occurred while fetching user data.");
				}
			}
		};

		fetchUserData();
	}, [user]);

	const enhanceResume = async () => {
		if (!user?.username || !userData || !jobDescriptionUrl) {
			toast.error("Please upload both resume and job description.");
			return;
		}

		setIsEnhancing(true);
		try {
			// Download resume and job description
			const resumeResponse = await fetch(userData.resumeUrl);
			const resumeBlob = await resumeResponse.blob();
			const resumeFile = new File([resumeBlob], "resume.pdf", {
				type: "application/pdf",
			});

			const jdResponse = await fetch(jobDescriptionUrl);
			const jdBlob = await jdResponse.blob();
			const jdFile = new File([jdBlob], "job_description.pdf", {
				type: "application/pdf",
			});

			// Create FormData and append files
			const formData = new FormData();
			formData.append("resume", resumeFile);
			formData.append("job_description", jdFile);

			const response = await fetch(
				"http://localhost:5000/enhance_resume",
				{
					method: "POST",
					body: formData,
				}
			);
			const enhancedData = await response.json();
			console.log(enhancedData);

			setEnhancedData(enhancedData);

			// // Update the user data on the server
			// const updateResponse = await fetch(
			// 	`/app/api/enhancements/${user.username}`,
			// 	{
			// 		method: "POST",
			// 		headers: { "Content-Type": "application/json" },
			// 		body: JSON.stringify(enhancedData),
			// 	}
			// );
			// if (updateResponse.ok) {
			// 	toast.success(
			// 		"Your resume has been successfully enhanced and updated."
			// 	);
			// } else {
			// 	throw new Error("Failed to update user data");
			// }
		} catch (error) {
			console.error("Error enhancing resume:", error);
			toast.error(
				"There was an error enhancing your resume. Please try again."
			);
		} finally {
			setIsEnhancing(false);
		}
	};

	const handleJobDescriptionUpload = async (result: any) => {
		if (result?.info?.secure_url) {
			setJobDescriptionUrl(result.info.secure_url);
			toast.success("Job description uploaded successfully.");
		}
	};

	const renderEnhancedData = (data: any) => {
		if (typeof data !== "object" || data === null) {
			return <p>{String(data)}</p>;
		}

		return Object.entries(data).map(([key, value]) => (
			<Card key={key} className="mb-4">
				<CardHeader>
					<CardTitle>
						{key.charAt(0).toUpperCase() + key.slice(1)}
					</CardTitle>
				</CardHeader>
				<CardContent>
					{Array.isArray(value) ? (
						<ul className="list-disc pl-5">
							{value.map((item, index) => (
								<li key={index}>
									{typeof item === "object"
										? renderObjectContent(item)
										: String(item)}
								</li>
							))}
						</ul>
					) : typeof value === "object" ? (
						renderObjectContent(value)
					) : (
						<p>{String(value)}</p>
					)}
				</CardContent>
			</Card>
		));
	};

	const renderObjectContent = (obj: any) => {
		return (
			<ul className="list-none pl-0">
				{Object.entries(obj).map(([subKey, subValue]) => (
					<li key={subKey} className="mb-2">
						<strong>{subKey}:</strong>{" "}
						{typeof subValue === "object"
							? JSON.stringify(subValue)
							: String(subValue)}
					</li>
				))}
			</ul>
		);
	};

	const ResumeSection: React.FC<{ title: string; items: string[] }> = ({
		title,
		items,
	}) => (
		<Card className="mb-4">
			<CardHeader>
				<CardTitle>{title}</CardTitle>
			</CardHeader>
			<CardContent>
				<ul className="list-disc pl-5">
					{items.map((item, index) => (
						<li key={index}>{item}</li>
					))}
				</ul>
			</CardContent>
		</Card>
	);

	const ResumePreviewTrigger: React.FC = () => (
		<Button variant="outline" onClick={() => setIsResumePreviewOpen(true)}>
			<FileText className="mr-2 h-4 w-4" />
			View Resume
		</Button>
	);

	const ResumePreviewContent: React.FC = () => (
		<>
			<div className="p-4 pb-0">
				<div className="aspect-[8.5/11] bg-white">
					<iframe
						src={userData?.resumeUrl}
						className="w-full h-full"
						title="Resume Preview"
					/>
				</div>
			</div>
		</>
	);

	return (
		<div className="container mx-auto px-4 py-8">
			<h1 className="text-4xl font-bold text-center mb-8">
				Resume Enhancer
			</h1>
			<div className="mb-4 w-full flex flex-col text-center items-center justify-center">
				<div className="flex space-x-2">
					<CldUploadWidget
						uploadPreset="raiseume"
						onSuccess={handleJobDescriptionUpload}
					>
						{({ open }) => (
							<Button
								type="button"
								variant="outline"
								onClick={() => open()}
							>
								<Upload className="mr-2 h-4 w-4" />
								{jobDescriptionUrl
									? "Change Job Description"
									: "Upload Job Description"}
							</Button>
						)}
					</CldUploadWidget>

					{isMobile ? (
						<Drawer
							open={isResumePreviewOpen}
							onOpenChange={setIsResumePreviewOpen}
						>
							<DrawerTrigger asChild>
								<ResumePreviewTrigger />
							</DrawerTrigger>
							<DrawerContent>
								<DrawerHeader>
									<DrawerTitle>Resume Preview</DrawerTitle>
									<DrawerDescription>
										Your uploaded resume
									</DrawerDescription>
								</DrawerHeader>
								<ResumePreviewContent />
								<DrawerFooter>
									<DrawerClose asChild>
										<Button variant="outline">Close</Button>
									</DrawerClose>
								</DrawerFooter>
							</DrawerContent>
						</Drawer>
					) : (
						<Sheet
							open={isResumePreviewOpen}
							onOpenChange={setIsResumePreviewOpen}
						>
							<SheetTrigger asChild>
								<ResumePreviewTrigger />
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
								<ResumePreviewContent />
								<SheetFooter>
									<SheetClose asChild>
										<Button
											variant="outline"
											className="mt-2"
										>
											Close
										</Button>
									</SheetClose>
								</SheetFooter>
							</SheetContent>
						</Sheet>
					)}
				</div>
				{jobDescriptionUrl && (
					<div className="text-sm text-muted-foreground mt-2">
						Job description uploaded successfully.
					</div>
				)}
			</div>

			<div className="flex flex-col md:flex-row gap-8">
				<div className="w-full md:w-1/2">
					<h2 className="text-2xl font-semibold mb-4">
						Current Resume
					</h2>
					<ScrollArea className="h-[calc(90vh-300px)] pr-4">
						<ResumeSection
							title="Skills"
							items={userData?.skills || []}
						/>
						<ResumeSection
							title="Experience"
							items={userData?.experience || []}
						/>
						<ResumeSection
							title="Education"
							items={userData?.education || []}
						/>
						<ResumeSection
							title="Projects"
							items={userData?.projects || []}
						/>
						<ResumeSection
							title="Certifications"
							items={userData?.certifications || []}
						/>
					</ScrollArea>
				</div>

				<div className="w-full md:w-1/2">
					<h2 className="text-2xl font-semibold mb-4 text-primary">
						Enhanced Resume
					</h2>
					{isEnhancing ? (
						<div className="flex items-center justify-center h-[calc(90vh-300px)]">
							<Loader2 className="h-16 w-16 animate-spin text-primary" />
						</div>
					) : enhancedData ? (
						<ScrollArea className="h-[calc(90vh-300px)] pr-4">
							{renderEnhancedData(enhancedData)}
						</ScrollArea>
					) : (
						<div className="flex items-center justify-center h-[calc(90vh-300px)]">
							<p className="text-center text-gray-500">
								Click "Enhance Resume" to see improvement
								suggestions.
							</p>
						</div>
					)}
				</div>
			</div>
			<div className="mt-8 flex justify-center">
				<Button
					onClick={enhanceResume}
					disabled={
						isEnhancing ||
						!userData?.resumeUrl ||
						!jobDescriptionUrl
					}
					className="w-64 h-12 text-lg"
				>
					{isEnhancing ? (
						<>
							<Loader2 className="mr-2 h-4 w-4 animate-spin" />
							Enhancing...
						</>
					) : (
						"Enhance Resume"
					)}
				</Button>
			</div>
		</div>
	);
}
