"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { createClient } from "@/utils/supabase/client"

const AuthContext = createContext(undefined)

export function AuthProvider({ children }) {
	const [user, setUser] = useState(null)
	const [userRole, setUserRole] = useState("Admin")
	const [loading, setLoading] = useState(true)
	const supabase = createClient()

	const checkAuthentication = async () => {
		try {
			const currentUser = await supabase.auth.getUser()
			setUser(currentUser.data.user)

			// const {
			//     data: { subscription },
			// } = supabase.auth.onAuthStateChange((_event, data) => {
			//     setUser(data.user);
			// });

			const { count, error } = await supabase
				.from("Profiles")
				.select("*", { count: "exact", head: true }) // 'head' means don't return data, only count
				.eq("uid", currentUser.data.user?.id)

			if (error) {
				return { success: false, error: error || "Login failed" }
			}

			if (count > 0) {
				setUserRole("Student")
			} else {
				setUserRole("Admin")
			}

			// return () => subscription.unsubscribe();
		} catch (error) {
			setUser(null)
		}
	}

	useEffect(() => {
		// Check for stored user session
		checkAuthentication()
		setLoading(false)
	}, [])

	const login = async (email, password) => {
		setLoading(true)

		try {
			const res = await fetch("/api/auth/login", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email, password }),
			})
			const data = await res.json()
			if (res.ok) {
				const { count, error } = await supabase
					.from("Profiles")
					.select("*", { count: "exact", head: true }) // 'head' means don't return data, only count
					.eq("uid", data.user?.id)

				if (error) {
					return { success: false, error: error || "Login failed" }
				}

				if (count > 0) {
					setUserRole("Student")
				} else {
					setUserRole("Admin")
				}
				setUser(data.user)
				setLoading(false)

				return { success: true }
			} else {
				setLoading(false)
				return { success: false, error: data.error || "Login failed" }
			}
		} catch (err) {
			setLoading(false)
			return { success: false, error: "Network error" }
		}
	}

	const logout = async () => {
		setLoading(true)

		try {
			const res = await fetch("/api/auth/logout", {
				method: "GET",
				headers: { "Content-Type": "application/json" },
			})

			const data = await res.json()
			setUser(null)
			setLoading(false)

			return { success: true, message: data.message }
		} catch (error) {
			setLoading(false)
			return { success: false, error: "Network error" }
		}
	}

	const register = async (userData) => {
		setLoading(true)
		const first_name = userData.first_name
		const middle_name = userData.middle_name
		const surname = userData.surname
		const extension_name = userData.extension_name
		const email = userData.email
		const phone = userData.phone
		const date_of_birth = userData.date_of_birth
		const password = userData.password
		const profilePhoto = userData.profilePhoto
		// New fields
		const place_of_birth = userData.place_of_birth
		const religion = userData.religion
		const citizenship = userData.citizenship
		const sex = userData.sex
		const civil_status = userData.civil_status
		const region = userData.region
		const barangay = userData.barangay
		const municipality = userData.municipality
		const province = userData.province
		// School fields
		const elementary_school = userData.elementary_school
		const elementary_school_address = userData.elementary_school_address
		const elementary_year_graduated = userData.elementary_year_graduated
		const junior_high_school = userData.junior_high_school
		const junior_high_school_address = userData.junior_high_school_address
		const junior_high_year_graduated = userData.junior_high_year_graduated
		const senior_high_school = userData.senior_high_school
		const senior_high_school_address = userData.senior_high_school_address
		const senior_high_year_graduated = userData.senior_high_year_graduated
		// Parents
		const father_name = userData.father_name
		const father_occupation = userData.father_occupation
		const father_education = userData.father_education
		const mother_name = userData.mother_name
		const mother_occupation = userData.mother_occupation
		const mother_education = userData.mother_education
		const monthly_income = userData.monthly_income
		// Emergency
		const emergency_name = userData.emergency_name
		const emergency_relationship = userData.emergency_relationship
		const emergency_address = userData.emergency_address
		const emergency_phone = userData.emergency_phone
		// Requirements
		const birth_certificate = userData.birth_certificate
		const good_moral = userData.good_moral
		const grade_card = userData.grade_card

		try {
			// Create FormData to handle file uploads
			const formData = new FormData()
			formData.append("first_name", first_name)
			formData.append("middle_name", middle_name || "")
			formData.append("surname", surname)
			formData.append("extension_name", extension_name || "")
			formData.append("email", email)
			formData.append("phone", phone || "")
			formData.append("date_of_birth", date_of_birth || "")
			formData.append("password", password)
			// New fields
			formData.append("place_of_birth", place_of_birth || "")
			formData.append("religion", religion || "")
			formData.append("citizenship", citizenship || "")
			formData.append("sex", sex || "")
			formData.append("civil_status", civil_status || "")
			formData.append("region", region || "")
			formData.append("barangay", barangay || "")
			formData.append("municipality", municipality || "")
			formData.append("province", province || "")
			// School fields
			formData.append("elementary_school", elementary_school || "")
			formData.append(
				"elementary_school_address",
				elementary_school_address || "",
			)
			formData.append(
				"elementary_year_graduated",
				elementary_year_graduated || "",
			)
			formData.append("junior_high_school", junior_high_school || "")
			formData.append(
				"junior_high_school_address",
				junior_high_school_address || "",
			)
			formData.append(
				"junior_high_year_graduated",
				junior_high_year_graduated || "",
			)
			formData.append("senior_high_school", senior_high_school || "")
			formData.append(
				"senior_high_school_address",
				senior_high_school_address || "",
			)
			formData.append(
				"senior_high_year_graduated",
				senior_high_year_graduated || "",
			)
			// Parents
			formData.append("father_name", father_name || "")
			formData.append("father_occupation", father_occupation || "")
			formData.append("father_education", father_education || "")
			formData.append("mother_name", mother_name || "")
			formData.append("mother_occupation", mother_occupation || "")
			formData.append("mother_education", mother_education || "")
			formData.append("monthly_income", monthly_income || "")
			// Emergency
			formData.append("emergency_name", emergency_name || "")
			formData.append("emergency_relationship", emergency_relationship || "")
			formData.append("emergency_address", emergency_address || "")
			formData.append("emergency_phone", emergency_phone || "")
			// Only append profilePhoto if it's a File object
			if (profilePhoto && profilePhoto instanceof File) {
				formData.append("profilePhoto", profilePhoto)
			}
			// Requirements (files)
			if (birth_certificate && birth_certificate instanceof File) {
				formData.append("birth_certificate", birth_certificate)
			}
			if (good_moral && good_moral instanceof File) {
				formData.append("good_moral", good_moral)
			}
			if (grade_card && grade_card instanceof File) {
				formData.append("grade_card", grade_card)
			}

			const res = await fetch("/api/auth/register", {
				method: "POST",
				// Don't set Content-Type header - let the browser set it with boundary for FormData
				body: formData,
			})
			const data = await res.json()
			if (res.ok) {
				setUser(data.user)
				setLoading(false)
				return { success: true, message: data.message }
			} else {
				setLoading(false)
				return { success: false, error: data.error || "Registration failed" }
			}
		} catch (err) {
			setLoading(false)
			return { success: false, error: "Network error" }
		}
	}

	const addAdmin = async (adminFormData) => {
		setLoading(true)
		// Extract relevant fields
		const first_name = adminFormData.first_name
		const middle_name = adminFormData.middle_name
		const surname = adminFormData.surname
		const extension_name = adminFormData.extension_name
		const email = adminFormData.email
		const password = adminFormData.password

		try {
			const formData = new FormData()
			formData.append("first_name", first_name)
			formData.append("middle_name", middle_name || "")
			formData.append("surname", surname)
			formData.append("extension_name", extension_name || "")
			formData.append("email", email)
			formData.append("password", password)

			const res = await fetch("/api/admin", {
				method: "POST",
				body: formData,
			})
			const data = await res.json()
			if (res.ok) {
				setLoading(false)
				return { success: true, message: data.message }
			} else {
				setLoading(false)
				return {
					success: false,
					error: data.error || "Admin registration failed",
				}
			}
		} catch (err) {
			setLoading(false)
			return { success: false, error: "Network error" }
		}
	}

	const updateAdmin = async (adminFormData) => {
		setLoading(true)
		// Extract relevant fields
		const id = adminFormData.uid
		const first_name = adminFormData.first_name
		const middle_name = adminFormData.middle_name
		const surname = adminFormData.surname
		const extension_name = adminFormData.extension_name
		const email = adminFormData.email
		const password = adminFormData.password // optional but included for similarity

		try {
			const formData = new FormData()
			formData.append("id", id)
			formData.append("first_name", first_name)
			formData.append("middle_name", middle_name || "")
			formData.append("surname", surname)
			formData.append("extension_name", extension_name || "")
			formData.append("email", email)
			formData.append("password", password)

			const res = await fetch("/api/admin", {
				method: "PUT",
				body: formData,
			})
			const data = await res.json()
			if (res.ok) {
				setLoading(false)
				return { success: true, message: data.message }
			} else {
				setLoading(false)
				return {
					success: false,
					error: data.error || "Admin update failed",
				}
			}
		} catch (err) {
			setLoading(false)
			return { success: false, error: "Network error" }
		}
	}

	const deleteAdmin = async (adminId) => {
		setLoading(true)
		try {
			const formData = new FormData()
			formData.append("id", adminId)

			const res = await fetch("/api/admin", {
				method: "DELETE",
				body: formData,
			})
			const data = await res.json()
			if (res.ok) {
				setLoading(false)
				return { success: true, message: data.message }
			} else {
				setLoading(false)
				return {
					success: false,
					error: data.error || "Admin deletion failed",
				}
			}
		} catch (err) {
			setLoading(false)
			return { success: false, error: "Network error" }
		}
	}

	const updateApplication = async (applicationData) => {
		setLoading(true)

		try {
			const formData = new FormData()
			formData.append("id", applicationData.id)
			formData.append("status_id", applicationData.status_id)
			formData.append("step_id", applicationData.step_id)
			formData.append("last_updated", applicationData.last_updated)
			formData.append("reviewed_by", applicationData.reviewed_by)
			formData.append("note", applicationData.note)

			const res = await fetch("/api/student/application", {
				method: "PUT",
				body: formData,
			})
			const data = await res.json()

			if (res.ok) {
				setLoading(false)
				return { success: true, message: data.message }
			} else {
				setLoading(false)
				return {
					success: false,
					error: data.error || "Application update failed",
				}
			}
		} catch (err) {
			setLoading(false)
			return { success: false, error: "Network error" }
		}
	}

	const updateDocuments = async (documentData) => {
		setLoading(true)
		const id = documentData.id
		const document = documentData.document
		const type = documentData.type

		try {
			// Create FormData to handle file uploads
			const formData = new FormData()
			formData.append("id", id || "")
			formData.append("type", type || "")
			// Requirements (files)
			if (document && document instanceof File) {
				formData.append("document", document)
			}

			const res = await fetch("/api/student/document", {
				method: "PUT",
				// Don't set Content-Type header - let the browser set it with boundary for FormData
				body: formData,
			})

			const data = await res.json()
			if (res.ok) {
				setLoading(false)
				return { success: true, message: data.message }
			} else {
				setLoading(false)
				return { success: false, error: data.error || "Update failed" }
			}
		} catch (err) {
			setLoading(false)
			return { success: false, error: "Network error" }
		}
	}

	const updateUser = async (userData) => {
		setLoading(true)

		if (!user) {
			setLoading(false)
			return { success: false, error: "No user logged in" }
		}

		try {
			// Create FormData to handle file uploads
			const formData = new FormData()
			formData.append("uid", user.id)
			formData.append("first_name", userData.first_name)
			formData.append("middle_name", userData.middle_name || "")
			formData.append("surname", userData.surname)
			formData.append("extension_name", userData.extension_name || "")
			formData.append("phone", userData.phone || "")
			formData.append("date_of_birth", userData.dateOfBirth || "")
			// New fields
			formData.append("place_of_birth", userData.place_of_birth || "")
			formData.append("religion", userData.religion || "")
			formData.append("citizenship", userData.citizenship || "")
			formData.append("sex", userData.sex || "")
			formData.append("civil_status", userData.civil_status || "")
			formData.append("region", userData.region || "")
			formData.append("barangay", userData.barangay || "")
			formData.append("municipality", userData.municipality || "")
			formData.append("province", userData.province || "")
			// School fields
			formData.append("elementary_school", userData.elementary_school || "")
			formData.append(
				"elementary_school_address",
				userData.elementary_school_address || "",
			)
			formData.append(
				"elementary_year_graduated",
				userData.elementary_year_graduated || "",
			)
			formData.append("junior_high_school", userData.junior_high_school || "")
			formData.append(
				"junior_high_school_address",
				userData.junior_high_school_address || "",
			)
			formData.append(
				"junior_high_year_graduated",
				userData.junior_high_year_graduated || "",
			)
			formData.append("senior_high_school", userData.senior_high_school || "")
			formData.append(
				"senior_high_school_address",
				userData.senior_high_school_address || "",
			)
			formData.append(
				"senior_high_year_graduated",
				userData.senior_high_year_graduated || "",
			)
			// Parents
			formData.append("father_name", userData.father_name || "")
			formData.append("father_occupation", userData.father_occupation || "")
			formData.append("father_education", userData.father_education || "")
			formData.append("mother_name", userData.mother_name || "")
			formData.append("mother_occupation", userData.mother_occupation || "")
			formData.append("mother_education", userData.mother_education || "")
			formData.append("monthly_income", userData.monthly_income || "")
			// Emergency
			formData.append("emergency_name", userData.emergency_name || "")
			formData.append(
				"emergency_relationship",
				userData.emergency_relationship || "",
			)
			formData.append("emergency_address", userData.emergency_address || "")
			formData.append("emergency_phone", userData.emergency_phone || "")
			// Only append profilePhoto if it's a File object
			if (userData.photoFile && userData.photoFile instanceof File) {
				formData.append("profilePhoto", userData.photoFile)
			}

			const res = await fetch("/api/auth/register", {
				method: "PUT",
				// Don't set Content-Type header - let the browser set it with boundary for FormData
				body: formData,
			})

			const data = await res.json()

			if (res.ok) {
				setLoading(false)
				return { success: true, message: data.message }
			} else {
				setLoading(false)
				return { success: false, error: data.error || "Update failed" }
			}
		} catch (error) {
			setLoading(false)
			return { success: false, error: "Failed to update profile" }
		}
	}

	const updatePassword = async (currentPassword, newPassword) => {
		setLoading(true)

		if (!user) {
			setLoading(false)
			return { success: false, error: "No user logged in" }
		}

		try {
			const formData = new FormData()

			formData.append("email", user.email)

			formData.append("currentPassword", currentPassword)
			formData.append("newPassword", newPassword)

			const res = await fetch("/api/auth/login", {
				method: "PUT",
				// Don't set Content-Type header - let the browser set it with boundary for FormData
				body: formData,
			})

			const data = await res.json()

			if (res.ok) {
				setLoading(false)
				return { success: true, message: data.message }
			} else {
				setLoading(false)
				return {
					success: false,
					error: data.error || "Update password failed",
				}
			}
		} catch (error) {
			setLoading(false)
			return { success: false, error: "Failed to update password" }
		}
	}

	return (
		<AuthContext.Provider
			value={{
				user,
				userRole,
				login,
				logout,
				register,
				addAdmin,
				updateAdmin,
				deleteAdmin,
				updateApplication,
				updateDocuments,
				updateUser,
				updatePassword,
				loading,
			}}
		>
			{children}
		</AuthContext.Provider>
	)
}

export function useAuth() {
	const context = useContext(AuthContext)
	if (context === undefined) {
		throw new Error("useAuth must be used within an AuthProvider")
	}
	return context
}
