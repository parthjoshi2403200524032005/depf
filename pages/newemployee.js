// pages/newemployee.js
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import Layout from "../Components/Layout";
import { url } from "../Services/Service";

export default function NewEmployee() {
  const router = useRouter();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [childList, setChildList] = useState([]);

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
  const [children, setChildren] = useState([]);
  const [educationList, setEducationList] = useState([]);
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
  console.log("API URL:", url);
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
      await axios.post(`${url}/employees`, dataToSubmit);
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

  const deleteChild = (index) => {
    setChildren(children.filter((_, i) => i !== index)); // Remove child
  };

  const [editingEducationIndex, setEditingEducationIndex] = useState(null); // Track the editing education index
  const [editEduIndex, setEditEduIndex] = useState(null);

  const handleEducationChange = (e) => {
    const { name, value } = e.target;
    setEducation((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const addEducation = () => {
    if (editEduIndex !== null) {
      setEducationList((prev) =>
        prev.map((item, index) =>
          index === editEduIndex ? { ...education } : item
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

  const deleteEducation = (index) => {
    setEducationList(educationList.filter((_, i) => i !== index)); // Remove education entry
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
          <section className="border p-6 rounded-lg mb-6">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4 border-b pb-2">
              Education
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <InputField
                label="Highest Education"
                type="text"
                name="highestEducation"
              />
              <InputField
                label="Year of Passing"
                type="number"
                name="yearOfPassing"
              />
              <InputField
                label="Relevant Experience"
                type="text"
                name="relevantExperience"
              />
            </div>
            <button
              type="button"
              className="mt-4 px-5 py-2 rounded-md bg-green-600 hover:bg-green-700 text-white"
            >
              Add Education
            </button>
          </section>

          {/* Personal Details */}
          <section className="border p-6 rounded-lg mb-6">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4 border-b pb-2">
              Personal Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <InputField
                label="Date of Birth"
                type="date"
                name="dob"
                required
              />
              <InputField label="Age" type="number" name="age" required />
              <SelectField
                label="Gender"
                name="gender"
                options={["Male", "Female", "Other"]}
                required
              />
              <InputField
                label="Blood Group"
                type="text"
                name="bloodGroup"
                required
              />
              <InputField
                label="Aadhar No"
                type="text"
                name="aadharNo"
                required
              />
            </div>
          </section>

          {/* Communication */}
          <section className="border p-6 rounded-lg">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4 border-b pb-2">
              Communication
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                label="Phone No"
                type="text"
                name="phoneNo"
                required
              />
              <InputField
                label="Alternate Phone No"
                type="text"
                name="altPhoneNo"
              />
              <InputField
                label="Personal Email"
                type="email"
                name="personalEmail"
                required
              />
              <InputField label="Work Email" type="email" name="workEmail" />
              <TextareaField
                label="Permanent Address"
                name="permanentAddress"
                required
              />
              <TextareaField
                label="Correspondent Address"
                name="correspondentAddress"
              />
            </div>
          </section>

          {/* Insurance & Bank */}
          <section className="border p-6 rounded-lg shadow-sm bg-white">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4 border-b pb-2">
              Insurance & Bank
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { label: "GPAI No", name: "gpaiNo" },
                { label: "Bank Name", name: "bankName" },
                { label: "Bank Account No", name: "bankAccountNo" },
                { label: "IFSC", name: "ifsc" },
                { label: "UAN", name: "uan" },
                { label: "ESI No", name: "esiNo" },
              ].map((field) => (
                <div key={field.name}>
                  <label className="block mb-2 text-gray-600">
                    {field.label}
                  </label>
                  <input
                    type="text"
                    name={`insuranceAndBank.${field.name}`}
                    value={formData.insuranceAndBank[field.name] || ""}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 text-gray-700"
                  />
                </div>
              ))}
              <div>
                <label className="block mb-2 text-gray-600">
                  Marital Status
                </label>
                <select
                  name="insuranceAndBank.maritalStatus"
                  value={formData.insuranceAndBank.maritalStatus || ""}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 text-gray-700"
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
                  value={formData.insuranceAndBank.marriageDate || ""}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 text-gray-700"
                />
              </div>
            </div>
          </section>

          {/* Family */}
          <section className="border p-6 rounded-lg shadow-sm bg-white">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4 border-b pb-2">
              Family
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  category: "mother",
                  label: "Mother Name",
                  name: "motherName",
                },
                {
                  category: "mother",
                  label: "Mother Aadhar No",
                  name: "motherAadharNo",
                },
                {
                  category: "mother",
                  label: "Mother DOB",
                  name: "motherDOB",
                  type: "date",
                },
                {
                  category: "father",
                  label: "Father Name",
                  name: "fatherName",
                },
                {
                  category: "father",
                  label: "Father Aadhar No",
                  name: "fatherAadharNo",
                },
                {
                  category: "father",
                  label: "Father DOB",
                  name: "fatherDOB",
                  type: "date",
                },
                {
                  category: "spouse",
                  label: "Spouse Name",
                  name: "spouseName",
                },
                {
                  category: "spouse",
                  label: "Spouse Aadhar No",
                  name: "spouseAadharNo",
                },
                {
                  category: "spouse",
                  label: "Spouse DOB",
                  name: "spouseDOB",
                  type: "date",
                },
              ].map((field) => (
                <div key={field.name}>
                  <label className="block mb-2 text-gray-600">
                    {field.label}
                  </label>
                  <input
                    type={field.type || "text"}
                    name={`${field.category}.${field.name}`}
                    value={formData[field.category][field.name] || ""}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 text-gray-700"
                  />
                </div>
              ))}
            </div>
          </section>

            {/* Children Section */}
          <section className="border p-6 rounded-lg">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4 border-b pb-2">
              Children
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Child Name
                </label>
                <input
                  type="text"
                  name="childName"
                  value={child.childName}
                  onChange={handleChildChange}
                  className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-400 text-gray-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Child Aadhar No
                </label>
                <input
                  type="text"
                  name="childAadharNo"
                  value={child.childAadharNo}
                  onChange={handleChildChange}
                  className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-400 text-gray-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Child DOB
                </label>
                <input
                  type="date"
                  name="childDOB"
                  value={child.childDOB}
                  onChange={handleChildChange}
                  className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-400 text-gray-600"
                />
              </div>
            </div>
            <button
              type="button"
              onClick={addChild}
              disabled={children?.length >= 2 && editingChildIndex === null}
              className={`mt-4 px-5 py-2 rounded-md transition ${
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
                <ul className="list-disc pl-5 text-gray-600 space-y-2">
                  {children.map((child, index) => (
                    <li
                      key={index}
                      className="flex justify-between items-center"
                    >
                      <span>
                        {child.childName} – {child.childAadharNo} –{" "}
                        {child.childDOB}
                      </span>
                      <button
                        onClick={() => editChild(index)}
                        className="ml-4 text-blue-600 hover:underline"
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
          <section className="border p-6 rounded-lg mt-6">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4 border-b pb-2">
              Emergency Contact <span className="text-red-500">*</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="emergencyContact.name"
                  value={formData.emergencyContact.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-400"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Relationship <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="emergencyContact.relationship"
                  value={formData.emergencyContact.relationship}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-400"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Phone <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="emergencyContact.phone"
                  value={formData.emergencyContact.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-400"
                  required
                />
              </div>
            </div>
          </section>

          {/* Submit Button */}
          <div className="flex justify-center mt-8">
            <button
              type="submit"
              disabled={loading}
              className={`w-full sm:w-auto px-6 sm:px-8 py-3 rounded-lg font-semibold transition duration-200 shadow-md text-white ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}

const InputField = ({ label, type, name, required }) => (
  <div>
    <label className="block mb-2 text-gray-600">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      name={name}
      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-600"
      required={required}
    />
  </div>
);

const SelectField = ({ label, name, options, required }) => (
  <div>
    <label className="block mb-2 text-gray-600">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <select
      name={name}
      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-600"
      required={required}
    >
      {options.map((option, index) => (
        <option key={index} value={option}>
          {option}
        </option>
      ))}
    </select>
  </div>
);

const TextareaField = ({ label, name, required }) => (
  <div className="md:col-span-2">
    <label className="block mb-2 text-gray-600">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <textarea
      name={name}
      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-600"
      required={required}
    ></textarea>
  </div>
);
