import { NextResponse } from "next/server"
import { createClient } from "@/utils/supabase/server"

export async function POST(request) {
	console.log("[ADMIN] ✅ Admin registration request received.")
	try {
		const formData = await request.formData()
		const first_name = formData.get("first_name")
		const middle_name = formData.get("middle_name")
		const surname = formData.get("surname")
		const extension_name = formData.get("extension_name")
		const email = formData.get("email")
		const password = formData.get("password")
		console.log("[ADMIN] 📝 Form data parsed:", {
			first_name,
			middle_name,
			surname,
			extension_name,
			email,
			// password is not logged for security reasons
		})

		if (!email || !first_name || !surname || !password) {
			console.log("[ADMIN] ❌ Validation failed: Missing required fields.")
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
			console.error("[ADMIN] ❌ Supabase signUp error:", error.message)
			return NextResponse.json({ error: error.message }, { status: 401 })
		}
		console.log(
			"[ADMIN] ✅ Supabase signUp successful for user ID:",
			data.user.id,
		)

		const adminProfile = {
			uid: data.user.id,
			first_name,
			middle_name,
			surname,
			extension_name,
		}
		console.log("[ADMIN] Attempting to insert admin profile:", adminProfile)

		const { error: adminError } = await supabase
			.from("Admins")
			.insert(adminProfile)

		if (adminError) {
			console.error(
				"[ADMIN] ❌ Failed to create admin profile:",
				adminError.message,
			)
			return NextResponse.json(
				{ error: adminError.message || "Failed to create admin profile." },
				{ status: 400 },
			)
		}

		console.log("[ADMIN] ✅ Admin profile created successfully.")
		return NextResponse.json({
			success: true,
			message: `Admin ${first_name} ${surname} has been added successfully!`,
		})
	} catch (error) {
		console.error(
			"[ADMIN] ❌ Unexpected error during admin registration:",
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

export async function PUT(request) {
	console.log("[ADMIN] ⚡ Admin update request received.")
	try {
		const formData = await request.formData()
		const id = formData.get("id")
		const first_name = formData.get("first_name")
		const middle_name = formData.get("middle_name")
		const surname = formData.get("surname")
		const extension_name = formData.get("extension_name")
		const password = formData.get("password")
		console.log("[ADMIN] 📝 Form data (update) parsed:", {
			id,
			first_name,
			middle_name,
			surname,
			extension_name,
			// password is not logged
		})

		if (!id || !first_name || !surname) {
			console.log("[ADMIN] ❌ Validation failed on update: missing id/fields.")
			return NextResponse.json(
				{ error: "ID, first name, and surname are required for update." },
				{ status: 400 },
			)
		}

		const supabase = await createClient()

		const { error: updateError } = await supabase
			.from("Admins")
			.update({
				first_name,
				middle_name,
				surname,
				extension_name,
			})
			.eq("uid", id)

		if (updateError) {
			console.error(
				"[ADMIN] ❌ Failed to update admin profile:",
				updateError.message,
			)
			return NextResponse.json(
				{ error: updateError.message || "Failed to update admin profile." },
				{ status: 400 },
			)
		}

		// Optionally update the user's password if provided
		if (password !== "") {
			console.log("[ADMIN] 🔐 Attempting to update auth password...")
			const { error: errorUpdatedUser } = await supabase.auth.updateUser({
				password: password,
			})
			if (errorUpdatedUser) {
				console.error(
					"[ADMIN] ❌ Error when updating password:",
					errorUpdatedUser,
				)
				return NextResponse.json(
					{ error: errorUpdatedUser.message },
					{ status: 401 },
				)
			}
			console.log("[ADMIN] ✅ Password updated for user.")
		}

		console.log("[ADMIN] ✅ Admin profile updated successfully.")
		return NextResponse.json({
			success: true,
			message: `Admin ${first_name} ${surname} has been updated successfully!`,
		})
	} catch (error) {
		console.error(
			"[ADMIN] ❌ Unexpected error during admin update:",
			error.message,
		)
		return NextResponse.json(
			{
				error:
					error.message || "An unexpected error occurred during admin update.",
			},
			{ status: 500 },
		)
	}
}

export async function DELETE(request) {
	console.log("[ADMIN] ⚡ Admin delete request received.")
	try {
		const formData = await request.formData()
		const id = formData.get("id")
		console.log("[ADMIN] 📝 Form data (delete) parsed:", { id })

		if (!id) {
			console.log("[ADMIN] ❌ Validation failed on delete: missing id.")
			return NextResponse.json(
				{ error: "ID is required for admin deletion." },
				{ status: 400 },
			)
		}

		const supabase = await createClient()

		const { error: deleteError } = await supabase
			.from("Admins")
			.delete()
			.eq("uid", id)

		if (deleteError) {
			console.error(
				"[ADMIN] ❌ Failed to delete admin profile:",
				deleteError.message,
			)
			return NextResponse.json(
				{
					error: deleteError.message || "Failed to delete admin profile.",
				},
				{ status: 400 },
			)
		}

		// SECOND: Delete from Auth users table
		console.log(
			"[ADMIN] ⚡ Attempting to delete user from Supabase Auth users table...",
		)
		const { error: userDeleteError } = await supabase.auth.admin.deleteUser(id)
		if (userDeleteError) {
			console.error(
				"[ADMIN] ❌ Failed to delete auth user:",
				userDeleteError.message,
			)
			return NextResponse.json(
				{
					error:
						userDeleteError.message ||
						"Failed to delete user from Supabase Auth.",
				},
				{ status: 400 },
			)
		}
		console.log("[ADMIN] ✅ Auth user deleted successfully.")

		console.log("[ADMIN] ✅ Admin profile deleted successfully.")
		return NextResponse.json({
			success: true,
			message: `Admin has been deleted successfully!`,
		})
	} catch (error) {
		console.error(
			"[ADMIN] ❌ Unexpected error during admin deletion:",
			error.message,
		)
		return NextResponse.json(
			{
				error:
					error.message ||
					"An unexpected error occurred during admin deletion.",
			},
			{ status: 500 },
		)
	}
}
