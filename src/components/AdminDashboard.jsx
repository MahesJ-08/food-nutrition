import React, { useState, useEffect } from "react";
import axios from "axios";
import FoodForm from "./FoodForm";
import FoodTable from "./FoodTable";
import UserList from "./UserList";
import UserIntakeList from "./UserIntakeList";

function AdminDashboard({
  foods,
  editItem,
  handleSave,
  handleBulkSave,
  handleEdit,
  handleDelete,
  handleLogout,
}) {

  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  /* ✅ Fetch users from database */
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(
        "http://localhost/food-api/getUsers.php"
      );
      setUsers(res.data);
    } catch (error) {
      console.error("Error fetching users", error);
    }
  };

  return (
    <div className="container-fluid bg-light min-vh-100 py-4">
      <div className="container">

        <div className="card shadow border-0 rounded-4 mb-4">
          <div className="card-body d-flex flex-column flex-md-row justify-content-between align-items-center">
            
            <div>
              <h3 className="fw-bold text-primary mb-1">
                Admin Dashboard
              </h3>
              <small className="text-muted">
                Manage Foods & Users
              </small>
            </div>

            <button
              className="btn btn-outline-danger px-4 mt-3 mt-md-0"
              onClick={handleLogout}
            >
              Logout
            </button>

          </div>
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

        <UserList
          users={users}
          onSelectUser={setSelectedUser}
        />

        {selectedUser && (
          <div className="mt-4">
            <UserIntakeList selectedUser={selectedUser} />
          </div>
        )}

      </div>
    </div>
  );
}

export default AdminDashboard;