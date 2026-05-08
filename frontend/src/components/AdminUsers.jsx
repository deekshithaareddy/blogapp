import { useEffect, useState } from "react";
import axios from "axios";

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const getUsers = async () => {
    try {
      const res = await axios.get(
        "https://blogapp-s4r1.onrender.com/admin-api/users",
        { withCredentials: true }
      );

      setUsers(res.data.payload);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  const toggleUser = async (user) => {
    try {
      await axios.put(
        "https://blogapp-s4r1.onrender.com/admin-api/block",
        {
          email: user.email,
          isUserActive: !user.isUserActive,
        },
        { withCredentials: true }
      );

      getUsers();
    } catch (err) {
      console.log(err);
    }
  };

  if (loading) return <p>Loading users...</p>;

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h2 className="text-3xl font-semibold mb-8">
        Manage Users
      </h2>

      <div className="space-y-4">
        {users.map((user) => (
          <div
            key={user._id}
            className="bg-white border rounded-2xl p-5 shadow flex justify-between items-center"
          >
            <div>
              <h3 className="text-lg font-semibold">
                {user.firstName}
              </h3>

              <p className="text-sm text-gray-500">
                {user.email}
              </p>

              <p className="text-sm mt-1">
                {user.role}
              </p>
            </div>

            <button
              onClick={() => toggleUser(user)}
              className={`px-5 py-2 rounded-full text-white ${
                user.isUserActive
                  ? "bg-red-500"
                  : "bg-green-600"
              }`}
            >
              {user.isUserActive ? "Block" : "Unblock"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminUsers;