import React, {useState, useEffect} from "react";

function FoodTable({foods, onEdit, onDelete}) {
    return(
        <>
        <div className="table-responsive shadow-sm rounded-4 mt-5">
            <table className="table table-hover table-striped table-bordered align-middle text-center">
                <thead className="table-success">
                    <tr>
                        <th>Name</th>
                        <th>Category</th>
                        <th>Calories</th>
                        <th>Protein (g)</th>
                        <th>Carbs</th>
                        <th>Fat (g)</th>
                        <th>Serving</th>
                        <th className="text-nowrap">Vegetarian</th>
                        <th>Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {foods.map((food, index) => (
                        <tr key={food.id} style={{backgroundColor: index % 2 === 0 ? "#ffffff" : "#f9f9f9"}}>
                            <td className="text-truncate" style={{ maxWidth: "140px" }} title={food.foodName}>{food.foodName}</td>
                            <td>{food.category}</td>
                            <td>{food.calories}</td>
                            <td>{food.protein}</td>
                            <td>{food.carbs}</td>
                            <td>{food.fats}</td>
                            <td>{food.servingSize}</td>
                            <td>
                                {food.vegetarian ? (
                                <span className="badge bg-success">Yes</span>
                                ) : (
                                <span className="badge bg-danger">No</span>
                                )}
                            </td>
                            <td className="text-nowrap">
                                {food.date}
                            </td>
                            <td className="text-nowrap">
                                <div className="d-flex justify-content-center align-items-center gap-2">
                                    <button
                                    className="btn btn-sm btn-warning"
                                    onClick={() => onEdit(food)}
                                    >
                                    Edit
                                    </button>

                                    <button
                                    className="btn btn-sm btn-danger"
                                    onClick={() => onDelete(food.id)}
                                    >
                                    Delete
                                    </button>
                                </div>
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
