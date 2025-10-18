import React from 'react'
import { Transaction } from '../types/Transaction';

const TransactionsPage = async () => {

    const req = await fetch(`${process.env.NEXT_PUBLIC_TRANSACTION_API_URL}/transactions`, {
        cache: "no-store"
    });
    const transactions = await req.json();

  return (
    <div>
      {transactions.map((tx: Transaction, index: number) => (
        <li key={index}>
            {tx.category} - ₱{tx.amount} ({tx.type}) - {tx.name}
        </li>
      ))}
    </div>
  )
}

export default TransactionsPage;
