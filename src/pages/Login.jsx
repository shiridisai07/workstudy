import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginStudent } from "../services/api";
import styles from './Login.module.css';

const slideImages = [
  "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1600&q=80"
];

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slideImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await loginStudent({ email, password });
      localStorage.setItem("user", JSON.stringify(user));
      navigate(user.role === "admin" ? "/admin" : "/student", { replace: true });
    } catch (err) {
      alert("Invalid Email or Password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.viewport}>
      {/* Dynamic Background Slider */}
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
        {/* Left Section: Visible Text & Branding */}
        <div className={styles.leftBranding}>
          <span className={styles.tag}>LIVE ECOSYSTEM</span>
          <h1 className={styles.title}>
            The New Standard <br/>
            for <span className={styles.highlight}>Work-Study.</span>
          </h1>
          <p className={styles.description}>
            Streamlined applications. Instant payroll tracking. All in one place.
          </p>
          
          <div className={styles.statsGrid}>
            <div className={styles.statBox}>
              <span className={styles.statValue}>98%</span>
              <span className={styles.statLabel}>Student Satisfaction</span>
            </div>
            <div className={styles.statBox}>
              <span className={styles.statValue}>24/7</span>
              <span className={styles.statLabel}>System Access</span>
            </div>
          </div>
        </div>

        {/* Right Section: High-Contrast Form */}
        <div className={styles.rightForm}>
          <div className={styles.loginBox}>
            <h2 className={styles.welcomeText}>Welcome</h2>
            <p className={styles.subText}>Log in to access your portal</p>

            <form onSubmit={handleLogin} className={styles.form}>
              <div className={styles.inputGroup}>
                <label>Institutional Email</label>
                <input 
                  type="email" 
                  placeholder="student@university.edu" 
                  value={email} 
                  onChange={e => setEmail(e.target.value)} 
                  required 
                />
              </div>

              <div className={styles.inputGroup}>
                <label>Security Key</label>
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                  required 
                />
              </div>

              <button type="submit" className={styles.loginBtn} disabled={loading}>
                {loading ? "Authenticating..." : "Enter Portal →"}
              </button>
            </form>

            <p className={styles.registerLink}>
              First time here? <Link to="/register">Request Access</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}