import { useEffect, useState } from "react";
import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000",
});

function App() {
  const [employees, setEmployees] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [loadingEmployees, setLoadingEmployees] = useState(true);
  const [loadingAttendanceId, setLoadingAttendanceId] = useState(null);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    employee_id: "",
    full_name: "",
    email: "",
    department: "",
  });

  /* ---------------- FETCH EMPLOYEES ---------------- */
  const fetchEmployees = async () => {
    try {
      setLoadingEmployees(true);
      const res = await API.get("/employees");
      setEmployees(res.data);
      setError("");
    } catch {
      setError("❌ Backend not reachable. Is FastAPI running?");
    } finally {
      setLoadingEmployees(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  /* ---------------- ADD EMPLOYEE ---------------- */
  const addEmployee = async () => {
    if (
      !form.employee_id ||
      !form.full_name ||
      !form.email ||
      !form.department
    ) {
      alert("Please fill all fields");
      return;
    }

    try {
      await API.post("/employees", form);
      setForm({
        employee_id: "",
        full_name: "",
        email: "",
        department: "",
      });
      fetchEmployees();
    } catch (err) {
      if (err.response?.status === 409) {
        alert("Employee with this ID already exists");
      } else {
        alert("Failed to add employee");
      }
    }
  };

  /* ---------------- DELETE EMPLOYEE ---------------- */
  const deleteEmployee = async (id) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete employee ID ${id}?\nThis action cannot be undone.`
    );

    if (!confirmDelete) return;

    try {
      await API.delete(`/employees/${id}`);
      fetchEmployees();
    } catch {
      alert("Failed to delete employee");
    }
  };

  /* ---------------- MARK ATTENDANCE ---------------- */
  const markAttendance = async (id, status) => {
    const today = new Date().toISOString().split("T")[0];
    try {
      await API.post("/attendance", {
        employee_id: id,
        date: today,
        status,
      });
      alert(`✅ Marked ${status} for ${id}`);
    } catch {
      alert("❌ Failed to mark attendance");
    }
  };

  /* ---------------- VIEW ATTENDANCE ---------------- */
  const viewAttendance = async (id) => {
    try {
      setLoadingAttendanceId(id);
      const res = await API.get(`/attendance/${id}`);
      setAttendance((prev) => ({ ...prev, [id]: res.data }));
    } catch {
      alert("Unable to fetch attendance records");
    } finally {
      setLoadingAttendanceId(null);
    }
  };

  return (
    <div style={styles.container}>
      <h1>HRMS Lite</h1>

      {error && <p style={styles.error}>{error}</p>}

      {/* -------- ADD EMPLOYEE -------- */}
      <div style={styles.card}>
        <h2>Add Employee</h2>

        <input
          placeholder="Employee ID (unique)"
          value={form.employee_id}
          onChange={(e) => setForm({ ...form, employee_id: e.target.value })}
        />
        <input
          placeholder="Full Name"
          value={form.full_name}
          onChange={(e) => setForm({ ...form, full_name: e.target.value })}
        />
        <input
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          placeholder="Department"
          value={form.department}
          onChange={(e) => setForm({ ...form, department: e.target.value })}
        />

        <button onClick={addEmployee}>➕ Add Employee</button>
      </div>

      {/* -------- EMPLOYEE LIST -------- */}
      <div style={styles.card}>
        <h2>Employees</h2>

        {loadingEmployees && <p>Loading employees...</p>}

        {!loadingEmployees && employees.length === 0 && (
          <p>No employees found. Please add one.</p>
        )}

        {employees.map((emp) => (
          <div key={emp.employee_id} style={styles.employee}>
            <strong>
              {emp.full_name} ({emp.department})
            </strong>
            <div style={styles.subText}>
              Employee ID: <b>{emp.employee_id}</b> | {emp.email}
            </div>

            <div style={styles.actions}>
              <button onClick={() => markAttendance(emp.employee_id, "Present")}>
                ✅ Present
              </button>
              <button onClick={() => markAttendance(emp.employee_id, "Absent")}>
                ❌ Absent
              </button>
              <button onClick={() => viewAttendance(emp.employee_id)}>
                📅 View Attendance
              </button>
              <button
                style={styles.delete}
                onClick={() => deleteEmployee(emp.employee_id)}
              >
                Delete
              </button>
            </div>

            {loadingAttendanceId === emp.employee_id && (
              <p>Loading attendance...</p>
            )}

            {attendance[emp.employee_id] && (
              <div style={styles.attendance}>
                {attendance[emp.employee_id].length === 0 ? (
                  <p>No attendance records yet</p>
                ) : (
                  <>
                    {attendance[emp.employee_id].map((a, i) => (
                      <p key={i}>
                        {a.date} — {a.status}
                      </p>
                    ))}
                    <p style={{ fontWeight: "bold" }}>
                      Total Present Days:{" "}
                      {
                        attendance[emp.employee_id].filter(
                          (a) => a.status === "Present"
                        ).length
                      }
                    </p>
                  </>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------- STYLES ---------------- */
const styles = {
  container: {
    maxWidth: "760px",
    margin: "40px auto",
    fontFamily: "Arial, sans-serif",
  },
  card: {
    background: "#f9f9f9",
    padding: "20px",
    marginBottom: "30px",
    borderRadius: "8px",
  },
  employee: {
    padding: "14px 0",
    borderBottom: "1px solid #ddd",
  },
  subText: {
    fontSize: "13px",
    color: "#555",
    marginTop: "2px",
  },
  actions: {
    marginTop: "8px",
    display: "flex",
    gap: "8px",
    flexWrap: "wrap",
  },
  delete: {
    background: "#ff4d4d",
    color: "white",
  },
  attendance: {
    marginTop: "10px",
    fontSize: "14px",
  },
  error: {
    color: "red",
    marginBottom: "10px",
  },
};

export default App;
