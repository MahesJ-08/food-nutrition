import React, {useState, useEffect} from "react";

const defaultState = {
    foodName:"",
    category:"",
    calories:"",
    protein:"",
    carbs:"",
    fats:"",
    servingSize:"",
    vegetarian: false,
    date: new Date().toISOString().split('T')[0],
};

function FoodForm({onSave, editItem}){
    const [formData, setFormData] = useState(defaultState);

    const [errors, setErrors] = useState({});



    useEffect(() => {
        if(editItem)
        {
            setFormData(editItem);
        }
    }, [editItem]);

    const handleChange = (e) =>{
        const {name, value, type, checked} = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    const validate = () => {
        let newErrors = {};

        const nameRegex = /^[a-zA-Z\s]+$/;

        if(!formData.foodName.trim())
        {
            newErrors.foodName = "Food name is required";
        } else if(!nameRegex.test(formData.foodName))
        {
            newErrors.foodName = "Only letters and spaces allowed";
        }

        if(!formData.category)
        {
            newErrors.catagory = "Category is required";
        }

        if(!formData.servingSize.trim())
        {
            newErrors.servingSize = "Serving size is required";
        }

        const numberRegex = /^\d+(\.\d{1,2})?$/;

        if(!formData.calories || !numberRegex.test(formData.calories))
        {
            newErrors.calories = "Enter a valid number";
        }
        
        if(!formData.protein || !numberRegex.test(formData.protein))
        {
            newErrors.protein = "Enter a valid number";
        }

        if(!formData.carbs || !numberRegex.test(formData.carbs))
        {
            newErrors.carbs = "Enter a valid number";
        }   

        if(!formData.fats || !numberRegex.test(formData.fats))
        {
            newErrors.fats = "Enter a valid number";
        }

        const today = new Date().toISOString().split('T')[0];
        if(!formData.date)
        {
            newErrors.date = "Date is required";
        } else if(formData.date > today)
        {
            newErrors.date = "Date cannot be in the future";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0; 

    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if(!validate()) return;

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
    }

    return(
        
        <>
            <div className="card border-0 shadow-lg rounded-4">      
                <div className="card-header bg-success text-white text-center rounded-top-4">
                    <h4 className="mb-0 fw-bold">
                        {editItem ? "Update Food Entry" : "Add Food Entry"}
                    </h4>
                </div>

                <div className="card-body p-4">
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
                            {errors.foodName && <small className="text-danger">{errors.foodName}</small>}
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
                            {errors.category && <small className="text-danger">{errors.category}</small>}
                        </div>

                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <div className="form-floating">
                                    <input 
                                        type="number" 
                                        name="calories" 
                                        className="form-control rounded-3" 
                                        placeholder="Calories"
                                        value={formData.calories} 
                                        onChange={handleChange}
                                    />
                                    <label>Calories (kcal)</label>
                                    {errors.calories && <small className="text-danger">{errors.calories}</small>}
                                </div>
                            </div>

                            <div className="col-md-6 mb-3">
                                <div className="form-floating">
                                    <input 
                                        type="number" 
                                        name="protein" 
                                        step="0.01"
                                        className="form-control rounded-3" 
                                        placeholder="Protein"
                                        value={formData.protein} 
                                        onChange={handleChange}
                                    />
                                    <label>Protein (g)</label>
                                    {errors.protein && <small className="text-danger">{errors.protein}</small>}
                                </div>
                            </div>

                            <div className="col-md-6 mb-3">
                                <div className="form-floating">
                                    <input 
                                        type="number" 
                                        name="carbs" 
                                        step="0.01"
                                        className="form-control rounded-3" 
                                        placeholder="Carbs"
                                        value={formData.carbs} 
                                        onChange={handleChange}
                                    />
                                    <label>Carbs (g)</label>
                                    {errors.carbs && <small className="text-danger">{errors.carbs}</small>}
                                </div>
                            </div>

                            <div className="col-md-6 mb-3">
                                <div className="form-floating">
                                    <input 
                                        type="number" 
                                        name="fats" 
                                        step="0.01"
                                        className="form-control rounded-3" 
                                        placeholder="Fats"
                                        value={formData.fats} 
                                        onChange={handleChange}
                                    />
                                    <label>Fats (g)</label>
                                    {errors.fats && <small className="text-danger">{errors.fats}</small>}
                                </div>
                            </div>
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
                            {errors.servingSize && <small className="text-danger">{errors.servingSize}</small>}
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
                            {errors.date && <small className="text-danger">{errors.date}</small>}
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