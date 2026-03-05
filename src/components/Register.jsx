import React, { useState } from "react";
import axios from "axios";

function Register({ onSwitch }) {

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const nameRegex = /^[A-Za-z\s]+$/; 
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!form.name || !form.email || !form.password || !form.confirmPassword) {
      return setError("All fields are required");
    }

    if (!nameRegex.test(form.name)) {
      return setError("Username should contain only letters and spaces");
    }

    if (!emailRegex.test(form.email)) {
      return setError("Please enter a valid email address");
    }

    if (form.password !== form.confirmPassword) {
      return setError("Passwords do not match");
    }

    try {
      const response = await axios.post(
        "http://localhost/food-api/register.php", // change path
        {
          name: form.name,
          email: form.email,
          password: form.password
        }
      );

      if (response.data.status === "success") {
        setSuccess("Registration successful!");
        setTimeout(() => {
          onSwitch();
        }, 1500);
      } else if (response.data.status === "exists") {
        setError("User already exists");
      } else {
        setError("Something went wrong");
      }

    } catch (err) {
      console.error(err);
      setError("Server error");
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center">
      <div className="card shadow-lg border-0 rounded-4 p-4" style={{ maxWidth: "450px", width: "100%" }}>
        
        <div className="text-center mb-4">
          <h2 className="fw-bold text-success">Create Account</h2>
          <p className="text-muted small">Register to continue</p>
        </div>

        {error && (
          <div className="alert alert-danger py-2 text-center">
            {error}
          </div>
        )}

        {success && (
          <div className="alert alert-success py-2 text-center">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          
          <div className="form-floating mb-3">
            <input type="text" className="form-control" name="name" placeholder="Full Name" onChange={handleChange} />
            <label>Full Name</label>
          </div>

          <div className="form-floating mb-3">
            <input type="email" className="form-control" name="email" placeholder="Email" onChange={handleChange} />
            <label>Email Address</label>
          </div>

          <div className="form-floating mb-3">
            <input type="password" className="form-control" name="password" placeholder="Password" onChange={handleChange} />
            <label>Password</label>
          </div>

          <div className="form-floating mb-4">
            <input type="password" className="form-control" name="confirmPassword" placeholder="Confirm Password" onChange={handleChange} />
            <label>Confirm Password</label>
          </div>

          <button className="btn btn-success w-100 py-2 rounded-3 fw-semibold">
            Register
          </button>
        </form>

        <div className="text-center mt-4">
          <small className="text-muted">
            Already have an account?{" "}
            <span 
              className="text-success fw-semibold"
              onClick={onSwitch}
              style={{ cursor: "pointer" }}
            >
              Login
            </span>
          </small>
        </div>

      </div>
    </div>
  );
}

export default Register;