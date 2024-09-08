import {
	HomeIcon,
	UserCircleIcon as ProfileIcon,
	CalculatorIcon as RoadmapIcon,
	DocumentPlusIcon,
	DocumentCheckIcon,
} from "@heroicons/react/20/solid";

export const sidebarLinks = [
	{ label: "Home", route: "/home", imgUrl: HomeIcon },
	{ label: "Profile", route: "/profile", imgUrl: ProfileIcon },
	{ label: "ResumeEnhancer", route: "/enhancer", imgUrl: DocumentCheckIcon },
	{ label: "ResumeBuilder", route: "/builder", imgUrl: DocumentPlusIcon },
];