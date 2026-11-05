
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';

import Login from './components/Login';

import Dashboard from './components/Dashboard';
import CreateUser from './components/CreateUser';
import Profile from './components/Profile';
import ChangePassword from './components/ChangePassword';

import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Signup from './components/Signup';
import UpdateUser from './components/UpdateUser';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<Navigate to="/dashboard" replace />}
        />
        <Route
          path="/register"
          element={<Signup />}
        />
        <Route
          path="/login"
          element={<Login />}
        />

        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route
              path="/dashboard"
              element={<Dashboard />}
            />

            <Route
              path="/create-user"
              element={<CreateUser />}
            />
            <Route
              path="/update-user/:id/edit"
              element={<UpdateUser />}
            />

            <Route
              path="/profile"
              element={<Profile />}
            />

            <Route
              path="/change-password"
              element={<ChangePassword />}
            />
          </Route>
        </Route>

        <Route
          path="*"
          element={<Navigate to="/dashboard" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}
