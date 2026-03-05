import React from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function FoodTable({ foods, onEdit, onDelete }) {
  const downloadPDF = () => {
    const doc = new jsPDF();

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
      food.is_vegetarian == 1 ? "Yes" : "No",
      food.created_at,
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
    });

    doc.save("FoodRecords.pdf");
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
                        {food.is_vegetarian == 1 ? (
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
    </div>
  );
}

export default FoodTable;
