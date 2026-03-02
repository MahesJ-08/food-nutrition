import React, { useState, useEffect } from "react";
import Login from "./components/Login";
import Register from "./components/Register";
import AdminDashboard from "./components/AdminDashboard";
import UserDashboard from "./components/UserDashboard";

function App() {

  const [foods, setFoods] = useState(() => {
    const storedFoods = localStorage.getItem("foods");
    return storedFoods ? JSON.parse(storedFoods) : [];
  });

  const [editItem, setEditItem] = useState(null);

  useEffect(() => {
    localStorage.setItem("foods", JSON.stringify(foods));
  }, [foods]);

  const [currentUser, setCurrentUser] = useState(() => {
    const storedUser = localStorage.getItem("currentUser");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [showRegister, setShowRegister] = useState(false);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("currentUser", JSON.stringify(currentUser));
    } else {
      localStorage.removeItem("currentUser");
    }
  }, [currentUser]);

  const handleSave = (food) => {
    if (editItem) {
      const updatedFoods = foods.map((item) =>
        item.id === editItem.id ? { ...food, id: editItem.id } : item
      );
      setFoods(updatedFoods);
      setEditItem(null);
       alert("Food updated successfully");
    } else {
      setFoods([...foods, { ...food, id: Date.now() }]);
       alert("Food added successfully");
    }
  };

  const handleBulkSave = (newFoods) => {
    setFoods((prev) => [...prev, ...newFoods]);
  };

  const handleEdit = (food) => setEditItem(food);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure?")) {
      setFoods(foods.filter((item) => item.id !== id));
    }
  };

  const handleLogout = () => setCurrentUser(null);

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

  if (currentUser.role === "admin") {
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
    <UserDashboard
      user={currentUser}
      foods={foods}
      onLogout={handleLogout}
    />
  );
}

export default App;