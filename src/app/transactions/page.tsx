import React from 'react'

const TransactionsPage = async () => {

    const req = await fetch(`${process.env.TRANSACTION_API_URL}/api/transactions`, {
        cache: "no-store"
    });
    const transactions = await req.json();

  return (
    <div>
      {transactions.map((tx: any, index: number) => (
        <li key={index}>
            {tx.category} - ₱{tx.amount} ({tx.type})
        </li>
      ))}
    </div>
  )
}

export default TransactionsPage;
