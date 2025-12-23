// src/pages/doctor/EditDoctorDetail.jsx

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import DefaultImage from "../../assets/default.png";
import {
  fetchDoctorByIdAsync,
  updateDoctorByMeAsync,
} from "../../redux/slices/doctorSlice";

function EditDoctorDetail({ onCancel }) {
  const dispatch = useDispatch();
  const { doctor, loading } = useSelector((state) => state.doctor);
  const { loggedInUser } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    name: "",
    speciality: "",
    email: "",
    degree: "",
    address1: "",
    address2: "",
    experience: "",
    fees: "",
    about: "",
    available: true,
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  /* -----------------------
        LOAD DOCTOR DATA
  -------------------------*/
  useEffect(() => {
    if (loggedInUser?._id) {
      dispatch(fetchDoctorByIdAsync(loggedInUser._id));
    }
  }, [dispatch, loggedInUser]);

  useEffect(() => {
    if (!doctor) return;

    setFormData({
      name: doctor.name || "",
      speciality: doctor.speciality || "",
      email: doctor.email || "",
      degree: doctor.degree || "",
      address1: doctor.address?.line1 || "",
      address2: doctor.address?.line2 || "",
      experience: doctor.experience || "",
      fees: doctor.fees || "",
      about: doctor.about || "",
      available: doctor.available ?? true,
    });

    const img =
      typeof doctor.image === "string"
        ? doctor.image
        : doctor.image?.url || null;

    setImagePreview(img);
  }, [doctor]);

  /* -----------------------
        CHANGE HANDLERS
  -------------------------*/
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  /* -----------------------
        SUBMIT UPDATE
  -------------------------*/
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!loggedInUser?._id) return;

    const form = new FormData();

    // Append fields
    Object.entries({
      name: formData.name,
      speciality: formData.speciality,
      email: formData.email,
      degree: formData.degree,
      experience: formData.experience,
      fees: formData.fees,
      about: formData.about,
      available: formData.available,
    }).forEach(([key, value]) => form.append(key, value));

    // FIX: Address should not be JSON string
    form.append("address[line1]", formData.address1);
    form.append("address[line2]", formData.address2);

    // Image
    if (imageFile) {
      form.append("image", imageFile);
    }

    dispatch(updateDoctorByMeAsync(form))
      .unwrap()
      .then(() => alert("Profile updated successfully!"))
      .catch((err) => alert(err || "Failed to update profile"));

    if (onCancel) onCancel();
  };

  if (loading || !doctor)
    return <p className="text-center mt-6">Loading doctor details...</p>;

  return (
    <div className="bg-white border border-stone-200 rounded-lg p-6 flex flex-col gap-6">
      <div className="flex gap-4 items-center">
        <img
          src={imagePreview || DefaultImage}
          alt="Doctor"
          className="w-36 h-36 object-cover rounded"
        />

        <label className="text-sm text-stone-700 cursor-pointer hover:underline">
          Change picture
          <input
            type="file"
            accept="image/*"
            hidden
            onChange={handleImageUpload}
          />
        </label>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        {[
          ["name", "Your Name"],
          ["speciality", "Speciality"],
          ["email", "Email"],
          ["degree", "Education"],
          ["experience", "Experience"],
          ["fees", "Fees"],
        ].map(([key, label]) => (
          <div key={key} className="flex flex-col gap-1">
            <label>{label}</label>
            <input
              name={key}
              type="text"
              value={formData[key]}
              onChange={handleChange}
              className="border border-stone-300 rounded-sm py-1 px-3"
            />
          </div>
        ))}

        {/* Address */}
        <div className="md:col-span-2 flex flex-col gap-1">
          <label>Address</label>
          <div className="flex gap-2">
            <input
              name="address1"
              placeholder="Address Line 1"
              value={formData.address1}
              onChange={handleChange}
              className="border border-stone-300 rounded-sm py-1 px-3 w-1/2"
            />
            <input
              name="address2"
              placeholder="Address Line 2"
              value={formData.address2}
              onChange={handleChange}
              className="border border-stone-300 rounded-sm py-1 px-3 w-1/2"
            />
          </div>
        </div>

        {/* Availability */}
        <div className="flex items-center gap-2 md:col-span-2">
          <input
            type="checkbox"
            name="available"
            checked={formData.available}
            onChange={handleChange}
            className="w-4 h-4"
          />
          <label>Available for Appointments</label>
        </div>

        {/* About */}
        <div className="flex flex-col gap-1 md:col-span-2">
          <label>About Me</label>
          <textarea
            name="about"
            value={formData.about}
            onChange={handleChange}
            className="border border-stone-300 rounded-sm py-2 px-3 min-h-24"
          />
        </div>

        {/* Buttons */}
        <div className="md:col-span-2 flex gap-3">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Update
          </button>

          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="border border-stone-400 px-4 py-2 rounded hover:bg-stone-100"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default EditDoctorDetail;
