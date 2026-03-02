import React from "react";
import FoodForm from "./FoodForm";
import FoodTable from "./FoodTable";

function AdminDashboard({
  foods,
  editItem,
  handleSave,
  handleBulkSave,
  handleEdit,
  handleDelete,
  handleLogout,
}) {
  return (
    <div className="container my-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Admin Dashboard</h3>
        <button className="btn btn-danger" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <FoodForm
        onSave={handleSave}
        editItem={editItem}
        onSaveBulk={handleBulkSave}
      />

      <FoodTable
        foods={foods}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}

export default AdminDashboard;