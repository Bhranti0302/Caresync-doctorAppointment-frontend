import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchDoctorsAsync } from "../../redux/slices/doctorSlice";
import DoctorItem from "./DoctorItem";


function DoctorsList({ limit = 6 }) {
  const dispatch = useDispatch();
  const { doctors, loading } = useSelector((state) => state.doctor);

  useEffect(() => {
    dispatch(fetchDoctorsAsync());
  }, [dispatch]);

  if (loading) {
    return <p className="text-center mt-20">Loading doctors...</p>;
  }

  if (!doctors || doctors.length === 0) {
    return (
      <p className="text-center text-stone-500 mt-20">
        No doctors available right now.
      </p>
    );
  }

  return (
    <div className="flex justify-center mt-20">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-10 mx-auto max-w-[2400px]">
        {doctors.slice(0, limit).map((doctor) => (
          <DoctorItem key={doctor._id} item={doctor} />
        ))}
      </div>
    </div>
  );
}

export default DoctorsList;
