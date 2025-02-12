import { useState } from "react";
import { FaUsers, FaSearch, FaCog } from "react-icons/fa";
import Link from "next/link.js";

export default function Navbar() {
  const [activeTab, setActiveTab] = useState("employees");

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 text-white p-4 flex flex-col">
        <h2 className="text-2xl font-bold mb-6">Employee Dashboard</h2>
        <nav>
          <Link href="/"
            className={`flex items-center p-3 w-full text-left rounded mb-2 ${activeTab === "employees" ? "bg-gray-700" : ""}`}
          >
            <FaUsers className="mr-2" /> Employees
          </Link>
          <Link href="/search"
            className={`flex items-center p-3 w-full text-left rounded mb-2 ${activeTab === "search" ? "bg-gray-700" : ""}`}
            // onClick={() => setActiveTab("search")}
          >
            <FaSearch className="mr-2" /> Search
          </Link>
          <Link href="/settings"
            className={`flex items-center p-3 w-full text-left rounded ${activeTab === "settings" ? "bg-gray-700" : ""}`}
            // onClick={() => setActiveTab("settings")}
          >
            <FaCog className="mr-2" /> Settings
          </Link>
        </nav>
      </div>

    
    </div>
  );
}
