import React, { useState } from "react";

function Login({ setCurrentUser, onSwitch }) {

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Admin Login
    if (form.email === "admin@gmail.com" && form.password === "admin1234") {
      setCurrentUser({ email: form.email, role: "admin" });
      return;
    }

    const users = JSON.parse(localStorage.getItem("users")) || [];

    const user = users.find(
      (u) => u.email === form.email && u.password === form.password
    );

    if (!user) {
      return setError("Invalid credentials");
    }

    setCurrentUser(user);
  };

  return (
    <div className="card p-4 shadow">
      <h3>Login</h3>
      {error && <p className="text-danger">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input className="form-control mb-2" name="email" placeholder="Email" onChange={handleChange}/>
        <input className="form-control mb-2" type="password" name="password" placeholder="Password" onChange={handleChange}/>
        <button className="btn btn-primary w-100">Login</button>
      </form>
      <p className="mt-3">
        Don’t have account? <span onClick={onSwitch} style={{cursor:"pointer"}}>Register</span>
      </p>
    </div>
  );
}

export default Login;