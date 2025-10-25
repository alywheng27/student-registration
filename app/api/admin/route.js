import { NextResponse } from "next/server"
import { createClient } from "@/utils/supabase/server"

export async function POST(request) {
	console.log("✅ Admin registration request received.")
	try {
		const formData = await request.formData()
		const first_name = formData.get("first_name")
		const middle_name = formData.get("middle_name")
		const surname = formData.get("surname")
		const extension_name = formData.get("extension_name")
		const email = formData.get("email")
		const password = formData.get("password")
		console.log("📝 Form data parsed:", {
			first_name,
			middle_name,
			surname,
			extension_name,
			email,
			// password is not logged for security reasons
		})

		if (!email || !first_name || !surname || !password) {
			console.log("❌ Validation failed: Missing required fields.")
			return NextResponse.json(
				{ error: "First name, surname, email, and password are required." },
				{ status: 400 },
			)
		}

		const supabase = await createClient()

		const { data, error } = await supabase.auth.signUp({
			email,
			password,
			options: {
				data: {
					first_name,
					middle_name,
					surname,
					extension_name,
				},
			},
		})
		if (error) {
			console.error("❌ Supabase signUp error:", error.message)
			return NextResponse.json({ error: error.message }, { status: 401 })
		}
		console.log("✅ Supabase signUp successful for user ID:", data.user.id)

		const adminProfile = {
			uid: data.user.id,
			first_name,
			middle_name,
			surname,
			extension_name,
		}
		console.log("Attempting to insert admin profile:", adminProfile)

		const { error: adminError } = await supabase
			.from("Admins")
			.insert(adminProfile)

		if (adminError) {
			console.error("❌ Failed to create admin profile:", adminError.message)
			return NextResponse.json(
				{ error: adminError.message || "Failed to create admin profile." },
				{ status: 400 },
			)
		}

		console.log("✅ Admin profile created successfully.")
		return NextResponse.json({
			success: true,
			message: `Admin ${first_name} ${surname} has been added successfully!`,
		})
	} catch (error) {
		console.error(
			"❌ Unexpected error during admin registration:",
			error.message,
		)
		return NextResponse.json(
			{
				error:
					error.message ||
					"An unexpected error occurred during admin registration.",
			},
			{ status: 500 },
		)
	}
}
