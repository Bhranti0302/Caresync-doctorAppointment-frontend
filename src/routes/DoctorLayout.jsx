import Sidebar from "../components/layout/Sidebar";
import HomeVector from "../assets/icon/vector.png";
import DoctorVector from "../assets/icon/doctor-icon.png";
import EditDoctorIcon from "../assets/icon/edit-user.svg";
import { Outlet } from "react-router-dom";

function DoctorLayout() {
  const sidebarLinks = [
    { icon: HomeVector, label: "Dashboard", path: "/doctor" },
    { icon: DoctorVector, label: "User List", path: "/doctor/user-list" },
    {
      icon: EditDoctorIcon,
      label: "Edit Details",
      path: "/doctor/edit-details",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 min-h-screen border-t border-stone-200">
      {/* Sidebar */}
      <Sidebar links={sidebarLinks} />

      {/* Main Content */}
      <div className="col-span-3 lg:col-span-4 xl:col-span-5 p-6 bg-[#F8F9FD] border-l border-stone-200">
        <Outlet />
      </div>
    </div>
  );
}

export default DoctorLayout;
