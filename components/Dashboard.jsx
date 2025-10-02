import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";

export default function Dashboard({ transactions }) {
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  // Convert any date to local YYYY-MM-DD
  const getLocalDate = (dateStr) => {
    const d = new Date(dateStr);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Totals
  const totalIncome = transactions
    .filter(t => t.type === "income")
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);

  const totalExpense = transactions
    .filter(t => t.type === "expense")
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);

  const remainingBalance = totalIncome - totalExpense;

  // Dates
  const today = getLocalDate(new Date());
  const yesterday = getLocalDate(new Date(Date.now() - 86400000));
  const last7Days = getLocalDate(new Date(Date.now() - 7 * 86400000));
  const last30Days = getLocalDate(new Date(Date.now() - 30 * 86400000));

  // Expenses by period
  const todaysExpense = transactions
    .filter(t => t.type === "expense" && getLocalDate(t.date) === today)
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);

  const yesterdaysExpense = transactions
    .filter(t => t.type === "expense" && getLocalDate(t.date) === yesterday)
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);

  const last7DaysExpense = transactions
    .filter(t => t.type === "expense" && getLocalDate(t.date) >= last7Days)
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);

  const last30DaysExpense = transactions
    .filter(t => t.type === "expense" && getLocalDate(t.date) >= last30Days)
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);

  // Daily expenses last 7 days for line chart
  const dailyExpenses = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86400000);
    const dayStr = d.toLocaleDateString("en-US", { weekday: "short" });
    const dateStr = getLocalDate(d);
    const amount = transactions
      .filter(t => t.type === "expense" && getLocalDate(t.date) === dateStr)
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);
    dailyExpenses.push({ day: dayStr, amount });
  }

  // Pie chart by category for current month
  const monthStart = getLocalDate(new Date(new Date().getFullYear(), new Date().getMonth(), 1));
  const categoriesMap = {};
  transactions
    .filter(t => t.type === "expense" && getLocalDate(t.date) >= monthStart)
    .forEach(t => {
      categoriesMap[t.category] = (categoriesMap[t.category] || 0) + parseFloat(t.amount);
    });
  const categories = Object.entries(categoriesMap).map(([name, value]) => ({ name, value }));

  return (
    <>
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 bg-white shadow-sm rounded-lg border-b p-4 sm:p-4 ">
        Dashboard
      </h1>

      <div className="p-2 sm:p-4">
        {/* Financial Overview */}
        <h2 className="text-lg sm:text-xl font-semibold text-gray-700 mb-3 sm:mb-4">
          Financial Overview
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div className="bg-white shadow rounded-lg p-3 sm:p-4">
            <p className="text-gray-500 text-sm sm:text-base">Total Income</p>
            <p className="text-lg sm:text-xl font-semibold text-green-600">
              ₹{totalIncome.toFixed(2)}
            </p>
          </div>
          <div className="bg-white shadow rounded-lg p-3 sm:p-4">
            <p className="text-gray-500 text-sm sm:text-base">Total Expense</p>
            <p className="text-lg sm:text-xl font-semibold text-red-600">
              ₹{totalExpense.toFixed(2)}
            </p>
          </div>
          <div className="bg-white shadow rounded-lg p-3 sm:p-4">
            <p className="text-gray-500 text-sm sm:text-base">Monthly Budget</p>
            <p className="text-lg sm:text-xl font-semibold text-blue-600">₹0.00</p>
          </div>
          <div className="bg-white shadow rounded-lg p-3 sm:p-4">
            <p className="text-gray-500 text-sm sm:text-base">Remaining Balance</p>
            <p className="text-lg sm:text-xl font-semibold text-green-600">
              ₹{remainingBalance.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Full Expense Report */}
        <h2 className="text-lg sm:text-xl font-semibold text-gray-700 mb-3 sm:mb-4">
          Full-Expense Report
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div className="bg-white shadow rounded-lg p-3 sm:p-4">
            <p className="text-gray-500 text-sm sm:text-base">Today's Expense</p>
            <p className="text-lg sm:text-xl font-semibold">₹{todaysExpense.toFixed(2)}</p>
          </div>
          <div className="bg-white shadow rounded-lg p-3 sm:p-4">
            <p className="text-gray-500 text-sm sm:text-base">Yesterday's Expense</p>
            <p className="text-lg sm:text-xl font-semibold">₹{yesterdaysExpense.toFixed(2)}</p>
          </div>
          <div className="bg-white shadow rounded-lg p-3 sm:p-4">
            <p className="text-gray-500 text-sm sm:text-base">Last 7 Day's Expense</p>
            <p className="text-lg sm:text-xl font-semibold">₹{last7DaysExpense.toFixed(2)}</p>
          </div>
          <div className="bg-white shadow rounded-lg p-3 sm:p-4">
            <p className="text-gray-500 text-sm sm:text-base">Last 30 Day's Expense</p>
            <p className="text-lg sm:text-xl font-semibold">₹{last30DaysExpense.toFixed(2)}</p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          <div className="bg-white shadow rounded-lg p-3 sm:p-4">
            <h2 className="text-base sm:text-lg font-semibold mb-3">
              Daily Expenses (Last Week)
            </h2>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={dailyExpenses}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="amount" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white shadow rounded-lg p-3 sm:p-4">
            <h2 className="text-base sm:text-lg font-semibold mb-3">
              Expense Category (This Month)
            </h2>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={categories}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  label
                >
                  {categories.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </>
  );
}
