import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import Layout from "../Components/Layout";
import { url } from "../Services/Service";

export default function NewEmployee() {
  const router = useRouter();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { id } = router.query;
  const [formData, setFormData] = useState({
    employeeID: "",
    employeeName: "",
    appointedPosition: "",
    department: "",
    manager: false,
    workplace: "",
    project: "",
    reportingEmployeeManagerID: "",
    referredBy: "",
    interviewDate: "",
    offeredDate: "",
    offerAcceptanceDate: "",
    onRollOffRoll: "On-Roll",
    appointmentLetterRefNo: "",
    dateOfJoining: "",
    status: "",
    education: [
      {
        highestEducation: "",
        yearOfPassing: "",
        relevantExperience: "",
      },
    ],
    personal: {
      dob: "",
      age: "",
      gender: "Male",
      bloodGroup: "",
      aadharNo: "",
    },
    communication: {
      phoneNo: "",
      altPhoneNo: "",
      personalEmail: "",
      workEmail: "",
      permanentAddress: "",
      correspondentAddress: "",
    },
    insuranceAndBank: {
      gpaiNo: "",
      bankName: "",
      bankAccountNo: "",
      ifsc: "",
      uan: "",
      esiNo: "",
      maritalStatus: "Single",
      marriageDate: "",
    },
    mother: {
      motherName: "",
      motherAadharNo: "",
      motherDOB: "",
    },
    father: {
      fatherName: "",
      fatherAadharNo: "",
      fatherDOB: "",
    },
    spouse: {
      spouseName: "",
      spouseAadharNo: "",
      spouseDOB: "",
    },
    children: [
      {
        childName: "",
        childAadharNo: "",
        childDOB: "",
      },
    ],
    emergencyContact: {
      name: "",
      relationship: "",
      phone: "",
    },
  });
  console.log("formData:", formData);

  useEffect(() => {
    if (id) {
      console.log("Fetching employee with ID:", id);
      getemployee(id);
    }
  }, [id]); // Only run when ID changes

  const getemployee = async (id) => {
    try {
      const response = await axios.get(`${url}/employees/${id}`);
      
      const employeeData = response.data;
  
      // Normalize children array to remove unnecessary metadata
      if (Array.isArray(employeeData.children)) {
        employeeData.children = employeeData.children.map((child) => ({
          childName: child._doc?.childName || child.childName || "",
          childAadharNo: child._doc?.childAadharNo || child.childAadharNo || "",
          childDOB: child._doc?.childDOB 
          ? new Intl.DateTimeFormat("en-GB").format(new Date(child._doc.childDOB)) 
          : child.childDOB || "",
        
        
        }));
      }
  
      setFormData(employeeData);
    } catch (error) {
      console.error("Error fetching employee data:", error);
    }
  };
  
  useEffect(() => {
    if (formData.education) {
      setEducationList(formData.education);
    }
    console.log("Updated Education List:", educationList); // Debugging line
  }, [formData]);
  useEffect(() => {
    if (formData.children) {
      setChildren(formData.children); // ✅ Correctly updating children state
    }
    console.log("Updated Children List:", children);
  }, [formData]); // Runs when formData updates

  // State for a new child entry before adding it to the children array
  const [child, setChild] = useState({
    childName: "",
    childAadharNo: "",
    childDOB: "",
  });
  const [education, setEducation] = useState({
    highestEducation: "",
    yearOfPassing: "",
    relevantExperience: "",
  });

  const [children, setChildren] = useState(formData.children || []);
  const [educationList, setEducationList] = useState(formData.education || []);
  console.log("educationList:", educationList);
  console.log("children:", children);

  const [editingIndex, setEditingIndex] = useState(null);
  // Generic change handler (supports one level of nested properties using dot notation)
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.includes(".")) {
      const [parent, childKey] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [childKey]: type === "checkbox" ? checked : value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setLoading(true);
  //   setError(null);
  //   // Merge the children into the main form data
  //   const dataToSubmit = {
  //     ...formData,
  //     children: children,
  //     education: education,
  //   };
  //   console.log("Data being submitted:", dataToSubmit);
  //   try {
  //     await axios.post(`${url}/employees`, dataToSubmit);
  //     setLoading(false);
  //     router.push("/"); // redirect as desired
  //   } catch (err) {
  //     setLoading(false);
  //     setError(
  //       err.response?.data?.message ||
  //         "Error submitting form. Please try again."
  //     );
  //     console.error("Submission error:", err.response?.data || err.message);
  //   }
  // };
  // console.log("API URL:", url);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Ensure educationList is not empty
    if (educationList.length === 0) {
      setError("Please add at least one education entry.");
      setLoading(false);
      return;
    }

    const dataToSubmit = {
      ...formData,
      children: children,
      education: educationList, // ✅ Send the correct list
    };

    console.log("Data being submitted:", dataToSubmit);

    try {
      await axios.put(`${url}/employees/${id}`, dataToSubmit);
      setLoading(false);
      router.push("/"); // Redirect as desired
    } catch (err) {
      setLoading(false);
      setError(
        err.response?.data?.message ||
          "Error submitting form. Please try again."
      );
      console.error("Submission error:", err.response?.data || err.message);
    }
  };

  const [editingChildIndex, setEditingChildIndex] = useState(null); // Track the editing child index

  const handleChildChange = (e) => {
    const { name, value } = e.target;
    setChild((prev) => ({ ...prev, [name]: value }));
  };

  const addChild = () => {
    if (editingChildIndex !== null) {
      // Update an existing child
      const updatedChildren = [...children];
      updatedChildren[editingChildIndex] = child;
      setChildren(updatedChildren);
      setEditingChildIndex(null);
    } else {
      if (children.length < 2) {
        setChildren([...children, child]);
      }
    }

    // Reset child state
    setChild({ childName: "", childAadharNo: "", childDOB: "" });
  };

  const editChild = (index) => {
    setChild(children[index]); // Load selected child data into form
    setEditingChildIndex(index); // Set index for editing mode
  };

  const [editingEducationIndex, setEditingEducationIndex] = useState(null); // Track the editing education index
  const [editEduIndex, setEditEduIndex] = useState(null);

  // const handleEducationChange = (e, index) => {
  //   const { name, value } = e.target;
  //   const updatedEducation = [...educationList];
  //   updatedEducation[index] = { ...updatedEducation[index], [name]: value };
  //   setEducationList(updatedEducation);
  // };
  const handleEducationChange = (e) => {
    const { name, value } = e.target;
    setEducation((prev) => ({ ...prev, [name]: value }));
  };
  
  
  const addEducation = () => {
    if (editEduIndex !== null) {
      setEducationList((prev) =>
        prev.map((item, index) =>
          index === editEduIndex ? education : item
        )
      );
      setEditEduIndex(null);
    } else {
      setEducationList((prev) => [...prev, education]);
    }
  
    setEducation({
      highestEducation: "",
      yearOfPassing: "",
      relevantExperience: "",
    });
  };
  

  const editEducation = (index) => {
    setEducation(educationList[index]);
    setEditEduIndex(index);
  };
  

  return (
    <Layout>
      <div className="max-w-4xl mx-auto bg-white p-6 md:p-8 rounded-xl shadow-lg">
        <h1 className="text-2xl md:text-3xl font-bold text-center mb-6 md:mb-8 text-gray-800">
          New Employee Registration
        </h1>
        {error && <p className="mb-4 text-red-500 text-center">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-6 md:space-y-10">
          {/* Basic Information */}
          <section className="border p-4 md:p-6 rounded-lg">
            <h2 className="text-xl md:text-2xl font-semibold text-gray-700 mb-3 md:mb-4 border-b pb-2">
              Basic Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {[
                { label: "Employee ID", name: "employeeID", required: true },
                {
                  label: "Employee Name",
                  name: "employeeName",
                  required: true,
                },
                {
                  label: "Position",
                  name: "appointedPosition",
                  required: true,
                },
                { label: "Department", name: "department", required: true },
                { label: "Workplace", name: "workplace", required: true },
                { label: "Project", name: "project" },
                {
                  label: "Reporting Manager Employee ID",
                  name: "reportingEmployeeManagerID",
                },
                { label: "Referred By", name: "referredBy" },
              ].map(({ label, name, required }) => (
                <div key={name}>
                  <label className="block mb-1 md:mb-2 text-gray-600">
                    {label}{" "}
                    {required && <span className="text-red-500">*</span>}
                  </label>
                  <input
                    type="text"
                    name={name}
                    value={formData[name]}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-600"
                    required={required}
                  />
                </div>
              ))}
              <div className="flex items-center space-x-2 md:space-x-3">
                <input
                  type="checkbox"
                  name="manager"
                  checked={formData.manager}
                  onChange={handleChange}
                  className="h-5 w-5"
                />
                <label className="text-gray-600 font-medium">Manager</label>
              </div>
            </div>
          </section>

          {/* Dates & Employment */}
          <section className="border p-4 md:p-6 rounded-lg">
            <h2 className="text-xl md:text-2xl font-semibold text-gray-700 mb-3 md:mb-4 border-b pb-2">
              Dates & Employment
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {[
                {
                  label: "Interview Date",
                  name: "interviewDate",
                  type: "date",
                },
                { label: "Offered Date", name: "offeredDate", type: "date" },
                {
                  label: "Offer Acceptance Date",
                  name: "offerAcceptanceDate",
                  type: "date",
                },
                {
                  label: "On-Roll/Off-Roll",
                  name: "onRollOffRoll",
                  type: "select",
                  options: ["On-Roll", "Off-Roll"],
                  required: true,
                },
                {
                  label: "Appointment Letter Ref No",
                  name: "appointmentLetterRefNo",
                },
                {
                  label: "Date of Joining",
                  name: "dateOfJoining",
                  type: "date",
                  required: true,
                },
                { label: "Status", name: "status" },
              ].map(({ label, name, type = "text", required, options }) => (
                <div key={name}>
                  <label className="block mb-1 md:mb-2 text-gray-600">
                    {label}{" "}
                    {required && <span className="text-red-500">*</span>}
                  </label>
                  {type === "select" ? (
                    <select
                      name={name}
                      value={formData[name]}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-600"
                      required={required}
                    >
                      {options.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={type}
                      name={name}
                      value={formData[name]}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-600"
                      required={required}
                    />
                  )}
                </div>
              ))}
            </div>
          </section>
          {/* Education Section */}
          <section className="border p-6 rounded-lg">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4 border-b pb-2">
              Education
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block mb-2 text-gray-600">
                  Highest Education
                </label>
                <input
                  type="text"
                  name="highestEducation"
                  value={education.highestEducation}
                  onChange={handleEducationChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-600"
                />
              </div>
              <div>
                <label className="block mb-2 text-gray-600">
                  Year of Passing
                </label>
                <input
                  type="number"
                  name="yearOfPassing"
                  value={education.yearOfPassing}
                  onChange={handleEducationChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-600"
                />
              </div>
              <div>
                <label className="block mb-2 text-gray-600">
                  Relevant Experience
                </label>
                <input
                  type="text"
                  name="relevantExperience"
                  value={education.relevantExperience}
                  onChange={handleEducationChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-600"
                />
              </div>
            </div>
            <button
              type="button"
              onClick={addEducation}
              disabled={educationList.length >= 2 && editEduIndex === null}
              className={`mt-4 px-5 py-2 rounded-md ${
                educationList.length >= 2 && editEduIndex === null
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700 text-white"
              }`}
            >
              {editEduIndex !== null ? "Update Education" : "Add Education"}
            </button>

            {educationList?.length > 0 && (
              <div className="mt-4">
                <h3 className="text-lg font-semibold text-gray-700">
                  Added Education:
                </h3>
                <ul className="list-disc pl-5 text-gray-600">
                  {educationList.map((edu, index) => (
                    <li key={edu._id || index} className="flex justify-between">
                      {edu.highestEducation || "N/A"} –{" "}
                      {edu.yearOfPassing || "N/A"} –{" "}
                      {edu.relevantExperience || "N/A"}
                      <button
                      type="button"
                        onClick={() => editEducation(index)}
                        className="ml-4 text-blue-600 underline"
                      >
                        Edit
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>

          {/* Personal Details */}
          <section className="border p-6 rounded-lg">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4 border-b pb-2">
              Personal Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block mb-2 text-gray-600">
                  Date of Birth <span className="text-red-500">*</span>
                </label>
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
                <label className="block mb-2 text-gray-600">
                  Age <span className="text-red-500">*</span>
                </label>
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
                <label className="block mb-2 text-gray-600">
                  Gender <span className="text-red-500">*</span>
                </label>
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
                <label className="block mb-2 text-gray-600">
                  Blood Group <span className="text-red-500">*</span>
                </label>
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
                <label className="block mb-2 text-gray-600">
                  Aadhar No <span className="text-red-500">*</span>
                </label>
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
            <h2 className="text-2xl font-semibold text-gray-700 mb-4 border-b pb-2">
              Communication
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block mb-2 text-gray-600">
                  Phone No <span className="text-red-500">*</span>
                </label>
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
                <label className="block mb-2 text-gray-600">
                  Alternate Phone No
                </label>
                <input
                  type="text"
                  name="communication.altPhoneNo"
                  value={formData.communication.altPhoneNo}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-600"
                />
              </div>
              <div>
                <label className="block mb-2 text-gray-600">
                  Personal Email <span className="text-red-500">*</span>
                </label>
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
                <label className="block mb-2 text-gray-600">
                  Permanent Address <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="communication.permanentAddress"
                  value={formData.communication.permanentAddress}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-600"
                  required
                ></textarea>
              </div>
              <div className="md:col-span-2">
                <label className="block mb-2 text-gray-600">
                  Correspondent Address
                </label>
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
            <h2 className="text-2xl font-semibold text-gray-700 mb-4 border-b pb-2">
              Insurance & Bank
            </h2>
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
                <label className="block mb-2 text-gray-600">
                  Bank Account No
                </label>
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
                <label className="block mb-2 text-gray-600">
                  Marital Status
                </label>
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
                <label className="block mb-2 text-gray-600">
                  Marriage Date
                </label>
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
            <h2 className="text-2xl font-semibold text-gray-700 mb-4 border-b pb-2">
              Family
            </h2>
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
                <label className="block mb-2 text-gray-600">
                  Mother Aadhar No
                </label>
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
                <label className="block mb-2 text-gray-600">
                  Father Aadhar No
                </label>
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
                <label className="block mb-2 text-gray-600">
                  Spouse Aadhar No
                </label>
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

          {/* Children Section */}
          <section className="border p-6 rounded-lg">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4 border-b pb-2">
              Children
            </h2>
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
                <label className="block mb-2 text-gray-600">
                  Child Aadhar No
                </label>
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
              disabled={children?.length >= 2 && editingChildIndex === null}
              className={`mt-4 px-5 py-2 rounded-md ${
                children?.length >= 2 && editingChildIndex === null
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700 text-white"
              }`}
            >
              {editingChildIndex !== null ? "Update Child" : "Add Child"}
            </button>

            {children.length > 0 && (
              <div className="mt-4">
                <h3 className="text-lg font-semibold text-gray-700">
                  Added Children:
                </h3>
                <ul className="list-disc pl-5 text-gray-600">
                  {children.map((child, index) => (
                    <li key={index} className="flex justify-between">
                      {child.childName || "No Name"} –{" "}
                      {child.childAadharNo || "No Aadhar"} –{" "}
                      {child.childDOB || "No DOB"}
                      <button
                      type="button"
                        onClick={() => editChild(index)}
                        className="ml-4 text-blue-600 underline"
                      >
                        Edit
                      </button>
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
                <label className="block mb-2 text-gray-600">
                  Name <span className="text-red-500">*</span>
                </label>
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
                <label className="block mb-2 text-gray-600">
                  Relationship <span className="text-red-500">*</span>
                </label>
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
                <label className="block mb-2 text-gray-600">
                  Phone <span className="text-red-500">*</span>
                </label>
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
              {loading ? "Updating..." : "Update"}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
