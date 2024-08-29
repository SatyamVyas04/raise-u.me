import { SignIn } from "@clerk/nextjs";

export default function page() {
	return (
		<div>
			<SignIn forceRedirectUrl="/onboarding" />
		</div>
	);
}
