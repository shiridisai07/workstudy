import { useEffect, useState } from "react";
import { getStudentApps, addHours, getStudentHours } from "../services/api";
import { useNavigate } from "react-router-dom";
import styles from "./Hours.module.css";

export default function Hours() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const [apps, setApps] = useState([]);
  const [records, setRecords] = useState([]);
  const [hours, setHours] = useState("");
  const [jobId, setJobId] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) navigate("/login");
    load();
  }, []);

  const load = async () => {
    try {
      const appsData = await getStudentApps(user.id);
      const hoursData = await getStudentHours(user.id);
      setApps(appsData || []);
      setRecords(hoursData || []);
    } catch (err) {
      console.error("Error loading hours data", err);
    }
  };

  const handleAdd = async () => {
    if (!hours || !jobId) return alert("Please select a job and enter hours.");
    setLoading(true);
    try {
      await addHours(user.id, jobId, hours);
      setHours("");
      alert("Hours logged successfully!");
      load();
    } catch (err) {
      alert("Failed to log hours. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const totalLogged = records.reduce((sum, r) => sum + parseFloat(r.hours || 0), 0);

  return (
    <div className={styles.pageViewport}>
      <div className={styles.glowOrb}></div>

      <div className={styles.container}>
        {/* SIDEBAR (Simplified for this view) */}
        <aside className={styles.sidebar}>
          <div className={styles.logo} onClick={() => navigate("/student")}>✦ StudentHub</div>
          <nav className={styles.nav}>
            <button onClick={() => navigate("/student")}>🏠 Dashboard</button>
            <button className={styles.active}>⏱ Log Hours</button>
            <button onClick={() => navigate("/student")}>🔍 Find Jobs</button>
          </nav>
          <div className={styles.sidebarBottom}>
            <button className={styles.backBtn} onClick={() => navigate("/student")}>← Back to Portal</button>
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <main className={styles.content}>
          <header className={styles.header}>
            <div>
              <h1>Timesheet</h1>
              <p>Track and submit your work hours for payroll</p>
            </div>
            <div className={styles.statBox}>
              <span className={styles.statLabel}>Total Hours Logged</span>
              <span className={styles.statValue}>{totalLogged} hrs</span>
            </div>
          </header>

          <div className={styles.mainGrid}>
            {/* LOGGING SECTION */}
            <section className={styles.glassCard}>
              <h3>Log New Session</h3>
              <div className={styles.formGroup}>
                <label>Select Approved Job</label>
                <select value={jobId} onChange={e => setJobId(e.target.value)}>
                  <option value="">Choose a position...</option>
                  {apps.filter(a => a.status === "APPROVED").map(a => (
                    <option key={a.id} value={a.job.id}>{a.job.title}</option>
                  ))}
                </select>
              </div>

              <div className={styles.formGroup}>
                <label>Number of Hours</label>
                <input
                  type="number"
                  placeholder="e.g. 4.5"
                  value={hours}
                  onChange={e => setHours(e.target.value)}
                />
              </div>

              <button className={styles.submitBtn} onClick={handleAdd} disabled={loading}>
                {loading ? "Saving..." : "Submit Hours →"}
              </button>
            </section>

            {/* HISTORY SECTION */}
            <section className={styles.glassCard}>
              <h3>Recent History</h3>
              <div className={styles.tableWrapper}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Job</th>
                      <th>Hours</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {records.map(r => (
                      <tr key={r.id}>
                        <td><strong>{r.job.title}</strong></td>
                        <td className={styles.hourValue}>{r.hours} hrs</td>
                        <td>{new Date().toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {records.length === 0 && <p className={styles.emptyMsg}>No hours logged yet.</p>}
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}