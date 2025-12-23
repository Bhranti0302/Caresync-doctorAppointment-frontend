import Logo from "./Logo";
import NavList from "./NavList";

function Navbar() {
  return (
    <nav className="flex items-center justify-between mx-6 md:mx-10 my-4">
      {/* Logo */}
      <Logo />

      <NavList />
    </nav>
  );
}

export default Navbar;
