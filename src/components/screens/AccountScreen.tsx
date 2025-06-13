
"use client";

import React from 'react';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from "@/hooks/use-toast";
import { Loader2, User, Edit3, LogOut } from 'lucide-react';
import type { UserProfile } from '@/types';

interface AccountScreenProps {
  onLogout: () => void;
  userRole: 'rider' | 'driver' | null; // To display role information
}

const AccountScreen: React.FC<AccountScreenProps> = ({ onLogout, userRole }) => {
  const { toast } = useToast();
  const [profile, setProfile] = useState<UserProfile>({ name: 'Demo User', email: 'demo@example.com', phone: '9876543210', address: '123 Main St, Anytown' });
  const [isEditing, setIsEditing] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async () => {
    if (!profile.name || !profile.email) {
      toast({
        title: "Missing Information",
        description: "Please enter your name and email.",
        variant: "destructive",
      });
      return;
    }
    setIsSavingProfile(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      const response = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Failed to save profile.');

      toast({
        title: "Profile Saved!",
        description: "Your profile information has been updated.",
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving profile:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Could not save profile.",
        variant: "destructive",
      });
    } finally {
      setIsSavingProfile(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6 overflow-y-auto h-full custom-scrollbar">
      <Card className="shadow-lg">
        <CardHeader className="text-center">
          <div className="mx-auto w-24 h-24 rounded-full bg-muted flex items-center justify-center mb-4 border-2 border-primary">
            <User className="w-12 h-12 text-primary" />
          </div>
          <CardTitle className="text-2xl font-headline">{isEditing ? "Edit Profile" : profile.name}</CardTitle>
          <CardDescription>{profile.email} {userRole && `(${userRole.charAt(0).toUpperCase() + userRole.slice(1)})`}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {!isEditing ? (
            <>
              <div className="space-y-1">
                <Label className="text-sm text-muted-foreground">Full Name</Label>
                <p className="text-lg text-foreground">{profile.name}</p>
              </div>
              <div className="space-y-1">
                <Label className="text-sm text-muted-foreground">Email Address</Label>
                <p className="text-lg text-foreground">{profile.email}</p>
              </div>
              <div className="space-y-1">
                <Label className="text-sm text-muted-foreground">Phone Number</Label>
                <p className="text-lg text-foreground">{profile.phone || 'Not provided'}</p>
              </div>
              <div className="space-y-1">
                <Label className="text-sm text-muted-foreground">Address</Label>
                <p className="text-lg text-foreground whitespace-pre-line">{profile.address || 'Not provided'}</p>
              </div>
              <Button className="w-full mt-6" onClick={() => setIsEditing(true)}>
                <Edit3 className="mr-2 h-4 w-4" /> Edit Profile
              </Button>
            </>
          ) : (
            <>
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" name="name" placeholder="Full Name" value={profile.name} onChange={handleProfileChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" name="email" type="email" placeholder="Email" value={profile.email} onChange={handleProfileChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" name="phone" type="tel" placeholder="Phone (Optional)" value={profile.phone} onChange={handleProfileChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <textarea
                  id="address"
                  name="address"
                  rows={3}
                  placeholder="Your address"
                  value={profile.address || ''}
                  onChange={handleProfileChange}
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-2 mt-6">
                <Button variant="outline" className="w-full sm:w-auto" onClick={() => setIsEditing(false)} disabled={isSavingProfile}>
                  Cancel
                </Button>
                <Button className="w-full sm:flex-1" onClick={handleSaveProfile} disabled={isSavingProfile}>
                  {isSavingProfile && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isSavingProfile ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </>
          )}
        </CardContent>
        <CardFooter>
           <Button variant="destructive" className="w-full mt-4" onClick={onLogout}>
            <LogOut className="mr-2 h-4 w-4" /> Logout
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AccountScreen;
