
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const Unauthorized = () => {
  const navigate = useNavigate();
  const { userData } = useAuth();

  const handleRedirect = () => {
    if (userData) {
      switch (userData.role) {
        case "admin":
          navigate("/admin/dashboard");
          break;
        case "teacher":
          navigate("/teacher/dashboard");
          break;
        case "student":
          navigate("/student/dashboard");
          break;
        default:
          navigate("/login");
      }
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-exam-light">
      <div className="text-center space-y-4">
        <h1 className="text-6xl font-bold text-exam-error">403</h1>
        <h2 className="text-2xl font-semibold text-exam-dark">Unauthorized Access</h2>
        <p className="text-gray-600 max-w-md mx-auto">
          You don't have permission to access this page. Please contact your administrator if you believe this is an error.
        </p>
        <Button onClick={handleRedirect} className="mt-4 bg-exam-primary hover:bg-exam-secondary">
          Go to Dashboard
        </Button>
      </div>
    </div>
  );
};

export default Unauthorized;
