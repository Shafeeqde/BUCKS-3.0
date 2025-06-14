
"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose } from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  UserCog, // For Professional Profile
  Settings, // For Account Settings
  Briefcase,
  Car,
  Building,
  LogOut,
  ChevronRight,
  ShieldCheck,
  Rocket,
  Sparkles
} from 'lucide-react';
import type { TabName, UserBusinessProfile, UserDataForSideMenu } from '@/types';
import Image from 'next/image'; // For business logos

interface SideMenuProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: TabName;
  setActiveTab: (tab: TabName) => void;
  businessProfiles: UserBusinessProfile[];
  onSelectBusinessProfile: (id: string | number) => void;
  selectedBusinessProfileId: string | number | null;
  onLogout: () => void;
  userData: UserDataForSideMenu | null; // Updated to use specific type
}

const SideMenu: React.FC<SideMenuProps> = ({
  isOpen,
  onClose,
  activeTab,
  setActiveTab,
  businessProfiles,
  onSelectBusinessProfile,
  selectedBusinessProfileId,
  onLogout,
  userData,
}) => {
  const menuItems = [
    { name: 'Professional Profile', tab: 'professional-profile' as TabName, icon: UserCog },
    { name: 'Account Settings', tab: 'account' as TabName, icon: Settings },
    { name: 'Skillset Profiles', tab: 'user-skillsets' as TabName, icon: Rocket },
    { name: 'Vehicle Management', tab: 'vehicles' as TabName, icon: Car },
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
            <Sparkles className="mr-2 h-6 w-6 text-primary"/>
            bucks Menu
          </SheetTitle>
        </SheetHeader>

        {userData && (
          <div className="p-4 border-b flex items-center space-x-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={userData.avatarUrl || 'https://placehold.co/48x48.png'} alt={userData.name} data-ai-hint="user avatar" />
              <AvatarFallback>{userData.name.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-foreground">{userData.name}</p>
              <p className="text-xs text-muted-foreground">{userData.email}</p>
            </div>
          </div>
        )}

        <ScrollArea className="flex-grow">
          <nav className="p-4 space-y-1">
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
                    variant={activeTab === 'business-detail' && profile.id === selectedBusinessProfileId ? 'secondary' : 'ghost'}
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
            
            <div className="pt-4 space-y-1 border-t mt-2">
                 <Button variant="ghost" className="w-full justify-start text-base h-12" onClick={() => { /* TODO: Navigate to actual settings screen */ onClose(); }}>
                    <Settings className="mr-3 h-5 w-5" />
                    App Settings
                </Button>
                <Button variant="ghost" className="w-full justify-start text-base h-12" onClick={() => { /* TODO: Navigate to privacy screen */ onClose(); }}>
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
