import { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";
import API from "./api";
import "./Auth.css";

function Signup() {

  const [form, setForm] = useState({
    name: "",
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

    const res = await API.post("/signup", form);

    if (res.data === "Signup successful") {

      toast.success("🎉 Account Created Successfully!");

      setTimeout(() => {
        navigate("/");
      }, 1500);

    } else if (res.data === "User already exists") {

      toast.warning("⚠️ Email Already Registered");

    } else {

      toast.error(res.data);

    }

  };

  return (

    <div className="auth-page">

      <div className="auth-container">

        <div className="auth-logo">
          💰
        </div>

        <h1 className="auth-title">
          Create Account
        </h1>

        <p className="auth-subtitle">
          Start tracking your expenses in just a few seconds.
        </p>

        <form className="auth-form" onSubmit={handleSubmit}>

          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
          />

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
            Create Account
          </button>

        </form>

        <div className="auth-link">
          Already have an account?{" "}
          <Link to="/">
            Sign In
          </Link>
        </div>

      </div>

    </div>

  );

}

export default Signup;