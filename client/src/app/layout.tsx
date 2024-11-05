import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";

import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { ThemeProvider } from "@/components/theme-provider";

import { Toaster, toast } from "sonner";

const spaceGrotesk = Space_Grotesk({
	subsets: ["latin"],
	weight: ["300", "400", "500", "700"],
});

export const metadata: Metadata = {
	title: "raise-u.me",
	description: "Your AI-powered Resume Enhancer and Resume Builder",
	keywords: "Resume Enhancement, Resume Builder, Skill Diagnostics",
	robots: "index, follow",
	openGraph: {
		title: "raise-u.me - Your AI-powered Resume Specialist",
		description: "Your AI-powered Resume Enhancer and Resume Builder",
		siteName: "raise-u.me",
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className={spaceGrotesk.className}>
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
				>
					<ClerkProvider
						appearance={{
							baseTheme: dark,
							layout: {
								unsafe_disableDevelopmentModeWarnings: true,
							},
						}}
					>
						{children}
						<Toaster richColors position="bottom-right" />
					</ClerkProvider>
				</ThemeProvider>
			</body>
		</html>
	);
}
