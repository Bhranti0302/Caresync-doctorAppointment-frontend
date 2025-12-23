import { useState, useRef, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../../redux/slices/authSlice";
import Logo from "./Logo";

function UserNavList() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loggedInUser } = useSelector((state) => state.auth);
  const { myProfile } = useSelector((state) => state.user);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Build valid image URL
  const getUserImage = () => {
    const rawImage = myProfile?.image || loggedInUser?.image;

    if (!rawImage)
      return "https://cdn-icons-png.flaticon.com/512/9131/9131529.png";

    if (typeof rawImage === "string") {
      return rawImage.startsWith("http")
        ? rawImage
        : `${import.meta.env.VITE_API_URL}/${rawImage}`;
    }

    return (
      rawImage.url || "https://cdn-icons-png.flaticon.com/512/9131/9131529.png"
    );
  };

  const userImage = getUserImage();

  const handleLogout = () => {
    dispatch(logoutUser());
    setDropdownOpen(false);
    setMenuOpen(false);
    navigate("/");
  };

  const links = [
    { name: "Home", path: "/" },
    { name: "All Doctors", path: "/doctors" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  const activeLinkStyle =
    "relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-full after:h-[3px] after:bg-blue-600 text-blue-600";

  return (
    <nav className="flex items-center justify-between w-full px-6 py-4 bg-white shadow-sm">
      {/* Logo */}
      <Logo />

      {/* Center Navigation */}
      <div className="hidden md:flex flex-1 justify-center">
        <ul className="flex gap-10">
          {links.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `text-base font-medium hover:text-blue-600 transition ${
                    isActive ? activeLinkStyle : "text-stone-600"
                  }`
                }
              >
                {item.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>

      {/* Mobile Menu Button */}
      <button
        className="md:hidden text-3xl text-stone-700"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <i className={menuOpen ? "ri-close-line" : "ri-menu-line"}></i>
      </button>

      {/* Right Profile Section */}
      <div className="relative ml-4" ref={dropdownRef}>
        <div
          className="flex items-center gap-2 p-1 rounded-full hover:bg-stone-50 cursor-pointer transition"
          onClick={() => setDropdownOpen(!dropdownOpen)}
        >
          <img
            src={userImage}
            alt="Profile"
            className="w-10 h-10 rounded-full shadow-sm object-cover"
          />
          <i
            className={`ri-arrow-down-s-line text-lg text-stone-500 transition ${
              dropdownOpen ? "rotate-180" : ""
            }`}
          ></i>
        </div>

        {/* Dropdown */}
        {dropdownOpen && (
          <div className="absolute top-14 right-0 bg-white shadow-xl rounded-2xl min-w-[220px] py-2 z-50 animate-in fade-in slide-in-from-top-1 duration-200">
            <div className="px-4 py-3 mb-1">
              <p className="text-[11px] text-stone-400 uppercase tracking-wider">
                Signed in as
              </p>
              <p className="text-sm font-semibold text-stone-700 truncate">
                {loggedInUser?.email}
              </p>
            </div>

            <NavLink
              to="/my-profile"
              className="flex items-center gap-3 px-4 py-2 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition"
              onClick={() => setDropdownOpen(false)}
            >
              <i className="ri-user-settings-line text-lg"></i>
              Manage Profile
            </NavLink>

            <NavLink
              to="/my-appointments"
              className="flex items-center gap-3 px-4 py-2 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition"
              onClick={() => setDropdownOpen(false)}
            >
              <i className="ri-calendar-todo-line text-lg"></i>
              My Appointments
            </NavLink>

            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-4 py-2 text-red-500 hover:bg-red-50 rounded-xl transition font-semibold"
            >
              <i className="ri-logout-circle-r-line text-lg"></i>
              Sign Out
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

export default UserNavList;
