
"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { PlusCircle, Edit3, Trash2, XCircle, Rocket, Search } from 'lucide-react';
import type { UserSkill } from '@/types';
import { useToast } from "@/hooks/use-toast";

const initialSkills: UserSkill[] = [
  { id: '1', name: 'React Development', level: 'Advanced', description: 'Building complex UIs and managing state with React.', media: 'https://placehold.co/100x100.png', isActive: true },
  { id: '2', name: 'Tailwind CSS', level: 'Expert', description: 'Rapidly styling applications with utility-first CSS.', isActive: true },
  { id: '3', name: 'Node.js Backend', level: 'Intermediate', description: 'Developing REST APIs and server-side logic.', isActive: false },
];

const UserSkillsetsScreen = () => {
  const [skills, setSkills] = useState<UserSkill[]>(initialSkills);
  const [showForm, setShowForm] = useState(false);
  const [editingSkill, setEditingSkill] = useState<UserSkill | null>(null);
  const [currentSkill, setCurrentSkill] = useState<Partial<UserSkill>>({});
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCurrentSkill(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // For demo, we'll just store the placeholder URL or filename.
    // In a real app, this would involve file upload logic.
    setCurrentSkill(prev => ({ ...prev, media: e.target.files?.[0] ? `https://placehold.co/100x100.png?text=${e.target.files[0].name.substring(0,3)}` : undefined }));
  };
  
  const resetForm = () => {
    setCurrentSkill({});
    setEditingSkill(null);
    setShowForm(false);
  };

  const handleSubmit = () => {
    if (!currentSkill.name || !currentSkill.description) {
      toast({ title: "Missing Fields", description: "Skill name and description are required.", variant: "destructive" });
      return;
    }

    if (editingSkill) {
      setSkills(skills.map(s => s.id === editingSkill.id ? { ...s, ...currentSkill } as UserSkill : s));
      toast({ title: "Skill Updated", description: `${currentSkill.name} has been updated.` });
    } else {
      const newSkillToAdd: UserSkill = {
        id: Date.now().toString(),
        name: currentSkill.name,
        description: currentSkill.description,
        level: currentSkill.level,
        media: currentSkill.media,
        isActive: currentSkill.isActive === undefined ? true : currentSkill.isActive,
      };
      setSkills([...skills, newSkillToAdd]);
      toast({ title: "Skill Added", description: `${newSkillToAdd.name} has been added.` });
    }
    resetForm();
  };

  const handleEdit = (skill: UserSkill) => {
    setEditingSkill(skill);
    setCurrentSkill(skill);
    setShowForm(true);
  };

  const handleDelete = (skillId: string) => {
    setSkills(skills.filter(s => s.id !== skillId));
    toast({ title: "Skill Deleted", variant: "destructive" });
  };

  const toggleActive = (skillId: string) => {
    setSkills(skills.map(s => s.id === skillId ? { ...s, isActive: !s.isActive } : s));
  };

  const filteredSkills = skills.filter(skill => 
    skill.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    skill.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (skill.level && skill.level.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 h-full overflow-y-auto custom-scrollbar">
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle className="text-2xl font-headline flex items-center">
                <Rocket className="mr-2 h-6 w-6 text-primary" /> My Skillsets
              </CardTitle>
              <CardDescription>Manage your professional skills and expertise.</CardDescription>
            </div>
            <Button onClick={() => { resetForm(); setShowForm(true); }} className="w-full sm:w-auto">
              <PlusCircle className="mr-2 h-5 w-5" /> Add New Skill
            </Button>
          </div>
           <div className="mt-4 relative">
            <Input 
              placeholder="Search skills..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          </div>
        </CardHeader>

        {showForm && (
          <CardContent className="border-t pt-6">
            <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="space-y-6">
              <h3 className="text-lg font-semibold text-foreground">{editingSkill ? 'Edit Skill' : 'Add New Skill'}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="skillName">Skill Name <span className="text-destructive">*</span></Label>
                  <Input id="skillName" name="name" value={currentSkill.name || ''} onChange={handleInputChange} placeholder="e.g., JavaScript, Project Management" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="skillLevel">Proficiency Level</Label>
                  <Input id="skillLevel" name="level" value={currentSkill.level || ''} onChange={handleInputChange} placeholder="e.g., Advanced, Intermediate" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="skillDescription">Description <span className="text-destructive">*</span></Label>
                <Textarea id="skillDescription" name="description" value={currentSkill.description || ''} onChange={handleInputChange} placeholder="Describe your experience with this skill..." required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="skillMedia">Media URL / Placeholder</Label>
                <Input id="skillMedia" name="media" value={currentSkill.media || ''} onChange={handleInputChange} placeholder="e.g., link to portfolio, certificate, or image URL" />
                {/* For actual file upload, you'd use type="file" and handle it differently */}
                {/* <Input id="skillMediaFile" type="file" onChange={handleFileChange} /> */}
                {currentSkill.media && currentSkill.media.startsWith('https://placehold.co') && (
                  <img src={currentSkill.media} alt="Media preview" className="mt-2 w-20 h-20 object-cover rounded border" data-ai-hint="skill media" />
                )}
              </div>
              <div className="flex items-center space-x-2 pt-2">
                <Switch id="skillIsActive" name="isActive" checked={currentSkill.isActive === undefined ? true : currentSkill.isActive} onCheckedChange={(checked) => setCurrentSkill(prev => ({...prev, isActive: checked}))} />
                <Label htmlFor="skillIsActive">Skill is Active</Label>
              </div>
              <CardFooter className="p-0 pt-6 flex justify-end space-x-3">
                <Button variant="outline" type="button" onClick={resetForm}>
                  <XCircle className="mr-2 h-4 w-4" /> Cancel
                </Button>
                <Button type="submit">
                  <PlusCircle className="mr-2 h-4 w-4" /> {editingSkill ? 'Save Changes' : 'Add Skill'}
                </Button>
              </CardFooter>
            </form>
          </CardContent>
        )}

        {!showForm && (
          <CardContent className={filteredSkills.length > 0 ? "pt-6" : "pt-0"}>
            {filteredSkills.length === 0 && !searchTerm && (
              <p className="text-center text-muted-foreground py-6">No skills added yet. Click "Add New Skill" to get started.</p>
            )}
            {filteredSkills.length === 0 && searchTerm && (
              <p className="text-center text-muted-foreground py-6">No skills found matching your search.</p>
            )}
            <div className="space-y-4">
              {filteredSkills.map(skill => (
                <Card key={skill.id} className={cn("transition-all hover:shadow-md", !skill.isActive && "bg-muted/50 opacity-70")}>
                  <CardHeader className="flex flex-row justify-between items-start pb-3">
                    <div>
                      <CardTitle className="text-lg">{skill.name}</CardTitle>
                      {skill.level && <CardDescription>{skill.level}</CardDescription>}
                    </div>
                    <div className="flex items-center space-x-2">
                       <Switch checked={skill.isActive} onCheckedChange={() => toggleActive(skill.id)} aria-label={skill.isActive ? "Deactivate skill" : "Activate skill"} />
                    </div>
                  </CardHeader>
                  <CardContent className="pb-4">
                    <p className="text-sm text-muted-foreground mb-3">{skill.description}</p>
                    {skill.media && (
                      <div className="mt-2">
                        {skill.media.startsWith('http') ? (
                          skill.media.match(/\.(jpeg|jpg|gif|png)$/i) ? (
                            <img src={skill.media} alt="Skill media" className="w-24 h-24 object-cover rounded border" data-ai-hint="skill demonstration" />
                          ) : (
                            <a href={skill.media} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">View Media/Certificate</a>
                          )
                        ) : <p className="text-xs text-muted-foreground">Media: {skill.media}</p>}
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="flex justify-end space-x-2 pt-3 border-t">
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(skill)}>
                      <Edit3 className="mr-1 h-4 w-4" /> Edit
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(skill.id)}>
                      <Trash2 className="mr-1 h-4 w-4" /> Delete
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default UserSkillsetsScreen;
