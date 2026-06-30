import {
  FaEdit,
  FaTrash,
  FaCalendarAlt,
  FaTag,
  FaRupeeSign
} from "react-icons/fa";

import "./ExpenseCard.css";

function ExpenseCard({ expense, onEdit, onDelete }) {

  const category = expense.category || "Others";

  const date = expense.date
    ? new Date(expense.date).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "No Date";

  return (
    <div className="expense-card-new">

      <div className="expense-left">

        <h3>{expense.title}</h3>

        <div className="expense-details">

          <span className="badge">
            <FaTag /> {category}
          </span>

          <span className="date">
            <FaCalendarAlt /> {date}
          </span>

        </div>

      </div>

      <div className="expense-right">

        <h2>
          <FaRupeeSign /> {expense.amount}
        </h2>

        <div className="buttons">

          <button
            className="edit"
            onClick={() => onEdit(expense)}
          >
            <FaEdit /> Edit
          </button>

          <button
            className="delete"
            onClick={() => onDelete(expense._id)}
          >
            <FaTrash /> Delete
          </button>

        </div>

      </div>

    </div>
  );
}

export default ExpenseCard;