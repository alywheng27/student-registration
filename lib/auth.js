"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

const AuthContext = createContext(undefined);

// Mock data for development
const mockUsers = [
  {
    id: "1",
    email: "admin@university.edu",
    name: "Admin User",
    role: "admin",
    permissions: ["review_applications", "manage_users", "send_notifications"],
    createdAt: new Date("2024-01-01"),
  },
  {
    id: "2",
    email: "student@example.com",
    name: "John Doe",
    role: "student",
    studentId: "STU001",
    phone: "+1234567890",
    applicationStatus: "pending",
    documents: [
      {
        id: "doc1",
        name: "ID Document",
        type: "id",
        fileName: "drivers_license.pdf",
        fileUrl: "/placeholder-document.pdf",
        uploadedAt: new Date("2024-01-16"),
        status: "approved",
      },
      {
        id: "doc2",
        name: "High School Transcript",
        type: "transcript",
        fileName: "transcript.pdf",
        fileUrl: "/placeholder-document.pdf",
        uploadedAt: new Date("2024-01-17"),
        status: "pending",
      },
    ],
    appliedAt: new Date("2024-01-15"),
    createdAt: new Date("2024-01-15"),
  },
];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState('Admin')
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

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
          .from('Profiles')
          .select('*', { count: 'exact', head: true }) // 'head' means don't return data, only count
          .eq('uid', currentUser.data.user?.id)

        if (error) {
          return { success: false, error: error || "Login failed" };
        }

        if (count > 0) {
          setUserRole('Student')
        }else {
          setUserRole('Admin')
        }
    
        // return () => subscription.unsubscribe();
    } catch (error) {
        setUser(null)
    }
  };

  useEffect(() => {
    // Check for stored user session
    checkAuthentication()
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        const { count, error } = await supabase
          .from('Profiles')
          .select('*', { count: 'exact', head: true }) // 'head' means don't return data, only count
          .eq('uid', data.user?.id)

        if (error) {
          return { success: false, error: error || "Login failed" };
        }

        if (count > 0) {
          setUserRole('Student')
        }
        setUser(data.user);
        setLoading(false);

        return { success: true };
      } else {
        setLoading(false);
        return { success: false, error: data.error || "Login failed" };
      }
    } catch (err) {
      setLoading(false);
      return { success: false, error: "Network error" };
    }
  };

  const logout = async () => {
    setLoading(true);

    try {
      const res = await fetch("/api/auth/logout", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();
      setUser(null)
      setLoading(false);
      
      return { success: true, message: data.message };
    } catch (error) {
      setLoading(false);
      return { success: false, error: "Network error" };
    }
  };

  const register = async (userData) => {
    setLoading(true);
    const first_name = userData.first_name;
    const middle_name = userData.middle_name;
    const surname = userData.surname;
    const extension_name = userData.extension_name;
    const email = userData.email;
    const phone = userData.phone;
    const date_of_birth = userData.date_of_birth;
    const password = userData.password;
    const profilePhoto = userData.profilePhoto;
    // New fields
    const place_of_birth = userData.place_of_birth;
    const religion = userData.religion;
    const citizenship = userData.citizenship;
    const sex = userData.sex;
    const civil_status = userData.civil_status;
    const region = userData.region;
    const barangay = userData.barangay;
    const municipality = userData.municipality;
    const province = userData.province;
    // School fields
    const elementary_school = userData.elementary_school;
    const elementary_school_address = userData.elementary_school_address;
    const elementary_year_graduated = userData.elementary_year_graduated;
    const junior_high_school = userData.junior_high_school;
    const junior_high_school_address = userData.junior_high_school_address;
    const junior_high_year_graduated = userData.junior_high_year_graduated;
    const senior_high_school = userData.senior_high_school;
    const senior_high_school_address = userData.senior_high_school_address;
    const senior_high_year_graduated = userData.senior_high_year_graduated;
    // Parents
    const father_name = userData.father_name;
    const father_occupation = userData.father_occupation;
    const father_education = userData.father_education;
    const mother_name = userData.mother_name;
    const mother_occupation = userData.mother_occupation;
    const mother_education = userData.mother_education;
    const monthly_income = userData.monthly_income;
    // Emergency
    const emergency_name = userData.emergency_name;
    const emergency_relationship = userData.emergency_relationship;
    const emergency_address = userData.emergency_address;
    const emergency_phone = userData.emergency_phone;
    // Requirements
    const birth_certificate = userData.birth_certificate;
    const good_moral = userData.good_moral;
    const grade_card = userData.grade_card;

    try {
      // Create FormData to handle file uploads
      const formData = new FormData();
      formData.append('first_name', first_name);
      formData.append('middle_name', middle_name || '');
      formData.append('surname', surname);
      formData.append('extension_name', extension_name || '');
      formData.append('email', email);
      formData.append('phone', phone || '');
      formData.append('date_of_birth', date_of_birth || '');
      formData.append('password', password);
      // New fields
      formData.append('place_of_birth', place_of_birth || '');
      formData.append('religion', religion || '');
      formData.append('citizenship', citizenship || '');
      formData.append('sex', sex || '');
      formData.append('civil_status', civil_status || '');
      formData.append('region', region || '');
      formData.append('barangay', barangay || '');
      formData.append('municipality', municipality || '');
      formData.append('province', province || '');
      // School fields
      formData.append('elementary_school', elementary_school || '');
      formData.append('elementary_school_address', elementary_school_address || '');
      formData.append('elementary_year_graduated', elementary_year_graduated || '');
      formData.append('junior_high_school', junior_high_school || '');
      formData.append('junior_high_school_address', junior_high_school_address || '');
      formData.append('junior_high_year_graduated', junior_high_year_graduated || '');
      formData.append('senior_high_school', senior_high_school || '');
      formData.append('senior_high_school_address', senior_high_school_address || '');
      formData.append('senior_high_year_graduated', senior_high_year_graduated || '');
      // Parents
      formData.append('father_name', father_name || '');
      formData.append('father_occupation', father_occupation || '');
      formData.append('father_education', father_education || '');
      formData.append('mother_name', mother_name || '');
      formData.append('mother_occupation', mother_occupation || '');
      formData.append('mother_education', mother_education || '');
      formData.append('monthly_income', monthly_income || '');
      // Emergency
      formData.append('emergency_name', emergency_name || '');
      formData.append('emergency_relationship', emergency_relationship || '');
      formData.append('emergency_address', emergency_address || '');
      formData.append('emergency_phone', emergency_phone || '');
      // Only append profilePhoto if it's a File object
      if (profilePhoto && profilePhoto instanceof File) {
        formData.append('profilePhoto', profilePhoto);
      }
      // Requirements (files)
      if (birth_certificate && birth_certificate instanceof File) {
        formData.append('birth_certificate', birth_certificate);
      }
      if (good_moral && good_moral instanceof File) {
        formData.append('good_moral', good_moral);
      }
      if (grade_card && grade_card instanceof File) {
        formData.append('grade_card', grade_card);
      }

      const res = await fetch("/api/auth/register", {
        method: "POST",
        // Don't set Content-Type header - let the browser set it with boundary for FormData
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setUser(data.user);
        setLoading(false);
        return { success: true, message: data.message };
      } else {
        setLoading(false);
        return { success: false, error: data.error || "Registration failed" };
      }
    } catch (err) {
      setLoading(false);
      return { success: false, error: "Network error" };
    }
  };

  const updateUser = async (userData) => {
    setLoading(true);

    if (!user) {
      setLoading(false);
      return { success: false, error: "No user logged in" };
    }

    try {
      // Update the user data
      const updatedUser = { ...user, ...userData };

      // Update in mock data
      const userIndex = mockUsers.findIndex((u) => u.id === user.id);
      if (userIndex !== -1) {
        mockUsers[userIndex] = updatedUser;
      }

      // Update local state and storage
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));

      setLoading(false);
      return { success: true };
    } catch (error) {
      setLoading(false);
      return { success: false, error: "Failed to update profile" };
    }
  };

  const updatePassword = async (currentPassword, newPassword) => {
    setLoading(true);

    if (!user) {
      setLoading(false);
      return { success: false, error: "No user logged in" };
    }

    // In a real app, you would verify the current password against the stored hash
    // For this mock, we'll assume the current password is "password"
    if (currentPassword !== "password") {
      setLoading(false);
      return { success: false, error: "Current password is incorrect" };
    }

    if (newPassword.length < 6) {
      setLoading(false);
      return {
        success: false,
        error: "New password must be at least 6 characters long",
      };
    }

    // In a real app, you would hash the new password and update it in the database
    // For this mock, we'll just simulate success
    setLoading(false);
    return { success: true };
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userRole,
        login,
        logout,
        register,
        updateUser,
        updatePassword,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
