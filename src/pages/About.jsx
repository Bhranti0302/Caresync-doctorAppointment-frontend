import aboutImage from "../assets/about_image.png";
import Footer from "../components/layout/Footer";

function About() {
  const content = [
    {
      title: "Efficiency:",
      para: "Streamlined appointment scheduling that fits into your busy lifestyle.",
    },
    {
      title: "Convenience:",
      para: "Access to a network of trusted healthcare professionals in your area.",
    },
    {
      title: "Personalization:",
      para: "Tailored recommendations and reminders to help you stay on top of your health.",
    },
  ];
  return (
    <>
      <div className="flex flex-col m-6 md:m-10 items-center">
        <h5 className="text-2xl text-stone-600 mb-16">
          ABOUT <span className="font-semibold text-stone-900">US</span>
        </h5>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-stretch w-full max-w-6xl">
          {/* Image */}
          <div className="flex">
            <img
              src={aboutImage}
              alt="about image"
              className="object-cover w-full h-full rounded"
            />
          </div>

          {/* Content */}
          <div className="col-span-2 flex flex-col gap-4 text-stone-700">
            <p>
              Welcome to CareSync, your trusted partner in managing your
              healthcare needs conveniently and efficiently. At CareSync, we
              understand the challenges individuals face when it comes to
              scheduling doctor appointments and managing their health records.
            </p>
            <p>
              CareSync is committed to excellence in healthcare technology. We
              continuously strive to enhance our platform, integrating the
              latest advancements to improve user experience and deliver
              superior service. Whether you're booking your first appointment or
              managing ongoing care, CareSync is here to support you every step
              of the way.
            </p>

            <h6 className="font-semibold text-lg mt-4">Our Vision</h6>
            <p>
              Our vision at CareSync is to create a seamless healthcare
              experience for every user. We aim to bridge the gap between
              patients and healthcare providers, making it easier for you to
              access the care you need, when you need it.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-6 mt-16">
          <h5 className="text-xl text-stone-600">
            WHY <span className="text-stone-900">CHOOSE US</span>
          </h5>
          <div className="grid grid-cols-1 md:grid-cols-3 items-stretch w-full max-w-6xl">
            {content.map((item) => (
              <div className="border border-stone-200 px-8 py-8 flex flex-col gap-4">
                <h6 className="text-md font-medium uppercase">{item.title}</h6>
                <p className="text-sm text-stone-600 capitalize">{item.para}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default About;
