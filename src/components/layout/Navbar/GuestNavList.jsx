import { NavLink, useNavigate } from "react-router-dom";

function GuestNavList() {
  const navigate = useNavigate();

  return (
    <nav className="flex items-center justify-between w-full px-6 py-4 bg-white shadow-sm">
      {/* Brand Logo - Clicking it takes user to Landing Page */}
      <h1 
        className="text-2xl font-bold text-blue-600 cursor-pointer flex items-center gap-2"
        onClick={() => navigate("/")}
      >
        <i className="ri-heart-pulse-fill"></i>
        CareSync
      </h1>

      <div className="flex items-center gap-4">
        {/* Login - Outline Style */}
        <NavLink
          to="/login"
          className={({ isActive }) => 
            `hidden sm:block px-6 py-2 rounded-full font-medium transition-all border border-blue-600 ${
              isActive 
              ? "bg-blue-50 text-blue-700" 
              : "text-blue-600 hover:bg-blue-50"
            }`
          }
        >
          Login
        </NavLink>

        {/* Sign Up - Solid Style (Primary Call to Action) */}
        <NavLink
          to="/signup"
          className={({ isActive }) => 
            `px-6 py-2 rounded-full font-medium transition-all shadow-md hover:shadow-lg active:scale-95 ${
              isActive 
              ? "bg-blue-800 text-white" 
              : "bg-blue-600 text-white hover:bg-blue-700"
            }`
          }
        >
          Create Account
        </NavLink>
      </div>
    </nav>
  );
}

export default GuestNavList;