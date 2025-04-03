
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to the main landing page
    navigate("/");
  }, [navigate]);

  // This is just a fallback
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-2">Redirecting...</h1>
        <p>Please wait while we redirect you to the exam portal.</p>
      </div>
    </div>
  );
};

export default Index;
