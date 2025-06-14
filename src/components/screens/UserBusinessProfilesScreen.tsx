
"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { PlusCircleIcon, PencilSquareIcon, TrashIcon, XCircleIcon, BuildingOfficeIcon, MagnifyingGlassIcon, ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';
import type { UserBusinessProfile } from '@/types'; 
import { useToast } from "@/hooks/use-toast";
import { cn } from '@/lib/utils';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";


interface UserBusinessProfilesScreenProps {
  businessProfiles: UserBusinessProfile[];
  onSelectProfile: (id: string | number) => void;
  onManageProfile: (id: string | number) => void; 
}

const simulateFetchInitialProfiles = async (initialProfiles: UserBusinessProfile[]): Promise<UserBusinessProfile[]> => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(initialProfiles);
    }, 700); 
  });
};

const UserBusinessProfilesScreen: React.FC<UserBusinessProfilesScreenProps> = ({
  businessProfiles: initialProfilesProp, 
  onSelectProfile,
  onManageProfile,
}) => {
  const [profiles, setProfiles] = useState<UserBusinessProfile[]>([]);
  const [loading, setLoading] = useState(true); 
  const [showForm, setShowForm] = useState(false);
  const [editingProfile, setEditingProfile] = useState<UserBusinessProfile | null>(null);
  const [currentProfile, setCurrentProfile] = useState<Partial<UserBusinessProfile>>({
    products: [], services: [], specialties: [], feed: [], jobs: []
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [profileToDelete, setProfileToDelete] = useState<UserBusinessProfile | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const loadProfiles = async () => {
      setLoading(true);
      const fetchedProfiles = await simulateFetchInitialProfiles(initialProfilesProp);
      setProfiles(fetchedProfiles);
      setLoading(false);
    };
    loadProfiles();
  }, [initialProfilesProp]);


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
      onManageProfile(editingProfile.id);

    } else {
      const newProfileToAdd: UserBusinessProfile = {
        id: Date.now(), 
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
      onManageProfile(newProfileToAdd.id); 
    }
  };

  const handleEdit = (profile: UserBusinessProfile) => {
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
                <BuildingOfficeIcon className="mr-2 h-6 w-6 text-primary" /> My Business Profiles
              </CardTitle>
              <CardDescription>Manage your business listings and presence.</CardDescription>
            </div>
            <Button onClick={() => { resetForm(); setShowForm(true); }} className="w-full sm:w-auto">
              <PlusCircleIcon className="mr-2 h-5 w-5" /> Create New Profile
            </Button>
          </div>
           <div className="mt-4 relative">
            <Input 
              placeholder="Search profiles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
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
                  <XCircleIcon className="mr-2 h-4 w-4" /> Cancel
                </Button>
                <Button type="submit">
                  <PlusCircleIcon className="mr-2 h-4 w-4" /> {editingProfile ? 'Save Changes' : 'Create Profile'}
                </Button>
              </CardFooter>
            </form>
          </CardContent>
        )}

        {!showForm && (
          <CardContent className={filteredProfiles.length > 0 || loading ? "pt-6" : "pt-0"}>
            {loading ? (
              <div className="flex flex-col justify-center items-center py-10 min-h-[200px]">
                 <span className="h-8 w-8 animate-spin border-4 border-primary border-t-transparent rounded-full"></span>
                <p className="ml-2 mt-2 text-muted-foreground">Loading business profiles...</p>
              </div>
            ) : filteredProfiles.length === 0 && !searchTerm ? (
              <div className="text-center py-10 min-h-[200px] flex flex-col items-center justify-center">
                <BuildingOfficeIcon className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-lg text-muted-foreground">No business profiles yet.</p>
                <p className="text-sm text-muted-foreground">Click "Create New Profile" above to add your first business.</p>
              </div>
            ) : filteredProfiles.length === 0 && searchTerm ? (
              <div className="text-center py-10 min-h-[200px] flex flex-col items-center justify-center">
                <MagnifyingGlassIcon className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-lg text-muted-foreground">No profiles found matching "{searchTerm}".</p>
                <p className="text-sm text-muted-foreground">Try a different search term.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredProfiles.map(profile => (
                  <Card 
                    key={profile.id} 
                    className={cn(
                      "transition-all duration-200 ease-in-out hover:shadow-lg hover:border-primary/50", 
                      !profile.isActive && "bg-muted/50 opacity-70"
                    )}
                  >
                    <div className="flex items-start p-4 space-x-4">
                      <Image
                        src={profile.logo || `https://placehold.co/60x60.png?text=${profile.name.substring(0,1)}`}
                        alt={`${profile.name} Logo`}
                        width={60}
                        height={60}
                        className="rounded-md object-cover border flex-shrink-0 cursor-pointer"
                        data-ai-hint={profile.logoAiHint || "company logo"}
                        onClick={() => onSelectProfile(profile.id)}
                      />
                      <div className="flex-grow cursor-pointer" onClick={() => onSelectProfile(profile.id)}>
                        <CardTitle className="text-lg hover:text-primary">{profile.name}</CardTitle>
                        {profile.location && <CardDescription>{profile.location}</CardDescription>}
                        <p className="text-xs text-muted-foreground mt-1">Followers: {profile.followers || 0}</p>
                      </div>
                      <div className="flex flex-col items-end space-y-2">
                        <Switch 
                          checked={!!profile.isActive} 
                          onCheckedChange={() => toggleActive(profile.id)} 
                          aria-label={profile.isActive ? "Deactivate profile" : "Activate profile"} 
                        />
                        <div className="flex space-x-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-accent" onClick={() => handleEdit(profile)}>
                            <PencilSquareIcon className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive hover:bg-destructive/10 h-8 w-8" onClick={() => confirmDelete(profile)}>
                            <TrashIcon className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                    {profile.website && 
                      <CardContent className="pb-3 pt-0">
                          <a href={profile.website} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="text-xs text-primary hover:underline flex items-center">
                              <ArrowTopRightOnSquareIcon className="h-3 w-3 mr-1"/>View Website
                          </a>
                      </CardContent>
                    }
                  </Card>
                ))}
              </div>
            )}
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
