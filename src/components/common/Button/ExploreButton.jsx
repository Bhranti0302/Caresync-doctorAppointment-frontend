import { useNavigate } from "react-router-dom";

function ExploreButton() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/doctors");
    window.scrollTo(0, 0);
  };
  return (
    <button
      onClick={handleClick}
      className="bg-blue-100 text-blue-600 px-5 py-2 rounded-sm cursor-pointer"
    >
      Explore
    </button>
  );
}

export default ExploreButton;
