// app/page.tsx
import { Transaction } from "./types/Transaction";

export default async function Home() {
  const res = await fetch("https://coinwise-backend.onrender.com/transactions", {
    cache: "no-store"
  });
  const transactions = await res.json();

  return (
    <main className="p-10">
      <h1 className="text-2xl font-bold">Transactions</h1>
      <ul>
        {transactions.map((tx: Transaction, index: number) => (
          <li key={index}>
            {tx.category} - ₱{tx.amount} ({tx.type})
          </li>
        ))}
      </ul>
    </main>
  );
}
