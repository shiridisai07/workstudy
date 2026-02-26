import { useEffect, useState } from "react";
import { getJobs, getStudentApps, applyJob, deleteAccount } from "../services/api";
import { useNavigate } from "react-router-dom";
import styles from "./StudentDashboard.module.css";

const slideImages = [
  "https://images.unsplash.com/photo-1523240715630-30d82d734e0c?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=1600&q=80"
];

export default function StudentDashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const [jobs, setJobs] = useState([]);
  const [apps, setApps] = useState([]);
  const [files, setFiles] = useState({});
  const [tab, setTab] = useState("jobs");
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (!user) navigate("/login");
    const interval = setInterval(() => setCurrentSlide(s => (s + 1) % slideImages.length), 8000);
    load();
    return () => clearInterval(interval);
  }, []);

  const load = async () => {
    const jobsData = await getJobs();
    const appsData = await getStudentApps(user.id);
    setJobs(jobsData || []);
    setApps(appsData || []);
  };

  const handleApply = async (id) => {
    if (!files[id]) return alert("Attach a resume");
    try {
      await applyJob(user.id, id, files[id]);
      alert("Applied!");
      load();
    } catch { alert("Failed to apply."); }
  };

  return (
    <div className={styles.dashboardViewport}>
      {/* Cinematic Background */}
      <div className={styles.sliderContainer}>
        {slideImages.map((img, i) => (
          <div key={i} className={`${styles.slide} ${i === currentSlide ? styles.active : ""}`}
            style={{ backgroundImage: `url(${img})` }} />
        ))}
        <div className={styles.deepVignette}></div>
      </div>

      {/* Top Professional Navigation */}
      <header className={styles.topNav}>
        <div className={styles.navInner}>
          <div className={styles.brand}>✦ StudentHub</div>
          
          <nav className={styles.centerTabs}>
            <button className={tab === "jobs" ? styles.tabActive : styles.tab} onClick={() => setTab("jobs")}>
              Find Opportunities
            </button>
            <button className={tab === "history" ? styles.tabActive : styles.tab} onClick={() => setTab("history")}>
              Application History
            </button>
          </nav>

          <div className={styles.userSection}>
            <div className={styles.userInfo}>
              <span className={styles.uName}>{user?.name}</span>
              <span className={styles.uRole}>Student</span>
            </div>
            <button className={styles.navLogout} onClick={() => {localStorage.removeItem("user"); navigate("/login");}}>
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Scroll Area */}
      <main className={styles.contentContainer}>
        <div className={styles.contentHeader}>
          <h1>{tab === "jobs" ? "Available Roles" : "Track Your Progress"}</h1>
          <div className={styles.badge}>{apps.length} Total Applications</div>
        </div>

        <div className={styles.scrollArea}>
          {tab === "jobs" ? (
            <div className={styles.grid}>
              {jobs.map((j) => {
                const applied = apps.find((a) => a.job.id === j.id);
                return (
                  <div className={styles.professionalCard} key={j.id}>
                    <div className={styles.cardHeader}>
                      <h3>{j.title}</h3>
                      {applied && <span className={styles.status} data-status={applied.status}>{applied.status}</span>}
                    </div>
                    <p className={styles.cardDesc}>{j.description}</p>
                    
                    {!applied ? (
                      <div className={styles.cardFooter}>
                        <label className={styles.uploadBtn}>
                          <input type="file" onChange={(e) => setFiles(p => ({ ...p, [j.id]: e.target.files[0] }))} />
                          {files[j.id] ? "📄 Ready" : "Upload CV"}
                        </label>
                        <button onClick={() => handleApply(j.id)} className={styles.applyAction}>Apply</button>
                      </div>
                    ) : (
                      <div className={styles.appliedNote}>✓ You already applied</div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className={styles.tableWrapper}>
              <table className={styles.cleanTable}>
                <thead><tr><th>Position</th><th>Status</th><th>Date Applied</th></tr></thead>
                <tbody>
                  {apps.map((a) => (
                    <tr key={a.id}>
                      <td className={styles.boldCell}>{a.job.title}</td>
                      <td><span className={styles.status} data-status={a.status}>{a.status}</span></td>
                      <td>{new Date().toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <button className={styles.deleteLink} onClick={() => {if(window.confirm("Delete account?")) deleteAccount(user.id).then(()=>navigate("/login"))}}>Delete My Account</button>
        </div>
      </main>
    </div>
  );
}