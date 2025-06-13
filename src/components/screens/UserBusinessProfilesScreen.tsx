
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
import type { UserBusinessProfile, BusinessProduct, BusinessJob, BusinessFeedItem } from '@/types';
import { useToast } from "@/hooks/use-toast";
import { cn } from '@/lib/utils';

interface UserBusinessProfilesScreenProps {
  businessProfiles: UserBusinessProfile[];
  onSelectProfile: (id: string | number) => void;
  // In a real app, these would come from a context or props to update global state
  // For now, managing locally to demonstrate CRUD UI
}

const UserBusinessProfilesScreen: React.FC<UserBusinessProfilesScreenProps> = ({
  businessProfiles: initialProfiles,
  onSelectProfile,
}) => {
  const [profiles, setProfiles] = useState<UserBusinessProfile[]>(initialProfiles);
  const [showForm, setShowForm] = useState(false);
  const [editingProfile, setEditingProfile] = useState<UserBusinessProfile | null>(null);
  const [currentProfile, setCurrentProfile] = useState<Partial<UserBusinessProfile>>({
    products: [], services: [], specialties: [], feed: [], jobs: []
  });
  const [searchTerm, setSearchTerm] = useState('');
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
      setProfiles(profiles.map(p => p.id === editingProfile.id ? { ...p, ...currentProfile } as UserBusinessProfile : p));
      toast({ title: "Profile Updated", description: `${currentProfile.name} has been updated.` });
    } else {
      const newProfileToAdd: UserBusinessProfile = {
        id: Date.now().toString(),
        name: currentProfile.name,
        bio: currentProfile.bio,
        logo: currentProfile.logo || `https://placehold.co/80x80.png?text=${currentProfile.name.substring(0,2)}`,
        logoAiHint: 'business logo',
        coverPhoto: currentProfile.coverPhoto,
        coverPhotoAiHint: 'business cover',
        location: currentProfile.location,
        website: currentProfile.website,
        phone: currentProfile.phone,
        isActive: currentProfile.isActive === undefined ? true : currentProfile.isActive,
        followers: 0,
        following: 0,
        products: currentProfile.products || [],
        services: currentProfile.services || [],
        specialties: currentProfile.specialties || [],
        feed: currentProfile.feed || [],
        jobs: currentProfile.jobs || []
      };
      setProfiles([...profiles, newProfileToAdd]);
      toast({ title: "Profile Added", description: `${newProfileToAdd.name} has been added.` });
    }
    resetForm();
  };

  const handleEdit = (profile: UserBusinessProfile) => {
    setEditingProfile(profile);
    setCurrentProfile(profile);
    setShowForm(true);
  };

  const handleDelete = (profileId: string | number) => {
    setProfiles(profiles.filter(p => p.id !== profileId));
    toast({ title: "Profile Deleted", variant: "destructive" });
  };

  const toggleActive = (profileId: string | number) => {
    setProfiles(profiles.map(p => p.id === profileId ? { ...p, isActive: !p.isActive } : p));
  };
  
  const filteredProfiles = profiles.filter(profile => 
    profile.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    profile.bio.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
              </div>
              {/* Add more fields like license, documentUrl, specialties, services if needed in simplified form */}
              
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
                <Card key={profile.id} className={cn("transition-all hover:shadow-md cursor-pointer", !profile.isActive && "bg-muted/50 opacity-70")} onClick={() => onSelectProfile(profile.id)}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start space-x-4">
                       <Image
                        src={profile.logo || `https://placehold.co/60x60.png?text=${profile.name.substring(0,1)}`}
                        alt={`${profile.name} Logo`}
                        width={60}
                        height={60}
                        className="rounded-md object-cover border"
                        data-ai-hint={profile.logoAiHint || "company logo"}
                      />
                      <div className="flex-grow">
                        <CardTitle className="text-lg hover:text-primary">{profile.name}</CardTitle>
                        {profile.location && <CardDescription>{profile.location}</CardDescription>}
                         <p className="text-xs text-muted-foreground mt-1">Followers: {profile.followers || 0}</p>
                      </div>
                       <Switch checked={profile.isActive} onCheckedChange={(e) => { e.stopPropagation(); toggleActive(profile.id); }} aria-label={profile.isActive ? "Deactivate profile" : "Activate profile"} />
                    </div>
                  </CardHeader>
                  <CardContent className="pb-4">
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{profile.bio}</p>
                    {profile.website && <a href={profile.website} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="text-xs text-primary hover:underline flex items-center"><ExternalLink className="h-3 w-3 mr-1"/>View Website</a>}
                  </CardContent>
                  <CardFooter className="flex justify-end space-x-2 pt-3 border-t">
                    <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); handleEdit(profile); }}>
                      <Edit3 className="mr-1 h-4 w-4" /> Edit
                    </Button>
                    <Button variant="destructive" size="sm" onClick={(e) => { e.stopPropagation(); handleDelete(profile.id); }}>
                      <Trash2 className="mr-1 h-4 w-4" /> Delete
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default UserBusinessProfilesScreen;
