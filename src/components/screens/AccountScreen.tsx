"use client";

import React from 'react';

const AccountScreen = () => {
  return (
    <main className="flex-grow flex flex-col items-center justify-center text-muted-foreground p-4 h-full">
      <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user-cog mb-4">
        <circle cx="18" cy="15" r="3"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M12 15h1.5a.5.5 0 0 1 0 1H12v1.5a.5.5 0 0 1-1 0V16h-1.5a.5.5 0 0 1 0-1H10V13.5a.5.5 0 0 1 1 0V15Z"/>
        <path d="M21.7 19.4a1.5 1.5 0 0 0-2.1-2.1L18 18.9l-1.6-1.6a1.5 1.5 0 1 0-2.1 2.1l1.6 1.6-1.6 1.6a1.5 1.5 0 1 0 2.1 2.1L18 21.1l1.6 1.6a1.5 1.5 0 1 0 2.1-2.1l-1.6-1.6Z"/>
        <path d="M2 21v-2a4 4 0 0 1 4-4h4"/>
      </svg>
      <h1 className="text-2xl font-semibold font-headline mb-2">Account Settings</h1>
      <p className="text-center">This section is under construction. Check back soon for updates!</p>
    </main>
  );
};

export default AccountScreen;
