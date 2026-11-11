import { useEffect } from "react";
import { NavLink, Navigate, Outlet, Route, Routes, useNavigate } from "react-router-dom";

import { getSessionToken, setUnauthorizedHandler } from "@/lib/api";
import { Icons } from "@/lib/icons";
import SignUp from "@/screens/SignUp";
import SignIn from "@/screens/SignIn";
import Today from "@/screens/Today";

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  [
    "flex items-center gap-2 rounded-[var(--brand-radius)] px-3 py-2 text-sm font-medium transition-colors",
    isActive ? "bg-[var(--brand-hover)] text-[var(--brand-fg)]" : "text-[var(--brand-fg-muted)]",
  ].join(" ");

// The app's menu, drawn around every screen except the ones routed outside it below.
function AppShellLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <header
        className="border-b"
        style={{
          backgroundColor: "var(--brand-surface)",
          borderColor: "var(--brand-border)",
        }}
      >
        <div className="flex items-center gap-6 px-6 py-2">
          <p
            className="shrink-0 text-sm font-semibold"
            style={{ fontFamily: "var(--brand-font-heading)" }}
          >
            {"Habit Tracker"}
          </p>
          <nav aria-label="App menu" className="flex flex-wrap items-center gap-1">
            <NavLink to="/today" className={navLinkClass}>
              <Icons.Check size={16} />
              {"Today"}
            </NavLink>
          </nav>
        </div>
      </header>
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}

function RequireAuth() {
  if (!getSessionToken()) return <Navigate to="/sign-in" replace />;
  return <Outlet />;
}

export default function App() {
  const navigate = useNavigate();
  useEffect(() => {
    setUnauthorizedHandler(() => navigate("/sign-in", { replace: true }));
    return () => setUnauthorizedHandler(null);
  }, [navigate]);
  return (
    <Routes>
      <Route element={<RequireAuth />}>
        <Route element={<AppShellLayout />}>
          <Route path="/today" element={<Today />} />
        </Route>
      </Route>
      <Route path="/sign-up" element={<SignUp />} />
      <Route path="/sign-in" element={<SignIn />} />
      <Route path="*" element={<Navigate to="/sign-up" replace />} />
    </Routes>
  );
}
