import React, { useState , useEffect} from 'react';
import FoodForm from './components/FoodForm';
import FoodTable from './components/FoodTable';
import './App.css'

function App() {

  const [foods, setFoods] = useState([]);
  const [editItem, setEditItem] = useState(null);

  useEffect(() => {
    const storedFoods = JSON.parse(localStorage.getItem("foods"));
    
    if(storedFoods)
    {
      setFoods(storedFoods);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("foods", JSON.stringify(foods));
  }, [foods]);

  const handleSave = (food) => {
    if(editItem)
    {
      const updateFoods = foods.map((item) => item.id === food.id ? food : item);
      setFoods(updateFoods);
      setEditItem(null);
      alert("Food item updated successfully");
    }
    else
    {
      setFoods([...foods, {...food, id: Date.now()}]);
      alert("Food item added successfully");
    }
    console.log([...foods, food]);
  };

  const handleEdit = (food) => {
    setEditItem(food);
  };

  const handleDelete = (id) => {
    if(window.confirm("Are you sure you want to delete this item?"))
    {
      const filteredFoods = foods.filter((item) => item.id !== id);
      setFoods(filteredFoods);
      alert("Food item deleted successfully");
    }
  };

  return (
    <>
      {/* <div className='container'> */}
        <h1 className='text-center text-dark my-3'>Food Nutrition Tracker</h1>
          <div className="row justify-content-center">
              <div className="col-md-6 col-lg-4">
                <FoodForm
                onSave = {handleSave}
                editItem = {editItem}
                />
              </div>
              <div className="col-md-6 col-lg-8">
                <FoodTable
                foods = {foods}
                onEdit = {handleEdit}
                onDelete = {handleDelete}
                />
              </div>
          </div>
      {/* </div> */}
    </>
  )
  
}

export default App
