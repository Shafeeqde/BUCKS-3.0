"use client";

import React from 'react';
import ServiceCard from '@/components/services/ServiceCard';
import type { Service, TabName } from '@/types';
import { useToast } from "@/hooks/use-toast";


const servicesData: Service[] = [
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

interface ServicesScreenProps {
  setActiveTab: (tab: TabName) => void;
}

const ServicesScreen: React.FC<ServicesScreenProps> = ({ setActiveTab }) => {
  const { toast } = useToast();

  const handleServiceClick = (service: Service) => {
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
      <h2 className="text-2xl font-bold text-foreground mb-6 font-headline">Services we Offer</h2>
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
        {servicesData.map((service) => (
          <ServiceCard key={service.name} service={service} onClick={() => handleServiceClick(service)} />
        ))}
      </div>
    </main>
  );
};

export default ServicesScreen;
