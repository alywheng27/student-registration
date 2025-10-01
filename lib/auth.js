"use client";

import { createContext, useContext, useEffect, useState } from "react";

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
  const [loading, setLoading] = useState(true);

  const convertDatesToObjects = (user) => {
    if (user.role === "student") {
      return {
        ...user,
        appliedAt: new Date(user.appliedAt),
        createdAt: new Date(user.createdAt),
        documents:
          user.documents?.map((doc) => ({
            ...doc,
            uploadedAt: new Date(doc.uploadedAt),
          })) || [],
      };
    }
    return {
      ...user,
      createdAt: new Date(user.createdAt),
    };
  };

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(convertDatesToObjects(parsedUser));
    }
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

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  const register = async (userData) => {
    setLoading(true);
    
    const first_name = userData.first_name
    const middle_name = userData.middle_name
    const surname = userData.surname
    const extension_name = userData.extension_name
    const email = userData.email
    const phone = userData.phone
    const date_of_birth = userData.date_of_birth
    const address = userData.address
    const password = userData.password
    const profilePhoto = userData.profilePhoto

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
      formData.append('address', address || '');
      formData.append('password', password);
      
      // Only append profilePhoto if it's a File object
      if (profilePhoto && profilePhoto instanceof File) {
        formData.append('profilePhoto', profilePhoto);
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

        console.log(userData)
        console.log(data)
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
