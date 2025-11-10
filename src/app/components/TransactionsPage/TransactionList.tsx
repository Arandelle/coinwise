"use client";

import React, { useState } from "react";
import Image from "next/image";
import LoadingCoin from "@/app/components/Loading";
import TransactionsSection from "@/app/components/TransactionsPage/TransactionsSection";
import TransactionModal from "@/app/components/TransactionsPage/TransactionModal";
import { Transaction } from "@/app/types/Transaction";
import { categories } from "@/app/components/TransactionsPage/constants";
import ProfileSidebar from "@/app/components/TransactionsPage/ProfileSidebar";
import InsightsSidebar from "@/app/components/TransactionsPage/InsightsSidebar";
import { useTransactions } from "@/app/hooks/useTransactions";
import { useUser } from "@/app/hooks/useUser";
import { useDeleteTransaction } from "@/app/hooks/useTransactions";
import { toast } from "sonner";

const TransactionList = () => {
  const { data: user, isLoading: userLoading } = useUser();
  const { data: transactions, isLoading, refetch } = useTransactions();
  const deleteMutation = useDeleteTransaction();
  
  const [showModal, setShowModal] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  const handleEdit = (tx: Transaction) => {
    setEditingTransaction(tx);
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm(`Are you sure you want to delete this transaction?`)) {
      return;
    }

    // Guest user - delete from localStorage
    if (!user) {
      localStorage.removeItem(id);
      toast.info("Transaction deleted (local storage)");
      refetch();
      return;
    }

    // Logged-in user - use mutation
    try {
      await deleteMutation.mutateAsync(id);
      toast.info("Transaction deleted successfully!");
    } catch (error) {
      console.error("Error deleting transaction", error)
      toast.info("Error deleting transaction");
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    setEditingTransaction(null);
  };

  const handleModalSubmit = () => {
    refetch();
    handleModalClose();
  };

  const totalSpent = transactions?.reduce((total: number, tx) => {
    if (tx.type === "expense") {
      return total - Math.abs(tx.amount);
    } else {
      return total + Math.abs(tx.amount);
    }
  }, 0);

  const remaining = 25000 + (totalSpent ?? 0);

  if (userLoading || isLoading || deleteMutation.isPending) {
    return (
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 font-mono font-light">
        <div className="bg-white p-4 w-full max-w-md shadow-2xl relative max-h-[90vh] overflow-y-auto rounded-lg">
          <LoadingCoin label="Loading transaction..." />
        </div>
      </div>
    );
  }

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
            user={user || null}
            totalSpent={totalSpent ?? 0}
            remaining={remaining}
          />

          <TransactionsSection
            transactions={transactions ?? []}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onAddClick={() => setShowModal(true)}
          />

          <InsightsSidebar categories={categories} />
        </div>
      </div>

      {showModal && (
        <TransactionModal
          transactions={transactions || []}
          editingTransaction={editingTransaction}
          onClose={handleModalClose}
          onSubmit={handleModalSubmit}
        />
      )}
    </div>
  );
};

export default TransactionList;