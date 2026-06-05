"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      router.replace("/admin/categories");
    } else {
      setChecking(false);
    }
  }, [router]);

  if (checking) return <div style={{ background: "#0f0f13", height: "100vh" }} />;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new Error("Please enter a valid email address");
      }

      if (password.length < 3) {
        throw new Error("Password must be at least 3 characters");
      }

      console.log("Attempting login with:", { email, apiUrl });

      const res = await fetch(`${apiUrl}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      console.log("Response status:", res.status);
      
      if (!res.ok) {
        const data = await res.json();
        console.error("Login error response:", data);
        throw new Error(data.error || "Login failed");
      }

      const data = await res.json();
      console.log("Login response:", { success: data.success, hasToken: !!data.token });

      if (data.token) {
        localStorage.setItem("token", data.token);
        console.log("Token saved successfully, redirecting to admin panel");
        router.push("/admin/categories");
      } else {
        throw new Error("No token received from server");
      }
    } catch (err: unknown) {
      // Provide a clearer message for network-level failures (e.g. backend not running or CORS)
      let errorMessage = "An unexpected error occurred";
      if (err instanceof TypeError) {
        // TypeError is commonly thrown for network errors like "Failed to fetch"
        errorMessage = `Network error: could not reach API at ${apiUrl}. Is the backend running? (CORS or network issue)`;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      console.error("Login error:", errorMessage, err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      height: "100vh",
      background: "#0f0f13",
      fontFamily: "'DM Sans', sans-serif"
    }}>
      <div style={{
        background: "#13131a",
        padding: "40px",
        borderRadius: "12px",
        border: "1px solid #1e1e2e",
        width: "100%",
        maxWidth: "400px"
      }}>
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "12px",
          marginBottom: "24px"
        }}>
          <img 
            src="/images/puthan.jpg" 
            alt="Puthankada Logo" 
            style={{ width: "80px", height: "80px", objectFit: "cover", borderRadius: "50%", border: "2px solid #f57c00" }}
          />
        </div>
        <h1 style={{ color: "#fff", marginBottom: "8px", fontFamily: "'Syne', sans-serif", fontSize: "24px", textAlign: "center", fontWeight: 800 }}>
          PUTHANKADA
        </h1>
        <div style={{
          display: 'inline-block',
          background: 'linear-gradient(135deg, #f57c00, #4caf50)',
          padding: '6px 16px',
          borderRadius: '8px',
          marginBottom: '24px'
        }}>
          <span style={{ 
            color: '#fff',
            fontSize: '14px',
            fontWeight: '700',
            letterSpacing: '0.15em'
          }}>ADMIN PANEL</span>
        </div>

        {error && (
          <div style={{ background: "#ef444420", color: "#ef4444", padding: "12px", borderRadius: "8px", marginBottom: "20px", fontSize: "14px" }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <label style={{ display: "block", color: "#555570", fontSize: "12px", marginBottom: "6px" }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "12px",
                background: "#0f0f13",
                border: "1px solid #1e1e2e",
                borderRadius: "8px",
                color: "#e8e8f0",
                fontSize: "14px",
                outline: "none"
              }}
            />
          </div>

          <div>
            <label style={{ display: "block", color: "#555570", fontSize: "12px", marginBottom: "6px" }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "12px",
                background: "#0f0f13",
                border: "1px solid #1e1e2e",
                borderRadius: "8px",
                color: "#e8e8f0",
                fontSize: "14px",
                outline: "none"
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: "14px",
              background: "#f57c00",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: 600,
              cursor: loading ? "not-allowed" : "pointer",
              marginTop: "10px",
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}