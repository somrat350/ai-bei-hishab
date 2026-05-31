"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Filter States
  const [search, setSearch] = useState("");
  const [date, setDate] = useState("");

  // Data States
  const [totals, setTotals] = useState({ totalIncome: 0, totalExpense: 0, totalSavings: 0 });
  const [records, setRecords] = useState({ incomes: [], expenses: [], savings: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Modal States
  const [activeModal, setActiveModal] = useState(null); // 'income' | 'expense' | 'savings' | null
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState("");

  // Modal Form Inputs
  const [incomeForm, setIncomeForm] = useState({ amount: "", source: "", date: "" });
  const [expenseForm, setExpenseForm] = useState({ amount: "", destination: "", date: "" });
  const [savingsForm, setSavingsForm] = useState({ amount: "", date: "" });

  // Fetch Dashboard Data
  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const queryParams = new URLSearchParams();
      if (search) queryParams.append("search", search);
      if (date) queryParams.append("date", date);

      const res = await fetch(`/api/dashboard?${queryParams.toString()}`);
      if (!res.ok) {
        throw new Error("Failed to fetch dashboard data");
      }
      const data = await res.json();
      setTotals(data.totals);
      setRecords(data.records);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Trigger fetch on load or filter change
  useEffect(() => {
    if (status === "authenticated") {
      fetchData();
    }
  }, [status, search, date]);

  // Auth Protection Redirect
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-base-200">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return null;
  }

  // Handle Form Submissions
  const handleAddIncome = async (e) => {
    e.preventDefault();
    setModalLoading(true);
    setModalError("");
    try {
      const res = await fetch("/api/income", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: parseFloat(incomeForm.amount),
          source: incomeForm.source,
          date: incomeForm.date || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to add income");
      
      // Success: reset form, close modal, refresh data
      setIncomeForm({ amount: "", source: "", date: "" });
      setActiveModal(null);
      fetchData();
    } catch (err) {
      setModalError(err.message);
    } finally {
      setModalLoading(false);
    }
  };

  const handleAddExpense = async (e) => {
    e.preventDefault();
    setModalLoading(true);
    setModalError("");
    try {
      const res = await fetch("/api/expense", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: parseFloat(expenseForm.amount),
          destination: expenseForm.destination,
          date: expenseForm.date || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to add expense");
      
      // Success: reset form, close modal, refresh data
      setExpenseForm({ amount: "", destination: "", date: "" });
      setActiveModal(null);
      fetchData();
    } catch (err) {
      setModalError(err.message);
    } finally {
      setModalLoading(false);
    }
  };

  const handleAddSavings = async (e) => {
    e.preventDefault();
    setModalLoading(true);
    setModalError("");
    try {
      const res = await fetch("/api/savings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: parseFloat(savingsForm.amount),
          date: savingsForm.date || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to add savings");
      
      // Success: reset form, close modal, refresh data
      setSavingsForm({ amount: "", date: "" });
      setActiveModal(null);
      fetchData();
    } catch (err) {
      setModalError(err.message);
    } finally {
      setModalLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-200 p-4 sm:p-6 lg:p-8">
      {/* Header / Navbar */}
      <div className="navbar bg-base-100 rounded-box shadow-md mb-8 px-4 flex justify-between">
        <div>
          <span className="text-xl font-bold text-primary">AI Bei Hishab Dashboard</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium hidden sm:inline">
            Hello, <strong className="text-secondary">{session.user.name}</strong>
          </span>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="btn btn-outline btn-error btn-sm"
          >
            Logout
          </button>
        </div>
      </div>

      {error && (
        <div className="alert alert-error shadow-md mb-6">
          <span>{error}</span>
        </div>
      )}

      {/* Top Section: Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="stat bg-base-100 rounded-box shadow-md border-l-4 border-success">
          <div className="stat-title text-success font-semibold">Total Income</div>
          <div className="stat-value text-success text-2xl sm:text-3xl">
            ৳ {totals.totalIncome.toLocaleString()}
          </div>
          <div className="stat-desc">Accumulated income in selected period</div>
        </div>

        <div className="stat bg-base-100 rounded-box shadow-md border-l-4 border-error">
          <div className="stat-title text-error font-semibold">Total Expense</div>
          <div className="stat-value text-error text-2xl sm:text-3xl">
            ৳ {totals.totalExpense.toLocaleString()}
          </div>
          <div className="stat-desc">Spent in selected period</div>
        </div>

        <div className="stat bg-base-100 rounded-box shadow-md border-l-4 border-info">
          <div className="stat-title text-info font-semibold">Total Savings</div>
          <div className="stat-value text-info text-2xl sm:text-3xl">
            ৳ {totals.totalSavings.toLocaleString()}
          </div>
          <div className="stat-desc">Saved in selected period</div>
        </div>
      </div>

      {/* Middle & Action Sections: Filters and Create Buttons */}
      <div className="bg-base-100 p-6 rounded-box shadow-md mb-8 flex flex-col lg:flex-row gap-6 justify-between items-stretch lg:items-center">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 flex-grow max-w-3xl">
          <div className="form-control flex-grow">
            <label className="label py-1">
              <span className="label-text-alt font-medium text-base-content/65">Search by Source/Destination</span>
            </label>
            <input
              type="text"
              placeholder="e.g., Salary, Rent, Grocery"
              className="input input-bordered w-full focus:input-primary"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="form-control w-full sm:w-48">
            <label className="label py-1">
              <span className="label-text-alt font-medium text-base-content/65">Filter by Date</span>
            </label>
            <input
              type="date"
              className="input input-bordered w-full focus:input-primary"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          
          {(search || date) && (
            <div className="form-control justify-end">
              <button
                onClick={() => {
                  setSearch("");
                  setDate("");
                }}
                className="btn btn-ghost text-xs underline mb-1"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2 lg:justify-end items-end">
          <button
            onClick={() => setActiveModal("income")}
            className="btn btn-success btn-sm sm:btn-md text-white shadow-md flex-grow sm:flex-grow-0"
          >
            + Add Income
          </button>
          <button
            onClick={() => setActiveModal("expense")}
            className="btn btn-error btn-sm sm:btn-md text-white shadow-md flex-grow sm:flex-grow-0"
          >
            + Add Expense
          </button>
          <button
            onClick={() => setActiveModal("savings")}
            className="btn btn-info btn-sm sm:btn-md text-white shadow-md flex-grow sm:flex-grow-0"
          >
            + Add Savings
          </button>
        </div>
      </div>

      {/* Bottom Section: Tables Grid */}
      {loading ? (
        <div className="flex justify-center py-20">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Income Column */}
          <div className="bg-base-100 p-4 rounded-box shadow-md">
            <h3 className="text-lg font-bold text-success border-b pb-2 mb-4">Incomes</h3>
            <div className="overflow-x-auto max-h-96">
              {records.incomes.length === 0 ? (
                <p className="text-center text-sm text-base-content/50 py-8">No incomes found</p>
              ) : (
                <table className="table table-xs sm:table-sm w-full">
                  <thead>
                    <tr>
                      <th>Source</th>
                      <th>Amount</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {records.incomes.map((item) => (
                      <tr key={item._id} className="hover">
                        <td className="font-medium">{item.source}</td>
                        <td className="text-success font-semibold">৳{item.amount}</td>
                        <td>{new Date(item.date).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* Expense Column */}
          <div className="bg-base-100 p-4 rounded-box shadow-md">
            <h3 className="text-lg font-bold text-error border-b pb-2 mb-4">Expenses</h3>
            <div className="overflow-x-auto max-h-96">
              {records.expenses.length === 0 ? (
                <p className="text-center text-sm text-base-content/50 py-8">No expenses found</p>
              ) : (
                <table className="table table-xs sm:table-sm w-full">
                  <thead>
                    <tr>
                      <th>Destination</th>
                      <th>Amount</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {records.expenses.map((item) => (
                      <tr key={item._id} className="hover">
                        <td className="font-medium">{item.destination}</td>
                        <td className="text-error font-semibold">৳{item.amount}</td>
                        <td>{new Date(item.date).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* Savings Column */}
          <div className="bg-base-100 p-4 rounded-box shadow-md">
            <h3 className="text-lg font-bold text-info border-b pb-2 mb-4">Savings</h3>
            <div className="overflow-x-auto max-h-96">
              {records.savings.length === 0 ? (
                <p className="text-center text-sm text-base-content/50 py-8">No savings found</p>
              ) : (
                <table className="table table-xs sm:table-sm w-full">
                  <thead>
                    <tr>
                      <th>Amount</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {records.savings.map((item) => (
                      <tr key={item._id} className="hover">
                        <td className="text-info font-semibold">৳{item.amount}</td>
                        <td>{new Date(item.date).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal - Add Income */}
      <div className={`modal ${activeModal === "income" ? "modal-open" : ""}`}>
        <div className="modal-box">
          <h3 className="font-bold text-lg text-success mb-4">Add New Income</h3>
          {modalError && (
            <div className="alert alert-error py-2 mb-4 text-xs font-semibold">
              {modalError}
            </div>
          )}
          <form onSubmit={handleAddIncome} className="space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Source</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Salary, Freelance"
                className="input input-bordered w-full"
                value={incomeForm.source}
                onChange={(e) => setIncomeForm({ ...incomeForm, source: e.target.value })}
                required
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Amount (BDT)</span>
              </label>
              <input
                type="number"
                placeholder="e.g. 5000"
                className="input input-bordered w-full"
                value={incomeForm.amount}
                onChange={(e) => setIncomeForm({ ...incomeForm, amount: e.target.value })}
                required
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Date (Optional)</span>
              </label>
              <input
                type="date"
                className="input input-bordered w-full"
                value={incomeForm.date}
                onChange={(e) => setIncomeForm({ ...incomeForm, date: e.target.value })}
              />
            </div>
            <div className="modal-action">
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => {
                  setActiveModal(null);
                  setModalError("");
                }}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-success text-white" disabled={modalLoading}>
                {modalLoading ? <span className="loading loading-spinner"></span> : "Save"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Modal - Add Expense */}
      <div className={`modal ${activeModal === "expense" ? "modal-open" : ""}`}>
        <div className="modal-box">
          <h3 className="font-bold text-lg text-error mb-4">Add New Expense</h3>
          {modalError && (
            <div className="alert alert-error py-2 mb-4 text-xs font-semibold">
              {modalError}
            </div>
          )}
          <form onSubmit={handleAddExpense} className="space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Destination</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Rent, Groceries"
                className="input input-bordered w-full"
                value={expenseForm.destination}
                onChange={(e) => setExpenseForm({ ...expenseForm, destination: e.target.value })}
                required
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Amount (BDT)</span>
              </label>
              <input
                type="number"
                placeholder="e.g. 1500"
                className="input input-bordered w-full"
                value={expenseForm.amount}
                onChange={(e) => setExpenseForm({ ...expenseForm, amount: e.target.value })}
                required
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Date (Optional)</span>
              </label>
              <input
                type="date"
                className="input input-bordered w-full"
                value={expenseForm.date}
                onChange={(e) => setExpenseForm({ ...expenseForm, date: e.target.value })}
              />
            </div>
            <div className="modal-action">
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => {
                  setActiveModal(null);
                  setModalError("");
                }}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-error text-white" disabled={modalLoading}>
                {modalLoading ? <span className="loading loading-spinner"></span> : "Save"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Modal - Add Savings */}
      <div className={`modal ${activeModal === "savings" ? "modal-open" : ""}`}>
        <div className="modal-box">
          <h3 className="font-bold text-lg text-info mb-4">Add New Savings</h3>
          {modalError && (
            <div className="alert alert-error py-2 mb-4 text-xs font-semibold">
              {modalError}
            </div>
          )}
          <form onSubmit={handleAddSavings} className="space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Amount (BDT)</span>
              </label>
              <input
                type="number"
                placeholder="e.g. 500"
                className="input input-bordered w-full"
                value={savingsForm.amount}
                onChange={(e) => setSavingsForm({ ...savingsForm, amount: e.target.value })}
                required
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Date (Optional)</span>
              </label>
              <input
                type="date"
                className="input input-bordered w-full"
                value={savingsForm.date}
                onChange={(e) => setSavingsForm({ ...savingsForm, date: e.target.value })}
              />
            </div>
            <div className="text-xs text-base-content/60 my-2">
              💡 Note: Minimum BDT 200 is required for savings unless the selected date is a Friday.
            </div>
            <div className="modal-action">
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => {
                  setActiveModal(null);
                  setModalError("");
                }}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-info text-white" disabled={modalLoading}>
                {modalLoading ? <span className="loading loading-spinner"></span> : "Save"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
