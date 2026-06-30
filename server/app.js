const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(express.json());
app.use(cors());

/* ================= DB CONNECT ================= */

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ MongoDB Atlas Connected"))
  .catch((err) => console.log("❌ DB Error:", err));

/* ================= MODELS ================= */

const User = mongoose.model("User", {
  name: String,
  email: String,
  password: String,
  budget: {
    type: Number,
    default: 0
  }
});

const Expense = mongoose.model("Expense", {
  title: String,
  amount: Number,
  category: {
    type: String,
    default: "Others"
  },
  userId: String,
  date: {
    type: Date,
    default: Date.now
  }
}
);
