import { NavLink } from "react-router-dom";

function Sidebar({ links }) {
  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:flex flex-col gap-4 py-4 items-center w-56 bg-white min-h-screen">
        {links.map((link) => (
          <NavLink
            key={link.label}
            to={link.path}
            end
            className={({ isActive }) =>
              `flex items-center gap-3 px-10 py-3 rounded hover:bg-blue-50 hover:border-r-4 hover:border-blue-500 transition ${
                isActive
                  ? "bg-blue-50 border-r-4 border-blue-500"
                  : "bg-white border-none"
              }`
            }
          >
            <img src={link.icon} alt={link.label} className="w-6 h-6" />
            <span className="font-medium">{link.label}</span>
          </NavLink>
        ))}
      </div>

      {/* Mobile Bottom Navbar */}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t border-stone-200 flex justify-around md:hidden py-2 shadow-lg z-50">
        {links.map((link) => (
          <NavLink
            key={link.label}
            to={link.path}
            end
            className={({ isActive }) =>
              `flex flex-col items-center justify-center transition ${
                isActive ? "text-blue-500" : "text-stone-600"
              }`
            }
          >
            <img src={link.icon} alt={link.label} className="w-6 h-6" />
          </NavLink>
        ))}
      </div>
    </>
  );
}

export default Sidebar;
