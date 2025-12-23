// src/pages/user/MyProfile.jsx
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchMyProfileAsync,
  updateMyProfileAsync,
  deleteMyAccountAsync,
} from "../../redux/slices/userSlice";
import { setLoggedInUser } from "../../redux/slices/authSlice";
import DefaultImage from "../../assets/default.png";
import EditForm from "../../components/edit/EditForm";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function MyProfile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loggedInUser } = useSelector((state) => state.auth);
  const { myProfile, loading } = useSelector((state) => state.user);

  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    age: "",
    gender: "Male",
    address: "",
    phone: "",
    image: DefaultImage,
    file: null,
  });

  // FETCH USER PROFILE
  useEffect(() => {
    dispatch(fetchMyProfileAsync());
  }, [dispatch]);

  // LOAD USER DATA INTO FORM
  useEffect(() => {
    const user = myProfile || loggedInUser;
    if (!user) return;

    // Parse address
    let addressText = "";
    if (user.address) {
      if (typeof user.address === "object") {
        addressText =
          user.address.line1 && user.address.line2
            ? `${user.address.line1} ${user.address.line2}`.trim()
            : user.address.text || "";
      } else {
        addressText = user.address;
      }
    }

    // Image resolver
    let finalImage = DefaultImage;

    if (user.image && typeof user.image === "object" && user.image.url) {
      finalImage = user.image.url;
    } else if (typeof user.image === "string") {
      finalImage = user.image.startsWith("http")
        ? user.image
        : `${import.meta.env.VITE_API_URL}/${user.image}`;
    } else if (user.profilePic) {
      finalImage = user.profilePic.startsWith("http")
        ? user.profilePic
        : `${import.meta.env.VITE_API_URL}/${user.profilePic}`;
    }

    setFormData({
      name: user.name || "",
      email: user.email || "",
      age: user.age ?? "",
      gender: user.gender || "Male",
      phone: user.phone || "",
      address: addressText,
      image: finalImage,
      file: null,
    });
  }, [myProfile, loggedInUser]);

  // IMAGE PREVIEW
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file)
      setFormData((prev) => ({
        ...prev,
        file,
        image: URL.createObjectURL(file),
      }));
  };

  // SAVE UPDATED PROFILE
  const handleSave = async () => {
    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("email", formData.email);
      data.append("age", formData.age);
      data.append("gender", formData.gender);
      data.append("phone", formData.phone);
      data.append("address", formData.address);

      if (formData.file) data.append("image", formData.file);

      const updatedUser = await dispatch(updateMyProfileAsync(data)).unwrap();

      dispatch(setLoggedInUser(updatedUser));
      localStorage.setItem("loggedInUser", JSON.stringify(updatedUser));

      setIsEditing(false);
      toast.success("Profile updated successfully!");
    } catch (err) {
      toast.error("Update failed: " + err);
    }
  };

  // DELETE ACCOUNT — FIXED ✔✔✔
  const handleDelete = async () => {
    if (
      !window.confirm(
        "Are you sure? This will permanently delete your account."
      )
    )
      return;

    try {
      await dispatch(deleteMyAccountAsync()).unwrap();

      // FIX: Clear Redux state
      dispatch(setLoggedInUser(null));

      // FIX: remove localStorage
      localStorage.removeItem("loggedInUser");

      toast.success("Your account has been deleted.");
      navigate("/login", { replace: true });
    } catch {
      toast.error("Delete failed");
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-[300px]">
        <p className="text-gray-500">Loading profile...</p>
      </div>
    );

  return (
    <div className="m-4 sm:m-6 md:m-10">
      {isEditing ? (
        <>
          <div className="flex flex-col sm:flex-row gap-6 items-center mb-6">
            <div className="relative w-36 h-36 sm:w-48 sm:h-48">
              <img
                src={formData.image}
                alt="Profile"
                className="w-full h-full object-cover rounded-full border-4 border-gray-200 shadow-md"
              />
              <label
                htmlFor="profileUpload"
                className="absolute bottom-2 right-2 bg-white p-2 rounded-full shadow cursor-pointer hover:bg-gray-100"
              >
                <i className="ri-pencil-line text-lg"></i>
              </label>
              <input
                id="profileUpload"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>
          </div>

          <EditForm
            formData={formData}
            setFormData={setFormData}
            onSave={handleSave}
            onCancel={() => setIsEditing(false)}
          />
        </>
      ) : (
        <>
          <div className="flex flex-col sm:flex-row items-center gap-6 border-b pb-4">
            <div className="relative w-36 h-36 sm:w-48 sm:h-48">
              <img
                src={formData.image}
                alt="Profile"
                className="w-full h-full object-cover rounded-full border-4 border-gray-200 shadow-md"
              />
              <div
                onClick={() => setIsEditing(true)}
                className="absolute bottom-2 right-2 bg-white p-2 rounded-full shadow cursor-pointer hover:bg-gray-100"
              >
                <i className="ri-pencil-line text-lg"></i>
              </div>
            </div>
            <h2 className="text-3xl font-semibold">{formData.name}</h2>
          </div>

          <div className="flex flex-col gap-8 mt-6">
            <div>
              <h5 className="text-lg uppercase underline text-stone-600 mb-2">
                Contact Information
              </h5>
              <p>Email: {formData.email}</p>
              <p>Phone: {formData.phone || "N/A"}</p>
              <p>Address: {formData.address || "N/A"}</p>
            </div>

            <div>
              <h5 className="text-lg uppercase underline text-stone-600 mb-2">
                Basic Information
              </h5>
              <p>Gender: {formData.gender}</p>
              <p>Age: {formData.age}</p>
            </div>

            <div className="flex gap-3 mt-4">
              <button
                onClick={() => setIsEditing(true)}
                className="border border-blue-500 px-8 py-3 rounded-full hover:bg-blue-500 hover:text-white transition"
              >
                Edit
              </button>
              <button
                onClick={handleDelete}
                className="border border-red-500 px-8 py-3 rounded-full hover:bg-red-500 hover:text-white transition"
              >
                Delete Account
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default MyProfile;
