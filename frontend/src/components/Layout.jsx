
import { NavLink, Outlet, useNavigate } from 'react-router-dom';

export default function Layout() {
  const navigate = useNavigate();

  const links = [
    { label: 'Business Overview', path: '/dashboard' },
    { label: 'Create User', path: '/create-user' },
    { label: 'Account', path: '/profile' },
    { label: 'Change Password', path: '/change-password' },
  ];

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('admin');

    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      <aside className="w-64 bg-slate-900 text-white p-5">
        <h2 className="text-2xl font-bold mb-8">
          Admin Panel
        </h2>

        <nav className="flex flex-col gap-2">
          {links.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `p-2 rounded-lg ${
                  isActive
                    ? 'bg-blue-600'
                    : 'hover:bg-slate-700'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <button
          onClick={logout}
          className="mt-8 w-full bg-red-600 hover:bg-red-700 px-2 py-1 rounded-lg"
        >
          Logout
        </button>
      </aside>

      <main className="flex-1 p-8 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
