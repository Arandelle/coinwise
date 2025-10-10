// app/page.tsx
export default async function Home() {
  const res = await fetch("http://localhost:3000/api/transactions", {
    cache: "no-store"
  });
  const transactions = await res.json();

  return (
    <main className="p-10">
      <h1 className="text-2xl font-bold">Transactions</h1>
      <ul>
        {transactions.map((tx: any) => (
          <li key={tx._id}>
            {tx.category} - ₱{tx.amount} ({tx.type})
          </li>
        ))}
      </ul>
    </main>
  );
}
