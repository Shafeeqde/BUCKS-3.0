
"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { PlusCircleIcon, PencilSquareIcon, TrashIcon, BuildingOfficeIcon, MagnifyingGlassIcon, ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';
import type { UserBusinessProfile } from '@/types';
import { useToast } from "@/hooks/use-toast";
import { cn } from '@/lib/utils';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";


interface UserBusinessProfilesScreenProps {
  businessProfiles: UserBusinessProfile[];
  onSelectProfile: (id: string) => void;
  onManageProfile: (id: string) => void;
  onDeleteProfile: (id: string) => void; 
  onToggleProfileActive: (id: string, newStatus: boolean) => void;
  isLoading: boolean;
}

const UserBusinessProfilesScreen: React.FC<UserBusinessProfilesScreenProps> = ({
  businessProfiles,
  onSelectProfile,
  onManageProfile,
  onDeleteProfile,
  onToggleProfileActive,
  isLoading,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [profileToConfirmDelete, setProfileToConfirmDelete] = useState<UserBusinessProfile | null>(null);
  
  const handleDeleteConfirmation = () => {
    if (!profileToConfirmDelete) return;
    onDeleteProfile(profileToConfirmDelete.id);
    setProfileToConfirmDelete(null);
  };

  const filteredProfiles = businessProfiles.filter(profile =>
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
            <Button onClick={() => onManageProfile('new')} className="w-full sm:w-auto">
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

        <CardContent className={filteredProfiles.length > 0 || isLoading ? "pt-6" : "pt-0"}>
            {isLoading ? (
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
                        <div className="flex items-center space-x-2">
                          <Label htmlFor={`status-${profile.id}`} className="text-xs text-muted-foreground whitespace-nowrap">
                            {profile.isActive ? 'Active' : 'Inactive'}
                          </Label>
                          <Switch
                            id={`status-${profile.id}`}
                            checked={!!profile.isActive}
                            onCheckedChange={(checked) => onToggleProfileActive(profile.id, checked)}
                            aria-label={profile.isActive ? "Deactivate profile" : "Activate profile"}
                          />
                        </div>
                        <div className="flex space-x-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-accent" onClick={() => onManageProfile(profile.id)}>
                            <PencilSquareIcon className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive hover:bg-destructive/10 h-8 w-8" onClick={() => setProfileToConfirmDelete(profile)}>
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
      </Card>
      <AlertDialog open={!!profileToConfirmDelete} onOpenChange={(open) => !open && setProfileToConfirmDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the business profile &quot;{profileToConfirmDelete?.name}&quot;.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setProfileToConfirmDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirmation} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default UserBusinessProfilesScreen;
