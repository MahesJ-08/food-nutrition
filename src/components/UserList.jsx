import React, { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import logo from "../assets/pdf-header.png";

import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

function UserList({ onSelectUser }) {
  const [users, setUsers] = useState([]);
  const [showChart, setShowChart] = useState(false);

  /* ---------------- FETCH USERS ---------------- */

  useEffect(() => {
    axios
      .get("http://localhost/food-api/getUsers.php")
      .then((res) => {
        setUsers(res.data);
      })
      .catch((err) => {
        console.log("Error fetching users:", err);
      });
  }, []);

  /* ---------------- PDF ---------------- */

  const downloadPDF = () => {
    const doc = new jsPDF();

    doc.addImage(logo, "PNG", 14, 10, 40, 20);

    doc.setFontSize(18);
    doc.setTextColor(40);
    doc.text("Registered Users Report", 105, 18, { align: "center" });

    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text("List of all registered users in the system", 105, 26, {
      align: "center",
    });

    const today = new Date().toLocaleDateString();
    doc.setFontSize(10);
    doc.text(`Generated on: ${today}`, 14, 40);

    const tableColumn = ["Name", "Email"];

    const tableRows = users.map((user) => [user.name, user.email]);

    autoTable(doc, {
      startY: 45,
      head: [tableColumn],
      body: tableRows,
      theme: "grid",
      headStyles: {
        fillColor: [13, 110, 253],
        textColor: 255,
        halign: "center",
      },
      styles: {
        fontSize: 10,
        cellPadding: 3,
        halign: "center",
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
    });

    doc.save("RegisteredUsers.pdf");
  };

  /* ---------------- BAR CHART DATA ---------------- */

  const getLast7DaysData = () => {
    const labels = [];
    const data = [];

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);

      const dateStr = d.toISOString().split("T")[0]; // YYYY-MM-DD

      labels.push(
        d.toLocaleDateString("en-US", { day: "numeric", month: "short" }),
      );

      const count = users.filter((u) => {
  if (!u.created_at) return false;
  return u.created_at.slice(0, 10) === dateStr;
}).length;

      data.push(count);
    }

    return { labels, data };
  };

  const chartInfo = getLast7DaysData();

  const chartData = {
    labels: chartInfo.labels,
    datasets: [
      {
        label: "Users Registered",
        data: chartInfo.data,
        backgroundColor: "#0d6efd",
        borderRadius: 6,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  return (
    <div className="container-fluid my-5">
      <div className="card shadow border-0 rounded-4">
        <div className="card-body p-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h5 className="fw-bold text-primary mb-0">Registered Users</h5>

            <div className="d-flex gap-2">
              <button
                className="btn btn-danger btn-sm"
                onClick={downloadPDF}
                disabled={users.length === 0}
              >
                Download PDF
              </button>

              {/* BAR CHART BUTTON */}

              <button
                className="btn btn-light btn-sm"
                onClick={() => setShowChart(true)}
              >
                <i class="fa-solid fa-chart-simple" style={{color: "rgb(23, 23, 23)"}}></i>
              </button>

              <span className="badge bg-primary align-self-center">
                Total: {users.length}
              </span>
            </div>
          </div>

          <div className="table-responsive">
            <table className="table table-hover align-middle text-center">
              <thead className="table-primary">
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th style={{ minWidth: "120px" }}>Action</th>
                </tr>
              </thead>

              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="text-muted py-4">
                      No users found
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user.user_id}>
                      <td className="fw-semibold">{user.name}</td>

                      <td>{user.email}</td>

                      <td>
                        <button
                          className="btn btn-outline-info btn-sm px-3"
                          onClick={() => onSelectUser(user)}
                        >
                          View Intakes
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ---------------- BAR CHART MODAL ---------------- */}

      {showChart && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.45)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1050,
          }}
        >
          <div
            className="bg-white rounded-4 shadow"
            style={{ width: "520px", padding: "25px" }}
          >
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="fw-bold text-primary mb-0">
                User Registrations (Last 7 Days)
              </h5>

              <button
                className="btn btn-sm btn-light border"
                onClick={() => setShowChart(false)}
              >
                ✕
              </button>
            </div>

            <Bar data={chartData} options={chartOptions} />
          </div>
        </div>
      )}
    </div>
  );
}

export default UserList;
