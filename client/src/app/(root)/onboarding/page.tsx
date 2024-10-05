"use client";
import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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

const formSchema = z.object({
	name: z.string().min(1, { message: "Name is required" }),
	skills: z.string().min(1, { message: "At least one skill is required" }),
	occupation: z.string().min(1, { message: "Occupation is required" }),
	education: z
		.string()
		.min(1, { message: "At least one education entry is required" }),
	positionsOfResponsibility: z.string().min(1, {
		message: "At least one position of responsibility is required",
	}),
	experience: z
		.string()
		.min(1, { message: "At least one experience entry is required" }),
	urls: z.string().min(1, { message: "At least one URL is required" }),
	resumeLink: z.string().url({ message: "Resume link must be a valid URL" }),
});

type FormValues = z.infer<typeof formSchema>;

export default function Page() {
	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: "",
			skills: "",
			occupation: "",
			education: "",
			positionsOfResponsibility: "",
			experience: "",
			urls: "",
			resumeLink: "",
		},
	});

	const router = useRouter();

	const onSubmit: SubmitHandler<FormValues> = async (data) => {
		try {
			const response = await fetch("/api/user", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					...data,
					skills: data.skills.split(",").map((skill) => skill.trim()),
					education: data.education
						.split(",")
						.map((edu) => edu.trim()),
					positionsOfResponsibility: data.positionsOfResponsibility
						.split(",")
						.map((pos) => pos.trim()),
					experience: data.experience
						.split(",")
						.map((exp) => exp.trim()),
					urls: data.urls.split(",").map((url) => url.trim()),
				}),
			});

			if (response.ok) {
				console.log("User created successfully");
				toast.success("User created successfully");
				setTimeout(() => {
					router.push("/home");
				}, 2000);
				// Handle success (e.g., show a success message, redirect, etc.)
			} else {
				console.error("Failed to create user");
				toast.error("Failed to create user");
				// Handle error (e.g., show an error message)
			}
		} catch (error) {
			console.error("Error:", error);
			toast.error("Error creating user");
			// Handle error (e.g., show an error message)
		}
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
				<FormField
					control={form.control}
					name="name"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Name</FormLabel>
							<FormControl>
								<Input placeholder="John Doe" {...field} />
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
								<Input
									placeholder="JavaScript, React, Node.js"
									{...field}
								/>
							</FormControl>
							<FormDescription>
								Enter skills separated by commas
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
								<Input
									placeholder="Software Engineer"
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

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
								/>
							</FormControl>
							<FormDescription>
								Enter education details separated by commas
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
							<FormLabel>Positions of Responsibility</FormLabel>
							<FormControl>
								<Textarea
									placeholder="Team Lead, Project Manager"
									{...field}
								/>
							</FormControl>
							<FormDescription>
								Enter positions separated by commas
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
								/>
							</FormControl>
							<FormDescription>
								Enter experiences separated by commas
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
								<Input
									placeholder="https://github.com/johndoe, https://linkedin.com/in/johndoe"
									{...field}
								/>
							</FormControl>
							<FormDescription>
								Enter URLs separated by commas
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="resumeLink"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Resume Link</FormLabel>
							<FormControl>
								<Input
									placeholder="https://example.com/resume.pdf"
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<Button type="submit">Submit</Button>
			</form>
		</Form>
	);
}
