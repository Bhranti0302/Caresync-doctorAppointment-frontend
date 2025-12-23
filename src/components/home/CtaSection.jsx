import { Link } from "react-router-dom";
import ctaImage from "../../assets/appointment_img.svg";

function CtaSection() {
  return (
    <section className="bg-blue-500 mt-10 flex flex-col md:flex-row items-center justify-evenly rounded-2xl overflow-hidden px-6 sm:px-10 md:px-16 lg:px-20 gap-8">
      {/* Left Content */}
      <div className="flex flex-col gap-3 lg:text-left max-w-5xl py-10">
        <h4 className="text-4xl md:text-5xl xl:text-6xl text-stone-100 font-bold leading-tight">
          Find & Book Your Doctor
        </h4>
        <p className="text-lg md:text-xl xl:text-2xl text-stone-200 font-medium">
          Consult with 100+ verified specialists across all fields.
        </p>
        <div className="mt-4">
          <Link to="/signup">
            <button className="bg-stone-200 text-stone-800 text-md sm:text-lg font-semibold px-8 py-3 rounded-full shadow-md hover:bg-white hover:text-blue-600 transition-all duration-300">
              Create Account
            </button>
          </Link>
        </div>
      </div>

      {/* Right Image */}
      <div className="flex justify-center lg:justify-end mt-5">
        <img
          src={ctaImage}
          alt="Doctor appointment illustration"
          className="h-auto w-72 sm:w-96 md:w-[420px]"
        />
      </div>
    </section>
  );
}

export default CtaSection;
