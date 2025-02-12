import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../Components/Navbar";

export default function EmployeeManagement() {
  const [employees, setEmployees] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState(null); // For modal popup
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get("https://depf-backend.vercel.app/employees");
      setEmployees(response.data);
    } catch (error) {
      console.error("Error fetching employees", error);
    }
  };

  const handleSearch = async () => {
    try {
      const response = await axios.get(
        `https://depf-backend.vercel.app/employees?search=${searchQuery}`
      );
      setEmployees(response.data);
    } catch (error) {
      console.error("Search failed", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://depf-backend.vercel.app/employees/${id}`);
      fetchEmployees();
    } catch (error) {
      console.error("Error deleting employee", error);
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
                    <td className="p-3">{employee.communication?.phoneNo}</td>
                    <td className="p-3 flex flex-col md:flex-row gap-2">
                      <button
                        onClick={() => openModal(employee)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm shadow-md"
                      >
                        Info
                      </button>
                      <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md text-sm shadow-md">
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
          </div>

          {/* Responsive Note */}
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

            {/* Modal Header */}
            <h2 className="text-2xl font-semibold mb-4 text-gray-800 text-center border-b pb-3">
              Employee Details
            </h2>

            {/* Employee Information Grid */}
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

            {/* Footer with Close Button */}
            {/* <div className="mt-6 flex justify-center">
              <button
                onClick={closeModal}
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-medium transition duration-200 shadow-md"
              >
                Close
              </button>
            </div> */}
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

                  {/* Modal Header */}
                  <h2 className="text-2xl font-semibold mb-4 text-gray-800 text-center border-b pb-3">
                    Employee Details
                  </h2>

                  {/* Employee Information Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700 text-sm">
                    {selectedEmployee.employeeID && (
                      <p>
                        <strong className="text-gray-900">ID:</strong>{" "}
                        {selectedEmployee.employeeID}
                      </p>
                    )}
                    {selectedEmployee.employeeName && (
                      <p>
                        <strong className="text-gray-900">Name:</strong>{" "}
                        {selectedEmployee.employeeName}
                      </p>
                    )}
                    {selectedEmployee.appointedPosition && (
                      <p>
                        <strong className="text-gray-900">Position:</strong>{" "}
                        {selectedEmployee.appointedPosition}
                      </p>
                    )}
                    {selectedEmployee.department && (
                      <p>
                        <strong className="text-gray-900">Department:</strong>{" "}
                        {selectedEmployee.department}
                      </p>
                    )}
                    <p>
                      <strong className="text-gray-900">Manager:</strong>{" "}
                      {selectedEmployee.manager ? "Yes" : "No"}
                    </p>
                    {selectedEmployee.workplace && (
                      <p>
                        <strong className="text-gray-900">Workplace:</strong>{" "}
                        {selectedEmployee.workplace}
                      </p>
                    )}
                    {selectedEmployee.project && (
                      <p>
                        <strong className="text-gray-900">Project:</strong>{" "}
                        {selectedEmployee.project}
                      </p>
                    )}
                    {selectedEmployee.reportingManagerID && (
                      <p>
                        <strong className="text-gray-900">
                          Reporting Manager ID:
                        </strong>{" "}
                        {selectedEmployee.reportingManagerID}
                      </p>
                    )}
                    {selectedEmployee.referredBy &&
                      selectedEmployee.referredBy !== "N/A" && (
                        <p>
                          <strong className="text-gray-900">
                            Referred By:
                          </strong>{" "}
                          {selectedEmployee.referredBy}
                        </p>
                      )}

                    {/* Date Fields */}
                    {selectedEmployee.interviewDate && (
                      <p>
                        <strong className="text-gray-900">
                          Interview Date:
                        </strong>{" "}
                        {new Date(
                          selectedEmployee.interviewDate
                        ).toLocaleDateString()}
                      </p>
                    )}
                    {selectedEmployee.offeredDate && (
                      <p>
                        <strong className="text-gray-900">Offered Date:</strong>{" "}
                        {new Date(
                          selectedEmployee.offeredDate
                        ).toLocaleDateString()}
                      </p>
                    )}
                    {selectedEmployee.offerAcceptanceDate && (
                      <p>
                        <strong className="text-gray-900">
                          Offer Acceptance Date:
                        </strong>{" "}
                        {new Date(
                          selectedEmployee.offerAcceptanceDate
                        ).toLocaleDateString()}
                      </p>
                    )}
                    {selectedEmployee.dateOfJoining && (
                      <p>
                        <strong className="text-gray-900">Joining Date:</strong>{" "}
                        {new Date(
                          selectedEmployee.dateOfJoining
                        ).toLocaleDateString()}
                      </p>
                    )}

                    {selectedEmployee.onRollOffRoll && (
                      <p>
                        <strong className="text-gray-900">On-Roll:</strong>{" "}
                        {selectedEmployee.onRollOffRoll}
                      </p>
                    )}
                    {selectedEmployee.status && (
                      <p>
                        <strong className="text-gray-900">Status:</strong>{" "}
                        {selectedEmployee.status}
                      </p>
                    )}

                    {/* Education Details */}
                    {selectedEmployee.education?.highestEducation && (
                      <p>
                        <strong className="text-gray-900">Education:</strong>{" "}
                        {selectedEmployee.education.highestEducation} (
                        {selectedEmployee.education.yearOfPassing})
                      </p>
                    )}
                    {selectedEmployee.education?.relevantExperience && (
                      <p>
                        <strong className="text-gray-900">Experience:</strong>{" "}
                        {selectedEmployee.education.relevantExperience}
                      </p>
                    )}

                    {/* Personal Details */}
                    {selectedEmployee.personal?.dob && (
                      <p>
                        <strong className="text-gray-900">DOB:</strong>{" "}
                        {new Date(
                          selectedEmployee.personal.dob
                        ).toLocaleDateString()}
                      </p>
                    )}
                    {selectedEmployee.personal?.age && (
                      <p>
                        <strong className="text-gray-900">Age:</strong>{" "}
                        {selectedEmployee.personal.age}
                      </p>
                    )}
                    {selectedEmployee.personal?.gender && (
                      <p>
                        <strong className="text-gray-900">Gender:</strong>{" "}
                        {selectedEmployee.personal.gender}
                      </p>
                    )}
                    {selectedEmployee.personal?.bloodGroup && (
                      <p>
                        <strong className="text-gray-900">Blood Group:</strong>{" "}
                        {selectedEmployee.personal.bloodGroup}
                      </p>
                    )}
                    {selectedEmployee.personal?.aadharNo && (
                      <p>
                        <strong className="text-gray-900">Aadhar No:</strong>{" "}
                        {selectedEmployee.personal.aadharNo}
                      </p>
                    )}

                    {/* Contact Details */}
                    {selectedEmployee.communication?.phoneNo && (
                      <p>
                        <strong className="text-gray-900">Phone:</strong>{" "}
                        {selectedEmployee.communication.phoneNo}
                      </p>
                    )}
                    {selectedEmployee.communication?.personalEmail && (
                      <p>
                        <strong className="text-gray-900">Email:</strong>{" "}
                        {selectedEmployee.communication.personalEmail}
                      </p>
                    )}
                    {selectedEmployee.communication?.permanentAddress && (
                      <p>
                        <strong className="text-gray-900">Address:</strong>{" "}
                        {selectedEmployee.communication.permanentAddress}
                      </p>
                    )}

                    {/* Emergency Contact */}
                    {selectedEmployee.emergencyContact?.name && (
                      <p>
                        <strong className="text-gray-900">
                          Emergency Contact:
                        </strong>{" "}
                        {selectedEmployee.emergencyContact.name} (
                        {selectedEmployee.emergencyContact.relationship})
                      </p>
                    )}
                    {selectedEmployee.emergencyContact?.phone && (
                      <p>
                        <strong className="text-gray-900">
                          Emergency Phone:
                        </strong>{" "}
                        {selectedEmployee.emergencyContact.phone}
                      </p>
                    )}

                    {/* Family Details */}
                    {selectedEmployee.mother?.motherName && (
                      <p>
                        <strong className="text-gray-900">Mother:</strong>{" "}
                        {selectedEmployee.mother.motherName}
                      </p>
                    )}
                    {selectedEmployee.father?.fatherName && (
                      <p>
                        <strong className="text-gray-900">Father:</strong>{" "}
                        {selectedEmployee.father.fatherName}
                      </p>
                    )}
                    {selectedEmployee.spouse?.spouseName && (
                      <p>
                        <strong className="text-gray-900">Spouse:</strong>{" "}
                        {selectedEmployee.spouse.spouseName}
                      </p>
                    )}

                    {/* Children Details */}
                    {selectedEmployee.children &&
                      selectedEmployee.children.length > 0 && (
                        <p>
                          <strong className="text-gray-900">Children:</strong>{" "}
                          {selectedEmployee.children.map((child, index) => (
                            <span key={index}>
                              {child.childName}
                              {index !== selectedEmployee.children.length - 1
                                ? ", "
                                : ""}
                            </span>
                          ))}
                        </p>
                      )}
                  </div>

                  {/* Footer with Close Button */}
                  {/* <div className="mt-6 flex justify-center">
        <button
          onClick={closeModal}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-medium transition duration-200 shadow-md"
        >
          Close
        </button>
      </div> */}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
