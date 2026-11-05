
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/api';

export default function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  
  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError('');

  try {
    const response = await api.post(
      '/auth/login',
      formData
    );

    const token = response.data?.token;
    const admin = response.data?.admin;

    if (!token) {
      throw new Error('Token not received');
    }

    localStorage.setItem('access_token', token);

    if (admin) {
      localStorage.setItem('admin', JSON.stringify(admin));
    }

    
    await api.get('/auth/admin/profile');

    navigate('/dashboard', { replace: true });
  } catch (err) {
    localStorage.removeItem('access_token');
    localStorage.removeItem('admin');

    setError(
      err.response?.data?.message ||
      err.message ||
      'Login failed'
    );
  } finally {
    setLoading(false);
  }
};
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg"
      >
        <h1 className="text-2xl font-bold text-center mb-6">
          Admin Login
        </h1>

        {error && (
          <p className="bg-red-100 text-red-700 p-3 rounded mb-4">
            {error}
          </p>
        )}

        <label className="block mb-2 font-medium">
          Email
        </label>

        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full border rounded-lg p-3 mb-4"
          placeholder="Enter email"
        />

        <label className="block mb-2 font-medium">
          Password
        </label>

        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
          className="w-full border rounded-lg p-3 mb-6"
          placeholder="Enter password"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>

        <p className="text-center text-sm text-gray-500 mt-4">
          <Link to="/register" className="text-blue-600">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}
