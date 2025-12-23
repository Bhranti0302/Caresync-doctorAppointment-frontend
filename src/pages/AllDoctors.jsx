import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import DoctorItem from "../features/doctors/DoctorItem";
import Footer from "../components/layout/Footer";

function AllDoctors() {
  const doctors = useSelector((state) => state.doctor.doctors);
  const location = useLocation();
  const navigate = useNavigate();

  const [selectedSpec, setSelectedSpec] = useState("All");

  // 🔹 When URL changes → update selected speciality
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const speciality = queryParams.get("speciality")
      ? queryParams.get("speciality").replace("-", " ")
      : "All";
    setSelectedSpec(speciality);
  }, [location.search]);

  // 🔹 Available specialities
  const specialities = [
    "All",
    "General Physician",
    "Gynecologist",
    "Dermatologist",
    "Pediatricians",
    "Neurologist",
    "Gastroenterologist",
  ];

  // 🔹 Update URL dynamically when selecting a speciality
  const handleSpecChange = (spec) => {
    const param =
      spec === "All"
        ? ""
        : `?speciality=${encodeURIComponent(
            spec.toLowerCase().replace(/\s+/g, "-")
          )}`;
    navigate(`/doctors${param}`);
  };

  // 🔹 Filter doctors based on selected speciality
  const filteredDoctors =
    selectedSpec === "All"
      ? doctors
      : doctors.filter(
          (doc) => doc.speciality?.toLowerCase() === selectedSpec.toLowerCase()
        );

  return (
    <>
      <div className="px-4 sm:px-6 md:px-10 py-8 min-h-screen bg-stone-50">
        <h6 className="text-2xl font-semibold mb-8 text-center md:text-left text-stone-800">
          Browse through the doctors specialist.
        </h6>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <div className="flex flex-wrap md:flex-col justify-center md:justify-start gap-3 md:gap-4">
            {specialities.map((spec) => (
              <button
                key={spec}
                onClick={() => handleSpecChange(spec)}
                className={`border border-blue-500 px-5 py-2.5 rounded-md text-center font-medium cursor-pointer transition-all duration-300
                  ${
                    selectedSpec.toLowerCase() === spec.toLowerCase()
                      ? "bg-blue-500 text-white shadow-md"
                      : "bg-white text-blue-600 hover:bg-blue-500 hover:text-white"
                  }`}
              >
                {spec}
              </button>
            ))}
          </div>

          {/* Doctor Cards */}
          <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center">
            {filteredDoctors.length > 0 ? (
              filteredDoctors.map((item, index) => (
                <DoctorItem key={item._id || index} item={item} />
              ))
            ) : (
              <p className="text-center text-stone-500 col-span-full">
                No doctors found for <strong>{selectedSpec}</strong>.
              </p>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default AllDoctors;
