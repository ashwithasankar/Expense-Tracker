import { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";
import API from "./api";
import "./Auth.css";

function Login() {

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    const res = await API.post("/login", form);

    if (res.data === "Login successful") {

      toast.success("🎉 Login Successful!");

      localStorage.setItem("userId", form.email);

      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);

    } else if (res.data === "Wrong password") {

      toast.error("❌ Wrong Password");

    } else if (res.data === "User not found") {

      toast.error("❌ User Not Found");

    } else {

      toast.warning(res.data);

    }

  };

  return (

    <div className="auth-page">

      <div className="auth-container">

        <div className="auth-logo">
          💰
        </div>

        <h1 className="auth-title">
          Welcome Back
        </h1>

        <p className="auth-subtitle">
          Sign in to continue managing your expenses.
        </p>

        <form className="auth-form" onSubmit={handleSubmit}>

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={form.email}
            onChange={handleChange}
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
          />

          <button className="auth-btn">
            Sign In
          </button>

        </form>

        <div className="auth-link">
          Don't have an account?{" "}
          <Link to="/signup">
            Create Account
          </Link>
        </div>

      </div>

    </div>

  );

}

export default Login;