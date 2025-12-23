import { Link } from "react-router-dom";
import Dermatologist from "../../assets/Dermatologist.svg";
import Gastroenterologist from "../../assets/Gastroenterologist.svg";
import Pediatricians from "../../assets/Pediatricians.svg";
import Gynecologist from "../../assets/Gynecologist.svg";
import Neurologist from "../../assets/Neurologist.svg";
import GeneralPhysician from "../../assets/General_physician.svg";
import Heading from "../common/Heading";

const specialities = [
  { name: "Dermatologist", image: Dermatologist },
  { name: "Gastroenterologist", image: Gastroenterologist },
  { name: "Pediatricians", image: Pediatricians },
  { name: "Gynecologist", image: Gynecologist },
  { name: "Neurologist", image: Neurologist },
  { name: "General Physician", image: GeneralPhysician },
];

function SpecialitiesSection() {
  return (
    <section className="my-30">
      <Heading
        heading="Our Medical Specialties"
        subHeading={
          <>
            Browse doctors by their area of expertise and book <br /> your
            appointment instantly.
          </>
        }
      />

      {/* Grid Section */}
      <div className="mt-16">
        <div
          className="grid 
            grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 
            gap-6 sm:gap-8 lg:gap-10 
            px-4 sm:px-10 md:px-16 lg:px-24 xl:px-32 
            max-w-[1600px] mx-auto"
        >
          {specialities.map((item, index) => (
            <Link
              key={index}
              to={`/doctors?speciality=${encodeURIComponent(
                item.name.toLowerCase().replace(" ", "-")
              )}`}
              aria-label={`View ${item.name}`}
              className="flex flex-col items-center text-center cursor-pointer 
                         transition-transform hover:scale-105 p-2 rounded"
            >
              <div className="bg-blue-100 hover:bg-blue-200 p-6 rounded-full shadow-md flex items-center justify-center">
                <img
                  src={item.image}
                  alt={`${item.name} icon`}
                  className="w-16 h-16 object-contain"
                />
              </div>
              <h6 className="text-lg mt-4 font-medium text-stone-800">
                {item.name}
              </h6>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default SpecialitiesSection;
