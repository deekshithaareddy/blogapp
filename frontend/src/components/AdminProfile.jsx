import { useAuth } from "../stores/AuthStore";
import { useNavigate } from "react-router";
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
      {/* ERROR */}
      {error && <p className={errorClass}>{error}</p>}
      {/* HEADER */}
      <div className="bg-white border border-[#e8e8ed] rounded-3xl p-6 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-5">
        {/* LEFT */}
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

        {/* RIGHT */}
        <button
          onClick={onLogout}
          className="bg-[#ff3b30] text-white px-5 py-2 rounded-full text-sm hover:bg-[#d62c23] transition"
        >
          Logout
        </button>
      </div>

      {/* DASHBOARD CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        {/* USERS */}
        <div className="bg-white border border-[#e8e8ed] rounded-3xl p-6 shadow-sm">
          <p className="text-sm text-[#6e6e73] mb-2">Manage</p>
          <h3 className="text-xl font-semibold text-[#1d1d1f]">Users</h3>
          <p className="text-sm text-[#6e6e73] mt-2">
            View registered users, roles, and accounts.
          </p>

          <button
            onClick={goToUsers}
            className="mt-5 bg-[#0066cc] text-white px-5 py-2 rounded-full text-sm hover:bg-[#0055aa] transition"
          >
            Open Users
          </button>
        </div>

        {/* ARTICLES */}
        <div className="bg-white border border-[#e8e8ed] rounded-3xl p-6 shadow-sm">
          <p className="text-sm text-[#6e6e73] mb-2">Moderation</p>
          <h3 className="text-xl font-semibold text-[#1d1d1f]">Articles</h3>
          <p className="text-sm text-[#6e6e73] mt-2">
            Review articles, remove content, monitor activity.
          </p>

          <button
            onClick={goToArticles}
            className="mt-5 bg-[#111827] text-white px-5 py-2 rounded-full text-sm hover:bg-black transition"
          >
            Articles
          </button>
        </div>

        {/* HOME */}
        <div className="bg-white border border-[#e8e8ed] rounded-3xl p-6 shadow-sm">
          <p className="text-sm text-[#6e6e73] mb-2">Navigation</p>
          <h3 className="text-xl font-semibold text-[#1d1d1f]">Home</h3>
          <button
            onClick={goHome}
            className="mt-5 bg-green-600 text-white px-5 py-2 rounded-full text-sm hover:bg-green-700 transition"
          >
            Go Home
          </button>
        </div>
      </div>

      {/* INFO */}
      <div className="bg-[#f5f5f7] rounded-3xl p-6 mt-8">
        <h4 className="text-lg font-semibold text-[#1d1d1f]">
          Admin Access
        </h4>
      </div>
    </div>
  );
}

export default AdminProfile;
