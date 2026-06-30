import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";

import { Pie } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

function PieChart({ expenses }) {

  const totals = {};

  expenses.forEach((expense) => {

    const category = expense.category || "Others";

    totals[category] =
      (totals[category] || 0) + Number(expense.amount);

  });

  const data = {

    labels: Object.keys(totals),

    datasets: [
      {
        data: Object.values(totals),

        backgroundColor: [
          "#4CAF50",
          "#2196F3",
          "#FF9800",
          "#E91E63",
          "#9C27B0",
          "#607D8B"
        ],

        borderWidth: 2
      }
    ]
  };

  return (
  <div className="chart-card">

    <h2>Expense By Category</h2>

    <div className="pie-container">
      <Pie
        data={data}
        options={{
          responsive: true,
          maintainAspectRatio: false,
        }}
      />
    </div>

  </div>
);
}

export default PieChart;
