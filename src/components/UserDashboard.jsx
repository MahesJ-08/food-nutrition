import React, { useState, useEffect } from "react";
import axios from "axios";

function UserDashboard({ user, foods, onLogout }) {
  // if (!user) {
  //   return <div className="text-center mt-5">Loading...</div>;
  // }
  const [category, setCategory] = useState("");
  const [selectedFood, setSelectedFood] = useState("");
  const [servingQuantity, setServingQuantity] = useState("");
  const [servingUnit, setServingUnit] = useState("");

  const [filteredFoods, setFilteredFoods] = useState([]);
  const [intakes, setIntakes] = useState([]);

  /* ✅ Fetch user intake history from database */
  useEffect(() => {
    fetchIntakes();
  }, []);

  const fetchIntakes = async () => {
    try {
      const res = await axios.get(
        `http://localhost/food-api/getUserIntake.php?user_id=${user.user_id}`,
      );
      if (Array.isArray(res.data)) {
        setIntakes(res.data);
      } else {
        setIntakes([]); // prevent crash
      }
    } catch (error) {
      console.error("Error fetching intake history", error);
    }
  };

  /* ✅ Filter foods by category */
  useEffect(() => {
    if (category) {
      const filtered = foods.filter((food) => food.category === category);
      setFilteredFoods(filtered);
    } else {
      setFilteredFoods([]);
    }
  }, [category, foods]);

  /* ✅ Nutrition calculation */
  const calculateNutrition = (food, intakeQty) => {
    const ratio = intakeQty / food.serving_quantity;

    return {
      calories: (food.calories * ratio).toFixed(2),
      protein: (food.protein * ratio).toFixed(2),
      carbs: (food.carbs * ratio).toFixed(2),
      fat: (food.fat * ratio).toFixed(2),
    };
  };

  /* ✅ Add Intake */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedFood || !servingQuantity || !servingUnit) {
      return alert("Please complete all fields");
    }

    if (Number(servingQuantity) <= 0) {
      return alert("Serving quantity must be greater than 0");
    }

    const food = foods.find((f) => f.food_id === Number(selectedFood));

    const nutrition = calculateNutrition(food, Number(servingQuantity));

    try {
      await axios.post("http://localhost/food-api/addIntake.php", {
        user_id: user.user_id,
        food_id: food.food_id,
        serving_Display: `${servingQuantity} ${servingUnit}`,
        calories: nutrition.calories,
        protein: nutrition.protein,
        carbs: nutrition.carbs,
        fat: nutrition.fat,
      });

      fetchIntakes();

      setServingQuantity("");
      setServingUnit("");
      setSelectedFood("");
    } catch (error) {
      console.error("Error adding intake", error);
    }
  };

  /* ✅ Delete Intake */
  const handleDelete = async (id) => {
    try {
      await axios.get(`http://localhost/food-api/deleteIntake.php?id=${id}`);
      fetchIntakes();
    } catch (error) {
      console.error("Error deleting intake", error);
    }
  };

  return (
    <div className="container-fluid bg-light min-vh-100 py-4">
      <div className="container">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-4">
          <h3 className="fw-bold text-success mb-3 mb-md-0">
            Welcome, {user.name}
          </h3>
          <button className="btn btn-outline-danger px-4" onClick={onLogout}>
            Logout
          </button>
        </div>

        <div className="card shadow border-0 rounded-4 mb-4">
          <div className="card-body p-4">
            <h5 className="fw-semibold text-success mb-4">Add Food Intake</h5>

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label fw-semibold">Category</label>
                <select
                  className="form-select rounded-3"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="">Select Category</option>
                  {[...new Set(foods.map((f) => f.category))].map((cat) => (
                    <option key={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">Food Item</label>
                <select
                  className="form-select rounded-3"
                  value={selectedFood}
                  onChange={(e) => setSelectedFood(e.target.value)}
                >
                  <option value="">Select Food</option>
                  {filteredFoods.map((food) => (
                    <option key={food.food_id} value={food.food_id}>
                      {food.food_name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="row g-3 mb-4">
                <div className="col-md-6">
                  <label className="form-label fw-semibold">
                    Serving Quantity
                  </label>
                  <input
                    type="number"
                    min="1"
                    placeholder="Enter quantity"
                    className="form-control rounded-3"
                    value={servingQuantity}
                    onChange={(e) => setServingQuantity(e.target.value)}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold">Serving Unit</label>
                  <select
                    className="form-select rounded-3"
                    value={servingUnit}
                    onChange={(e) => setServingUnit(e.target.value)}
                  >
                    <option value="">Select Unit</option>
                    <option value="g">Gram (g)</option>
                    <option value="ml">Milliliter (ml)</option>
                    <option value="cup">Cup</option>
                    <option value="piece">Piece</option>
                    <option value="tbsp">Tablespoon</option>
                  </select>
                </div>
              </div>

              <button className="btn btn-success w-100 py-2 rounded-3 fw-semibold">
                Add Intake
              </button>
            </form>
          </div>
        </div>

        <div className="card shadow border-0 rounded-4">
          <div className="card-body p-4">
            <h5 className="fw-semibold text-success mb-4">Intake History</h5>

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
                    <th>Fat</th>
                    <th>Date</th>
                    <th>Action</th>
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
                      <tr key={item.id}>
                        <td>{item.food_name}</td>
                        <td>{item.category}</td>
                        <td>{item.serving_Display}</td>
                        <td>{item.calories}</td>
                        <td>{item.protein}</td>
                        <td>{item.carbs}</td>
                        <td>{item.fat}</td>
                        <td>{item.created_at}</td>
                        <td>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDelete(item.id)}
                          >
                            Delete
                          </button>
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
    </div>
  );
}

export default UserDashboard;
