import { createClient } from "@/utils/supabase/client"

const supabase = createClient()

export async function getProfile(id) {
	const { error, data } = await supabase
		.from("Profiles")
		.select(
			"*, Regions (id, region), Sex (id, sex), Civil_Status (id, civil_status)",
		)
		.single()
		.eq("uid", id)
		.order("created_at", { ascending: true })

	if (error) {
		console.error("❌ Error reading profile: ", error.message)
		return
	}

	return data
}

export async function getProfileWithoutId() {
	const { error, data } = await supabase
		.from("Profiles")
		.select(
			"*, Regions (id, region), Sex (id, sex), Civil_Status (id, civil_status)",
		)
		.order("created_at", { ascending: true })

	if (error) {
		console.error("❌ Error reading profile: ", error.message)
		return
	}

	return data
}

export async function getAddress(id) {
	const { error, data } = await supabase
		.from("Address")
		.select("*")
		.single()
		.eq("uid", id)
		.order("created_at", { ascending: true })

	if (error) {
		console.error("❌ Error reading address: ", error.message)
		return
	}

	return data
}

export async function getAddressWithoutId() {
	const { error, data } = await supabase
		.from("Address")
		.select("*")
		.order("created_at", { ascending: true })

	if (error) {
		console.error("❌ Error reading address: ", error.message)
		return
	}

	return data
}

export async function getSchoolAttended(id) {
	const { error, data } = await supabase
		.from("School_Attended")
		.select("*")
		.single()
		.eq("uid", id)
		.order("created_at", { ascending: true })

	if (error) {
		console.error("❌ Error reading school attended: ", error.message)
		return
	}

	return data
}

export async function getParents(id) {
	const { error, data } = await supabase
		.from("Parents")
		.select("*")
		.single()
		.eq("uid", id)
		.order("created_at", { ascending: true })

	if (error) {
		console.error("❌ Error reading parents: ", error.message)
		return
	}

	return data
}

export async function getEmergencyContact(id) {
	const { error, data } = await supabase
		.from("Emergency_Contact")
		.select("*")
		.single()
		.eq("uid", id)
		.order("created_at", { ascending: true })

	if (error) {
		console.error("❌ Error reading emergency contact: ", error.message)
		return
	}

	return data
}

export async function getApplication(id) {
	const { error, data } = await supabase
		.from("Applications")
		.select("*, Status (status), Steps (step)")
		.single()
		.eq("uid", id)
		.order("created_at", { ascending: true })

	if (error) {
		console.error("Error reading application: ", error.message)
		return
	}

	return data
}

export async function getApplicationWithoutId() {
	const { error, data } = await supabase
		.from("Applications")
		.select("*, Status (status), Steps (step)")
		.order("created_at", { ascending: true })

	if (error) {
		console.error("Error reading application: ", error.message)
		return
	}

	return data
}

export async function getDocuments(id) {
	const { error, data } = await supabase
		.from("Documents")
		.select("*")
		.single()
		.eq("uid", id)
		.order("created_at", { ascending: true })

	if (error) {
		console.error("Error reading documents: ", error.message)
		return
	}

	return data
}

export async function getDocumentsWithoutId() {
	const { error, data } = await supabase
		.from("Documents")
		.select("*")
		.order("created_at", { ascending: true })

	if (error) {
		console.error("Error reading documents: ", error.message)
		return
	}

	return data
}

export async function getUserWithoutId() {
	const { data, error } = await supabase.auth.admin.listUsers()
	// .order("created_at", { ascending: true })

	if (error) {
		console.error("Error reading users: ", error.message)
		return
	}

	return data
}

export async function getAdminWithoutId() {
	const { error, data } = await supabase
		.from("Admins")
		.select("*")
		.order("created_at", { ascending: true })

	if (error) {
		console.error("Error reading admins: ", error.message)
		return
	}

	return data
}
