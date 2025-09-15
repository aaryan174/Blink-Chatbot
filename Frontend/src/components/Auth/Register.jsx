import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../auth-css/auth-shared.css";
import axios from "axios";

const Register = () => {
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // yahan field name match honi chahiye
    const name = e.target.FullName.value;
    const email = e.target.Email.value;
    const password = e.target.Password.value;

    try {
      const response = await axios.post(
        "http://localhost:8080/api/auth/register",
        {
          name: name,
          email: email,
          password: password,
        },
        {
          withCredentials: true,
        }
      );

      console.log(response.data);
      navigate("/home");
    } catch (error) {
      console.error("Error registering user:", error.response?.data || error);
    }
  };

  return (
    <div className="auth-page-wrapper">
      <div
        className="auth-card"
        role="region"
        aria-labelledby="user-register-title"
      >
        <header>
          <h1 id="user-register-title" className="auth-title">
            Create your account
          </h1>
          <p className="auth-subtitle">
            Join to explore the Blink.
          </p>
        </header>
        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <div className="two-col">
            <div className="field-group">
              <label htmlFor="FullName">Name</label>
              <input
                id="name"
                name="FullName"
                placeholder="Jane Doe"
                autoComplete="name"
                required
              />
            </div>
          </div>
          <div className="field-group">
            <label htmlFor="Email">Email</label>
            <input
              id="email"
              name="Email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              required
            />
          </div>
          <div className="field-group">
            <label htmlFor="Password">Password</label>
            <input
              id="password"
              name="Password"
              type="password"
              placeholder="••••••••"
              autoComplete="new-password"
              required
            />
          </div>
          <button className="auth-submit" type="submit">
            Sign Up
          </button>
        </form>
        <div className="auth-alt-action">
          Already have an account? <Link to="/login">Sign in</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
