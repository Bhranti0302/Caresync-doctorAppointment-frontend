import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginUserAsync, clearAuthError } from "../../redux/slices/authSlice";
import toast from "react-hot-toast";

function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, loggedInUser, error } = useSelector((state) => state.auth);
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  // ---------------- Helper: Role-based redirect ----------------
  const redirectUser = (user) => {
    if (!user) return;
    const role = user.role;
    if (role === "admin") navigate("/admin", { replace: true });
    else if (role === "doctor") navigate("/doctor", { replace: true });
    else navigate("/", { replace: true });
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await dispatch(loginUserAsync(form));
    if (res.meta.requestStatus === "fulfilled") {
      toast.success("Welcome back!");
      redirectUser(res.payload);
    } else {
      toast.error(res.payload || "Invalid email or password.");
    }
  };

  useEffect(() => {
    // Redirect if already logged in
    if (loggedInUser) redirectUser(loggedInUser);
    return () => dispatch(clearAuthError());
  }, [loggedInUser, navigate, dispatch]);

  return (
    <div className="flex items-center justify-center min-h-[80vh] px-4 bg-stone-50/50">
      <div className="bg-white border border-stone-200 shadow-xl rounded-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-stone-800">Welcome Back</h2>
          <p className="text-stone-500 mt-2">Please enter your details to login</p>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-3 mb-4 text-sm rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="name@example.com"
              value={form.email}
              onChange={handleChange}
              autoComplete="username"
              className="w-full border border-stone-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              required
            />
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-stone-700 mb-1">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              autoComplete="current-password"
              className="w-full border border-stone-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              required
            />
            <button
              type="button"
              className="absolute right-3 top-9 text-stone-400 hover:text-stone-600"
              onClick={() => setShowPassword(!showPassword)}
            >
              <i className={showPassword ? "ri-eye-off-line" : "ri-eye-line"}></i>
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 active:scale-[0.98] transition disabled:bg-blue-300 shadow-md"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <i className="ri-loader-4-line animate-spin"></i> Logging in...
              </span>
            ) : (
              "Login"
            )}
          </button>
        </form>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-stone-200"></span>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-stone-500">New to CareSync?</span>
          </div>
        </div>

        <p className="text-center text-stone-600">
          <button
            onClick={() => navigate("/signup")}
            className="w-full border border-stone-300 text-stone-700 font-semibold py-2.5 rounded-lg hover:bg-stone-50 transition"
          >
            Create an Account
          </button>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
