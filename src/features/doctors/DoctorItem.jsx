import { Link } from "react-router-dom";
import DefaultImage from "../../assets/default.png";

function DoctorItem({ item }) {
  const storeDoctor = item; // already updated in Redux
  const isAvailable = storeDoctor?.available ?? true;

  return (
    <Link to={`/doctor/${storeDoctor?._id}`}>
      <div className="max-w-[300px] border border-blue-200 rounded-lg hover:shadow-lg hover:scale-[1.02] transition-all duration-300">
        <div className="bg-blue-50">
          <img
            className="rounded-md w-full object-cover"
            src={storeDoctor?.image || DefaultImage}
            alt={`${storeDoctor?.name || "Doctor"} - ${storeDoctor?.speciality || "Profile"}`}
          />
        </div>

        <div className="flex flex-col gap-1 p-4">
          <div className="flex gap-2 items-center">
            <span
              className={`w-2 h-2 rounded-full ${
                isAvailable ? "bg-green-500" : "bg-gray-400"
              }`}
            />
            <p className={`font-medium ${isAvailable ? "text-green-600" : "text-gray-500"}`}>
              {isAvailable ? "Available" : "Unavailable"}
            </p>
          </div>

          <div>
            <h5 className="text-xl font-bold">{storeDoctor?.name || "Unknown Doctor"}</h5>
            <p className="text-stone-700">{storeDoctor?.speciality || "N/A"}</p>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default DoctorItem;
