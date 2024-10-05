// app/api/users/route.ts
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbconnect";
import User from "@/models/User";

export async function GET() {
	try {
		await dbConnect();
		const users = await User.find({});
		return NextResponse.json(users);
	} catch (error) {
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 }
		);
	}
}

export async function POST(request: NextRequest) {
	try {
		await dbConnect();
		const userData = await request.json();
		const newUser = new User(userData);
		const savedUser = await newUser.save();
		return NextResponse.json(savedUser, { status: 201 });
	} catch (error) {
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 }
		);
	}
}
