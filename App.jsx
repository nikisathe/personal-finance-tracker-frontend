import { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import AddTransaction from "./components/AddTransaction";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import ManageExpenses from "./components/ManageExpenses";
import Goals from "./components/Goals";

export default function App() {
  const [activePage, setActivePage] = useState("Dashboard");
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [showAddTransactionModal, setShowAddTransactionModal] = useState(false);
  const [transactionType, setTransactionType] = useState("expense");

  // Logout user
  const handleLogout = () => {
    setUser(null);
    setActivePage("Login");
    setTransactions([]);
  };

  // Fetch transactions from backend
  const fetchTransactions = async () => {
    if (!user) return;
    try {
      const res = await axios.get(`https://finance-tracker-backend-fdrs.onrender.com/api/transactions/${user.id}`);
      setTransactions(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch transactions");
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [user]);

  // After adding a transaction
  const handleTransactionAdded = (newTransaction) => {
    setTransactions(prev => [newTransaction, ...prev]);
  };

  // Delete transaction
  const handleDeleteTransaction = async (id) => {
    try {
      await axios.delete(`https://finance-tracker-backend-fdrs.onrender.com/api/transactions/delete/${id}`);
      setTransactions(prev => prev.filter(t => t.id !== id));
      toast.success("Transaction deleted successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete transaction");
    }
  };

  // Render the page based on activePage
  const renderPage = () => {
    if (!user) {
      if (activePage === "SignUp") return <SignUp onRedirectLogin={() => setActivePage("Login")} />;
      return <Login onLogin={u => { setUser(u); setActivePage("Dashboard"); }} />;
    }

    switch (activePage) {
      case "Dashboard":
        return <Dashboard transactions={transactions} />;
      case "AddIncomeExpense":
        return (
          <div className="flex space-x-2 p-4">
            <button
              onClick={() => { setTransactionType("income"); setShowAddTransactionModal(true); }}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              + Add Income
            </button>
            <button
              onClick={() => { setTransactionType("expense"); setShowAddTransactionModal(true); }}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              + Add Expense
            </button>
          </div>
        );
      case "ManageExpenses":
        return <ManageExpenses user={user} transactions={transactions} onDelete={handleDeleteTransaction} />;
      case "Goals":
  return <Goals user={user} />;

      default:
        return <Dashboard transactions={transactions} />;
    }
  };

  return (
    <div className="flex h-screen">
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        user={user}
        onLogout={handleLogout}
      />

      <main className="flex-1 overflow-y-auto">
        {/* Mobile header */}
        <div className="lg:hidden p-4 border-b flex items-center justify-between">
          <button
            className="p-2 rounded-md border bg-gray-100 hover:bg-gray-200"
            onClick={() => setIsOpen(true)}
          >
            ☰
          </button>
          <h1 className="text-lg font-semibold">{activePage}</h1>
        </div>

        <div className="p-6">{renderPage()}</div>
      </main>

      {showAddTransactionModal && (
        <AddTransaction
          onClose={() => setShowAddTransactionModal(false)}
          type={transactionType}
          userId={user.id}
          onTransactionAdded={handleTransactionAdded}
        />
      )}

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}
