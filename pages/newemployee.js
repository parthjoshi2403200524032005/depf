// pages/newemployee.js
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import Layout from "../Components/Layout";

export default function NewEmployee() {
  const router = useRouter();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    employeeID: "",
    employeeName: "",
    appointedPosition: "",
    department: "",
    manager: false,
    workplace: "",
    project: "",
    reportingManagerID: "",
    referredBy: "",
    interviewDate: "",
    offeredDate: "",
    offerAcceptanceDate: "",
    onRollOffRoll: "On-Roll",
    appointmentLetterRefNo: "",
    dateOfJoining: "",
    status: "",
    education: {
      highestEducation: "",
      yearOfPassing: "",
      relevantExperience: ""
    },
    personal: {
      dob: "",
      age: "",
      gender: "Male",
      bloodGroup: "",
      aadharNo: ""
    },
    communication: {
      phoneNo: "",
      altPhoneNo: "",
      personalEmail: "",
      workEmail: "",
      permanentAddress: "",
      correspondentAddress: ""
    },
    insuranceAndBank: {
      gpaiNo: "",
      bankName: "",
      bankAccountNo: "",
      ifsc: "",
      uan: "",
      esiNo: "",
      maritalStatus: "Single",
      marriageDate: ""
    },
    mother: {
      motherName: "",
      motherAadharNo: "",
      motherDOB: ""
    },
    father: {
      fatherName: "",
      fatherAadharNo: "",
      fatherDOB: ""
    },
    spouse: {
      spouseName: "",
      spouseAadharNo: "",
      spouseDOB: ""
    },
    children: [],
    emergencyContact: {
      name: "",
      relationship: "",
      phone: ""
    }
  });

  // State for a new child entry before adding it to the children array
  const [child, setChild] = useState({ childName: "", childAadharNo: "", childDOB: "" });
  const [children, setChildren] = useState([]);

  // Generic change handler (supports one level of nested properties using dot notation)
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.includes(".")) {
      const [parent, childKey] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [childKey]: type === "checkbox" ? checked : value
        }
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value
      }));
    }
  };

  // For child inputs
  const handleChildChange = (e) => {
    const { name, value } = e.target;
    setChild((prev) => ({ ...prev, [name]: value }));
  };

  const addChild = () => {
    if (child.childName.trim() !== "") {
      setChildren((prev) => [...prev, child]);
      setChild({ childName: "", childAadharNo: "", childDOB: "" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    // Merge the children into the main form data
    const dataToSubmit = { ...formData, children: children };
    try {
      await axios.post("http://localhost:8080/employees", dataToSubmit);
      setLoading(false);
      router.push("/"); // redirect as desired
    } catch (err) {
      setLoading(false);
      setError("Error submitting form. Please try again.");
      console.error(err);
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">New Employee Registration</h1>
        {error && <p className="mb-4 text-red-500 text-center">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-10">
          {/* Basic Information */}
          <section className="border p-6 rounded-lg">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4 border-b pb-2">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block mb-2 text-gray-600">Employee ID <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="employeeID"
                  value={formData.employeeID}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-600"
                  required
                />
              </div>
              <div>
                <label className="block mb-2 text-gray-600">Employee Name <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="employeeName"
                  value={formData.employeeName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-600"
                  required
                />
              </div>
              <div>
                <label className="block mb-2 text-gray-600">Position <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="appointedPosition"
                  value={formData.appointedPosition}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-600"
                  required
                />
              </div>
              <div>
                <label className="block mb-2 text-gray-600">Department <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-600"
                  required
                />
              </div>
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  name="manager"
                  checked={formData.manager}
                  onChange={handleChange}
                  className="h-5 w-5"
                />
                <label className="text-gray-600 font-medium">Manager</label>
              </div>
              <div>
                <label className="block mb-2 text-gray-600">Workplace <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="workplace"
                  value={formData.workplace}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-600"
                  required
                />
              </div>
              <div>
                <label className="block mb-2 text-gray-600">Project</label>
                <input
                  type="text"
                  name="project"
                  value={formData.project}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-600"
                />
              </div>
              <div>
                <label className="block mb-2 text-gray-600">Reporting Manager ID</label>
                <input
                  type="text"
                  name="reportingManagerID"
                  value={formData.reportingManagerID}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-600"
                />
              </div>
              <div>
                <label className="block mb-2 text-gray-600">Referred By</label>
                <input
                  type="text"
                  name="referredBy"
                  value={formData.referredBy}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-600"
                />
              </div>
            </div>
          </section>

          {/* Dates & Employment */}
          <section className="border p-6 rounded-lg">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4 border-b pb-2">Dates & Employment</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block mb-2 text-gray-600">Interview Date</label>
                <input
                  type="date"
                  name="interviewDate"
                  value={formData.interviewDate}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-600"
                />
              </div>
              <div>
                <label className="block mb-2 text-gray-600">Offered Date</label>
                <input
                  type="date"
                  name="offeredDate"
                  value={formData.offeredDate}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-600"
                />
              </div>
              <div>
                <label className="block mb-2 text-gray-600">Offer Acceptance Date</label>
                <input
                  type="date"
                  name="offerAcceptanceDate"
                  value={formData.offerAcceptanceDate}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-600"
                />
              </div>
              <div>
                <label className="block mb-2 text-gray-600">On-Roll/Off-Roll <span className="text-red-500">*</span></label>
                <select
                  name="onRollOffRoll"
                  value={formData.onRollOffRoll}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-600"
                  required
                >
                  <option value="On-Roll">On-Roll</option>
                  <option value="Off-Roll">Off-Roll</option>
                </select>
              </div>
              <div>
                <label className="block mb-2 text-gray-600">Appointment Letter Ref No</label>
                <input
                  type="text"
                  name="appointmentLetterRefNo"
                  value={formData.appointmentLetterRefNo}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-600"
                />
              </div>
              <div>
                <label className="block mb-2 text-gray-600">Date of Joining <span className="text-red-500">*</span></label>
                <input
                  type="date"
                  name="dateOfJoining"
                  value={formData.dateOfJoining}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-600"
                  required
                />
              </div>
              <div>
                <label className="block mb-2 text-gray-600">Status</label>
                <input
                  type="text"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-600"
                />
              </div>
            </div>
          </section>

          {/* Education */}
          <section className="border p-6 rounded-lg">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4 border-b pb-2">Education</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block mb-2 text-gray-600">Highest Education <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="education.highestEducation"
                  value={formData.education.highestEducation}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-600"
                  required
                />
              </div>
              <div>
                <label className="block mb-2 text-gray-600">Year of Passing <span className="text-red-500">*</span></label>
                <input
                  type="number"
                  name="education.yearOfPassing"
                  value={formData.education.yearOfPassing}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-600"
                  required
                />
              </div>
              <div>
                <label className="block mb-2 text-gray-600">Relevant Experience <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="education.relevantExperience"
                  value={formData.education.relevantExperience}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-600"
                  required
                />
              </div>
            </div>
          </section>

          {/* Personal Details */}
          <section className="border p-6 rounded-lg">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4 border-b pb-2">Personal Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block mb-2 text-gray-600">Date of Birth <span className="text-red-500">*</span></label>
                <input
                  type="date"
                  name="personal.dob"
                  value={formData.personal.dob}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-600"
                  required
                />
              </div>
              <div>
                <label className="block mb-2 text-gray-600">Age <span className="text-red-500">*</span></label>
                <input
                  type="number"
                  name="personal.age"
                  value={formData.personal.age}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-600"
                  required
                />
              </div>
              <div>
                <label className="block mb-2 text-gray-600">Gender <span className="text-red-500">*</span></label>
                <select
                  name="personal.gender"
                  value={formData.personal.gender}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-600"
                  required
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block mb-2 text-gray-600">Blood Group <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="personal.bloodGroup"
                  value={formData.personal.bloodGroup}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-600"
                  required
                />
              </div>
              <div>
                <label className="block mb-2 text-gray-600">Aadhar No <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="personal.aadharNo"
                  value={formData.personal.aadharNo}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-600"
                  required
                />
              </div>
            </div>
          </section>

          {/* Communication */}
          <section className="border p-6 rounded-lg">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4 border-b pb-2">Communication</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block mb-2 text-gray-600">Phone No <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="communication.phoneNo"
                  value={formData.communication.phoneNo}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-600"
                  required
                />
              </div>
              <div>
                <label className="block mb-2 text-gray-600">Alternate Phone No</label>
                <input
                  type="text"
                  name="communication.altPhoneNo"
                  value={formData.communication.altPhoneNo}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-600"
                />
              </div>
              <div>
                <label className="block mb-2 text-gray-600">Personal Email <span className="text-red-500">*</span></label>
                <input
                  type="email"
                  name="communication.personalEmail"
                  value={formData.communication.personalEmail}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-600"
                  required
                />
              </div>
              <div>
                <label className="block mb-2 text-gray-600">Work Email</label>
                <input
                  type="email"
                  name="communication.workEmail"
                  value={formData.communication.workEmail}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-600"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block mb-2 text-gray-600">Permanent Address <span className="text-red-500">*</span></label>
                <textarea
                  name="communication.permanentAddress"
                  value={formData.communication.permanentAddress}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-600"
                  required
                ></textarea>
              </div>
              <div className="md:col-span-2">
                <label className="block mb-2 text-gray-600">Correspondent Address</label>
                <textarea
                  name="communication.correspondentAddress"
                  value={formData.communication.correspondentAddress}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-600"
                ></textarea>
              </div>
            </div>
          </section>

          {/* Insurance & Bank */}
          <section className="border p-6 rounded-lg">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4 border-b pb-2">Insurance & Bank</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block mb-2 text-gray-600">GPAI No</label>
                <input
                  type="text"
                  name="insuranceAndBank.gpaiNo"
                  value={formData.insuranceAndBank.gpaiNo}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-600"
                />
              </div>
              <div>
                <label className="block mb-2 text-gray-600">Bank Name</label>
                <input
                  type="text"
                  name="insuranceAndBank.bankName"
                  value={formData.insuranceAndBank.bankName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-600"
                />
              </div>
              <div>
                <label className="block mb-2 text-gray-600">Bank Account No</label>
                <input
                  type="text"
                  name="insuranceAndBank.bankAccountNo"
                  value={formData.insuranceAndBank.bankAccountNo}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-600"
                />
              </div>
              <div>
                <label className="block mb-2 text-gray-600">IFSC</label>
                <input
                  type="text"
                  name="insuranceAndBank.ifsc"
                  value={formData.insuranceAndBank.ifsc}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-600"
                />
              </div>
              <div>
                <label className="block mb-2 text-gray-600">UAN</label>
                <input
                  type="text"
                  name="insuranceAndBank.uan"
                  value={formData.insuranceAndBank.uan}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-600"
                />
              </div>
              <div>
                <label className="block mb-2 text-gray-600">ESI No</label>
                <input
                  type="text"
                  name="insuranceAndBank.esiNo"
                  value={formData.insuranceAndBank.esiNo}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-600"
                />
              </div>
              <div>
                <label className="block mb-2 text-gray-600">Marital Status</label>
                <select
                  name="insuranceAndBank.maritalStatus"
                  value={formData.insuranceAndBank.maritalStatus}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-600"
                >
                  <option value="Single">Single</option>
                  <option value="Married">Married</option>
                  <option value="Divorced">Divorced</option>
                  <option value="Widowed">Widowed</option>
                </select>
              </div>
              <div>
                <label className="block mb-2 text-gray-600">Marriage Date</label>
                <input
                  type="date"
                  name="insuranceAndBank.marriageDate"
                  value={formData.insuranceAndBank.marriageDate}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-600"
                />
              </div>
            </div>
          </section>

          {/* Family */}
          <section className="border p-6 rounded-lg">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4 border-b pb-2">Family</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Mother */}
              <div>
                <label className="block mb-2 text-gray-600">Mother Name</label>
                <input
                  type="text"
                  name="mother.motherName"
                  value={formData.mother.motherName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-600"
                />
              </div>
              <div>
                <label className="block mb-2 text-gray-600">Mother Aadhar No</label>
                <input
                  type="text"
                  name="mother.motherAadharNo"
                  value={formData.mother.motherAadharNo}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-600"
                />
              </div>
              <div>
                <label className="block mb-2 text-gray-600">Mother DOB</label>
                <input
                  type="date"
                  name="mother.motherDOB"
                  value={formData.mother.motherDOB}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-600"
                />
              </div>
              {/* Father */}
              <div>
                <label className="block mb-2 text-gray-600">Father Name</label>
                <input
                  type="text"
                  name="father.fatherName"
                  value={formData.father.fatherName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-600"
                />
              </div>
              <div>
                <label className="block mb-2 text-gray-600">Father Aadhar No</label>
                <input
                  type="text"
                  name="father.fatherAadharNo"
                  value={formData.father.fatherAadharNo}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-600"
                />
              </div>
              <div>
                <label className="block mb-2 text-gray-600">Father DOB</label>
                <input
                  type="date"
                  name="father.fatherDOB"
                  value={formData.father.fatherDOB}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-600"
                />
              </div>
              {/* Spouse */}
              <div>
                <label className="block mb-2 text-gray-600">Spouse Name</label>
                <input
                  type="text"
                  name="spouse.spouseName"
                  value={formData.spouse.spouseName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-600"
                />
              </div>
              <div>
                <label className="block mb-2 text-gray-600">Spouse Aadhar No</label>
                <input
                  type="text"
                  name="spouse.spouseAadharNo"
                  value={formData.spouse.spouseAadharNo}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-600"
                />
              </div>
              <div>
                <label className="block mb-2 text-gray-600">Spouse DOB</label>
                <input
                  type="date"
                  name="spouse.spouseDOB"
                  value={formData.spouse.spouseDOB}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-600"
                />
              </div>
            </div>
          </section>

          {/* Children */}
          <section className="border p-6 rounded-lg">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4 border-b pb-2">Children</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block mb-2 text-gray-600">Child Name</label>
                <input
                  type="text"
                  name="childName"
                  value={child.childName}
                  onChange={handleChildChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-600"
                />
              </div>
              <div>
                <label className="block mb-2 text-gray-600">Child Aadhar No</label>
                <input
                  type="text"
                  name="childAadharNo"
                  value={child.childAadharNo}
                  onChange={handleChildChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-600"
                />
              </div>
              <div>
                <label className="block mb-2 text-gray-600">Child DOB</label>
                <input
                  type="date"
                  name="childDOB"
                  value={child.childDOB}
                  onChange={handleChildChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-600"
                />
              </div>
            </div>
            <button
              type="button"
              onClick={addChild}
              className="mt-4 bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-md"
            >
              Add Child
            </button>
            {children.length > 0 && (
              <div className="mt-4">
                <h3 className="text-lg font-semibold text-gray-700">Added Children:</h3>
                <ul className="list-disc pl-5 text-gray-600">
                  {children.map((child, index) => (
                    <li key={index}>
                      {child.childName} – {child.childAadharNo} – {child.childDOB}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>

          {/* Emergency Contact */}
          <section className="border p-6 rounded-lg">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4 border-b pb-2">
              Emergency Contact <span className="text-red-500">*</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block mb-2 text-gray-600">Name <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="emergencyContact.name"
                  value={formData.emergencyContact.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-600"
                  required
                />
              </div>
              <div>
                <label className="block mb-2 text-gray-600">Relationship <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="emergencyContact.relationship"
                  value={formData.emergencyContact.relationship}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-600"
                  required
                />
              </div>
              <div>
                <label className="block mb-2 text-gray-600">Phone <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="emergencyContact.phone"
                  value={formData.emergencyContact.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-600"
                  required
                />
              </div>
            </div>
          </section>

          {/* Submit Button */}
          <div className="text-center">
            <button
              type="submit"
              disabled={loading}
              className="mt-8 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition duration-200 shadow-md"
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
