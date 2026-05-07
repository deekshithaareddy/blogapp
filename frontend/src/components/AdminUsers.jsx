import { useEffect, useState } from "react";
import axios from "axios";

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(
          "https://blogapp-s4r1.onrender.com/admin-api/users",
          { withCredentials: true }
        );

        setUsers(res.data.payload);
      } catch (err) {
        console.log(err);
        setError(err.response?.data?.message || "Failed to load users");
      }
    };

    fetchUsers();
  }, []);

  if (error) return <p>{error}</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">All Users</h2>

      {users.length === 0 ? (
        <p>No users found</p>
      ) : (
        <div className="grid gap-3">
          {users.map((user) => (
            <div
              key={user._id}
              className="p-3 border rounded bg-white shadow-sm"
            >
              <p><b>Name:</b> {user.firstName}</p>
              <p><b>Email:</b> {user.email}</p>
              <p><b>Role:</b> {user.role}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminUsers;
