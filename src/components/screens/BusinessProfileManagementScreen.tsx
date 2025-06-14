
"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, ArrowLeft, Save, Building, Info, Contact, Image as ImageIcon, Globe, PhoneIcon, Mail } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import type { UserBusinessProfile } from '@/types';
import { initialBusinessProfiles } from '@/app/page'; // To get placeholder data structure

interface BusinessProfileManagementScreenProps {
  businessProfileId: string | number;
  onBack: () => void;
}

// Simulate fetching the detailed profile data
const simulateFetchBusinessProfileForManagement = async (profileId: string | number): Promise<UserBusinessProfile | null> => {
  console.log(`Simulating fetching business profile for management: ${profileId}`);
  // In a real app, this would be an API call.
  // For now, find in the initialBusinessProfiles from page.tsx or return a new structure
  const existingProfile = initialBusinessProfiles.find(p => p.id === profileId);
  if (existingProfile) {
    return Promise.resolve(JSON.parse(JSON.stringify(existingProfile))); // Deep copy
  }
  // If creating a new one, it might not exist in initialBusinessProfiles, so return a default structure.
  // The ID would have been generated in UserBusinessProfilesScreen if it's a truly new one.
  const newProfileTemplate: UserBusinessProfile = {
    id: profileId,
    name: '',
    bio: '',
    isActive: true,
    followers: 0,
    following: 0,
    products: [],
    services: [],
    specialties: [],
    feed: [],
    jobs: [],
    reviews: [],
    // ... other fields initialized to default/empty values
  };
  return Promise.resolve(newProfileTemplate);
};

const simulateUpdateBusinessProfile = async (profileId: string | number, updatedData: Partial<UserBusinessProfile>): Promise<boolean> => {
  console.log(`Simulating updating business profile ${profileId} with data:`, updatedData);
  // In a real app, this would be an API call.
  // For now, just simulate success.
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('Simulated business profile updated successfully.');
      resolve(true);
    }, 1000);
  });
};


const BusinessProfileManagementScreen: React.FC<BusinessProfileManagementScreenProps> = ({ businessProfileId, onBack }) => {
  const { toast } = useToast();
  const [profileData, setProfileData] = useState<UserBusinessProfile | null>(null);
  const [editedData, setEditedData] = useState<Partial<UserBusinessProfile>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (businessProfileId) {
      fetchProfileData(businessProfileId);
    }
  }, [businessProfileId]);

  const fetchProfileData = async (id: string | number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await simulateFetchBusinessProfileForManagement(id);
      if (data) {
        setProfileData(data);
        setEditedData({ ...data }); // Initialize editedData with fetched profile
      } else {
        setError("Business profile not found for management.");
        toast({ title: "Error", description: "Business profile not found.", variant: "destructive" });
      }
    } catch (err) {
      console.error('Error fetching business profile for management:', err);
      setError("Failed to load profile for management.");
      toast({ title: "Error", description: "Failed to load profile for management.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof UserBusinessProfile, value: any) => {
    setEditedData(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveChanges = async () => {
    if (!editedData || !editedData.name) {
      toast({ title: "Validation Error", description: "Business Name is required.", variant: "destructive" });
      return;
    }
    setIsSaving(true);
    try {
      const success = await simulateUpdateBusinessProfile(businessProfileId, editedData);
      if (success) {
        setProfileData(prev => prev ? { ...prev, ...editedData } as UserBusinessProfile : null);
        toast({ title: "Profile Saved", description: `Business profile "${editedData.name}" updated successfully.` });
        // Optionally, call onBack() or navigate, or stay on page
      } else {
        toast({ title: "Save Failed", description: "Could not update business profile.", variant: "destructive" });
      }
    } catch (err) {
      console.error("Error saving profile:", err);
      toast({ title: "Save Error", description: "An unexpected error occurred.", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };
  
  if (loading) {
    return <div className="flex justify-center items-center h-full p-4"><Loader2 className="h-12 w-12 animate-spin text-primary" /><p className="ml-3">Loading profile data...</p></div>;
  }
  if (error) {
    return <div className="p-4 text-center text-destructive">{error} <Button onClick={() => fetchProfileData(businessProfileId)} variant="outline">Try Again</Button></div>;
  }
  if (!profileData || !editedData) { // Ensure editedData is also initialized
    return <div className="p-4 text-center text-muted-foreground">Profile data is not available.</div>;
  }

  const hasChanges = JSON.stringify(profileData) !== JSON.stringify(editedData);

  return (
    <ScrollArea className="h-full bg-background">
      <div className="max-w-4xl mx-auto p-4 sm:p-6 md:p-8">
        <Button variant="outline" onClick={onBack} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Business Profiles
        </Button>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-2xl font-headline flex items-center">
              <Building className="mr-2 h-6 w-6 text-primary"/>
              Manage Business: {editedData.name || "New Profile"}
            </CardTitle>
            <CardDescription>Edit the details for this business profile. Changes are saved locally until you click "Save Changes".</CardDescription>
          </CardHeader>
        </Card>

        <form onSubmit={(e) => { e.preventDefault(); handleSaveChanges(); }}>
          <div className="space-y-8">
            {/* Basic Info Section */}
            <Card>
              <CardHeader><CardTitle className="flex items-center"><Info className="mr-2 h-5 w-5 text-primary"/>Basic Information</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="businessName">Business Name <span className="text-destructive">*</span></Label>
                  <Input id="businessName" value={editedData.name || ''} onChange={(e) => handleInputChange('name', e.target.value)} placeholder="e.g., My Awesome Cafe" />
                </div>
                <div>
                  <Label htmlFor="businessBio">Bio / Description</Label>
                  <Textarea id="businessBio" value={editedData.bio || ''} onChange={(e) => handleInputChange('bio', e.target.value)} placeholder="Tell us about your business..." rows={4} />
                </div>
                <div className="flex items-center space-x-2 pt-2">
                  <Switch id="isActive" checked={!!editedData.isActive} onCheckedChange={(checked) => handleInputChange('isActive', checked)} />
                  <Label htmlFor="isActive">Profile is Active & Searchable</Label>
                </div>
              </CardContent>
            </Card>

            {/* Contact & Location Section */}
            <Card>
              <CardHeader><CardTitle className="flex items-center"><Contact className="mr-2 h-5 w-5 text-primary"/>Contact & Location</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><Label htmlFor="phone">Phone Number</Label><Input id="phone" type="tel" value={editedData.phone || ''} onChange={(e) => handleInputChange('phone', e.target.value)} /></div>
                  <div><Label htmlFor="email">Email Address</Label><Input id="email" type="email" value={editedData.email || ''} onChange={(e) => handleInputChange('email', e.target.value)} /></div>
                </div>
                <div><Label htmlFor="location">Location / Address</Label><Input id="location" value={editedData.location || ''} onChange={(e) => handleInputChange('location', e.target.value)} /></div>
                <div><Label htmlFor="website">Website URL</Label><Input id="website" type="url" value={editedData.website || ''} onChange={(e) => handleInputChange('website', e.target.value)} placeholder="https://example.com"/></div>
              </CardContent>
            </Card>

            {/* Visuals Section */}
            <Card>
              <CardHeader><CardTitle className="flex items-center"><ImageIcon className="mr-2 h-5 w-5 text-primary"/>Visuals</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div><Label htmlFor="logoUrl">Logo URL</Label><Input id="logoUrl" value={editedData.logo || ''} onChange={(e) => handleInputChange('logo', e.target.value)} placeholder="https://link.to/logo.png"/></div>
                <div><Label htmlFor="logoAiHint">Logo AI Hint</Label><Input id="logoAiHint" value={editedData.logoAiHint || ''} onChange={(e) => handleInputChange('logoAiHint', e.target.value)} placeholder="e.g., modern cafe logo"/></div>
                <div><Label htmlFor="coverPhotoUrl">Cover Photo URL</Label><Input id="coverPhotoUrl" value={editedData.coverPhoto || ''} onChange={(e) => handleInputChange('coverPhoto', e.target.value)} placeholder="https://link.to/cover.jpg"/></div>
                <div><Label htmlFor="coverPhotoAiHint">Cover Photo AI Hint</Label><Input id="coverPhotoAiHint" value={editedData.coverPhotoAiHint || ''} onChange={(e) => handleInputChange('coverPhotoAiHint', e.target.value)} placeholder="e.g., bustling cafe interior"/></div>
              </CardContent>
            </Card>
            
            {/* Placeholder for Products Management */}
            <Card>
                <CardHeader><CardTitle>Products/Menu Items</CardTitle></CardHeader>
                <CardContent><p className="text-sm text-muted-foreground">Product management (Add, Edit, Delete) will be enabled in Phase 4.</p></CardContent>
            </Card>

            {/* Placeholder for Services Management */}
            <Card>
                <CardHeader><CardTitle>Services Offered</CardTitle></CardHeader>
                <CardContent><p className="text-sm text-muted-foreground">Service management will be enabled in Phase 4.</p></CardContent>
            </Card>
            
            {/* Placeholder for Jobs Management */}
            <Card>
                <CardHeader><CardTitle>Job Openings</CardTitle></CardHeader>
                <CardContent><p className="text-sm text-muted-foreground">Job posting management will be enabled in Phase 4.</p></CardContent>
            </Card>

            {/* Placeholder for Feed Management */}
            <Card>
                <CardHeader><CardTitle>Business Feed/Posts</CardTitle></CardHeader>
                <CardContent><p className="text-sm text-muted-foreground">Feed post management will be enabled in Phase 4.</p></CardContent>
            </Card>


          </div>

          <CardFooter className="mt-8 p-0 pt-6 border-t">
            <div className="flex justify-end w-full space-x-3">
              <Button type="button" variant="outline" onClick={onBack} disabled={isSaving}>Cancel</Button>
              <Button type="submit" disabled={isSaving || !hasChanges}>
                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <Save className="mr-2 h-4 w-4"/>
                Save Changes
              </Button>
            </div>
          </CardFooter>
        </form>
      </div>
    </ScrollArea>
  );
};

export default BusinessProfileManagementScreen;
