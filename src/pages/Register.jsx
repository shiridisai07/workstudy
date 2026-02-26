import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerStudent } from "../services/api";
import styles from "./Register.module.css";

const slideImages = [
  "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1600&q=80"
];

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [loading, setLoading] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const nav = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slideImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) return alert("Fill all fields");
    setLoading(true);
    try {
      const res = await registerStudent({ name, email, password, role });
      localStorage.setItem("user", JSON.stringify(res));
      nav(res.role === "admin" ? "/admin" : "/student");
    } catch (err) {
      alert("Registration failed. Email might already be in use.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.viewport}>
      {/* Cinematic Background Slider */}
      <div className={styles.sliderContainer}>
        {slideImages.map((img, i) => (
          <div 
            key={i}
            className={`${styles.slide} ${i === currentSlide ? styles.active : ""}`}
            style={{ backgroundImage: `url(${img})` }}
          />
        ))}
        <div className={styles.darkOverlay}></div>
      </div>

      <div className={styles.mainCard}>
        {/* Left Section: Context & Branding */}
        <div className={styles.leftBranding}>
          <span className={styles.tag}>JOIN THE NETWORK</span>
          <h1 className={styles.title}>
            Start Your <br/>
            <span className={styles.highlight}>Journey</span> With Us.
          </h1>
          <p className={styles.description}>
            Access exclusive work-study opportunities and manage your professional growth in one centralized portal.
          </p>
          
          <div className={styles.infoRow}>
            <div className={styles.infoBox}>
              <span className={styles.infoIcon}>🛡️</span>
              <span className={styles.infoText}>Secure Access</span>
            </div>
            <div className={styles.infoBox}>
              <span className={styles.infoIcon}>⚡</span>
              <span className={styles.infoText}>Instant Setup</span>
            </div>
          </div>
        </div>

        {/* Right Section: Form Section */}
        <div className={styles.rightForm}>
          <div className={styles.glassForm}>
            <div className={styles.header}>
              <h2>Register</h2>
              <p>Choose your role and fill the details</p>
            </div>

            <div className={styles.rolePicker}>
              <button
                type="button"
                className={role === "student" ? styles.roleActive : styles.roleBtn}
                onClick={() => setRole("student")}
              >
                🎓 Student
              </button>
              <button
                type="button"
                className={role === "admin" ? styles.roleActive : styles.roleBtn}
                onClick={() => setRole("admin")}
              >
                🧑‍💼 Admin
              </button>
            </div>

            <form onSubmit={handleRegister} className={styles.form}>
              <div className={styles.inputGroup}>
                <label>Full Name</label>
                <input placeholder="John Doe" onChange={e => setName(e.target.value)} required />
              </div>
              <div className={styles.inputGroup}>
                <label>Institutional Email</label>
                <input type="email" placeholder="name@university.edu" onChange={e => setEmail(e.target.value)} required />
              </div>
              <div className={styles.inputGroup}>
                <label>Security Key</label>
                <input type="password" placeholder="••••••••" onChange={e => setPassword(e.target.value)} required />
              </div>

              <button className={styles.submitBtn} disabled={loading}>
                {loading ? "Creating..." : "Create Account →"}
              </button>
            </form>

            <p className={styles.loginLink}>
              Already a member? <Link to="/login">Sign In</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}