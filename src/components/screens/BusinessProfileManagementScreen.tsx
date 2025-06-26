
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ArrowLeftIcon, ArrowDownTrayIcon, BuildingOfficeIcon, InformationCircleIcon, IdentificationIcon, PhotoIcon, GlobeAltIcon, PhoneIcon, EnvelopeIcon, ShoppingBagIcon, PlusCircleIcon, PencilSquareIcon, TrashIcon, BriefcaseIcon } from '@heroicons/react/24/outline';
import { useToast } from "@/hooks/use-toast";
import type { UserBusinessProfile, BusinessProduct, BusinessService } from '@/types';
import Image from 'next/image';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import ImageUpload from '@/components/ui/ImageUpload';

interface BusinessProfileManagementScreenProps {
  initialProfileData: Partial<UserBusinessProfile> | null;
  onSave: (profileData: UserBusinessProfile) => void;
  onBack: () => void;
}

const BusinessProfileManagementScreen: React.FC<BusinessProfileManagementScreenProps> = ({ initialProfileData, onSave, onBack }) => {
  const { toast } = useToast();
  const [editedData, setEditedData] = useState<Partial<UserBusinessProfile>>({});
  const [originalSnapshot, setOriginalSnapshot] = useState<string>('');

  const [isSaving, setIsSaving] = useState(false);

  const [showProductDialog, setShowProductDialog] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Partial<BusinessProduct> & { tempId?: string } | null>(null);
  const [productToDeleteId, setProductToDeleteId] = useState<string | null>(null);

  const [showServiceDialog, setShowServiceDialog] = useState(false);
  const [currentService, setCurrentService] = useState<Partial<BusinessService> & { tempId?: string } | null>(null);
  const [serviceToDeleteId, setServiceToDeleteId] = useState<string | null>(null);

  const isNewProfile = !initialProfileData?.id;

  useEffect(() => {
    if (initialProfileData) {
      const dataToEdit = JSON.parse(JSON.stringify(initialProfileData));
      dataToEdit.products = dataToEdit.products || [];
      dataToEdit.services = dataToEdit.services || [];
      dataToEdit.jobs = dataToEdit.jobs || [];
      dataToEdit.feed = dataToEdit.feed || [];
      dataToEdit.reviews = dataToEdit.reviews || [];
      dataToEdit.specialties = dataToEdit.specialties || [];
      if (dataToEdit.isActive === undefined) dataToEdit.isActive = true;

      setEditedData(dataToEdit);
      setOriginalSnapshot(JSON.stringify(dataToEdit));
    }
  }, [initialProfileData]);


  const handleInputChange = (field: keyof UserBusinessProfile, value: any) => {
    setEditedData(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveChanges = () => {
    if (!editedData.name || !editedData.bio) {
      toast({ title: "Validation Error", description: "Business Name and Bio are required.", variant: "destructive" });
      return;
    }
    setIsSaving(true);

    const profileToSave: UserBusinessProfile = {
      id: editedData.id || `bp-local-${Date.now()}`,
      name: editedData.name!,
      bio: editedData.bio!,
      logo: editedData.logo || '',
      logoAiHint: editedData.logoAiHint || '',
      coverPhoto: editedData.coverPhoto || '',
      coverPhotoAiHint: editedData.coverPhotoAiHint || '',
      website: editedData.website || '',
      phone: editedData.phone || '',
      email: editedData.email || '',
      location: editedData.location || '',
      specialties: editedData.specialties || [],
      followers: editedData.followers || 0,
      following: editedData.following || 0,
      feed: (editedData.feed || []).map(f => ({ ...f, id: f.id || `feed-local-${Date.now()}` })),
      products: (editedData.products || []).map(p => ({ ...p, id: p.id || `prod-local-${Date.now()}` })),
      services: (editedData.services || []).map(s => ({ ...s, id: s.id || `serv-local-${Date.now()}` })),
      jobs: (editedData.jobs || []).map(j => ({ ...j, id: j.id || `job-local-${Date.now()}`, businessId: editedData.id || `bp-local-${Date.now()}`, businessName: editedData.name! })),
      reviews: (editedData.reviews || []).map(r => ({ ...r, id: r.id || `rev-local-${Date.now()}`})),
      averageRating: editedData.averageRating || 0,
      totalReviews: editedData.totalReviews || 0,
      isActive: editedData.isActive === undefined ? true : editedData.isActive,
      licenseNumber: editedData.licenseNumber || '',
      documentUrl: editedData.documentUrl || '',
    };

    onSave(profileToSave);
    setIsSaving(false);
    onBack();
  };

  const openAddProductDialog = () => {
    setCurrentProduct({ tempId: `temp-${Date.now()}` });
    setShowProductDialog(true);
  };

  const openEditProductDialog = (product: BusinessProduct | (Partial<BusinessProduct> & { tempId?: string })) => {
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
    const idToUse = currentProduct.id || currentProduct.tempId || `prod-local-${Date.now()}`;

    const productToSave: BusinessProduct = {
      id: idToUse,
      name: currentProduct.name,
      price: currentProduct.price,
      description: currentProduct.description || '',
      discountPrice: currentProduct.discountPrice || undefined,
      discountPercentage: currentProduct.discountPrice && currentProduct.price ?
                            Math.round(((parseFloat(currentProduct.price) - parseFloat(currentProduct.discountPrice)) / parseFloat(currentProduct.price)) * 100) + '%'
                            : undefined,
      imageUrl: currentProduct.imageUrl || undefined,
      imageAiHint: currentProduct.imageAiHint || undefined,
    };

    const existingProductIndex = updatedProducts.findIndex(p => (p.id || (p as any).tempId) === idToUse);

    if (existingProductIndex > -1) {
      updatedProducts[existingProductIndex] = productToSave;
    } else {
      updatedProducts.push(productToSave);
    }
    setEditedData({ ...editedData, products: updatedProducts });
    setShowProductDialog(false);
    setCurrentProduct(null);
    toast({ title: "Product Saved", description: "Product details have been updated locally." });
  };

  const confirmDeleteProduct = (id: string) => {
    setProductToDeleteId(id);
  };

  const executeDeleteProduct = () => {
    if (!editedData || productToDeleteId === null) return;
    const updatedProducts = (editedData.products || []).filter(prod => (prod.id || (prod as any).tempId) !== productToDeleteId);
    setEditedData({ ...editedData, products: updatedProducts });
    setProductToDeleteId(null);
    toast({ title: "Product Deleted", variant: "destructive" });
  };

  const openAddServiceDialog = () => {
    setCurrentService({ tempId: `temp-${Date.now()}` });
    setShowServiceDialog(true);
  };

  const openEditServiceDialog = (service: BusinessService | (Partial<BusinessService> & { tempId?: string })) => {
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
    const idToUse = currentService.id || currentService.tempId || `serv-local-${Date.now()}`;

    const serviceToSave: BusinessService = {
      id: idToUse,
      name: currentService.name,
      description: currentService.description || undefined,
      price: currentService.price || undefined,
    };

    const existingServiceIndex = updatedServices.findIndex(s => (s.id || (s as any).tempId) === idToUse);

    if (existingServiceIndex > -1) {
      updatedServices[existingServiceIndex] = serviceToSave;
    } else {
      updatedServices.push(serviceToSave);
    }
    setEditedData({ ...editedData, services: updatedServices });
    setShowServiceDialog(false);
    setCurrentService(null);
    toast({ title: "Service Saved", description: "Service details have been updated locally." });
  };

  const confirmDeleteService = (id: string) => {
    setServiceToDeleteId(id);
  };

  const executeDeleteService = () => {
    if (!editedData || serviceToDeleteId === null) return;
    const updatedServices = (editedData.services || []).filter(serv => (serv.id || (serv as any).tempId) !== serviceToDeleteId);
    setEditedData({ ...editedData, services: updatedServices });
    setServiceToDeleteId(null);
    toast({ title: "Service Deleted", variant: "destructive" });
  };


  if (!initialProfileData || !editedData) {
    return <div className="flex justify-center items-center h-full p-4"><span className="h-12 w-12 animate-spin border-2 border-primary border-t-transparent rounded-full"></span><p className="ml-3">Loading profile data...</p></div>;
  }

  const hasChanges = JSON.stringify(editedData) !== originalSnapshot;

  return (
    <ScrollArea className="h-full bg-background">
      <div className="max-w-4xl mx-auto p-4 sm:p-6 md:p-8">
        <Button variant="outline" onClick={onBack} className="mb-6">
          <ArrowLeftIcon className="mr-2 h-4 w-4" /> Back to Business Profiles
        </Button>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-2xl font-headline flex items-center">
              <BuildingOfficeIcon className="mr-2 h-6 w-6 text-primary"/>
              {isNewProfile ? "Create New Business Profile" : `Manage Business: ${initialProfileData.name || "Profile"}`}
            </CardTitle>
            <CardDescription>Edit the details for this business profile. Changes are saved locally until you click "Save Changes".</CardDescription>
          </CardHeader>
        </Card>

        <form onSubmit={(e) => { e.preventDefault(); handleSaveChanges(); }}>
          <div className="space-y-8">
            <Card>
              <CardHeader><CardTitle className="flex items-center"><InformationCircleIcon className="mr-2 h-5 w-5 text-primary"/>Basic Information</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="businessName">Business Name <span className="text-destructive">*</span></Label>
                  <Input id="businessName" value={editedData.name || ''} onChange={(e) => handleInputChange('name', e.target.value)} placeholder="e.g., My Awesome Cafe" />
                </div>
                <div>
                  <Label htmlFor="businessBio">Bio / Description <span className="text-destructive">*</span></Label>
                  <Textarea id="businessBio" value={editedData.bio || ''} onChange={(e) => handleInputChange('bio', e.target.value)} placeholder="Tell us about your business..." rows={4} />
                </div>
                <div className="flex items-center space-x-2 pt-2">
                  <Switch id="isActive" checked={!!editedData.isActive} onCheckedChange={(checked) => handleInputChange('isActive', checked)} />
                  <Label htmlFor="isActive">Profile is Active & Searchable</Label>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle className="flex items-center"><IdentificationIcon className="mr-2 h-5 w-5 text-primary"/>Contact & Location</CardTitle></CardHeader>
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
              <CardHeader><CardTitle className="flex items-center"><PhotoIcon className="mr-2 h-5 w-5 text-primary"/>Visuals</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                 <ImageUpload
                  label="Logo"
                  initialImageUrl={editedData.logo}
                  onUploadComplete={(url) => handleInputChange('logo', url)}
                />
                 <ImageUpload
                  label="Cover Photo"
                  initialImageUrl={editedData.coverPhoto}
                  onUploadComplete={(url) => handleInputChange('coverPhoto', url)}
                />
              </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row justify-between items-center">
                    <CardTitle className="flex items-center"><ShoppingBagIcon className="mr-2 h-5 w-5 text-primary"/>Products/Menu Items</CardTitle>
                    <Button type="button" variant="outline" size="sm" onClick={openAddProductDialog}>
                        <PlusCircleIcon className="mr-2 h-4 w-4" /> Add New Product
                    </Button>
                </CardHeader>
                <CardContent>
                    {editedData.products && editedData.products.length > 0 ? (
                        <div className="space-y-3">
                            {editedData.products.map((product) => (
                                <Card key={product.id || (product as any).tempId} className="p-3 bg-muted/30">
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
                                                <PencilSquareIcon className="h-4 w-4" />
                                            </Button>
                                            <Button type="button" variant="ghost" size="icon" className="text-destructive hover:text-destructive h-8 w-8" onClick={() => confirmDeleteProduct(product.id || (product as any).tempId)}>
                                                <TrashIcon className="h-4 w-4" />
                                            </Button>
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
                    <CardTitle className="flex items-center"><BriefcaseIcon className="mr-2 h-5 w-5 text-primary"/>Services Offered</CardTitle>
                    <Button type="button" variant="outline" size="sm" onClick={openAddServiceDialog}>
                        <PlusCircleIcon className="mr-2 h-4 w-4" /> Add New Service
                    </Button>
                </CardHeader>
                <CardContent>
                    {editedData.services && editedData.services.length > 0 ? (
                        <div className="space-y-3">
                            {editedData.services.map((service) => (
                                <Card key={service.id || (service as any).tempId} className="p-3 bg-muted/30">
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex-grow">
                                            <h4 className="font-semibold text-sm">{service.name}</h4>
                                            {service.description && <p className="text-xs text-muted-foreground mt-1">{service.description.substring(0,150) + (service.description.length > 150 ? '...' : '')}</p>}
                                            {service.price && <p className="text-sm font-medium text-primary mt-1">{service.price}</p>}
                                        </div>
                                        <div className="flex flex-col sm:flex-row gap-1 flex-shrink-0">
                                            <Button type="button" variant="ghost" size="icon" onClick={() => openEditServiceDialog(service)} className="h-8 w-8">
                                                <PencilSquareIcon className="h-4 w-4" />
                                            </Button>
                                            <Button type="button" variant="ghost" size="icon" className="text-destructive hover:text-destructive h-8 w-8" onClick={() => confirmDeleteService(service.id || (service as any).tempId)}>
                                                <TrashIcon className="h-4 w-4" />
                                            </Button>
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
                {isSaving && <span className="mr-2 h-4 w-4 animate-spin border-2 border-primary-foreground border-t-transparent rounded-full"></span>}
                <ArrowDownTrayIcon className="mr-2 h-4 w-4"/>
                {isSaving ? 'Saving...' : (isNewProfile ? 'Create Profile' : 'Save Changes')}
              </Button>
            </div>
          </CardFooter>
        </form>
      </div>

      <Dialog open={showProductDialog} onOpenChange={setShowProductDialog}>
        <DialogContent className="sm:max-w-lg">
            <DialogHeader>
                <DialogTitle>{currentProduct?.id || currentProduct?.tempId ? 'Edit Product' : 'Add New Product'}</DialogTitle>
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
                            <Input id="prod-price" name="price" type="text" value={currentProduct?.price || ''} onChange={handleProductDialogChange} />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="prod-discountPrice">Discounted Price (₹)</Label>
                            <Input id="prod-discountPrice" name="discountPrice" type="text" value={currentProduct?.discountPrice || ''} onChange={handleProductDialogChange} />
                        </div>
                    </div>
                     {currentProduct?.price && currentProduct?.discountPrice && parseFloat(currentProduct.price) > parseFloat(currentProduct.discountPrice) && (
                        <div className="text-xs text-destructive">
                            Calculated Discount: {Math.round(((parseFloat(currentProduct.price) - parseFloat(currentProduct.discountPrice)) / parseFloat(currentProduct.price)) * 100)}%
                        </div>
                     )}
                     <ImageUpload
                        label="Product Image"
                        initialImageUrl={currentProduct?.imageUrl}
                        onUploadComplete={(url) => setCurrentProduct(prev => prev ? { ...prev, imageUrl: url } : null)}
                     />
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
                    "{editedData?.products?.find(p => (p.id || (p as any).tempId) === productToDeleteId)?.name || 'this product'}".
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setProductToDeleteId(null)}>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={executeDeleteProduct} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={showServiceDialog} onOpenChange={setShowServiceDialog}>
        <DialogContent className="sm:max-w-lg">
            <DialogHeader>
                <DialogTitle>{currentService?.id || currentService?.tempId ? 'Edit Service' : 'Add New Service'}</DialogTitle>
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
                        <Input id="serv-price" name="price" value={currentService?.price || ''} onChange={handleServiceDialogChange} placeholder="e.g., ₹50/hr, Starting at ₹100, Free Consultation"/>
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
                    "{editedData?.services?.find(s => (s.id || (s as any).tempId) === serviceToDeleteId)?.name || 'this service'}".
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
