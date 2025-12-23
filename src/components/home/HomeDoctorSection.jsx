import ExploreButton from "../common/Button/ExploreButton";
import Heading from "../common/Heading";
import DoctorsList from "../../features/doctors/DoctorsList";

function HomeDoctorSection() {
  return (
    <section className="my-20">
      <Heading
        heading="Our Doctors"
        subHeading={
          <>
            Browse our complete list of certified specialists <br />
            and book your appointment instantly.
          </>
        }
      />
      <DoctorsList />
      <div className="flex items-center mt-14 justify-center">
        <ExploreButton />
      </div>
    </section>
  );
}

export default HomeDoctorSection;
