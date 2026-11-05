
import { useState } from 'react';
import api from '../api/api';

export default function ChangePassword() {
  const [form, setForm] = useState({
    oldPassword: '',
    newPassword: '',
  });

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage('');
    setError('');
    setLoading(true);

    try {
      const response = await api.put(
        '/auth/change-password',
        form
      );

      setMessage(response.data.message);

      setForm({
        oldPassword: '',
        newPassword: '',
      });
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Password change failed'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col items-center justify-center">
      <h1 className="text-xl font-bold mb-6">
        Change Password
      </h1>

      {message && (
        <p className="bg-green-100 text-green-700 p-3 rounded mb-4">
          {message}
        </p>
      )}

      {error && (
        <p className="bg-red-100 text-red-700 p-3 rounded mb-4">
          {error}
        </p>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow rounded-xl p-6 space-y-4"
      >
        <div>
          <label className="block mb-2 font-medium">
            Old Password
          </label>

          <input
            type="password"
            name="oldPassword"
            value={form.oldPassword}
            onChange={handleChange}
            required
            className="w-full border p-1 rounded-lg"
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">
            New Password
          </label>

          <input
            type="password"
            name="newPassword"
            value={form.newPassword}
            onChange={handleChange}
            required
            minLength={8}
            className="w-full border p-1 rounded-lg"
          />
        </div>

        <button
          disabled={loading}
          className="w-full bg-blue-600 text-white p-1 rounded-lg"
        >
          {loading ? 'Updating...' : 'Update Password'}
        </button>
      </form>
    </div>
  );
}
