"use client";

import React from 'react';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

const AccountScreen = () => {
  const [profile, setProfile] = useState({ name: '', email: '', phone: '' });
  const [vehicle, setVehicle] = useState({ brand: '', model: '', regNumber: '', documents: [] });
  const [skills, setSkills] = useState([{ name: '', description: '', media: '' }]);
  const [businessCreated, setBusinessCreated] = useState(false);
  const [products, setProducts] = useState([]);
  const [productForm, setProductForm] = useState({ title: '', price: '', image: '' });
  const [businessInfo, setBusinessInfo] = useState({ name: '', description: '', website: '' });

  const updateSkill = (index, field, value) => {
    const updated = [...skills];
    updated[index][field] = value;
    setSkills(updated);
  };

  const addSkill = () => setSkills([...skills, { name: '', description: '', media: '' }]);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">User Dashboard</h1>

      <Tabs defaultValue="profile">
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="vehicle">Vehicle</TabsTrigger>
          <TabsTrigger value="skills">Skillsets</TabsTrigger>
          <TabsTrigger value="business">Business</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card><CardContent className="space-y-4 pt-4">
            <Input placeholder="Full Name" value={profile.name} onChange={e => setProfile({ ...profile, name: e.target.value })} />
            <Input placeholder="Email" value={profile.email} onChange={e => setProfile({ ...profile, email: e.target.value })} />
            <Input placeholder="Phone" value={profile.phone} onChange={e => setProfile({ ...profile, phone: e.target.value })} />
            <Button>Save Profile</Button>
          </CardContent></Card>
        </TabsContent>

        <TabsContent value="vehicle">
          <Card><CardContent className="space-y-4 pt-4">
            <Input placeholder="Vehicle Brand" value={vehicle.brand} onChange={e => setVehicle({ ...vehicle, brand: e.target.value })} />
            <Input placeholder="Model" value={vehicle.model} onChange={e => setVehicle({ ...vehicle, model: e.target.value })} />
            <Input placeholder="Registration Number" value={vehicle.regNumber} onChange={e => setVehicle({ ...vehicle, regNumber: e.target.value })} />
            <input type="file" multiple onChange={(e) => {
 const files = Array.from(e.target.files);
 setVehicle({ ...vehicle, documents: files });
 }} />
            <div className="grid grid-cols-3 gap-2">
              {vehicle.documents.map((file, index) => (
                <p key={index} className="text-sm truncate">{file.name}</p>
              ))}
            </div>
            <Button>Save Vehicle</Button>
          </CardContent></Card>
        </TabsContent>

        <TabsContent value="skills">
          <Card><CardContent className="space-y-4 pt-4">
            {skills.map((skill, index) => (
              <div key={index} className="space-y-2">
                <Input placeholder="Skill Name" value={skill.name} onChange={e => updateSkill(index, 'name', e.target.value)} />
                <Textarea placeholder="Description" value={skill.description} onChange={e => updateSkill(index, 'description', e.target.value)} />
                <Input placeholder="Media URL (PDF, Image, Video, etc.)" value={skill.media} onChange={e => updateSkill(index, 'media', e.target.value)} />
                {skill.media && (
                  <div className="border rounded p-2">
                    {skill.media.match(/\.(jpeg|jpg|gif|png)$/) ? (
                      <img src={skill.media} alt="media" className="w-24 h-24 object-cover rounded" />
                    ) : skill.media.match(/\.pdf$/) ? (
                      <a href={skill.media} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">View PDF</a>
                    ) : (
                      <a href={skill.media} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">View Media</a>
                    )}
                  </div>
                )}
              </div>
            ))}
            <Button variant="outline" onClick={addSkill}>Add Skill</Button>
          </CardContent></Card>
        </TabsContent>

        <TabsContent value="business">
          <Card><CardContent className="space-y-4 pt-4">
            {!businessCreated ? (
              <>
                <Input placeholder="Business Name" value={businessInfo.name} onChange={e => setBusinessInfo({ ...businessInfo, name: e.target.value })} />
                <Textarea placeholder="Description" value={businessInfo.description} onChange={e => setBusinessInfo({ ...businessInfo, description: e.target.value })} />
                <Input placeholder="Website URL (optional)" value={businessInfo.website} onChange={e => setBusinessInfo({ ...businessInfo, website: e.target.value })} />
                <Button onClick={() => setBusinessCreated(true)}>Create Business</Button>
              </>
            ) : (
              <>
                <Input placeholder="Product Name" value={productForm.title} onChange={e => setProductForm({ ...productForm, title: e.target.value })} />
                <Input placeholder="Price" type="number" value={productForm.price} onChange={e => setProductForm({ ...productForm, price: e.target.value })} />
                <Input placeholder="Image URL" value={productForm.image} onChange={e => setProductForm({ ...productForm, image: e.target.value })} />
                {productForm.image && (
                  <img src={productForm.image} alt="Preview" className="w-24 h-24 object-cover rounded" />
                )}
                <Button onClick={addProduct}>Add Product</Button>
                <div className="grid grid-cols-3 gap-4 pt-4">
                  {products.map((p, i) => (
                    <div key={i} className="text-center">
                      <img src={p.image || '/images/default-product.png'} className="w-20 h-20 mx-auto rounded" />
                      <div className="font-semibold">{p.title}</div>
                      <div className="text-sm text-gray-600">₹{p.price}</div>
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
