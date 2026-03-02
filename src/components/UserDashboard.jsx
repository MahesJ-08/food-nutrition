import React, { useState, useEffect } from "react";

function UserDashboard({ user, foods, onLogout }) {

  const [category, setCategory] = useState("");
  const [selectedFood, setSelectedFood] = useState("");
  const [serving, setServing] = useState("");

  const [filteredFoods, setFilteredFoods] = useState([]);

  const [intakes, setIntakes] = useState([]);

  // ---------------- LOAD USER INTAKES ----------------
  useEffect(() => {
    const allIntakes = JSON.parse(localStorage.getItem("intakes")) || {};
    setIntakes(allIntakes[user.email] || []);
  }, [user.email]);

  // ---------------- FILTER FOOD BY CATEGORY ----------------
  useEffect(() => {
    if (category) {
      const filtered = foods.filter(
        (food) => food.category === category
      );
      setFilteredFoods(filtered);
    } else {
      setFilteredFoods([]);
    }
  }, [category, foods]);

  // ---------------- CALCULATION ----------------
  const calculateNutrition = (food, intakeServing) => {
    const ratio = intakeServing / food.servingSize;

    return {
      calories: (food.calories * ratio).toFixed(2),
      protein: (food.protein * ratio).toFixed(2),
      carbs: (food.carbs * ratio).toFixed(2),
      fats: (food.fats * ratio).toFixed(2),
    };
  };

  // ---------------- SUBMIT ----------------
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedFood || !serving) {
      return alert("Please select food and enter serving size");
    }

    const food = foods.find((f) => f.id === Number(selectedFood));

    const nutrition = calculateNutrition(food, Number(serving));

    const newIntake = {
      id: Date.now(),
      foodName: food.foodName,
      category: food.category,
      serving,
      ...nutrition,
      date: new Date().toLocaleDateString(),
    };

    const allIntakes = JSON.parse(localStorage.getItem("intakes")) || {};

    const updatedUserIntakes = [
      ...(allIntakes[user.email] || []),
      newIntake,
    ];

    allIntakes[user.email] = updatedUserIntakes;

    localStorage.setItem("intakes", JSON.stringify(allIntakes));

    setIntakes(updatedUserIntakes);

    setServing("");
    setSelectedFood("");
  };

  return (
    <div className="container mt-5">

      <div className="d-flex justify-content-between mb-4">
        <h3>Welcome {user.name}</h3>
        <button className="btn btn-danger" onClick={onLogout}>
          Logout
        </button>
      </div>

      {/* ---------------- FORM ---------------- */}

      <div className="card p-4 shadow mb-4">
        <h5>Add Food Intake</h5>

        <form onSubmit={handleSubmit}>

          <select
            className="form-select mb-3"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">Select Category</option>
            {[...new Set(foods.map((f) => f.category))].map((cat) => (
              <option key={cat}>{cat}</option>
            ))}
          </select>

          <select
            className="form-select mb-3"
            value={selectedFood}
            onChange={(e) => setSelectedFood(e.target.value)}
          >
            <option value="">Select Food</option>
            {filteredFoods.map((food) => (
              <option key={food.id} value={food.id}>
                {food.foodName}
              </option>
            ))}
          </select>

          <input
            type="number"
            placeholder="Intake Serving Size"
            className="form-control mb-3"
            value={serving}
            onChange={(e) => setServing(e.target.value)}
          />

          <button className="btn btn-success w-100">
            Add Intake
          </button>
        </form>
      </div>

      {/* ---------------- TABLE ---------------- */}

      <div className="card p-4 shadow">
        <h5>Intake History</h5>

        <table className="table table-bordered text-center">
          <thead className="table-success">
            <tr>
              <th>Food</th>
              <th>Category</th>
              <th>Serving</th>
              <th>Calories</th>
              <th>Protein</th>
              <th>Carbs</th>
              <th>Fats</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {intakes.map((item) => (
              <tr key={item.id}>
                <td>{item.foodName}</td>
                <td>{item.category}</td>
                <td>{item.serving}</td>
                <td>{item.calories}</td>
                <td>{item.protein}</td>
                <td>{item.carbs}</td>
                <td>{item.fats}</td>
                <td>{item.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}

export default UserDashboard;