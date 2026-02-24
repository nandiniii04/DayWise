import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const TransactionContext = createContext(null);

export const TransactionProvider = ({ children }) => {
  const { user } = useAuth();
  const storageKey = user ? `daywise_tx_${user.email}` : null;

  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    if (storageKey) {
      const stored = JSON.parse(localStorage.getItem(storageKey) || '[]');
      setTransactions(stored);
    } else {
      setTransactions([]);
    }
  }, [storageKey]);

  const save = (txs) => {
    setTransactions(txs);
    if (storageKey) localStorage.setItem(storageKey, JSON.stringify(txs));
  };

  const addTransaction = (tx) => {
    const newTx = { ...tx, id: Date.now().toString() };
    save([newTx, ...transactions]);
    return newTx;
  };

  const editTransaction = (id, updated) => {
    save(transactions.map(t => t.id === id ? { ...t, ...updated } : t));
  };

  const deleteTransaction = (id) => {
    save(transactions.filter(t => t.id !== id));
  };

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const balance = totalIncome - totalExpense;
  const savingsPercent = totalIncome > 0 ? ((balance / totalIncome) * 100).toFixed(1) : 0;

  return (
    <TransactionContext.Provider value={{
      transactions, addTransaction, editTransaction, deleteTransaction,
      totalIncome, totalExpense, balance, savingsPercent
    }}>
      {children}
    </TransactionContext.Provider>
  );
};

export const useTransactions = () => useContext(TransactionContext);