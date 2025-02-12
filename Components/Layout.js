// components/Layout.js
import Navbar from "./Navbar";

export default function Layout({ children }) {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Navbar />
      {/* Main Content Area */}
      <div className="flex-1 overflow-auto p-6 bg-gray-50">
        {children}
      </div>
    </div>
  );
}
