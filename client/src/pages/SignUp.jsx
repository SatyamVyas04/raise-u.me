import { SignUp } from "@clerk/clerk-react";

const SignUpPage = () => {
	return (
		<div className="flex justify-center items-center min-h-screen">
			<SignUp routing="path" path="/signup" />
		</div>
	);
};

export default SignUpPage;
