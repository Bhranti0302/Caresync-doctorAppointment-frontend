import Banner from "../components/home/Banner";
import CtaSection from "../components/home/CtaSection";
import Footer from "../components/layout/Footer";
import HomeDoctorSection from "../components/home/HomeDoctorSection";
import SpecialitiesSection from "../components/home/SpecialitiesSection";

function Home() {
  return (
    <>
      <div className="m-6 md:m-10">
        <Banner />
        <SpecialitiesSection />
        <HomeDoctorSection />
        <CtaSection />
      </div>
      <Footer />
    </>
  );
}

export default Home;
