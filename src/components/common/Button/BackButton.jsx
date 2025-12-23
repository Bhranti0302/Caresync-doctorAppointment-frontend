import { useNavigate } from "react-router-dom";

function BackButton({ buttonName }) {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(-1)}
      className="flex items-center gap-2 py-2 text-blue-600 hover:text-blue-800 transition"
    >
      <i className="ri-arrow-left-line text-lg"></i>
      <span className="underline">{buttonName}</span>
    </button>
  );
}

export default BackButton;
