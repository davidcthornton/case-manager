import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./auth";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <div style={{ padding: 24 }}>Checking session…</div>;
  if (!user) {
    // send the user back here after login
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  return children;
}
