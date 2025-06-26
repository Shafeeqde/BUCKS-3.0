
"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { TruckIcon, PlusCircleIcon, PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useToast } from "@/hooks/use-toast";
import type { UserVehicle, VehicleListingMode } from '@/types';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

interface UserVehiclesScreenProps {
    onGoOnline: (vehicle: UserVehicle) => void;
    onGoOffline: () => void;
    onlineVehicleId: string | null;
}

const UserVehiclesScreen: React.FC<UserVehiclesScreenProps> = ({ onGoOnline, onGoOffline, onlineVehicleId }) => {
  const { toast } = useToast();
  const { user } = useAuth();

  const [vehicleType, setVehicleType] = useState('');
  const [licensePlate, setLicensePlate] = useState('');
  const [listingMode, setListingMode] = useState<VehicleListingMode | ''>('');

  const [vehicles, setVehicles] = useState<UserVehicle[]>([]);
  const [loadingVehicles, setLoadingVehicles] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [vehicleToDelete, setVehicleToDelete] = useState<UserVehicle | null>(null);

  const fetchUserVehicles = async () => {
    if (!user) {
      setLoadingVehicles(false);
      return;
    }
    setLoadingVehicles(true);
    try {
      const response = await fetch(`/api/users/${user.id}/vehicles`);
      if (!response.ok) throw new Error('Failed to fetch vehicles.');
      const data = await response.json();
      setVehicles(data);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      toast({ title: 'Error', description: 'Could not load your vehicles.', variant: 'destructive' });
    } finally {
      setLoadingVehicles(false);
    }
  };

  useEffect(() => {
    fetchUserVehicles();
  }, [user]);

  const allModes: { value: VehicleListingMode; label: string }[] = [
    { value: 'taxi', label: 'For Taxi Service' },
    { value: 'delivery', label: 'For Delivery Service' },
    { value: 'sell', label: 'For Sale' },
    { value: 'rent', label: 'For Rent' },
  ];

  const twoWheelerKeywords = ['bike', 'scooter', 'motorcycle', 'moped', '2 wheeler', 'two wheeler'];
  const isTwoWheeler = twoWheelerKeywords.some(keyword => vehicleType.toLowerCase().includes(keyword));

  const availableModes = isTwoWheeler
    ? allModes.filter(mode => mode.value === 'delivery' || mode.value === 'sell')
    : allModes;

  const modeLabels: Record<VehicleListingMode, string> = {
    taxi: 'Taxi',
    delivery: 'Delivery',
    sell: 'For Sale',
    rent: 'For Rent'
  };

  useEffect(() => {
    if (listingMode && !availableModes.find(mode => mode.value === listingMode)) {
      setListingMode('');
    }
  }, [vehicleType, availableModes, listingMode]);

  const handleAddVehicle = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!vehicleType.trim() || !licensePlate.trim() || !listingMode.trim() || !user) {
      toast({ title: 'Missing Information', description: 'Please fill all fields and be logged in.', variant: 'destructive' });
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/users/${user.id}/vehicles`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vehicleType, licensePlate, listingMode }),
      });
      if (!response.ok) throw new Error('Failed to add vehicle.');
      const newVehicle = await response.json();
      setVehicles(prev => [...prev, newVehicle]);
      toast({ title: 'Vehicle Added', description: `${newVehicle.vehicleType} (${newVehicle.licensePlate}) added.` });
      setVehicleType('');
      setLicensePlate('');
      setListingMode('');
    } catch (error) {
      console.error('Error adding vehicle:', error);
      toast({ title: 'Error', description: 'Could not add your vehicle.', variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteVehicle = async () => {
    if (!vehicleToDelete || !user) return;
    try {
      const response = await fetch(`/api/users/${user.id}/vehicles/${vehicleToDelete.id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete vehicle.');
      setVehicles(prev => prev.filter(v => v.id !== vehicleToDelete.id));
      toast({ title: 'Vehicle Deleted', description: `${vehicleToDelete.vehicleType} removed successfully.`, variant: 'destructive' });
    } catch (error) {
      toast({ title: 'Error', description: 'Could not delete the vehicle.', variant: 'destructive' });
    } finally {
      setVehicleToDelete(null);
    }
  };

  return (
    <>
      <div className="max-w-4xl mx-auto p-4 sm:p-6 h-full overflow-y-auto custom-scrollbar">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-headline flex items-center">
              <TruckIcon className="mr-2 h-6 w-6 text-primary" /> My Vehicles
            </CardTitle>
            <CardDescription>Manage your vehicles for providing services. Activate a vehicle to go online.</CardDescription>
          </CardHeader>

          <CardContent className="border-t pt-6">
            <form onSubmit={handleAddVehicle} className="space-y-6 bg-card p-4 sm:p-6 rounded-lg shadow-md border mb-8">
              <h3 className="text-lg font-semibold text-foreground">Add New Vehicle</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="vehicleType">Vehicle Type <span className="text-destructive">*</span></Label>
                  <Input id="vehicleType" value={vehicleType} onChange={(e) => setVehicleType(e.target.value)} placeholder="e.g., Car, Bike, Auto Rickshaw" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="licensePlate">License Plate <span className="text-destructive">*</span></Label>
                  <Input id="licensePlate" value={licensePlate} onChange={(e) => setLicensePlate(e.target.value)} placeholder="e.g., ABC-1234" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="listingMode">Listing Mode <span className="text-destructive">*</span></Label>
                  <Select value={listingMode} onValueChange={(value) => setListingMode(value as VehicleListingMode)}>
                    <SelectTrigger id="listingMode">
                      <SelectValue placeholder="Select a mode..." />
                    </SelectTrigger>
                    <SelectContent>
                      {availableModes.map(mode => (
                        <SelectItem key={mode.value} value={mode.value}>{mode.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button type="submit" disabled={isSubmitting} className="w-full md:w-auto">
                {isSubmitting ? <span className="mr-2 h-4 w-4 animate-spin border-2 border-primary-foreground border-t-transparent rounded-full"></span> : <PlusCircleIcon className="mr-2 h-4 w-4" />}
                {isSubmitting ? 'Adding...' : 'Add Vehicle'}
              </Button>
            </form>

            <div>
              <h3 className="text-xl font-semibold text-foreground mb-4">Your Registered Vehicles</h3>
              {loadingVehicles ? (
                <div className="flex justify-center items-center py-10 min-h-[200px]"><span className="h-8 w-8 animate-spin border-4 border-primary border-t-transparent rounded-full"></span></div>
              ) : vehicles.length === 0 ? (
                <div className="text-center py-10 min-h-[200px]"><p className="text-muted-foreground">No vehicles registered yet.</p></div>
              ) : (
                <div className="space-y-4">
                  {vehicles.map((vehicle) => {
                    const isOnlineWithThisVehicle = vehicle.id === onlineVehicleId;
                    return (
                        <Card key={vehicle.id} className={cn("transition-all", isOnlineWithThisVehicle ? "border-primary ring-2 ring-primary/20" : "")}>
                          <CardHeader className="pb-3">
                              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                                <div>
                                    <CardTitle className="text-lg">{vehicle.vehicleType}</CardTitle>
                                    <CardDescription>License Plate: {vehicle.licensePlate}</CardDescription>
                                </div>
                                <div className="flex items-center space-x-3 mt-2 sm:mt-0">
                                    {vehicle.listingMode && <Badge variant="secondary">{modeLabels[vehicle.listingMode]}</Badge>}
                                    {isOnlineWithThisVehicle && <Badge variant="default" className="bg-green-500 hover:bg-green-500">Online</Badge>}
                                </div>
                              </div>
                          </CardHeader>
                          <CardFooter className="flex justify-end space-x-2 pt-4 border-t">
                            {vehicle.listingMode === 'taxi' && (
                                isOnlineWithThisVehicle ? (
                                    <Button variant="destructive" onClick={onGoOffline}>Go Offline</Button>
                                ) : (
                                    <Button variant="default" onClick={() => onGoOnline(vehicle)} disabled={!!onlineVehicleId}>
                                        Go Online
                                    </Button>
                                )
                            )}
                            <Button variant="ghost" size="sm" onClick={() => toast({ title: "Edit Clicked (Not Implemented)" })}><PencilSquareIcon className="mr-1 h-4 w-4" /> Edit</Button>
                            <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => setVehicleToDelete(vehicle)}><TrashIcon className="mr-1 h-4 w-4" /> Delete</Button>
                          </CardFooter>
                        </Card>
                    );
                  })}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      <AlertDialog open={!!vehicleToDelete} onOpenChange={(open) => !open && setVehicleToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>This action will permanently delete the vehicle: {vehicleToDelete?.vehicleType} ({vehicleToDelete?.licensePlate}).</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setVehicleToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteVehicle} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default UserVehiclesScreen;

    