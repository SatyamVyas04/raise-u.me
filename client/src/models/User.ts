import { Schema, model, Document } from "mongoose";

interface IUser extends Document {
	name: string;
	skills: string[];
	occupation: string;
	education: string[];
	positionsOfResponsibility: string[];
	experience: string[];
	urls: string[];
	resumeLink: string;
}

const UserSchema = new Schema<IUser>({
	name: { type: String, required: true },
	skills: { type: [String], required: true },
	occupation: { type: String, required: true },
	education: { type: [String], required: true },
	positionsOfResponsibility: { type: [String], required: true },
	experience: { type: [String], required: true },
	urls: { type: [String], required: true },
	resumeLink: { type: String, required: true },
});

const User = model<IUser>("User", UserSchema);

export default User;
UserSchema.path("name").validate((name: string) => {
	return name.length > 0;
}, "Name cannot be empty.");

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

UserSchema.path("resumeLink").validate((resumeLink: string) => {
	return resumeLink.length > 0;
}, "Resume link cannot be empty.");
