
"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { PlusCircle, Edit3, Trash2, XCircle, Car, Search } from 'lucide-react';
import type { UserVehicle } from '@/types';
import { useToast } from "@/hooks/use-toast";
import { cn } from '@/lib/utils';

const initialVehicles: UserVehicle[] = [
  { id: '1', brand: 'Toyota', model: 'Camry', year: 2020, regNumber: 'KA01AB1234', color: 'Silver', isActive: true },
  { id: '2', brand: 'Honda', model: 'City', year: 2018, regNumber: 'KA02CD5678', color: 'White', isActive: false },
];

const UserVehiclesScreen = () => {
  const [vehicles, setVehicles] = useState<UserVehicle[]>(initialVehicles);
  const [showForm, setShowForm] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<UserVehicle | null>(null);
  const [currentVehicle, setCurrentVehicle] = useState<Partial<UserVehicle>>({});
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCurrentVehicle(prev => ({ ...prev, [name]: value }));
  };
  
  const resetForm = () => {
    setCurrentVehicle({});
    setEditingVehicle(null);
    setShowForm(false);
  };

  const handleSubmit = () => {
    if (!currentVehicle.brand || !currentVehicle.model || !currentVehicle.regNumber) {
      toast({ title: "Missing Fields", description: "Brand, model, and registration number are required.", variant: "destructive" });
      return;
    }

    if (editingVehicle) {
      setVehicles(vehicles.map(v => v.id === editingVehicle.id ? { ...v, ...currentVehicle } as UserVehicle : v));
      toast({ title: "Vehicle Updated", description: `${currentVehicle.brand} ${currentVehicle.model} has been updated.` });
    } else {
      const newVehicleToAdd: UserVehicle = {
        id: Date.now().toString(),
        brand: currentVehicle.brand,
        model: currentVehicle.model,
        regNumber: currentVehicle.regNumber,
        year: currentVehicle.year ? Number(currentVehicle.year) : undefined,
        color: currentVehicle.color,
        isActive: currentVehicle.isActive === undefined ? true : currentVehicle.isActive,
      };
      setVehicles([...vehicles, newVehicleToAdd]);
      toast({ title: "Vehicle Added", description: `${newVehicleToAdd.brand} ${newVehicleToAdd.model} has been added.` });
    }
    resetForm();
  };

  const handleEdit = (vehicle: UserVehicle) => {
    setEditingVehicle(vehicle);
    setCurrentVehicle(vehicle);
    setShowForm(true);
  };

  const handleDelete = (vehicleId: string) => {
    setVehicles(vehicles.filter(v => v.id !== vehicleId));
    toast({ title: "Vehicle Deleted", variant: "destructive" });
  };

  const toggleActive = (vehicleId: string) => {
    setVehicles(vehicles.map(v => v.id === vehicleId ? { ...v, isActive: !v.isActive } : v));
  };
  
  const filteredVehicles = vehicles.filter(vehicle => 
    vehicle.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.regNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (vehicle.color && vehicle.color.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 h-full overflow-y-auto custom-scrollbar">
      <Card className="shadow-lg">
        <CardHeader>
           <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle className="text-2xl font-headline flex items-center">
                <Car className="mr-2 h-6 w-6 text-primary" /> My Vehicles
              </CardTitle>
              <CardDescription>Manage your registered vehicles for services.</CardDescription>
            </div>
            <Button onClick={() => { resetForm(); setShowForm(true); }} className="w-full sm:w-auto">
              <PlusCircle className="mr-2 h-5 w-5" /> Add New Vehicle
            </Button>
          </div>
          <div className="mt-4 relative">
            <Input 
              placeholder="Search vehicles (brand, model, reg no...)"
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
              <h3 className="text-lg font-semibold text-foreground">{editingVehicle ? 'Edit Vehicle' : 'Add New Vehicle'}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="vehicleBrand">Brand <span className="text-destructive">*</span></Label>
                  <Input id="vehicleBrand" name="brand" value={currentVehicle.brand || ''} onChange={handleInputChange} placeholder="e.g., Toyota, Honda" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vehicleModel">Model <span className="text-destructive">*</span></Label>
                  <Input id="vehicleModel" name="model" value={currentVehicle.model || ''} onChange={handleInputChange} placeholder="e.g., Camry, City" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vehicleYear">Year</Label>
                  <Input id="vehicleYear" name="year" type="number" value={currentVehicle.year || ''} onChange={handleInputChange} placeholder="e.g., 2020" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vehicleRegNumber">Registration Number <span className="text-destructive">*</span></Label>
                  <Input id="vehicleRegNumber" name="regNumber" value={currentVehicle.regNumber || ''} onChange={handleInputChange} placeholder="e.g., KA01AB1234" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vehicleColor">Color</Label>
                  <Input id="vehicleColor" name="color" value={currentVehicle.color || ''} onChange={handleInputChange} placeholder="e.g., Red, Blue" />
                </div>
                {/* Documents upload can be added here later */}
              </div>
              <div className="flex items-center space-x-2 pt-2">
                <Switch id="vehicleIsActive" name="isActive" checked={currentVehicle.isActive === undefined ? true : currentVehicle.isActive} onCheckedChange={(checked) => setCurrentVehicle(prev => ({...prev, isActive: checked}))} />
                <Label htmlFor="vehicleIsActive">Vehicle is Active</Label>
              </div>
              <CardFooter className="p-0 pt-6 flex justify-end space-x-3">
                <Button variant="outline" type="button" onClick={resetForm}>
                  <XCircle className="mr-2 h-4 w-4" /> Cancel
                </Button>
                <Button type="submit">
                  <PlusCircle className="mr-2 h-4 w-4" /> {editingVehicle ? 'Save Changes' : 'Add Vehicle'}
                </Button>
              </CardFooter>
            </form>
          </CardContent>
        )}

        {!showForm && (
           <CardContent className={filteredVehicles.length > 0 ? "pt-6" : "pt-0"}>
            {filteredVehicles.length === 0 && !searchTerm && (
              <p className="text-center text-muted-foreground py-6">No vehicles added yet. Click "Add New Vehicle" to get started.</p>
            )}
            {filteredVehicles.length === 0 && searchTerm && (
              <p className="text-center text-muted-foreground py-6">No vehicles found matching your search.</p>
            )}
            <div className="space-y-4">
              {filteredVehicles.map(vehicle => (
                <Card key={vehicle.id} className={cn("transition-all hover:shadow-md", !vehicle.isActive && "bg-muted/50 opacity-70")}>
                  <CardHeader className="flex flex-row justify-between items-start pb-3">
                    <div>
                      <CardTitle className="text-lg">{vehicle.brand} {vehicle.model}</CardTitle>
                      <CardDescription>Reg: {vehicle.regNumber} {vehicle.year && `(${vehicle.year})`}</CardDescription>
                    </div>
                     <div className="flex items-center space-x-2">
                       <Switch checked={vehicle.isActive} onCheckedChange={() => toggleActive(vehicle.id)} aria-label={vehicle.isActive ? "Deactivate vehicle" : "Activate vehicle"}/>
                    </div>
                  </CardHeader>
                  {vehicle.color && <CardContent className="pb-4 text-sm text-muted-foreground">Color: {vehicle.color}</CardContent>}
                  <CardFooter className="flex justify-end space-x-2 pt-3 border-t">
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(vehicle)}>
                      <Edit3 className="mr-1 h-4 w-4" /> Edit
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(vehicle.id)}>
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

export default UserVehiclesScreen;
