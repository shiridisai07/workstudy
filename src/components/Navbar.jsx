import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "./Navbar.css";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [theme, setTheme] = useState("dark");
  const [user, setUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "dark";
    setTheme(savedTheme);
    document.documentElement.setAttribute("data-theme", savedTheme);

    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
    else setUser(null);
  }, [location]);

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleThemeToggle = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  if (!user) return null;

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-brand">
          <Link to={user.role === "student" ? "/jobs" : "/admin"} className="nav-logo">
            {user.role === "student" ? "Student Portal" : "Admin Portal"}
          </Link>
        </div>

        <ul className="nav-menu active">

          {/* STUDENT MENU */}
          {user.role === "student" && (
<>
<li className="nav-item">
  <Link to="/jobs" className="nav-link">Jobs</Link>
</li>

<li className="nav-item">
  <Link to="/hours" className="nav-link">Hours</Link>
</li>
</>
)}


          {/* ADMIN MENU */}
          {user.role === "admin" && (
            <>
              <li><Link to="/admin">Dashboard</Link></li>
              <li><Link to="/admin">Applications</Link></li>
              <li><Link to="/admin">Students</Link></li>
            </>
          )}

          <li>Hi, {user.name}</li>

          <li>
            <button className="logout-btn" onClick={handleLogout}>Logout</button>
          </li>

        </ul>

        <button className="theme-toggle" onClick={handleThemeToggle}>
          {theme === "dark" ? "☀️" : "🌙"}
        </button>
      </div>
    </nav>
  );
}