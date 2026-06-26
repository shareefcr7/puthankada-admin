"use client";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";

interface SidebarProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (value: boolean) => void;
}

const NAV = [
  {
    id: "categories",
    label: "Categories",
    path: "/admin/categories",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
      </svg>
    ),
  },
  {
    id: "subcategories",
    label: "Brands ",
    path: "/admin/subcategory",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
      </svg>
    ),
  },
  {
    id: "products",
    label: "Products",
    path: "/admin/products",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
        <line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 0 1-8 0" />
      </svg>
    ),
  },
  {
    id: "banners",
    label: "Banners",
    path: "/admin/banners",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18M9 21V9" />
      </svg>
    ),
  },
];

export default function Sidebar({ isSidebarOpen, setIsSidebarOpen }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();

  const handleNavClick = (path: string) => {
    router.push(path);
    // Close sidebar on mobile after navigation
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.replace("/login");
  };

  return (
    <>
      <style>{`
        /* Overlay backdrop */
        .sidebar-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.5);
          opacity: 0;
          pointer-events: none;
          z-index: 40;
        }

        .sidebar-overlay.active {
          opacity: 1;
          pointer-events: auto;
        }

        /* Sidebar container */
        .sidebar {
          position: fixed;
          left: 0;
          top: 0;
          width: 240px;
          height: 100vh;
          background: var(--surface-light, #f5f5f5);
          border-right: 1px solid var(--border-light, #e0e0e0);
          display: flex;
          flex-direction: column;
          padding: 28px 0;
          transform: translateX(-100%);
          z-index: 50;
          pointer-events: auto;
          overflow-y: auto;
          font-family: 'DM Sans', sans-serif;
          box-shadow: 1px 0 8px rgba(0, 0, 0, 0.1);
        }

        .sidebar.open {
          transform: translateX(0);
          pointer-events: auto;
        }

        /* Desktop - sidebar always visible, no positioning needed */
        @media (min-width: 768px) {
          .sidebar {
            position: relative;
            width: 240px;
            height: 100%;
            transform: translateX(0);
            z-index: auto;
            border-right: 1px solid var(--border-light, #1e1e2e);
            box-shadow: none;
            flex-shrink: 0;
          }

          .sidebar-overlay {
            display: none !important;
          }

          .sidebar-overlay.active {
            display: none !important;
          }
        }

        /* Sidebar header/logo */
        .sidebar-header {
          padding: 0 24px 32px;
          border-bottom: 1px solid var(--border-light, #e0e0e0);
          text-align: center;
        }

        .sidebar-logo-container {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          margin-bottom: 8px;
        }

        .sidebar-logo-image {
          width: 64px;
          height: 64px;
          object-fit: cover;
          border-radius: 50%;
          border: 2px solid var(--puthankada-orange, #2196F3);
        }

        .sidebar-logo {
          font-family: 'Syne', sans-serif;
          font-size: 18px;
          font-weight: 800;
          letter-spacing: -0.02em;
          color: var(--text-primary, #1a1a1a);
          margin: 0;
        }

        .sidebar-logo-accent {
          color: var(--puthankada-green, #4CAF50);
        }

        .sidebar-subtext {
          font-size: 10px;
          color: var(--text-secondary, #666666);
          margin-top: 2px;
          font-weight: 500;
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }

        /* Navigation section */
        .sidebar-nav {
          margin-top: 20px;
          flex: 1;
          overflow-y: auto;
        }

        .sidebar-nav-label {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.12em;
          color: var(--text-secondary, #33334a);
          padding: 0 24px 10px;
          text-transform: uppercase;
        }

        /* Navigation items */
        .nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 24px;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 500;
          color: var(--text-primary, #666666);
          border-left: 3px solid transparent;
          user-select: none;
          letter-spacing: 0.01em;
          margin: 0 12px;
          border-radius: 0 8px 8px 0;
          transition: all 0.2s ease;
        }

        .nav-item:hover {
          color: var(--puthankada-orange, #2196F3);
          background: var(--accent-orange-soft, #f0f0f0);
          border-left-color: var(--puthankada-orange, #2196F3);
        }

        .nav-item.active {
          color: var(--puthankada-orange, #2196F3);
          background: var(--accent-orange-soft, #e3f2fd);
          border-left-color: var(--puthankada-orange, #2196F3);
          font-weight: 600;
        }

        .nav-item.active svg {
          color: var(--puthankada-orange, #2196F3);
        }

        .nav-item svg {
          color: currentColor;
          flex-shrink: 0;
        }

        /* Sidebar footer */
        .sidebar-footer {
          padding: 20px 24px;
          border-top: 1px solid var(--border-light, #e0e0e0);
          margin-top: auto;
        }

        .user-profile {
          display: flex;
          align-items: center;
          gap: 10px;
          padding-bottom: 12px;
        }

        .user-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--puthankada-orange, #2196F3), var(--puthankada-green, #4CAF50));
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 13px;
          font-weight: 700;
          color: #fff;
          flex-shrink: 0;
        }

        .user-info {
          min-width: 0;
          flex: 1;
        }

        .user-name {
          font-size: 13px;
          font-weight: 600;
          color: var(--text-primary, #333333);
          margin: 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .user-email {
          font-size: 11px;
          color: var(--text-secondary, #888888);
          margin: 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .logout-btn {
          padding: 12px 24px;
          cursor: pointer;
          color: var(--text-primary, #666666);
          border: none;
          background: transparent;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          width: 100%;
          text-align: left;
          font-family: 'DM Sans', sans-serif;
          transition: all 0.2s ease;
        }

        .logout-btn:hover {
          color: var(--puthankada-orange, #FF5252);
          background: var(--accent-orange-soft, #ffebee);
        }

        .logout-btn:active {
          background: var(--accent-orange-soft, #ffcdd2);
        }

        /* Mobile adjustments */
        @media (max-width: 767px) {
          .sidebar {
            width: 220px;
          }

          .sidebar-header {
            padding: 20px 24px 24px;
          }

          .nav-item {
            padding: 10px 24px;
            margin: 0;
            border-radius: 0;
            font-size: 13px;
          }

          .sidebar-footer {
            padding: 16px 24px;
          }
        }

        /* Scrollbar styling */
        .sidebar::-webkit-scrollbar {
          width: 4px;
        }

        .sidebar::-webkit-scrollbar-track {
          background: transparent;
        }

        .sidebar::-webkit-scrollbar-thumb {
          background: var(--border-light, #2a2a38);
          border-radius: 4px;
        }

        .sidebar::-webkit-scrollbar-thumb:hover {
          background: var(--text-secondary, #3a3a48);
        }
      `}</style>

      {/* Overlay - click to close sidebar on mobile */}
      <div
        className={`sidebar-overlay${isSidebarOpen ? " active" : ""}`}
        onClick={() => setIsSidebarOpen(false)}
        aria-hidden={!isSidebarOpen}
      />

      {/* Sidebar */}
      <aside className={`sidebar${isSidebarOpen ? " open" : ""}`} role="navigation">
        {/* Logo Section */}
        <div className="sidebar-header">
          <div className="sidebar-logo-container">
            <img
              src="/puthankada-logo.png"
              alt="Puthankada Logo"
              className="sidebar-logo-image"
              width="64"
              height="64"
            />
          </div>
          <h1 className="sidebar-logo">
            PUTHAN<span className="sidebar-logo-accent">KADA</span>
          </h1>
          <div style={{
            display: 'inline-block',
            background: 'linear-gradient(135deg, #f57c00, #4caf50)',
            padding: '4px 12px',
            borderRadius: '6px',
            marginTop: '8px'
          }}>
            <p className="sidebar-subtext" style={{ 
              color: '#fff',
              fontWeight: '700',
              letterSpacing: '0.1em',
              margin: 0
            }}>ADMIN PANEL</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          <div className="sidebar-nav-label">Management</div>
          {NAV.map((item) => (
            <div
              key={item.id}
              className={`nav-item${pathname === item.path ? " active" : ""}`}
              onClick={() => handleNavClick(item.path)}
              role="menuitem"
              tabIndex={0}
            >
              {item.icon}
              <span>{item.label}</span>
            </div>
          ))}
        </nav>

        {/* Footer Section */}
        <div className="sidebar-footer">
          <div className="user-profile">
            <div className="user-avatar">A</div>
            <div className="user-info">
              <p className="user-name">Admin</p>
              <p className="user-email">admin@store.com</p>
            </div>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}