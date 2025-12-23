import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Table from "../../components/common/Table";
import DefaultImage from "../../assets/default.png";
import {
  fetchDoctorsAsync,
  deleteDoctorAsync,
  updateDoctorAsync,
} from "../../redux/slices/doctorSlice";
import { getImageUrl } from "../../utils/helper";

function AdminDoctorList() {
  const dispatch = useDispatch();
  const { doctors = [], loading } = useSelector((state) => state.doctor);

  const [isEditing, setIsEditing] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    speciality: "",
    email: "",
    degree: "",
    experience: "",
    about: "",
    fees: "",
    address1: "",
    address2: "",
    image: null,
    available: false,
  });
  const [previewSrc, setPreviewSrc] = useState("");

  useEffect(() => {
    dispatch(fetchDoctorsAsync());
  }, [dispatch]);

  useEffect(() => {
    if (isEditing) document.body.classList.add("overflow-hidden");
    else {
      document.body.classList.remove("overflow-hidden");
      setPreviewSrc("");
    }
    return () => document.body.classList.remove("overflow-hidden");
  }, [isEditing]);

  const handleEdit = (doctor) => {
    setSelectedDoctor(doctor);
    setFormData({
      name: doctor.name || "",
      speciality: doctor.speciality || "",
      email: doctor.email || "",
      degree: doctor.degree || "",
      experience: doctor.experience || "",
      about: doctor.about || "",
      fees: doctor.fees || "",
      address1: doctor.address?.line1 || "",
      address2: doctor.address?.line2 || "",
      image: null,
      available: !!doctor.available,
    });
    setPreviewSrc(doctor.image ? getImageUrl(doctor.image) : DefaultImage);
    setIsEditing(true);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0] || null;
    setFormData((prev) => ({ ...prev, image: file }));
    setPreviewSrc(
      file
        ? URL.createObjectURL(file)
        : selectedDoctor?.image
        ? getImageUrl(selectedDoctor.image)
        : DefaultImage
    );
  };

  const handleSave = async () => {
    if (!selectedDoctor) return;
    const data = new FormData();

    Object.entries(formData).forEach(([key, val]) => {
      if (key === "image" && !val) return;
      if (key === "address1") data.append("address[line1]", val);
      else if (key === "address2") data.append("address[line2]", val);
      else data.append(key, val);
    });

    await dispatch(updateDoctorAsync({ id: selectedDoctor._id, data }));
    setIsEditing(false);
    setSelectedDoctor(null);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this doctor?")) {
      dispatch(deleteDoctorAsync(id));
    }
  };

  const handleAvailabilityToggle = (doctor) => {
    const data = new FormData();
    data.append("available", !doctor.available);
    dispatch(updateDoctorAsync({ id: doctor._id, data }));
  };

  const columns = [
    { key: "index", label: "#" },
    { key: "name", label: "Doctor" },
    { key: "speciality", label: "Speciality" },
    { key: "email", label: "Email" },
    { key: "experience", label: "Experience (yrs)" },
    { key: "fees", label: "Fees" },
    { key: "available", label: "Available" },
    { key: "actions", label: "Actions" },
  ];

  if (loading) return <p className="text-center mt-20">Loading...</p>;

  return (
    <div className="p-4 relative">
      <h5 className="text-xl font-semibold mb-6">Doctors List</h5>
      <div className="overflow-x-auto">
        <Table
          className="min-w-[1000px]"
          columns={columns}
          data={doctors.map((doc, i) => ({ ...doc, index: i + 1 }))}
          renderCell={(col, row) => {
            if (col.key === "index") return row.index;
            if (col.key === "name") {
              const imageUrl = row.image
                ? getImageUrl(row.image)
                : DefaultImage;
              return (
                <div className="flex items-center gap-2">
                  <img
                    src={imageUrl}
                    alt={row.name}
                    className="w-10 h-10 rounded-full object-cover border-stone-500"
                  />
                  <span>{row.name}</span>
                </div>
              );
            }
            if (col.key === "available") {
              return (
                <input
                  type="checkbox"
                  checked={row.available || false}
                  onChange={() => handleAvailabilityToggle(row)}
                  className="w-5 h-5 accent-blue-500 cursor-pointer"
                />
              );
            }
            if (col.key === "actions") {
              return (
                <div className="flex gap-2 justify-center">
                  <button
                    onClick={() => handleEdit(row)}
                    className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(row._id)}
                    className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              );
            }
            return row[col.key];
          }}
        />
      </div>

      {/* EDIT MODAL */}
      {isEditing && (
        <div
          className="fixed inset-0 z-50 flex items-start sm:items-center justify-center pt-20 sm:pt-0"
          aria-modal="true"
          role="dialog"
        >
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity"></div>
          <div className="relative bg-white rounded-2xl shadow-xl p-6 w-[95%] sm:w-[700px] max-h-[90vh] overflow-y-auto z-10">
            <h3 className="text-2xl font-semibold mb-6 text-center">
              Edit Doctor
            </h3>

            {/* Image & Availability */}
            <div className="flex flex-col sm:flex-row items-center gap-6 mb-6">
              <div className="w-36 h-36 rounded-full overflow-hidden border border-stone-200">
                <img
                  src={previewSrc || DefaultImage}
                  alt="preview"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col gap-3 w-full">
                <label className="block text-sm font-medium">
                  Upload Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="bg-blue-400 text-white px-3 py-2 rounded-md max-w-[250px]"
                />
                <div className="flex items-center gap-2 mt-2">
                  <input
                    id="available_chk"
                    type="checkbox"
                    name="available"
                    checked={formData.available}
                    onChange={handleChange}
                    className="w-5 h-5 accent-blue-500"
                  />
                  <label
                    htmlFor="available_chk"
                    className="text-sm font-medium"
                  >
                    Available
                  </label>
                </div>
              </div>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { key: "name", label: "Name" },
                { key: "speciality", label: "Speciality" },
                { key: "email", label: "Email" },
                { key: "degree", label: "Degree" },
                { key: "experience", label: "Experience (yrs)" },
                { key: "fees", label: "Fees" },
              ].map(({ key, label }) => (
                <div key={key} className="flex flex-col">
                  <label className="text-sm font-medium mb-1">{label}</label>
                  <input
                    type="text"
                    name={key}
                    value={formData[key] || ""}
                    onChange={handleChange}
                    className="border border-stone-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              ))}

              {/* About spans 2 columns */}
              <div className="flex flex-col sm:col-span-2">
                <label className="text-sm font-medium mb-1">About</label>
                <textarea
                  name="about"
                  value={formData.about}
                  onChange={handleChange}
                  rows={4}
                  className="border border-stone-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-sm font-medium mb-1">
                  Address Line 1
                </label>
                <input
                  name="address1"
                  value={formData.address1}
                  onChange={handleChange}
                  className="border border-stone-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-sm font-medium mb-1">
                  Address Line 2
                </label>
                <input
                  name="address2"
                  value={formData.address2}
                  onChange={handleChange}
                  className="border border-stone-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => {
                  setIsEditing(false);
                  setSelectedDoctor(null);
                }}
                className="px-4 py-2 rounded bg-gray-400 text-white hover:bg-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDoctorList;
