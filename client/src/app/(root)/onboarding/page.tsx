import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function page() {
	return (
		<div>
			<h1>Onboarding Form</h1>
			<Button>
				<Link href="/home">Proceed to the Dashboard</Link>
			</Button>
		</div>
	);
}
