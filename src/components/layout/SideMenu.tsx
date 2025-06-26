
"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose } from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Cog6ToothIcon, 
  BriefcaseIcon,
  TruckIcon, 
  BuildingOfficeIcon, 
  ArrowLeftOnRectangleIcon, 
  ChevronRightIcon,
  RocketLaunchIcon, 
  UserCircleIcon, 
  IdentificationIcon, 
} from '@heroicons/react/24/outline';
import type { TabName, UserBusinessProfile, UserDataForSideMenu } from '@/types';
import Image from 'next/image'; 

interface SideMenuProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: TabName;
  setActiveTab: (tab: TabName) => void;
  businessProfiles: UserBusinessProfile[];
  onSelectBusinessProfile: (id: string | number) => void;
  selectedBusinessProfileId: string | number | null;
  onLogout: () => void;
  userData: UserDataForSideMenu | null;
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
    { name: 'Professional Dashboard', tab: 'professional-profile' as TabName, icon: UserCircleIcon },
    { name: 'Skillset Profiles', tab: 'user-skillsets' as TabName, icon: RocketLaunchIcon },
    { name: 'Vehicle Management', tab: 'vehicles' as TabName, icon: TruckIcon },
    { name: 'Business Profiles', tab: 'business-profiles' as TabName, icon: BriefcaseIcon },
    { name: 'Account Settings', tab: 'account-settings' as TabName, icon: Cog6ToothIcon }, 
  ];

  const handleNavigation = (tab: TabName) => {
    setActiveTab(tab);
    onClose();
  };

  const handleBusinessProfileClick = (id: string | number) => {
    onSelectBusinessProfile(id);
    onClose();
  };

  const handleUserSectionClick = () => {
    setActiveTab('digital-id-card'); // Navigate to Digital ID Card screen
    onClose();
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="left" className="w-[280px] sm:w-[320px] p-0 flex flex-col bg-sidebar text-sidebar-foreground">
        <SheetHeader className="p-4 border-b border-sidebar-border">
          <SheetTitle className="text-xl font-bold text-sidebar-primary-foreground font-headline flex items-center">
            <IdentificationIcon className="mr-2 h-6 w-6"/> 
            My Account & ID
          </SheetTitle>
        </SheetHeader>

        {userData && (
          <Button
            variant="ghost"
            className="p-4 border-b border-sidebar-border flex items-center space-x-4 h-auto text-left w-full justify-start hover:bg-sidebar-accent/80 rounded-none"
            onClick={handleUserSectionClick} 
          >
            <Avatar className="h-14 w-14 border-2 border-sidebar-primary">
              <AvatarImage src={userData.avatarUrl || 'https://source.unsplash.com/random/64x64/?user,avatar'} alt={userData.name} data-ai-hint={userData.avatarAiHint || "user avatar"} />
              <AvatarFallback className="bg-sidebar-accent text-sidebar-accent-foreground text-lg">{userData.name.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex-grow">
              <p className="font-bold text-lg text-sidebar-foreground">{userData.name}</p>
              <p className="text-sm text-sidebar-foreground/80">{userData.email}</p>
            </div>
            <ChevronRightIcon className="h-5 w-5 text-sidebar-foreground/70" />
          </Button>
        )}

        <ScrollArea className="flex-grow">
          <nav className="p-4 space-y-1">
            {menuItems.map((item) => (
              <Button
                key={item.tab}
                variant={activeTab === item.tab ? 'secondary' : 'ghost'}
                className="w-full justify-start text-base h-12 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground data-[variant=secondary]:bg-sidebar-primary data-[variant=secondary]:text-sidebar-primary-foreground"
                onClick={() => handleNavigation(item.tab)}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </Button>
            ))}

            {businessProfiles && businessProfiles.length > 0 && (
              <div className="pt-2 mt-2 border-t border-sidebar-border">
                <h4 className="px-4 py-2 text-sm font-semibold text-sidebar-foreground/70">My Businesses</h4>
                {businessProfiles.map((profile) => (
                  <Button
                    key={profile.id}
                    variant={activeTab === 'business-detail' && profile.id === selectedBusinessProfileId ? 'secondary' : 'ghost'}
                    className="w-full justify-start text-sm h-11 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground data-[variant=secondary]:bg-sidebar-primary data-[variant=secondary]:text-sidebar-primary-foreground"
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
                      <BuildingOfficeIcon className="mr-3 h-5 w-5" />
                    )}
                    <span className="truncate">{profile.name}</span>
                    <ChevronRightIcon className="ml-auto h-4 w-4 text-sidebar-foreground/70" />
                  </Button>
                ))}
              </div>
            )}
          </nav>
        </ScrollArea>
        
        <div className="p-4 border-t border-sidebar-border mt-auto">
          <Button
            variant="outline"
            className="w-full justify-start text-base h-12 text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/50 hover:border-destructive"
            onClick={() => { onLogout(); onClose(); }}
          >
            <ArrowLeftOnRectangleIcon className="mr-3 h-5 w-5" />
            Logout
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default SideMenu;
