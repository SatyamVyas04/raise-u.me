import React, { useState } from "react";

const AddYourResume: React.FC = () => {
	const [resume, setResume] = useState<File | null>(null);

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (event.target.files && event.target.files[0]) {
			setResume(event.target.files[0]);
		}
	};

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		// Add form submission logic here
		if (resume) {
			console.log("Resume file:", resume);
			// Example: You could send the file to an API endpoint
		}
	};

	return (
		<div className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto mt-10">
			<h2 className="text-2xl font-semibold text-gray-800 mb-4">
				Add Your Resume
			</h2>
			<form onSubmit={handleSubmit}>
				<div className="mb-4">
					<label
						htmlFor="resume"
						className="block text-gray-700 text-sm font-medium mb-2"
					>
						Upload your resume (PDF or DOCX):
					</label>
					<input
						type="file"
						id="resume"
						accept=".pdf, .docx"
						onChange={handleFileChange}
						className="block w-full text-sm text-gray-500 border border-gray-300 rounded-lg cursor-pointer focus:outline-none focus:border-blue-500"
					/>
				</div>
				<button
					type="submit"
					className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out"
				>
					Submit
				</button>
			</form>
		</div>
	);
};

export default AddYourResume;
