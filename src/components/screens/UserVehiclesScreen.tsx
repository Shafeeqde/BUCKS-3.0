
"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { TruckIcon, PlusCircleIcon, PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline'; // Replaced Car, Edit3, etc.
import { useToast } from "@/hooks/use-toast";
import type { TabName, UserVehicle } from '@/types';
import { cn } from '@/lib/utils';

const simulateFetchVehicles = async (): Promise<UserVehicle[]> => {
  console.log('Simulating fetching user vehicles...');
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockVehicles: UserVehicle[] = [
        { id: 'v1', vehicleType: 'Car (Sedan)', licensePlate: 'ABC-123', isActive: true },
        { id: 'v2', vehicleType: 'Bike', licensePlate: 'XYZ-789', isActive: false },
        { id: 'v3', vehicleType: 'Auto Rickshaw', licensePlate: 'PQR-456', isActive: true },
      ];
      console.log('Simulated user vehicles fetched:', mockVehicles);
      resolve(mockVehicles);
    }, 1000);
  });
};

const simulateAddVehicle = async (vehicleData: Pick<UserVehicle, 'vehicleType' | 'licensePlate'>): Promise<UserVehicle> => {
  console.log('Simulating adding vehicle:', vehicleData);
  return new Promise((resolve) => {
    setTimeout(() => {
      const newVehicle: UserVehicle = {
        id: `v${Date.now()}`,
        ...vehicleData,
        isActive: false, 
      };
      console.log('Simulated vehicle added:', newVehicle);
      resolve(newVehicle);
    }, 1000);
  });
};

const simulateToggleVehicleStatus = async (vehicleId: string, currentStatus: boolean): Promise<boolean> => {
  console.log(`Simulating toggling vehicle ${vehicleId} active status to ${!currentStatus}`);
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`Simulated status toggled for vehicle ${vehicleId}`);
      resolve(!currentStatus);
    }, 500);
  });
};

interface UserVehiclesScreenProps {
  setActiveTab: (tab: TabName) => void;
}

const UserVehiclesScreen: React.FC<UserVehiclesScreenProps> = ({ setActiveTab }) => {
  const { toast } = useToast();

  const [vehicleType, setVehicleType] = useState('');
  const [licensePlate, setLicensePlate] = useState('');

  const [vehicles, setVehicles] = useState<UserVehicle[]>([]);
  const [loadingVehicles, setLoadingVehicles] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false); 

  useEffect(() => {
    fetchUserVehicles();
  }, []);

  const fetchUserVehicles = async () => {
    setLoadingVehicles(true);
    try {
      const data = await simulateFetchVehicles();
      setVehicles(data);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      toast({
        title: 'Error Fetching Vehicles',
        description: 'Could not load your vehicles. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoadingVehicles(false);
    }
  };

  const handleAddVehicle = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!vehicleType.trim() || !licensePlate.trim()) {
      toast({
        title: 'Missing Information',
        description: 'Please enter vehicle type and license plate.',
        variant: 'destructive',
      });
      return;
    }
    setIsSubmitting(true);
    try {
      const newVehicle = await simulateAddVehicle({ vehicleType, licensePlate });
      setVehicles(prevVehicles => [...prevVehicles, newVehicle]);
      toast({
        title: 'Vehicle Added',
        description: `${newVehicle.vehicleType} (${newVehicle.licensePlate}) added successfully.`,
      });
      setVehicleType('');
      setLicensePlate('');
    } catch (error) {
      console.error('Error adding vehicle:', error);
      toast({
        title: 'Error Adding Vehicle',
        description: 'Could not add your vehicle. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleActive = async (vehicleId: string, currentStatus: boolean) => {
    const originalVehicles = [...vehicles];
    setVehicles(prevVehicles =>
      prevVehicles.map(v =>
        v.id === vehicleId ? { ...v, isActive: !currentStatus } : v
      )
    );

    try {
      await simulateToggleVehicleStatus(vehicleId, currentStatus);
      toast({
        title: 'Status Updated',
        description: `Vehicle ${!currentStatus ? 'activated' : 'deactivated'}.`,
      });
    } catch (error) {
      console.error('Error toggling vehicle status:', error);
      toast({
        title: 'Update Failed',
        description: 'Could not update vehicle status. Please try again.',
        variant: 'destructive',
      });
      setVehicles(originalVehicles); 
    }
  };
  
  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 h-full overflow-y-auto custom-scrollbar">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-headline flex items-center">
            <TruckIcon className="mr-2 h-6 w-6 text-primary" /> My Vehicles
          </CardTitle>
          <CardDescription>Manage your vehicles for providing services.</CardDescription>
        </CardHeader>

        <CardContent className="border-t pt-6">
          <form onSubmit={handleAddVehicle} className="space-y-6 bg-card p-6 rounded-lg shadow-md border mb-8">
            <h3 className="text-lg font-semibold text-foreground">Add New Vehicle</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="vehicleType">Vehicle Type <span className="text-destructive">*</span></Label>
                <Input 
                  id="vehicleType" 
                  value={vehicleType} 
                  onChange={(e) => setVehicleType(e.target.value)} 
                  placeholder="e.g., Car, Bike, Auto Rickshaw" 
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="licensePlate">License Plate <span className="text-destructive">*</span></Label>
                <Input 
                  id="licensePlate" 
                  value={licensePlate} 
                  onChange={(e) => setLicensePlate(e.target.value)} 
                  placeholder="e.g., ABC-1234" 
                  required 
                />
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
              <div className="flex flex-col justify-center items-center py-10 min-h-[200px]">
                <span className="h-8 w-8 animate-spin border-4 border-primary border-t-transparent rounded-full"></span>
                <p className="ml-2 mt-2 text-muted-foreground">Loading your vehicles...</p>
              </div>
            ) : vehicles.length === 0 ? (
              <div className="text-center py-10 min-h-[200px] flex flex-col items-center justify-center">
                <TruckIcon className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-lg text-muted-foreground">No vehicles registered yet.</p>
                <p className="text-sm text-muted-foreground">Add your first vehicle using the form above to get started.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {vehicles.map((vehicle) => (
                  <Card key={vehicle.id} className={cn("transition-all", !vehicle.isActive && "bg-muted/30")}>
                    <CardHeader className="pb-3">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                        <div>
                           <CardTitle className="text-lg">{vehicle.vehicleType}</CardTitle>
                           <CardDescription>License Plate: {vehicle.licensePlate}</CardDescription>
                        </div>
                        <div className="flex items-center space-x-3 mt-2 sm:mt-0">
                            <Label htmlFor={`status-${vehicle.id}`} className="text-sm text-muted-foreground whitespace-nowrap">
                                {vehicle.isActive ? 'Active' : 'Inactive'}
                            </Label>
                            <Switch
                                id={`status-${vehicle.id}`}
                                checked={vehicle.isActive}
                                onCheckedChange={() => handleToggleActive(vehicle.id, vehicle.isActive)}
                                aria-label={vehicle.isActive ? "Deactivate vehicle" : "Activate vehicle"}
                            />
                        </div>
                      </div>
                    </CardHeader>
                    <CardFooter className="flex justify-end space-x-2 pt-4 border-t">
                      <Button variant="ghost" size="sm" onClick={() => toast({title: "Edit Clicked (Not Implemented)", description: `Edit vehicle ${vehicle.licensePlate}`})}>
                        <PencilSquareIcon className="mr-1 h-4 w-4" /> Edit
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => toast({title: "Delete Clicked (Not Implemented)", description: `Delete vehicle ${vehicle.licensePlate}`, variant: "destructive"})}>
                        <TrashIcon className="mr-1 h-4 w-4" /> Delete
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserVehiclesScreen;
