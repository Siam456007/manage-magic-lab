
import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const SettingsPage = () => {
  const { user, logout } = useAuth();
  
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [darkMode, setDarkMode] = useState(user?.preferences?.darkMode || false);
  const [notifications, setNotifications] = useState(user?.preferences?.notifications || true);
  
  const handleUpdateProfile = () => {
    // In a real app, this would update the user profile in the backend
    toast.success("Profile updated successfully");
  };
  
  const handleChangePassword = () => {
    // In a real app, this would send a password reset email
    toast.success("Password reset link sent to your email");
  };
  
  const handleDeleteAccount = () => {
    // In a real app, this would delete the user account
    setIsDeleteDialogOpen(false);
    toast.success("Account deleted successfully");
    logout();
  };

  return (
    <div className="flex h-screen">
      <Sidebar onOpenAddTask={() => {}} />
      
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <Navbar />
        
        <div className="p-4 sm:p-6 overflow-auto custom-scrollbar">
          <div className="mb-6">
            <h1 className="text-2xl font-bold">Settings</h1>
            <p className="text-muted-foreground mt-1">
              Manage your account and preferences
            </p>
          </div>
          
          <Separator className="mb-6" />
          
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="preferences">Preferences</TabsTrigger>
              <TabsTrigger value="account">Account</TabsTrigger>
            </TabsList>
            
            {/* Profile Tab */}
            <TabsContent value="profile" className="space-y-6 animate-fade-in">
              <div className="max-w-md">
                {/* Profile Photo */}
                <div className="mb-6">
                  <Label>Profile Photo</Label>
                  <div className="mt-2 flex items-center gap-4">
                    <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                      {user?.avatar ? (
                        <img 
                          src={user.avatar} 
                          alt={user.name} 
                          className="h-full w-full object-cover" 
                        />
                      ) : (
                        <span className="text-lg font-medium">{user?.name.charAt(0)}</span>
                      )}
                    </div>
                    <Button variant="outline" disabled>
                      Change Photo
                    </Button>
                  </div>
                </div>
                
                {/* Name */}
                <div className="mb-4">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    className="mt-1"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                
                {/* Email */}
                <div className="mb-6">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    className="mt-1"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                
                <Button onClick={handleUpdateProfile}>
                  Save Changes
                </Button>
              </div>
            </TabsContent>
            
            {/* Preferences Tab */}
            <TabsContent value="preferences" className="space-y-6 animate-fade-in">
              <div className="max-w-md">
                <div className="space-y-4">
                  {/* Dark Mode */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Dark Mode</h3>
                      <p className="text-sm text-muted-foreground">
                        Toggle dark mode appearance
                      </p>
                    </div>
                    <Switch
                      checked={darkMode}
                      onCheckedChange={setDarkMode}
                    />
                  </div>
                  
                  {/* Notifications */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Notifications</h3>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications for tasks and deadlines
                      </p>
                    </div>
                    <Switch
                      checked={notifications}
                      onCheckedChange={setNotifications}
                    />
                  </div>
                  
                  <Separator />
                  
                  {/* Task Defaults */}
                  <div>
                    <h3 className="font-medium mb-2">Default Task View</h3>
                    <div className="grid grid-cols-2 gap-2">
                      <Button variant="outline" className="justify-start">
                        Board View
                      </Button>
                      <Button variant="outline" className="justify-start">
                        List View
                      </Button>
                    </div>
                  </div>
                  
                  <Button className="mt-2">
                    Save Preferences
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            {/* Account Tab */}
            <TabsContent value="account" className="space-y-6 animate-fade-in">
              <div className="max-w-md">
                {/* Change Password */}
                <div className="mb-6">
                  <h3 className="font-medium mb-2">Change Password</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    We'll send you an email with a link to change your password
                  </p>
                  <Button variant="outline" onClick={handleChangePassword}>
                    Reset Password
                  </Button>
                </div>
                
                <Separator />
                
                {/* Delete Account */}
                <div className="mt-6">
                  <h3 className="font-medium mb-2">Delete Account</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Permanently delete your account and all of your data
                  </p>
                  <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive">
                        Delete Account
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete your
                          account and remove all of your data from our servers.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleDeleteAccount}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
