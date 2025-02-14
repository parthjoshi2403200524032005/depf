import { useState } from "react";
import { useRouter } from "next/router";
import { FaUsers, FaSearch, FaCog, FaBars, FaTimes } from "react-icons/fa";
import Link from "next/link";

export default function Navbar() {
  const router = useRouter();
  const { pathname } = router;
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (route) => pathname === route;

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex flex-col w-72 h-screen bg-gray-900 text-white p-6 shadow-lg">
        <h2 className="text-2xl font-bold mb-8 text-center">Dashboard</h2>
        <nav className="space-y-4">
          <NavItem
            href="/"
            icon={<FaUsers />}
            label="Employees"
            active={isActive("/")}
          />
          <NavItem
            href="/newemployee"
            icon={<FaUsers />}
            label="New Employee"
            active={isActive("/newemployee")}
          />
          <NavItem
            href="/search"
            icon={<FaSearch />}
            label="Search"
            active={isActive("/search")}
          />
          <NavItem
            href="/settings"
            icon={<FaCog />}
            label="Settings"
            active={isActive("/settings")}
          />
        </nav>
      </div>

      {/* Mobile Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-gray-900 text-white p-6 flex flex-col shadow-lg transition-all duration-300 ${
          isOpen ? "w-64" : "w-0 overflow-hidden opacity-0"
        } lg:hidden`}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold ml-[50px]">Dashboard</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="text-white text-2xl"
          >
            <FaTimes />
          </button>
        </div>
        <nav className="space-y-4">
          <NavItem
            href="/"
            icon={<FaUsers />}
            label="Employees"
            active={isActive("/")}
          />
          <NavItem
            href="/newemployee"
            icon={<FaUsers />}
            label="New Employee"
            active={isActive("/newemployee")}
          />
          <NavItem
            href="/search"
            icon={<FaSearch />}
            label="Search"
            active={isActive("/search")}
          />
          <NavItem
            href="/settings"
            icon={<FaCog />}
            label="Settings"
            active={isActive("/settings")}
          />
        </nav>
      </div>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 bg-gray-900 text-white p-3 rounded-full shadow-md"
      >
        <FaBars className="text-xl" />
      </button>
    </>
  );
}

// Reusable Navigation Item Component
const NavItem = ({ href, icon, label, active }) => {
  return (
    <Link
      href={href}
      className={`flex items-center px-4 py-3 rounded-lg text-lg md:text-xl transition-all duration-200 ${
        active ? "bg-gray-700" : "hover:bg-gray-800"
      }`}
    >
      <span className="mr-4 text-xl">{icon}</span>
      <span className="text-base md:text-lg">{label}</span>
    </Link>
  );
};
