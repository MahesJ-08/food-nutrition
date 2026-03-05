import React, { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function UserIntakeList({ selectedUser }) {
  const [intakes, setIntakes] = useState([]);

  useEffect(() => {
    if (selectedUser) {
      fetchIntakes();
    }
  }, [selectedUser]);

  const fetchIntakes = async () => {
    try {
      const res = await axios.get(
        `http://localhost/food-api/get_user_intake.php?user_id=${selectedUser.user_id}`
      );
      setIntakes(res.data);
    } catch (error) {
      console.error("Error fetching intake:", error);
    }
  };

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
      item.food_name,
      item.category,
      `${item.serving_quantity} ${item.serving_unit}`,
      item.calories,
      item.protein,
      item.carbs,
      item.fat,
      item.is_vegetarian == 1 ? "Yes" : "No",
      item.intake_date,
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });

    doc.save(`${selectedUser.name}_Intake_Report.pdf`);
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
                  <th>Vegetarian</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {intakes.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="text-muted py-4">
                      No intake records found
                    </td>
                  </tr>
                ) : (
                  intakes.map((item) => (
                    <tr key={item.intake_id}>
                      <td className="fw-semibold">{item.food_name}</td>
                      <td>{item.category}</td>
                      <td>
                        {item.serving_quantity} {item.serving_unit}
                      </td>
                      <td>{item.calories}</td>
                      <td>{item.protein}</td>
                      <td>{item.carbs}</td>
                      <td>{item.fat}</td>
                      <td>
                        {item.is_vegetarian == 1 ? "Yes" : "No"}
                      </td>
                      <td>{item.intake_date}</td>
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