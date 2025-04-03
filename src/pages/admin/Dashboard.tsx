
import { useState, useEffect } from "react";
import { 
  collection, 
  getDocs, 
  query, 
  where, 
  DocumentData 
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";

const AdminDashboard = () => {
  const { userData } = useAuth();
  const [teacherCount, setTeacherCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Count teachers
        const teachersQuery = query(
          collection(db, "users"),
          where("role", "==", "teacher")
        );
        const teacherSnapshot = await getDocs(teachersQuery);
        setTeacherCount(teacherSnapshot.size);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-exam-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 sm:p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-exam-dark">Admin Dashboard</h1>
        <p className="text-gray-600">Welcome back, {userData?.displayName || "Admin"}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Teachers</CardTitle>
            <CardDescription>Total registered teachers</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-exam-primary">{teacherCount}</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <a 
              href="/admin/manage-teachers" 
              className="block p-3 bg-exam-light hover:bg-exam-primary hover:text-white rounded-md transition-all"
            >
              Manage Teachers
            </a>
            <a 
              href="/admin/settings" 
              className="block p-3 bg-exam-light hover:bg-exam-primary hover:text-white rounded-md transition-all"
            >
              System Settings
            </a>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
