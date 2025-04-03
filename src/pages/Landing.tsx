
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";

const Landing = () => {
  const { currentUser, userData } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser && userData) {
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
      }
    }
  }, [currentUser, userData, navigate]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 bg-gradient-to-br from-exam-light to-white">
        <div className="container mx-auto px-4 py-16 md:py-24 flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-exam-dark">
              Secure Online <span className="text-exam-primary">Examination</span> Portal
            </h1>
            <p className="text-lg mb-8 text-gray-700 max-w-lg">
              A comprehensive solution for conducting online examinations with advanced proctoring features, AI-powered monitoring, and detailed analytics.
            </p>
            <div className="space-x-4">
              <Button 
                onClick={() => navigate("/login")} 
                className="bg-exam-primary hover:bg-exam-secondary text-white px-6 py-2"
              >
                Login
              </Button>
              <Button 
                onClick={() => navigate("/admin-register")} 
                variant="outline" 
                className="border-exam-primary text-exam-primary hover:bg-exam-primary hover:text-white"
              >
                Admin Registration
              </Button>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <div className="bg-white p-4 rounded-lg shadow-xl w-full max-w-md h-80 border border-gray-200">
              <div className="h-full flex items-center justify-center">
                <p className="text-gray-500">Illustration of exam monitoring dashboard</p>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="bg-exam-light py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-exam-dark">Key Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-4 text-exam-primary">AI Proctoring</h3>
                <p className="text-gray-700">Advanced AI-based monitoring to detect and prevent cheating during examinations</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-4 text-exam-primary">Comprehensive Analytics</h3>
                <p className="text-gray-700">Detailed reports and insights on student performance to help improve teaching methods</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-4 text-exam-primary">Secure Environment</h3>
                <p className="text-gray-700">Full-screen mode and browser lockdown features to create a secure examination environment</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-exam-dark text-white py-8">
          <div className="container mx-auto px-4 text-center">
            <p>© {new Date().getFullYear()} Secure Examination Portal. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Landing;
