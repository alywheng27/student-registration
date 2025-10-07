export default function LoadingPage() {
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
      <svg width="60" height="60" viewBox="0 0 50 50" style={{ marginBottom: 24 }}>
        <circle cx="25" cy="25" r="20" stroke="#2563eb" strokeWidth="5" fill="none" strokeDasharray="31.4 31.4" strokeLinecap="round">
          <animateTransform attributeName="transform" type="rotate" from="0 25 25" to="360 25 25" dur="1s" repeatCount="indefinite" />
        </circle>
      </svg>
      <h2 style={{ fontSize: 24, fontWeight: 600 }}>Loading...</h2>
    </div>
  );
}
