import Link from "next/link"

export default function NotFoundPage() {
	return (
		<div
			style={{
				minHeight: "100vh",
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				justifyContent: "center",
				background: "linear-gradient(135deg, #f8fafc 0%, #e0e7ef 100%)",
				color: "#1e293b",
				fontFamily: "Inter, sans-serif",
			}}
		>
			<svg
				width="80"
				height="80"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
				style={{ marginBottom: 24 }}
			>
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					strokeWidth={2}
					d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
				/>
			</svg>
			<h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 8 }}>
				404 - Page Not Found
			</h1>
			<p style={{ fontSize: 18, marginBottom: 24 }}>
				Sorry, the page you are looking for does not exist.
			</p>
			<Link
				href="/"
				style={{
					padding: "10px 24px",
					background: "#2563eb",
					color: "#fff",
					border: "none",
					borderRadius: 6,
					fontSize: 16,
					textDecoration: "none",
					boxShadow: "0 2px 8px rgba(37,99,235,0.08)",
				}}
			>
				Go Home
			</Link>
		</div>
	)
}
