import { useEffect, useState } from "react";
import axios from "axios";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";

export default function ExpenseReports({ user }) {
  const [categoryData, setCategoryData] = useState([]);
  const [dailyData, setDailyData] = useState([]);

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#FF8042", "#FF33AA", "#33FFAA"];

  const fetchReport = async () => {
    if (!user) return;

    try {
      // Category-wise monthly expense
      const catRes = await axios.get(`https://finance-tracker-backend-fdrs.onrender.com/api/reports/expense-report/${user.id}`);
      setCategoryData(catRes.data);

      // Daily expense for last 7 days
      const today = new Date();
      const last7 = [];
      for (let i = 6; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(today.getDate() - i);
        const dateStr = d.toISOString().split("T")[0];
        last7.push(dateStr);
      }

      const dailyPromises = last7.map(date =>
        axios.get(`https://finance-tracker-backend-fdrs.onrender.com/api/transactions/${user.id}?date=${date}`)
      );

      const dailyResults = await Promise.all(dailyPromises);
      const dailyChart = dailyResults.map((res, idx) => ({
        day: new Date(last7[idx]).toLocaleDateString("en-US", { weekday: "short" }),
        amount: res.data.reduce((sum, t) => sum + parseFloat(t.amount), 0)
      }));

      setDailyData(dailyChart);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [user]);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Expense Reports</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Pie chart by category */}
        <div className="bg-white shadow rounded-lg p-4">
          <h3 className="font-semibold mb-2">Monthly Expense by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                dataKey="total"
                nameKey="category"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Daily expense last 7 days */}
        <div className="bg-white shadow rounded-lg p-4">
          <h3 className="font-semibold mb-2">Daily Expense (Last 7 Days)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="amount" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
