import React, {useState, useEffect} from "react";

function FoodTable({foods, onEdit, onDelete}) {
    return(
        <>
        <div className="table-responsive">
            <table className="table" border="1" cellPadding="10" width="100%">
                <thead style={{backgroundColor:"#f2f2f2"}}>
                    <tr>
                        <th>Name</th>
                        <th>Category</th>
                        <th>Calories</th>
                        <th>Protein (g)</th>
                        <th>Carbs</th>
                        <th>Fat (g)</th>
                        <th>Serving</th>
                        <th>Vegetarian</th>
                        <th>Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {foods.map((food, index) => (
                        <tr key={food.id} style={{backgroundColor: index % 2 === 0 ? "#ffffff" : "#f9f9f9"}}>
                            <td>{food.foodName}</td>
                            <td>{food.category}</td>
                            <td>{food.calories}</td>
                            <td>{food.protein}</td>
                            <td>{food.carbs}</td>
                            <td>{food.fats}</td>
                            <td>{food.servingSize}</td>
                            <td>{food.vegetarian ? "Yes" : "No"}</td>
                            <td>{food.date}</td>
                            <td className="d-flex gap-1">
                                <button className="btn btn-outline-warning" onClick={() => onEdit(food)}>Edit</button>
                                <button className="btn btn-outline-danger" onClick={() => onDelete(food.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>            
        </div>
        </>

    );
}

export default FoodTable;
