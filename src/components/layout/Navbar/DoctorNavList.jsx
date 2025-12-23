import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../../redux/slices/authSlice"; // Corrected from async to regular action
import defaultImage from "../../../assets/default.png";

function DoctorNavList() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Accessing the auth state for general user info 
  // and the doctor state for specific professional details
  const { loggedInUser } = useSelector((state) => state.auth);
  const { doctor } = useSelector((state) => state.doctor);

  // Profile image logic: prioritize specific doctor profile image, then auth user image, then default
  const profileImg = doctor?.image || loggedInUser?.image || defaultImage;

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    dispatch(logoutUser());
    setDropdownOpen(false);
    navigate("/login");
  };

  return (
    <nav className="flex items-center justify-between w-full px-5 py-3 bg-white border-b border-stone-100">
      <div 
        className="flex items-center gap-2 cursor-pointer"
        onClick={() => navigate("/doctor-dashboard")}
      >
        <h1 className="text-2xl font-bold text-blue-600">CareSync</h1>
        <span className="bg-blue-50 text-blue-600 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-tighter border border-blue-100">
          Doctor
        </span>
      </div>

      <div className="relative" ref={dropdownRef}>
        <div
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => setDropdownOpen(!dropdownOpen)}
        >
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-stone-800 leading-tight">
              {loggedInUser?.name || "Doctor"}
            </p>
            <p className="text-xs text-blue-500 font-medium">
              {doctor?.specialization || "Medical Professional"}
            </p>
          </div>
          
          <div className="relative">
            <img
              src={profileImg}
              alt="Doctor Profile"
              className="w-10 h-10 md:w-11 md:h-11 rounded-full border-2 border-stone-100 object-cover group-hover:border-blue-200 transition-all"
            />
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
          </div>
          <i className={`ri-arrow-down-s-line text-xl text-stone-400 transition-transform duration-300 ${dropdownOpen ? 'rotate-180' : ''}`}></i>
        </div>

        {dropdownOpen && (
          <div className="absolute top-14 right-0 bg-white shadow-2xl border border-stone-100 p-2 min-w-[200px] rounded-xl z-50">
            <div className="px-4 py-3 border-b border-stone-50 mb-1">
              <p className="text-xs text-stone-400 uppercase font-bold tracking-widest mb-1">Account</p>
              <p className="text-sm font-semibold text-stone-700 truncate">{loggedInUser?.email}</p>
            </div>

            <button
              className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 rounded-lg transition-all mt-1 font-medium"
              onClick={handleLogout}
            >
              <i className="ri-logout-circle-r-line"></i>
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

export default DoctorNavList;