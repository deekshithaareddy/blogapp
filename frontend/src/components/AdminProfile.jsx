import { useAuth } from "../stores/AuthStore";
import { useNavigate, Outlet } from "react-router";
import { useState } from "react";
import { errorClass } from "../styles/common";

function AdminProfile() {
  const currentUser = useAuth((state) => state.currentUser);
  const logout = useAuth((state) => state.logout);
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const onLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (err) {
      setError("Logout failed");
    }
  };

  const goToUsers = () => {
    navigate("/admin-profile/users");
  };

  const goToArticles = () => {
    navigate("/admin-profile/articles");
  };

  const goHome = () => {
    navigate("/");
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">

      {error && <p className={errorClass}>{error}</p>}

      {/* HEADER */}
      <div className="bg-white border border-[#e8e8ed] rounded-3xl p-6 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-5">
        <div className="flex items-center gap-4">
          {currentUser?.profileImageUrl ? (
            <img
              src={currentUser.profileImageUrl}
              alt="profile"
              className="w-16 h-16 rounded-full object-cover border"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-xl font-semibold">
              {currentUser?.firstName?.charAt(0).toUpperCase()}
            </div>
          )}

          <div>
            <p className="text-sm text-[#6e6e73]">Administrator Panel</p>
            <h2 className="text-2xl font-semibold text-[#1d1d1f]">
              {currentUser?.firstName}
            </h2>
          </div>
        </div>

        <button
          onClick={onLogout}
          className="bg-[#ff3b30] text-white px-5 py-2 rounded-full text-sm hover:bg-[#d62c23] transition"
        >
          Logout
        </button>
      </div>

      {/* DASHBOARD */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">

        <div className="bg-white border border-[#e8e8ed] rounded-3xl p-6 shadow-sm">
          <h3 className="text-xl font-semibold">Users</h3>
          <button onClick={goToUsers} className="mt-5 bg-blue-600 text-white px-5 py-2 rounded-full">
            Open Users
          </button>
        </div>

        <div className="bg-white border border-[#e8e8ed] rounded-3xl p-6 shadow-sm">
          <h3 className="text-xl font-semibold">Articles</h3>
          <button onClick={goToArticles} className="mt-5 bg-black text-white px-5 py-2 rounded-full">
            Articles
          </button>
        </div>

        <div className="bg-white border border-[#e8e8ed] rounded-3xl p-6 shadow-sm">
          <h3 className="text-xl font-semibold">Home</h3>
          <button onClick={goHome} className="mt-5 bg-green-600 text-white px-5 py-2 rounded-full">
            Go Home
          </button>
        </div>
      </div>
      <div className="mt-8">
        <Outlet />
      </div>

    </div>
  );
}

export default AdminProfile;
