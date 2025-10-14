/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			new URL(
				"https://wyklhiekiqnsbapjlwhl.supabase.co/storage/v1/object/public/Profiles/**",
			),
			new URL(
				"https://wyklhiekiqnsbapjlwhl.supabase.co/storage/v1/object/public/Documents/**",
			),
		],
	},
}

export default nextConfig
