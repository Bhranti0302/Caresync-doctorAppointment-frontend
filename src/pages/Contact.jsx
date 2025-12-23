import aboutImage from "../assets/contact_image.png";
import Footer from "../components/layout/Footer";

function Contact() {
  const contactContent = [
    {
      title: "Reach Out Anytime:",
      para: "Our support team is always ready to assist you with appointments, inquiries, or technical help.",
    },
    {
      title: "Expert Guidance:",
      para: "Get advice from our knowledgeable staff to help you navigate our platform efficiently.",
    },
    {
      title: "Prompt Responses:",
      para: "We ensure timely replies to all your messages, so you never miss important updates regarding your healthcare.",
    },
  ];

  return (
    <>
      <div className="flex flex-col m-6 md:m-10 items-center">
        <h5 className="text-2xl text-stone-600 mb-16">
          CONTACT <span className="font-semibold text-stone-900">US</span>
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
            <h6 className="font-semibold text-lg mt-4">Our OFFICE</h6>
            <div>
              <p className="text-sm text-stone-600 capitalize">
                54709 Willms Station
              </p>
              <p className="text-sm text-stone-600 capitalize">
                Suite 350, Washington, USA
              </p>
            </div>
            <div>
              <p className="text-sm text-stone-600 capitalize">
                Tel: (212) 555‑0198
              </p>
              <p className="text-sm text-stone-600 capitalize">
                Email: greatstackdev@gmail.com
              </p>
            </div>
            <h6 className="font-semibold text-lg mt-4">
              Book Appointments with CareSync
            </h6>
            <div>
              <p className="text-sm text-stone-600 capitalize">
                Learn more about our trusted doctors and schedule your visits
                effortlessly.
              </p>
              <button className="border border-blue-500 px-4 py-2 mt-5 rounded-sm">
                Book an Appointment
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6 mt-16">
          <h5 className="text-xl text-stone-600">
            WHY <span className="text-stone-900">CHOOSE US</span>
          </h5>
          <div className="grid grid-cols-1 md:grid-cols-3 items-stretch w-full max-w-6xl">
            {contactContent.map((item) => (
              <div className="border border-stone-200 px-8 py-8 flex flex-col gap-4">
                <h6 className="text-md font-semibold capitalize">
                  {item.title}
                </h6>
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

export default Contact;
