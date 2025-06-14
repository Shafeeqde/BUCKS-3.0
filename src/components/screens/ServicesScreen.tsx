
"use client";
import { useState } from 'react';
import React from 'react';
import ServiceCard from '@/components/services/ServiceCard';
import { Input } from '@/components/ui/input';
import type { Service, TabName, VehicleOption, ActivityDetails } from '@/types';
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Search as SearchIcon, MapPin, Car, Bike, Building2 } from 'lucide-react'; 
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const initialServicesData: Service[] = [
    { id: 'taxi', name: 'Taxi', icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-car"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.8-2.8c-.7-.7-1.7-1.2-2.8-1.4L4 5v14"/><path d="M12 10H4v6h10"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/></svg>`, locked: false, dataAiHint: "car taxi ride" },
    { id: 'jobs', name: 'Jobs', icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-briefcase"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>`, locked: false, dataAiHint: "briefcase work" }, // Unlocked Jobs
    { id: 'foods', name: 'Foods', icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-utensils"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M15 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><line x1="7" x2="7" y1="2" y2="22"/><line x1="17" x2="17" y1="2" y2="22"/></svg>`, locked: true, dataAiHint: "utensils restaurant" },
    { id: 'shopping', name: 'Shopping', icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-shopping-bag"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>`, locked: true, dataAiHint: "shopping bag" },
    { id: 'pay', name: 'Pay', icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-credit-card"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>`, locked: true, dataAiHint: "credit card" },
    { id: 'tickets', name: 'Tickets', icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-ticket"><path d="M2 9a3 3 0 0 1 0 6v-6Z"/><path d="M22 9a3 3 0 0 0 0 6v-6Z"/><path d="M11 19H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h7"/><path d="M13 5h7a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-7"/><path d="M13 11H7"/><path d="M13 15H7"/></svg>`, locked: true, dataAiHint: "ticket movie" },
    { id: 'delivery', name: 'Delivery', icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-truck"><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M10 18H7"/><path d="M17 18h2a2 2 0 0 0 2-2v-5a2 2 0 0 0-2-2h-7.5L14 14z"/><circle cx="18" cy="18" r="2"/><circle cx="7" cy="18" r="2"/></svg>`, locked: true, dataAiHint: "truck delivery" },
    { id: 'banking', name: 'Banking', icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-banknote"><rect width="20" height="12" x="2" y="6" rx="2"/><path d="M12 12V6"/><path d="M10 12h4"/><path d="M10 18h4"/><path d="M16 12V6"/><path d="M16 18V12"/><path d="M8 18V12"/><path d="M8 12V6"/></svg>`, locked: true, dataAiHint: "banknote money" },
];

const taxiVehicleOptions: VehicleOption[] = [
  { id: 'bike', name: 'Bike', icon: Bike, priceRange: '₹ 50-80', estimatedETA: '5 mins', dataAiHint: "motorcycle transport" },
  { id: 'auto', name: 'Auto', icon: Building2, priceRange: '₹ 80-120', estimatedETA: '7 mins', dataAiHint: "auto rickshaw" },
  { id: 'car_mini', name: 'Car (Mini)', icon: Car, priceRange: '₹ 120-200', estimatedETA: '10 mins', dataAiHint: "small car" },
  { id: 'car_premium', name: 'Car (Premium)', icon: Car, priceRange: '₹ 200-350', estimatedETA: '12 mins', dataAiHint: "luxury car" },
];


interface ServicesScreenProps {
  setActiveTab: (tab: TabName) => void;
  onRequestRide: (rideDetails: { pickup: string; dropoff: string; vehicleId: string }) => void;
}

const ServicesScreen: React.FC<ServicesScreenProps> = ({ setActiveTab, onRequestRide }) => {
  const { toast } = useToast();

  const [isTaxiBookingActive, setIsTaxiBookingActive] = useState(false);
  const [pickupLocation, setPickupLocation] = useState('');
  const [dropoffLocation, setDropoffLocation] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleOption | null>(null);
  const [isRequestingRide, setIsRequestingRide] = useState(false);


  const handleServiceClick = (service: Service) => {
    if (service.id === 'taxi' && !service.locked) {
      setIsTaxiBookingActive(true);
      setPickupLocation('Your Current Location (Simulated)'); 
      return;
    }
    if (service.id === 'jobs' && !service.locked) {
      setActiveTab('job-board');
      return;
    }
    toast({
      title: `${service.name} Service`,
      description: service.locked ? "This service is coming soon!" : `Exploring ${service.name}.`,
    });
  };

  const handleBookRide = async () => {
    if (!pickupLocation) {
      toast({ title: "Set Pickup", description: "Please enter your pickup location.", variant: "destructive"});
      return;
    }
    if (!dropoffLocation) {
      toast({ title: "Set Destination", description: "Please enter your destination.", variant: "destructive"});
      return;
    }
    if (!selectedVehicle) {
      toast({ title: "Select Vehicle", description: "Please choose a vehicle type.", variant: "destructive"});
      return;
    }

    setIsRequestingRide(true);
    console.log('Booking ride:', { pickupLocation, dropoffLocation, vehicleId: selectedVehicle.id });
    
    await new Promise(resolve => setTimeout(resolve, 500)); 

    onRequestRide({
        pickup: pickupLocation,
        dropoff: dropoffLocation,
        vehicleId: selectedVehicle.id, 
    });
    
    setIsTaxiBookingActive(false);
    setPickupLocation('');
    setDropoffLocation('');
    setSelectedVehicle(null);
    setIsRequestingRide(false);
  };
  
  return (
    <ScrollArea className="h-full custom-scrollbar bg-background">
      <main className="p-4">
        <div className="flex items-center mb-6">
          {isTaxiBookingActive && (
            <Button variant="ghost" size="icon" onClick={() => setIsTaxiBookingActive(false)} className="mr-2 text-muted-foreground hover:text-primary">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          )}
          <h2 className="text-2xl font-bold text-foreground font-headline">
            {isTaxiBookingActive ? 'Book a Taxi' : 'Services'}
          </h2>
        </div>
        
        {!isTaxiBookingActive ? (
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
            {initialServicesData.map((service) => (
              <ServiceCard key={service.id} service={service} onClick={() => handleServiceClick(service)} />
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div>
                  <label htmlFor="pickup" className="block text-sm font-medium text-muted-foreground mb-1">Pickup Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5"/>
                    <Input
                      id="pickup"
                      className="pl-10 text-base"
                      placeholder="Enter pickup location"
                      value={pickupLocation}
                      onChange={(e) => setPickupLocation(e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="dropoff" className="block text-sm font-medium text-muted-foreground mb-1">Drop-off Location</label>
                  <div className="relative">
                    <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5"/>
                    <Input
                      id="dropoff"
                      className="pl-10 text-base"
                      placeholder="Where are you going?"
                      value={dropoffLocation}
                      onChange={(e) => setDropoffLocation(e.target.value)}
                    />
                  </div>
                </div>
                <Button variant="outline" className="w-full justify-start text-muted-foreground" onClick={() => toast({title: "Map Picker", description: "Map selection UI would open here."})}>
                  <MapPin className="mr-2 h-4 w-4"/> Select on Map (Placeholder)
                </Button>
              </CardContent>
            </Card>
            
             <Card>
                <CardContent className="pt-6">
                    <h3 className="text-md font-semibold text-foreground mb-2">Recent Locations</h3>
                    <p className="text-sm text-muted-foreground">List of recent locations would appear here.</p>
                </CardContent>
            </Card>

            <div>
              <h3 className="text-lg font-semibold text-foreground mb-3">Choose Vehicle Type</h3>
              <div className="flex space-x-3 overflow-x-auto custom-scrollbar pb-2">
                {taxiVehicleOptions.map((vehicle) => {
                  const IconComponent = vehicle.icon;
                  const isSelected = selectedVehicle?.id === vehicle.id;
                  return (
                    <Card 
                      key={vehicle.id} 
                      className={cn(
                        "cursor-pointer transition-all hover:shadow-lg min-w-[140px] flex-shrink-0 border-border",
                        isSelected && "ring-2 ring-primary border-primary shadow-xl bg-primary/10"
                      )}
                      onClick={() => setSelectedVehicle(vehicle)}
                    >
                      <CardContent className="p-4 flex flex-col items-center text-center">
                        <IconComponent className={cn("w-10 h-10 mb-2", isSelected ? 'text-primary' : 'text-muted-foreground')} data-ai-hint={vehicle.dataAiHint} />
                        <p className={cn("font-semibold", isSelected ? 'text-primary' : 'text-foreground')}>{vehicle.name}</p>
                        <p className="text-xs text-muted-foreground">{vehicle.priceRange}</p>
                        <p className="text-xs text-muted-foreground">{vehicle.estimatedETA}</p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>

            <Button 
              size="lg" 
              className="w-full text-lg py-6" 
              onClick={handleBookRide}
              disabled={isRequestingRide || !pickupLocation || !dropoffLocation || !selectedVehicle}
            >
              {isRequestingRide && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
              {isRequestingRide ? 'Requesting...' : `Book ${selectedVehicle?.name || 'Ride'}`}
            </Button>
            
            <Button variant="link" className="w-full text-destructive" onClick={() => setIsTaxiBookingActive(false)}>
              Cancel Booking
            </Button>
          </div>
        )}
      </main>
    </ScrollArea>
  );
};
export default ServicesScreen;
