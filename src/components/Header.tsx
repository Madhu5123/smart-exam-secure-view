
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, User, LogOut } from "lucide-react";

const Header = () => {
  const navigate = useNavigate();
  const { currentUser, userData, logOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logOut();
      navigate("/login");
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  const renderNavLinks = () => {
    if (!userData) return null;

    switch (userData.role) {
      case "admin":
        return (
          <>
            <Link to="/admin/dashboard" className="text-white hover:text-exam-light">Dashboard</Link>
            <Link to="/admin/manage-teachers" className="text-white hover:text-exam-light">Manage Teachers</Link>
          </>
        );
      case "teacher":
        return (
          <>
            <Link to="/teacher/dashboard" className="text-white hover:text-exam-light">Dashboard</Link>
            <Link to="/teacher/students" className="text-white hover:text-exam-light">Students</Link>
            <Link to="/teacher/exams" className="text-white hover:text-exam-light">Exams</Link>
            <Link to="/teacher/subjects" className="text-white hover:text-exam-light">Subjects</Link>
          </>
        );
      case "student":
        return (
          <>
            <Link to="/student/dashboard" className="text-white hover:text-exam-light">Dashboard</Link>
            <Link to="/student/exams" className="text-white hover:text-exam-light">My Exams</Link>
            <Link to="/student/results" className="text-white hover:text-exam-light">Results</Link>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <header className="bg-exam-primary shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0">
              <h1 className="text-white text-xl font-bold">Exam Portal</h1>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          {currentUser && (
            <nav className="hidden md:flex space-x-10 items-center">
              {renderNavLinks()}
            </nav>
          )}
          
          {/* User Menu */}
          <div className="flex items-center">
            {currentUser ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="text-white">
                    <User className="h-5 w-5 mr-2" />
                    {userData?.displayName || userData?.email}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>
                    {userData?.role.charAt(0).toUpperCase() + userData?.role.slice(1)}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate("/profile")}>
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button asChild className="bg-white text-exam-primary hover:bg-exam-light">
                <Link to="/login">Login</Link>
              </Button>
            )}
            
            {/* Mobile menu button */}
            <div className="flex md:hidden ml-2">
              <Button 
                variant="ghost" 
                className="text-white"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <Menu className="h-6 w-6" />
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {mobileMenuOpen && currentUser && (
        <div className="md:hidden bg-exam-secondary px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <div className="flex flex-col space-y-2">
            {renderNavLinks()}
            <button onClick={handleLogout} className="text-white hover:text-exam-light flex items-center">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
