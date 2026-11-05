
import { useEffect, useState } from 'react';
import api from '../api/api';

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('/auth/admin/profile');
        setProfile(response.data);
      } catch (err) {
        setError(
          err.response?.data?.message ||
          'Failed to load profile'
        );
      }
    };

    fetchProfile();
  }, []);

  if (error) {
    return <p className="text-red-600">{error}</p>;
  }

  if (!profile) {
    return <p>Loading profile...</p>;
  }

  const fields = [
    ['Name', profile.name],
    ['Email', profile.email],
    ['Role', profile.role],
    ['Last Login', profile.lastLogin]
    
  ];

  return (
    <div className="max-w-xl">
      <h1 className="text-3xl font-bold mb-6">
        My Profile
      </h1>

      <div className="bg-white rounded-xl shadow p-6 space-y-5">
        {fields.map(([label, value]) => (
          <div key={label}>
            <p className="text-gray-500 text-sm">{label}</p>
            <p className="font-semibold text-lg">
              {value || 'Not available'}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
