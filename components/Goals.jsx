import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export default function Goals({ user }) {
  const [goals, setGoals] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [target, setTarget] = useState("");
  const [targetDate, setTargetDate] = useState("");
  const [category, setCategory] = useState("other");

  // Categories
  const GOAL_CATEGORIES = [
    { value: "vacation", label: "Vacation", icon: "✈️" },
    { value: "home_renovation", label: "Home Renovation", icon: "🛠️" },
    { value: "emergency_fund", label: "Emergency Fund", icon: "🚑" },
    { value: "new_car", label: "New Car", icon: "🚗" },
    { value: "education", label: "Education", icon: "🎓" },
    { value: "investment", label: "Investment", icon: "📈" },
    { value: "debt_repayment", label: "Debt Repayment", icon: "💳" },
    { value: "wedding", label: "Wedding", icon: "💍" },
    { value: "other", label: "Other", icon: "🎯" },
  ];

  // Fetch goals
  const fetchGoals = async () => {
    try {
      const res = await axios.get(`https://finance-tracker-backend-fdrs.onrender.com/api/goals/${user.id}`);
      setGoals(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch goals");
    }
  };

  useEffect(() => {
    if (user) fetchGoals();
  }, [user]);

  // Add goal
  const handleAddGoal = async () => {
    if (!title || !target || !targetDate) return;
    try {
      await axios.post("https://finance-tracker-backend-fdrs.onrender.com/api/goals/add", {
        userId: user.id,
        title,
        target,
        targetDate,
        category,
      });
      toast.success("Goal added");
      fetchGoals();
      setTitle("");
      setTarget("");
      setTargetDate("");
      setCategory("other");
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to add goal");
    }
  };

  // Delete goal
  const handleDeleteGoal = async (id) => {
    try {
      await axios.delete(`https://finance-tracker-backend-fdrs.onrender.com/api/goals/delete/${id}`);
      toast.success("Goal deleted");
      fetchGoals();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete goal");
    }
  };

  // Helper: find category object
  const getCategoryInfo = (value) =>
    GOAL_CATEGORIES.find((cat) => cat.value === value) || {
      label: "Other",
      icon: "🎯",
    };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Financial Goals</h2>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-md"
          onClick={() => setIsModalOpen(true)}
        >
          + Add Goal
        </button>
      </div>

      {/* Goals List */}
      <div className="grid gap-4">
        {goals.map((goal) => {
          const categoryInfo = getCategoryInfo(goal.category);
          return (
            <div key={goal.id} className="p-4 bg-white shadow rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xl">{categoryInfo.icon}</span>
                <p className="font-medium">{goal.title}</p>
              </div>
              <p className="text-sm text-gray-500">
                {categoryInfo.label} • Target Date:{" "}
                {new Date(goal.targetDate).toLocaleDateString()}
              </p>
              <p>Target: ₹{goal.target.toLocaleString()}</p>
              <p>Saved: ₹{goal.saved.toLocaleString()}</p>
              <div className="w-full bg-gray-200 h-2 rounded-full mt-2">
                <div
                  className={`h-2 rounded-full ${
                    goal.achieved ? "bg-green-500" : "bg-blue-500"
                  }`}
                  style={{ width: `${(goal.saved / goal.target) * 100}%` }}
                ></div>
              </div>
              {goal.achieved && (
                <p className="text-green-600 font-semibold mt-1">
                  🎉 Achieved!
                </p>
              )}
              <button
                className="mt-2 text-red-600 text-sm"
                onClick={() => handleDeleteGoal(goal.id)}
              >
                Delete
              </button>
            </div>
          );
        })}
      </div>

      {/* Add Goal Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-lg font-semibold mb-4">Add Goal</h3>
            <input
              placeholder="Goal Title"
              className="w-full border rounded-md px-3 py-2 mb-2"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <input
              type="number"
              placeholder="Target Amount"
              className="w-full border rounded-md px-3 py-2 mb-2"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
            />
            <input
              type="date"
              className="w-full border rounded-md px-3 py-2 mb-2"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
            />

            {/* Category Dropdown */}
            <select
              className="w-full border rounded-md px-3 py-2 mb-4"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {GOAL_CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.icon} {cat.label}
                </option>
              ))}
            </select>

            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 border"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white"
                onClick={handleAddGoal}
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
