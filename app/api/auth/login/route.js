import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(request) {
  console.log("🚀 Starting login process...");
  
  try {
    // Parse JSON request body
    console.log("📝 Parsing request JSON...");
    const { email, password } = await request.json();
    
    console.log("📋 Login data extracted");

    // Validate required fields
    console.log("🔍 Validating required fields...");
    if (!email || !password) {
      console.error("❌ Validation failed - missing required fields:", {
        email: !!email,
        password: !!password
      });
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }
    console.log("✅ All required fields validated");

    console.log("🔗 Creating Supabase client...");
    const supabase = await createClient();
    
    // Authenticate user with Supabase Auth
    console.log("👤 Authenticating user with Supabase Auth...");
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("❌ Supabase Auth login error:", error);
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    
    console.log("✅ User authenticated successfully");

    const responseData = { 
      user: data.user, 
      session: data.session 
    };
    
    console.log("🎉 Login process completed successfully");
    console.log("📤 Sending response:", {
      userId: responseData.user?.id,
      hasSession: !!responseData.session,
      sessionExpiry: responseData.session?.expires_at
    });

    // Optionally, you can return the user/session info
    return NextResponse.json(responseData);

  } catch (error) {
    console.error("💥 Unexpected error during login:", error);
    console.error("📊 Error details:", {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    return NextResponse.json(
      { error: "An unexpected error occurred during login." },
      { status: 500 }
    );
  }
}
