
"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, UserCircle, Briefcase, LinkIcon, PlusCircle, Edit2, Trash2, ExternalLink } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import type { TabName, UserDataForSideMenu } from '@/types'; // UserDataForSideMenu might be useful if this screen displays user info
import { cn } from '@/lib/utils';

// Define a type for the overall Professional Profile data
interface OverallProfessionalProfileData {
    id: string; // ID of the overall professional profile
    userId: string; // Link to the user account
    professionalBio?: string; // Overall professional summary
    areasOfExpertise: string[]; // General areas of expertise
    externalProfileLinks: {
        id: string;
        platform: string;
        url: string;
    }[];
    // Add other overall professional profile fields
}

interface ProfessionalProfileScreenProps {
  setActiveTab: (tab: TabName) => void;
  userData: UserDataForSideMenu | null; // To potentially link to the logged-in user
}

// --- Placeholder API Simulation Functions ---
const simulateFetchOverallProfessionalProfile = async (userId: string): Promise<OverallProfessionalProfileData | null> => {
  console.log(`Simulating fetching overall professional profile for User ID: ${userId}`);
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockProfile: OverallProfessionalProfileData = {
          id: `prof-profile-${userId}`,
          userId: userId,
          professionalBio: 'A dedicated and results-oriented professional with a diverse background in various industries. Passionate about leveraging skills to drive innovation and achieve impactful outcomes. Always eager to learn and contribute to challenging projects.',
          areasOfExpertise: ['Project Management', 'Strategic Planning', 'Client Relations', 'Software Development Lifecycle'],
          externalProfileLinks: [
              { id: 'link-1', platform: 'LinkedIn', url: 'https://linkedin.com/in/yourprofile' },
              { id: 'link-2', platform: 'GitHub', url: 'https://github.com/yourusername' },
              { id: 'link-3', platform: 'Portfolio', url: 'https://yourportfolio.com' }
          ],
      };
      console.log('Simulated overall professional profile fetched:', mockProfile);
      resolve(mockProfile);
    }, 1000);
  });
};

const simulateUpdateOverallProfessionalProfile = async (profileData: OverallProfessionalProfileData): Promise<boolean> => {
    console.log('Simulating update of overall professional profile:', profileData);
    return new Promise(resolve => setTimeout(() => resolve(true), 1000));
};


const ProfessionalProfileScreen: React.FC<ProfessionalProfileScreenProps> = ({ setActiveTab, userData }) => {
  const { toast } = useToast();

  const [profileData, setProfileData] = useState<OverallProfessionalProfileData | null>(null);
  const [editedData, setEditedData] = useState<Partial<OverallProfessionalProfileData>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // For managing areas of expertise
  const [currentExpertise, setCurrentExpertise] = useState('');
  
  // For managing external links
  const [currentLinkPlatform, setCurrentLinkPlatform] = useState('');
  const [currentLinkUrl, setCurrentLinkUrl] = useState('');


  useEffect(() => {
    // For now, using a dummy user ID for simulation
    const currentUserId = userData?.email || 'dummy-user-id-123';
    fetchProfileData(currentUserId);
  }, [userData]);

  const fetchProfileData = async (userId: string) => {
    setLoading(true); setError(null);
    try {
      const data = await simulateFetchOverallProfessionalProfile(userId);
      if (data) {
        setProfileData(data);
        setEditedData(JSON.parse(JSON.stringify(data))); // Deep copy for editing
      } else {
        const defaultProfile: OverallProfessionalProfileData = {
            id: `prof-profile-${userId}`, userId, professionalBio: '', areasOfExpertise: [], externalProfileLinks: [],
        };
        setProfileData(defaultProfile);
        setEditedData(JSON.parse(JSON.stringify(defaultProfile)));
        toast({ title: "New Profile", description: "Setting up your professional profile.", variant: "default" });
      }
    } catch (err) {
      console.error('Error fetching overall professional profile:', err);
      setError("Failed to load professional profile.");
      toast({ title: "Error", description: "Failed to load professional profile.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof OverallProfessionalProfileData, value: any) => {
    setEditedData(prev => prev ? { ...prev, [field]: value } : null);
  };
  
  const handleAddExpertise = () => {
    if (currentExpertise.trim() && editedData?.areasOfExpertise) {
        setEditedData(prev => ({
            ...prev,
            areasOfExpertise: [...(prev?.areasOfExpertise || []), currentExpertise.trim()]
        }));
        setCurrentExpertise('');
    }
  };

  const handleRemoveExpertise = (indexToRemove: number) => {
    if (editedData?.areasOfExpertise) {
        setEditedData(prev => ({
            ...prev,
            areasOfExpertise: prev?.areasOfExpertise?.filter((_, index) => index !== indexToRemove)
        }));
    }
  };
  
  const handleAddLink = () => {
    if (currentLinkPlatform.trim() && currentLinkUrl.trim() && editedData?.externalProfileLinks) {
        const newLink = { id: `link-${Date.now()}`, platform: currentLinkPlatform.trim(), url: currentLinkUrl.trim() };
        setEditedData(prev => ({
            ...prev,
            externalProfileLinks: [...(prev?.externalProfileLinks || []), newLink]
        }));
        setCurrentLinkPlatform('');
        setCurrentLinkUrl('');
    }
  };

  const handleRemoveLink = (idToRemove: string) => {
    if (editedData?.externalProfileLinks) {
        setEditedData(prev => ({
            ...prev,
            externalProfileLinks: prev?.externalProfileLinks?.filter(link => link.id !== idToRemove)
        }));
    }
  };

  const handleSave = async () => {
    if (!editedData) return;
    setIsSaving(true);
    try {
      // Ensure all required fields are present if necessary, for now using editedData as is
      const success = await simulateUpdateOverallProfessionalProfile(editedData as OverallProfessionalProfileData);
      if (success) {
        setProfileData(JSON.parse(JSON.stringify(editedData))); // Update original with saved
        toast({ title: "Profile Saved", description: "Your professional profile has been updated." });
      } else {
        toast({ title: "Save Failed", description: "Could not update profile.", variant: "destructive" });
      }
    } catch (err) {
      console.error('Error saving professional profile:', err);
      toast({ title: "Save Error", description: "An unexpected error occurred.", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  const hasChanges = JSON.stringify(profileData) !== JSON.stringify(editedData);

  if (loading) {
    return <div className="flex justify-center items-center h-full p-4"><Loader2 className="h-12 w-12 animate-spin text-primary" /><p className="ml-3 text-muted-foreground">Loading Professional Profile...</p></div>;
  }
  if (error || !editedData) {
    return <div className="p-4 text-center text-destructive">{error || "Profile data unavailable."} <Button onClick={() => fetchProfileData(userData?.email || 'dummy-user-id-123')} variant="outline">Try Again</Button></div>;
  }

  return (
    <ScrollArea className="h-full bg-background">
      <div className="max-w-3xl mx-auto p-4 sm:p-6 md:p-8">
        <Card className="mb-6 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-headline flex items-center">
              <UserCircle className="mr-3 h-7 w-7 text-primary" /> Manage Your Professional Profile
            </CardTitle>
            <CardDescription>
              Present your professional identity. This information helps others understand your overall expertise and background.
            </CardDescription>
          </CardHeader>
        </Card>

        <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="space-y-8">
          <Card>
            <CardHeader><CardTitle className="text-xl">Professional Bio</CardTitle></CardHeader>
            <CardContent>
              <Label htmlFor="professionalBio" className="sr-only">Professional Bio</Label>
              <Textarea
                id="professionalBio"
                placeholder="Write a brief summary of your professional background, skills, and aspirations..."
                value={editedData.professionalBio || ''}
                onChange={(e) => handleInputChange('professionalBio', e.target.value)}
                rows={6}
                className="text-base"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-xl">Areas of Expertise</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {editedData.areasOfExpertise && editedData.areasOfExpertise.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {editedData.areasOfExpertise.map((area, index) => (
                    <div key={index} className="flex items-center bg-secondary text-secondary-foreground px-3 py-1.5 rounded-full text-sm">
                      <span>{area}</span>
                      <Button type="button" variant="ghost" size="icon" className="ml-2 h-5 w-5 text-secondary-foreground hover:bg-secondary/80" onClick={() => handleRemoveExpertise(index)}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
              <div className="flex items-end gap-3">
                <div className="flex-grow space-y-1.5">
                    <Label htmlFor="newExpertise">Add Expertise</Label>
                    <Input
                        id="newExpertise"
                        value={currentExpertise}
                        onChange={(e) => setCurrentExpertise(e.target.value)}
                        placeholder="e.g., Web Development, Graphic Design"
                    />
                </div>
                <Button type="button" onClick={handleAddExpertise} variant="outline" size="icon" aria-label="Add expertise">
                  <PlusCircle className="h-5 w-5" />
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-xl">External Profile Links</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {editedData.externalProfileLinks && editedData.externalProfileLinks.length > 0 && (
                <ul className="space-y-3 mb-4">
                  {editedData.externalProfileLinks.map((link) => (
                    <li key={link.id} className="flex items-center justify-between p-3 border rounded-md bg-muted/30">
                      <div>
                        <span className="font-medium text-foreground">{link.platform}: </span>
                        <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-sm truncate max-w-[200px] sm:max-w-xs inline-block align-bottom">
                           {link.url.replace(/^https?:\/\//, '')} <ExternalLink className="inline h-3 w-3 ml-0.5 opacity-70"/>
                        </a>
                      </div>
                      <Button type="button" variant="ghost" size="icon" className="text-destructive hover:text-destructive hover:bg-destructive/10 h-7 w-7" onClick={() => handleRemoveLink(link.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </li>
                  ))}
                </ul>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-[1fr_2fr_auto] gap-3 items-end">
                <div className="space-y-1.5">
                    <Label htmlFor="linkPlatform">Platform</Label>
                    <Input
                        id="linkPlatform"
                        value={currentLinkPlatform}
                        onChange={(e) => setCurrentLinkPlatform(e.target.value)}
                        placeholder="e.g., LinkedIn, GitHub"
                    />
                </div>
                 <div className="space-y-1.5">
                    <Label htmlFor="linkUrl">URL</Label>
                    <Input
                        id="linkUrl"
                        type="url"
                        value={currentLinkUrl}
                        onChange={(e) => setCurrentLinkUrl(e.target.value)}
                        placeholder="https://..."
                    />
                </div>
                <Button type="button" onClick={handleAddLink} variant="outline" size="icon" aria-label="Add external link" className="sm:mt-[26px]"> {/* Approximate alignment */}
                  <PlusCircle className="h-5 w-5" />
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <CardFooter className="p-0 pt-8 border-t">
            <div className="flex justify-end w-full">
              <Button type="submit" size="lg" disabled={isSaving || !hasChanges}>
                {isSaving && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                {isSaving ? 'Saving Profile...' : 'Save Professional Profile'}
              </Button>
            </div>
          </CardFooter>
        </form>
      </div>
    </ScrollArea>
  );
};

export default ProfessionalProfileScreen;
