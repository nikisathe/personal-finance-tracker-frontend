import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export default function ManageExpenses({ user }) {
  const [transactions, setTransactions] = useState([]);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [editAmount, setEditAmount] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editDate, setEditDate] = useState("");

  const fetchTransactions = async () => {
    if (!user) return;
    try {
      const res = await axios.get(`https://finance-tracker-backend-fdrs.onrender.com/api/transactions/${user.id}`);
      setTransactions(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load transactions");
    }
  };

  useEffect(() => { fetchTransactions(); }, [user]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://finance-tracker-backend-fdrs.onrender.com/api/transactions/delete/${id}`);
      setTransactions(prev => prev.filter(t => t.id !== id));
      toast.success("Transaction deleted");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete transaction");
    }
  };

  const handleEditClick = (t) => {
    setEditingTransaction(t);
    setEditAmount(t.amount);
    setEditCategory(t.category);
    setEditDescription(t.description);
    setEditDate(t.date);
  };

  const handleUpdateTransaction = async () => {
    if (!editingTransaction) return;
    try {
      await axios.put(`https://finance-tracker-backend-fdrs.onrender.com/api/transactions/edit/${editingTransaction.id}`, {
        amount: editAmount,
        category: editCategory,
        description: editDescription,
        date: editDate,
      });

      setTransactions(prev =>
        prev.map(t => t.id === editingTransaction.id
          ? { ...t, amount: editAmount, category: editCategory, description: editDescription, date: editDate }
          : t
        )
      );

      setEditingTransaction(null);
      toast.success("Transaction updated successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update transaction");
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Manage Expenses</h2>
      <table className="w-full bg-white shadow rounded-lg overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            <th className="text-left px-4 py-2">Category</th>
            <th className="text-left px-4 py-2">Amount</th>
            <th className="text-left px-4 py-2">Date</th>
            <th className="text-left px-4 py-2">Description</th>
            <th className="text-left px-4 py-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map(t => (
            <tr key={t.id} className="border-b">
              <td className="px-4 py-2">{t.category}</td>
              <td className="px-4 py-2">₹{parseFloat(t.amount).toFixed(2)}</td>
              <td className="px-4 py-2">{t.date}</td>
              <td className="px-4 py-2">{t.description}</td>
              <td className="px-4 py-2">
                <button
                  className="text-blue-600 hover:underline mr-2"
                  onClick={() => handleEditClick(t)}
                >
                  Edit
                </button>
                <button
                  className="text-red-600 hover:underline"
                  onClick={() => handleDelete(t.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Edit Transaction Modal */}
      {editingTransaction && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96 relative">
            <button
              className="absolute top-2 right-3 text-gray-500 text-xl"
              onClick={() => setEditingTransaction(null)}
            >
              ×
            </button>
            <h3 className="text-lg font-semibold mb-4">Edit Transaction</h3>

            <label className="block text-sm font-medium mb-1">Category</label>
            <input
              type="text"
              className="w-full border rounded-md px-3 py-2 mb-3"
              value={editCategory}
              onChange={e => setEditCategory(e.target.value)}
            />

            <label className="block text-sm font-medium mb-1">Amount</label>
            <input
              type="number"
              className="w-full border rounded-md px-3 py-2 mb-3"
              value={editAmount}
              onChange={e => setEditAmount(e.target.value)}
            />

            <label className="block text-sm font-medium mb-1">Description</label>
            <input
              type="text"
              className="w-full border rounded-md px-3 py-2 mb-3"
              value={editDescription}
              onChange={e => setEditDescription(e.target.value)}
            />

            <label className="block text-sm font-medium mb-1">Date</label>
            <input
              type="date"
              className="w-full border rounded-md px-3 py-2 mb-4"
              value={editDate}
              onChange={e => setEditDate(e.target.value)}
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setEditingTransaction(null)}
                className="px-4 py-2 rounded-md border text-gray-600 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateTransaction}
                className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
