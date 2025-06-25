
"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { PlusCircleIcon, PencilSquareIcon, RocketLaunchIcon, MagnifyingGlassIcon, TrashIcon } from '@heroicons/react/24/outline';
import type { TabName, SkillsetProfileSummary, UserDataForSideMenu } from '@/types';
import { useToast } from "@/hooks/use-toast";
import { cn } from '@/lib/utils';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useAuth } from '@/context/AuthContext';


interface UserSkillsetsScreenProps {
  setActiveTab: (tab: TabName) => void;
  onManageSkillsetProfile: (skillsetProfileId: string) => void;
}

const UserSkillsetsScreen: React.FC<UserSkillsetsScreenProps> = ({ setActiveTab, onManageSkillsetProfile }) => {
  const { toast } = useToast();
  const { user } = useAuth(); // Get user from AuthContext

  const [newSkillsetName, setNewSkillsetName] = useState('');
  const [skillsetProfiles, setSkillsetProfiles] = useState<SkillsetProfileSummary[]>([]);
  const [loadingProfiles, setLoadingProfiles] = useState(true);
  const [creatingProfile, setCreatingProfile] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const [skillsetToDeleteId, setSkillsetToDeleteId] = useState<string | null>(null);
  const [skillsetToDeleteName, setSkillsetToDeleteName] = useState<string | null>(null);


  const fetchUserSkillsetProfiles = async () => {
    if (!user) {
      setLoadingProfiles(false);
      return;
    }
    setLoadingProfiles(true);
    try {
      const response = await fetch(`/api/skillset-profiles?userId=${user.id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch skillset profiles.');
      }
      const data = await response.json();
      setSkillsetProfiles(data);
    } catch (error) {
      console.error('Error fetching skillset profiles:', error);
      toast({ title: 'Error Fetching Profiles', description: 'Could not load skillset profiles.', variant: 'destructive' });
    } finally {
      setLoadingProfiles(false);
    }
  };

  useEffect(() => {
    fetchUserSkillsetProfiles();
  }, [user]);


  const handleCreateNewProfile = async () => {
    if (!newSkillsetName.trim()) {
      toast({ title: "Missing Name", description: "Please enter a name for the new skillset profile.", variant: "destructive" });
      return;
    }
    if (!user) {
        toast({ title: "Not Logged In", description: "You must be logged in to create a profile.", variant: "destructive"});
        return;
    }
    setCreatingProfile(true);
    try {
      const response = await fetch('/api/skillset-profiles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            skillName: newSkillsetName, 
            userId: user.id,
            userName: user.name,
            userAvatarUrl: user.avatarUrl,
            userAvatarAiHint: user.avatarAiHint,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create profile.');
      }

      const newProfile = await response.json();
      setSkillsetProfiles(prev => [...prev, newProfile]);
      toast({ title: "Profile Created", description: `Skillset profile "${newProfile.skillName}" created. You can now manage its details.` });
      setNewSkillsetName('');
      onManageSkillsetProfile(newProfile.id);
    } catch (error) {
      console.error('Error creating skillset profile:', error);
      toast({ title: 'Creation Failed', description: 'Could not create skillset profile.', variant: 'destructive' });
    } finally {
      setCreatingProfile(false);
    }
  };

  const handleToggleActive = async (profileId: string, currentStatus: boolean) => {
    try {
        const response = await fetch(`/api/skillset-profiles/${profileId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ isActive: !currentStatus }),
        });

        if (!response.ok) {
            throw new Error('Failed to update status.');
        }

        setSkillsetProfiles(prev => prev.map(p => p.id === profileId ? { ...p, isActive: !currentStatus } : p));
        toast({ title: "Status Updated", description: `Profile status changed to ${!currentStatus ? 'Active' : 'Inactive'}.` });
    } catch (error) {
         toast({ title: 'Update Failed', description: 'Could not update profile status.', variant: 'destructive' });
    }
  };

  const openDeleteConfirmation = (profileId: string, profileName: string) => {
    setSkillsetToDeleteId(profileId);
    setSkillsetToDeleteName(profileName);
  };

  const executeDeleteProfile = async () => {
    if (!skillsetToDeleteId || !skillsetToDeleteName) return;
    
    try {
        const response = await fetch(`/api/skillset-profiles/${skillsetToDeleteId}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error('Failed to delete profile.');
        }
        setSkillsetProfiles(prev => prev.filter(p => p.id !== skillsetToDeleteId));
        toast({ title: "Profile Deleted", description: `Skillset profile "${skillsetToDeleteName}" has been deleted.`, variant: "destructive" });
    } catch (error) {
        toast({ title: 'Deletion Failed', description: 'Could not delete profile.', variant: 'destructive' });
    }
    
    setSkillsetToDeleteId(null);
    setSkillsetToDeleteName(null);
  };

  const filteredProfiles = skillsetProfiles.filter(profile =>
    profile.skillName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (profile.skillLevel && profile.skillLevel.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <>
      <div className="max-w-4xl mx-auto p-4 sm:p-6 h-full overflow-y-auto custom-scrollbar">
        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <CardTitle className="text-2xl font-headline flex items-center">
                  <RocketLaunchIcon className="mr-2 h-6 w-6 text-primary" /> My Skillset Profiles
                </CardTitle>
                <CardDescription>Manage your professional service profiles.</CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="border-t pt-6">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-lg">Create New Skillset Profile</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="newSkillsetName">Skill/Service Name</Label>
                  <Input
                    id="newSkillsetName"
                    value={newSkillsetName}
                    onChange={(e) => setNewSkillsetName(e.target.value)}
                    placeholder="e.g., Plumbing Services, Graphic Design"
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleCreateNewProfile} disabled={creatingProfile || !newSkillsetName.trim()} className="w-full sm:w-auto">
                  {creatingProfile ? <span className="mr-2 h-4 w-4 animate-spin border-2 border-primary-foreground border-t-transparent rounded-full"></span> : <PlusCircleIcon className="mr-2 h-4 w-4" />}
                  {creatingProfile ? 'Creating...' : 'Create & Manage Profile'}
                </Button>
              </CardFooter>
            </Card>

            <div className="mt-8">
              <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold text-foreground">Your Existing Profiles</h3>
                  <div className="relative w-full sm:w-64">
                      <Input
                      placeholder="Search profiles..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                      />
                      <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  </div>
              </div>

              {loadingProfiles ? (
                <div className="flex flex-col justify-center items-center py-10 min-h-[200px]">
                  <span className="h-8 w-8 animate-spin border-4 border-primary border-t-transparent rounded-full"></span>
                  <p className="ml-2 mt-2 text-muted-foreground">Loading your skillset profiles...</p>
                </div>
              ) : filteredProfiles.length === 0 ? (
                <div className="text-center py-10 min-h-[200px] flex flex-col items-center justify-center">
                  <RocketLaunchIcon className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-lg text-muted-foreground">
                    {searchTerm ? 'No profiles found matching your search.' : 'No skillset profiles yet.'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {searchTerm ? 'Try a different search term.' : 'Create your first skillset profile using the form above!'}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredProfiles.map(profile => (
                    <Card key={profile.id} className={cn("transition-all hover:shadow-md", !profile.isActive && "bg-muted/50 opacity-80")}>
                      <CardHeader className="pb-3">
                        <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
                          <div>
                            <CardTitle
                              className="text-lg hover:text-primary cursor-pointer"
                              onClick={() => onManageSkillsetProfile(profile.id)}
                              onKeyDown={(e) => e.key === 'Enter' && onManageSkillsetProfile(profile.id)}
                              tabIndex={0}
                              role="button"
                              aria-label={`Manage ${profile.skillName}`}
                            >
                              {profile.skillName}
                            </CardTitle>
                            {profile.skillLevel && <CardDescription>{profile.skillLevel}</CardDescription>}
                          </div>
                          <div className="flex items-center space-x-3 mt-2 sm:mt-0">
                              <Label htmlFor={`status-${profile.id}`} className="text-xs text-muted-foreground whitespace-nowrap">
                                  {profile.isActive ? 'Active' : 'Inactive'}
                              </Label>
                              <Switch
                                  id={`status-${profile.id}`}
                                  checked={profile.isActive}
                                  onCheckedChange={() => handleToggleActive(profile.id, profile.isActive)}
                                  aria-label={profile.isActive ? "Deactivate profile" : "Activate profile"}
                              />
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pb-4 text-sm text-muted-foreground">
                          {profile.portfolioItemCount !== undefined && <p>Portfolio Items: {profile.portfolioItemCount}</p>}
                          {profile.averageRating !== undefined && <p>Avg. Rating: {profile.averageRating.toFixed(1)} ★</p>}
                      </CardContent>
                      <CardFooter className="flex justify-end space-x-2 pt-3 border-t">
                        <Button variant="outline" size="sm" onClick={() => onManageSkillsetProfile(profile.id)}>
                          <PencilSquareIcon className="mr-1 h-4 w-4" /> Manage Details
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => openDeleteConfirmation(profile.id, profile.skillName)}>
                          <TrashIcon className="mr-1 h-4 w-4" /> Delete
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <AlertDialog open={!!skillsetToDeleteId} onOpenChange={(open) => { if (!open) { setSkillsetToDeleteId(null); setSkillsetToDeleteName(null); }}}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the skillset profile
              "{skillsetToDeleteName || 'this profile'}" and all its associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => { setSkillsetToDeleteId(null); setSkillsetToDeleteName(null); }}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={executeDeleteProfile} className="bg-destructive hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default UserSkillsetsScreen;
