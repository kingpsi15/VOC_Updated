import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";

const UserProfile = () => {
  const { user, updateProfile, updatePassword } = useAuth();
  const { toast } = useToast();
  
  const [profileData, setProfileData] = useState({
    name: user?.username || '',
    email: user?.email || '',
  });
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };
  
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };
  
  const validateProfileForm = () => {
    let valid = true;
    const newErrors = { ...errors };
    
    if (!profileData.name.trim()) {
      newErrors.name = 'Name is required';
      valid = false;
    }
    
    if (!profileData.email.trim()) {
      newErrors.email = 'Email is required';
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(profileData.email)) {
      newErrors.email = 'Email is invalid';
      valid = false;
    }
    
    setErrors(newErrors);
    return valid;
  };
  
  const validatePasswordForm = () => {
    let valid = true;
    const newErrors = { ...errors };
    
    if (!passwordData.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
      valid = false;
    }
    
    if (!passwordData.newPassword) {
      newErrors.newPassword = 'New password is required';
      valid = false;
    } else if (passwordData.newPassword.length < 6) {
      newErrors.newPassword = 'Password must be at least 6 characters';
      valid = false;
    }
    
    if (!passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
      valid = false;
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      valid = false;
    }
    
    setErrors(newErrors);
    return valid;
  };
  
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateProfileForm()) return;
    
    try {
      await updateProfile(profileData);
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validatePasswordForm()) return;
    
    try {
      await updatePassword(
        passwordData.currentPassword,
        passwordData.newPassword
      );
      
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      
      toast({
        title: "Password Updated",
        description: "Your password has been changed successfully.",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Failed to update password. Please check your current password.",
        variant: "destructive",
      });
    }
  };
  
  return (
    <div className="flex justify-center items-start p-6">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-2xl">User Profile</CardTitle>
          <CardDescription>
            Manage your account details and password
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="details">Profile Details</TabsTrigger>
              <TabsTrigger value="password">Change Password</TabsTrigger>
            </TabsList>
            
            <TabsContent value="details">
              <form onSubmit={handleProfileSubmit}>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Username</Label>
                    <Input
                      id="name"
                      name="name"
                      value={profileData.name}
                      onChange={handleProfileChange}
                      placeholder="Enter your username"
                    />
                    {errors.name && (
                      <p className="text-sm text-red-500">{errors.name}</p>
                    )}
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={profileData.email}
                      onChange={handleProfileChange}
                      placeholder="Enter your email"
                    />
                    {errors.email && (
                      <p className="text-sm text-red-500">{errors.email}</p>
                    )}
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="role">Role</Label>
                    <Input
                      id="role"
                      value={user?.role || ''}
                      disabled
                      className="bg-gray-100"
                    />
                    <p className="text-sm text-gray-500">Role cannot be changed</p>
                  </div>
                </div>
                
                <Button type="submit" className="w-full">Save Changes</Button>
              </form>
            </TabsContent>
            
            <TabsContent value="password">
              <form onSubmit={handlePasswordSubmit}>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input
                      id="currentPassword"
                      name="currentPassword"
                      type="password"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      placeholder="Enter current password"
                    />
                    {errors.currentPassword && (
                      <p className="text-sm text-red-500">{errors.currentPassword}</p>
                    )}
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input
                      id="newPassword"
                      name="newPassword"
                      type="password"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      placeholder="Enter new password"
                    />
                    {errors.newPassword && (
                      <p className="text-sm text-red-500">{errors.newPassword}</p>
                    )}
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      placeholder="Confirm new password"
                    />
                    {errors.confirmPassword && (
                      <p className="text-sm text-red-500">{errors.confirmPassword}</p>
                    )}
                  </div>
                </div>
                
                <Button type="submit" className="w-full">Change Password</Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-between border-t pt-5">
          <p className="text-sm text-gray-500">
            {user?.role === 'admin' ? 'Admin Account' : 'Employee Account'}
          </p>
          <p className="text-sm text-gray-500">
            User ID: {user?.id || 'N/A'}
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default UserProfile; 