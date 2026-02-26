import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Jobs from "./pages/Jobs";
import Hours from "./pages/Hours";
import Admin from "./pages/AdminDashboard";
import StudentDashboard from "./pages/StudentDashboard";

/* ================= PROTECTED ROUTE ================= */
function Protected({ children, role }) {
  const user = JSON.parse(localStorage.getItem("user") || "null");

  if (!user) return <Navigate to="/login" replace />;

  if (role && user.role !== role) {
    return <Navigate to={user.role === "admin" ? "/admin" : "/student"} replace />;
  }

  return children;
}

/* ================= MAIN APP ================= */
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Landing */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* STUDENT - No 'Layout' wrapper, the dashboard handles its own UI */}
        <Route
          path="/student"
          element={
            <Protected role="student">
              <StudentDashboard />
            </Protected>
          }
        />

        <Route
          path="/jobs"
          element={
            <Protected role="student">
              <Jobs />
            </Protected>
          }
        />

        <Route
          path="/hours"
          element={
            <Protected role="student">
              <Hours />
            </Protected>
          }
        />

        {/* ADMIN */}
        <Route
          path="/admin"
          element={
            <Protected role="admin">
              <Admin />
            </Protected>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}