import TransactionList from '@/app/components/TransactionsPage/TransactionList'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const page = () => {
  return (
    <>
      <div className="bg-gradient-to-r from-emerald-500 to-teal-500 sticky top-0 z-10 p-2 shadow-lg">
          <div className="flex items-center justify-between max-w-7xl mx-auto px-4 py-4">
            <Link href={"/"} className="flex items-center gap-2">
              <Image
                src="/CoinwiseLogo_v8.png"
                alt="coinwise-logo"
                width={50}
                height={50}
              />
              <span className={`text-2xl font-bold text-white`}>
                Coinwise
              </span>
            </Link>
  
            <div className="flex items-center gap-3">
              <Link href="/login">
                <button className="px-5 py-2 text-white font-medium hover:text-white transition-colors cursor-pointer hover:scale-110">
                  Log in
                </button>
                <span className="text-white">|</span>
              </Link>
              <Link href="/signup">
                <button className="px-5 py-2 text-md bg-transparent text-white font-bold border border-white rounded-3xl hover:bg-teal-600 hover:text-white hover:scale-110 transition-colors cursor-pointer">
                  Register
                </button>
              </Link>
            </div>
          </div>
        </div>
        <TransactionList />
    </>
  )
}

export default page
