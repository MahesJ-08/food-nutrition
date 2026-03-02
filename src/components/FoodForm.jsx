import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";

const defaultState = {
  foodName: "",
  category: "",
  calories: "",
  protein: "",
  carbs: "",
  fats: "",
  servingSize: "",
  vegetarian: false,
  date: new Date().toISOString().split("T")[0],
};

function FoodForm({ onSave, editItem, onSaveBulk }) {
  const [formData, setFormData] = useState(defaultState);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editItem) {
      setFormData(editItem);
    }
  }, [editItem]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const validate = () => {
    let newErrors = {};
    const numberRegex = /^\d+(\.\d{1,2})?$/;
    const today = new Date().toISOString().split("T")[0];

    if (!formData.foodName.trim())
      newErrors.foodName = "Food name is required";

    if (!formData.category)
      newErrors.category = "Category is required";

    if (!formData.servingSize.trim())
      newErrors.servingSize = "Serving size is required";

    if (!formData.calories || !numberRegex.test(formData.calories))
      newErrors.calories = "Enter valid calories";

    if (!formData.protein || !numberRegex.test(formData.protein))
      newErrors.protein = "Enter valid protein";

    if (!formData.carbs || !numberRegex.test(formData.carbs))
      newErrors.carbs = "Enter valid carbs";

    if (!formData.fats || !numberRegex.test(formData.fats))
      newErrors.fats = "Enter valid fats";

    if (!formData.date)
      newErrors.date = "Date is required";
    else if (formData.date > today)
      newErrors.date = "Date cannot be future";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onSave({
      ...formData,
      protein: parseFloat(formData.protein).toFixed(2),
      carbs: parseFloat(formData.carbs).toFixed(2),
      fats: parseFloat(formData.fats).toFixed(2),
    });

    setFormData(defaultState);
  };

  const handleClear = () => {
    setFormData(defaultState);
    setErrors({});
  };

  const handleFileUpload = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();

  reader.onload = (event) => {
    if (!event.target.result) return;  

    const data = new Uint8Array(event.target.result);
    const workbook = XLSX.read(data, { type: "array" });

    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet);

    const formattedData = jsonData.map((row) => ({
      id: Date.now() + Math.random(),
      foodName: row.foodName ?? "",
      category: row.category ?? "",
      calories: row.calories ?? 0,
      protein: row.protein ?? 0,
      carbs: row.carbs ?? 0,
      fats: row.fats ?? 0,
      servingSize: row.servingSize ?? "",
      vegetarian:
        row.vegetarian === "Yes" || row.vegetarian === true,
      date:
        row.date ?? new Date().toISOString().split("T")[0],
    }));

    onSaveBulk(formattedData);

    alert("Excel data uploaded successfully");

    e.target.value = null;
  };

  reader.readAsArrayBuffer(file);
};

  return (
    <>
      <div className="card shadow-lg border-0 rounded-4">
        <div className="card-header bg-success text-white text-center rounded-top-4">
          <h4 className="mb-0 fw-bold">
            {editItem ? "Update Food Entry" : "Add Food Entry"}
          </h4>
        </div>

        <div className="card-body p-4">
          {/* Upload Section (No Button) */}
          <div className="mb-3">
            <label className="form-label fw-semibold">
              Upload Excel File
            </label>

            <input
              type="file"
              className="form-control"
              accept=".xlsx, .xls"
              onChange={handleFileUpload}
            />
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-floating mb-3">
              <input
                type="text"
                name="foodName"
                className="form-control rounded-3"
                placeholder="Food Name"
                value={formData.foodName}
                onChange={handleChange}
              />
              <label>Food Name</label>
              {errors.foodName && (
                <small className="text-danger">
                  {errors.foodName}
                </small>
              )}
            </div>

            <div className="form-floating mb-3">
              <select
                name="category"
                className="form-select rounded-3"
                value={formData.category}
                onChange={handleChange}
              >
                <option value="">Select Category</option>
                <option>Fruit</option>
                <option>Vegetable</option>
                <option>Grain</option>
                <option>Protein</option>
                <option>Dairy</option>
                <option>Snack</option>
              </select>
              <label>Category</label>
              {errors.category && (
                <small className="text-danger">
                  {errors.category}
                </small>
              )}
            </div>

            <div className="row">
              {["calories", "protein", "carbs", "fats"].map(
                (field) => (
                  <div className="col-md-6 mb-3" key={field}>
                    <div className="form-floating">
                      <input
                        type="number"
                        step="0.01"
                        name={field}
                        className="form-control rounded-3"
                        placeholder={field}
                        value={formData[field]}
                        onChange={handleChange}
                      />
                      <label>
                        {field.charAt(0).toUpperCase() +
                          field.slice(1)}
                      </label>
                      {errors[field] && (
                        <small className="text-danger">
                          {errors[field]}
                        </small>
                      )}
                    </div>
                  </div>
                )
              )}
            </div>

            <div className="form-floating mb-3">
              <input
                type="text"
                name="servingSize"
                className="form-control rounded-3"
                placeholder="Serving Size"
                value={formData.servingSize}
                onChange={handleChange}
              />
              <label>Serving Size</label>
              {errors.servingSize && (
                <small className="text-danger">
                  {errors.servingSize}
                </small>
              )}
            </div>

            <div className="form-check form-switch mb-3">
              <input
                type="checkbox"
                name="vegetarian"
                className="form-check-input"
                checked={formData.vegetarian}
                onChange={handleChange}
              />
              <label className="form-check-label fw-semibold">
                Vegetarian
              </label>
            </div>

            <div className="form-floating mb-4">
              <input
                type="date"
                name="date"
                className="form-control rounded-3"
                value={formData.date}
                onChange={handleChange}
              />
              <label>Date</label>
              {errors.date && (
                <small className="text-danger">
                  {errors.date}
                </small>
              )}
            </div>

            <div className="d-flex gap-2">
              <button
                type="submit"
                className="btn btn-success btn-lg rounded-3 w-50"
              >
                {editItem ? "Update Food" : "Add Food"}
              </button>

              <button
                type="button"
                className="btn btn-outline-danger btn-lg rounded-3 w-50"
                onClick={handleClear}
              >
                Reset
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default FoodForm;