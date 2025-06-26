
"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ArrowLeftIcon, PlusCircleIcon, PencilSquareIcon, TrashIcon, PhotoIcon, LinkIcon, BriefcaseIcon, BookOpenIcon, RssIcon } from '@heroicons/react/24/outline';
import { useToast } from "@/hooks/use-toast";
import type { TabName, SkillsetProfileData, SkillsetSpecificWorkExperience, SkillsetSpecificPortfolioItem, SkillsetSpecificFeedItem } from '@/types';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import ImageUpload from '@/components/ui/ImageUpload';
import { useAuth } from '@/context/AuthContext';


interface SkillsetProfileManagementScreenProps {
  setActiveTab: (tab: TabName) => void;
  skillsetProfileId: string;
  onBack: () => void;
}

const SkillsetProfileManagementScreen: React.FC<SkillsetProfileManagementScreenProps> = ({ setActiveTab, skillsetProfileId, onBack }) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [profileData, setProfileData] = useState<SkillsetProfileData | null>(null);
  const [editedData, setEditedData] = useState<Partial<SkillsetProfileData> | null>(null);
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

  const fetchProfileData = async (id: string) => {
    setLoading(true); setError(null);
    try {
      const response = await fetch(`/api/skillset-profiles/${id}`);
      if (response.status === 404) {
          toast({ title: 'Profile Not Found', description: 'This skillset profile does not exist yet. You can create it here.', variant: 'default' });
          // Create a new, empty profile structure for editing
          const newProfile: SkillsetProfileData = {
              id: id, // The ID from creation will be used, or a new one generated on save
              skillName: 'New Skillset',
              userId: user?.id || 'unknown',
              userName: user?.name || 'New User',
              skillLevel: 'Beginner',
              isActive: false,
              workExperienceEntries: [],
              portfolioItems: [],
              professionalFeed: [],
              reviews: [],
              recommendationsCount: 0,
              averageRating: 0,
              totalReviews: 0,
          };
          setProfileData(newProfile);
          setEditedData(JSON.parse(JSON.stringify(newProfile)));
          return;
      }
      if (!response.ok) {
        throw new Error('Failed to fetch profile data.');
      }
      const data: SkillsetProfileData = await response.json();
      setProfileData(data);
      setEditedData(JSON.parse(JSON.stringify(data)));
    } catch (err: any) {
      console.error('Error fetching skillset profile for management:', err);
      setError("Failed to load profile for management.");
      toast({ title: "Error", description: err.message || "Failed to load profile for management.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    if (skillsetProfileId) {
      fetchProfileData(skillsetProfileId);
    }
  }, [skillsetProfileId]);

  const handleInputChange = (field: keyof SkillsetProfileData, value: any) => {
    setEditedData(prev => prev ? { ...prev, [field]: value } : null);
  };

  const handleContactInfoChange = (field: keyof NonNullable<SkillsetProfileData['contactInfo']>, value: string) => {
    setEditedData(prev => prev ? {
      ...prev,
      contactInfo: { ...(prev.contactInfo || {}), [field]: value }
    } : null);
  };

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

    let updatedEntries;
    if (currentWorkExperience.id) {
       updatedEntries = (editedData.workExperienceEntries || []).map(exp =>
        exp.id === currentWorkExperience!.id ? { ...exp, ...currentWorkExperience } as SkillsetSpecificWorkExperience : exp
      );
    } else {
      const newEntry: SkillsetSpecificWorkExperience = {
        id: `wx-${Date.now()}`,
        title: currentWorkExperience.title,
        company: currentWorkExperience.company,
        years: currentWorkExperience.years,
        description: currentWorkExperience.description || '',
      };
      updatedEntries = [...(editedData.workExperienceEntries || []), newEntry];
    }
    setEditedData({ ...editedData, workExperienceEntries: updatedEntries });
    setShowWorkExperienceDialog(false);
    setCurrentWorkExperience(null);
  };

  const confirmDeleteWorkExperience = (id: string) => {
    setWorkExperienceToDeleteId(id);
  };

  const executeDeleteWorkExperience = () => {
    if (!editedData || !workExperienceToDeleteId) return;
    const updatedEntries = (editedData.workExperienceEntries || []).filter(exp => exp.id !== workExperienceToDeleteId);
    setEditedData({ ...editedData, workExperienceEntries: updatedEntries });
    setWorkExperienceToDeleteId(null);
    toast({ title: "Work Experience Deleted", variant: "destructive" });
  };

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
    let updatedItems;

    if (currentPortfolioItem.id) {
        updatedItems = (editedData.portfolioItems || []).map(item =>
            item.id === currentPortfolioItem!.id ? { ...item, ...currentPortfolioItem } as SkillsetSpecificPortfolioItem : item
        );
    } else {
        const newItem: SkillsetSpecificPortfolioItem = {
            id: `pi-${Date.now()}`,
            title: currentPortfolioItem.title,
            description: currentPortfolioItem.description || '',
            imageUrl: currentPortfolioItem.imageUrl || undefined,
            imageAiHint: currentPortfolioItem.imageAiHint || undefined,
            videoUrl: currentPortfolioItem.videoUrl || undefined,
            link: currentPortfolioItem.link || undefined,
        };
        updatedItems = [...(editedData.portfolioItems || []), newItem];
    }
    setEditedData({ ...editedData, portfolioItems: updatedItems });
    setShowPortfolioItemDialog(false);
    setCurrentPortfolioItem(null);
  };

  const confirmDeletePortfolioItem = (id: string) => {
    setPortfolioItemToDeleteId(id);
  };

  const executeDeletePortfolioItem = () => {
    if (!editedData || !portfolioItemToDeleteId) return;
    const updatedItems = (editedData.portfolioItems || []).filter(item => item.id !== portfolioItemToDeleteId);
    setEditedData({ ...editedData, portfolioItems: updatedItems });
    setPortfolioItemToDeleteId(null);
    toast({ title: "Portfolio Item Deleted", variant: "destructive" });
  };

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
    let updatedItems;

    if (currentFeedItem.id) {
        updatedItems = (editedData.professionalFeed || []).map(item =>
            item.id === currentFeedItem!.id ? { ...item, ...currentFeedItem } as SkillsetSpecificFeedItem : item
        );
    } else {
        const newItem: SkillsetSpecificFeedItem = {
            id: `feed-${Date.now()}`,
            content: currentFeedItem.content,
            imageUrl: currentFeedItem.imageUrl || undefined,
            imageAiHint: currentFeedItem.imageAiHint || undefined,
            videoUrl: currentFeedItem.videoUrl || undefined,
            timestamp: currentFeedItem.timestamp || new Date().toLocaleDateString(),
        };
        updatedItems = [...(editedData.professionalFeed || []), newItem];
    }
    setEditedData({ ...editedData, professionalFeed: updatedItems });
    setShowFeedItemDialog(false);
    setCurrentFeedItem(null);
  };

  const confirmDeleteFeedItem = (id: string) => {
    setFeedItemToDeleteId(id);
  };

  const executeDeleteFeedItem = () => {
    if (!editedData || !feedItemToDeleteId) return;
    const updatedItems = (editedData.professionalFeed || []).filter(item => item.id !== feedItemToDeleteId);
    setEditedData({ ...editedData, professionalFeed: updatedItems });
    setFeedItemToDeleteId(null);
    toast({ title: "Feed Post Deleted", variant: "destructive" });
  };


  const handleSave = async () => {
    if (!editedData) return;
    setIsSaving(true);
    try {
       const response = await fetch(`/api/skillset-profiles/${skillsetProfileId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editedData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update profile.");
      }

      const updatedProfile = await response.json();
      setProfileData(updatedProfile);
      setEditedData(JSON.parse(JSON.stringify(updatedProfile)));
      toast({ title: "Profile Saved", description: `Skillset profile "${editedData.skillName}" updated successfully.` });
      onBack();
    } catch (err: any) {
      console.error("Error saving profile:", err);
      toast({ title: "Save Error", description: err.message || "An unexpected error occurred.", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };


  if (loading) {
    return (
        <div className="flex justify-center items-center h-full">
            <svg className="animate-spin h-12 w-12 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="ml-3 text-muted-foreground">Loading profile data...</p>
        </div>
    );
  }
  if (error) {
    return <div className="p-4 text-center text-destructive">{error} <Button onClick={() => fetchProfileData(skillsetProfileId)} variant="outline">Try Again</Button></div>;
  }
  if (!editedData || !profileData) {
    return <div className="p-4 text-center text-muted-foreground">Profile data unavailable for management.</div>;
  }

  const hasChanges = JSON.stringify(profileData) !== JSON.stringify(editedData);

  return (
    <ScrollArea className="h-full bg-background">
      <div className="max-w-4xl mx-auto p-4 sm:p-6 md:p-8">
        <Button variant="outline" onClick={onBack} className="mb-6">
          <ArrowLeftIcon className="mr-2 h-4 w-4" /> Back to Skillset Profiles
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
                    <CardTitle className="flex items-center"><BriefcaseIcon className="mr-2 h-5 w-5 text-primary"/>Work Experience</CardTitle>
                    <Button type="button" variant="outline" size="sm" onClick={openAddWorkExperienceDialog}>
                        <PlusCircleIcon className="mr-2 h-4 w-4" /> Add New
                    </Button>
                </CardHeader>
                <CardContent>
                    {(editedData.workExperienceEntries || []).length > 0 ? (
                    <ul className="space-y-4">
                        {(editedData.workExperienceEntries || []).map((exp) => (
                        <li key={exp.id} className="p-4 border rounded-md hover:shadow-sm bg-muted/30">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h4 className="font-semibold text-foreground">{exp.title}</h4>
                                    <p className="text-sm text-muted-foreground">{exp.company} ({exp.years})</p>
                                    {exp.description && <p className="text-xs text-muted-foreground mt-1 whitespace-pre-line">{exp.description}</p>}
                                </div>
                                <div className="space-x-1 flex-shrink-0 ml-2">
                                    <Button type="button" variant="ghost" size="icon" onClick={() => openEditWorkExperienceDialog(exp)} className="h-8 w-8">
                                        <PencilSquareIcon className="h-4 w-4" />
                                    </Button>
                                    <Button type="button" variant="ghost" size="icon" className="text-destructive hover:text-destructive h-8 w-8" onClick={() => confirmDeleteWorkExperience(exp.id)}>
                                        <TrashIcon className="h-4 w-4" />
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
                    <CardTitle className="flex items-center"><BookOpenIcon className="mr-2 h-5 w-5 text-primary"/>Portfolio Items</CardTitle>
                    <Button type="button" variant="outline" size="sm" onClick={openAddPortfolioItemDialog}>
                        <PlusCircleIcon className="mr-2 h-4 w-4" /> Add New
                    </Button>
                </CardHeader>
                <CardContent>
                    {(editedData.portfolioItems || []).length > 0 ? (
                    <ul className="space-y-4">
                        {(editedData.portfolioItems || []).map((item) => (
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
                                        <PencilSquareIcon className="h-4 w-4" />
                                    </Button>
                                    <Button type="button" variant="ghost" size="icon" className="text-destructive hover:text-destructive h-8 w-8" onClick={() => confirmDeletePortfolioItem(item.id)}>
                                        <TrashIcon className="h-4 w-4" />
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
              <CardTitle className="flex items-center"><RssIcon className="mr-2 h-5 w-5 text-primary"/>Professional Feed</CardTitle>
              <Button type="button" variant="outline" size="sm" onClick={openAddFeedItemDialog}>
                <PlusCircleIcon className="mr-2 h-4 w-4" /> Add New Post
              </Button>
            </CardHeader>
            <CardContent>
              {(editedData.professionalFeed || []).length > 0 ? (
                <ul className="space-y-4">
                  {(editedData.professionalFeed || []).map((item) => (
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
                            <PencilSquareIcon className="h-4 w-4" />
                          </Button>
                          <Button type="button" variant="ghost" size="icon" className="text-destructive hover:text-destructive h-8 w-8" onClick={() => confirmDeleteFeedItem(item.id)}>
                              <TrashIcon className="h-4 w-4" />
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
                {isSaving && (
                    <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-primary-foreground" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                )}
                {isSaving ? 'Saving...' : 'Save Changes'}
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
                   <ImageUpload
                        label="Image"
                        initialImageUrl={currentPortfolioItem?.imageUrl}
                        onUploadComplete={(url) => setCurrentPortfolioItem(prev => prev ? { ...prev, imageUrl: url } : null)}
                    />
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
                  <ImageUpload
                    label="Image"
                    initialImageUrl={currentFeedItem?.imageUrl}
                    onUploadComplete={(url) => setCurrentFeedItem(prev => prev ? { ...prev, imageUrl: url } : null)}
                  />
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
