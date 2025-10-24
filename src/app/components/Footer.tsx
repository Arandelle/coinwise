"use client"

import React from 'react'
import Image from 'next/image'

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Image
                src="/CoinwiseLogo_v7.png"
                alt="coinwise-logo"
                width={30}
                height={30}
              />
              <span className="text-xl font-bold text-emerald-500">CoinWise</span>
            </div>
            <p className="text-sm mb-4">
              AI-powered personal finance assistant to help you budget, save, and reach your financial goals.
            </p>
          </div>

          {/* Product Section */}
          <div>
            <h4 className="font-bold text-white mb-3">Product</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-emerald-400 transition-colors">
                  Features
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-emerald-400 transition-colors">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-emerald-400 transition-colors">
                  Roadmap
                </a>
              </li>
            </ul>
          </div>

          {/* Company Section */}
          <div>
            <h4 className="font-bold text-white mb-3">Company</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-emerald-400 transition-colors">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-emerald-400 transition-colors">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-emerald-400 transition-colors">
                  Careers
                </a>
              </li>
            </ul>
          </div>

          {/* Support Section */}
          <div>
            <h4 className="font-bold text-white mb-3">Support</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-emerald-400 transition-colors">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-emerald-400 transition-colors">
                  Contact
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-emerald-400 transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-emerald-400 transition-colors">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Buy Me a Coffee Section */}
        <div className="border-t border-slate-800 pt-8 pb-6">
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="text-center">
              <h4 className="font-semibold text-white mb-2">Support Our Work</h4>
              <p className="text-sm text-slate-400 mb-4">
                Enjoying CoinWise? Consider buying us a coffee to keep us fueled! ☕
              </p>
            </div>
            <a
              href="https://www.buymeacoffee.com/arandelle"
              target="_blank"
              rel="noopener noreferrer"
              className="animate-pulse inline-flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-semibold px-6 py-3 rounded-lg transition-all transform hover:scale-105"
            >
              <span className="text-xl">☕</span>
              Buy Me a Coffee
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-slate-800 pt-6 text-center text-sm">
          <p>© 2025 CoinWise. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer