import { NavLink } from "react-router-dom";

function Footer() {
  return (
    <footer className="flex flex-col items-center py-2 px-10">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-12  mt-20 lg:max-w-[1600px]">
        <div className="col-span-2 flex flex-col gap-2 lg:max-w-2xl">
          <h5 className="text-2xl font-bold">CareSync</h5>
          <p className="text-sm text-stone-600">
            CareSync is a reliable healthcare platform connecting patients with
            experienced doctors. Our goal is to simplify healthcare with secure,
            fast, and convenient appointments.
          </p>
        </div>
        <div>
          <h6 className="text-xl font-bold">Quick Links</h6>
          <ul className="flex flex-col gap-1 mt-2">
            <li>
              <NavLink
                to="/"
                className="text-lg text-stone-600 hover:text-blue-500 "
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/doctors"
                className="text-lg text-stone-600 hover:text-blue-500 "
              >
                All Doctors
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/about"
                className="text-lg text-stone-600 hover:text-blue-500 "
              >
                About
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/contact"
                className="text-lg text-stone-600 hover:text-blue-500 "
              >
                Contact
              </NavLink>
            </li>
          </ul>
        </div>
        <div>
          <h6 className="text-xl font-bold">Get in Touch</h6>
          <ul className="flex flex-col gap-1 mt-2">
            <li className="text-md text-stone-600 hover:text-blue-500 ">
              +1 (555) 010-0000
            </li>
            <li className="text-md text-stone-600 hover:text-blue-500 ">
              support@caresync.com
            </li>
          </ul>
        </div>
      </div>
      <div className="flex justify-center mt-10  p-5 border-t-1 border-blue-400 w-full">
        <p>© 2025 CareSync. All Rights Reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
