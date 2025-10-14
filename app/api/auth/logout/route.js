import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET() {
	console.log("🚀 Starting logout process...");

	try {
		console.log("🔗 Creating Supabase client...");
		const supabase = await createClient();

		// Authenticate user with Supabase Auth
		console.log("👤 Logging user out with Supabase Auth...");
		const { error } = await supabase.auth.signOut();

		if (error) {
			console.error("❌ Supabase Auth logout error:", error);
			return NextResponse.json({ error: error.message }, { status: 401 });
		}

		console.log("✅ User logout successfully");

		console.log("🎉 Logout process completed successfully");

		// Optionally, you can return the user/session info
		return NextResponse.json(
			{ message: "Logout process completed successfully" },
			{ status: 200 },
		);
	} catch (error) {
		console.error("💥 Unexpected error during login:", error);
		console.error("📊 Error details:", {
			message: error.message,
			stack: error.stack,
			name: error.name,
		});
		return NextResponse.json(
			{ error: "An unexpected error occurred during login." },
			{ status: 500 },
		);
	}
}
