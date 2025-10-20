import React from 'react'
import { Transaction } from '../../types/Transaction';
import TransactionList from './TransactionList';

const TransactionsPage = async () => {

    const req = await fetch(`${process.env.NEXT_PUBLIC_FRONTEND_URL}/api/transactions`, {
        cache: "no-store"
    });
    const transactions = await req.json();

  return (
    <div>
      <TransactionList transactions={transactions}/>
    </div>
  )
}

export default TransactionsPage;
