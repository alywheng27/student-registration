// Create a route.js for signing up using supabase then connect it to register page. Just like in login.

import { NextResponse } from "next/server"
import { createClient } from "@/utils/supabase/server"

export async function POST(request) {
	console.log("[REGISTER] 🚀 Starting registration process...")

	try {
		// Parse FormData instead of JSON to handle file uploads
		console.log("[REGISTER] 📝 Parsing FormData...")
		const formData = await request.formData()

		const first_name = formData.get("first_name")
		const middle_name = formData.get("middle_name")
		const surname = formData.get("surname")
		const extension_name = formData.get("extension_name")
		const email = formData.get("email")
		const phone = formData.get("phone")
		const date_of_birth_raw = formData.get("date_of_birth")
		const password = formData.get("password")
		const profilePhoto = formData.get("profilePhoto")

		// New fields
		const place_of_birth = formData.get("place_of_birth")
		const religion = formData.get("religion")
		const citizenship = formData.get("citizenship")
		const sex = formData.get("sex")
		const civil_status = formData.get("civil_status")
		const region = formData.get("region")
		const barangay = formData.get("barangay")
		const municipality = formData.get("municipality")
		const province = formData.get("province")

		// School fields
		const elementary = formData.get("elementary_school")
		const elementary_address = formData.get("elementary_school_address")
		const elementary_year_graduated = formData.get("elementary_year_graduated")
		const junior_high = formData.get("junior_high_school")
		const junior_high_address = formData.get("junior_high_school_address")
		const junior_high_year_graduated = formData.get(
			"junior_high_year_graduated",
		)
		const senior_high = formData.get("senior_high_school")
		const senior_high_address = formData.get("senior_high_school_address")
		const senior_high_year_graduated = formData.get(
			"senior_high_year_graduated",
		)

		// Parents
		const father_name = formData.get("father_name")
		const father_occupation = formData.get("father_occupation")
		const father_educational_attainment = formData.get("father_education")
		const mother_name = formData.get("mother_name")
		const mother_occupation = formData.get("mother_occupation")
		const mother_educational_attainment = formData.get("mother_education")
		const monthly_income = formData.get("monthly_income")
		// Emergency
		const name = formData.get("emergency_name")
		const relationship = formData.get("emergency_relationship")
		const home_address = formData.get("emergency_address")
		const emergency_phone = formData.get("emergency_phone")
		// Requirements
		const birth_certificate = formData.get("birth_certificate")
		const good_moral = formData.get("good_moral")
		const grade_card = formData.get("grade_card")

		console.log("[REGISTER] 📋 Form data extracted")

		// Convert date_of_birth to proper format for Supabase timestamptz type
		let date_of_birth = null
		if (date_of_birth_raw) {
			console.log("[REGISTER] 📅 Processing date_of_birth")
			// Convert YYYY-MM-DD string to ISO timestamp for timestamptz
			const date = new Date(date_of_birth_raw)
			if (!isNaN(date.getTime())) {
				// Convert to ISO string for timestamptz (includes timezone info)
				date_of_birth = date.toISOString()
				console.log("[REGISTER] ✅ Date converted to ISO timestamp")
			} else {
				console.error("[REGISTER] ❌ Invalid date format:", date_of_birth_raw)
			}
		} else {
			console.log("[REGISTER] 📅 No date_of_birth provided")
		}

		// Validate required fields
		console.log("[REGISTER] 🔍 Validating required fields...")
		if (!email || !password || !first_name || !surname) {
			console.error(
				"[REGISTER] ❌ Validation failed - missing required fields:",
				{
					email: !!email,
					password: !!password,
					first_name: !!first_name,
					surname: !!surname,
				},
			)
			return NextResponse.json(
				{ error: "Email, password, first name, and surname are required." },
				{ status: 400 },
			)
		}
		console.log("[REGISTER] ✅ All required fields validated")

		console.log("[REGISTER] 🔗 Creating Supabase client...")
		const supabase = await createClient()

		// Create user account with Supabase Auth
		console.log("[REGISTER] 👤 Creating user account with Supabase Auth...")
		const { data, error } = await supabase.auth.signUp({
			email,
			password,
			options: {
				data: {
					first_name,
					middle_name,
					surname,
					extension_name,
					phone,
					date_of_birth,
				},
			},
		})

		if (error) {
			console.error("[REGISTER] ❌ Supabase Auth signup error:", error)
			return NextResponse.json({ error: error.message }, { status: 401 })
		}

		console.log("[REGISTER] ✅ User account created successfully")

		// Handle profile photo upload if provided
		let photoUrl = null
		if (profilePhoto && profilePhoto.size > 0) {
			console.log("[REGISTER] 📸 Processing profile photo upload...")
			const fileExtension = profilePhoto.name.split(".").pop()
			const fileName = `${data.user.id}-${Date.now()}.${fileExtension}`

			console.log("[REGISTER] 📁 Uploading file")

			const { error: uploadError } = await supabase.storage
				.from("Profiles")
				.upload(fileName, profilePhoto)

			if (uploadError) {
				console.error("[REGISTER] ❌ Photo upload error:", uploadError)
				// Don't fail registration if photo upload fails
			} else {
				console.log("[REGISTER] ✅ Photo uploaded successfully")
				// Get public URL for the uploaded photo
				const { data: photoData } = await supabase.storage
					.from("Profiles")
					.getPublicUrl(fileName)
				photoUrl = photoData.publicUrl
			}
		} else {
			console.log("[REGISTER] 📸 No profile photo provided")
		}

		// Insert user profile data into Profiles table
		console.log("[REGISTER] 💾 Inserting user profile data into database...")
		const profileData = {
			uid: data.user.id,
			first_name,
			middle_name,
			surname,
			extension_name,
			phone,
			date_of_birth,
			photo_url: photoUrl,
			place_of_birth,
			religion,
			citizenship,
			sex_id: sex,
			civil_status_id: civil_status,
			region_id: region,
		}

		const { error: profileError } = await supabase
			.from("Profiles")
			.insert(profileData)

		if (profileError) {
			console.error("[REGISTER] ❌ Profile creation error:", profileError)
			// Don't fail registration if profile creation fails
			return NextResponse.json({ error: profileError.message }, { status: 400 })
		} else {
			console.log("[REGISTER] ✅ Profile data inserted successfully")
		}

		// Insert user address data into Address table
		console.log("[REGISTER] 💾 Inserting user address data into database...")
		const addressData = {
			uid: data.user.id,
			barangay,
			municipality,
			province,
		}

		const { error: addressError } = await supabase
			.from("Address")
			.insert(addressData)

		if (addressError) {
			console.error("[REGISTER] ❌ Address creation error:", addressError)
			// Don't fail registration if address creation fails
			return NextResponse.json({ error: addressError.message }, { status: 400 })
		} else {
			console.log("[REGISTER] ✅ Address data inserted successfully")
		}

		// Insert user school attended data into School_Attended table
		console.log(
			"[REGISTER] 💾 Inserting user school attended data into database...",
		)
		const schoolAttendedData = {
			uid: data.user.id,
			elementary,
			elementary_address,
			elementary_year_graduated,
			junior_high,
			junior_high_address,
			junior_high_year_graduated,
			senior_high,
			senior_high_address,
			senior_high_year_graduated,
		}

		const { error: schoolAttendedError } = await supabase
			.from("School_Attended")
			.insert(schoolAttendedData)

		if (schoolAttendedError) {
			console.error(
				"[REGISTER] ❌ School attended creation error:",
				schoolAttendedError,
			)
			// Don't fail registration if school attended creation fails
			return NextResponse.json(
				{ error: schoolAttendedError.message },
				{ status: 400 },
			)
		} else {
			console.log("[REGISTER] ✅ School attended data inserted successfully")
		}

		// Insert user parents data into Parents table
		console.log("[REGISTER] 💾 Inserting user parents data into database...")
		const parentsData = {
			uid: data.user.id,
			father_name,
			father_occupation,
			father_educational_attainment,
			mother_name,
			mother_occupation,
			mother_educational_attainment,
			monthly_income,
		}

		const { error: parentsError } = await supabase
			.from("Parents")
			.insert(parentsData)

		if (parentsError) {
			console.error("[REGISTER] ❌ Parents creation error:", parentsError)
			// Don't fail registration if parents creation fails
			return NextResponse.json({ error: parentsError.message }, { status: 400 })
		} else {
			console.log("[REGISTER] ✅ Parents data inserted successfully")
		}

		// Insert user emergency contact data into Emergency_Contact table
		console.log(
			"[REGISTER] 💾 Inserting user emergency contact data into database...",
		)
		const emergencyContactData = {
			uid: data.user.id,
			name,
			relationship,
			home_address,
			phone: emergency_phone,
		}

		const { error: emergencyContactError } = await supabase
			.from("Emergency_Contact")
			.insert(emergencyContactData)

		if (emergencyContactError) {
			console.error(
				"[REGISTER] ❌ Emergency contact creation error:",
				emergencyContactError,
			)
			// Don't fail registration if emergency contact creation fails
			return NextResponse.json(
				{ error: emergencyContactError.message },
				{ status: 400 },
			)
		} else {
			console.log("[REGISTER] ✅ Emergency contact data inserted successfully")
		}

		// Handle birth certificate document upload if provided
		let birthCertificateUrl = null
		if (birth_certificate && birth_certificate.size > 0) {
			console.log(
				"[REGISTER] 📸 Processing birth certificate document upload...",
			)
			const fileExtension = birth_certificate.name.split(".").pop()
			const fileName = `${birth_certificate.name}-${data.user.id}-${Date.now()}.${fileExtension}`

			console.log("[REGISTER] 📁 Uploading file")

			const { error: uploadError } = await supabase.storage
				.from("Documents")
				.upload(fileName, birth_certificate)

			if (uploadError) {
				console.error("[REGISTER] ❌ Document upload error:", uploadError)
				// Don't fail registration if document upload fails
			} else {
				console.log("[REGISTER] ✅ Document uploaded successfully")
				// Get public URL for the uploaded document
				const { data: documentData } = await supabase.storage
					.from("Documents")
					.getPublicUrl(fileName)
				birthCertificateUrl = documentData.publicUrl
			}
		} else {
			console.log("[REGISTER] 📸 No birth certificate document provided")
		}

		// Handle good moral document upload if provided
		let goodMoralUrl = null
		if (good_moral && good_moral.size > 0) {
			console.log("[REGISTER] 📸 Processing good moral document upload...")
			const fileExtension = good_moral.name.split(".").pop()
			const fileName = `${good_moral.name}-${data.user.id}-${Date.now()}.${fileExtension}`

			console.log("[REGISTER] 📁 Uploading file")

			const { error: uploadError } = await supabase.storage
				.from("Documents")
				.upload(fileName, good_moral)

			if (uploadError) {
				console.error("[REGISTER] ❌ Document upload error:", uploadError)
				// Don't fail registration if document upload fails
			} else {
				console.log("[REGISTER] ✅ Document uploaded successfully")
				// Get public URL for the uploaded document
				const { data: documentData } = await supabase.storage
					.from("Documents")
					.getPublicUrl(fileName)
				goodMoralUrl = documentData.publicUrl
			}
		} else {
			console.log("[REGISTER] 📸 No good moral document provided")
		}

		// Handle grade card document upload if provided
		let gradeCardUrl = null
		if (grade_card && grade_card.size > 0) {
			console.log("[REGISTER] 📸 Processing grade card document upload...")
			const fileExtension = grade_card.name.split(".").pop()
			const fileName = `${grade_card.name}-${data.user.id}-${Date.now()}.${fileExtension}`

			console.log("[REGISTER] 📁 Uploading file")

			const { error: uploadError } = await supabase.storage
				.from("Documents")
				.upload(fileName, grade_card)

			if (uploadError) {
				console.error("[REGISTER] ❌ Document upload error:", uploadError)
				// Don't fail registration if document upload fails
			} else {
				console.log("[REGISTER] ✅ Document uploaded successfully")
				// Get public URL for the uploaded document
				const { data: documentData } = await supabase.storage
					.from("Documents")
					.getPublicUrl(fileName)
				gradeCardUrl = documentData.publicUrl
			}
		} else {
			console.log("[REGISTER] 📸 No grade card document provided")
		}

		// Insert user documents data into Documents table
		console.log("[REGISTER] 💾 Inserting user documents data into database...")
		const documentsData = {
			uid: data.user.id,
			birth_certificate: birthCertificateUrl,
			birth_certificate_status: "1",
			good_moral: goodMoralUrl,
			good_moral_status: "1",
			grade_card: gradeCardUrl,
			grade_card_status: "1",
		}

		const { error: documentsError } = await supabase
			.from("Documents")
			.insert(documentsData)

		if (documentsError) {
			console.error("[REGISTER] ❌ Documents creation error:", documentsError)
			// Don't fail registration if documents creation fails
			return NextResponse.json(
				{ error: documentsError.message },
				{ status: 400 },
			)
		} else {
			console.log("[REGISTER] ✅ Documents data inserted successfully")
		}

		// Insert user application data into Documents table
		console.log(
			"[REGISTER] 💾 Inserting user application data into database...",
		)
		const applicationData = {
			uid: data.user.id,
			status_id: "1",
			step_id: "1",
		}

		const { error: applicationError } = await supabase
			.from("Applications")
			.insert(applicationData)

		if (applicationError) {
			console.error(
				"[REGISTER] ❌ Application creation error:",
				applicationError,
			)
			// Don't fail registration if application creation fails
			return NextResponse.json(
				{ error: applicationError.message },
				{ status: 400 },
			)
		} else {
			console.log("[REGISTER] ✅ Application data inserted successfully")
		}

		const responseData = {
			user: data.user,
			session: data.session,
			message:
				"Registration successful! Please check your email to verify your account.",
		}

		console.log("[REGISTER] 🎉 Registration process completed successfully")
		console.log("[REGISTER] 📤 Sending response:", {
			userId: responseData.user?.id,
			hasSession: !!responseData.session,
			message: responseData.message,
		})

		return NextResponse.json(responseData)
	} catch (error) {
		console.error("[REGISTER] 💥 Unexpected error during registration:", error)
		console.error("[REGISTER] 📊 Error details:", {
			message: error.message,
			stack: error.stack,
			name: error.name,
		})
		return NextResponse.json(
			{ error: "An unexpected error occurred during registration." },
			{ status: 500 },
		)
	}
}

export async function PUT(request) {
	try {
		console.log("[REGISTER] 🚀 Starting student update process...")

		// Parse FormData instead of JSON to handle file uploads
		console.log("[REGISTER] 📝 Parsing FormData...")
		const formData = await request.formData()

		const uid = formData.get("uid")

		const first_name = formData.get("first_name")
		const middle_name = formData.get("middle_name")
		const surname = formData.get("surname")
		const extension_name = formData.get("extension_name")
		const phone = formData.get("phone")
		const date_of_birth_raw = formData.get("date_of_birth")
		const profilePhoto = formData.get("profilePhoto")

		// New fields
		const place_of_birth = formData.get("place_of_birth")
		const religion = formData.get("religion")
		const citizenship = formData.get("citizenship")
		const sex = formData.get("sex")
		const civil_status = formData.get("civil_status")
		const region = formData.get("region")
		const barangay = formData.get("barangay")
		const municipality = formData.get("municipality")
		const province = formData.get("province")

		// School fields
		const elementary = formData.get("elementary_school")
		const elementary_address = formData.get("elementary_school_address")
		const elementary_year_graduated = formData.get("elementary_year_graduated")
		const junior_high = formData.get("junior_high_school")
		const junior_high_address = formData.get("junior_high_school_address")
		const junior_high_year_graduated = formData.get(
			"junior_high_year_graduated",
		)
		const senior_high = formData.get("senior_high_school")
		const senior_high_address = formData.get("senior_high_school_address")
		const senior_high_year_graduated = formData.get(
			"senior_high_year_graduated",
		)

		// Parents
		const father_name = formData.get("father_name")
		const father_occupation = formData.get("father_occupation")
		const father_educational_attainment = formData.get("father_education")
		const mother_name = formData.get("mother_name")
		const mother_occupation = formData.get("mother_occupation")
		const mother_educational_attainment = formData.get("mother_education")
		const monthly_income = formData.get("monthly_income")
		// Emergency
		const name = formData.get("emergency_name")
		const relationship = formData.get("emergency_relationship")
		const home_address = formData.get("emergency_address")
		const emergency_phone = formData.get("emergency_phone")

		console.log("[REGISTER] 📋 Form data extracted")

		// Convert date_of_birth to proper format for Supabase timestamptz type
		let date_of_birth = null
		if (date_of_birth_raw) {
			console.log("[REGISTER] 📅 Processing date_of_birth")
			// Convert YYYY-MM-DD string to ISO timestamp for timestamptz
			const date = new Date(date_of_birth_raw)
			if (!isNaN(date.getTime())) {
				// Convert to ISO string for timestamptz (includes timezone info)
				date_of_birth = date.toISOString()
				console.log("[REGISTER] ✅ Date converted to ISO timestamp")
			} else {
				console.error("[REGISTER] ❌ Invalid date format:", date_of_birth_raw)
			}
		} else {
			console.log("[REGISTER] 📅 No date_of_birth provided")
		}

		// Validate required fields
		console.log("[REGISTER] 🔍 Validating required fields...")
		if (!first_name || !surname) {
			console.error(
				"[REGISTER] ❌ Validation failed - missing required fields:",
				{
					first_name: !!first_name,
					surname: !!surname,
				},
			)
			return NextResponse.json(
				{ error: "First name, and surname are required." },
				{ status: 400 },
			)
		}
		console.log("[REGISTER] ✅ All required fields validated")

		console.log("[REGISTER] 🔗 Creating Supabase client...")
		const supabase = await createClient()

		// Handle profile photo upload if provided
		let photoUrl = null
		if (profilePhoto && profilePhoto.size > 0) {
			console.log("[REGISTER] 📸 Processing profile photo upload...")
			const fileExtension = profilePhoto.name.split(".").pop()
			const fileName = `${data.user.id}-${Date.now()}.${fileExtension}`

			console.log("[REGISTER] 📁 Uploading file")

			const { error: uploadError } = await supabase.storage
				.from("Profiles")
				.upload(fileName, profilePhoto)

			if (uploadError) {
				console.error("[REGISTER] ❌ Photo upload error:", uploadError)
				// Don't fail registration if photo upload fails
			} else {
				console.log("[REGISTER] ✅ Photo uploaded successfully")
				// Get public URL for the uploaded photo
				const { data: photoData } = await supabase.storage
					.from("Profiles")
					.getPublicUrl(fileName)
				photoUrl = photoData.publicUrl
			}
		} else {
			console.log("[REGISTER] 📸 No profile photo provided")
		}

		// Update user profile data into Profiles table
		console.log("[REGISTER] 💾 Updating user profile data into database...")
		let profileData = {
			first_name,
			middle_name,
			surname,
			extension_name,
			phone,
			date_of_birth,
			place_of_birth,
			religion,
			citizenship,
			sex_id: sex,
			civil_status_id: civil_status,
			region_id: region,
		}

		profileData = photoUrl
			? { ...profileData, photo_url: photoUrl }
			: { ...profileData }

		const { error: profileError } = await supabase
			.from("Profiles")
			.update(profileData)
			.eq("uid", uid)
			.select()

		if (profileError) {
			console.error("[REGISTER] ❌ Profile update error:", profileError)
			// Don't fail update if profile creation fails
			return NextResponse.json({ error: profileError.message }, { status: 400 })
		} else {
			console.log("[REGISTER] ✅ Profile data updated successfully")
		}

		// Update user address data into Address table
		console.log("[REGISTER] 💾 Updating user address data into database...")
		const addressData = {
			uid,
			barangay,
			municipality,
			province,
		}

		const { error: addressError } = await supabase
			.from("Address")
			.update(addressData)
			.eq("uid", uid)
			.select()

		if (addressError) {
			console.error("[REGISTER] ❌ Address update error:", addressError)
			// Don't fail registration if address update fails
			return NextResponse.json({ error: addressError.message }, { status: 400 })
		} else {
			console.log("[REGISTER] ✅ Address data updated successfully")
		}

		// Update user school attended data into School_Attended table
		console.log(
			"[REGISTER] 💾 Updating user school attended data into database...",
		)
		const schoolAttendedData = {
			uid,
			elementary,
			elementary_address,
			elementary_year_graduated,
			junior_high,
			junior_high_address,
			junior_high_year_graduated,
			senior_high,
			senior_high_address,
			senior_high_year_graduated,
		}

		const { error: schoolAttendedError } = await supabase
			.from("School_Attended")
			.update(schoolAttendedData)
			.eq("uid", uid)
			.select()

		if (schoolAttendedError) {
			console.error(
				"[REGISTER] ❌ School attended update error:",
				schoolAttendedError,
			)
			// Don't fail registration if school attended update fails
			return NextResponse.json(
				{ error: schoolAttendedError.message },
				{ status: 400 },
			)
		} else {
			console.log("[REGISTER] ✅ School attended data updated successfully")
		}

		// Update user parents data into Parents table
		console.log("[REGISTER] 💾 Updating user parents data into database...")
		const parentsData = {
			uid,
			father_name,
			father_occupation,
			father_educational_attainment,
			mother_name,
			mother_occupation,
			mother_educational_attainment,
			monthly_income,
		}

		const { error: parentsError } = await supabase
			.from("Parents")
			.update(parentsData)
			.eq("uid", uid)
			.select()

		if (parentsError) {
			console.error("[REGISTER] ❌ Parents update error:", parentsError)
			// Don't fail registration if parents update fails
			return NextResponse.json({ error: parentsError.message }, { status: 400 })
		} else {
			console.log("[REGISTER] ✅ Parents data updated successfully")
		}

		// Update user emergency contact data into Emergency_Contact table
		console.log(
			"[REGISTER] 💾 Updating user emergency contact data into database...",
		)
		const emergencyContactData = {
			uid,
			name,
			relationship,
			home_address,
			phone: emergency_phone,
		}

		const { error: emergencyContactError } = await supabase
			.from("Emergency_Contact")
			.update(emergencyContactData)
			.eq("uid", uid)
			.select()

		if (emergencyContactError) {
			console.error(
				"[REGISTER] ❌ Emergency contact update error:",
				emergencyContactError,
			)
			// Don't fail registration if emergency contact update fails
			return NextResponse.json(
				{ error: emergencyContactError.message },
				{ status: 400 },
			)
		} else {
			console.log("[REGISTER] ✅ Emergency contact data updated successfully")
		}

		const responseData = {
			user: uid,
			message: "User update process completed successfully!",
		}

		console.log("[REGISTER] 🎉 User update process completed successfully")
		console.log("[REGISTER] 📤 Sending response:", {
			userId: responseData.user,
			message: responseData.message,
		})

		return NextResponse.json(responseData)
	} catch (error) {
		console.error(
			"[REGISTER] 💥 Unexpected error during student update process:",
			error,
		)
		console.error("[REGISTER] 📊 Error details:", {
			message: error.message,
			stack: error.stack,
			name: error.name,
		})
		return NextResponse.json(
			{ error: "An unexpected error occurred during student update process." },
			{ status: 500 },
		)
	}
}
