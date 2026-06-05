"use client";
import { useState, useEffect, useCallback, ReactNode } from "react";
import Image from "next/image";

type Banner = {
  _id?: string;
  desktopImage: string;
  mobileImage: string;
  isActive: boolean;
  tag: string;
  headline: string;
  subheadline: string;
  align: "left" | "center" | "right";
};

type FieldProps = { label: string; children: ReactNode };

export default function Banners() {
  const [banners, setBanners] = useState<Banner[]>([
    { desktopImage: "", mobileImage: "", isActive: true, tag: "", headline: "", subheadline: "", align: "left" },
    { desktopImage: "", mobileImage: "", isActive: true, tag: "", headline: "", subheadline: "", align: "left" },
    { desktopImage: "", mobileImage: "", isActive: true, tag: "", headline: "", subheadline: "", align: "left" },
  ]);
  const [loading, setLoading] = useState(false);
  const api = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api'; 

  const fetchBanners = useCallback(async () => {
    try {
      const res = await fetch(`${api}/banner`);
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      if (data.banners && data.banners.length > 0) {
        // Pad or trim to exactly 3 banners
        const fetchedBanners = data.banners;
        const defaultBanner = { desktopImage: "", mobileImage: "", isActive: true, tag: "", headline: "", subheadline: "", align: "left" };
        const newBanners = [
          fetchedBanners[0] ? { tag: "", headline: "", subheadline: "", align: "left", ...fetchedBanners[0] } : defaultBanner,
          fetchedBanners[1] ? { tag: "", headline: "", subheadline: "", align: "left", ...fetchedBanners[1] } : defaultBanner,
          fetchedBanners[2] ? { tag: "", headline: "", subheadline: "", align: "left", ...fetchedBanners[2] } : defaultBanner,
        ];
        setBanners(newBanners);
      }
    } catch (err) {
      console.error("Failed to fetch banners:", err);
      // Optional: alert("Could not connect to the backend server.");
    }
  }, [api]);

  useEffect(() => { fetchBanners(); }, [fetchBanners]);

  const toBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const handleFile = async (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
    type: "desktop" | "mobile"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const b64 = await toBase64(file);
    
    setBanners(prev => {
      const newBanners = [...prev];
      if (type === "desktop") {
        newBanners[index].desktopImage = b64;
      } else {
        newBanners[index].mobileImage = b64;
      }
      return newBanners;
    });
  };

  const handleTextChange = (index: number, field: keyof Banner, value: string) => {
    setBanners(prev => {
      const newBanners = [...prev];
      (newBanners[index] as any)[field] = value;
      return newBanners;
    });
  };

  const saveBanners = async () => {
    setLoading(true);
    try {
      const authToken = localStorage.getItem("token") || "";
      const res = await fetch(`${api}/banner/bulk`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: authToken },
        body: JSON.stringify({ banners }),
      });
      if (res.ok) {
        alert("Banners updated successfully!");
        fetchBanners();
      } else {
        const data = await res.json();
        alert(data.error || "Failed to update banners");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Remove a single image (desktop or mobile)
  const removeImage = (index: number, type: "desktop" | "mobile") => {
    setBanners(prev => {
      const newBanners = [...prev];
      if (type === "desktop") {
        newBanners[index].desktopImage = "";
      } else {
        newBanners[index].mobileImage = "";
      }
      return newBanners;
    });
  };

  // Clear both images for a banner (admin convenience)
  const clearBannerImages = (index: number) => {
    setBanners(prev => {
      const newBanners = [...prev];
      newBanners[index].desktopImage = "";
      newBanners[index].mobileImage = "";
      return newBanners;
    });
  };

  return (
    <div>
      <style>{`
        .card { background: #f5f5f5; border: 1px solid #e0e0e0; border-radius: 12px; }
        .btn-primary { background: #2196F3; color: #fff; border: none; border-radius: 8px; padding: 12px 24px; font-size: 14px; font-weight: 600; cursor: pointer; }
        .btn-primary:hover { background: #1976D2; }
        .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
        .btn-ghost { background: transparent; color: #666666; border: 1px solid #e0e0e0; border-radius: 8px; padding: 6px 12px; font-size: 12px; cursor: pointer; }
        .btn-ghost:hover { color: #FF5252; border-color: #FF525240; }
        .upload-input { display: none; }
        .banner-slot { padding: 24px; margin-bottom: 24px; }
        .banner-images-container { display: flex; gap: 24px; flex-wrap: wrap; margin-top: 16px; }
        .image-box { flex: 1; min-width: 280px; border: 2px dashed #2196F3; border-radius: 8px; padding: 16px; text-align: center; position: relative; background: #e3f2fd; }
        .preview-img { width: 100%; height: 160px; object-fit: cover; border-radius: 6px; }
        .remove-btn { position: absolute; top: 24px; right: 24px; background: #FF5252; color: white; border: none; border-radius: 50%; width: 24px; height: 24px; cursor: pointer; font-size: 12px; display: flex; align-items: center; justify-content: center; }
        .remove-btn:hover { background: #E53935; }
        .text-inputs { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-top: 20px; padding-top: 20px; border-top: 1px solid #e0e0e0; }
        .input-group { display: flex; flexDirection: column; gap: 8px; }
        .admin-input { background: #ffffff; border: 1px solid #e0e0e0; border-radius: 6px; padding: 10px; color: #333333; font-size: 14px; width: 100%; outline: none; }
        .admin-input:focus { border-color: #2196F3; box-shadow: 0 0 0 2px rgba(33, 150, 243, 0.1); }
        .admin-select { background: #ffffff; border: 1px solid #e0e0e0; border-radius: 6px; padding: 10px; color: #333333; font-size: 14px; width: 100%; outline: none; }
      `}</style>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, flexWrap: "wrap", gap: 12, width: "100%" }}>
        <div>
          <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(20px, 5vw, 26px)", fontWeight: 800, color: "#1a1a1a", margin: 0 }}>Manage Banners</h1>
          <p style={{ fontSize: 13, color: "#888888", margin: "4px 0 0 0" }}>Upload exactly 3 banners for the homepage hero slider.</p>
        </div>
        <button className="btn-primary" onClick={saveBanners} disabled={loading}>
          {loading ? "Saving..." : "Save All Banners"}
        </button>
      </div>

      {/* 3 Banner Slots */}
      <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
        {banners.map((banner, index) => (
          <div key={index} className="card banner-slot">
            <h2 style={{ color: "#1a1a1a", fontSize: "18px", margin: "0 0 8px 0" }}>Banner {index + 1}</h2>
            
            <div className="banner-images-container">
              {/* Desktop */}
              <div className="image-box">
                <Field label="Desktop Image (1920x800px)">
                  {banner.desktopImage ? (
                    <div style={{ position: "relative", marginTop: "12px" }}>
                      <Image src={banner.desktopImage} alt="Desktop" width={400} height={160} className="preview-img" unoptimized style={{ width: '100%', height: 160, objectFit: 'cover' }} />
                      <button className="remove-btn" onClick={() => removeImage(index, "desktop")}>✕</button>
                    </div>
                  ) : (
                    <label style={{ cursor: "pointer", display: "block", padding: "40px 0", marginTop: "12px", background: "#e3f2fd", borderRadius: "6px" }}>
                      <div style={{ fontSize: 13, color: "#2196F3", fontWeight: 500 }}>📁 Click to upload Desktop</div>
                      <input className="upload-input" type="file" accept="image/*" onChange={(e) => handleFile(e, index, "desktop")} />
                    </label>
                  )}
                </Field>
              </div>

              {/* Mobile */}
              <div className="image-box">
                <Field label="Mobile Image (800x1200px)">
                  {banner.mobileImage ? (
                    <div style={{ position: "relative", marginTop: "12px" }}>
                      <Image src={banner.mobileImage} alt="Mobile" width={200} height={160} className="preview-img" style={{ objectFit: 'cover', width: '100%', height: 160 }} unoptimized />
                      <button className="remove-btn" onClick={() => removeImage(index, "mobile")}>✕</button>
                    </div>
                  ) : (
                    <label style={{ cursor: "pointer", display: "block", padding: "40px 0", marginTop: "12px", background: "#e3f2fd", borderRadius: "6px" }}>
                      <div style={{ fontSize: 13, color: "#2196F3", fontWeight: 500 }}>📱 Click to upload Mobile</div>
                      <input className="upload-input" type="file" accept="image/*" onChange={(e) => handleFile(e, index, "mobile")} />
                    </label>
                  )}
                </Field>
              </div>
            </div>

            {/* Text Customization */}
            <div className="text-inputs">
              <div className="input-group">
                <div style={{ fontSize: 12, fontWeight: 600, color: "#2196F3", marginBottom: 4 }}>Tag</div>
                <input 
                  className="admin-input" 
                  placeholder="e.g. New Arrivals" 
                  value={banner.tag} 
                  onChange={(e) => handleTextChange(index, "tag", e.target.value)}
                />
              </div>
              <div className="input-group">
                <div style={{ fontSize: 12, fontWeight: 600, color: "#2196F3", marginBottom: 4 }}>Headline</div>
                <input 
                  className="admin-input" 
                  placeholder="e.g. Summer Collection" 
                  value={banner.headline} 
                  onChange={(e) => handleTextChange(index, "headline", e.target.value)}
                />
              </div>
              <div className="input-group" style={{ gridColumn: "span 1" }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: "#2196F3", marginBottom: 4 }}>Subheadline</div>
                <textarea 
                  className="admin-input" 
                  rows={1}
                  placeholder="e.g. Explore our latest styles" 
                  value={banner.subheadline} 
                  onChange={(e) => handleTextChange(index, "subheadline", e.target.value)}
                  style={{ resize: "none" }}
                />
              </div>
              <div className="input-group">
                <div style={{ fontSize: 12, fontWeight: 600, color: "#2196F3", marginBottom: 4 }}>Alignment</div>
                <select 
                  className="admin-select"
                  value={banner.align}
                  onChange={(e) => handleTextChange(index, "align", e.target.value)}
                >
                  <option value="left">Left</option>
                  <option value="center">Center</option>
                  <option value="right">Right</option>
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Field({ label, children }: FieldProps) {
  return (
    <div style={{ textAlign: "left" }}>
      <div style={{ fontSize: 12, fontWeight: 600, color: "#2196F3" }}>{label}</div>
      {children}
    </div>
  );
}
