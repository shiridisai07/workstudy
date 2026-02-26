const BASE = "http://localhost:8080/api";

/* ================= REGISTER ================= */

export const registerStudent = async (data) => {
  const res = await fetch(`${BASE}/students/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });

  if (!res.ok) throw new Error("Registration failed");

  return res.json();
};

/* ================= LOGIN ================= */

export const loginStudent = async (data) => {
  const res = await fetch(`${BASE}/students/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });

  if (!res.ok) throw new Error("Invalid login");

  return res.json();
};

/* ================= JOBS ================= */

export const getJobs = async () => {
  const res = await fetch(`${BASE}/jobs`);
  return res.json();
};

export const addJob = async (job) => {
  const res = await fetch(`${BASE}/jobs`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(job)
  });

  if (!res.ok) throw new Error("Job creation failed");

  return res.json();
};

export const deleteJob = async(id)=>{
  const res = await fetch(`${BASE}/jobs/${id}`,{
    method:"DELETE"
  });

  if(!res.ok) throw new Error("Delete job failed");
};

/* ================= APPLICATIONS ================= */

export const applyJob = async (sid, jid, file) => {

  const form = new FormData();
  form.append("studentId", sid);
  form.append("jobId", jid);
  form.append("resume", file);

  const res = await fetch(`${BASE}/applications/apply`, {
    method:"POST",
    body: form
  });

  if (!res.ok) throw new Error("Apply failed");

  return res.json();
};

export const getApplications = async () => {
  const res = await fetch(`${BASE}/applications`);
  return res.json();
};

export const approveApp = async (id, status="APPROVED") => {
  const res = await fetch(
    `${BASE}/applications/${id}?status=${status}`,
    { method: "PUT" }
  );

  if (!res.ok) throw new Error("Approve failed");
};

export const getStudentApps = async (sid) => {
  const res = await fetch(`${BASE}/applications/student/${sid}`);
  return res.json();
};

/* ================= HOURS ================= */

export const addHours = async (sid, jid, hours) => {
  const res = await fetch(
    `${BASE}/hours?studentId=${sid}&jobId=${jid}&hours=${hours}`,
    { method: "POST" }
  );

  if (!res.ok) throw new Error("Add hours failed");

  return res.json();
};

export const getStudentHours = async (sid) => {
  const res = await fetch(`${BASE}/hours/student/${sid}`);
  return res.json();
};

export const getAllHours = async () => {
  const res = await fetch(`${BASE}/hours`);
  return res.json();
};

/* ================= DELETE ACCOUNT ================= */

export const deleteAccount = async(id)=>{
  const res = await fetch(`${BASE}/students/${id}`,{
    method:"DELETE"
  });

  if(!res.ok) throw new Error("Delete failed");
};
