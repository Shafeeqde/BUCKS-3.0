
"use client";
import { useState } from 'react';
import React from 'react';
import ServiceCard from '@/components/services/ServiceCard';
import { Input } from '@/components/ui/input';
import SvgRenderer from '@/components/ui/SvgRenderer';
import type { Service, TabName, VehicleOption } from '@/types';
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Search as SearchIcon, Map } from 'lucide-react';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';


const servicesData: Service[] = [
    { name: 'Taxi', icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-car"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.8-2.8c-.7-.7-1.7-1.2-2.8-1.4L4 5v14"/><path d="M12 10H4v6h10"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/></svg>`, locked: false, dataAiHint: "car taxi ride" },
    { name: 'Jobs', icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-briefcase"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>`, locked: true, dataAiHint: "briefcase work" },
    { name: 'Foods', icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-utensils"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M15 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><line x1="7" x2="7" y1="2" y2="22"/><line x1="17" x2="17" y1="2" y2="22"/></svg>`, locked: true, dataAiHint: "utensils restaurant" },
    { name: 'Shopping', icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-shopping-bag"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>`, locked: true, dataAiHint: "shopping bag" },
    { name: 'Pay', icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-credit-card"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>`, locked: true, dataAiHint: "credit card" },
    { name: 'Tickets', icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-ticket"><path d="M2 9a3 3 0 0 1 0 6v-6Z"/><path d="M22 9a3 3 0 0 0 0 6v-6Z"/><path d="M11 19H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h7"/><path d="M13 5h7a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-7"/><path d="M13 11H7"/><path d="M13 15H7"/></svg>`, locked: true, dataAiHint: "ticket movie" },
    { name: 'Delivery', icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-truck"><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M10 18H7"/><path d="M17 18h2a2 2 0 0 0 2-2v-5a2 2 0 0 0-2-2h-7.5L14 14z"/><circle cx="18" cy="18" r="2"/><circle cx="7" cy="18" r="2"/></svg>`, locked: true, dataAiHint: "truck delivery" },
    { name: 'Banking', icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-banknote"><rect width="20" height="12" x="2" y="6" rx="2"/><path d="M12 12V6"/><path d="M10 12h4"/><path d="M10 18h4"/><path d="M16 12V6"/><path d="M16 18V12"/><path d="M8 18V12"/><path d="M8 12V6"/></svg>`, locked: true, dataAiHint: "banknote money" },
];

const vehicleOptions: VehicleOption[] = [
  { name: 'Bike', eta: '4 mins Away', priceRange: '₹ 80-100', minRide: '30₹', pricePerKm: '8₹/km', icon: `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-bike"><circle cx="18.5" cy="17.5" r="3.5"/><circle cx="5.5" cy="17.5" r="3.5"/><circle cx="12" cy="7" r="1"/><path d="M12 7v10.5"/><path d="M16.5 4.2L12 7H6l-2 3"/><path d="M14 14h.5a2 2 0 0 0 1.66-0.93L20 7"/></svg>` },
  { name: 'Auto', eta: '12 mins Away', priceRange: '₹ 120-135', minRide: '40₹', pricePerKm: '12₹/km', icon: `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-auto-rickshaw"><path d="M10 2h6a2 2 0 0 1 2 2v2s0 1-1 1H3c-1 0-1-1-1-1V4a2 2 0 0 1 2-2h2"/><path d="M14 11v-.5a.5.5 0 0 0-.5-.5h-9a.5.5 0 0 0-.5.5v.5L2 14v4a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-4l-1-3z"/><path d="M7 14h4"/><path d="M17 14h.01"/><path d="M20 17h.01"/><path d="M22 20h.01"/></svg>` },
  { name: 'Car Mini', eta: '4 mins Away', priceRange: '₹ 170-188', minRide: '50₹', pricePerKm: '15₹/km', icon: `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-car"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.8-2.8c-.7-.7-1.7-1.2-2.8-1.4L4 5v14"/><path d="M12 10H4v6h10"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/></svg>` },
];

interface ServicesScreenProps {
  setActiveTab: (tab: TabName) => void;
}

const ServicesScreen: React.FC<ServicesScreenProps> = ({ setActiveTab }) => {
  const [isTaxiBookingActive, setIsTaxiBookingActive] = useState(false);
  const { toast } = useToast();
  const [destination, setDestination] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleOption | null>(null);


  const handleServiceClick = (service: Service) => {
    if (service.name === 'Taxi' && !service.locked) {
      setIsTaxiBookingActive(true);
      return;
    }
    if (service.targetTab && !service.locked) {
      setActiveTab(service.targetTab);
    } else {
      toast({
        title: `${service.name} Service`,
        description: service.locked ? "This service is coming soon!" : `Exploring ${service.name}.`,
      });
    }
  };

  const handleBookRide = () => {
    if (!destination) {
      toast({ title: "Set Destination", description: "Please enter your destination.", variant: "destructive"});
      return;
    }
    if (!selectedVehicle) {
      toast({ title: "Select Vehicle", description: "Please choose a vehicle type.", variant: "destructive"});
      return;
    }
    toast({ title: "Ride Booked (Simulated)", description: `Booking ${selectedVehicle.name} to ${destination}.`});
    // Here you would typically navigate to a ride status screen or show confirmation
    // For now, let's go back to the main services screen
    setIsTaxiBookingActive(false);
    setDestination('');
    setSelectedVehicle(null);
    setActiveTab('home'); // Go to home screen to see FAB for ride status
  };
  
  return (
    <ScrollArea className="h-full custom-scrollbar">
      <main className="p-4">
        {isTaxiBookingActive && (
          <Button variant="ghost" size="icon" onClick={() => setIsTaxiBookingActive(false)} className="mb-4 text-muted-foreground hover:text-primary">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        )}
        
        {!isTaxiBookingActive ? (
          <>
            <h2 className="text-2xl font-bold text-foreground mb-6 font-headline">Services we Offer</h2>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
              {servicesData.map((service) => (
                <ServiceCard key={service.name} service={service} onClick={() => handleServiceClick(service)} />
              ))}
            </div>
          </>
        ) : (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground mb-6 font-headline">Book a Ride</h2>
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5"/>
              <Input
                className="pl-10 text-base"
                placeholder="Where are you going?"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
              />
            </div>
            <Button variant="outline" className="w-full justify-start text-muted-foreground">
              <Map className="mr-2 h-4 w-4"/> Select on Map (Placeholder)
            </Button>

            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-foreground">Choose Vehicle</h3>
              {vehicleOptions.map((vehicle) => (
                <Card 
                  key={vehicle.name} 
                  className={`cursor-pointer transition-all hover:shadow-md ${selectedVehicle?.name === vehicle.name ? 'ring-2 ring-primary border-primary' : 'border-border'}`}
                  onClick={() => setSelectedVehicle(vehicle)}
                >
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <SvgRenderer svgString={vehicle.icon} className="w-10 h-10 text-primary" />
                      <div>
                        <p className="font-semibold text-foreground">{vehicle.name}</p>
                        <p className="text-xs text-muted-foreground">{vehicle.eta}</p>
                      </div>
                    </div>
                    <div className="text-right">
                        <p className="font-semibold text-foreground text-sm">{vehicle.priceRange}</p>
                        <p className="text-xs text-muted-foreground">{vehicle.pricePerKm}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <Button 
              size="lg" 
              className="w-full text-lg py-6" 
              onClick={handleBookRide}
              disabled={!destination || !selectedVehicle}
            >
              Book {selectedVehicle?.name || 'Ride'}
            </Button>
          </div>
        )}
      </main>
    </ScrollArea>
  );
};
export default ServicesScreen;
