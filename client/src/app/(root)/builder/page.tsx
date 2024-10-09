"use client";
import React, { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { toast, Toaster } from "sonner";

interface ResumeTemplateProps {
	imageSrc: string;
}

const ResumeTemplate = ({ imageSrc }: ResumeTemplateProps) => (
	<div className="flex-shrink-0 w-48 h-64 bg-foreground rounded-lg shadow-md overflow-hidden transition-all duration-300 ease-in-out transform hover:scale-105">
		<Image
			src={imageSrc}
			alt="Resume template"
			width={192}
			height={256}
			objectFit="cover"
		/>
	</div>
);

const ResumeSlider = () => {
	const templates = [
		"/resume_template.png",
		"/resume_template2.png",
		"/resume_template.png",
		"/resume_template.png",
		"/resume_template2.png",
		"/resume_template2.png",
		"/resume_template2.png",
		"/resume_template2.png",
	];

	const [currentIndex, setCurrentIndex] = useState(0);
	const visibleTemplates =
		typeof window !== "undefined"
			? window.innerWidth < 640
				? 2
				: window.innerWidth < 768
				? 3
				: window.innerWidth < 1024
				? 4
				: 6
			: 6;

	const handlePrevClick = () => {
		setCurrentIndex((prevIndex) =>
			prevIndex === 0
				? templates.length - visibleTemplates
				: prevIndex - 1
		);
	};

	const handleNextClick = () => {
		setCurrentIndex((prevIndex) =>
			prevIndex === templates.length - visibleTemplates
				? 0
				: prevIndex + 1
		);
	};

	return (
		<div className="relative mx-auto max-w-sm min-w-sm sm:max-w-sm md:max-w-md lg:max-w-xl">
			<button
				onClick={handlePrevClick}
				className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-purple-600 hover:bg-purple-700 text-foreground rounded-full p-3 shadow-lg transition duration-300 ease-in-out z-10"
			>
				<ChevronLeft size={24} />
			</button>

			<button
				onClick={handleNextClick}
				className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-purple-600 hover:bg-purple-700 text-foreground rounded-full p-3 shadow-lg transition duration-300 ease-in-out z-10"
			>
				<ChevronRight size={24} />
			</button>

			<div className="overflow-hidden">
				<div
					className="flex space-x-4 transition-transform duration-300 ease-in-out"
					style={{
						transform: `translateX(-${
							currentIndex * (100 / visibleTemplates)
						}%)`,
					}}
				>
					{templates
						.concat(templates.slice(0, visibleTemplates))
						.map((template, index) => (
							<ResumeTemplate key={index} imageSrc={template} />
						))}
				</div>
			</div>
		</div>
	);
};

const JobDescriptionUploader = () => {
	const [jobDescriptions, setJobDescriptions] = useState("");

	const handleJobDescriptionsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setJobDescriptions(e.target.value);
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (!jobDescriptions.trim()) {
			toast.error("Please enter at least one job description.");
			return;
		}

		try {
			const descriptions = jobDescriptions.split('\n').filter(desc => desc.trim() !== '');
			
			// Here you would typically send the jobDescriptions to your backend
			console.log("Job Descriptions:", descriptions);

			toast.success("Job descriptions submitted successfully!");
		} catch (error) {
			console.error("Error:", error);
			toast.error("An error occurred while submitting the job descriptions.");
		}
	};
	

	return (
		<form onSubmit={handleSubmit} className="space-y-4">
			<textarea
				value={jobDescriptions}
				onChange={handleJobDescriptionsChange}
				placeholder="Enter job descriptions (one per line)"
				className="w-full px-4 py-2 rounded-md bg-accent bg-opacity-20 focus:outline-none focus:ring-2 focus:ring-purple-400 min-h-[16px]"
			/>
			
			<button
				type="submit"
				className="w-full px-4 py-2 bg-purple-500 hover:bg-purple-600 rounded-md transition duration-300"
			>
				Submit
			</button>
		</form>
	);
};

export default function Home() {
	return (
		<div className="min-h-full text-foreground">
			<Toaster richColors />
			<div className="container mx-auto px-4 pb-8 pt-14">
				<h1 className="text-4xl font-bold mb-8 text-center">
					Browse Templates
				</h1>

				<ResumeSlider />

				<div className="mt-20 max-w-md mx-auto">
					<div className="">
						<h2 className="text-3xl font-semibold mb-8 text-center">
							Build Your Resume
						</h2>
						<JobDescriptionUploader />
					</div>
				</div>
			</div>
		</div>
	);
}