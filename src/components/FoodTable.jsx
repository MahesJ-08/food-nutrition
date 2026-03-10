import React, { useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import logo from "../assets/pdf-header.png";

import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

function FoodTable({ foods, onEdit, onDelete }) {
  const [showChart, setShowChart] = useState(false);

  const downloadPDF = () => {
    const doc = new jsPDF();

    /* ----------- LOGO ----------- */
    doc.addImage(logo, "PNG", 14, 10, 40, 20);

    /* ----------- TITLE ----------- */
    doc.setFontSize(18);
    doc.setTextColor(40);
    doc.text("Food Nutrition Report", 105, 18, { align: "center" });

    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text("Food Records and Nutrition Information", 105, 26, {
      align: "center",
    });

    /* ----------- DATE ----------- */
    const today = new Date().toLocaleDateString();
    doc.setFontSize(10);
    doc.text(`Generated on: ${today}`, 14, 40);

    /* ----------- TABLE DATA ----------- */
    const tableColumn = [
      "Name",
      "Category",
      "Calories",
      "Protein",
      "Carbs",
      "Fat",
      "Serving",
      "Vegetarian",
      "Date",
    ];

    const tableRows = foods.map((food) => [
      food.food_name,
      food.category,
      food.calories,
      food.protein,
      food.carbs,
      food.fat,
      `${food.serving_quantity} ${food.serving_unit}`,
      food.is_vegetarian,
      food.created_at,
    ]);

    autoTable(doc, {
      startY: 45,
      head: [tableColumn],
      body: tableRows,
      theme: "grid",
      headStyles: {
        fillColor: [40, 167, 69],
        textColor: 255,
        halign: "center",
      },
      styles: {
        fontSize: 9,
        cellPadding: 3,
        halign: "center",
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
    });

    doc.save("FoodRecords.pdf");
  };

  /* -------- PIE CHART DATA -------- */

  const categoryCount = {};
  foods.forEach((food) => {
    categoryCount[food.category] = (categoryCount[food.category] || 0) + 1;
  });

  const chartData = {
    labels: Object.keys(categoryCount).map(
      (cat) => `${cat} (${categoryCount[cat]})`
    ),
    datasets: [
      {
        data: Object.values(categoryCount),
        backgroundColor: [
          "#5B8FF9",
          "#61DDAA",
          "#65789B",
          "#F6BD16",
          "#7262FD",
          "#78D3F8",
        ],
        borderWidth: 2,
        borderColor: "#ffffff",
      },
    ],
  };

  const chartOptions = {
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          font: {
            size: 13,
          },
        },
      },
    },
  };

  return (
    <div className="container-fluid mt-5">
      <div className="card shadow border-0 rounded-4">
        <div className="card-header bg-success text-white d-flex justify-content-between align-items-center rounded-top-4">
          <h5 className="mb-0 fw-bold">Food Records</h5>

          <div className="d-flex gap-2">
            <button className="btn btn-warning btn-sm" onClick={downloadPDF}>
              Download PDF
            </button>

            {/* Chart Button */}
            <button
              className="btn btn-light btn-sm"
              onClick={() => setShowChart(true)}
              title="View Category Chart"
            >
              <i class="fa-solid fa-chart-pie" style={{color: "rgb(23,23,23)"}}></i>
            </button>

            <span className="badge bg-light text-dark align-self-center">
              Total: {foods.length}
            </span>
          </div>
        </div>

        <div className="card-body p-4">
          <div
            className="table-responsive"
            style={{ maxHeight: "600px", overflowY: "auto" }}
          >
            <table className="table table-hover align-middle text-center">
              <thead className="table-success">
                <tr>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Calories</th>
                  <th>Protein (g)</th>
                  <th>Carbs</th>
                  <th>Fat (g)</th>
                  <th>Serving</th>
                  <th>Vegetarian</th>
                  <th>Date</th>
                  <th className="text-nowrap">Actions</th>
                </tr>
              </thead>

              <tbody>
                {foods.length === 0 ? (
                  <tr>
                    <td colSpan="10" className="text-muted py-4">
                      No food records available
                    </td>
                  </tr>
                ) : (
                  foods.map((food) => (
                    <tr key={food.food_id}>
                      <td
                        className="fw-semibold text-truncate"
                        style={{ maxWidth: "150px" }}
                      >
                        {food.food_name}
                      </td>

                      <td>{food.category}</td>
                      <td>{food.calories}</td>
                      <td>{food.protein}</td>
                      <td>{food.carbs}</td>
                      <td>{food.fat}</td>

                      <td>
                        {food.serving_quantity} {food.serving_unit}
                      </td>

                      <td>
                        {food.is_vegetarian === "yes" ? (
                          <span className="badge bg-success px-3">Yes</span>
                        ) : (
                          <span className="badge bg-danger px-3">No</span>
                        )}
                      </td>

                      <td className="text-nowrap">{food.created_at}</td>

                      <td className="text-nowrap">
                        <div className="d-flex justify-content-center gap-2">
                          <button
                            className="btn btn-sm btn-outline-warning px-3"
                            onClick={() => onEdit(food)}
                          >
                            Edit
                          </button>

                          <button
                            className="btn btn-sm btn-outline-danger px-3"
                            onClick={() => onDelete(food.food_id)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* -------- PIE CHART MODAL -------- */}

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
            style={{ width: "460px", padding: "25px" }}
          >
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="fw-bold text-success mb-0">
                <i className="bi bi-pie-chart-fill me-2"></i>
                Category Distribution
              </h5>

              <button
                className="btn btn-sm btn-light border"
                onClick={() => setShowChart(false)}
              >
                ✕
              </button>
            </div>

            {/* Chart */}
            <div style={{ width: "320px", margin: "0 auto" }}>
              <Pie data={chartData} options={chartOptions} />
            </div>

            {/* Footer */}
            <div className="text-center text-muted mt-3" style={{ fontSize: "13px" }}>
              Total Foods: <b>{foods.length}</b>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default FoodTable;