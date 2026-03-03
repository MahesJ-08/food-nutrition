import React, { useEffect, useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function UserIntakeList({ selectedUser }) {
  const [intakes, setIntakes] = useState([]);

  useEffect(() => {
    const allIntakes = JSON.parse(localStorage.getItem("intakes")) || {};
    setIntakes(allIntakes[selectedUser.email] || []);
  }, [selectedUser]);

  const downloadPDF = () => {
    const doc = new jsPDF();

    const tableColumn = [
      "Food",
      "Category",
      "Serving",
      "Calories",
      "Protein",
      "Carbs",
      "Fats",
      "Vegetarian",
      "Date",
    ];

    const tableRows = intakes.map((item) => [
      item.foodName,
      item.category,
      item.servingDisplay,
      item.calories,
      item.protein,
      item.carbs,
      item.fats,
      item.vegetarian ? "Yes" : "No",
      item.date,
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });

    doc.save(`${selectedUser.email}_Intake_Report.pdf`);
  };

  return (
    <div className="container-fluid">
      <div className="card shadow border-0 rounded-4">
        <div className="card-body p-4">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-4">
            <h5 className="fw-bold text-success mb-3 mb-md-0">
              Daily Intake - {selectedUser.name}
            </h5>
            <div className="d-flex gap-2 align-items-center">
              <button
                className="btn btn-danger btn-sm"
                onClick={downloadPDF}
                disabled={intakes.length === 0}
              >
                Download PDF
              </button>

              <span className="badge bg-success">
                Total Records: {intakes.length}
              </span>
            </div>
          </div>

          <div className="table-responsive">
            <table className="table table-hover align-middle text-center">
              <thead className="table-success">
                <tr>
                  <th>Food</th>
                  <th>Category</th>
                  <th>Serving</th>
                  <th>Calories</th>
                  <th>Protein</th>
                  <th>Carbs</th>
                  <th>Fats</th>
                  <th>Vegitarian</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {intakes.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-muted py-4">
                      No intake records found
                    </td>
                  </tr>
                ) : (
                  intakes.map((item) => (
                    <tr key={item.id}>
                      <td className="fw-semibold">{item.foodName}</td>
                      <td>{item.category}</td>
                      <td>{item.servingDisplay}</td>
                      <td>{item.calories}</td>
                      <td>{item.protein}</td>
                      <td>{item.carbs}</td>
                      <td>{item.fats}</td>
                      <td>{item.vegetarian ? "Yes" : "No"}</td>
                      <td>{item.date}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserIntakeList;
