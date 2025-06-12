"use client";
import { useState } from 'react';
import React from 'react';
import ServiceCard from '@/components/services/ServiceCard';
import { Input } from '@/components/ui/input'; // Assuming Input is needed for destination
import SvgRenderer from '@/components/ui/SvgRenderer';
import type { Service, TabName, VehicleOption } from '@/types';
import { useToast } from "@/hooks/use-toast";


const servicesData: Service[] = [
    { name: 'Taxi', icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-car"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.8-2.8c-.7-.7-1.7-1.2-2.8-1.4L4 5v14"/><path d="M12 10H4v6h10"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/></svg>`, locked: false, dataAiHint: "car taxi ride" },
    { name: 'Jobs', icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-briefcase"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>`, locked: true, dataAiHint: "briefcase work" },
    { name: 'Foods', icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-utensils"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M15 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><line x1="7" x2="7" y1="2" y2="22"/><line x1="17" x2="17" y1="2" y2="22"/></svg>`, locked: true, dataAiHint: "utensils restaurant" },
    { name: 'Shopping', icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-shopping-bag"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>`, locked: true, dataAiHint: "shopping bag" },
    { name: 'Pay', icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-credit-card"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>`, locked: true, dataAiHint: "credit card" },
    { name: 'Book Tickets', icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-ticket"><path d="M2 9a3 3 0 0 1 0 6v-6Z"/><path d="M22 9a3 3 0 0 0 0 6v-6Z"/><path d="M11 19H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h7"/><path d="M13 5h7a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-7"/><path d="M13 11H7"/><path d="M13 15H7"/></svg>`, locked: true, dataAiHint: "ticket movie" },
    { name: 'Delivery', icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-truck"><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M10 18H7"/><path d="M17 18h2a2 2 0 0 0 2-2v-5a2 2 0 0 0-2-2h-7.5L14 14z"/><circle cx="18" cy="18" r="2"/><circle cx="7" cy="18" r="2"/></svg>`, locked: true, dataAiHint: "truck delivery" },
    { name: 'Banking', icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-banknote"><rect width="20" height="12" x="2" y="6" rx="2"/><path d="M12 12V6"/><path d="M10 12h4"/><path d="M10 18h4"/><path d="M16 12V6"/><path d="M16 18V12"/><path d="M8 18V12"/><path d="M8 12V6"/></svg>`, locked: true, dataAiHint: "banknote money" },
    { name: 'Networks', icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-network"><rect x="16" y="2" width="6" height="6" rx="1"/><rect x="2" y="16" width="6" height="6" rx="1"/><path d="M18 8v4c0 1.7-1.3 3-3 3h-4"/><rect x="2" y="2" width="6" height="6" rx="1"/><rect x="16" y="16" width="6" height="6" rx="1"/><path d="M18 16v-4c0-1.7-1.3-3-3-3h-4c-1.7 0-3-1.3-3-3V8"/></svg>`, locked: true, dataAiHint: "network connection" },
    { name: 'Community', icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-users"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`, locked: true, dataAiHint: "users group" },
];

const vehicleOptions: VehicleOption[] = [
  { name: 'Bike', eta: '4 mins Away', priceRange: '₹ 80-100', minRide: '30₹', pricePerKm: '8₹/per Km', icon: `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-bike"><circle cx="18.5" cy="17.5" r="3.5"/><circle cx="5.5" cy="17.5" r="3.5"/><circle cx="12" cy="7" r="1"/><path d="M12 7v10.5"/><path d="M16.5 4.2L12 7H6l-2 3"/><path d="M14 14h.5a2 2 0 0 0 1.66-0.93L20 7"/></svg>` },
  { name: 'Auto', eta: '12 mins Away', priceRange: '₹ 120-135', minRide: '40₹', pricePerKm: '12₹/per Km', icon: `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-auto-rickshaw"><path d="M10 2h6a2 2 0 0 1 2 2v2s0 1-1 1H3c-1 0-1-1-1-1V4a2 2 0 0 1 2-2h2"/><path d="M14 11v-.5a.5.5 0 0 0-.5-.5h-9a.5.5 0 0 0-.5.5v.5L2 14v4a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-4l-1-3z"/><path d="M7 14h4"/><path d="M17 14h.01"/><path d="M20 17h.01"/><path d="M22 20h.01"/></svg>` },
  { name: 'Car Mini', eta: '4 mins Away', priceRange: '₹ 170-188', minRide: '50₹', pricePerKm: '15₹/per Km', icon: `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-car"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.8-2.8c-.7-.7-1.7-1.2-2.8-1.4L4 5v14"/><path d="M12 10H4v6h10"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/></svg>` },
  { name: 'Car Premium', eta: '6 mins Away', priceRange: '₹ 220-250', minRide: '60₹', pricePerKm: '18₹/per Km', icon: `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-car"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.8-2.8c-.7-.7-1.7-1.2-2.8-1.4L4 5v14"/><path d="M12 10H4v6h10"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/></svg>` }, // Using the same car icon for now
];

interface VehicleOption {
  name: string;
  eta: string;
  priceRange: string;
  minRide: string;
  pricePerKm: string;
  icon: string;
}

interface ServicesScreenProps {
  setActiveTab: (tab: TabName) => void;
}

const ServicesScreen: React.FC<ServicesScreenProps> = ({ setActiveTab }) => {
  const [isTaxiBookingActive, setIsTaxiBookingActive] = useState(false);
  const { toast } = useToast();
  const [destination, setDestination] = useState(''); // State for destination input


  const handleServiceClick = (service: Service) => {
    if (service.name === 'Taxi') {
      setIsTaxiBookingActive(true);
      return;
    }
    if (service.targetTab) {
      setActiveTab(service.targetTab);
    } else {
      toast({
        title: `${service.name} Service`,
        description: service.locked ? "This service is coming soon!" : `Exploring ${service.name}.`,
      });
    }
  };
  
  return (
    <main className="flex-grow bg-background overflow-y-auto p-4 h-full custom-scrollbar">
 <button onClick={() => setIsTaxiBookingActive(false)} className={`mb-4 text-foreground ${isTaxiBookingActive ? '' : 'hidden'}`}>
 <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-arrow-left"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
 </button>
      {isTaxiBookingActive ? (
        // Placeholder for the taxi booking UI
        <div className="space-y-6">
 <h2 className="text-2xl font-bold text-foreground mb-6 font-headline">Book a Ride</h2>
 <div className="relative">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-search absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
 <Input
 className="pl-10"
              placeholder="Where are you going?"
              value={destination}
 onChange={(e) => setDestination(e.target.value)}
 />
 </div>
          <button className="w-full text-left text-primary font-semibold mt-2">Select on Map</button>

          {/* Placeholder for Recent Destinations */}
          <div className="space-y-2">
 <h3 className="text-lg font-semibold text-foreground">Recent Destinations</h3>
            {/* Add placeholder recent destination items here if needed */}
            <p className="text-muted-foreground text-sm">No recent destinations.</p>
          </div>

          {/* Vehicle Options */}
          <div className="space-y-4">
 <h3 className="text-lg font-semibold text-foreground">Choose Vehicle</h3>
            {vehicleOptions.map((vehicle, index) => (
 <div key={index} className="flex items-center justify-between p-4 border rounded-lg shadow-sm cursor-pointer hover:bg-accent transition-colors">
 <div className="flex items-center space-x-4">
 <SvgRenderer svgString={vehicle.icon} className="w-10 h-10 text-primary" />
 <div className="flex flex-col">
 <span className="font-semibold text-foreground">{vehicle.name}</span>
 <span className="text-sm text-muted-foreground">{vehicle.eta}</span>
 </div>
 </div>
 <span className="font-bold text-foreground">{vehicle.priceRange}</span>
 </div>
            ))}
          </div>
        </div>
      ) : (
        <>
          <h2 className="text-2xl font-bold text-foreground mb-6 font-headline">Services we Offer</h2>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
            {servicesData.map((service) => (
              <ServiceCard key={service.name} service={service} onClick={() => handleServiceClick(service)} />
            ))}
          </div>
        </>
      )}
    </main>
  );
};
export default ServicesScreen;

