import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    'https://wyklhiekiqnsbapjlwhl.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind5a2xoaWVraXFuc2JhcGpsd2hsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkxNDUxNTIsImV4cCI6MjA3NDcyMTE1Mn0.9NE3tDyf3Srvg1tcEwbMwx5jmuIgaUmPYGBynvflhqY'
  )
}