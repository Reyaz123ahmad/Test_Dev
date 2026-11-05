import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';

export default function Dashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    total: 0,
    blocked: 0,
    unblocked: 0,
  });

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/users/count');

        const data = response.data.data;

        setStats({
          total: data?.total ?? 0,
          blocked: data?.blocked ?? 0,
          unblocked: data?.unblocked ?? 0,
        });
      } catch (err) {
        setError(
          err.response?.data?.message ||
          'Failed to load dashboard'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Users table ke liye data fetch
  const fetchUsers = async () => {
    try {
      const response = await api.get('/users/allGet');
      setUsers(response.data.data || []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Failed to load users'
      );
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Delete user
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return;
    }

    try {
      await api.delete(`/users/${id}`);
      fetchUsers();
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Failed to delete user'
      );
    }
  };

  // Block user
  const handleBlock = async (id) => {
    try {
      await api.put(`/users/block/${id}`);
      fetchUsers();
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Failed to block user'
      );
    }
  };

  // Unblock user
  const handleUnblock = async (id) => {
    try {
      await api.put(`/users/unblock/${id}`);
      fetchUsers();
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Failed to unblock user'
      );
    }
  };

  const cards = [
    {
      title: 'Total Users',
      value: stats.total,
      color: 'bg-blue-100 text-blue-700',
    },
    {
      title: 'Blocked Users',
      value: stats.blocked,
      color: 'bg-red-100 text-red-700',
    },
    {
      title: 'Unblocked Users',
      value: stats.unblocked,
      color: 'bg-green-100 text-green-700',
    },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">
        Admin Dashboard
      </h1>

      {loading && <p>Loading statistics...</p>}

      {error && (
        <p className="text-red-600 mb-4">{error}</p>
      )}

      {/* Statistics cards - unchanged */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card) => (
          <div
            key={card.title}
            className={`${card.color} p-6 rounded-xl shadow-sm`}
          >
            <p className="font-medium">{card.title}</p>

            <h2 className="text-4xl font-bold mt-3">
              {card.value}
            </h2>
          </div>
        ))}
      </div>

      {/* Users table */}
      <div className="mt-8 bg-white rounded-xl shadow-sm p-6">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-2xl font-bold">
            Users
          </h2>

          <button
            onClick={() => navigate('/create-user')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            + Create User
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-3">Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Mobile Number</th>
                <th className="p-3">Role</th>
                <th className="p-3">Status</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>

            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="text-center p-5 text-gray-500"
                  >
                    No users found
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b hover:bg-gray-50"
                  >
                    <td className="p-3">{user.name}</td>
                    <td className="p-3">{user.email}</td>
                    <td className="p-3">{user.mobileNumber}</td>
                    <td className="p-3">{user.role}</td>

                    <td className="p-3">
                      {user.isBlocked ? (
                        <span className="text-red-600 font-medium">
                          Blocked
                        </span>
                      ) : (
                        <span className="text-green-600 font-medium">
                          Active
                        </span>
                      )}
                    </td>

                    <td className="p-3">
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() =>
                            navigate(`/update-user/${user.id}/edit`)
                          }
                          className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() =>
                            handleDelete(user.id)
                          }
                          className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                        >
                          Delete
                        </button>

                        {user.isBlocked ? (
                          <button
                            onClick={() =>
                              handleUnblock(user.id)
                            }
                            className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                          >
                            Unblock
                          </button>
                        ) : (
                          <button
                            onClick={() =>
                              handleBlock(user.id)
                            }
                            className="bg-gray-700 text-white px-3 py-1 rounded hover:bg-gray-800"
                          >
                            Block
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}