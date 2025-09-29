import { Analytics } from "@vercel/analytics/next";
import { AuthProvider } from "@/lib/auth";
import { Suspense } from "react";
import "./globals.css";

export const metadata = {
  title: "Student Registration System",
  description:
    "University student registration and application management system",
  generator: "v0.app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      {/* <body className="dark"> */}
      <body>
        <Suspense fallback={<div>Loading...</div>}>
          <AuthProvider>{children}</AuthProvider>
        </Suspense>
        <Analytics />
      </body>
    </html>
  );
}
