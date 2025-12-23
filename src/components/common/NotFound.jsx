import { Link } from "react-router-dom";
import { Home } from "lucide-react";

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-6">
      <h1 className="text-8xl font-extrabold text-stone-700 mb-4">404</h1>
      <h2 className="text-2xl md:text-3xl font-semibold text-stone-600 mb-3">
        Oops! Page Not Found
      </h2>
      <p className="text-stone-500 max-w-md mb-8">
        The page you’re looking for doesn’t exist or has been moved. Please
        check the URL or go back to the homepage.
      </p>

      <Link
        to="/"
        className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
      >
        <Home className="w-5 h-5" />
        Back to Home
      </Link>
    </div>
  );
}

export default NotFound;
