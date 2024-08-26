import { SignIn } from "@clerk/clerk-react";

const Login = () => {
	return (
		<div className="flex justify-center items-center min-h-screen">
			<SignIn routing="path" path="/login" />
		</div>
	);
};

export default Login;
