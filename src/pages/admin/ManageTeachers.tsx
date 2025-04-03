
import { useState, useEffect } from "react";
import { 
  collection, 
  getDocs, 
  query, 
  where, 
  addDoc, 
  deleteDoc, 
  doc, 
  serverTimestamp 
} from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { db } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";

interface Teacher {
  id: string;
  email: string;
  displayName: string;
  createdAt: any;
}

const ManageTeachers = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const auth = getAuth();

  const fetchTeachers = async () => {
    setLoading(true);
    try {
      const teachersQuery = query(
        collection(db, "users"),
        where("role", "==", "teacher")
      );
      const teacherSnapshot = await getDocs(teachersQuery);
      
      const teachersList: Teacher[] = [];
      teacherSnapshot.forEach((doc) => {
        teachersList.push({
          id: doc.id,
          ...doc.data(),
        } as Teacher);
      });
      
      setTeachers(teachersList);
    } catch (error) {
      console.error("Error fetching teachers:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load teachers.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  const handleAddTeacher = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Add user data to Firestore
      await addDoc(collection(db, "users"), {
        uid: user.uid,
        email,
        displayName,
        role: "teacher",
        createdAt: serverTimestamp(),
      });

      toast({
        title: "Success",
        description: "Teacher added successfully!",
      });

      // Reset form and close dialog
      setEmail("");
      setPassword("");
      setDisplayName("");
      setIsDialogOpen(false);
      
      // Refresh teachers list
      fetchTeachers();
    } catch (error: any) {
      console.error("Error adding teacher:", error);
      setError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteTeacher = async (teacherId: string) => {
    if (window.confirm("Are you sure you want to delete this teacher?")) {
      try {
        await deleteDoc(doc(db, "users", teacherId));
        toast({
          title: "Success",
          description: "Teacher deleted successfully!",
        });
        fetchTeachers();
      } catch (error) {
        console.error("Error deleting teacher:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to delete teacher.",
        });
      }
    }
  };

  return (
    <div className="container mx-auto p-4 sm:p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-exam-dark">Manage Teachers</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-exam-primary hover:bg-exam-secondary">Add Teacher</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Teacher</DialogTitle>
              <DialogDescription>
                Create an account for a new teacher. They'll receive access to the teacher dashboard.
              </DialogDescription>
            </DialogHeader>
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <form onSubmit={handleAddTeacher} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="displayName">Full Name</Label>
                <Input
                  id="displayName"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <p className="text-xs text-gray-500">
                  Password must be at least 6 characters.
                </p>
              </div>
              <DialogFooter>
                <Button
                  type="submit"
                  className="bg-exam-primary hover:bg-exam-secondary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                      Adding...
                    </div>
                  ) : (
                    "Add Teacher"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Teachers List</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-exam-primary"></div>
            </div>
          ) : teachers.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No teachers found. Add your first teacher!</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Date Added</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {teachers.map((teacher) => (
                  <TableRow key={teacher.id}>
                    <TableCell className="font-medium">{teacher.displayName}</TableCell>
                    <TableCell>{teacher.email}</TableCell>
                    <TableCell>
                      {teacher.createdAt ? new Date(teacher.createdAt.toDate()).toLocaleDateString() : "N/A"}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteTeacher(teacher.id)}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ManageTeachers;
