// app/api/user/[username]/route.ts
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbconnect";
import User from "@/models/User";

export async function GET(
	request: NextRequest,
	{ params }: { params: { username: string } }
) {
	try {
		await dbConnect();
		const user = await User.findOne({ username: params.username });
		if (!user) {
			return NextResponse.json(
				{ error: "User not found" },
				{ status: 404 }
			);
		}
		return NextResponse.json(user);
	} catch (error) {
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 }
		);
	}
}

export async function PUT(
	request: NextRequest,
	{ params }: { params: { username: string } }
) {
	try {
		await dbConnect();
		const userData = await request.json();
		const updatedUser = await User.findOneAndUpdate(
			{ username: params.username },
			userData,
			{ new: true }
		);
		if (!updatedUser) {
			return NextResponse.json(
				{ error: "User not found" },
				{ status: 404 }
			);
		}
		return NextResponse.json(updatedUser);
	} catch (error) {
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 }
		);
	}
}

export async function DELETE(
	request: NextRequest,
	{ params }: { params: { username: string } }
) {
	try {
		await dbConnect();
		const deletedUser = await User.findOneAndDelete({
			username: params.username,
		});
		if (!deletedUser) {
			return NextResponse.json(
				{ error: "User not found" },
				{ status: 404 }
			);
		}
		return NextResponse.json({ message: "User deleted successfully" });
	} catch (error) {
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 }
		);
	}
}
