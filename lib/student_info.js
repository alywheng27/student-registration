import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

export async function getProfile(id) {
  const { error, data } = await supabase.from("Profiles").select("*").single().eq('uid', id).order("created_at", { ascending: true })

  if (error) {
    console.error("❌ Error reading profile: ", error.message)
    return
  }

  return data
}

export async function getApplication(id) {
  const { error, data } = await supabase.from("Applications").select("*, Status (status), Steps (step)").single().eq('uid', id).order("created_at", { ascending: true })

  if (error) {
    console.error("Error reading application: ", error.message)
    return
  }

  return data
}

export async function getDocuments(id) {
  const { error, data } = await supabase.from("Documents").select("*").single().eq('uid', id).order("created_at", { ascending: true })

  if (error) {
    console.error("Error reading documents: ", error.message)
    return
  }

  return data
}