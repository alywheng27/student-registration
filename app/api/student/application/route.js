import { NextResponse } from "next/server"
import { createClient } from "@/utils/supabase/server"

export async function PUT(request) {
	console.log("[APPLICATION] 🚀 Starting application update process...")

	try {
		const formData = await request.formData()
		const id = formData.get("id")
		const status_id = formData.get("status_id")
		const step_id = formData.get("step_id")
		const last_updated = formData.get("last_updated")
		const reviewed_by = formData.get("reviewed_by")
		const note = formData.get("note")

		console.log("[APPLICATION] 📋 Extracted form data:", {
			id,
			status_id,
			step_id,
			last_updated,
			reviewed_by,
			note,
		})

		// Basic validation
		console.log("[APPLICATION] 🔍 Validating required fields...")
		if (
			!id ||
			!status_id ||
			!step_id ||
			!last_updated ||
			!reviewed_by ||
			!note
		) {
			console.error(
				"[APPLICATION] ❌ Validation failed - missing required fields:",
				{
					id: !!id,
					status_id: !!status_id,
					step_id: !!step_id,
					last_updated: !!last_updated,
					reviewed_by: !!reviewed_by,
					note: !!note,
				},
			)
			return NextResponse.json(
				{
					error:
						"Application ID, status, step, last updated, reviewed by, note are required",
				},
				{ status: 400 },
			)
		}
		console.log("[APPLICATION] ✅ All required fields validated")

		console.log("[APPLICATION] 🔗 Creating Supabase client...")
		const supabase = await createClient()

		console.log("[APPLICATION] 🔄 Updating application in Supabase...")
		const { error: updateError } = await supabase
			.from("Applications")
			.update({
				status_id,
				step_id,
				last_updated,
				reviewed_by,
				note,
			})
			.eq("uid", id)

		if (updateError) {
			console.error(
				"[APPLICATION] ❌ Supabase update error:",
				updateError.message,
			)
			return NextResponse.json(
				{ error: updateError.message || "Failed to update application status" },
				{ status: 500 },
			)
		}

		console.log("[APPLICATION] ✅ Application status updated successfully")
		return NextResponse.json({
			success: true,
			message: "Application status updated successfully",
		})
	} catch (error) {
		console.error(
			"[APPLICATION] 💥 Unexpected error during application update:",
			error,
		)
		console.error("[APPLICATION] 📊 Error details:", {
			message: error.message,
			stack: error.stack,
			name: error.name,
		})
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 },
		)
	}
}
