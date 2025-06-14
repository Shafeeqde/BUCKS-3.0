
"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { PlusCircle, Edit3, Trash2, XCircle, Building, Search, ExternalLink } from 'lucide-react';
import type { UserBusinessProfile } from '@/types'; // Removed unused imports
import { useToast } from "@/hooks/use-toast";
import { cn } from '@/lib/utils';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';


interface UserBusinessProfilesScreenProps {
  businessProfiles: UserBusinessProfile[];
  onSelectProfile: (id: string | number) => void;
  onManageProfile: (id: string | number) => void; // New prop for navigation to management screen
}

const UserBusinessProfilesScreen: React.FC<UserBusinessProfilesScreenProps> = ({
  businessProfiles: initialProfiles,
  onSelectProfile,
  onManageProfile,
}) => {
  const [profiles, setProfiles] = useState<UserBusinessProfile[]>(initialProfiles);
  const [showForm, setShowForm] = useState(false);
  const [editingProfile, setEditingProfile] = useState<UserBusinessProfile | null>(null);
  const [currentProfile, setCurrentProfile] = useState<Partial<UserBusinessProfile>>({
    products: [], services: [], specialties: [], feed: [], jobs: []
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [profileToDelete, setProfileToDelete] = useState<UserBusinessProfile | null>(null);
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCurrentProfile(prev => ({ ...prev, [name]: value }));
  };
  
  const resetForm = () => {
    setCurrentProfile({ products: [], services: [], specialties: [], feed: [], jobs: [] });
    setEditingProfile(null);
    setShowForm(false);
  };

  const handleSubmit = () => {
    if (!currentProfile.name || !currentProfile.bio) {
      toast({ title: "Missing Fields", description: "Business name and bio are required.", variant: "destructive" });
      return;
    }

    if (editingProfile) {
      const updatedProfiles = profiles.map(p => p.id === editingProfile.id ? { ...editingProfile, ...currentProfile } as UserBusinessProfile : p);
      setProfiles(updatedProfiles);
      toast({ title: "Profile Updated", description: `${currentProfile.name} has been updated.` });
      resetForm();
      // Optionally, navigate to the updated profile's management screen or detail screen
      onManageProfile(editingProfile.id);

    } else {
      const newProfileToAdd: UserBusinessProfile = {
        id: Date.now(), // Using number for simplicity, could be string
        name: currentProfile.name,
        bio: currentProfile.bio,
        logo: currentProfile.logo || `https://placehold.co/80x80.png?text=${currentProfile.name.substring(0,2)}`,
        logoAiHint: 'business logo',
        coverPhoto: currentProfile.coverPhoto,
        coverPhotoAiHint: 'business cover',
        location: currentProfile.location,
        website: currentProfile.website,
        phone: currentProfile.phone,
        email: currentProfile.email,
        isActive: currentProfile.isActive === undefined ? true : currentProfile.isActive,
        followers: 0,
        following: 0,
        products: currentProfile.products || [],
        services: currentProfile.services || [],
        specialties: currentProfile.specialties || [],
        feed: currentProfile.feed || [],
        jobs: currentProfile.jobs || [],
        reviews: currentProfile.reviews || [],
        averageRating: currentProfile.averageRating || 0,
        totalReviews: currentProfile.totalReviews || 0,
      };
      setProfiles(prev => [...prev, newProfileToAdd]);
      toast({ title: "Profile Added", description: `${newProfileToAdd.name} has been added. You can now manage its details.` });
      resetForm();
      onManageProfile(newProfileToAdd.id); // Navigate to manage the newly created profile
    }
  };

  const handleEdit = (profile: UserBusinessProfile) => {
    // Instead of setting editingProfile here, directly navigate to the management screen
    onManageProfile(profile.id);
  };

  const confirmDelete = (profile: UserBusinessProfile) => {
    setProfileToDelete(profile);
  };

  const executeDelete = () => {
    if (profileToDelete) {
      setProfiles(profiles.filter(p => p.id !== profileToDelete.id));
      toast({ title: "Profile Deleted", description: `${profileToDelete.name} has been deleted.`, variant: "destructive" });
      setProfileToDelete(null);
    }
  };

  const toggleActive = (profileId: string | number) => {
    // Here, you'd typically make an API call to update the backend
    // For simulation, we update local state and show a toast
    setProfiles(profiles.map(p => {
      if (p.id === profileId) {
        const updatedProfile = { ...p, isActive: !p.isActive };
        toast({ title: "Status Updated", description: `${updatedProfile.name} is now ${updatedProfile.isActive ? 'active' : 'inactive'}.`});
        return updatedProfile;
      }
      return p;
    }));
  };
  
  const filteredProfiles = profiles.filter(profile => 
    profile.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (profile.bio && profile.bio.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (profile.location && profile.location.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 h-full overflow-y-auto custom-scrollbar">
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle className="text-2xl font-headline flex items-center">
                <Building className="mr-2 h-6 w-6 text-primary" /> My Business Profiles
              </CardTitle>
              <CardDescription>Manage your business listings and presence.</CardDescription>
            </div>
            <Button onClick={() => { resetForm(); setShowForm(true); }} className="w-full sm:w-auto">
              <PlusCircle className="mr-2 h-5 w-5" /> Create New Profile
            </Button>
          </div>
           <div className="mt-4 relative">
            <Input 
              placeholder="Search profiles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          </div>
        </CardHeader>

        {showForm && (
          <CardContent className="border-t pt-6">
            <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="space-y-6">
              <h3 className="text-lg font-semibold text-foreground">{editingProfile ? 'Edit Business Profile' : 'Create New Business Profile'}</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="profileName">Business Name <span className="text-destructive">*</span></Label>
                  <Input id="profileName" name="name" value={currentProfile.name || ''} onChange={handleInputChange} required />
                </div>
                 <div className="space-y-2">
                  <Label htmlFor="profileLocation">Location</Label>
                  <Input id="profileLocation" name="location" value={currentProfile.location || ''} onChange={handleInputChange} />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="profileBio">Bio / Description <span className="text-destructive">*</span></Label>
                <Textarea id="profileBio" name="bio" value={currentProfile.bio || ''} onChange={handleInputChange} rows={3} required />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="profileLogo">Logo URL</Label>
                  <Input id="profileLogo" name="logo" value={currentProfile.logo || ''} onChange={handleInputChange} placeholder="https://..." />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="profileCoverPhoto">Cover Photo URL</Label>
                  <Input id="profileCoverPhoto" name="coverPhoto" value={currentProfile.coverPhoto || ''} onChange={handleInputChange} placeholder="https://..." />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="profileWebsite">Website URL</Label>
                  <Input id="profileWebsite" name="website" value={currentProfile.website || ''} onChange={handleInputChange} placeholder="https://..." />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="profilePhone">Phone Number</Label>
                  <Input id="profilePhone" name="phone" value={currentProfile.phone || ''} onChange={handleInputChange} />
                </div>
                 <div className="space-y-2">
                  <Label htmlFor="profileEmail">Email Address</Label>
                  <Input id="profileEmail" name="email" type="email" value={currentProfile.email || ''} onChange={handleInputChange} />
                </div>
              </div>
              
              <div className="flex items-center space-x-2 pt-2">
                <Switch id="profileIsActive" name="isActive" checked={currentProfile.isActive === undefined ? true : currentProfile.isActive} onCheckedChange={(checked) => setCurrentProfile(prev => ({...prev, isActive: checked}))} />
                <Label htmlFor="profileIsActive">Profile is Active</Label>
              </div>
              <CardFooter className="p-0 pt-6 flex justify-end space-x-3">
                <Button variant="outline" type="button" onClick={resetForm}>
                  <XCircle className="mr-2 h-4 w-4" /> Cancel
                </Button>
                <Button type="submit">
                  <PlusCircle className="mr-2 h-4 w-4" /> {editingProfile ? 'Save Changes' : 'Create Profile'}
                </Button>
              </CardFooter>
            </form>
          </CardContent>
        )}

        {!showForm && (
          <CardContent className={filteredProfiles.length > 0 ? "pt-6" : "pt-0"}>
            {filteredProfiles.length === 0 && !searchTerm && (
              <p className="text-center text-muted-foreground py-6">No business profiles created yet. Click "Create New Profile" to get started.</p>
            )}
            {filteredProfiles.length === 0 && searchTerm && (
              <p className="text-center text-muted-foreground py-6">No profiles found matching your search.</p>
            )}
            <div className="space-y-4">
              {filteredProfiles.map(profile => (
                <Card key={profile.id} className={cn("transition-all", !profile.isActive && "bg-muted/50 opacity-70")}>
                  <div className="flex items-start p-4 space-x-4">
                    <Image
                      src={profile.logo || `https://placehold.co/60x60.png?text=${profile.name.substring(0,1)}`}
                      alt={`${profile.name} Logo`}
                      width={60}
                      height={60}
                      className="rounded-md object-cover border flex-shrink-0"
                      data-ai-hint={profile.logoAiHint || "company logo"}
                      onClick={() => onSelectProfile(profile.id)}
                    />
                    <div className="flex-grow" onClick={() => onSelectProfile(profile.id)}>
                      <CardTitle className="text-lg hover:text-primary cursor-pointer">{profile.name}</CardTitle>
                      {profile.location && <CardDescription>{profile.location}</CardDescription>}
                      <p className="text-xs text-muted-foreground mt-1">Followers: {profile.followers || 0}</p>
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                      <Switch 
                        checked={!!profile.isActive} 
                        onCheckedChange={(e) => toggleActive(profile.id)} 
                        aria-label={profile.isActive ? "Deactivate profile" : "Activate profile"} 
                      />
                      <div className="flex space-x-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(profile)}>
                          <Edit3 className="h-4 w-4" />
                        </Button>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive h-8 w-8" onClick={() => confirmDelete(profile)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                      </div>
                    </div>
                  </div>
                  {profile.website && 
                    <CardContent className="pb-3 pt-0">
                        <a href={profile.website} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="text-xs text-primary hover:underline flex items-center">
                            <ExternalLink className="h-3 w-3 mr-1"/>View Website
                        </a>
                    </CardContent>
                  }
                </Card>
              ))}
            </div>
          </CardContent>
        )}
      </Card>
      <AlertDialog open={!!profileToDelete} onOpenChange={(open) => !open && setProfileToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the business profile &quot;{profileToDelete?.name}&quot;.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setProfileToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={executeDelete} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default UserBusinessProfilesScreen;
