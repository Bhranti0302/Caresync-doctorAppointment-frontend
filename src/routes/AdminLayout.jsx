import Sidebar from "../components/layout/Sidebar";
import HomeVector from "../assets/icon/Vector.png";

import AppointmentVector from "../assets/icon/appointment-icon.png";
import AddDoctorVector from "../assets/icon/add-doctor-icon.png";
import DoctorVector from "../assets/icon/doctor-icon.png";
import { Outlet } from "react-router-dom";

function AdminLayout() {
  const sidebarLinks = [
    { icon: HomeVector, label: "Dashboard", path: "/admin" },
    {
      icon: AppointmentVector,
      label: "Appointment",
      path: "/admin/appointments",
    },
    { icon: AddDoctorVector, label: "Add Doctor", path: "/admin/add-doctor" },
    { icon: DoctorVector, label: "Doctor List", path: "/admin/doctor-list" },
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

export default AdminLayout;
