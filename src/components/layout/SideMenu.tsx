
"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose } from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Settings, 
  Briefcase,
  Car,
  Building,
  LogOut,
  ChevronRight,
  Rocket, 
  UserCog, // Using UserCog for Professional Profile
  UserCircle // Using UserCircle for the main title "Professional Account"
} from 'lucide-react';
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
    { name: 'Skillset Profiles', tab: 'user-skillsets' as TabName, icon: Rocket },
    { name: 'Vehicle Management', tab: 'vehicles' as TabName, icon: Car },
    { name: 'Business Profiles', tab: 'business-profiles' as TabName, icon: Briefcase },
    // "Professional Profile" below the user info block also leads to 'professional-profile'
    { name: 'Account Settings', tab: 'account-settings' as TabName, icon: Settings }, 
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
    setActiveTab('professional-profile'); 
    onClose();
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="left" className="w-[280px] sm:w-[320px] p-0 flex flex-col bg-sidebar text-sidebar-foreground">
        <SheetHeader className="p-4 border-b border-sidebar-border">
          <SheetTitle className="text-xl font-bold text-sidebar-primary-foreground font-headline flex items-center">
            <UserCircle className="mr-2 h-6 w-6"/>
            Professional Account
          </SheetTitle>
        </SheetHeader>

        {userData && (
          <Button
            variant="ghost"
            className="p-4 border-b border-sidebar-border flex items-center space-x-3 h-auto text-left w-full justify-start hover:bg-sidebar-accent/80 rounded-none"
            onClick={handleUserSectionClick}
          >
            <Avatar className="h-12 w-12 border-2 border-sidebar-primary">
              <AvatarImage src={userData.avatarUrl || 'https://source.unsplash.com/random/48x48/?user,avatar'} alt={userData.name} data-ai-hint={userData.avatarAiHint || "user avatar"} />
              <AvatarFallback className="bg-sidebar-accent text-sidebar-accent-foreground">{userData.name.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex-grow">
              <p className="font-semibold text-sidebar-foreground">{userData.name}</p>
              <p className="text-xs text-sidebar-foreground/80">{userData.email}</p>
            </div>
            <ChevronRight className="h-4 w-4 text-sidebar-foreground/70" />
          </Button>
        )}

        <ScrollArea className="flex-grow">
          <nav className="p-4 space-y-1">
            {/* Explicit link to Professional Profile Dashboard */}
            <Button
                variant={activeTab === 'professional-profile' ? 'secondary' : 'ghost'}
                className="w-full justify-start text-base h-12 bg-sidebar-primary/10 text-sidebar-primary hover:bg-sidebar-accent hover:text-sidebar-accent-foreground data-[variant=secondary]:bg-sidebar-primary data-[variant=secondary]:text-sidebar-primary-foreground"
                onClick={() => handleNavigation('professional-profile')}
            >
                <UserCog className="mr-3 h-5 w-5" />
                My Professional Dashboard
            </Button>

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
                      <Building className="mr-3 h-5 w-5" />
                    )}
                    <span className="truncate">{profile.name}</span>
                    <ChevronRight className="ml-auto h-4 w-4 text-sidebar-foreground/70" />
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
            <LogOut className="mr-3 h-5 w-5" />
            Logout
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default SideMenu;
