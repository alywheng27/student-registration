// Create a route.js for signing up using supabase then connect it to register page. Just like in login.

import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(request) {
  console.log("🚀 Starting registration process...");
  
  try {
    // Parse FormData instead of JSON to handle file uploads
    console.log("📝 Parsing FormData...");
    const formData = await request.formData();
    
    const first_name = formData.get('first_name');
    const middle_name = formData.get('middle_name');
    const surname = formData.get('surname');
    const extension_name = formData.get('extension_name');
    const email = formData.get('email');
    const phone = formData.get('phone');
    const date_of_birth_raw = formData.get('date_of_birth');
    const address = formData.get('address');
    const password = formData.get('password');
    const profilePhoto = formData.get('profilePhoto');

    console.log("📋 Form data extracted");

    // Convert date_of_birth to proper format for Supabase timestamptz type
    let date_of_birth = null;
    if (date_of_birth_raw) {
      console.log("📅 Processing date_of_birth");
      // Convert YYYY-MM-DD string to ISO timestamp for timestamptz
      const date = new Date(date_of_birth_raw);
      if (!isNaN(date.getTime())) {
        // Convert to ISO string for timestamptz (includes timezone info)
        date_of_birth = date.toISOString();
        console.log("✅ Date converted to ISO timestamp");
      } else {
        console.error("❌ Invalid date format:", date_of_birth_raw);
      }
    } else {
      console.log("📅 No date_of_birth provided");
    }

    // Validate required fields
    console.log("🔍 Validating required fields...");
    if (!email || !password || !first_name || !surname) {
      console.error("❌ Validation failed - missing required fields:", {
        email: !!email,
        password: !!password,
        first_name: !!first_name,
        surname: !!surname
      });
      return NextResponse.json(
        { error: "Email, password, first name, and surname are required." },
        { status: 400 }
      );
    }
    console.log("✅ All required fields validated");

    console.log("🔗 Creating Supabase client...");
    const supabase = await createClient();
    
    // Create user account with Supabase Auth
    console.log("👤 Creating user account with Supabase Auth...");
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
          address,
        }
      }
    });

    if (error) {
      console.error("❌ Supabase Auth signup error:", error);
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    console.log("✅ User account created successfully");

    // Handle profile photo upload if provided
    let photoUrl = null;
    if (profilePhoto && profilePhoto.size > 0) {
      console.log("📸 Processing profile photo upload...");
      const fileExtension = profilePhoto.name.split('.').pop();
      const fileName = `${data.user.id}-${Date.now()}.${fileExtension}`;
      
      console.log("📁 Uploading file");
      
      const { error: uploadError } = await supabase.storage
        .from('Profiles')
        .upload(fileName, profilePhoto);

      if (uploadError) {
        console.error("❌ Photo upload error:", uploadError);
        // Don't fail registration if photo upload fails
      } else {
        console.log("✅ Photo uploaded successfully");
        // Get public URL for the uploaded photo
        const { data: photoData } = await supabase.storage
          .from('Profiles')
          .getPublicUrl(fileName);
        photoUrl = photoData.publicUrl;
      }
    } else {
      console.log("📸 No profile photo provided");
    }

    // Insert user profile data into Profiles table
    console.log("💾 Inserting user profile data into database...");
    const profileData = {
      uid: data.user.id,
      first_name,
      middle_name,
      surname,
      extension_name,
      phone,
      date_of_birth,
      address,
      photo_url: photoUrl,
    };
        
    const { error: profileError } = await supabase.from("Profiles").insert(profileData);

    if (profileError) {
      console.error("❌ Profile creation error:", profileError);
      // Don't fail registration if profile creation fails
    } else {
      console.log("✅ Profile data inserted successfully");
    }

    const responseData = { 
      user: data.user, 
      session: data.session,
      message: "Registration successful! Please check your email to verify your account."
    };
    
    console.log("🎉 Registration process completed successfully");
    console.log("📤 Sending response:", {
      userId: responseData.user?.id,
      hasSession: !!responseData.session,
      message: responseData.message
    });

    return NextResponse.json(responseData);

  } catch (error) {
    console.error("💥 Unexpected error during registration:", error);
    console.error("📊 Error details:", {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    return NextResponse.json(
      { error: "An unexpected error occurred during registration." },
      { status: 500 }
    );
  }
}
