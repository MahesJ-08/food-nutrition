import React, { useState, useEffect } from "react";
import axios from "axios";

function UserDashboard({ user, foods, onLogout }) {

  const [category, setCategory] = useState("");
  const [selectedFood, setSelectedFood] = useState("");
  const [servingQuantity, setServingQuantity] = useState("");
  const [servingUnit, setServingUnit] = useState("");

  const [filteredFoods, setFilteredFoods] = useState([]);
  const [intakes, setIntakes] = useState([]);

  /* Fetch intake history */
  useEffect(() => {
    fetchIntakes();
  }, []);

  const fetchIntakes = async () => {
    try {
      const res = await axios.get(
        `http://localhost/food-api/getUserIntake.php?user_id=${user.user_id}`
      );

      console.log("API Response:", res.data);

      if (Array.isArray(res.data)) {
        setIntakes(res.data);
      } else {
        setIntakes([]);
      }

    } catch (error) {
      console.error("Error fetching intake history", error);
    }
  };

  /* Filter foods based on category */
  useEffect(() => {
    if (category) {
      const filtered = foods.filter((food) => food.category === category);
      setFilteredFoods(filtered);
    } else {
      setFilteredFoods([]);
    }
  }, [category, foods]);

  /* Auto set unit when food selected */
  useEffect(() => {
    if (selectedFood) {
      const food = foods.find((f) => f.food_id == selectedFood);

      if (food) {
        setServingUnit(food.serving_unit);
      }
    } else {
      setServingUnit("");
    }
  }, [selectedFood, foods]);

  /* Nutrition Calculation */
  const calculateNutrition = (food, intakeQty) => {

    const ratio = intakeQty / (food.serving_quantity || 1);

    return {
      calories: (food.calories * ratio).toFixed(2),
      protein: (food.protein * ratio).toFixed(2),
      carbs: (food.carbs * ratio).toFixed(2),
      fat: (food.fat * ratio).toFixed(2),
    };
  };

  /* Add Intake */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedFood || !servingQuantity || !servingUnit) {
      return alert("Please complete all fields");
    }

    const food = foods.find((f) => f.food_id == selectedFood);

    if (!food) {
      alert("Food data not found");
      return;
    }

    const nutrition = calculateNutrition(food, Number(servingQuantity));

    try {

      await axios.post(
        "http://localhost/food-api/addIntake.php",
        {
          user_id: user.user_id,
          food_id: food.food_id,
          serving_Display: `${servingQuantity} ${servingUnit}`,
          calories: nutrition.calories,
          protein: nutrition.protein,
          carbs: nutrition.carbs,
          fat: nutrition.fat,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      fetchIntakes();

      setServingQuantity("");
      setServingUnit("");
      setSelectedFood("");

    } catch (error) {
      console.error("Error adding intake", error);
    }
  };

  /* Delete Intake */
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

        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3 className="fw-bold text-success">
            Welcome, {user.name}
          </h3>

          <button className="btn btn-outline-danger" onClick={onLogout}>
            Logout
          </button>
        </div>

        {/* Add Intake */}
        <div className="card shadow border-0 rounded-4 mb-4">
          <div className="card-body p-4">

            <h5 className="fw-semibold text-success mb-4">
              Add Food Intake
            </h5>

            <form onSubmit={handleSubmit}>

              {/* Category */}
              <div className="mb-3">
                <label className="form-label fw-semibold">Category</label>

                <select
                  className="form-select"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="">Select Category</option>

                  {[...new Set(foods.map((f) => f.category))].map((cat) => (
                    <option key={cat}>{cat}</option>
                  ))}

                </select>
              </div>

              {/* Food */}
              <div className="mb-3">
                <label className="form-label fw-semibold">Food Item</label>

                <select
                  className="form-select"
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

              {/* Serving */}
              <div className="row g-3 mb-4">

                <div className="col-md-6">
                  <label className="form-label fw-semibold">
                    Serving Quantity
                  </label>

                  <input
                    type="number"
                    min="1"
                    className="form-control"
                    value={servingQuantity}
                    placeholder="Enter quantity"
                    onChange={(e) => setServingQuantity(e.target.value)}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold">
                    Serving Unit
                  </label>

                  <select
                    className="form-select"
                    value={servingUnit}
                    disabled
                  >
                    <option value="">Select Unit</option>
                    <option value="grams">Gram (g)</option>
                    <option value="ml">Milliliter (ml)</option>
                    <option value="cup">Cup</option>
                    <option value="piece">Piece</option>
                    <option value="tbsp">Tablespoon</option>
                  </select>

                </div>
              </div>

              <button
                type="submit"
                className="btn btn-success w-100 fw-semibold"
              >
                Add Intake
              </button>

            </form>
          </div>
        </div>

        {/* Intake History */}
        <div className="card shadow border-0 rounded-4">
          <div className="card-body p-4">

            <h5 className="fw-semibold text-success mb-4">
              Intake History
            </h5>

            <div className="table-responsive">

              <table className="table table-hover text-center align-middle">

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
                      <td colSpan="9">No intake records found</td>
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
                            className="btn btn-sm btn-danger"
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