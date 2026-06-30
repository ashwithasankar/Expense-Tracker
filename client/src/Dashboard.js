
import PieChart from "./components/PieChart"; import { FaWallet, FaCalendarDay, FaSignOutAlt } from "react-icons/fa";
import SummaryCard from "./components/SummaryCard";
import ExpenseCard from "./components/ExpenseCard";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BarChart from "./components/BarChart";
import API from "./api";
import "./Dashboard.css";
function Dashboard() {

  const [expenses, setExpenses] = useState([]);
  const totalExpense = expenses.reduce(
    (total, expense) => total + Number(expense.amount),
    0
  );
  const [form, setForm] = useState({
    title: "",
    amount: "",
    category: "Food",
      date: new Date().toISOString().split("T")[0]
  });
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [editId, setEditId] = useState(null);
  //const [budget, setBudget] = useState(10000);
  const [budget, setBudget] = useState(0);
const [budgetInput, setBudgetInput] = useState("");
const [isEditingBudget, setIsEditingBudget] = useState(false);
const [darkMode, setDarkMode] = useState(
  localStorage.getItem("theme") === "dark"
);
useEffect(() => {

  if (darkMode) {

    document.body.classList.add("dark");

    localStorage.setItem("theme", "dark");

  } else {

    document.body.classList.remove("dark");

    localStorage.setItem("theme", "light");

  }

}, [darkMode]);
  const navigate = useNavigate();

  const userId = localStorage.getItem("userId");

  // FETCH EXPENSES
  const fetchExpenses = async () => {
    const res = await API.get(`/expenses?userId=${userId}`);
    setExpenses(res.data);
  };
  const fetchBudget = async () => {

  const res = await API.get(`/budget/${userId}`);

  setBudget(res.data.budget);

};

  useEffect(() => {

    if (!userId) {
      navigate("/");
    } else {
      fetchExpenses();
fetchBudget();
    }

  }, []);

  // HANDLE INPUT
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  // ADD OR UPDATE
  const handleSubmit = async () => {

    if (editId) {

      await API.put(`/update-expense/${editId}`, form);

      setEditId(null);

    } else {

      await API.post("/add-expense", {
        ...form,
        userId
      });

    }

    setForm({
      title: "",
      amount: "",
      category: "Food",
        date:new Date().toISOString().split("T")[0]
    });

    fetchExpenses();
  };

  // DELETE
  const deleteExpense = async (id) => {
    await API.delete(`/delete-expense/${id}`);
    fetchExpenses();
  };

  // EDIT
  const editExpense = (expense) => {

    setForm({
      title: expense.title,
      amount: expense.amount  ,
    category: expense.category 
    });

    setEditId(expense._id);
  };

  // LOGOUT
  const logout = () => {
    localStorage.removeItem("userId");
    navigate("/");
  };
      const saveBudget = async () => {

  await API.put(`/budget/${userId}`, {
    budget: Number(budgetInput)
  });

  setBudget(Number(budgetInput));

  setBudgetInput("");

};


  const filteredExpenses = expenses.filter((expense) => {

    const matchesSearch =
      expense.title.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      filterCategory === "All" ||
      (expense.category || "Others") === filterCategory;

    return matchesSearch && matchesCategory;

  });
  const today = new Date().toDateString();

  const todayExpense = expenses
    .filter(
      (expense) =>
        expense.date &&
        new Date(expense.date).toDateString() === today
    )
    .reduce((sum, expense) => sum + Number(expense.amount), 0);

  const totalCategories = new Set(
    expenses.map((expense) => expense.category)
  ).size;
  
  const remainingBudget = budget - totalExpense;

const percentage =
  budget > 0
    ? Math.min((totalExpense / budget) * 100, 100)
    : 0;

  return (
    <div className="dashboard">

     <div className="top-bar">

  <h1>💰 Expense Tracker</h1>

  <div className="top-buttons">

    <button
      className="theme-btn"
      onClick={() => setDarkMode(!darkMode)}
    >
      {darkMode ? "☀️ Light" : "🌙 Dark"}
    </button>

    <button
      className="logout-btn"
      onClick={logout}
    >
      <FaSignOutAlt /> Logout
    </button>

  </div>

</div>

<div className="budget-card">

  {budget === 0 ? (

    <div className="budget-input">

      <h2>Set Monthly Budget</h2>

      <div className="budget-form">

        <input
          type="number"
          placeholder="Enter Monthly Budget"
          value={budgetInput}
          onChange={(e) => setBudgetInput(e.target.value)}
        />

        <button onClick={saveBudget}>
          Save Budget
        </button>

      </div>

    </div>

  ) : (

    <>
      <div className="budget-header">

        <h2>Monthly Budget</h2>

       {isEditingBudget ? (

  <div className="budget-edit">

    <input
      type="number"
      value={budgetInput}
      onChange={(e) => setBudgetInput(e.target.value)}
    />

    <button onClick={saveBudget}>
      Save
    </button>

  </div>

) : (

  <div className="budget-view">

    <h2>₹{budget}</h2>

    <button
      className="edit-budget-btn"
      onClick={() => {

        setBudgetInput(budget);
        setIsEditingBudget(true);

      }}
    >
      ✏️ Edit
    </button>

  </div>

)}
      </div>

      <div className="progress">

        <div
          className="progress-fill"
          style={{
            width: `${percentage}%`,
            background:
              percentage < 70
                ? "#10B981"
                : percentage < 90
                ? "#F59E0B"
                : "#EF4444"
          }}
        ></div>

      </div>

      <h3>
        Remaining : ₹{remainingBudget}
      </h3>

    </>

  )}

</div>

      <div className="summary-grid">

        <SummaryCard
          icon={<FaWallet />}
          title="Total Expense"
          value={`₹${totalExpense}`}
          color="#10B981"
        />

        <SummaryCard
          icon={<FaCalendarDay />}
          title="Today's Expense"
          value={`₹${todayExpense}`}
          color="#3B82F6"
        />

        <SummaryCard
          icon={"📂"}
          title="Categories"
          value={totalCategories}
          color="#8B5CF6"
        />

        <SummaryCard
          icon={"🧾"}
          title="Transactions"
          value={expenses.length}
          color="#F59E0B"
        />

      </div>
      <div className="form-group">

        <input
          type="text"
          name="title"
          placeholder="Expense Title"
          value={form.title}
          onChange={handleChange}
        />

        <select
          name="category"
          value={form.category}
          onChange={handleChange}
        >
          <option>Food</option>
          <option>Travel</option>
          <option>Shopping</option>
          <option>Bills</option>
          <option>Entertainment</option>
          <option>Others</option>
        </select>

        <input
          type="number"
          name="amount"
          placeholder="Amount"
          value={form.amount}
          onChange={handleChange}
        />
        <input
  type="date"
  name="date"
  value={form.date}
  onChange={handleChange}
/>

        <button className="add-btn" onClick={handleSubmit}>
          {editId ? "Update" : "Add"}
        </button>
        </div>

        <div className="chart-grid">

          <PieChart expenses={expenses} />

          <BarChart expenses={expenses} />

        </div>

        <div className="search-filter">

          <input
            type="text"
            placeholder="🔍 Search expense..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option>All</option>
            <option>Food</option>
            <option>Travel</option>
            <option>Shopping</option>
            <option>Bills</option>
            <option>Entertainment</option>
            <option>Others</option>
          </select>

        </div>
      <div className="expense-list">

  {filteredExpenses.map((expense) => (

    <ExpenseCard
      key={expense._id}
      expense={expense}
      onEdit={editExpense}
      onDelete={deleteExpense}
    />

  ))}

</div>

</div>
  );
}

export default Dashboard;
        