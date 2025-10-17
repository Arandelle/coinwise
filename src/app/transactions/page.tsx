import React from 'react'

interface Transactions {
  user_id: number;
  category: string;
  amount: number;
  type: string;
  name: string;
}

const TransactionsPage = async () => {

    const req = await fetch(`${process.env.TRANSACTION_API_URL}/api/transactions`, {
        cache: "no-store"
    });
    const transactions = await req.json();

  return (
    <div>
      {transactions.map((tx: Transactions, index: number) => (
        <li key={index}>
            {tx.category} - ₱{tx.amount} ({tx.type}) - {tx.name}
        </li>
      ))}
    </div>
  )
}

export default TransactionsPage;
