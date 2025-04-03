
import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { UserRole } from "@/context/AuthContext";

interface PrivateRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

const PrivateRoute = ({ children, allowedRoles }: PrivateRouteProps) => {
  const { currentUser, userData, loading } = useAuth();

  useEffect(() => {
    if (!loading && !currentUser) {
      console.log("User not authenticated, redirecting to login");
    } else if (!loading && currentUser && allowedRoles && userData) {
      if (!allowedRoles.includes(userData.role)) {
        console.log("User role not authorized:", userData.role);
      }
    }
  }, [currentUser, loading, allowedRoles, userData]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-exam-primary"></div>
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && userData && !allowedRoles.includes(userData.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

export default PrivateRoute;
