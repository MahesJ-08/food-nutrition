import React, { useState, useEffect } from "react";
import FoodForm from "./components/FoodForm.jsx";
import FoodTable from "./components/FoodTable.jsx";
import "./App.css";

function App() {
  const [foods, setFoods] = useState(() => {
    const storedFoods = localStorage.getItem("foods");
    return storedFoods ? JSON.parse(storedFoods) : [];
  });

  const [editItem, setEditItem] = useState(null);

  useEffect(() => {
    localStorage.setItem("foods", JSON.stringify(foods));
  }, [foods]);

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
    alert("Excel data uploaded successfully");
  };

  const handleEdit = (food) => {
    setEditItem(food);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure?")) {
      setFoods(foods.filter((item) => item.id !== id));
    }
  };

  return (
    <div className="container my-4">
      <h2 className="text-center fw-bold mb-4">Food Nutrition Tracker</h2>

      <FoodForm
        onSave={handleSave}
        onSaveBulk={handleBulkSave}
        editItem={editItem}
      />

      <FoodTable foods={foods} onEdit={handleEdit} onDelete={handleDelete} />
    </div>
  );
}

export default App;