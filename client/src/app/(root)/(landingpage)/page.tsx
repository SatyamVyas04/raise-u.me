"use client";
import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Cpu, Palette, MessageSquare } from "lucide-react";
import { Player, Controls } from "@lottiefiles/react-lottie-player";
import Link from "next/link";

export default function LandingPage() {
	// Animation variants
	const fadeInUp = {
		hidden: { opacity: 0, y: 50 },
		visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
	};

	const fadeInLeft = {
		hidden: { opacity: 0, x: -50 },
		visible: { opacity: 1, x: 0, transition: { duration: 0.6 } },
	};

	const fadeInRight = {
		hidden: { opacity: 0, x: 50 },
		visible: { opacity: 1, x: 0, transition: { duration: 0.6 } },
	};

	const staggerContainer = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				staggerChildren: 0.2,
			},
		},
	};

	return (
		<div className="min-h-screen bg-background text-foreground !overflow-x-hidden">
			{/* Hero Section */}
			<section className="min-h-screen container mx-auto py-12 md:py-24 px-4 flex items-center">
				<div className="absolute h-[90dvh] w-[45dvh] rounded-tl-full rounded-bl-full right-0 -z-0 bg-primary max-md:hidden blur-xl"></div>
				<div className="flex flex-col md:flex-row items-center justify-between w-full">
					<motion.div
						className="md:w-1/2 text-center md:text-left mb-8 md:mb-0"
						initial="hidden"
						whileInView="visible"
						viewport={{ once: true }}
						variants={fadeInLeft}
					>
						<h1 className="text-3xl md:text-6xl font-bold mb-6 text-primary">
							Elevate Your Career with raise-u.me
						</h1>
						<p className="text-lg md:text-xl mb-8 text-muted-foreground">
							Create stunning resumes and enhance your
							professional profile with our powerful tools.
						</p>
						<Button
							size="lg"
							className="bg-primary text-primary-foreground hover:bg-primary/90"
							onClick={() => (window.location.href = "/sign-up")}
						>
							Sign Up Now
						</Button>
					</motion.div>
					<motion.div
						className="md:w-1/2 mt-8 md:mt-0"
						initial="hidden"
						whileInView="visible"
						viewport={{ once: true }}
						variants={fadeInRight}
					>
						{/* Placeholder for Lottie animation */}
						<div className="h-64 md:h-96 rounded-lg flex items-center justify-center scale-125 lg:translate-x-16">
							<Player
								autoplay
								loop
								src="https://lottie.host/33b56ef5-16ca-4d48-a8e9-f2a510cae037/xq9TL4Picp.json"
							>
								<Controls
									visible={false}
									buttons={[
										"play",
										"repeat",
										"frame",
										"debug",
									]}
								/>
							</Player>
						</div>
					</motion.div>
				</div>
			</section>

			{/* Features Section */}
			<section className="relative bg-foreground text-primary py-12 md:py-24 px-4 border-primary">
				{/* Background with skew */}
				<div className="absolute inset-0 -z-0 skew-y-6 bg-primary shadow-lg shadow-foreground"></div>

				{/* Content */}
				<motion.div
					className="relative container mx-auto"
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true }}
					variants={staggerContainer}
				>
					<h2 className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12 text-foreground">
						Key Features
					</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
						{[
							{
								title: "AI-Powered Resume Builder",
								description:
									"Create professional resumes in minutes with our intelligent builder.",
								icon: (
									<Cpu className="w-10 h-10 mb-4 text-primary" />
								),
							},
							{
								title: "Custom Templates",
								description:
									"Choose from a wide range of industry-specific templates.",
								icon: (
									<Palette className="w-10 h-10 mb-4 text-primary" />
								),
							},
							{
								title: "Real-time Feedback",
								description:
									"Get instant suggestions to improve your resume as you write.",
								icon: (
									<MessageSquare className="w-10 h-10 mb-4 text-primary" />
								),
							},
						].map((feature, index) => (
							<motion.div
								key={index}
								variants={fadeInUp}
								custom={index}
								className="bg-card shadow-md shadow-foreground rounded-lg p-4"
							>
								<CardHeader>
									<div className="flex flex-col items-center">
										{feature.icon}
										<CardTitle className="text-card-foreground text-center">
											{feature.title}
										</CardTitle>
									</div>
								</CardHeader>
								<CardContent>
									<p className="text-card-foreground/80 text-center">
										{feature.description}
									</p>
								</CardContent>
							</motion.div>
						))}
					</div>
				</motion.div>
			</section>

			{/* Team Section */}
			<section className="py-12 md:py-24 px-4 relative overflow-hidden">
				<motion.div
					className="container mx-auto relative z-10"
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true }}
					variants={staggerContainer}
				>
					<h2 className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12 text-primary">
						Meet Our Team
					</h2>
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
						{[
							{
								name: "Shreya Rathod",
								role: "AI/ML Developer",
								linkedin:
									"https://www.linkedin.com/in/shreya-rathod-155364278/",
							},
							{
								name: "Tanush Salian",
								role: "Lead Web Developer",
								linkedin:
									"https://www.linkedin.com/in/tanush-salian-003276222/",
							},
							{
								name: "Satyam Vyas",
								role: "DevSecOps Team",
								linkedin:
									"https://www.linkedin.com/in/satyam-vyas/",
							},
						].map((member, index) => (
							<motion.div
								key={index}
								variants={fadeInUp}
								custom={index}
								className="text-center bg-card p-4 shadow-primary rounded-lg shadow-lg"
							>
								<Avatar className="w-24 h-24 mx-auto mb-4 border-4 border-primary">
									<AvatarFallback className="bg-primary-foreground text-primary text-xl font-bold">
										{member.name
											.split(" ")
											.map((n) => n[0])
											.join("")}
									</AvatarFallback>
								</Avatar>
								<h3 className="text-xl font-semibold mb-2">
									{member.name}
								</h3>
								<p className="text-muted-foreground">
									{member.role}
								</p>
								<Button variant="link" className="mt-2">
									<Link href={member.linkedin}>LinkedIn</Link>
								</Button>
							</motion.div>
						))}
					</div>
				</motion.div>

				{/* Decorative Elements */}
				<svg
					className="absolute top-0 left-0 text-primary/10"
					width="404"
					height="404"
					fill="none"
					viewBox="0 0 404 404"
					aria-hidden="true"
				>
					<defs>
						<pattern
							id="grid-pattern"
							x="0"
							y="0"
							width="20"
							height="20"
							patternUnits="userSpaceOnUse"
						>
							<rect
								x="0"
								y="0"
								width="4"
								height="4"
								className="text-primary/20"
								fill="currentColor"
							/>
						</pattern>
					</defs>
					<rect width="404" height="404" fill="url(#grid-pattern)" />
				</svg>
				<svg
					className="absolute bottom-0 right-0 text-primary/10"
					width="404"
					height="404"
					fill="none"
					viewBox="0 0 404 404"
					aria-hidden="true"
				>
					<defs>
						<pattern
							id="circle-pattern"
							x="0"
							y="0"
							width="20"
							height="20"
							patternUnits="userSpaceOnUse"
						>
							<circle
								cx="10"
								cy="10"
								r="3"
								className="text-primary/20"
								fill="currentColor"
							/>
						</pattern>
					</defs>
					<rect
						width="404"
						height="404"
						fill="url(#circle-pattern)"
					/>
				</svg>
			</section>

			{/* Call to Action */}
			<section className="bg-primary py-12 md:py-24 px-4 text-center">
				<motion.div
					className="container mx-auto"
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true }}
					variants={fadeInUp}
				>
					<h2 className="text-2xl md:text-3xl font-bold mb-4 text-primary-foreground">
						Join raise-u.me Today
					</h2>
					<p className="text-lg md:text-xl mb-8 text-primary-foreground/80">
						Boost your professional profile with ease and
						confidence.
					</p>
					<Button
						size="lg"
						className="bg-primary-foreground text-primary hover:bg-primary-foreground/90"
						onClick={() => (window.location.href = "/sign-up")}
					>
						Get Started
					</Button>
				</motion.div>
			</section>
		</div>
	);
}
