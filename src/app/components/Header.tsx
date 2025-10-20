"use client"; // Enable client-side rendering for this component

import React, { useState } from "react";
import { Menu, X, Search } from "lucide-react";
import Link from "next/link"; // used for navigation between pages
import Image from "next/image";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { label: "Main", href: "/" },
    { label: "Dashboard", href: "/dashboard"},
    { label: "Transactions", href: "/transactions" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
    { label: "Login", href: "/login" },
    { label: "Signup", href: "/signup" },
  ];

  return (
    <header className="w-full bg-white shadow-md">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between px-4 py-3 md:py-4 max-w-7xl mx-auto">
        {/** ======== Group 1 ========= */}
        <div className="flex items-center justify-between">
          {/** Logo Section */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded hover:bg-gray-500 bg-gray-400"
          >
            {isMenuOpen ? (
              <X size={24} color="black" />
            ) : (
              <Menu size={24} color="black" />
            )}
          </button>
          {/** Desktop logo or title */}
          <div className="md:flex flex-row space-x-3 items-center justify-center hidden">
            <Image
              src={"/CoinwiseLogo_v1.png"}
              alt="Coinwise Logo"
              width={50}
              height={50}
            />
            <h1 className="text-3xl text-amber-500 font-semibold">
              Coinwise
            </h1>
          </div>

          {/* Right: Search or other button */}
          <button className="p-2 rounded hover:bg-gray-100 md:hidden">
            <Search size={22} color="black" />
          </button>
        </div>
        {/** ======== Group 2 ========= */}
        <nav
          className={`flex-col md:flex-row md:flex md:items-center mt-3 md:mt-0`}
        >
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="px-3 py-2 text-gray-700 hover:text-amber-600 hover:bg-gray-100 rounded-md text-sm font-medium"
              onClick={() => setIsMenuOpen(false)} // close the drawer when clicked
            >
              {item.label}
            </Link>
          ))}
        </nav>
        {/** ===== Mobile Drawer overlay ====== */}
        {isMenuOpen && (
          <div
            className="fixed inset-0 bg-amber-500 opacity-30 z-40 md:hidden"
            onClick={() => setIsMenuOpen(false)}
          ></div>
        )}
      </div>
    </header>
  );
};

export default Header;
