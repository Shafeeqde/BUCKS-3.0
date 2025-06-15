
"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import Image from 'next/image';
import { useToast } from "@/hooks/use-toast";
import type { TabName, UserDataForSideMenu } from '@/types';
import { QrCodeIcon, UserCircleIcon, PencilSquareIcon, CalendarDaysIcon, CheckBadgeIcon } from '@heroicons/react/24/outline';
import { format } from 'date-fns';

interface AccountScreenProps {
  userData: UserDataForSideMenu | null;
  setActiveTab: (tab: TabName) => void;
}

const AccountScreen: React.FC<AccountScreenProps> = ({ userData, setActiveTab }) => {
    const { toast } = useToast();

    if (!userData) {
        return (
            <div className="flex flex-col items-center justify-center h-full p-4">
                <UserCircleIcon className="w-16 h-16 text-muted-foreground mb-4" />
                <p className="text-lg text-muted-foreground">User data not available.</p>
                <p className="text-sm text-muted-foreground">Please log in to view your account.</p>
            </div>
        );
    }

    const loggedInUserName = userData.name || 'Test User';
    const userUUID = userData.id || 'N/A';
    
    // Simulate valid from and valid through dates
    const validFromDate = React.useMemo(() => {
        const oneYearAgo = new Date();
        oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
        return oneYearAgo;
    }, []);

    const validThroughDate = React.useMemo(() => {
        const fiveYearsFromValidFrom = new Date(validFromDate);
        fiveYearsFromValidFrom.setFullYear(fiveYearsFromValidFrom.getFullYear() + 5);
        return fiveYearsFromValidFrom;
    }, [validFromDate]);

    const handleEditPersonalProfile = () => {
        toast({ title: "Edit Personal Details (Simulated)", description: "This would open a form to edit your ID card display name, avatar, etc." });
    };

    return (
        <ScrollArea className="h-full bg-gradient-to-br from-muted/20 via-background to-background">
            <div className="max-w-md mx-auto p-4 sm:p-6 md:p-8 flex flex-col items-center justify-center min-h-full">
                <Card className="w-full shadow-2xl rounded-xl overflow-hidden bg-card border-primary/20">
                    <CardHeader className="bg-primary text-primary-foreground p-6 text-center relative">
                        <div className="absolute top-3 left-3 bg-white/20 backdrop-blur-sm p-1.5 rounded-full">
                             <UserCircleIcon className="h-6 w-6 text-primary-foreground" />
                        </div>
                        <CardTitle className="text-2xl font-bold font-headline">Bucks ID Card</CardTitle>
                        <CardDescription className="text-primary-foreground/80 text-sm">Your Digital Identity</CardDescription>
                    </CardHeader>

                    <CardContent className="p-6 space-y-6">
                        <div className="flex flex-col items-center space-y-4">
                            <Avatar className="w-28 h-28 border-4 border-background ring-2 ring-primary">
                                <AvatarImage src={userData.avatarUrl || `https://source.unsplash.com/random/128x128/?${loggedInUserName.split(' ')[0].toLowerCase() || 'abstract'}`} alt={loggedInUserName} data-ai-hint={userData.avatarAiHint || "user avatar"} />
                                <AvatarFallback className="text-4xl bg-muted">{loggedInUserName?.substring(0, 2).toUpperCase() || "U"}</AvatarFallback>
                            </Avatar>
                            <div className="text-center">
                                <h2 className="text-2xl font-semibold text-foreground">{loggedInUserName}</h2>
                                {userData.email && <p className="text-sm text-muted-foreground">{userData.email}</p>}
                            </div>
                        </div>

                        <div className="bg-muted/50 p-4 rounded-lg flex flex-col items-center space-y-3">
                           <Image 
                                src={`https://placehold.co/150x150.png?text=QR+CODE`} 
                                alt="QR Code Placeholder" 
                                width={150} 
                                height={150} 
                                className="rounded-md border shadow-sm"
                                data-ai-hint="qr code"
                            />
                            <p className="text-xs text-muted-foreground text-center">Scan for quick verification</p>
                        </div>

                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between items-center">
                                <span className="text-muted-foreground font-medium">Bucks ID:</span>
                                <span className="font-mono text-foreground text-xs break-all">{userUUID}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-muted-foreground font-medium">Valid From:</span>
                                <span className="font-medium text-foreground">{format(validFromDate, 'dd MMM yyyy')}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-muted-foreground font-medium">Valid Through:</span>
                                <span className="font-medium text-foreground">{format(validThroughDate, 'dd MMM yyyy')}</span>
                            </div>
                        </div>
                         <div className="flex items-center justify-center text-green-600 pt-2">
                            <CheckBadgeIcon className="h-5 w-5 mr-1.5"/>
                            <span className="text-sm font-medium">Verified Member</span>
                        </div>
                    </CardContent>
                    <CardFooter className="p-6 border-t bg-muted/30">
                        <Button variant="outline" className="w-full" onClick={handleEditPersonalProfile}>
                            <PencilSquareIcon className="mr-2 h-4 w-4" /> Edit Display Info (Simulated)
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </ScrollArea>
    );
};

export default AccountScreen;
