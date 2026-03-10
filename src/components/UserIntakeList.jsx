import React, { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import logo from "../assets/pdf-header.png";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function UserIntakeList({ selectedUser }) {
  const [intakes, setIntakes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    if (selectedUser) {
      fetchIntakes();
    }
  }, [selectedUser]);

  const fetchIntakes = async () => {
    try {
      const res = await axios.get(
        `http://localhost/food-api/getUserIntake.php?user_id=${selectedUser.user_id}`
      );
      setIntakes(res.data);
      prepareChartData(res.data);
    } catch (error) {
      console.error("Error fetching intake:", error);
    }
  };

  const prepareChartData = (data) => {
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      last7Days.push(date.toISOString().split('T')[0]);
    }

    const dailyTotals = last7Days.map(date => {
      const dayIntakes = data.filter(item => item.created_at === date);
      return {
        date,
        calories: dayIntakes.reduce((sum, i) => sum + parseFloat(i.calories || 0), 0),
        protein: dayIntakes.reduce((sum, i) => sum + parseFloat(i.protein || 0), 0),
        carbs: dayIntakes.reduce((sum, i) => sum + parseFloat(i.carbs || 0), 0),
        fat: dayIntakes.reduce((sum, i) => sum + parseFloat(i.fat || 0), 0),
      };
    });

    setChartData({
      labels: last7Days,
      datasets: [
        { label: 'Calories', data: dailyTotals.map(d => d.calories), borderColor: 'rgba(255,99,132,1)', backgroundColor: 'rgba(255,99,132,0.2)', tension: 0.3, spanGaps: true },
        { label: 'Protein', data: dailyTotals.map(d => d.protein), borderColor: 'rgba(54,162,235,1)', backgroundColor: 'rgba(54,162,235,0.2)', tension: 0.3, spanGaps: true },
        { label: 'Carbs', data: dailyTotals.map(d => d.carbs), borderColor: 'rgba(255,206,86,1)', backgroundColor: 'rgba(255,206,86,0.2)', tension: 0.3, spanGaps: true },
        { label: 'Fat', data: dailyTotals.map(d => d.fat), borderColor: 'rgba(75,192,192,1)', backgroundColor: 'rgba(75,192,192,0.2)', tension: 0.3, spanGaps: true },
      ]
    });
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.addImage(logo, "PNG", 14, 10, 0, 20);
    doc.setFontSize(18);
    doc.setTextColor(40);
    doc.text("User Intake Report", 105, 18, { align: "center" });
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Nutrition intake report for ${selectedUser.name}`, 105, 26, { align: "center" });
    const today = new Date().toLocaleDateString();
    doc.setFontSize(10);
    doc.text(`Generated on: ${today}`, 14, 40);

    const tableColumn = ["Food","Category","Serving","Calories","Protein","Carbs","Fats","Date"];
    const tableRows = intakes.map(item => [item.food_name, item.category, item.serving_Display, item.calories, item.protein, item.carbs, item.fat, item.created_at]);

    autoTable(doc, {
      startY: 45,
      head: [tableColumn],
      body: tableRows,
      theme: "grid",
      headStyles: { fillColor: [40, 167, 69], textColor: 255, halign: "center" },
      styles: { fontSize: 9, cellPadding: 3, halign: "center" },
      alternateRowStyles: { fillColor: [245, 245, 245] }
    });

    doc.save(`${selectedUser.name}_Intake_Report.pdf`);
  };

  return (
    <div className="container-fluid">
      <div className="card shadow border-0 rounded-4">
        <div className="card-body p-4">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-4">
            <h5 className="fw-bold text-success mb-3 mb-md-0">Daily Intake - {selectedUser.name}</h5>
            <div className="d-flex gap-2 align-items-center">
              <button className="btn btn-danger btn-sm" onClick={downloadPDF} disabled={intakes.length === 0}>Download PDF</button>
              <button className="btn btn-light btn-sm" onClick={() => setShowModal(true)} disabled={intakes.length === 0} title="View 7-day chart">
                <i className="fa-solid fa-chart-area" style={{color: "rgb(23, 23, 23)"}}></i>
              </button>
              <span className="badge bg-success">Total Records: {intakes.length}</span>
            </div>
          </div>

          <div className="table-responsive">
            <table className="table table-hover align-middle text-center">
              <thead className="table-success">
                <tr><th>Food</th><th>Category</th><th>Serving</th><th>Calories</th><th>Protein</th><th>Carbs</th><th>Fats</th><th>Date</th></tr>
              </thead>
              <tbody>
                {intakes.length === 0 ? <tr><td colSpan="8" className="text-muted py-4">No intake records found</td></tr> : intakes.map(item => (
                  <tr key={item.intake_id}>
                    <td className="fw-semibold">{item.food_name}</td>
                    <td>{item.category}</td>
                    <td>{item.serving_Display}</td>
                    <td>{item.calories}</td>
                    <td>{item.protein}</td>
                    <td>{item.carbs}</td>
                    <td>{item.fat}</td>
                    <td>{item.created_at}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal for 7-day chart */}
      {showModal && (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">7-Day Nutrition Chart</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                {chartData ? (
                  <Line 
                    data={chartData} 
                    options={{
                      responsive: true,
                      plugins: { legend: { position: 'top' } },
                      spanGaps: true,
                      scales: {
                        y: { beginAtZero: true, ticks: { stepSize: 1 } }
                      }
                    }} 
                  />
                ) : <p>Loading chart...</p>}
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserIntakeList;
