import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../../redux/slices/authSlice";
import defaultImage from "../../../assets/default.png";

function AdminNavList() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // 1. Get logged-in user state from Redux
  const { loggedInUser } = useSelector((state) => state.auth);

  /**
   * 2. Profile Image Logic
   * Checks if image is a full URL or needs a base path prefix.
   * Consistent with your normalizeDoctor logic.
   */
  const getProfileImage = () => {
    if (!loggedInUser?.image) return defaultImage;
    
    if (typeof loggedInUser.image === "string") {
      return loggedInUser.image.startsWith("http")
        ? loggedInUser.image
        : `${import.meta.env.VITE_API_URL}/${loggedInUser.image}`;
    }
    
    return loggedInUser.image.url || defaultImage;
  };

  const profileImg = getProfileImage();

  // 3. Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /**
   * 4. Logout Logic
   * Note: Using 'logoutUser' as defined in your authSlice (synchronous).
   * It handles state clearing and localStorage removal.
   */
  const handleLogout = () => {
    dispatch(logoutUser());
    setDropdownOpen(false);
    navigate("/login");
  };

  return (
    <nav className="flex items-center justify-between w-full px-6 py-3 bg-white border-b border-stone-100 sticky top-0 z-[100]">
      {/* Brand / Logo */}
      <h1 
        className="text-2xl font-bold text-blue-600 cursor-pointer flex items-center" 
        onClick={() => navigate("/admin-dashboard")}
      >
        CareSync 
        <span className="text-[10px] font-bold text-blue-600 border border-blue-600 rounded px-1.5 ml-2 uppercase tracking-tighter">
          Admin
        </span>
      </h1>

      {/* User Actions / Dropdown */}
      <div className="relative" ref={dropdownRef}>
        <div
          className="flex items-center gap-3 cursor-pointer p-1.5 hover:bg-stone-50 rounded-full md:rounded-lg transition-all"
          onClick={() => setDropdownOpen(!dropdownOpen)}
        >
          {/* Admin Info (Desktop Only) */}
          <div className="text-right hidden md:block pl-2">
            <p className="text-sm font-bold text-stone-800 leading-none mb-1">
              {loggedInUser?.name || "Admin User"}
            </p>
            <p className="text-[11px] font-medium text-stone-400 uppercase tracking-widest">
              {loggedInUser?.role || "Administrator"}
            </p>
          </div>

          {/* Avatar */}
          <div className="relative">
            <img
              src={profileImg}
              alt="Admin Profile"
              className="w-10 h-10 md:w-11 md:h-11 rounded-full border-2 border-white shadow-sm ring-1 ring-stone-100 object-cover"
            />
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
          </div>
          
          <i className={`ri-arrow-down-s-line text-stone-400 transition-transform duration-300 hidden sm:block ${dropdownOpen ? 'rotate-180' : ''}`}></i>
        </div>

        {/* Dropdown Menu */}
        {dropdownOpen && (
          <div className="absolute top-16 right-0 bg-white shadow-2xl border border-stone-100 w-64 rounded-2xl overflow-hidden z-[110] animate-in fade-in slide-in-from-top-2 duration-200">
            {/* User Details Header (Dropdown) */}
            <div className="px-5 py-4 bg-stone-50/50 border-b border-stone-100">
              <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-1">Signed in as</p>
              <p className="text-sm font-bold text-stone-800 truncate">{loggedInUser?.email || "admin@caresync.com"}</p>
            </div>
            
            <div className="p-2">
              

              <button
                className="flex items-center gap-3 w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 rounded-xl transition-colors font-bold"
                onClick={handleLogout}
              >
                <i className="ri-logout-circle-r-line text-lg"></i>
                Sign Out
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default AdminNavList;