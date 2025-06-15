
"use client";

import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { UserBusinessProfile } from '@/types';
import { Button } from '@/components/ui/button'; // Added for the if (!profile) block
import { ArrowLeftIcon, BuildingOfficeIcon } from '@heroicons/react/24/outline'; // Added for the if (!profile) block

interface UserBusinessProfileDetailScreenProps {
  profile: UserBusinessProfile | undefined | null;
  onBack: () => void;
}

const UserBusinessProfileDetailScreen: React.FC<UserBusinessProfileDetailScreenProps> = ({
  profile,
  onBack,
}) => {
  if (!profile) {
    // Keeping a functional, simple return for the case where profile is not found.
    // This is important for the component to be valid.
    return (
      <div className="flex flex-col items-center justify-center h-full p-4 text-center">
        <BuildingOfficeIcon className="w-16 h-16 text-muted-foreground mb-4" />
        <h2 className="text-xl font-semibold text-muted-foreground">Profile Not Found</h2>
        <p className="text-muted-foreground mb-6">The business profile you are looking for does not exist or could not be loaded.</p>
        <Button onClick={onBack}>
          <ArrowLeftIcon className="mr-2 h-4 w-4" /> Go Back
        </Button>
      </div>
    );
  }

  // This is the main return statement that the error points to.
  // We are making it as simple as possible.
  return (
    <ScrollArea className="h-full custom-scrollbar bg-background">
      <div className="p-4">
        <h1>Profile: {profile.name}</h1>
        <p>Minimal content to test parsing.</p>
      </div>
    </ScrollArea>
  );
};

export default UserBusinessProfileDetailScreen;
