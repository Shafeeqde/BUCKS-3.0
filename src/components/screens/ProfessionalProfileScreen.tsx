
"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { UserCircleIcon, BriefcaseIcon, LinkIcon as LinkIconOutline, PlusCircleIcon, PencilSquareIcon, TrashIcon, ArrowTopRightOnSquareIcon, BuildingOfficeIcon, BookOpenIcon, ShieldCheckIcon, CameraIcon, StarIcon, TrophyIcon } from '@heroicons/react/24/outline';
import { useToast } from "@/hooks/use-toast";
import type { TabName, UserDataForSideMenu, OverallProfessionalProfileData, WorkExperienceEntry, EducationEntry, LicenseCertificationEntry } from '@/types';
import { cn } from '@/lib/utils';
import ImageUpload from '@/components/ui/ImageUpload';


const ProfessionalProfileScreen: React.FC<ProfessionalProfileScreenProps> = ({ setActiveTab, userData }) => {
  const { toast } = useToast();

  const [profileData, setProfileData] = useState<OverallProfessionalProfileData | null>(null);
  const [editedData, setEditedData] = useState<Partial<OverallProfessionalProfileData>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const [currentExpertise, setCurrentExpertise] = useState('');
  const [currentLinkPlatform, setCurrentLinkPlatform] = useState('');
  const [currentLinkUrl, setCurrentLinkUrl] = useState('');

  const [showWorkExperienceDialog, setShowWorkExperienceDialog] = useState(false);
  const [currentWorkExperience, setCurrentWorkExperience] = useState<Partial<WorkExperienceEntry> & { id?: string } | null>(null);
  const [workExperienceToDelete, setWorkExperienceToDelete] = useState<WorkExperienceEntry | null>(null);

  const [showEducationDialog, setShowEducationDialog] = useState(false);
  const [currentEducation, setCurrentEducation] = useState<Partial<EducationEntry> & { id?: string } | null>(null);
  const [educationToDelete, setEducationToDelete] = useState<EducationEntry | null>(null);

  const [showLicenseDialog, setShowLicenseDialog] = useState(false);
  const [currentLicense, setCurrentLicense] = useState<Partial<LicenseCertificationEntry> & { id?: string } | null>(null);
  const [licenseToDelete, setLicenseToDelete] = useState<LicenseCertificationEntry | null>(null);


  useEffect(() => {
    const currentUserId = userData?.id; 
    if (currentUserId) {
      fetchProfileData(currentUserId);
    } else {
        setLoading(false);
        setError("User data not available to fetch profile.");
        toast({title: "Error", description: "Cannot load professional profile without user information.", variant: "destructive"})
    }
  }, [userData, toast]);

  const fetchProfileData = async (userId: string) => {
    setLoading(true); setError(null);
    try {
      const response = await fetch(`/api/professional-profile/${userId}`);
      if (!response.ok) {
        if (response.status === 404) {
            const newProfile: OverallProfessionalProfileData = {
                id: userId,
                userId: userId,
                name: userData?.name || 'New User',
                avatarUrl: userData?.avatarUrl,
                avatarAiHint: userData?.avatarAiHint,
                areasOfExpertise: [],
                externalProfileLinks: [],
                workExperience: [],
                education: [],
                licensesCertifications: []
            };
            setProfileData(newProfile);
            setEditedData(JSON.parse(JSON.stringify(newProfile)));
            return;
        }
        throw new Error(`Failed to fetch profile: ${response.statusText}`);
      }
      const data: OverallProfessionalProfileData = await response.json();
      setProfileData(data);
      setEditedData(JSON.parse(JSON.stringify(data))); 
    } catch (err: any) {
      console.error('Error fetching overall professional profile:', err);
      setError("Failed to load professional profile.");
      toast({ title: "Error", description: err.message || "Failed to load professional profile.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof OverallProfessionalProfileData, value: any) => {
    setEditedData(prev => prev ? ({ ...prev, [field]: value }) : null);
  };
  
  const handleAddExpertise = () => {
    if (currentExpertise.trim() && editedData?.areasOfExpertise) {
        if (editedData.areasOfExpertise.includes(currentExpertise.trim())) {
            toast({ title: "Duplicate Entry", description: "This area of expertise already exists." });
            return;
        }
        setEditedData(prev => ({
            ...prev,
            areasOfExpertise: [...(prev?.areasOfExpertise || []), currentExpertise.trim()]
        }));
        setCurrentExpertise('');
    } else if (!currentExpertise.trim()){
        toast({ title: "Empty Field", description: "Please enter an area of expertise.", variant: "destructive" });
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
        if (!currentLinkUrl.match(/^(http|https):\/\/[^ "]+$/i)) { 
             toast({ title: "Invalid URL", description: "Please enter a valid URL starting with http:// or https://.", variant: "destructive"});
            return;
        }
        const newLink = { id: `link-${Date.now()}`, platform: currentLinkPlatform.trim(), url: currentLinkUrl.trim() };
        setEditedData(prev => ({
            ...prev,
            externalProfileLinks: [...(prev?.externalProfileLinks || []), newLink]
        }));
        setCurrentLinkPlatform('');
        setCurrentLinkUrl('');
    } else {
        toast({ title: "Missing Fields", description: "Platform and URL are required for external links.", variant: "destructive"});
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

  const openAddWorkExperienceDialog = () => {
    setCurrentWorkExperience({ startDate: '', endDate: '' }); 
    setShowWorkExperienceDialog(true);
  };

  const openEditWorkExperienceDialog = (experience: WorkExperienceEntry) => {
    setCurrentWorkExperience({ ...experience });
    setShowWorkExperienceDialog(true);
  };

  const handleWorkExperienceDialogChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCurrentWorkExperience(prev => prev ? { ...prev, [name]: value } : null);
  };
  
  const handleSaveWorkExperience = () => {
    if (!currentWorkExperience || !currentWorkExperience.title || !currentWorkExperience.company) {
        toast({ title: "Missing Fields", description: "Title and Company are required.", variant: "destructive" });
        return;
    }
    if (!editedData) return;

    let updatedExperience = [...(editedData.workExperience || [])];
    if (currentWorkExperience.id) { 
        updatedExperience = updatedExperience.map(exp => exp.id === currentWorkExperience!.id ? { ...currentWorkExperience } as WorkExperienceEntry : exp);
    } else { 
        const newExp: WorkExperienceEntry = { ...currentWorkExperience, id: `exp-${Date.now()}` } as WorkExperienceEntry;
        updatedExperience.push(newExp);
    }
    setEditedData({ ...editedData, workExperience: updatedExperience });
    setShowWorkExperienceDialog(false);
    setCurrentWorkExperience(null);
    toast({ title: "Work Experience Saved", description: "Changes saved locally." });
  };

  const handleDeleteWorkExperience = () => {
    if (!workExperienceToDelete || !editedData) return;
    const updatedExperience = (editedData.workExperience || []).filter(exp => exp.id !== workExperienceToDelete.id);
    setEditedData({ ...editedData, workExperience: updatedExperience });
    setWorkExperienceToDelete(null);
    toast({ title: "Work Experience Deleted", variant: "destructive" });
  };

  const openAddEducationDialog = () => {
    setCurrentEducation({});
    setShowEducationDialog(true);
  };
  const openEditEducationDialog = (edu: EducationEntry) => {
    setCurrentEducation(edu);
    setShowEducationDialog(true);
  };
  const handleEducationDialogChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCurrentEducation(prev => prev ? ({ ...prev, [name]: value }) : null);
  };
  const handleSaveEducation = () => {
    if (!currentEducation || !currentEducation.institution) {
      toast({ title: "Missing Institution", description: "Institution name is required.", variant: "destructive" });
      return;
    }
    if (!editedData) return;
    let updatedEducation = [...(editedData.education || [])];
    if (currentEducation.id) {
      updatedEducation = updatedEducation.map(edu => edu.id === currentEducation!.id ? { ...currentEducation } as EducationEntry : edu);
    } else {
      const newEdu: EducationEntry = { ...currentEducation, id: `edu-${Date.now()}` } as EducationEntry;
      updatedEducation.push(newEdu);
    }
    setEditedData({ ...editedData, education: updatedEducation });
    setShowEducationDialog(false);
    setCurrentEducation(null);
    toast({ title: "Education Saved", description: "Education details updated locally." });
  };
  const handleDeleteEducation = () => {
    if (!educationToDelete || !editedData) return;
    const updatedEducation = (editedData.education || []).filter(edu => edu.id !== educationToDelete.id);
    setEditedData({ ...editedData, education: updatedEducation });
    setEducationToDelete(null);
    toast({ title: "Education Entry Deleted", variant: "destructive" });
  };

  const openAddLicenseDialog = () => {
    setCurrentLicense({});
    setShowLicenseDialog(true);
  };
  const openEditLicenseDialog = (lic: LicenseCertificationEntry) => {
    setCurrentLicense(lic);
    setShowLicenseDialog(true);
  };
  const handleLicenseDialogChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCurrentLicense(prev => prev ? ({ ...prev, [name]: value }) : null);
  };
  const handleSaveLicense = () => {
    if (!currentLicense || !currentLicense.name) {
      toast({ title: "Missing Name", description: "License/Certification name is required.", variant: "destructive" });
      return;
    }
    if (!editedData) return;
    let updatedLicenses = [...(editedData.licensesCertifications || [])];
    if (currentLicense.id) {
      updatedLicenses = updatedLicenses.map(lic => lic.id === currentLicense!.id ? { ...currentLicense } as LicenseCertificationEntry : lic);
    } else {
      const newLic: LicenseCertificationEntry = { ...currentLicense, id: `lic-${Date.now()}` } as LicenseCertificationEntry;
      updatedLicenses.push(newLic);
    }
    setEditedData({ ...editedData, licensesCertifications: updatedLicenses });
    setShowLicenseDialog(false);
    setCurrentLicense(null);
    toast({ title: "License/Certification Saved", description: "Details updated locally." });
  };
  const handleDeleteLicense = () => {
    if (!licenseToDelete || !editedData) return;
    const updatedLicenses = (editedData.licensesCertifications || []).filter(lic => lic.id !== licenseToDelete.id);
    setEditedData({ ...editedData, licensesCertifications: updatedLicenses });
    setLicenseToDelete(null);
    toast({ title: "License/Certification Deleted", variant: "destructive" });
  };

  const handleSaveAll = async () => {
    if (!editedData || !profileData || !userData?.id) return;
    setIsSaving(true);
    try {
        const response = await fetch(`/api/professional-profile/${userData.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(editedData)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Failed to save profile.");
        }

        const updatedProfile = await response.json();
        setProfileData(updatedProfile);
        setEditedData(JSON.parse(JSON.stringify(updatedProfile)));
        toast({ title: "Profile Saved", description: "Your professional profile has been updated." });
    } catch (err: any) {
      console.error('Error saving professional profile:', err);
      toast({ title: "Save Error", description: err.message || "An unexpected error occurred.", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  const hasChanges = JSON.stringify(profileData) !== JSON.stringify(editedData);

  if (loading) {
    return <div className="flex justify-center items-center h-full p-4"><span className="h-12 w-12 animate-spin border-4 border-primary border-t-transparent rounded-full"></span><p className="ml-3 text-muted-foreground">Loading Professional Profile...</p></div>;
  }
  if (error || !editedData) {
    return (
        <div className="p-4 text-center">
            <p className="text-destructive mb-4">{error || "Profile data unavailable."}</p>
            <Button 
                onClick={() => fetchProfileData(userData?.id || '')} 
                variant="outline"
                disabled={!userData?.id}
            >
                Try Again
            </Button>
        </div>
    );
  }

  return (
    <ScrollArea className="h-full bg-muted/20">
      <div className="max-w-5xl mx-auto">
        <Card className="mb-6 shadow-none border-0 rounded-none sm:rounded-b-lg overflow-hidden">
           <ImageUpload
              label="Cover Photo"
              initialImageUrl={editedData.coverPhotoUrl}
              onUploadComplete={(url) => handleInputChange('coverPhotoUrl', url)}
            />
          <CardContent className="p-4 sm:p-6 relative">
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 -mt-16 sm:-mt-20">
              <div className="relative h-28 w-28 sm:h-36 sm:w-36 rounded-full border-4 border-background bg-card shadow-lg flex-shrink-0 z-10 group">
                <ImageUpload
                    label="Avatar"
                    initialImageUrl={editedData.avatarUrl}
                    onUploadComplete={(url) => handleInputChange('avatarUrl', url)}
                />
              </div>
              <div className="flex-grow mt-4 sm:mt-0 text-center sm:text-left">
                <Input 
                    id="profileName" 
                    name="name"
                    value={editedData.name || userData?.name || ''} 
                    onChange={(e) => handleInputChange('name', e.target.value)} 
                    placeholder="Your Name"
                    className="text-2xl sm:text-3xl font-bold font-headline border-0 shadow-none p-0 h-auto focus-visible:ring-0 focus-visible:ring-offset-0 hover:bg-muted/50"
                />
                <Input 
                    id="professionalTitle"
                    name="professionalTitle"
                    value={editedData.professionalTitle || ''}
                    onChange={(e) => handleInputChange('professionalTitle', e.target.value)}
                    placeholder="Your Professional Title or Headline"
                    className="text-md text-muted-foreground mt-1 border-0 shadow-none p-0 h-auto focus-visible:ring-0 focus-visible:ring-offset-0 hover:bg-muted/50"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="p-4 sm:px-0 sm:pb-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1 space-y-6">
            <Card>
              <CardHeader><CardTitle className="text-lg flex items-center"><UserCircleIcon className="mr-2 h-5 w-5 text-primary"/>About</CardTitle></CardHeader>
              <CardContent>
                <Textarea
                  id="professionalBio"
                  name="professionalBio"
                  placeholder="Write a summary about your professional background, skills, and aspirations..."
                  value={editedData.professionalBio || ''}
                  onChange={(e) => handleInputChange('professionalBio', e.target.value)}
                  rows={8}
                  className="text-sm"
                />
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row justify-between items-center">
                <CardTitle className="text-lg flex items-center"><StarIcon className="mr-2 h-5 w-5 text-primary"/>Areas of Expertise</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {editedData.areasOfExpertise && editedData.areasOfExpertise.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {editedData.areasOfExpertise.map((area, index) => (
                      <div key={index} className="flex items-center bg-secondary text-secondary-foreground px-2.5 py-1 rounded-md text-xs">
                        <span>{area}</span>
                        <Button type="button" variant="ghost" size="icon" className="ml-1.5 h-5 w-5 text-secondary-foreground hover:bg-secondary/80" onClick={() => handleRemoveExpertise(index)}>
                          <TrashIcon className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
                <div className="flex items-end gap-2">
                  <div className="flex-grow space-y-1">
                      <Label htmlFor="newExpertise" className="sr-only">Add Expertise</Label>
                      <Input id="newExpertise" value={currentExpertise} onChange={(e) => setCurrentExpertise(e.target.value)} placeholder="Add an area..." className="text-sm h-9"/>
                  </div>
                  <Button type="button" onClick={handleAddExpertise} variant="outline" size="icon" aria-label="Add expertise" className="h-9 w-9"><PlusCircleIcon className="h-4 w-4" /></Button>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="text-lg flex items-center"><LinkIconOutline className="mr-2 h-5 w-5 text-primary"/>External Links</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {editedData.externalProfileLinks && editedData.externalProfileLinks.length > 0 && (
                  <ul className="space-y-2">
                    {editedData.externalProfileLinks.map((link) => (
                      <li key={link.id} className="flex items-center justify-between p-2 border rounded-md bg-muted/30 text-xs">
                        <div>
                          <span className="font-medium text-foreground">{link.platform}: </span>
                          <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline truncate max-w-[150px] inline-block align-bottom">
                             {link.url.replace(/^https?:\/\//, '')} <ArrowTopRightOnSquareIcon className="inline h-3 w-3 ml-0.5 opacity-70"/>
                          </a>
                        </div>
                        <Button type="button" variant="ghost" size="icon" className="text-destructive hover:text-destructive hover:bg-destructive/10 h-6 w-6" onClick={() => handleRemoveLink(link.id)}><TrashIcon className="h-3.5 w-3.5" /></Button>
                      </li>
                    ))}
                  </ul>
                )}
                <div className="grid grid-cols-1 gap-2">
                  <Input value={currentLinkPlatform} onChange={(e) => setCurrentLinkPlatform(e.target.value)} placeholder="Platform (e.g., LinkedIn)" className="text-sm h-9"/>
                  <div className="flex items-end gap-2">
                    <Input type="url" value={currentLinkUrl} onChange={(e) => setCurrentLinkUrl(e.target.value)} placeholder="URL (https://...)" className="text-sm h-9 flex-grow"/>
                    <Button type="button" onClick={handleAddLink} variant="outline" size="icon" aria-label="Add external link" className="h-9 w-9"><PlusCircleIcon className="h-4 w-4" /></Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-2 space-y-6">
            <Card>
                <CardHeader className="flex flex-row justify-between items-center">
                    <CardTitle className="text-lg flex items-center"><BriefcaseIcon className="mr-2 h-5 w-5 text-primary"/>Experience</CardTitle>
                    <Button type="button" variant="outline" size="sm" onClick={openAddWorkExperienceDialog}><PlusCircleIcon className="mr-1.5 h-4 w-4"/>Add Experience</Button>
                </CardHeader>
                <CardContent className="space-y-4">
                    {(editedData.workExperience || []).length === 0 && <p className="text-sm text-muted-foreground text-center py-4">No work experience added yet.</p>}
                    {(editedData.workExperience || []).map(exp => (
                        <div key={exp.id} className="p-3 rounded-md border bg-muted/30">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h4 className="font-semibold text-foreground">{exp.title}</h4>
                                    <p className="text-sm text-muted-foreground">{exp.company} &bull; {exp.employmentType}</p>
                                    <p className="text-xs text-muted-foreground">{exp.startDate} - {exp.endDate || 'Present'} &bull; {exp.location}</p>
                                    {exp.description && <p className="text-xs text-muted-foreground mt-1 whitespace-pre-line">{exp.description}</p>}
                                </div>
                                <div className="flex-shrink-0 space-x-1">
                                    <Button type="button" variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEditWorkExperienceDialog(exp)}><PencilSquareIcon className="h-4 w-4"/></Button>
                                    <Button type="button" variant="ghost" size="icon" className="text-destructive hover:text-destructive h-7 w-7" onClick={() => setWorkExperienceToDelete(exp)}><TrashIcon className="h-4 w-4"/></Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>

             <Card>
                <CardHeader className="flex flex-row justify-between items-center">
                    <CardTitle className="text-lg flex items-center"><BookOpenIcon className="mr-2 h-5 w-5 text-primary"/>Education</CardTitle>
                    <Button type="button" variant="outline" size="sm" onClick={openAddEducationDialog}><PlusCircleIcon className="mr-1.5 h-4 w-4"/>Add Education</Button>
                </CardHeader>
                <CardContent className="space-y-4">
                     {(editedData.education || []).length === 0 && <p className="text-sm text-muted-foreground text-center py-4">No education details added yet.</p>}
                    {(editedData.education || []).map(edu => (
                        <div key={edu.id} className="p-3 rounded-md border bg-muted/30">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h4 className="font-semibold text-foreground">{edu.institution}</h4>
                                    <p className="text-sm text-muted-foreground">{edu.degree}, {edu.fieldOfStudy}</p>
                                    <p className="text-xs text-muted-foreground">{edu.startDate} - {edu.endDate}</p>
                                    {edu.description && <p className="text-xs text-muted-foreground mt-1 whitespace-pre-line">{edu.description}</p>}
                                </div>
                                <div className="flex-shrink-0 space-x-1">
                                    <Button type="button" variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEditEducationDialog(edu)}><PencilSquareIcon className="h-4 w-4"/></Button>
                                    <Button type="button" variant="ghost" size="icon" className="text-destructive hover:text-destructive h-7 w-7" onClick={() => setEducationToDelete(edu)}><TrashIcon className="h-4 w-4"/></Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>

             <Card>
                <CardHeader className="flex flex-row justify-between items-center">
                    <CardTitle className="text-lg flex items-center"><TrophyIcon className="mr-2 h-5 w-5 text-primary"/>Licenses & Certifications</CardTitle>
                    <Button type="button" variant="outline" size="sm" onClick={openAddLicenseDialog}><PlusCircleIcon className="mr-1.5 h-4 w-4"/>Add Certification</Button>
                </CardHeader>
                <CardContent className="space-y-4">
                     {(editedData.licensesCertifications || []).length === 0 && <p className="text-sm text-muted-foreground text-center py-4">No licenses or certifications added yet.</p>}
                    {(editedData.licensesCertifications || []).map(cert => (
                         <div key={cert.id} className="p-3 rounded-md border bg-muted/30">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h4 className="font-semibold text-foreground">{cert.name}</h4>
                                    <p className="text-sm text-muted-foreground">{cert.issuingOrganization}</p>
                                    <p className="text-xs text-muted-foreground">Issued: {cert.issueDate} {cert.expirationDate ? `| Expires: ${cert.expirationDate}` : ''}</p>
                                    {cert.credentialUrl && cert.credentialUrl !== '#' && <a href={cert.credentialUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline flex items-center mt-1"><ArrowTopRightOnSquareIcon className="h-3 w-3 mr-1"/>Show Credential</a>}
                                </div>
                                <div className="flex-shrink-0 space-x-1">
                                    <Button type="button" variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEditLicenseDialog(cert)}><PencilSquareIcon className="h-4 w-4"/></Button>
                                    <Button type="button" variant="ghost" size="icon" className="text-destructive hover:text-destructive h-7 w-7" onClick={() => setLicenseToDelete(cert)}><TrashIcon className="h-4 w-4"/></Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>
          </div>
        </div>
        <CardFooter className="p-4 sm:px-0 mt-8 pt-6 border-t">
            <div className="flex justify-end w-full">
              <Button type="button" size="lg" onClick={handleSaveAll} disabled={isSaving || !hasChanges}>
                {isSaving && <span className="mr-2 h-5 w-5 animate-spin border-2 border-primary-foreground border-t-transparent rounded-full"></span>}
                {isSaving ? 'Saving...' : 'Save All Changes'}
              </Button>
            </div>
          </CardFooter>
      </div>

      <Dialog open={showWorkExperienceDialog} onOpenChange={setShowWorkExperienceDialog}>
        <DialogContent className="sm:max-w-lg">
            <DialogHeader>
                <DialogTitle>{currentWorkExperience?.id ? 'Edit' : 'Add'} Work Experience</DialogTitle>
                <DialogDescription>Provide details about your role and responsibilities.</DialogDescription>
            </DialogHeader>
            <ScrollArea className="max-h-[70vh] pr-5 -mr-2"><div className="grid gap-4 py-4 pr-1">
                <div className="space-y-1.5">
                    <Label htmlFor="exp-title">Title <span className="text-destructive">*</span></Label>
                    <Input id="exp-title" name="title" value={currentWorkExperience?.title || ''} onChange={handleWorkExperienceDialogChange} />
                </div>
                <div className="space-y-1.5">
                    <Label htmlFor="exp-company">Company <span className="text-destructive">*</span></Label>
                    <Input id="exp-company" name="company" value={currentWorkExperience?.company || ''} onChange={handleWorkExperienceDialogChange} />
                </div>
                <div className="space-y-1.5">
                    <Label htmlFor="exp-employmentType">Employment Type</Label>
                    <Input id="exp-employmentType" name="employmentType" value={currentWorkExperience?.employmentType || ''} onChange={handleWorkExperienceDialogChange} placeholder="e.g., Full-time, Contract"/>
                </div>
                <div className="space-y-1.5">
                    <Label htmlFor="exp-location">Location</Label>
                    <Input id="exp-location" name="location" value={currentWorkExperience?.location || ''} onChange={handleWorkExperienceDialogChange} placeholder="e.g., City, State or Remote"/>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <Label htmlFor="exp-startDate">Start Date (YYYY-MM)</Label>
                        <Input id="exp-startDate" name="startDate" type="month" value={currentWorkExperience?.startDate || ''} onChange={handleWorkExperienceDialogChange} />
                    </div>
                    <div className="space-y-1.5">
                        <Label htmlFor="exp-endDate">End Date (YYYY-MM or Present)</Label>
                        <Input id="exp-endDate" name="endDate" type="text" value={currentWorkExperience?.endDate || ''} onChange={handleWorkExperienceDialogChange} placeholder="YYYY-MM or Present"/>
                    </div>
                </div>
                <div className="space-y-1.5">
                    <Label htmlFor="exp-description">Description</Label>
                    <Textarea id="exp-description" name="description" value={currentWorkExperience?.description || ''} onChange={handleWorkExperienceDialogChange} placeholder="Describe your responsibilities and achievements..." rows={4}/>
                </div>
            </div></ScrollArea>
            <DialogFooter>
                <DialogClose asChild><Button type="button" variant="outline">Cancel</Button></DialogClose>
                <Button type="button" onClick={handleSaveWorkExperience}>Save Experience</Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>
      <AlertDialog open={!!workExperienceToDelete} onOpenChange={(open) => !open && setWorkExperienceToDelete(null)}>
        <AlertDialogContent>
            <AlertDialogHeader><AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
                <AlertDialogDescription>Are you sure you want to delete the experience: "{workExperienceToDelete?.title} at {workExperienceToDelete?.company}"? This action cannot be undone.</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setWorkExperienceToDelete(null)}>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteWorkExperience} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={showEducationDialog} onOpenChange={setShowEducationDialog}>
        <DialogContent className="sm:max-w-lg">
            <DialogHeader>
                <DialogTitle>{currentEducation?.id ? 'Edit' : 'Add'} Education</DialogTitle>
                <DialogDescription>Add your educational qualifications.</DialogDescription>
            </DialogHeader>
            <ScrollArea className="max-h-[70vh] pr-5 -mr-2"><div className="grid gap-4 py-4 pr-1">
                <div className="space-y-1.5"><Label htmlFor="edu-institution">Institution <span className="text-destructive">*</span></Label><Input id="edu-institution" name="institution" value={currentEducation?.institution || ''} onChange={handleEducationDialogChange} /></div>
                <div className="space-y-1.5"><Label htmlFor="edu-degree">Degree</Label><Input id="edu-degree" name="degree" value={currentEducation?.degree || ''} onChange={handleEducationDialogChange} /></div>
                <div className="space-y-1.5"><Label htmlFor="edu-fieldOfStudy">Field of Study</Label><Input id="edu-fieldOfStudy" name="fieldOfStudy" value={currentEducation?.fieldOfStudy || ''} onChange={handleEducationDialogChange} /></div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5"><Label htmlFor="edu-startDate">Start Date (YYYY-MM)</Label><Input id="edu-startDate" name="startDate" type="month" value={currentEducation?.startDate || ''} onChange={handleEducationDialogChange} /></div>
                    <div className="space-y-1.5"><Label htmlFor="edu-endDate">End Date (YYYY-MM)</Label><Input id="edu-endDate" name="endDate" type="month" value={currentEducation?.endDate || ''} onChange={handleEducationDialogChange} /></div>
                </div>
                <div className="space-y-1.5"><Label htmlFor="edu-description">Description/Notes</Label><Textarea id="edu-description" name="description" value={currentEducation?.description || ''} onChange={handleEducationDialogChange} rows={3}/></div>
            </div></ScrollArea>
            <DialogFooter>
                <DialogClose asChild><Button type="button" variant="outline">Cancel</Button></DialogClose>
                <Button type="button" onClick={handleSaveEducation}>Save Education</Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>
      <AlertDialog open={!!educationToDelete} onOpenChange={(open) => !open && setEducationToDelete(null)}>
        <AlertDialogContent>
            <AlertDialogHeader><AlertDialogTitle>Confirm Deletion</AlertDialogTitle><AlertDialogDescription>Are you sure you want to delete this education entry: "{educationToDelete?.institution}"? This action cannot be undone.</AlertDialogDescription></AlertDialogHeader>
            <AlertDialogFooter><AlertDialogCancel onClick={() => setEducationToDelete(null)}>Cancel</AlertDialogCancel><AlertDialogAction onClick={handleDeleteEducation} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={showLicenseDialog} onOpenChange={setShowLicenseDialog}>
        <DialogContent className="sm:max-w-lg">
            <DialogHeader>
                <DialogTitle>{currentLicense?.id ? 'Edit' : 'Add'} License/Certification</DialogTitle>
                <DialogDescription>Add your professional licenses or certifications.</DialogDescription>
            </DialogHeader>
            <ScrollArea className="max-h-[70vh] pr-5 -mr-2"><div className="grid gap-4 py-4 pr-1">
                <div className="space-y-1.5"><Label htmlFor="lic-name">Name <span className="text-destructive">*</span></Label><Input id="lic-name" name="name" value={currentLicense?.name || ''} onChange={handleLicenseDialogChange} /></div>
                <div className="space-y-1.5"><Label htmlFor="lic-issuingOrganization">Issuing Organization</Label><Input id="lic-issuingOrganization" name="issuingOrganization" value={currentLicense?.issuingOrganization || ''} onChange={handleLicenseDialogChange} /></div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5"><Label htmlFor="lic-issueDate">Issue Date</Label><Input id="lic-issueDate" name="issueDate" type="date" value={currentLicense?.issueDate || ''} onChange={handleLicenseDialogChange} /></div>
                    <div className="space-y-1.5"><Label htmlFor="lic-expirationDate">Expiration Date (Optional)</Label><Input id="lic-expirationDate" name="expirationDate" type="date" value={currentLicense?.expirationDate || ''} onChange={handleLicenseDialogChange} /></div>
                </div>
                <div className="space-y-1.5"><Label htmlFor="lic-credentialId">Credential ID</Label><Input id="lic-credentialId" name="credentialId" value={currentLicense?.credentialId || ''} onChange={handleLicenseDialogChange} /></div>
                <div className="space-y-1.5"><Label htmlFor="lic-credentialUrl">Credential URL</Label><Input id="lic-credentialUrl" name="credentialUrl" type="url" value={currentLicense?.credentialUrl || ''} onChange={handleLicenseDialogChange} placeholder="https://example.com/credential"/></div>
            </div></ScrollArea>
            <DialogFooter>
                <DialogClose asChild><Button type="button" variant="outline">Cancel</Button></DialogClose>
                <Button type="button" onClick={handleSaveLicense}>Save License/Certification</Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>
      <AlertDialog open={!!licenseToDelete} onOpenChange={(open) => !open && setLicenseToDelete(null)}>
        <AlertDialogContent>
            <AlertDialogHeader><AlertDialogTitle>Confirm Deletion</AlertDialogTitle><AlertDialogDescription>Are you sure you want to delete this license/certification: "{licenseToDelete?.name}"? This action cannot be undone.</AlertDialogDescription></AlertDialogHeader>
            <AlertDialogFooter><AlertDialogCancel onClick={() => setLicenseToDelete(null)}>Cancel</AlertDialogCancel><AlertDialogAction onClick={handleDeleteLicense} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </ScrollArea>
  );
};

export default ProfessionalProfileScreen;
