import * as React from "react";
import {
  Routes,
  Route,
  useLocation,
  Navigate,
  Outlet,
  BrowserRouter
} from "react-router-dom";
import Dashboard from './components/Dashboard';
import LoginPage from './components/LoginPage';
import { AuthProvider, useAuth } from './components/Auth';

export default function App() {

  return (
    <div className="wrapper">
      <h1>KinetWall</h1>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/login" element={<LoginPage />} />
              <Route
                path="/"
                element={
                  <RequireAuth>
                    <Dashboard />
                  </RequireAuth>
                }
              />
            </Route>
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

function Layout() {
  return (
    <div>
      <AuthStatus />
      <Outlet />
    </div>
  );
}

function AuthStatus() {
  let auth = useAuth();

  if (!auth.user) {
    return <p>You are not logged in.</p>;
  }

  return (
    <p>Welcome {auth.user.username}!{" "}</p>
  );
}

function RequireAuth({ children }: { children: JSX.Element }) {
  let auth = useAuth();
  let location = useLocation();

  if (!auth.user) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}