import React, { useState, useEffect } from "react";
import axios from "axios";
import Login from "./components/Login";
import Register from "./components/Register";
import AdminDashboard from "./components/AdminDashboard";
import UserDashboard from "./components/UserDashboard";

function App() {
  const [foods, setFoods] = useState([]);
  const [editItem, setEditItem] = useState(null);
  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem("currentUser");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [showRegister, setShowRegister] = useState(false);

  // ✅ Fetch foods from MySQL
  useEffect(() => {
    fetchFoods();
  }, []);

  const fetchFoods = async () => {
    try {
      const res = await axios.get("http://localhost/food-api/get_foods.php");
      setFoods(res.data);
    } catch (error) {
      console.error("Error fetching foods:", error);
    }
  };

  // ✅ Save Food (Insert or Update)
  const handleSave = async (food) => {
    try {
      if (editItem) {
        await axios.post("http://localhost/food-api/update_food.php", {
          ...food,
          food_id: editItem.food_id,
        });
        alert("Food updated successfully");
        setEditItem(null);
      } else {
        await axios.post("http://localhost/food-api/add_food.php", food);
        alert("Food added successfully");
      }

      fetchFoods(); // refresh list
    } catch (error) {
      console.error(error);
    }
  };

  // ✅ Bulk Insert
  const handleBulkSave = async (newFoods) => {
    try {
      await axios.post("http://localhost/food-api/bulk_add_food.php", {
        foods: newFoods,
      });
      alert("Bulk upload successful");
      fetchFoods();
    } catch (error) {
      console.error(error);
    }
  };

  // ✅ Delete Food
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;

    try {
      await axios.post("http://localhost/food-api/delete_food.php", {
        food_id: id,
      });
      fetchFoods();
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = (food) => setEditItem(food);

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    setCurrentUser(null);
  };

  // ================= UI (UNCHANGED) =================

  if (!currentUser) {
    return (
      <div className="container mt-5">
        {showRegister ? (
          <Register onSwitch={() => setShowRegister(false)} />
        ) : (
          <Login
            setCurrentUser={setCurrentUser}
            onSwitch={() => setShowRegister(true)}
          />
        )}
      </div>
    );
  }

  if (currentUser?.role === "admin") {
    return (
      <AdminDashboard
        foods={foods}
        editItem={editItem}
        handleSave={handleSave}
        handleBulkSave={handleBulkSave}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
        handleLogout={handleLogout}
      />
    );
  }

  return (
    <UserDashboard user={currentUser} foods={foods} onLogout={handleLogout} />
  );
}

export default App;
