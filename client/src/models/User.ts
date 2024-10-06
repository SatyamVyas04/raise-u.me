import { Schema, model, models, Document } from "mongoose";

interface IUser extends Document {
	name: string;
	username: string;
	skills: string[];
	occupation: string;
	education: string[];
	positionsOfResponsibility: string[];
	experience: string[];
	urls: string[];
	resumeUrl: string;
	resumePublicId: string;
	projects: string[];
	certifications: string[];
}

const UserSchema = new Schema<IUser>({
	name: { type: String, required: true },
	username: { type: String, required: true, unique: true },
	skills: { type: [String], required: true },
	occupation: { type: String, required: true },
	education: { type: [String], required: true },
	positionsOfResponsibility: { type: [String], required: true },
	experience: { type: [String], required: true },
	urls: { type: [String], required: true },
	resumeUrl: { type: String, required: true },
	resumePublicId: { type: String, required: true },
	projects: { type: [String] },
	certifications: { type: [String] },
});

UserSchema.path("name").validate((name: string) => {
	return name.length > 0;
}, "Name cannot be empty.");

UserSchema.path("username").validate((username: string) => {
	return username.length > 0;
}, "Username cannot be empty.");

UserSchema.path("skills").validate((skills: string[]) => {
	return skills.length > 0;
}, "There must be at least one skill.");

UserSchema.path("occupation").validate((occupation: string) => {
	return occupation.length > 0;
}, "Occupation cannot be empty.");

UserSchema.path("education").validate((education: string[]) => {
	return education.length > 0;
}, "There must be at least one education entry.");

UserSchema.path("positionsOfResponsibility").validate((positions: string[]) => {
	return positions.length > 0;
}, "There must be at least one position of responsibility.");

UserSchema.path("experience").validate((experience: string[]) => {
	return experience.length > 0;
}, "There must be at least one experience entry.");

UserSchema.path("urls").validate((urls: string[]) => {
	return urls.length > 0;
}, "There must be at least one URL.");

UserSchema.path("resumeUrl").validate((resumeUrl: string) => {
	return resumeUrl.length > 0;
}, "Resume URL cannot be empty.");

UserSchema.path("resumePublicId").validate((resumePublicId: string) => {
	return resumePublicId.length > 0;
}, "Resume public ID cannot be empty.");

const User = models.User || model<IUser>("User", UserSchema);

export default User;
