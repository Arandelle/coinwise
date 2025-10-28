"use client"; // Enable client-side rendering for this component

import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link"; // used for navigation between pages
import Image from "next/image";

const PublicHeader = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav
      className={`fixed w-full p-4 z-50 transition-all duration-300 ${
        scrollY > 50 ? "bg-white shadow-md" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href={"/"} className="flex items-center gap-2">
            <Image
              src="/CoinwiseLogo_v7.png"
              alt="coinwise-logo"
              width={50}
              height={50}
            />
            <span className={`text-2xl font-bold text-emerald-600`}>
              Coinwise
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <a
              href="#features"
              className="text-slate-600 hover:text-emerald-600 transition-colors"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="text-slate-600 hover:text-emerald-600 transition-colors"
            >
              How It Works
            </a>
            <a
              href="#pricing"
              className="text-slate-600 hover:text-emerald-600 transition-colors"
            >
              Pricing
            </a>
            <Link
              href={"/login"}
              className="px-6 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg hover:shadow-lg transition-all duration-200"
            >
              Login
            </Link>
          </div>

          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-4 py-4 space-y-3">
            <a
              href="#features"
              className="block text-slate-600 hover:text-emerald-600"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="block text-slate-600 hover:text-emerald-600"
            >
              How It Works
            </a>
            <a
              href="#pricing"
              className="block text-slate-600 hover:text-emerald-600"
            >
              Pricing
            </a>
            <button className="w-full px-6 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg">
              Login
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default PublicHeader;
