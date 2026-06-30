import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
} from "chart.js";

import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
);

function BarChart({ expenses }) {

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
    label: "Expense",
    data: Object.values(totals),
    backgroundColor: [
      "#3B82F6",
      "#10B981",
      "#F59E0B",
      "#EF4444",
      "#8B5CF6",
      "#06B6D4"
    ],
    borderRadius: 8,
    borderWidth: 0
  }
]

  };

  return (

    <div className="chart-card">

      <h2>Expenses By Category</h2>

      <Bar
  data={data}
  options={{
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: "#fff"
        }
      }
    },
    scales: {
      x: {
        ticks: {
          color: "#CBD5E1"
        },
        grid: {
          color: "#334155"
        }
      },
      y: {
        ticks: {
          color: "#CBD5E1"
        },
        grid: {
          color: "#334155"
        }
      }
    }
  }}
/>

    </div>

  );

}

export default BarChart;