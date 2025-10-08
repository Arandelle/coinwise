'use client';
import { useEffect, useState } from 'react';

interface Transaction {
  id: number;
  type: string;
  category: string;
  amount: number;
  date: string;
}

export default function Home() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://flask-backend-7o25.onrender.com/api/transactions')
      .then(res => res.json())
      .then(data => {
        setTransactions(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching data:', err);
        setLoading(false);
      });
  }, []);

  return (
    <main className="p-6 text-white bg-black min-h-screen">
      <h1 className="text-3xl font-bold mb-4">Finance Tracker</h1>

      {loading ? (
        <p>Loading transactions...</p>
      ) : (
        <div className="space-y-3">
          {transactions.map((t) => (
            <div
              key={t.id}
              className="p-3 bg-gray-800 rounded-lg flex justify-between items-center"
            >
              <div>
                <p className="font-semibold">{t.category}</p>
                <p className="text-sm text-gray-400">{t.date}</p>
              </div>
              <p
                className={`font-bold ${
                  t.type === 'income' ? 'text-green-400' : 'text-red-400'
                }`}
              >
                {t.type === 'income' ? '+' : '-'}₱{t.amount}
              </p>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
