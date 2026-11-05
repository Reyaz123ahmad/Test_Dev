
import { useState } from 'react';
import api from '../api/api';

const initialForm = {
  name: '',
  mobileNumber: '',
  email: '',
  password: '',
  city: '',
  state: '',
  role: 'User',
};

export default function CreateUser() {
  const [form, setForm] = useState(initialForm);
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
      const response = await api.post('/users/create', form);

      setMessage(response.data.message);
      setForm(initialForm);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Could not create user'
      );
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    ['name', 'Full Name'],
    ['mobileNumber', 'Mobile Number'],
    ['email', 'Email'],
    ['password', 'Password'],
    ['city', 'City'],
    ['state', 'State'],
  ];

  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">
        Create User
      </h1>

      {message && (
        <p className="bg-green-100 text-green-700 p-3 mb-4 rounded">
          {message}
        </p>
      )}

      {error && (
        <p className="bg-red-100 text-red-700 p-3 mb-4 rounded">
          {error}
        </p>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow p-6 grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        {fields.map(([name, label]) => (
          <div key={name}>
            <label className="block font-medium mb-2">
              {label}
            </label>

            <input
              name={name}
              type={name === 'password' ? 'password' : 'text'}
              value={form[name]}
              onChange={handleChange}
              required
              className="w-full border p-3 rounded-lg"
            />
          </div>
        ))}

        <div>
          <label className="block font-medium mb-2">
            Role
          </label>

          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg"
          >
            <option value="User">User</option>
            <option value="Admin">Admin</option>
          </select>
        </div>

        <button
          disabled={loading}
          className="md:col-span-2 bg-blue-600 text-white p-3 rounded-lg"
        >
          {loading ? 'Creating...' : 'Create User'}
        </button>
      </form>
    </div>
  );
}
