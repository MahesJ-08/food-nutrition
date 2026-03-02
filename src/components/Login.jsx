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
    <div className="container d-flex justify-content-center align-items-center">
      <div 
        className="card shadow-lg border-0 rounded-4 p-4"
        style={{ maxWidth: "450px", width: "100%" }}
      >
        
        <div className="text-center mb-4">
          <h2 className="fw-bold text-primary">Welcome Back</h2>
          <p className="text-muted small">Login to your account</p>
        </div>

        {error && (
          <div className="alert alert-danger py-2 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          <div className="form-floating mb-3">
            <input
              type="email"
              className="form-control rounded-3"
              name="email"
              placeholder="Email"
              onChange={handleChange}
            />
            <label>Email Address</label>
          </div>

          <div className="form-floating mb-4">
            <input
              type="password"
              className="form-control rounded-3"
              name="password"
              placeholder="Password"
              onChange={handleChange}
            />
            <label>Password</label>
          </div>

          <button className="btn btn-primary w-100 py-2 rounded-3 fw-semibold">
            Login
          </button>

        </form>

        <div className="text-center mt-4">
          <small className="text-muted">
            Don’t have an account?{" "}
            <span
              className="text-primary fw-semibold"
              onClick={onSwitch}
              style={{ cursor: "pointer" }}
            >
              Register
            </span>
          </small>
        </div>

      </div>
    </div>
  );
}

export default Login;