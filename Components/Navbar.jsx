import { useRouter } from "next/router";
import { FaUsers, FaSearch, FaCog } from "react-icons/fa";
import Link from "next/link";

export default function Navbar() {
  const router = useRouter();
  const { pathname } = router;

  // Helper function to check if the route is active
  const isActive = (route) => pathname === route;

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 text-white p-4 flex flex-col h-full">
        <h2 className="text-2xl font-bold mb-6">Employee Dashboard</h2>
        <nav>
          <Link
            href="/"
            className={`flex items-center p-3 w-full text-left rounded mb-2 ${
              isActive("/") ? "bg-gray-700" : ""
            }`}
          >
            <FaUsers className="mr-2" /> Employees
          </Link>
          <Link
            href="/newemployee"
            className={`flex items-center p-3 w-full text-left rounded mb-2 ${
              isActive("/newemployee") ? "bg-gray-700" : ""
            }`}
          >
            <FaUsers className="mr-2" /> New Employee
          </Link>
          <Link
            href="/search"
            className={`flex items-center p-3 w-full text-left rounded mb-2 ${
              isActive("/search") ? "bg-gray-700" : ""
            }`}
          >
            <FaSearch className="mr-2" /> Search
          </Link>
          <Link
            href="/settings"
            className={`flex items-center p-3 w-full text-left rounded ${
              isActive("/settings") ? "bg-gray-700" : ""
            }`}
          >
            <FaCog className="mr-2" /> Settings
          </Link>
        </nav>
      </div>
    </div>
  );
}
