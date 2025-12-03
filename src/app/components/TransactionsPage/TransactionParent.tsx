"use client";

import React, { useState } from "react";
import LoadingCoin from "@/app/components/Loading";
import { TransactionsSection } from "./Transaction";
import TransactionModal from "./TransactionModals/TransactionModal";
import { Transaction, TransactionFilters } from "@/app/types/Transaction";
import ProfileSidebar from "@/app/components/TransactionsPage/ProfileSidebar";
import InsightsSidebar from "@/app/components/TransactionsPage/InsightsSidebar";
import { useTransactions } from "@/app/hooks/useTransactions";
import { useUser } from "@/app/hooks/useUser";
import { useDeleteTransaction } from "@/app/hooks/useTransactions";
import { toast } from "sonner";
import BackgroundLayout from "../ReusableComponent/BackgroundLayout";

const TransactionList = () => {
  const { data: user, isLoading: userLoading } = useUser();

    const [filters, setFilters] = useState<TransactionFilters>({
    page: 1,
    limit: 20,
    sort_by: "date",
    order: "desc"
  });

  const { data: transactionsData, isLoading, refetch } = useTransactions(filters); 
  const transactions = transactionsData?.transactions || [];
  const pagination = transactionsData?.pagination;

  const deleteMutation = useDeleteTransaction();

  const [showModal, setShowModal] = useState(false);
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);

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
      console.error("Error deleting transaction", error);
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
    <BackgroundLayout>
      <div className="grid px-4 grid-cols-1 lg:grid-cols-12 gap-6">
        <ProfileSidebar
          totalSpent={totalSpent ?? 0}
        />

        <TransactionsSection
          transactions={transactions ?? []}
          pagination={pagination}
          filters={filters}
          onFilterChange={setFilters}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onAddClick={() => setShowModal(true)}
        />

        <InsightsSidebar />
      </div>

      {showModal && (
        <TransactionModal
          transactions={transactions || []}
          editingTransaction={editingTransaction}
          onClose={handleModalClose}
          onSubmit={handleModalSubmit}
        />
      )}
    </BackgroundLayout>
  );
};

export default TransactionList;
