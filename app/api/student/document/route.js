import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function PUT(request) {
	console.log("🚀 Starting update process...");

	try {
		// Parse FormData instead of JSON to handle file uploads
		console.log("📝 Parsing FormData...");
		const formData = await request.formData();

		const id = formData.get("id");
		const type = formData.get("type");

		// Requirements
		const document = formData.get("document");

		console.log("📋 Form data extracted");

		console.log("🔗 Creating Supabase client...");
		const supabase = await createClient();

		// Handle grade card document upload if provided
		let documentUrl = null;
		if (document && document.size > 0) {
			console.log("📸 Processing document upload...");
			const fileExtension = document.name.split(".").pop();
			const fileName = `${document.name}-${id}-${Date.now()}.${fileExtension}`;

			console.log("📁 Uploading file");

			const { error: uploadError } = await supabase.storage
				.from("Documents")
				.upload(fileName, document);

			if (uploadError) {
				console.error("❌ Document upload error:", uploadError);
				// Don't fail registration if document upload fails
			} else {
				console.log("✅ Document uploaded successfully");
				// Get public URL for the uploaded document
				const { data: documentData } = await supabase.storage
					.from("Documents")
					.getPublicUrl(fileName);
				documentUrl = documentData.publicUrl;
			}
		} else {
			console.log("📸 No document provided");
		}

		// Insert user document data into Document table
		console.log("💾 Updating user document data into database...");
		const documentData =
			type === "birth_certificate"
				? { birth_certificate: documentUrl, birth_certificate_status: 1 }
				: type === "grade_card"
					? { grade_card: documentUrl, grade_card_status: 1 }
					: { good_moral: documentUrl, good_moral_status: 1 };

		console.log(documentData);

		const { data: documentUpdatedData, error: documentError } = await supabase
			.from("Documents")
			.update(documentData)
			.eq("uid", id)
			.select();

		if (documentError) {
			console.error("❌ Document creation error:", documentError);
			// Don't fail registration if document creation fails
			return NextResponse.json(
				{ error: documentError.message },
				{ status: 400 },
			);
		} else {
			console.log("✅ Document data inserted successfully");
		}

		const responseData = {
			data: documentUpdatedData,
			message: "Document data updated successfully!",
		};

		console.log("🎉 Update process completed successfully");
		console.log("📤 Sending response:", {
			data: responseData.data,
			message: responseData.message,
		});

		return NextResponse.json(responseData);
	} catch (error) {
		console.error("💥 Unexpected error during update:", error);
		console.error("📊 Error details:", {
			message: error.message,
			stack: error.stack,
			name: error.name,
		});
		return NextResponse.json(
			{ error: "An unexpected error occurred during update." },
			{ status: 500 },
		);
	}
}
