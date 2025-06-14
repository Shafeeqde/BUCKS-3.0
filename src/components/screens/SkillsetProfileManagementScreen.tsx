
"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, ArrowLeft, PlusCircle, Edit2, Trash2, Image as ImageIcon, Link as LinkIcon, Briefcase, BookOpen, Rss } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import type { TabName, SkillsetProfileData, SkillsetSpecificWorkExperience, SkillsetSpecificPortfolioItem, SkillsetSpecificFeedItem } from '@/types';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';


interface SkillsetProfileFormData {
  id: string;
  skillName: string;
  skillLevel: string;
  skillDescription?: string;
  isActive: boolean;
  userName: string;
  userAvatarUrl?: string;
  professionalTitle?: string;
  skillSpecificBio?: string;
  contactInfo?: {
    phone?: string;
    email?: string;
    website?: string;
    location?: string;
  };
  workExperienceEntries: SkillsetSpecificWorkExperience[];
  portfolioItems: SkillsetSpecificPortfolioItem[];
  professionalFeed: SkillsetSpecificFeedItem[]; 
}


interface SkillsetProfileManagementScreenProps {
  setActiveTab: (tab: TabName) => void;
  skillsetProfileId: string;
  onBack: () => void;
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
            { id: 'wx-1', title: 'Lead Plumber', company: 'Local Plumbing Co.', years: '2015 - Present', description: 'Managed plumbing installations, repairs, and client consultations for residential and commercial projects.' },
            { id: 'wx-2', title: 'Apprentice Plumber', company: 'Pro Plumb Apprenticeships', years: '2013 - 2015', description: 'Assisted senior plumbers, learned pipe fitting, fixture installation, and diagnostic techniques.' },
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
                { id: 'wx-j1', title: 'Lead Interior Stylist', company: 'Chic Living Designs', years: '2018 - Present', description: 'Managed high-end residential styling projects from concept to completion.' },
                { id: 'wx-j2', title: 'Junior Interior Designer', company: 'Urban Aesthetics Inc.', years: '2016 - 2018', description: 'Assisted in material sourcing, mood board creation, and client presentations.' },
            ],
            portfolioItems: [
                { id: 'jp1', title: 'Downtown Loft Transformation', imageUrl: 'https://placehold.co/600x400.png', imageAiHint: 'modern loft', description: 'Complete styling of a 2-bedroom downtown loft.', link: '#' },
                { id: 'jp2', title: 'Minimalist Scandinavian Home', imageUrl: 'https://placehold.co/600x400.png', imageAiHint: 'scandinavian design', description: 'Styled a family home with a minimalist Scandinavian aesthetic.', link: '#' },
            ],
            professionalFeed: [
                { id: 'jf1', content: 'New blog post: "Top 5 Color Trends for Interiors in 2024".', timestamp: '2 days ago', imageUrl: 'https://placehold.co/400x200.png', imageAiHint: 'color swatches' }
            ],
            reviews: [{ id: 'jr1', reviewerName: 'Sarah L.', rating: 5, comment: 'Jenson understood my vision and brought it to life beautifully!', date: '2023-12-05' }],
            recommendationsCount: 125, averageRating: 4.8, totalReviews: 88,
        });
      }
      else {
        resolve({
            id: skillsetProfileId,
            skillName: `New Skillset (${skillsetProfileId.substring(0,5)})`,
            skillLevel: 'Beginner',
            skillDescription: '',
            userName: 'Current User',
            userAvatarUrl: 'https://placehold.co/100x100.png',
            userAvatarAiHint: 'person avatar',
            professionalTitle: '',
            skillSpecificBio: '',
            contactInfo: { phone: '', email: '', location: '', website: '' },
            workExperienceEntries: [],
            portfolioItems: [],
            professionalFeed: [],
            reviews: [],
            recommendationsCount: 0,
            averageRating: 0,
            totalReviews: 0,
        });
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

  const [showWorkExperienceDialog, setShowWorkExperienceDialog] = useState(false);
  const [currentWorkExperience, setCurrentWorkExperience] = useState<Partial<SkillsetSpecificWorkExperience> & { id?: string } | null>(null);
  const [workExperienceToDeleteId, setWorkExperienceToDeleteId] = useState<string | null>(null);

  const [showPortfolioItemDialog, setShowPortfolioItemDialog] = useState(false);
  const [currentPortfolioItem, setCurrentPortfolioItem] = useState<Partial<SkillsetSpecificPortfolioItem> & { id?: string } | null>(null);
  const [portfolioItemToDeleteId, setPortfolioItemToDeleteId] = useState<string | null>(null);

  const [showFeedItemDialog, setShowFeedItemDialog] = useState(false);
  const [currentFeedItem, setCurrentFeedItem] = useState<Partial<SkillsetSpecificFeedItem> & { id?: string } | null>(null);
  const [feedItemToDeleteId, setFeedItemToDeleteId] = useState<string | null>(null);


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
        setEditedData({
            id: data.id,
            skillName: data.skillName,
            skillLevel: data.skillLevel || '',
            skillDescription: data.skillDescription,
            isActive: data.isActive === undefined ? (data.reviews && data.reviews.length > 0) : data.isActive,
            userName: data.userName,
            userAvatarUrl: data.userAvatarUrl,
            professionalTitle: data.professionalTitle,
            skillSpecificBio: data.skillSpecificBio,
            contactInfo: data.contactInfo ? { ...data.contactInfo } : { phone: '', email: '', location: '', website: '' },
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

  // --- Work Experience CRUD Functions ---
  const openAddWorkExperienceDialog = () => {
    setCurrentWorkExperience({});
    setShowWorkExperienceDialog(true);
  };

  const openEditWorkExperienceDialog = (experience: SkillsetSpecificWorkExperience) => {
    setCurrentWorkExperience({ ...experience });
    setShowWorkExperienceDialog(true);
  };

  const handleWorkExperienceDialogChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCurrentWorkExperience(prev => prev ? { ...prev, [name]: value } : null);
  };

  const handleSaveWorkExperience = () => {
    if (!currentWorkExperience || !currentWorkExperience.title || !currentWorkExperience.company || !currentWorkExperience.years) {
        toast({ title: "Missing Fields", description: "Title, Company, and Years are required for work experience.", variant: "destructive"});
        return;
    }
    if (!editedData) return;

    if (currentWorkExperience.id) {
      const updatedEntries = editedData.workExperienceEntries.map(exp =>
        exp.id === currentWorkExperience!.id ? { ...exp, ...currentWorkExperience } as SkillsetSpecificWorkExperience : exp
      );
      setEditedData({ ...editedData, workExperienceEntries: updatedEntries });
    } else {
      const newEntry: SkillsetSpecificWorkExperience = {
        id: `wx-${Date.now()}`,
        title: currentWorkExperience.title,
        company: currentWorkExperience.company,
        years: currentWorkExperience.years,
        description: currentWorkExperience.description || '',
      };
      setEditedData({ ...editedData, workExperienceEntries: [...editedData.workExperienceEntries, newEntry] });
    }
    setShowWorkExperienceDialog(false);
    setCurrentWorkExperience(null);
    toast({ title: "Work Experience Saved", description: "Your work experience has been updated locally." });
  };

  const confirmDeleteWorkExperience = (id: string) => {
    setWorkExperienceToDeleteId(id);
  };

  const executeDeleteWorkExperience = () => {
    if (!editedData || !workExperienceToDeleteId) return;
    const updatedEntries = editedData.workExperienceEntries.filter(exp => exp.id !== workExperienceToDeleteId);
    setEditedData({ ...editedData, workExperienceEntries: updatedEntries });
    setWorkExperienceToDeleteId(null);
    toast({ title: "Work Experience Deleted", variant: "destructive" });
  };

  // --- Portfolio Item CRUD Functions ---
  const openAddPortfolioItemDialog = () => {
    setCurrentPortfolioItem({});
    setShowPortfolioItemDialog(true);
  };

  const openEditPortfolioItemDialog = (item: SkillsetSpecificPortfolioItem) => {
    setCurrentPortfolioItem({ ...item });
    setShowPortfolioItemDialog(true);
  };

  const handlePortfolioItemDialogChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCurrentPortfolioItem(prev => prev ? { ...prev, [name]: value } : null);
  };

  const handleSavePortfolioItem = () => {
    if (!currentPortfolioItem || !currentPortfolioItem.title) {
        toast({ title: "Missing Title", description: "Title is required for portfolio items.", variant: "destructive" });
        return;
    }
    if (!editedData) return;

    if (currentPortfolioItem.id) { 
        const updatedItems = editedData.portfolioItems.map(item =>
            item.id === currentPortfolioItem!.id ? { ...item, ...currentPortfolioItem } as SkillsetSpecificPortfolioItem : item
        );
        setEditedData({ ...editedData, portfolioItems: updatedItems });
    } else { 
        const newItem: SkillsetSpecificPortfolioItem = {
            id: `pi-${Date.now()}`,
            title: currentPortfolioItem.title,
            description: currentPortfolioItem.description || '',
            imageUrl: currentPortfolioItem.imageUrl || '',
            imageAiHint: currentPortfolioItem.imageAiHint || '',
            videoUrl: currentPortfolioItem.videoUrl || '',
            link: currentPortfolioItem.link || '',
        };
        setEditedData({ ...editedData, portfolioItems: [...editedData.portfolioItems, newItem] });
    }
    setShowPortfolioItemDialog(false);
    setCurrentPortfolioItem(null);
    toast({ title: "Portfolio Item Saved", description: "Your portfolio item has been updated locally." });
  };

  const confirmDeletePortfolioItem = (id: string) => {
    setPortfolioItemToDeleteId(id);
  };

  const executeDeletePortfolioItem = () => {
    if (!editedData || !portfolioItemToDeleteId) return;
    const updatedItems = editedData.portfolioItems.filter(item => item.id !== portfolioItemToDeleteId);
    setEditedData({ ...editedData, portfolioItems: updatedItems });
    setPortfolioItemToDeleteId(null);
    toast({ title: "Portfolio Item Deleted", variant: "destructive" });
  };

  // --- Professional Feed CRUD Functions ---
  const openAddFeedItemDialog = () => {
    setCurrentFeedItem({ timestamp: new Date().toLocaleDateString() }); 
    setShowFeedItemDialog(true);
  };

  const openEditFeedItemDialog = (item: SkillsetSpecificFeedItem) => {
    setCurrentFeedItem({ ...item });
    setShowFeedItemDialog(true);
  };

  const handleFeedItemDialogChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCurrentFeedItem(prev => prev ? { ...prev, [name]: value } : null);
  };

  const handleSaveFeedItem = () => {
    if (!currentFeedItem || !currentFeedItem.content) {
        toast({ title: "Missing Content", description: "Content is required for feed posts.", variant: "destructive" });
        return;
    }
    if (!editedData) return;

    if (currentFeedItem.id) { 
        const updatedItems = editedData.professionalFeed.map(item =>
            item.id === currentFeedItem!.id ? { ...item, ...currentFeedItem } as SkillsetSpecificFeedItem : item
        );
        setEditedData({ ...editedData, professionalFeed: updatedItems });
    } else { 
        const newItem: SkillsetSpecificFeedItem = {
            id: `feed-${Date.now()}`,
            content: currentFeedItem.content,
            imageUrl: currentFeedItem.imageUrl || '',
            imageAiHint: currentFeedItem.imageAiHint || '',
            videoUrl: currentFeedItem.videoUrl || '',
            timestamp: currentFeedItem.timestamp || new Date().toLocaleDateString(),
        };
        setEditedData({ ...editedData, professionalFeed: [...editedData.professionalFeed, newItem] });
    }
    setShowFeedItemDialog(false);
    setCurrentFeedItem(null);
    toast({ title: "Feed Post Saved", description: "Your feed post has been updated locally." });
  };

  const confirmDeleteFeedItem = (id: string) => {
    setFeedItemToDeleteId(id);
  };

  const executeDeleteFeedItem = () => {
    if (!editedData || !feedItemToDeleteId) return;
    const updatedItems = editedData.professionalFeed.filter(item => item.id !== feedItemToDeleteId);
    setEditedData({ ...editedData, professionalFeed: updatedItems });
    setFeedItemToDeleteId(null);
    toast({ title: "Feed Post Deleted", variant: "destructive" });
  };


  const handleSave = async () => {
    if (!editedData) return;
    setIsSaving(true);
    try {
      const success = await simulateUpdateSkillsetProfile(editedData.id, editedData);
      if (success) {
        setProfileData(prev => {
            if (!prev) return null;
            const updatedProfileData: SkillsetProfileData = {
                ...prev,
                id: editedData.id,
                skillName: editedData.skillName,
                skillLevel: editedData.skillLevel,
                skillDescription: editedData.skillDescription,
                isActive: editedData.isActive,
                userName: editedData.userName,
                userAvatarUrl: editedData.userAvatarUrl,
                professionalTitle: editedData.professionalTitle,
                skillSpecificBio: editedData.skillSpecificBio,
                contactInfo: editedData.contactInfo ? { ...editedData.contactInfo } : undefined,
                workExperienceEntries: [...editedData.workExperienceEntries.map(w => ({...w}))],
                portfolioItems: [...editedData.portfolioItems.map(p => ({...p}))],
                professionalFeed: [...editedData.professionalFeed.map(f => ({...f}))],
            };
            return updatedProfileData;
        });
        toast({ title: "Profile Saved", description: `Skillset profile "${editedData.skillName}" updated successfully.` });
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

  const hasChanges = JSON.stringify(profileData) !== JSON.stringify({...profileData, ...editedData, isActive: profileData.isActive === editedData.isActive ? profileData.isActive : editedData.isActive });

  return (
    <ScrollArea className="h-full bg-background">
      <div className="max-w-4xl mx-auto p-4 sm:p-6 md:p-8">
        <Button variant="outline" onClick={onBack} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Skillset Profiles
        </Button>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-2xl font-headline">Manage Skillset: {editedData.skillName}</CardTitle>
            <CardDescription>Edit the details for this specific skillset profile. Your changes are saved locally until you click "Save Changes" below.</CardDescription>
          </CardHeader>
        </Card>

        <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
          <div className="grid md:grid-cols-3 gap-6">
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

            <Card className="mt-6">
                <CardHeader className="flex flex-row justify-between items-center">
                    <CardTitle className="flex items-center"><Briefcase className="mr-2 h-5 w-5 text-primary"/>Work Experience</CardTitle>
                    <Button type="button" variant="outline" size="sm" onClick={openAddWorkExperienceDialog}>
                        <PlusCircle className="mr-2 h-4 w-4" /> Add New
                    </Button>
                </CardHeader>
                <CardContent>
                    {editedData.workExperienceEntries && editedData.workExperienceEntries.length > 0 ? (
                    <ul className="space-y-4">
                        {editedData.workExperienceEntries.map((exp) => (
                        <li key={exp.id} className="p-4 border rounded-md hover:shadow-sm bg-muted/30">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h4 className="font-semibold text-foreground">{exp.title}</h4>
                                    <p className="text-sm text-muted-foreground">{exp.company} ({exp.years})</p>
                                    {exp.description && <p className="text-xs text-muted-foreground mt-1 whitespace-pre-line">{exp.description}</p>}
                                </div>
                                <div className="space-x-1 flex-shrink-0 ml-2">
                                    <Button type="button" variant="ghost" size="icon" onClick={() => openEditWorkExperienceDialog(exp)} className="h-8 w-8">
                                        <Edit2 className="h-4 w-4" />
                                    </Button>
                                    <Button type="button" variant="ghost" size="icon" className="text-destructive hover:text-destructive h-8 w-8" onClick={() => confirmDeleteWorkExperience(exp.id)}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </li>
                        ))}
                    </ul>
                    ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">No work experience added yet for this skillset.</p>
                    )}
                </CardContent>
            </Card>

            <Card className="mt-6">
                <CardHeader className="flex flex-row justify-between items-center">
                    <CardTitle className="flex items-center"><BookOpen className="mr-2 h-5 w-5 text-primary"/>Portfolio Items</CardTitle>
                    <Button type="button" variant="outline" size="sm" onClick={openAddPortfolioItemDialog}>
                        <PlusCircle className="mr-2 h-4 w-4" /> Add New
                    </Button>
                </CardHeader>
                <CardContent>
                    {editedData.portfolioItems && editedData.portfolioItems.length > 0 ? (
                    <ul className="space-y-4">
                        {editedData.portfolioItems.map((item) => (
                        <li key={item.id} className="p-4 border rounded-md hover:shadow-sm bg-muted/30">
                            <div className="flex justify-between items-start">
                                <div className="flex-grow mr-2">
                                    <h4 className="font-semibold text-foreground">{item.title}</h4>
                                    {item.description && <p className="text-xs text-muted-foreground mt-1 whitespace-pre-line">{item.description}</p>}
                                    {item.imageUrl && (
                                        <div className="mt-2">
                                            <Image src={item.imageUrl} alt={item.title || "Portfolio item"} width={100} height={60} className="rounded object-cover border" data-ai-hint={item.imageAiHint || "portfolio project"}/>
                                        </div>
                                    )}
                                    {item.link && <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline mt-1 inline-flex items-center gap-1"><LinkIcon className="h-3 w-3"/>View Link</a>}
                                    {item.videoUrl && <p className="text-xs text-muted-foreground mt-1">Video: {item.videoUrl}</p>}
                                </div>
                                <div className="space-x-1 flex-shrink-0">
                                    <Button type="button" variant="ghost" size="icon" onClick={() => openEditPortfolioItemDialog(item)} className="h-8 w-8">
                                        <Edit2 className="h-4 w-4" />
                                    </Button>
                                    <Button type="button" variant="ghost" size="icon" className="text-destructive hover:text-destructive h-8 w-8" onClick={() => confirmDeletePortfolioItem(item.id)}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </li>
                        ))}
                    </ul>
                    ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">No portfolio items added yet for this skillset.</p>
                    )}
                </CardContent>
            </Card>


          <Card className="mt-6">
            <CardHeader className="flex flex-row justify-between items-center">
              <CardTitle className="flex items-center"><Rss className="mr-2 h-5 w-5 text-primary"/>Professional Feed</CardTitle>
              <Button type="button" variant="outline" size="sm" onClick={openAddFeedItemDialog}>
                <PlusCircle className="mr-2 h-4 w-4" /> Add New Post
              </Button>
            </CardHeader>
            <CardContent>
              {editedData.professionalFeed && editedData.professionalFeed.length > 0 ? (
                <ul className="space-y-4">
                  {editedData.professionalFeed.map((item) => (
                    <li key={item.id} className="p-4 border rounded-md hover:shadow-sm bg-muted/30">
                      <div className="flex justify-between items-start">
                        <div className="flex-grow mr-2">
                          {item.imageUrl && (
                            <div className="mb-2">
                              <Image src={item.imageUrl} alt={"Feed item " + item.id} width={150} height={80} className="rounded object-cover border" data-ai-hint={item.imageAiHint || "feed post image"}/>
                            </div>
                          )}
                          <p className="text-sm text-foreground whitespace-pre-line">{item.content}</p>
                          <p className="text-xs text-muted-foreground mt-1">{item.timestamp}</p>
                        </div>
                        <div className="space-x-1 flex-shrink-0">
                          <Button type="button" variant="ghost" size="icon" onClick={() => openEditFeedItemDialog(item)} className="h-8 w-8">
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button type="button" variant="ghost" size="icon" className="text-destructive hover:text-destructive h-8 w-8" onClick={() => confirmDeleteFeedItem(item.id)}>
                              <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">No feed posts added yet for this skillset.</p>
              )}
            </CardContent>
          </Card>

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

    <Dialog open={showWorkExperienceDialog} onOpenChange={setShowWorkExperienceDialog}>
        <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
                <DialogTitle>{currentWorkExperience?.id ? 'Edit' : 'Add'} Work Experience</DialogTitle>
                <DialogDescription>
                    Provide details about your professional experience related to this skillset.
                </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="wx-title" className="text-right">Title <span className="text-destructive">*</span></Label>
                    <Input id="wx-title" name="title" value={currentWorkExperience?.title || ''} onChange={handleWorkExperienceDialogChange} className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="wx-company" className="text-right">Company <span className="text-destructive">*</span></Label>
                    <Input id="wx-company" name="company" value={currentWorkExperience?.company || ''} onChange={handleWorkExperienceDialogChange} className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="wx-years" className="text-right">Years <span className="text-destructive">*</span></Label>
                    <Input id="wx-years" name="years" value={currentWorkExperience?.years || ''} onChange={handleWorkExperienceDialogChange} placeholder="e.g., 2020 - Present or 3 years" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="wx-description" className="text-right">Description</Label>
                    <Textarea id="wx-description" name="description" value={currentWorkExperience?.description || ''} onChange={handleWorkExperienceDialogChange} className="col-span-3" placeholder="Briefly describe your role and responsibilities." />
                </div>
            </div>
            <DialogFooter>
                <DialogClose asChild>
                    <Button type="button" variant="outline">Cancel</Button>
                </DialogClose>
                <Button type="button" onClick={handleSaveWorkExperience}>Save Experience</Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>

    <AlertDialog open={!!workExperienceToDeleteId} onOpenChange={(open) => !open && setWorkExperienceToDeleteId(null)}>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete this work experience entry.
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setWorkExperienceToDeleteId(null)}>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={executeDeleteWorkExperience} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>

    <Dialog open={showPortfolioItemDialog} onOpenChange={setShowPortfolioItemDialog}>
        <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
                <DialogTitle>{currentPortfolioItem?.id ? 'Edit' : 'Add'} Portfolio Item</DialogTitle>
                <DialogDescription>
                    Showcase your work related to this skillset.
                </DialogDescription>
            </DialogHeader>
            <ScrollArea className="max-h-[60vh] pr-6"> 
              <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="pi-title" className="text-right">Title <span className="text-destructive">*</span></Label>
                      <Input id="pi-title" name="title" value={currentPortfolioItem?.title || ''} onChange={handlePortfolioItemDialogChange} className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="pi-description" className="text-right">Description</Label>
                      <Textarea id="pi-description" name="description" value={currentPortfolioItem?.description || ''} onChange={handlePortfolioItemDialogChange} className="col-span-3" placeholder="Describe the project or item." />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="pi-imageUrl" className="text-right">Image URL</Label>
                      <Input id="pi-imageUrl" name="imageUrl" value={currentPortfolioItem?.imageUrl || ''} onChange={handlePortfolioItemDialogChange} className="col-span-3" placeholder="https://example.com/image.png"/>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="pi-imageAiHint" className="text-right">Image AI Hint</Label>
                      <Input id="pi-imageAiHint" name="imageAiHint" value={currentPortfolioItem?.imageAiHint || ''} onChange={handlePortfolioItemDialogChange} className="col-span-3" placeholder="e.g., modern kitchen"/>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="pi-videoUrl" className="text-right">Video URL</Label>
                      <Input id="pi-videoUrl" name="videoUrl" value={currentPortfolioItem?.videoUrl || ''} onChange={handlePortfolioItemDialogChange} className="col-span-3" placeholder="https://youtube.com/watch?v=..."/>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="pi-link" className="text-right">External Link</Label>
                      <Input id="pi-link" name="link" value={currentPortfolioItem?.link || ''} onChange={handlePortfolioItemDialogChange} className="col-span-3" placeholder="https://behance.net/project/..."/>
                  </div>
              </div>
            </ScrollArea>
            <DialogFooter>
                <DialogClose asChild>
                    <Button type="button" variant="outline">Cancel</Button>
                </DialogClose>
                <Button type="button" onClick={handleSavePortfolioItem}>Save Item</Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>

    <AlertDialog open={!!portfolioItemToDeleteId} onOpenChange={(open) => !open && setPortfolioItemToDeleteId(null)}>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete this portfolio item.
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setPortfolioItemToDeleteId(null)}>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={executeDeletePortfolioItem} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>

    <Dialog open={showFeedItemDialog} onOpenChange={setShowFeedItemDialog}>
        <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
                <DialogTitle>{currentFeedItem?.id ? 'Edit' : 'Add'} Feed Post</DialogTitle>
                <DialogDescription>
                    Share updates, tips, or news related to your skillset.
                </DialogDescription>
            </DialogHeader>
            <ScrollArea className="max-h-[60vh] pr-6">
              <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-start gap-4"> 
                      <Label htmlFor="feed-content" className="text-right pt-2">Content <span className="text-destructive">*</span></Label>
                      <Textarea id="feed-content" name="content" value={currentFeedItem?.content || ''} onChange={handleFeedItemDialogChange} className="col-span-3" placeholder="What's on your mind?" rows={4} />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="feed-imageUrl" className="text-right">Image URL</Label>
                      <Input id="feed-imageUrl" name="imageUrl" value={currentFeedItem?.imageUrl || ''} onChange={handleFeedItemDialogChange} className="col-span-3" placeholder="https://example.com/feed-image.png"/>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="feed-imageAiHint" className="text-right">Image AI Hint</Label>
                      <Input id="feed-imageAiHint" name="imageAiHint" value={currentFeedItem?.imageAiHint || ''} onChange={handleFeedItemDialogChange} className="col-span-3" placeholder="e.g., work in progress"/>
                  </div>
                   <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="feed-timestamp" className="text-right">Timestamp</Label>
                      <Input id="feed-timestamp" name="timestamp" value={currentFeedItem?.timestamp || ''} onChange={handleFeedItemDialogChange} className="col-span-3" placeholder="e.g., Just now, 2 hours ago, Jan 15"/>
                  </div>
              </div>
            </ScrollArea>
            <DialogFooter>
                <DialogClose asChild>
                    <Button type="button" variant="outline">Cancel</Button>
                </DialogClose>
                <Button type="button" onClick={handleSaveFeedItem}>Save Post</Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>

    <AlertDialog open={!!feedItemToDeleteId} onOpenChange={(open) => !open && setFeedItemToDeleteId(null)}>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete this feed post.
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setFeedItemToDeleteId(null)}>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={executeDeleteFeedItem} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>

    </ScrollArea>
  );
};

export default SkillsetProfileManagementScreen;

    