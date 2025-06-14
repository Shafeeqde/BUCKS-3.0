
"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, ArrowLeft, Save, Building, Info, Contact, Image as ImageIcon, Globe, Phone, Mail, ShoppingBag, PlusCircle, Edit2, Trash2, Briefcase } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import type { UserBusinessProfile, BusinessProduct, BusinessService } from '@/types';
import { initialBusinessProfiles } from '@/app/page'; 
import Image from 'next/image';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { cn } from '@/lib/utils';


interface BusinessProfileManagementScreenProps {
  businessProfileId: string | number;
  onBack: () => void;
}

const simulateFetchBusinessProfileForManagement = async (profileId: string | number): Promise<UserBusinessProfile | null> => {
  console.log(`Simulating fetching business profile for management: ${profileId}`);
  const existingProfile = initialBusinessProfiles.find(p => p.id === profileId);
  if (existingProfile) {
    return Promise.resolve(JSON.parse(JSON.stringify(existingProfile))); 
  }
  
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
  };
  return Promise.resolve(newProfileTemplate);
};

const simulateUpdateBusinessProfile = async (profileId: string | number, updatedData: Partial<UserBusinessProfile>): Promise<boolean> => {
  console.log(`Simulating updating business profile ${profileId} with data:`, updatedData);
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

  const [showProductDialog, setShowProductDialog] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Partial<BusinessProduct> & { id?: string | number } | null>(null);
  const [productToDeleteId, setProductToDeleteId] = useState<string | number | null>(null);

  const [showServiceDialog, setShowServiceDialog] = useState(false);
  const [currentService, setCurrentService] = useState<Partial<BusinessService> & { id?: string | number } | null>(null);
  const [serviceToDeleteId, setServiceToDeleteId] = useState<string | number | null>(null);

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
        setEditedData({ 
          ...data,
          products: data.products ? [...data.products.map(p => ({...p}))] : [],
          services: data.services ? [...data.services.map(s => ({...s}))] : [],
          jobs: data.jobs ? [...data.jobs.map(j => ({...j}))] : [],
          feed: data.feed ? [...data.feed.map(f => ({...f}))] : [],
        }); 
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
    setEditedData(prev => prev ? ({ ...prev, [field]: value }) : null);
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

  // --- Product CRUD Functions ---
  const openAddProductDialog = () => {
    setCurrentProduct({});
    setShowProductDialog(true);
  };

  const openEditProductDialog = (product: BusinessProduct) => {
    setCurrentProduct({ ...product });
    setShowProductDialog(true);
  };

  const handleProductDialogChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCurrentProduct(prev => prev ? { ...prev, [name]: value } : null);
  };

  const handleSaveProduct = () => {
    if (!currentProduct || !currentProduct.name || !currentProduct.price) {
      toast({ title: "Missing Fields", description: "Product Name and Price are required.", variant: "destructive" });
      return;
    }
    if (!editedData) return;

    let updatedProducts = [...(editedData.products || [])];

    if (currentProduct.id) { 
      updatedProducts = updatedProducts.map(prod =>
        prod.id === currentProduct!.id ? { ...prod, ...currentProduct } as BusinessProduct : prod
      );
    } else { 
      const newProduct: BusinessProduct = {
        id: `prod-${Date.now()}`, 
        name: currentProduct.name,
        price: currentProduct.price,
        description: currentProduct.description || '',
        discountPrice: currentProduct.discountPrice || '',
        discountPercentage: currentProduct.discountPrice && currentProduct.price ? 
                              Math.round(((parseFloat(currentProduct.price) - parseFloat(currentProduct.discountPrice)) / parseFloat(currentProduct.price)) * 100) + '%' 
                              : '',
        imageUrl: currentProduct.imageUrl || '',
        imageAiHint: currentProduct.imageAiHint || '',
      };
      updatedProducts.push(newProduct);
    }
    setEditedData({ ...editedData, products: updatedProducts });
    setShowProductDialog(false);
    setCurrentProduct(null);
    toast({ title: "Product Saved", description: "Product details have been updated locally." });
  };

  const confirmDeleteProduct = (id: string | number) => {
    setProductToDeleteId(id);
  };

  const executeDeleteProduct = () => {
    if (!editedData || productToDeleteId === null) return;
    const updatedProducts = (editedData.products || []).filter(prod => prod.id !== productToDeleteId);
    setEditedData({ ...editedData, products: updatedProducts });
    setProductToDeleteId(null);
    toast({ title: "Product Deleted", variant: "destructive" });
  };

  // --- Service CRUD Functions ---
  const openAddServiceDialog = () => {
    setCurrentService({});
    setShowServiceDialog(true);
  };

  const openEditServiceDialog = (service: BusinessService) => {
    setCurrentService({ ...service });
    setShowServiceDialog(true);
  };

  const handleServiceDialogChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCurrentService(prev => prev ? { ...prev, [name]: value } : null);
  };

  const handleSaveService = () => {
    if (!currentService || !currentService.name) {
      toast({ title: "Missing Name", description: "Service Name is required.", variant: "destructive" });
      return;
    }
    if (!editedData) return;

    let updatedServices = [...(editedData.services || [])];

    if (currentService.id) { // Editing existing service
      updatedServices = updatedServices.map(serv =>
        serv.id === currentService!.id ? { ...serv, ...currentService } as BusinessService : serv
      );
    } else { // Adding new service
      const newService: BusinessService = {
        id: `serv-${Date.now()}`, // Generate unique ID
        name: currentService.name,
        description: currentService.description || '',
        price: currentService.price || '',
      };
      updatedServices.push(newService);
    }
    setEditedData({ ...editedData, services: updatedServices });
    setShowServiceDialog(false);
    setCurrentService(null);
    toast({ title: "Service Saved", description: "Service details have been updated locally." });
  };

  const confirmDeleteService = (id: string | number) => {
    setServiceToDeleteId(id);
  };

  const executeDeleteService = () => {
    if (!editedData || serviceToDeleteId === null) return;
    const updatedServices = (editedData.services || []).filter(serv => serv.id !== serviceToDeleteId);
    setEditedData({ ...editedData, services: updatedServices });
    setServiceToDeleteId(null);
    toast({ title: "Service Deleted", variant: "destructive" });
  };
  
  if (loading) {
    return <div className="flex justify-center items-center h-full p-4"><Loader2 className="h-12 w-12 animate-spin text-primary" /><p className="ml-3">Loading profile data...</p></div>;
  }
  if (error) {
    return <div className="p-4 text-center text-destructive">{error} <Button onClick={() => fetchProfileData(businessProfileId)} variant="outline">Try Again</Button></div>;
  }
  if (!profileData || !editedData) { 
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

            <Card>
              <CardHeader><CardTitle className="flex items-center"><ImageIcon className="mr-2 h-5 w-5 text-primary"/>Visuals</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div><Label htmlFor="logoUrl">Logo URL</Label><Input id="logoUrl" value={editedData.logo || ''} onChange={(e) => handleInputChange('logo', e.target.value)} placeholder="https://link.to/logo.png"/></div>
                <div><Label htmlFor="logoAiHint">Logo AI Hint</Label><Input id="logoAiHint" value={editedData.logoAiHint || ''} onChange={(e) => handleInputChange('logoAiHint', e.target.value)} placeholder="e.g., modern cafe logo"/></div>
                <div><Label htmlFor="coverPhotoUrl">Cover Photo URL</Label><Input id="coverPhotoUrl" value={editedData.coverPhoto || ''} onChange={(e) => handleInputChange('coverPhoto', e.target.value)} placeholder="https://link.to/cover.jpg"/></div>
                <div><Label htmlFor="coverPhotoAiHint">Cover Photo AI Hint</Label><Input id="coverPhotoAiHint" value={editedData.coverPhotoAiHint || ''} onChange={(e) => handleInputChange('coverPhotoAiHint', e.target.value)} placeholder="e.g., bustling cafe interior"/></div>
              </CardContent>
            </Card>
            
            <Card>
                <CardHeader className="flex flex-row justify-between items-center">
                    <CardTitle className="flex items-center"><ShoppingBag className="mr-2 h-5 w-5 text-primary"/>Products/Menu Items</CardTitle>
                    <Button type="button" variant="outline" size="sm" onClick={openAddProductDialog}>
                        <PlusCircle className="mr-2 h-4 w-4" /> Add New Product
                    </Button>
                </CardHeader>
                <CardContent>
                    {editedData.products && editedData.products.length > 0 ? (
                        <div className="space-y-3">
                            {editedData.products.map((product) => (
                                <Card key={product.id} className="p-3 bg-muted/30">
                                    <div className="flex items-start gap-3">
                                        {product.imageUrl && (
                                            <Image src={product.imageUrl} alt={product.name} width={60} height={60} className="rounded-md object-cover border" data-ai-hint={product.imageAiHint || "product item"}/>
                                        )}
                                        <div className="flex-grow">
                                            <h4 className="font-semibold text-sm">{product.name}</h4>
                                            <p className="text-xs text-muted-foreground">{product.description ? product.description.substring(0,100) + (product.description.length > 100 ? '...' : '') : 'No description'}</p>
                                            <p className="text-sm font-medium text-primary mt-1">
                                                {product.discountPrice ? `₹${product.discountPrice}` : `₹${product.price}`}
                                                {product.discountPrice && <span className="text-xs text-muted-foreground line-through ml-1">₹{product.price}</span>}
                                                {product.discountPercentage && <span className="text-xs text-destructive ml-1.5">({product.discountPercentage})</span>}
                                            </p>
                                        </div>
                                        <div className="flex flex-col sm:flex-row gap-1 flex-shrink-0">
                                            <Button type="button" variant="ghost" size="icon" onClick={() => openEditProductDialog(product)} className="h-8 w-8">
                                                <Edit2 className="h-4 w-4" />
                                            </Button>
                                            <AlertDialogTrigger asChild>
                                                <Button type="button" variant="ghost" size="icon" className="text-destructive hover:text-destructive h-8 w-8" onClick={() => confirmDeleteProduct(product.id)}>
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </AlertDialogTrigger>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-muted-foreground text-center py-4">No products added yet for this business.</p>
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row justify-between items-center">
                    <CardTitle className="flex items-center"><Briefcase className="mr-2 h-5 w-5 text-primary"/>Services Offered</CardTitle>
                    <Button type="button" variant="outline" size="sm" onClick={openAddServiceDialog}>
                        <PlusCircle className="mr-2 h-4 w-4" /> Add New Service
                    </Button>
                </CardHeader>
                <CardContent>
                    {editedData.services && editedData.services.length > 0 ? (
                        <div className="space-y-3">
                            {editedData.services.map((service) => (
                                <Card key={service.id} className="p-3 bg-muted/30">
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex-grow">
                                            <h4 className="font-semibold text-sm">{service.name}</h4>
                                            {service.description && <p className="text-xs text-muted-foreground mt-1">{service.description.substring(0,150) + (service.description.length > 150 ? '...' : '')}</p>}
                                            {service.price && <p className="text-sm font-medium text-primary mt-1">{service.price}</p>}
                                        </div>
                                        <div className="flex flex-col sm:flex-row gap-1 flex-shrink-0">
                                            <Button type="button" variant="ghost" size="icon" onClick={() => openEditServiceDialog(service)} className="h-8 w-8">
                                                <Edit2 className="h-4 w-4" />
                                            </Button>
                                            <AlertDialogTrigger asChild>
                                                <Button type="button" variant="ghost" size="icon" className="text-destructive hover:text-destructive h-8 w-8" onClick={() => confirmDeleteService(service.id)}>
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </AlertDialogTrigger>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-muted-foreground text-center py-4">No services added yet for this business.</p>
                    )}
                </CardContent>
            </Card>
            
            <Card>
                <CardHeader><CardTitle>Job Openings</CardTitle></CardHeader>
                <CardContent><p className="text-sm text-muted-foreground">Job posting management will be enabled soon.</p></CardContent>
            </Card>

            <Card>
                <CardHeader><CardTitle>Business Feed/Posts</CardTitle></CardHeader>
                <CardContent><p className="text-sm text-muted-foreground">Feed post management will be enabled soon.</p></CardContent>
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

      {/* Product Dialog */}
      <Dialog open={showProductDialog} onOpenChange={setShowProductDialog}>
        <DialogContent className="sm:max-w-lg">
            <DialogHeader>
                <DialogTitle>{currentProduct?.id ? 'Edit Product' : 'Add New Product'}</DialogTitle>
                <DialogDescription>
                    Fill in the details for the product or menu item.
                </DialogDescription>
            </DialogHeader>
            <ScrollArea className="max-h-[70vh] pr-6">
                <div className="grid gap-4 py-4">
                    <div className="space-y-1.5">
                        <Label htmlFor="prod-name">Product Name <span className="text-destructive">*</span></Label>
                        <Input id="prod-name" name="name" value={currentProduct?.name || ''} onChange={handleProductDialogChange} />
                    </div>
                    <div className="space-y-1.5">
                        <Label htmlFor="prod-description">Description</Label>
                        <Textarea id="prod-description" name="description" value={currentProduct?.description || ''} onChange={handleProductDialogChange} placeholder="Describe the product..." />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <Label htmlFor="prod-price">Original Price (₹) <span className="text-destructive">*</span></Label>
                            <Input id="prod-price" name="price" type="number" value={currentProduct?.price || ''} onChange={handleProductDialogChange} />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="prod-discountPrice">Discounted Price (₹)</Label>
                            <Input id="prod-discountPrice" name="discountPrice" type="number" value={currentProduct?.discountPrice || ''} onChange={handleProductDialogChange} />
                        </div>
                    </div>
                     {currentProduct?.price && currentProduct?.discountPrice && parseFloat(currentProduct.price) > parseFloat(currentProduct.discountPrice) && (
                        <div className="text-xs text-destructive">
                            Calculated Discount: {Math.round(((parseFloat(currentProduct.price) - parseFloat(currentProduct.discountPrice)) / parseFloat(currentProduct.price)) * 100)}%
                        </div>
                     )}
                    <div className="space-y-1.5">
                        <Label htmlFor="prod-imageUrl">Image URL</Label>
                        <Input id="prod-imageUrl" name="imageUrl" value={currentProduct?.imageUrl || ''} onChange={handleProductDialogChange} placeholder="https://example.com/image.png"/>
                    </div>
                    <div className="space-y-1.5">
                        <Label htmlFor="prod-imageAiHint">Image AI Hint</Label>
                        <Input id="prod-imageAiHint" name="imageAiHint" value={currentProduct?.imageAiHint || ''} onChange={handleProductDialogChange} placeholder="e.g., spicy chicken biryani"/>
                    </div>
                </div>
            </ScrollArea>
            <DialogFooter>
                <DialogClose asChild>
                    <Button type="button" variant="outline">Cancel</Button>
                </DialogClose>
                <Button type="button" onClick={handleSaveProduct}>Save Product</Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={productToDeleteId !== null} onOpenChange={(open) => !open && setProductToDeleteId(null)}>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the product
                    "{editedData?.products?.find(p => p.id === productToDeleteId)?.name || 'this product'}".
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setProductToDeleteId(null)}>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={executeDeleteProduct} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Service Dialog */}
      <Dialog open={showServiceDialog} onOpenChange={setShowServiceDialog}>
        <DialogContent className="sm:max-w-lg">
            <DialogHeader>
                <DialogTitle>{currentService?.id ? 'Edit Service' : 'Add New Service'}</DialogTitle>
                <DialogDescription>
                    Fill in the details for the service offered.
                </DialogDescription>
            </DialogHeader>
            <ScrollArea className="max-h-[70vh] pr-6">
                <div className="grid gap-4 py-4">
                    <div className="space-y-1.5">
                        <Label htmlFor="serv-name">Service Name <span className="text-destructive">*</span></Label>
                        <Input id="serv-name" name="name" value={currentService?.name || ''} onChange={handleServiceDialogChange} />
                    </div>
                    <div className="space-y-1.5">
                        <Label htmlFor="serv-description">Description</Label>
                        <Textarea id="serv-description" name="description" value={currentService?.description || ''} onChange={handleServiceDialogChange} placeholder="Describe the service..." />
                    </div>
                    <div className="space-y-1.5">
                        <Label htmlFor="serv-price">Price / Rate</Label>
                        <Input id="serv-price" name="price" value={currentService?.price || ''} onChange={handleServiceDialogChange} placeholder="e.g., $50/hr, Starting at $100, Free Consultation"/>
                    </div>
                </div>
            </ScrollArea>
            <DialogFooter>
                <DialogClose asChild>
                    <Button type="button" variant="outline">Cancel</Button>
                </DialogClose>
                <Button type="button" onClick={handleSaveService}>Save Service</Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={serviceToDeleteId !== null} onOpenChange={(open) => !open && setServiceToDeleteId(null)}>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the service
                    "{editedData?.services?.find(s => s.id === serviceToDeleteId)?.name || 'this service'}".
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setServiceToDeleteId(null)}>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={executeDeleteService} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </ScrollArea>
  );
};

export default BusinessProfileManagementScreen;

    
