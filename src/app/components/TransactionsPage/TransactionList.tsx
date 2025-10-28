"use client"

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useAuth } from "@/app/context/AuthContext";
import LoadingCoin from "@/app/components/Loading";
import TransactionsSection from "@/app/components/TransactionsPage/TransactionsSection";
import TransactionModal from "@/app/components/TransactionsPage/TransactionModal";
import { Transaction } from "@/app/components/TransactionsPage/types";
import { categories } from "@/app/components/TransactionsPage/constants";
import ProfileSidebar from "@/app/components/TransactionsPage/ProfileSidebar"
import InsightsSidebar from "@/app/components/TransactionsPage/InsightsSidebar";

const TransactionList = () => {
  const { user, loading, refreshUser } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  useEffect(() => {
    loadTransactions();
  }, []);

  if (loading) {
    return <LoadingCoin label="Loading transaction..." />;
  }

  function loadTransactions()  {
    const stored: Record<string, Transaction> = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith("transaction_")) {
        try {
          stored[key] = JSON.parse(localStorage.getItem(key) || "");
        } catch (e) {
          console.error("Error loading transaction:", e);
        }
      }
    }

    const txList = Object.values(stored);
    txList.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    setTransactions(txList);
  };

  const handleEdit = (tx: Transaction) => {
    setEditingTransaction(tx);
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Delete this transaction?")) {
      localStorage.removeItem(id);
      loadTransactions();
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    setEditingTransaction(null);
  };

  const handleModalSubmit = () => {
    loadTransactions();
    handleModalClose();
  };

  const totalSpent = transactions.reduce((sum, tx) => sum + Math.abs(tx.amount), 0);
  const remaining = 25000 - totalSpent;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-blue-50 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-20 left-10 text-8xl">📊</div>
        <div className="absolute top-32 right-14 text-6xl">💰</div>
        <div className="absolute bottom-44 right-20 text-7xl">✍</div>
        <div className="absolute bottom-32 left-12 text-5xl">✨</div>
        <Image
          src={"/CoinwiseLogo_v7.png"}
          alt="coinwise_logo"
          width={300}
          height={300}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <ProfileSidebar
            user={user}
            totalSpent={totalSpent}
            remaining={remaining}
          />

          <TransactionsSection
            transactions={transactions}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onAddClick={() => setShowModal(true)}
          />

          <InsightsSidebar
            categories={categories}
          />
        </div>
      </div>

      {showModal && (
        <TransactionModal
          editingTransaction={editingTransaction}
          onClose={handleModalClose}
          onSubmit={handleModalSubmit}
        />
      )}
    </div>
  );
};

export default TransactionList;