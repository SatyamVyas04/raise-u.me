"use client";
import React, { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useUser } from "@clerk/nextjs";
import { CldUploadWidget } from "next-cloudinary";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
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
import { PlusCircle, FileText, Loader2, Upload } from "lucide-react";
import { useMediaQuery } from "@/hooks/use-media-query";

const formSchema = z.object({
	name: z.string().min(1, { message: "Name is required" }),
	skills: z
		.array(z.string())
		.min(1, { message: "At least one skill is required" }),
	occupation: z.string().min(1, { message: "Occupation is required" }),
	education: z
		.array(z.string())
		.min(1, { message: "At least one education entry is required" }),
	positionsOfResponsibility: z.array(z.string()).min(1, {
		message: "At least one position of responsibility is required",
	}),
	experience: z
		.array(z.string())
		.min(1, { message: "At least one experience entry is required" }),
	urls: z
		.array(z.string().url())
		.min(1, { message: "At least one URL is required" }),
	resumeUrl: z.string().url({ message: "Resume link must be a valid URL" }),
	resumePublicId: z
		.string()
		.min(1, { message: "Resume public ID is required" }),
	projects: z.array(z.string()),
	certifications: z.array(z.string()),
});

type FormValues = z.infer<typeof formSchema>;

const commonSkills = [
	"JavaScript",
	"React",
	"Node.js",
	"Python",
	"Java",
	"C++",
	"TypeScript",
	"HTML",
	"CSS",
	"SQL",
	"Git",
	"Docker",
	"Kubernetes",
	"AWS",
	"Azure",
	"Machine Learning",
	"Data Analysis",
	"UI/UX Design",
	"Agile",
	"Scrum",
];

const jobCategories = {
	Technology: {
		"Software Development": [
			"Frontend Developer",
			"Backend Developer",
			"Full Stack Developer",
			"Mobile App Developer",
		],
		"Data Science": [
			"Data Analyst",
			"Data Scientist",
			"Machine Learning Engineer",
		],
		DevOps: [
			"DevOps Engineer",
			"Site Reliability Engineer",
			"Cloud Architect",
		],
	},
	Business: {
		Management: ["Project Manager", "Product Manager", "Business Analyst"],
		Marketing: [
			"Digital Marketing Specialist",
			"Content Strategist",
			"SEO Specialist",
		],
		Finance: ["Financial Analyst", "Accountant", "Investment Banker"],
	},
	Design: {
		"UX/UI": ["UX Designer", "UI Designer", "Interaction Designer"],
		"Graphic Design": ["Graphic Designer", "Illustrator", "Brand Designer"],
	},
};

export default function UserProfileForm() {
	const { user } = useUser();
	const [userData, setUserData] = useState<FormValues | null>(null);
	const [isResumePreviewOpen, setIsResumePreviewOpen] = useState(false);
	const isMobile = useMediaQuery("(max-width: 768px)");
	const [isLoading, setIsLoading] = useState(true);
	const router = useRouter();

	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: "",
			skills: [],
			occupation: "",
			education: [],
			positionsOfResponsibility: [],
			experience: [],
			urls: [],
			resumeUrl: "",
			resumePublicId: "",
			projects: [],
			certifications: [],
		},
	});

	useEffect(() => {
		const fetchUserData = async () => {
			if (user?.username) {
				try {
					const response = await fetch(`/api/user/${user.username}`);
					if (response.ok) {
						const data = await response.json();
						setUserData(data);
						form.reset(data);
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
	}, [user, form]);

	const onSubmit: SubmitHandler<FormValues> = async (data) => {
		if (!user?.username) {
			toast.error("User not authenticated");
			return;
		}

		try {
			const url = userData ? `/api/user/${user.username}` : "/api/user";
			const method = userData ? "PUT" : "POST";

			const response = await fetch(url, {
				method: method,
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					...data,
					username: user.username,
				}),
			});

			if (response.ok) {
				toast.success(
					userData
						? "Profile updated successfully"
						: "Profile created successfully"
				);
				setTimeout(() => {
					router.push("/home");
				}, 2000);
			} else {
				toast.error(
					userData
						? "Failed to update profile"
						: "Failed to create profile"
				);
			}
		} catch (error) {
			console.error("Error:", error);
			toast.error(
				userData ? "Error updating profile" : "Error creating profile"
			);
		}
	};

	const addSkill = (skill: string) => {
		const currentSkills = form.getValues("skills");
		if (!currentSkills.includes(skill)) {
			form.setValue("skills", [...currentSkills, skill]);
		}
	};

	const ResumePreviewTrigger = () => (
		<Button variant="outline" onClick={() => setIsResumePreviewOpen(true)}>
			<FileText className="mr-2 h-4 w-4" />
			View Resume
		</Button>
	);

	const ResumePreviewContent = () => (
		<>
			<div className="p-4 pb-0">
				<div className="aspect-[8.5/11] bg-white">
					<iframe
						src={form.watch("resumeUrl")}
						className="w-full h-full"
						title="Resume Preview"
					/>
				</div>
			</div>
		</>
	);

	if (isLoading) {
		return (
			<div className="flex justify-center items-center h-screen w-screen">
				<Loader2 className="h-16 w-16 animate-spin text-primary" />
			</div>
		);
	}

	return (
		<div className="container mx-auto p-4">
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="space-y-8"
				>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
						<div className="space-y-8">
							<FormField
								control={form.control}
								name="name"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Name</FormLabel>
										<FormControl>
											<Input
												placeholder="John Doe"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="skills"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Skills</FormLabel>
										<FormControl>
											<div>
												<Input
													placeholder="Enter a skill"
													onKeyPress={(e) => {
														if (e.key === "Enter") {
															e.preventDefault();
															const input =
																e.target as HTMLInputElement;
															addSkill(
																input.value
															);
															input.value = "";
														}
													}}
												/>
												<div className="mt-2 flex flex-wrap gap-2">
													{field.value.map(
														(skill, index) => (
															<Button
																key={index}
																variant="outline"
																className="border-primary text-primary"
																size="sm"
																onClick={() => {
																	const newSkills =
																		field.value.filter(
																			(
																				_,
																				i
																			) =>
																				i !==
																				index
																		);
																	form.setValue(
																		"skills",
																		newSkills
																	);
																}}
															>
																{skill} x
															</Button>
														)
													)}
												</div>
											</div>
										</FormControl>
										<FormDescription>
											Common skills:
											<div className="flex flex-wrap gap-2 mt-2">
												{commonSkills.map((skill) => (
													<Button
														key={skill}
														variant="outline"
														size="sm"
														onClick={() =>
															addSkill(skill)
														}
													>
														<PlusCircle className="mr-2 h-4 w-4 text-primary" />{" "}
														{skill}
													</Button>
												))}
											</div>
										</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="occupation"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Occupation</FormLabel>
										<FormControl>
											<Input {...field} />
										</FormControl>
										<FormDescription>
											Select from job categories:
											<Tabs
												defaultValue="Technology"
												className="w-full mt-2"
											>
												<TabsList className="grid w-full grid-cols-3">
													{Object.keys(
														jobCategories
													).map((category) => (
														<TabsTrigger
															key={category}
															value={category}
														>
															{category}
														</TabsTrigger>
													))}
												</TabsList>
												{Object.entries(
													jobCategories
												).map(
													([
														category,
														subcategories,
													]) => (
														<TabsContent
															key={category}
															value={category}
														>
															<ScrollArea className="h-[150px] w-full rounded-md border p-4">
																{Object.entries(
																	subcategories
																).map(
																	([
																		subcategory,
																		jobs,
																	]) => (
																		<div
																			key={
																				subcategory
																			}
																			className="mb-4"
																		>
																			<h4 className="font-semibold mb-2">
																				{
																					subcategory
																				}
																			</h4>
																			<div className="grid grid-cols-2 gap-2">
																				{jobs.map(
																					(
																						job
																					) => (
																						<Button
																							key={
																								job
																							}
																							variant="outline"
																							size="sm"
																							onClick={() =>
																								form.setValue(
																									"occupation",
																									job
																								)
																							}
																						>
																							{
																								job
																							}
																						</Button>
																					)
																				)}
																			</div>
																		</div>
																	)
																)}
															</ScrollArea>
														</TabsContent>
													)
												)}
											</Tabs>
										</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="projects"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Projects</FormLabel>
										<FormControl>
											<Textarea
												placeholder="Project 1: Description&#10;Project 2: Description"
												{...field}
												onChange={(e) =>
													form.setValue(
														"projects",
														e.target.value.split(
															"\n"
														)
													)
												}
												value={field.value.join("\n")}
											/>
										</FormControl>
										<FormDescription>
											Enter each project on a new line
										</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						<div className="space-y-8">
							<FormField
								control={form.control}
								name="education"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Education</FormLabel>
										<FormControl>
											<Textarea
												placeholder="BS Computer Science, University of Example"
												{...field}
												onChange={(e) =>
													form.setValue(
														"education",
														e.target.value.split(
															"\n"
														)
													)
												}
												value={field.value.join("\n")}
											/>
										</FormControl>
										<FormDescription>
											Enter each education detail on a new
											line
										</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="positionsOfResponsibility"
								render={({ field }) => (
									<FormItem>
										<FormLabel>
											Positions of Responsibility
										</FormLabel>
										<FormControl>
											<Textarea
												placeholder="Team Lead, Project Manager"
												{...field}
												onChange={(e) =>
													form.setValue(
														"positionsOfResponsibility",
														e.target.value.split(
															"\n"
														)
													)
												}
												value={field.value.join("\n")}
											/>
										</FormControl>
										<FormDescription>
											Enter each position on a new line
										</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="experience"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Experience</FormLabel>
										<FormControl>
											<Textarea
												placeholder="2 years at Company A, 3 years at Company B"
												{...field}
												onChange={(e) =>
													form.setValue(
														"experience",
														e.target.value.split(
															"\n"
														)
													)
												}
												value={field.value.join("\n")}
											/>
										</FormControl>
										<FormDescription>
											Enter each experience on a new line
										</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="urls"
								render={({ field }) => (
									<FormItem>
										<FormLabel>URLs</FormLabel>
										<FormControl>
											<Textarea
												placeholder="https://github.com/johndoe"
												{...field}
												onChange={(e) =>
													form.setValue(
														"urls",
														e.target.value.split(
															"\n"
														)
													)
												}
												value={field.value.join("\n")}
											/>
										</FormControl>
										<FormDescription>
											Enter each URL on a new line
										</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="resumeUrl"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Resume</FormLabel>
										<FormControl>
											<div className="space-y-2">
												<div className="flex space-x-2">
													<CldUploadWidget
														uploadPreset="raiseume"
														onSuccess={(
															results
														) => {
															form.setValue(
																"resumeUrl",
																results?.info
																	?.secure_url // ignore error
															);
															form.setValue(
																"resumePublicId",
																results?.info
																	?.public_id // ignore error
															);
															toast.success(
																"Resume uploaded successfully"
															);
														}}
													>
														{({ open }) => (
															<Button
																type="button"
																variant="outline"
																onClick={() =>
																	open()
																}
															>
																<Upload className="mr-2 h-4 w-4" />
																{form.watch(
																	"resumeUrl"
																)
																	? "Change Resume"
																	: "Upload Resume"}
															</Button>
														)}
													</CldUploadWidget>

													{isMobile ? (
														<Drawer
															open={
																isResumePreviewOpen
															}
															onOpenChange={
																setIsResumePreviewOpen
															}
														>
															<DrawerTrigger
																asChild
															>
																<ResumePreviewTrigger />
															</DrawerTrigger>
															<DrawerContent>
																<DrawerHeader>
																	<DrawerTitle>
																		Resume
																		Preview
																	</DrawerTitle>
																	<DrawerDescription>
																		Your
																		uploaded
																		resume
																	</DrawerDescription>
																</DrawerHeader>
																<ResumePreviewContent />
																<DrawerFooter>
																	<DrawerClose
																		asChild
																	>
																		<Button variant="outline">
																			Close
																		</Button>
																	</DrawerClose>
																</DrawerFooter>
															</DrawerContent>
														</Drawer>
													) : (
														<Sheet
															open={
																isResumePreviewOpen
															}
															onOpenChange={
																setIsResumePreviewOpen
															}
														>
															<SheetTrigger
																asChild
															>
																<ResumePreviewTrigger />
															</SheetTrigger>
															<SheetContent
																side="right"
																className="w-[400px] sm:w-[540px]"
															>
																<SheetHeader>
																	<SheetTitle>
																		Resume
																		Preview
																	</SheetTitle>
																	<SheetDescription>
																		Your
																		uploaded
																		resume
																	</SheetDescription>
																</SheetHeader>
																<ResumePreviewContent />
																<SheetFooter>
																	<SheetClose
																		asChild
																	>
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
												{field.value && (
													<div className="text-sm text-muted-foreground">
														Resume uploaded
														successfully. Click
														&quot;View Resume&quot;
														to preview.
													</div>
												)}
											</div>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="certifications"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Certifications</FormLabel>
										<FormControl>
											<Textarea
												className="h-[124px]"
												placeholder="AWS Certified Solutions Architect&#10;Google Cloud Professional Data Engineer"
												{...field}
												onChange={(e) =>
													form.setValue(
														"certifications",
														e.target.value.split(
															"\n"
														)
													)
												}
												value={field.value.join("\n")}
											/>
										</FormControl>
										<FormDescription>
											Enter each certification on a new
											line
										</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
					</div>

					<Button type="submit" className="w-full">
						{userData ? "Update Profile" : "Create Profile"}
					</Button>
				</form>
			</Form>
		</div>
	);
}
