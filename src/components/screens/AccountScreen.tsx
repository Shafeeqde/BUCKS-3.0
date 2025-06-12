
"use client";

import React from 'react';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from 'lucide-react';

const AccountScreen = () => {
  const { toast } = useToast();
  const [profile, setProfile] = useState({ name: '', email: '', phone: '' });
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  const [vehicle, setVehicle] = useState({ brand: '', model: '', regNumber: '', documents: [] as File[] });
  const [skills, setSkills] = useState([{ name: '', description: '', media: '' }]);
  const [businessCreated, setBusinessCreated] = useState(false);
  const [products, setProducts] = useState<{ title: string; price: string; image: string }[]>([]);
  const [productForm, setProductForm] = useState({ title: '', price: '', image: '' });
  const [businessInfo, setBusinessInfo] = useState({ name: '', description: '', website: '' });

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async () => {
    if (!profile.name || !profile.email) {
      toast({
        title: "Missing Information",
        description: "Please enter your name and email.",
        variant: "destructive",
      });
      return;
    }
    setIsSavingProfile(true);
    try {
      const response = await fetch('/api/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profile),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to save profile.');
      }

      toast({
        title: "Profile Saved!",
        description: "Your profile information has been updated.",
      });
    } catch (error) {
      console.error("Error saving profile:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Could not save profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSavingProfile(false);
    }
  };

  const updateSkill = (index: number, field: string, value: string) => {
    const updated = [...skills];
    updated[index] = { ...updated[index], [field]: value };
    setSkills(updated);
  };

  const addSkill = () => setSkills([...skills, { name: '', description: '', media: '' }]);

  const handleAddProduct = () => {
    if (productForm.title && productForm.price) {
      setProducts(prev => [...prev, productForm]);
      setProductForm({ title: '', price: '', image: '' }); // Reset form
       toast({ title: "Product Added", description: `${productForm.title} has been added.` });
    } else {
      toast({ title: "Missing Product Info", description: "Please enter product name and price.", variant: "destructive" });
    }
  };


  return (
    <div className="max-w-4xl mx-auto p-6 overflow-y-auto h-full custom-scrollbar">
      <h1 className="text-3xl font-bold mb-6 font-headline">User Dashboard</h1>

      <Tabs defaultValue="profile">
        <TabsList className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 mb-4">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="vehicle">Vehicle</TabsTrigger>
          <TabsTrigger value="skills">Skillsets</TabsTrigger>
          <TabsTrigger value="business">Business</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card><CardContent className="space-y-4 pt-4">
            <Input name="name" placeholder="Full Name" value={profile.name} onChange={handleProfileChange} />
            <Input name="email" type="email" placeholder="Email" value={profile.email} onChange={handleProfileChange} />
            <Input name="phone" type="tel" placeholder="Phone (Optional)" value={profile.phone} onChange={handleProfileChange} />
            <Button onClick={handleSaveProfile} disabled={isSavingProfile}>
              {isSavingProfile && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isSavingProfile ? 'Saving...' : 'Save Profile'}
            </Button>
          </CardContent></Card>
        </TabsContent>

        <TabsContent value="vehicle">
          <Card><CardContent className="space-y-4 pt-4">
            <Input placeholder="Vehicle Brand" value={vehicle.brand} onChange={e => setVehicle({ ...vehicle, brand: e.target.value })} />
            <Input placeholder="Model" value={vehicle.model} onChange={e => setVehicle({ ...vehicle, model: e.target.value })} />
            <Input placeholder="Registration Number" value={vehicle.regNumber} onChange={e => setVehicle({ ...vehicle, regNumber: e.target.value })} />
            <Input 
              type="file" 
              multiple 
              onChange={(e) => {
                const files = e.target.files ? Array.from(e.target.files) : [];
                setVehicle({ ...vehicle, documents: files });
              }} 
              className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
            />
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {vehicle.documents.map((file, index) => (
                <p key={index} className="text-sm truncate bg-muted p-2 rounded-md">{file.name}</p>
              ))}
            </div>
            <Button>Save Vehicle</Button>
          </CardContent></Card>
        </TabsContent>

        <TabsContent value="skills">
          <Card><CardContent className="pt-4">
            {skills.map((skill, index) => (
              <div key={index} className="space-y-3 mb-6 p-4 border rounded-lg">
                <Input placeholder="Skill Name" value={skill.name} onChange={e => updateSkill(index, 'name', e.target.value)} />
                <Textarea placeholder="Description" value={skill.description} onChange={e => updateSkill(index, 'description', e.target.value)} />
                <Input 
                  placeholder="Media URL (PDF, Image, Video, etc.)" 
                  value={skill.media} 
                  onChange={e => updateSkill(index, 'media', e.target.value)} 
                />
                {skill.media && (
                  <div className="border rounded-md p-2 max-w-xs">
                    {skill.media.match(/\.(jpeg|jpg|gif|png)$/i) ? (
                      <img src={skill.media} alt="media preview" className="w-24 h-24 object-cover rounded" data-ai-hint="skill media" />
                    ) : skill.media.match(/\.pdf$/i) ? (
                      <a href={skill.media} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">View PDF</a>
                    ) : (
                      <a href={skill.media} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">View Media</a>
                    )}
                  </div>
                )}
              </div>
            ))}
            <Button variant="outline" onClick={addSkill}>Add Another Skill</Button>
             <Button className="ml-2">Save Skills</Button>
          </CardContent></Card>
        </TabsContent>

        <TabsContent value="business">
          <Card><CardContent className="space-y-4 pt-4">
            {!businessCreated ? (
              <>
                <Input placeholder="Business Name" value={businessInfo.name} onChange={e => setBusinessInfo({ ...businessInfo, name: e.target.value })} />
                <Textarea placeholder="Description" value={businessInfo.description} onChange={e => setBusinessInfo({ ...businessInfo, description: e.target.value })} />
                <Input placeholder="Website URL (optional)" value={businessInfo.website} onChange={e => setBusinessInfo({ ...businessInfo, website: e.target.value })} />
                <Button onClick={() => {
                  if(businessInfo.name && businessInfo.description) {
                    setBusinessCreated(true);
                    toast({ title: "Business Created!", description: `${businessInfo.name} is now set up.` });
                  } else {
                    toast({ title: "Missing Information", description: "Please enter business name and description.", variant: "destructive" });
                  }
                }}>Create Business</Button>
              </>
            ) : (
              <>
                <h3 className="text-lg font-semibold text-foreground">{businessInfo.name} - Add Products</h3>
                <Input placeholder="Product Name" value={productForm.title} onChange={e => setProductForm({ ...productForm, title: e.target.value })} />
                <Input placeholder="Price" type="number" value={productForm.price} onChange={e => setProductForm({ ...productForm, price: e.target.value })} />
                <Input 
                  placeholder="Image URL" 
                  value={productForm.image} 
                  onChange={e => setProductForm({ ...productForm, image: e.target.value })} 
                />
                {productForm.image && (
                  <img src={productForm.image} alt="Product Preview" className="w-24 h-24 object-cover rounded" data-ai-hint="product image" />
                )}
                <Button onClick={handleAddProduct}>Add Product</Button>
                {products.length > 0 && <h4 className="text-md font-semibold pt-4 border-t mt-4">Your Products:</h4>}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2">
                  {products.map((p, i) => (
                    <div key={i} className="text-center p-2 border rounded-lg shadow-sm">
                      <img 
                        src={p.image || 'https://placehold.co/100x100.png'} 
                        alt={p.title} 
                        className="w-20 h-20 mx-auto rounded object-cover mb-2" 
                        data-ai-hint="product item"
                      />
                      <div className="font-semibold text-sm truncate">{p.title}</div>
                      <div className="text-xs text-muted-foreground">₹{p.price}</div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </CardContent></Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AccountScreen;
