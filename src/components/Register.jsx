import React, { useState } from "react";

function Register({ onSwitch }) {

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.password) {
      return setError("All fields are required");
    }

    if (form.password !== form.confirmPassword) {
      return setError("Passwords do not match");
    }

    const users = JSON.parse(localStorage.getItem("users")) || [];

    const userExists = users.find((u) => u.email === form.email);
    if (userExists) {
      return setError("User already exists");
    }

    users.push({
      name: form.name,
      email: form.email,
      password: form.password,
      role: "user"
    });

    localStorage.setItem("users", JSON.stringify(users));

    alert("Registration successful");
    onSwitch();
  };

  return (
    <div className="card p-4 shadow">
      <h3>Register</h3>
      {error && <p className="text-danger">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input className="form-control mb-2" name="name" placeholder="Name" onChange={handleChange}/>
        <input className="form-control mb-2" name="email" placeholder="Email" onChange={handleChange}/>
        <input className="form-control mb-2" type="password" name="password" placeholder="Password" onChange={handleChange}/>
        <input className="form-control mb-2" type="password" name="confirmPassword" placeholder="Confirm Password" onChange={handleChange}/>
        <button className="btn btn-success w-100">Register</button>
      </form>
      <p className="mt-3">
        Already have account? <span onClick={onSwitch} style={{cursor:"pointer"}}>Login</span>
      </p>
    </div>
  );
}

export default Register;