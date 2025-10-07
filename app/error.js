"use client";

export default function ErrorPage({ error, reset }) {
  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      background: "linear-gradient(135deg, #f8fafc 0%, #e0e7ef 100%)",
      color: "#1e293b",
      fontFamily: "Inter, sans-serif"
    }}>
      <svg width="80" height="80" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ marginBottom: 24 }}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 8 }}>Something went wrong</h1>
      <p style={{ fontSize: 18, marginBottom: 24 }}>{error?.message || "An unexpected error has occurred."}</p>
      <button onClick={reset} style={{
        padding: "10px 24px",
        background: "#2563eb",
        color: "#fff",
        border: "none",
        borderRadius: 6,
        fontSize: 16,
        cursor: "pointer",
        boxShadow: "0 2px 8px rgba(37,99,235,0.08)"
      }}>
        Try Again
      </button>
    </div>
  );
}
