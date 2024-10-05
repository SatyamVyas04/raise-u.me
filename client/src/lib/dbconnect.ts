import mongoose from "mongoose";

type ConnectionObject = {
	isConnected?: number;
};

const connection: ConnectionObject = {};

export async function dbConnect(): Promise<void> {
	if (connection.isConnected) {
		console.log("Already connected to database");
		return;
	}
	try {
		const mongoUri = process.env.MONGO_URI;
		if (!mongoUri) {
			throw new Error(
				"MONGO_URI is not defined in environment variables"
			);
		}
		const db = await mongoose.connect(mongoUri);
		connection.isConnected = db.connections[0].readyState;
		console.log("Connected to database");
	} catch (error) {
		console.log("Error connecting to database: ", error);
		process.exit(1);
	}
}

export default dbConnect;
