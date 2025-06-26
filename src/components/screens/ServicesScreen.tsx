
"use client";
import React from 'react';
import ServiceCard from '@/components/services/ServiceCard';
import type { Service, TabName } from '@/types';
import { useToast } from "@/hooks/use-toast";
import { 
  TruckIcon, 
  BriefcaseIcon,
  BuildingStorefrontIcon, 
  ShoppingBagIcon,
  CreditCardIcon,
  TicketIcon,
  BuildingLibraryIcon, 
} from '@heroicons/react/24/outline'; 
import { ScrollArea } from '../ui/scroll-area';

const initialServicesData: Service[] = [
    { id: 'taxi', name: 'Taxi', icon: TruckIcon, locked: false, dataAiHint: "car taxi ride", targetTab: 'menu' },
    { id: 'jobs', name: 'Jobs', icon: BriefcaseIcon, locked: false, dataAiHint: "briefcase work", targetTab: 'job-board' },
    { id: 'restaurants', name: 'Restaurants', icon: BuildingStorefrontIcon, locked: true, dataAiHint: "utensils restaurant", targetTab: 'food-restaurants' },
    { id: 'shops', name: 'Shops', icon: ShoppingBagIcon, locked: true, dataAiHint: "shopping bag", targetTab: 'shopping-categories' },
    { id: 'pay', name: 'Pay', icon: CreditCardIcon, locked: true, dataAiHint: "credit card" },
    { id: 'tickets', name: 'Tickets', icon: TicketIcon, locked: true, dataAiHint: "ticket movie" },
    { id: 'delivery', name: 'Delivery', icon: TruckIcon, locked: true, dataAiHint: "truck delivery" },
    { id: 'banking', name: 'Banking', icon: BuildingLibraryIcon, locked: true, dataAiHint: "bank building" },
];

interface ServicesScreenProps {
  setActiveTab: (tab: TabName) => void;
  // onRequestRide is removed as it was simulation logic
}

const ServicesScreen: React.FC<ServicesScreenProps> = ({ setActiveTab }) => {
  const { toast } = useToast();

  const handleServiceClick = (service: Service) => {
    if (service.locked) {
      toast({
        title: `${service.name} Service`,
        description: "This service is coming soon!",
      });
      return;
    }
    
    if (service.id === 'taxi') {
        toast({
            title: "Taxi Service",
            description: "Taxi booking feature is currently under development.",
        });
        // Here you would navigate to a real booking screen in the future
        return;
    }
    
    if (service.targetTab) {
        setActiveTab(service.targetTab);
    } else {
        toast({
            title: `${service.name} Service`,
            description: `Exploring ${service.name}. This service is under development.`,
        });
    }
  };
  
  return (
    <ScrollArea className="h-full custom-scrollbar bg-background">
      <main className="p-4">
        <div className="flex items-center mb-6">
          <h2 className="text-2xl font-bold text-foreground font-headline">
            Services
          </h2>
        </div>
        
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
          {initialServicesData.map((service) => (
            <ServiceCard key={service.id} service={service} onClick={() => handleServiceClick(service)} />
          ))}
        </div>
      </main>
    </ScrollArea>
  );
};
export default ServicesScreen;
