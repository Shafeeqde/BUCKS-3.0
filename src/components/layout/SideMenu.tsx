
"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose } from '@/components/ui/sheet';
import {
  User,
  Briefcase,
  Car,
  Building,
  LogOut,
  ChevronRight,
  Settings,
  ShieldCheck,
  Rocket
} from 'lucide-react';
import type { TabName, UserBusinessProfile } from '@/types';
import Image from 'next/image';

interface SideMenuProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: TabName;
  setActiveTab: (tab: TabName) => void;
  businessProfiles: UserBusinessProfile[];
  onSelectBusinessProfile: (id: string | number) => void;
  onLogout: () => void;
}

const SideMenu: React.FC<SideMenuProps> = ({
  isOpen,
  onClose,
  activeTab,
  setActiveTab,
  businessProfiles,
  onSelectBusinessProfile,
  onLogout,
}) => {
  const menuItems = [
    { name: 'Professional Profile', tab: 'account' as TabName, icon: User },
    { name: 'Skillsets', tab: 'user-skillsets' as TabName, icon: Rocket }, // Corrected tab name
    { name: 'Vehicles', tab: 'vehicles' as TabName, icon: Car },
    { name: 'Business Profiles', tab: 'business-profiles' as TabName, icon: Briefcase },
  ];

  const handleNavigation = (tab: TabName) => {
    setActiveTab(tab);
    onClose();
  };

  const handleBusinessProfileClick = (id: string | number) => {
    onSelectBusinessProfile(id);
    onClose();
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="left" className="w-[280px] sm:w-[320px] p-0 flex flex-col bg-card">
        <SheetHeader className="p-4 border-b">
          <SheetTitle className="text-xl font-bold text-primary font-headline flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-sparkles mr-2 text-primary"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>
            bucks Menu
          </SheetTitle>
        </SheetHeader>

        <ScrollArea className="flex-grow">
          <nav className="p-4 space-y-2">
            {menuItems.map((item) => (
              <Button
                key={item.tab}
                variant={activeTab === item.tab ? 'secondary' : 'ghost'}
                className="w-full justify-start text-base h-12"
                onClick={() => handleNavigation(item.tab)}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </Button>
            ))}

            {businessProfiles && businessProfiles.length > 0 && (
              <div className="pt-2 mt-2 border-t">
                <h4 className="px-4 py-2 text-sm font-semibold text-muted-foreground">My Businesses</h4>
                {businessProfiles.map((profile) => (
                  <Button
                    key={profile.id}
                    variant={activeTab === 'business-detail' && profile.id === profile.id /* Need to get selectedBusinessProfileId here */ ? 'secondary' : 'ghost'}
                    className="w-full justify-start text-sm h-11"
                    onClick={() => handleBusinessProfileClick(profile.id)}
                  >
                    {profile.logo ? (
                      <Image
                        src={profile.logo}
                        alt={`${profile.name} logo`}
                        width={20}
                        height={20}
                        className="mr-3 rounded-sm object-cover"
                        data-ai-hint={profile.logoAiHint || "business logo"}
                      />
                    ) : (
                      <Building className="mr-3 h-5 w-5" />
                    )}
                    <span className="truncate">{profile.name}</span>
                    <ChevronRight className="ml-auto h-4 w-4 text-muted-foreground" />
                  </Button>
                ))}
              </div>
            )}
            
            <div className="pt-4 space-y-2">
                 <Button variant="ghost" className="w-full justify-start text-base h-12" onClick={() => { /* TODO */ onClose(); }}>
                    <Settings className="mr-3 h-5 w-5" />
                    Settings
                </Button>
                <Button variant="ghost" className="w-full justify-start text-base h-12" onClick={() => { /* TODO */ onClose(); }}>
                    <ShieldCheck className="mr-3 h-5 w-5" />
                    Privacy & Security
                </Button>
            </div>


          </nav>
        </ScrollArea>
        
        <div className="p-4 border-t mt-auto">
          <Button
            variant="outline"
            className="w-full justify-start text-base h-12"
            onClick={() => { onLogout(); onClose(); }}
          >
            <LogOut className="mr-3 h-5 w-5 text-destructive" />
            Logout
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default SideMenu;
