
"use client";
import { useState } from 'react';
import React from 'react';
import ServiceCard from '@/components/services/ServiceCard';
import { Input } from '@/components/ui/input';
import type { Service, TabName, VehicleOption, ActivityDetails } from '@/types';
import { useToast } from "@/hooks/use-toast";
import { 
  ArrowLeft, 
  Search as SearchIcon, 
  MapPin, 
  Car, 
  Bike, 
  CarTaxiFront,
  Briefcase,
  Utensils,
  ShoppingBag,
  CreditCard,
  Ticket,
  Truck,
  Landmark // Replaced Building2 for Auto with CarTaxiFront, imported other icons
} from 'lucide-react'; 
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const initialServicesData: Service[] = [
    { id: 'taxi', name: 'Taxi', icon: CarTaxiFront, locked: false, dataAiHint: "car taxi ride" },
    { id: 'jobs', name: 'Jobs', icon: Briefcase, locked: false, dataAiHint: "briefcase work" },
    { id: 'foods', name: 'Foods', icon: Utensils, locked: true, dataAiHint: "utensils restaurant" },
    { id: 'shopping', name: 'Shopping', icon: ShoppingBag, locked: true, dataAiHint: "shopping bag" },
    { id: 'pay', name: 'Pay', icon: CreditCard, locked: true, dataAiHint: "credit card" },
    { id: 'tickets', name: 'Tickets', icon: Ticket, locked: true, dataAiHint: "ticket movie" },
    { id: 'delivery', name: 'Delivery', icon: Truck, locked: true, dataAiHint: "truck delivery" },
    { id: 'banking', name: 'Banking', icon: Landmark, locked: true, dataAiHint: "bank building" }, // Changed from banknote to Landmark for banking
];

const taxiVehicleOptions: VehicleOption[] = [
  { id: 'bike', name: 'Bike', icon: Bike, priceRange: '₹ 50-80', estimatedETA: '5 mins', dataAiHint: "motorcycle transport" },
  { id: 'auto', name: 'Auto', icon: CarTaxiFront, priceRange: '₹ 80-120', estimatedETA: '7 mins', dataAiHint: "auto rickshaw" },
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
