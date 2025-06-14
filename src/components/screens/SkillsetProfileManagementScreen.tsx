
"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, ArrowLeft, PlusCircle, Edit2, Trash2, Image as ImageIcon, Link as LinkIcon } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import type { TabName, SkillsetProfileData, SkillsetSpecificWorkExperience, SkillsetSpecificPortfolioItem, SkillsetSpecificFeedItem } from '@/types';
import Image from 'next/image'; // For displaying portfolio/feed images
import { cn } from '@/lib/utils';

// Local interface for form data - can be slightly different from SkillsetProfileData if needed for editing
interface SkillsetProfileFormData {
  id: string;
  skillName: string;
  skillLevel: string;
  skillDescription?: string;
  isActive: boolean;
  userName: string; // Usually display-only
  userAvatarUrl?: string; // Usually display-only
  professionalTitle?: string; // User's overall title, display-only
  skillSpecificBio?: string;
  contactInfo?: {
    phone?: string;
    email?: string;
    website?: string;
    location?: string;
  };
  workExperienceEntries: SkillsetSpecificWorkExperience[];
  portfolioItems: SkillsetSpecificPortfolioItem[];
  professionalFeed?: SkillsetSpecificFeedItem[];
}


interface SkillsetProfileManagementScreenProps {
  setActiveTab: (tab: TabName) => void;
  skillsetProfileId: string;
  onBack: () => void;
  // onSaveProfile: (skillsetProfileId: string, updatedData: SkillsetProfileData) => Promise<boolean>; // More specific type
}

const simulateFetchSkillsetProfileForManagement = async (skillsetProfileId: string): Promise<SkillsetProfileData | null> => {
  console.log(`Simulating fetching skillset profile for management for ID: ${skillsetProfileId}`);
  return new Promise((resolve) => {
    setTimeout(() => {
      if (skillsetProfileId === 'plumbing-profile-johndoe-123') {
        resolve({
          id: skillsetProfileId,
          skillName: 'Plumbing Services', skillLevel: 'Certified Professional', skillDescription: 'Providing reliable and efficient plumbing solutions.',
          userName: 'John Doe', userAvatarUrl: 'https://placehold.co/100x100.png', userAvatarAiHint: 'man plumber', professionalTitle: 'Master Plumber',
          skillSpecificBio: 'Over 10 years of experience in residential and commercial plumbing. Committed to quality workmanship and customer satisfaction.',
          contactInfo: { phone: '+1 123 456 7890', email: 'john.doe.plumber@example.com', location: 'Local Service Area', website: 'https://plumbing.johndoe.com' },
          workExperienceEntries: [
            { id: 'pw1', title: 'Lead Plumber', company: 'Local Plumbing Co.', years: '2015 - Present', description: 'Managed plumbing installations, repairs, and client consultations for residential and commercial projects.' },
            { id: 'pw2', title: 'Apprentice Plumber', company: 'Pro Plumb Apprenticeships', years: '2013 - 2015', description: 'Assisted senior plumbers, learned pipe fitting, fixture installation, and diagnostic techniques.' },
          ],
          portfolioItems: [
            { id: 'pp1', title: 'Bathroom Renovation Project', imageUrl: 'https://placehold.co/600x400.png', imageAiHint: 'modern bathroom', description: 'Full plumbing overhaul for a luxury bathroom remodel.', link: '#' },
            { id: 'pp2', title: 'Commercial Kitchen Installation', imageUrl: 'https://placehold.co/600x400.png', imageAiHint: 'kitchen pipes', description: 'Designed and implemented the plumbing system for a new restaurant.', link: '#' },
          ],
          professionalFeed: [
            { id: 'pf1', content: 'Tips for preventing winter pipe bursts!', timestamp: '2023-12-01', imageUrl: 'https://placehold.co/400x200.png', imageAiHint: 'frozen pipe' },
            { id: 'pf2', content: 'Completed a major kitchen plumbing job for "The Gourmet Spot".', timestamp: '2023-11-15' },
          ],
          reviews: [
            { id: 'pr1', reviewerName: 'Homeowner A', rating: 5, comment: 'Fixed my leaky faucet quickly and affordably!', date: '2023-11-01' },
            { id: 'pr2', reviewerName: 'Business Owner B', rating: 4, comment: 'Reliable service for our office plumbing.', date: '2023-10-25' },
          ],
          recommendationsCount: 30, averageRating: 4.9, totalReviews: 15,
        });
      } else if (skillsetProfileId === 'jenson-interior-stylist-123') {
        resolve({
            id: skillsetProfileId, skillName: 'Interior Home Styling by Jenson', skillLevel: 'Lead Stylist & Consultant', skillDescription: 'Transforming spaces into beautiful, functional, and personalized environments.',
            userName: 'Jenson Harris', userAvatarUrl: 'https://placehold.co/120x120.png', userAvatarAiHint: 'man designer', professionalTitle: 'Interior Home Stylist',
            skillSpecificBio: 'Passionate interior stylist with a keen eye for detail and a commitment to creating spaces that inspire. My approach is collaborative, ensuring your vision is at the heart of every design.',
            contactInfo: { phone: '+1 555 0101', email: 'jenson.stylist@example.com', location: 'New York, NY & Online Consultations', website: 'https://jensoninteriors.design' },
            workExperienceEntries: [
                { id: 'jw1', title: 'Lead Interior Stylist', company: 'Chic Living Designs', years: '2018 - Present', description: 'Managed high-end residential styling projects from concept to completion.' },
                { id: 'jw2', title: 'Junior Interior Designer', company: 'Urban Aesthetics Inc.', years: '2016 - 2018', description: 'Assisted in material sourcing, mood board creation, and client presentations.' },
            ],
            portfolioItems: [
                { id: 'jp1', title: 'Downtown Loft Transformation', imageUrl: 'https://placehold.co/600x400.png', imageAiHint: 'modern loft', description: 'Complete styling of a 2-bedroom downtown loft.', link: '#' },
                { id: 'jp2', title: 'Minimalist Scandinavian Home', imageUrl: 'https://placehold.co/600x400.png', imageAiHint: 'scandinavian design', description: 'Styled a family home with a minimalist Scandinavian aesthetic.', link: '#' },
            ],
            professionalFeed: [{ id: 'jf1', content: 'New blog post: "Top 5 Color Trends for Interiors in 2024".', timestamp: '2 days ago', imageUrl: 'https://placehold.co/400x200.png', imageAiHint: 'color swatches' }],
            reviews: [{ id: 'jr1', reviewerName: 'Sarah L.', rating: 5, comment: 'Jenson understood my vision and brought it to life beautifully!', date: '2023-12-05' }],
            recommendationsCount: 125, averageRating: 4.8, totalReviews: 88,
        });
      }
      else {
        resolve(null);
      }
    }, 1000);
  });
};

const simulateUpdateSkillsetProfile = async (profileId: string, updatedData: SkillsetProfileFormData): Promise<boolean> => {
    console.log(`Simulating updating skillset profile ${profileId} with data:`, updatedData);
     return new Promise((resolve) => {
        setTimeout(() => {
            console.log('Simulated skillset profile updated successfully.');
            resolve(true);
        }, 1000);
     });
};

const SkillsetProfileManagementScreen: React.FC<SkillsetProfileManagementScreenProps> = ({ setActiveTab, skillsetProfileId, onBack }) => {
  const { toast } = useToast();
  const [profileData, setProfileData] = useState<SkillsetProfileData | null>(null);
  const [editedData, setEditedData] = useState<SkillsetProfileFormData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (skillsetProfileId) {
      fetchProfileData(skillsetProfileId);
    }
  }, [skillsetProfileId]);

  const fetchProfileData = async (id: string) => {
    setLoading(true); setError(null);
    try {
      const data = await simulateFetchSkillsetProfileForManagement(id);
      if (data) {
        setProfileData(data);
        // Initialize form data. Note: Ensure all fields in SkillsetProfileFormData are covered
        setEditedData({
            id: data.id,
            skillName: data.skillName,
            skillLevel: data.skillLevel || '',
            skillDescription: data.skillDescription,
            isActive: data.reviews.length > 0, // Example: make active if has reviews
            userName: data.userName,
            userAvatarUrl: data.userAvatarUrl,
            professionalTitle: data.professionalTitle,
            skillSpecificBio: data.skillSpecificBio,
            contactInfo: data.contactInfo ? { ...data.contactInfo } : undefined,
            workExperienceEntries: data.workExperienceEntries ? [...data.workExperienceEntries.map(w => ({...w}))] : [],
            portfolioItems: data.portfolioItems ? [...data.portfolioItems.map(p => ({...p}))] : [],
            professionalFeed: data.professionalFeed ? [...data.professionalFeed.map(f => ({...f}))] : [],
        });
      } else {
        setError("Skillset profile not found for management.");
        toast({ title: "Error", description: "Skillset profile not found.", variant: "destructive" });
      }
    } catch (err) {
      console.error('Error fetching skillset profile for management:', err);
      setError("Failed to load profile for management.");
      toast({ title: "Error", description: "Failed to load profile for management.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof SkillsetProfileFormData, value: any) => {
    setEditedData(prev => prev ? { ...prev, [field]: value } : null);
  };

  const handleContactInfoChange = (field: keyof NonNullable<SkillsetProfileFormData['contactInfo']>, value: string) => {
    setEditedData(prev => prev ? {
      ...prev,
      contactInfo: { ...(prev.contactInfo || {}), [field]: value }
    } : null);
  };

  // Placeholder for list item management (add, edit, delete)
  const handleManageList = (listName: 'workExperienceEntries' | 'portfolioItems' | 'professionalFeed') => {
    toast({ title: "Manage List (Not Implemented)", description: `UI for managing ${listName} would open here.`});
  }

  const handleSave = async () => {
    if (!editedData) return;
    setIsSaving(true);
    try {
      const success = await simulateUpdateSkillsetProfile(editedData.id, editedData);
      if (success) {
        setProfileData(prev => prev ? ({...prev, ...editedData}) : editedData as SkillsetProfileData); // Update local state with saved data
        toast({ title: "Profile Saved", description: `Skillset profile "${editedData.skillName}" updated successfully.` });
        // onBack(); // Optionally navigate back after save
      } else {
        toast({ title: "Save Failed", description: "Could not update skillset profile.", variant: "destructive" });
      }
    } catch (err) {
      console.error("Error saving profile:", err);
      toast({ title: "Save Error", description: "An unexpected error occurred.", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-full"><Loader2 className="h-12 w-12 animate-spin text-primary" /><p className="ml-3">Loading profile data...</p></div>;
  }
  if (error) {
    return <div className="p-4 text-center text-destructive">{error} <Button onClick={() => fetchProfileData(skillsetProfileId)} variant="outline">Try Again</Button></div>;
  }
  if (!editedData || !profileData) {
    return <div className="p-4 text-center text-muted-foreground">Profile data unavailable for management.</div>;
  }

  const hasChanges = JSON.stringify(profileData) !== JSON.stringify({...profileData, ...editedData}); // Simple deep compare for demo

  return (
    <ScrollArea className="h-full bg-background">
      <div className="max-w-4xl mx-auto p-4 sm:p-6 md:p-8">
        <Button variant="outline" onClick={onBack} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Skillset Profiles
        </Button>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-2xl font-headline">Manage Skillset: {editedData.skillName}</CardTitle>
            <CardDescription>Edit the details for this specific skillset profile.</CardDescription>
          </CardHeader>
        </Card>

        <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
          <div className="grid md:grid-cols-3 gap-6">
            {/* Left Column for primary details */}
            <div className="md:col-span-1 space-y-6">
              <Card>
                <CardHeader><CardTitle>Basic Info</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="skillName">Skill Name</Label>
                    <Input id="skillName" value={editedData.skillName} onChange={(e) => handleInputChange('skillName', e.target.value)} placeholder="e.g., Plumbing Services" />
                  </div>
                  <div>
                    <Label htmlFor="skillLevel">Skill Level</Label>
                    <Input id="skillLevel" value={editedData.skillLevel} onChange={(e) => handleInputChange('skillLevel', e.target.value)} placeholder="e.g., Expert, Certified" />
                  </div>
                   <div className="flex items-center space-x-2 pt-2">
                    <Switch id="isActive" checked={editedData.isActive} onCheckedChange={(checked) => handleInputChange('isActive', checked)} />
                    <Label htmlFor="isActive">Profile is Active & Searchable</Label>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle>Skill-Specific Bio</CardTitle></CardHeader>
                <CardContent>
                  <Textarea 
                    value={editedData.skillSpecificBio || ''} 
                    onChange={(e) => handleInputChange('skillSpecificBio', e.target.value)} 
                    placeholder="Describe your expertise and offerings for this specific skill..." 
                    rows={5}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Right Column for contact and list management */}
            <div className="md:col-span-2 space-y-6">
              <Card>
                <CardHeader><CardTitle>Contact Info (for this Skillset)</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div><Label htmlFor="contactPhone">Phone</Label><Input id="contactPhone" value={editedData.contactInfo?.phone || ''} onChange={(e) => handleContactInfoChange('phone', e.target.value)} /></div>
                  <div><Label htmlFor="contactEmail">Email</Label><Input id="contactEmail" type="email" value={editedData.contactInfo?.email || ''} onChange={(e) => handleContactInfoChange('email', e.target.value)} /></div>
                  <div><Label htmlFor="contactWebsite">Website</Label><Input id="contactWebsite" type="url" value={editedData.contactInfo?.website || ''} onChange={(e) => handleContactInfoChange('website', e.target.value)} /></div>
                  <div><Label htmlFor="contactLocation">Location/Service Area</Label><Input id="contactLocation" value={editedData.contactInfo?.location || ''} onChange={(e) => handleContactInfoChange('location', e.target.value)} /></div>
                </CardContent>
              </Card>
            </div>
          </div>
          
          {/* Sections for managing lists - Work Experience, Portfolio, Feed */}
          {['workExperienceEntries', 'portfolioItems', 'professionalFeed'].map((sectionKey) => {
            const titleMap = {
              workExperienceEntries: 'Work Experience',
              portfolioItems: 'Portfolio Items',
              professionalFeed: 'Professional Feed Updates'
            };
            const items = editedData[sectionKey as keyof SkillsetProfileFormData] as any[];
            
            return (
              <Card key={sectionKey} className="mt-6">
                <CardHeader className="flex flex-row justify-between items-center">
                  <CardTitle>{titleMap[sectionKey as keyof typeof titleMap]}</CardTitle>
                  <Button type="button" variant="outline" size="sm" onClick={() => handleManageList(sectionKey as any)}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Add New
                  </Button>
                </CardHeader>
                <CardContent>
                  {items && items.length > 0 ? (
                    <ul className="space-y-3">
                      {items.map((item: any) => (
                        <li key={item.id} className="p-3 border rounded-md flex justify-between items-center hover:bg-muted/50">
                          <div>
                            <p className="font-semibold">{item.title || item.content?.substring(0,50) + (item.content?.length > 50 ? '...' : '')}</p>
                            {sectionKey === 'workExperienceEntries' && <p className="text-xs text-muted-foreground">{item.company} ({item.years})</p>}
                            {sectionKey === 'portfolioItems' && item.imageUrl && 
                                <Image src={item.imageUrl} alt={item.title || "Portfolio item"} width={60} height={40} className="rounded object-cover mt-1" data-ai-hint={item.imageAiHint || "portfolio image"}/>}
                          </div>
                          <div className="space-x-2">
                            <Button type="button" variant="ghost" size="icon" onClick={() => toast({title:"Edit Clicked", description: `Edit item ${item.id} (Not Implemented)`})}>
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button type="button" variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => toast({title:"Delete Clicked", description: `Delete item ${item.id} (Not Implemented)`})}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-muted-foreground">No {titleMap[sectionKey as keyof typeof titleMap].toLowerCase()} added yet for this skillset.</p>
                  )}
                </CardContent>
              </Card>
            );
          })}

          <CardFooter className="mt-8 p-0 pt-6 border-t">
            <div className="flex justify-end w-full space-x-3">
                <Button type="button" variant="outline" onClick={onBack}>Cancel</Button>
                <Button type="submit" disabled={isSaving || !hasChanges}>
                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
            </div>
          </CardFooter>
        </form>
      </div>
    </ScrollArea>
  );
};

export default SkillsetProfileManagementScreen;
