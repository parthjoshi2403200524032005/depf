import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../Components/Navbar";
import { url } from "../Services/Service";

export default function EmployeeManagement() {
  const [employees, setEmployees] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState(null); // For modal popup
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    setLoading(true);
    setErrorMessage("");
    try {
      const response = await axios.get(`${url}/employees`);
      setEmployees(response.data);
      if (response.data.length === 0) {
        setErrorMessage("No employees found.");
      }
    } catch (error) {
      console.error("Error fetching employees", error);
      setErrorMessage("Error fetching employees.");
    }
    setLoading(false);
  };

  const handleSearch = async () => {
    setLoading(true);
    setErrorMessage("");
    try {
      if (!searchQuery.trim()) {
        // If search query is empty, fetch all employees
        fetchEmployees();
        return;
      }
  
      const response = await axios.get(`${url}/employees/search/${searchQuery}`);
      
      // Check if response returns an empty array
      if (response.data.length === 0) {
        setEmployees([]);
        setErrorMessage("No employees found.");
      } else {
        setEmployees(response.data);
      }
    } catch (error) {
      console.error("Search failed", error);
      if (error.response && error.response.status === 404) {
        // If 404 is returned, assume no employees were found
        setEmployees([]);
        setErrorMessage("No employees found.");
      } else {
        setErrorMessage("Search failed. Please try again later.");
      }
    }
    setLoading(false);
  };
  
 useEffect(() => {
    const delayDebounce = setTimeout(() => {
      handleSearch();
    }, 500); // Debounce for 500ms

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${url}/employees/${id}`);
      fetchEmployees();
    } catch (error) {
      console.error("Error deleting employee", error);
      // Optionally, set an error message or display a notification here.
    }
  };

  const openModal = (employee) => {
    setSelectedEmployee(employee);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedEmployee(null);
    setIsModalOpen(false);
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-50">
      <Navbar />
      <div className="flex-1 p-6">
        <div className="container mx-auto p-6 bg-white shadow-lg rounded-lg w-full">
          <h1 className="text-3xl font-semibold mb-6 text-gray-800 text-center">
            Employee Management
          </h1>

          {/* Search Bar */}
          <div className="flex flex-col md:flex-row gap-3 mb-6">
            <input
              type="text"
              placeholder="Search Employee"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border border-gray-300 p-3 rounded-lg flex-1 focus:ring-2 focus:ring-blue-400 outline-none text-gray-700"
            />
            <button
              onClick={handleSearch}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg font-medium transition duration-200 shadow-md"
            >
              Search
            </button>
          </div>

          {/* Table Section */}
          <div className="overflow-auto bg-white shadow-md rounded-lg p-4">
            {loading ? (
              <div className="text-center py-6 text-gray-600">Loading...</div>
            ) : employees.length > 0 ? (
              <table className="w-full border-collapse text-sm">
                <thead className="bg-blue-700 text-white">
                  <tr>
                    <th className="p-3">ID</th>
                    <th className="p-3">Name</th>
                    <th className="p-3">Position</th>
                    <th className="p-3 hidden md:table-cell">Workplace</th>
                    <th className="p-3 hidden md:table-cell">On-Roll</th>
                    <th className="p-3">Phone</th>
                    <th className="p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map((employee) => (
                    <tr
                      key={employee.employeeID}
                      className="hover:bg-gray-100 transition border-b border-gray-200 text-gray-700"
                    >
                      <td className="p-3">{employee.employeeID}</td>
                      <td className="p-3">{employee.employeeName}</td>
                      <td className="p-3">{employee.appointedPosition}</td>
                      <td className="p-3 hidden md:table-cell">
                        {employee.workplace}
                      </td>
                      <td className="p-3 hidden md:table-cell">
                        {employee.onRollOffRoll}
                      </td>
                      <td className="p-3">
                        {employee.communication?.phoneNo}
                      </td>
                      <td className="p-3 flex flex-col md:flex-row gap-2">
                        <button
                          onClick={() => openModal(employee)}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm shadow-md"
                        >
                          Info
                        </button>
                        <button
                          onClick={() =>
                            (window.location.href = `/${employee._id}`)
                          }
                          className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md text-sm shadow-md"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(employee._id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm shadow-md"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-center py-6 text-gray-600">
                {errorMessage || "No employees found."}
              </div>
            )}
          </div>

          <p className="text-xs text-gray-500 mt-4 text-center">
            * Click "Info" for full details.
          </p>
        </div>
      </div>

      {/* Modal Popup for Employee Details */}
      {isModalOpen && selectedEmployee && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300">
          <div className="bg-white p-6 rounded-lg shadow-xl w-11/12 md:w-3/5 lg:w-1/2 max-h-[80vh] overflow-auto relative">
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 bg-red-500 hover:bg-red-600 text-white w-8 h-8 rounded-full flex items-center justify-center shadow-md transition duration-200"
            >
              ✕
            </button>

            <h2 className="text-2xl font-semibold mb-4 text-gray-800 text-center border-b pb-3">
              Employee Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700 text-sm">
              <p>
                <strong className="text-gray-900">ID:</strong>{" "}
                {selectedEmployee.employeeID}
              </p>
              <p>
                <strong className="text-gray-900">Name:</strong>{" "}
                {selectedEmployee.employeeName}
              </p>
              <p>
                <strong className="text-gray-900">Position:</strong>{" "}
                {selectedEmployee.appointedPosition}
              </p>
              <p>
                <strong className="text-gray-900">Department:</strong>{" "}
                {selectedEmployee.department}
              </p>
              <p>
                <strong className="text-gray-900">Manager:</strong>{" "}
                {selectedEmployee.manager ? "Yes" : "No"}
              </p>
              <p>
                <strong className="text-gray-900">Workplace:</strong>{" "}
                {selectedEmployee.workplace}
              </p>
              <p>
                <strong className="text-gray-900">Project:</strong>{" "}
                {selectedEmployee.project || "N/A"}
              </p>
              <p>
                <strong className="text-gray-900">On-Roll:</strong>{" "}
                {selectedEmployee.onRollOffRoll}
              </p>
              <p>
                <strong className="text-gray-900">Joining Date:</strong>{" "}
                {new Date(selectedEmployee.dateOfJoining).toLocaleDateString()}
              </p>
              <p>
                <strong className="text-gray-900">Phone:</strong>{" "}
                {selectedEmployee.communication?.phoneNo}
              </p>
              <p>
                <strong className="text-gray-900">Email:</strong>{" "}
                {selectedEmployee.communication?.personalEmail}
              </p>
              <p className="md:col-span-2">
                <strong className="text-gray-900">Address:</strong>{" "}
                {selectedEmployee.communication?.permanentAddress}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
