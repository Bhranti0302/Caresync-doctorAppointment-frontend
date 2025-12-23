import { useState } from "react";
import DefaultImage from "../../assets/default.png";
import { useDispatch, useSelector } from "react-redux";
import {
  addDoctorAsync,
  clearDoctorError,
} from "../../redux/slices/doctorSlice";

function AdminAddDoctor() {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.doctor);

  const [formData, setFormData] = useState({
    name: "",
    speciality: "",
    email: "",
    education: "",
    password: "",
    address1: "",
    address2: "",
    experience: "",
    fees: "",
    about: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!imageFile) return alert("Please upload doctor image first");

    const data = new FormData();
    data.append("name", formData.name);
    data.append("speciality", formData.speciality);
    data.append("email", formData.email);
    data.append("password", formData.password);
    data.append("degree", formData.education);
    data.append("experience", formData.experience);
    data.append("fees", formData.fees);
    data.append("about", formData.about);
    data.append("role", "doctor");
    data.append("available", true);
    data.append("image", imageFile);
    data.append("address[line1]", formData.address1);
    data.append("address[line2]", formData.address2);

    const resultAction = await dispatch(addDoctorAsync(data));

    if (addDoctorAsync.fulfilled.match(resultAction)) {
      // Reset form
      setFormData({
        name: "",
        speciality: "",
        email: "",
        education: "",
        password: "",
        address1: "",
        address2: "",
        experience: "",
        fees: "",
        about: "",
      });
      setImageFile(null);
      setImagePreview(null);
      dispatch(clearDoctorError());
    }
  };

  return (
    <div className="bg-white border border-stone-200 rounded-lg p-6 flex flex-col gap-6">
      {/* Upload Section */}
      <div className="flex gap-4 items-center">
        <img
          src={imagePreview || DefaultImage}
          alt="Doctor"
          className="w-36 h-36 object-cover rounded"
        />
        <label className="text-sm text-stone-700 cursor-pointer hover:underline">
          Upload doctor picture
          <input
            type="file"
            accept="image/*"
            hidden
            onChange={handleImageChange}
          />
        </label>
      </div>

      {/* Error */}
      {error && <p className="text-red-600">{error}</p>}

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        {/* Name */}
        <div className="flex flex-col gap-1">
          <label>Doctor Name</label>
          <input
            name="name"
            type="text"
            required
            value={formData.name}
            onChange={handleChange}
            className="border border-stone-300 rounded-sm py-1 px-3"
          />
        </div>

        {/* Speciality */}
        <div className="flex flex-col gap-1">
          <label>Speciality</label>
          <select
            name="speciality"
            required
            value={formData.speciality}
            onChange={handleChange}
            className="border border-stone-300 rounded-sm py-1 px-3"
          >
            <option value="">--Select--</option>
            <option>General Physician</option>
            <option>Neurologist</option>
            <option>Gynecologist</option>
            <option>Pediatricians</option>
            <option>Gastroenterologist</option>
            <option>Dermatologist</option>
          </select>
        </div>

        {/* Email */}
        <div className="flex flex-col gap-1">
          <label>Email</label>
          <input
            name="email"
            type="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="border border-stone-300 rounded-sm py-1 px-3"
          />
        </div>

        {/* Education */}
        <div className="flex flex-col gap-1">
          <label>Education</label>
          <input
            name="education"
            type="text"
            required
            value={formData.education}
            onChange={handleChange}
            className="border border-stone-300 rounded-sm py-1 px-3"
          />
        </div>

        {/* Password */}
        <div className="flex flex-col gap-1">
          <label>Password</label>
          <input
            name="password"
            type="password"
            required
            value={formData.password}
            onChange={handleChange}
            className="border border-stone-300 rounded-sm py-1 px-3"
          />
        </div>

        {/* Address */}
        <div className="flex flex-col gap-1">
          <label>Address</label>
          <input
            name="address1"
            type="text"
            required
            placeholder="Street"
            value={formData.address1}
            onChange={handleChange}
            className="border border-stone-300 rounded-sm py-1 px-3"
          />
          <input
            name="address2"
            type="text"
            placeholder="City, State"
            value={formData.address2}
            onChange={handleChange}
            className="border border-stone-300 rounded-sm py-1 px-3"
          />
        </div>

        {/* Experience */}
        <div className="flex flex-col gap-1">
          <label>Experience</label>
          <input
            name="experience"
            type="text"
            required
            value={formData.experience}
            onChange={handleChange}
            className="border border-stone-300 rounded-sm py-1 px-3"
          />
        </div>

        {/* Fees */}
        <div className="flex flex-col gap-1">
          <label>Fees</label>
          <input
            name="fees"
            type="text"
            required
            value={formData.fees}
            onChange={handleChange}
            className="border border-stone-300 rounded-sm py-1 px-3"
          />
        </div>

        {/* About */}
        <div className="flex flex-col gap-1 md:col-span-2">
          <label>About Me</label>
          <textarea
            name="about"
            required
            value={formData.about}
            onChange={handleChange}
            className="border border-stone-300 rounded-sm py-2 px-3 min-h-24"
          />
        </div>

        {/* Submit */}
        <div className="md:col-span-2">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-max"
          >
            {loading ? "Adding..." : "Add Doctor"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AdminAddDoctor;
