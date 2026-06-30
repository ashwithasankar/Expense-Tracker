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
    default: 0,
  },
});

const Expense = mongoose.model("Expense", {
  title: String,
  amount: Number,
  category: {
    type: String,
    default: "Others",
  },
  userId: String,
  date: {
    type: Date,
    default: Date.now,
  },
});

/* ================= TEST ================= */

app.get("/", (req, res) => {
  res.send("Expense Tracker Backend Running 🚀");
});

/* ================= AUTH ================= */

// Signup
app.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return res.send("User already exists");
  }

  await User.create({
    name,
    email,
    password,
  });

  res.send("Signup successful");
});

// Login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.send("User not found");
  }

  if (user.password !== password) {
    return res.send("Wrong password");
  }

  res.send("Login successful");
});

/* ================= EXPENSE ================= */

// Add Expense
app.post("/add-expense", async (req, res) => {
  const { title, amount, category, userId, date } = req.body;

  await Expense.create({
    title,
    amount,
    category,
    userId,
    date,
  });

  res.send("Expense added");
});

// Get Expenses
app.get("/expenses", async (req, res) => {
  const userId = req.query.userId;

  const expenses = await Expense.find({ userId }).sort({
    date: -1,
  });

  res.json(expenses);
});

// Update Expense
app.put("/update-expense/:id", async (req, res) => {
  const { title, amount, category, date } = req.body;

  await Expense.findByIdAndUpdate(
    req.params.id,
    {
      title,
      amount,
      category,
      date,
    },
    { new: true }
  );

  res.send("Expense updated");
});

// Delete Expense
app.delete("/delete-expense/:id", async (req, res) => {
  await Expense.findByIdAndDelete(req.params.id);

  res.send("Expense deleted");
});

/* ================= BUDGET ================= */

// Get Budget
app.get("/budget/:email", async (req, res) => {
  const user = await User.findOne({
    email: req.params.email,
  });

  if (!user) {
    return res.json({ budget: 0 });
  }

  res.json({
    budget: user.budget || 0,
  });
});

// Update Budget
app.put("/budget/:email", async (req, res) => {
  const { budget } = req.body;

  await User.findOneAndUpdate(
    {
      email: req.params.email,
    },
    {
      budget,
    }
  );

  res.send("Budget Updated");
});

/* ================= SERVER ================= */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on Port ${PORT}`);
});