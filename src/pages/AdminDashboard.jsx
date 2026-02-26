import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getApplications,
  approveApp,
  addJob,
  getJobs,
  deleteJob,
  getAllHours
} from "../services/api";
import styles from './AdminDashboard.module.css';

export default function AdminDashboard() {
  const [apps, setApps] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [hours, setHours] = useState([]);
  const [user, setUser] = useState(null);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [tab, setTab] = useState("jobs");
  
  // Background Slider Logic
  const [bgIndex, setBgIndex] = useState(0);
  const backgrounds = [
    "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=2070",
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=2070",
    "https://images.unsplash.com/photo-1554469384-e58fac16e23a?auto=format&fit=crop&q=80&w=1974"
  ];

  const navigate = useNavigate();

  useEffect(() => { 
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
    load();

    // Background transition timer
    const interval = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % backgrounds.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const load = async () => {
    try {
      const [appsRes, jobsRes, hoursRes] = await Promise.all([
        getApplications(),
        getJobs(),
        getAllHours()
      ]);
      setApps(appsRes || []);
      setJobs(jobsRes || []);
      setHours(hoursRes || []);
    } catch (err) {
      console.error("Data fetch failed", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  const approve = async (id, status) => {
    await approveApp(id, status);
    load();
  };

  const createJob = async () => {
    if (!title || !desc) return alert("Please fill all fields");
    await addJob({ title, description: desc });
    setTitle(""); setDesc("");
    load();
  };

  const removeJob = async (id) => {
    if (window.confirm("Delete this posting permanently?")) {
      await deleteJob(id);
      load();
    }
  };

  const totalHours = hours.reduce((s, h) => s + (h.hours || 0), 0);

  return (
    <div className={styles.dashboardViewport}>
      {/* 1. CINEMATIC SLIDER LAYER */}
      <div className={styles.sliderContainer}>
        {backgrounds.map((src, i) => (
          <div 
            key={i} 
            className={`${styles.slide} ${i === bgIndex ? styles.active : ""}`}
            style={{ backgroundImage: `url(${src})` }}
          />
        ))}
      </div>

      {/* 2. PROTECTIVE OVERLAY LAYER */}
      <div className={styles.deepVignette}></div>
      <div className={styles.glowOrb}></div>

      {/* 3. CONTENT LAYER */}
      <header className={styles.topNav}>
        <div className={styles.navInner}>
          <div className={styles.brand}>✦ WorkStudy <span className={styles.brandLite}>Admin</span></div>
          
          <nav className={styles.centerTabs}>
            <button className={tab === "jobs" ? styles.tabActive : styles.tab} onClick={() => setTab("jobs")}>
              Job Postings
            </button>
            <button className={tab === "apps" ? styles.tabActive : styles.tab} onClick={() => setTab("apps")}>
              Applications
            </button>
            <button className={tab === "hours" ? styles.tabActive : styles.tab} onClick={() => setTab("hours")}>
              Work Hours
            </button>
          </nav>

          <div className={styles.userSection}>
            <div className={styles.userInfo}>
              <span className={styles.uName}>{user?.name || "Admin"}</span>
              <span className={styles.uRole}>Manager Access</span>
            </div>
            <button className={styles.navLogout} onClick={handleLogout}>Logout</button>
          </div>
        </div>
      </header>

      <main className={styles.workspace}>
        <header className={styles.workspaceHeader}>
          <div>
            <h1>Control Center</h1>
            <p>Active Ecosystem: <strong>{jobs.length} Listings</strong></p>
          </div>
          <div className={styles.summaryStats}>
            <div className={styles.miniStat}>
              <span className={styles.statVal}>{apps.length}</span>
              <span className={styles.statLabel}>Pending Apps</span>
            </div>
            <div className={styles.miniStat}>
              <span className={styles.statVal}>{totalHours}</span>
              <span className={styles.statLabel}>Total Hours</span>
            </div>
          </div>
        </header>

        <div className={styles.scrollContent}>
          {tab === "jobs" && (
            <div className={styles.fadeAnim}>
              <div className={styles.createPanel}>
                <h3>Post a New Position</h3>
                <div className={styles.formRow}>
                  <input 
                    placeholder="Job Title" 
                    value={title} 
                    onChange={e => setTitle(e.target.value)} 
                    className={styles.modernInput} 
                  />
                  <input 
                    placeholder="Description" 
                    value={desc} 
                    onChange={e => setDesc(e.target.value)} 
                    className={styles.modernInput} 
                  />
                  <button onClick={createJob} className={styles.createBtn}>Create Listing</button>
                </div>
              </div>

              <div className={styles.grid}>
                {jobs.map(j => (
                  <div className={styles.obsidianCard} key={j.id}>
                    <div className={styles.cardTop}>
                      <h4>{j.title}</h4>
                      <button className={styles.deleteLink} onClick={() => removeJob(j.id)}>Delete</button>
                    </div>
                    <p className={styles.cardDesc}>{j.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === "apps" && (
            <div className={styles.grid}>
              {apps.map(a => (
                <div className={styles.obsidianCard} key={a.id}>
                  <div className={styles.appHeader}>
                    <div>
                      <h4>{a.student.name}</h4>
                      <p className={styles.targetJob}>Applying for {a.job.title}</p>
                    </div>
                    <span className={styles.statusPill} data-status={a.status}>{a.status}</span>
                  </div>
                  
                  <div className={styles.appActions}>
                    <a href={`http://localhost:8080/api/applications/resume/${a.id}`} target="_blank" rel="noreferrer" className={styles.resumeLink}>View CV ↗</a>
                    {a.status === "PENDING" && (
                      <div className={styles.btnGroup}>
                        <button onClick={() => approve(a.id, "APPROVED")} className={styles.approveBtn}>Approve</button>
                        <button onClick={() => approve(a.id, "REJECTED")} className={styles.rejectBtn}>Reject</button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === "hours" && (
            <div className={styles.tableWrapper}>
              <table className={styles.cleanTable}>
                <thead>
                  <tr><th>Student</th><th>Position</th><th>Logged Time</th></tr>
                </thead>
                <tbody>
                  {hours.map(h => (
                    <tr key={h.id}>
                      <td className={styles.boldCell}>{h.student.name}</td>
                      <td>{h.job?.title}</td>
                      <td className={styles.accentText}>{h.hours} hrs</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}