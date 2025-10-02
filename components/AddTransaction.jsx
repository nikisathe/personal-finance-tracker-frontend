import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export default function AddTransaction({
  onClose,
  type = "expense",
  userId,
  onTransactionAdded,
}) {
  const [transactionType, setTransactionType] = useState(type);

  useEffect(() => setTransactionType(type), [type]);

  const [formData, setFormData] = useState({
    amount: "",
    category: "",
    date: new Date().toISOString().substring(0, 10),
    description: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "https://finance-tracker-backend-fdrs.onrender.com/api/transactions/add",
        {
          userId,
          type: transactionType,
          amount: formData.amount,
          category: formData.category,
          description: formData.description,
          date: formData.date,
        }
      );

      toast.success(res.data.message || "Transaction added successfully");

      // Update parent state
      onTransactionAdded({
        ...formData,
        type: transactionType,
        user_id: userId,
      });
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Failed to add transaction. Try again!");
    }
  };

  // Categories
  const expenseCategories = [
    { value: "food", label: "Food", icon: "🍔" },
    { value: "rent", label: "Rent", icon: "🏠" },
    { value: "transport", label: "Transport", icon: "🚗" },
    { value: "utilities", label: "Utilities", icon: "💡" },
    { value: "entertainment", label: "Entertainment", icon: "🎬" },
    { value: "health", label: "Health", icon: "❤️‍🩹" },
    { value: "shopping", label: "Shopping", icon: "🛍️" },
    { value: "travel", label: "Travel", icon: "✈️" },
    { value: "other", label: "Other", icon: "🧾" },
  ];

  const incomeCategories = [
    { value: "salary", label: "Salary", icon: "💼" },
    { value: "freelance", label: "Freelance", icon: "💻" },
    { value: "investment", label: "Investment", icon: "📈" },
    { value: "bonus", label: "Bonus", icon: "🎁" },
    { value: "other", label: "Other", icon: "🧩" },
  ];

  const categories =
    transactionType === "expense" ? expenseCategories : incomeCategories;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-md">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h1 className="text-xl font-semibold">Add Transaction</h1>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 text-2xl font-light"
          >
            &times;
          </button>
        </div>

        {/* Tabs */}
        <div className="flex p-4">
          <button
            onClick={() => setTransactionType("expense")}
            className={`flex-1 py-2 text-center rounded-l-lg text-lg ${
              transactionType === "expense"
                ? "bg-white text-gray-800 border-2 border-r-0 border-blue-500 font-semibold"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-300"
            }`}
          >
            Expense
          </button>
          <button
            onClick={() => setTransactionType("income")}
            className={`flex-1 py-2 text-center rounded-r-lg text-lg ${
              transactionType === "income"
                ? "bg-blue-500 text-white font-semibold"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-300"
            }`}
          >
            Income
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Amount
            </label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleInputChange}
              placeholder="0.00"
              required
              min="0.01"
              step="0.01"
              className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              required
              className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="" disabled>
                Select a category
              </option>
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.icon} {cat.label}
                </option>
              ))}
            </select>
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Date
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              required
              className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows="3"
              placeholder="Optional details..."
              className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 resize-none"
            ></textarea>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-2 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
            >
              Add Transaction
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
