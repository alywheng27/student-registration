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

    // Check if email already exists
    const existingUser = mockUsers.find((u) => u.email === userData.email);
    if (existingUser) {
      setLoading(false);
      return { success: false, error: "Email already registered" };
    }

    if (userData.password.length < 6) {
      setLoading(false);
      return {
        success: false,
        error: "Password must be at least 6 characters long",
      };
    }

    // Create new student
    const newStudent = {
      id: Date.now().toString(),
      email: userData.email,
      name: userData.name,
      role: "student",
      studentId: `STU${Date.now().toString().slice(-6)}`,
      phone: userData.phone,
      dateOfBirth: userData.dateOfBirth,
      address: userData.address,
      profilePhoto: userData.profilePhoto,
      applicationStatus: "pending",
      documents: [],
      appliedAt: new Date(),
      createdAt: new Date(),
    };

    mockUsers.push(newStudent);
    setUser(newStudent);
    localStorage.setItem("user", JSON.stringify(newStudent));
    setLoading(false);

    return { success: true };
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
