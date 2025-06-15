
"use client";

import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from "@/hooks/use-toast";
import type { TabName, UserDataForSideMenu } from '@/types';
import { UserCircleIcon, PencilSquareIcon, CheckBadgeIcon, BuildingOfficeIcon } from '@heroicons/react/24/outline';
import { format } from 'date-fns';

interface DigitalIdCardScreenProps {
  userData: UserDataForSideMenu | null;
  setActiveTab: (tab: TabName) => void;
}

const DigitalIdCardScreen: React.FC<DigitalIdCardScreenProps> = ({ userData, setActiveTab }) => {
    const { toast } = useToast();

    if (!userData) {
        return (
            <div className="flex flex-col items-center justify-center h-full p-4">
                <UserCircleIcon className="w-16 h-16 text-muted-foreground mb-4" />
                <p className="text-lg text-muted-foreground">User data not available.</p>
                <p className="text-sm text-muted-foreground">Please log in to view your ID card.</p>
            </div>
        );
    }

    const loggedInUserName = userData.name || 'Test User';
    const userUUID = userData.id || 'USER-ID-NOT-AVAILABLE';
    // Format UUID to be more readable like AADHAAR: XXXX XXXX XXXX
    const formattedUUID = userUUID.length >= 12 
        ? `${userUUID.substring(0,4)} ${userUUID.substring(4,8)} ${userUUID.substring(8,12)}` 
        : userUUID;

    // Placeholder for data not in UserDataForSideMenu
    const dateOfBirth = "01 / Jan / 1990";
    const gender = "User Defined";

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
        setActiveTab('account-settings');
        toast({ title: "Edit Display Info", description: "Opening settings to edit your ID card display name, avatar, etc." });
    };
    
    // Simple Base64 encoded 1x1 transparent PNG for QR placeholder
    const qrCodeDataUri = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAJySURBVHhe7dJBDQAgDAAx2P+FF7JgSRMAAAAAAAAAAAAAAAAAAAAAAABAQkmb/Vf2nAHtMkH+P3AGtMsE+f/AGdAuE+T/A2dAu0yQ/w+cAW0zQ0IWMiIiIzIicyIiIjMiIzIiIiMyIiMyIiIiMyIiMyIiIzIiIiMyIiMyIiIiMyIiMyIiIiMyIiMyIiIiMyIiIiMyIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMxf3f4A9hMHg8gS7LwAAAAASUVORK5CYII=";


    return (
        <ScrollArea className="h-full bg-gradient-to-br from-primary/5 via-background to-background p-2 sm:p-4">
            <div className="flex justify-center items-center min-h-full py-4">
                <Card className="w-full max-w-[340px] shadow-2xl rounded-xl overflow-hidden bg-card border border-border aspect-[0.63] flex flex-col"> {/* Portrait aspect ratio */}
                    {/* Header Band */}
                    <div className="p-2 bg-primary/10 border-b border-primary/20">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-1.5">
                                <BuildingOfficeIcon className="h-5 w-5 text-primary" />
                                <p className="text-sm font-semibold text-primary">BUCKS GOVT.</p>
                            </div>
                            <CheckBadgeIcon className="h-5 w-5 text-green-600" />
                        </div>
                    </div>

                    {/* Main Content */}
                    <CardContent className="p-3 flex-grow flex flex-col space-y-3">
                        <div className="flex items-center space-x-3">
                            <Avatar className="h-20 w-20 border-2 border-primary/30 rounded-md">
                                <AvatarImage src={userData.avatarUrl || 'https://placehold.co/120x120.png'} alt={loggedInUserName} data-ai-hint={userData.avatarAiHint || "user portrait"}/>
                                <AvatarFallback className="text-2xl bg-muted rounded-md">{loggedInUserName?.substring(0, 1).toUpperCase() || "U"}</AvatarFallback>
                            </Avatar>
                            <div className="flex-grow flex flex-col items-center justify-center">
                                <Image
                                    src={qrCodeDataUri} 
                                    alt="QR Code"
                                    width={70}
                                    height={70}
                                    className="object-contain rounded-sm border p-0.5 bg-white"
                                    data-ai-hint="qr code"
                                />
                            </div>
                        </div>

                        <div className="text-left space-y-1.5">
                            <div>
                                <p className="text-xs text-muted-foreground uppercase tracking-wider">Name</p>
                                <p className="text-md font-semibold text-foreground -mt-0.5">{loggedInUserName}</p>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-x-3">
                                <div>
                                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Date of Birth</p>
                                    <p className="text-sm font-medium text-foreground -mt-0.5">{dateOfBirth}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Gender</p>
                                    <p className="text-sm font-medium text-foreground -mt-0.5">{gender}</p>
                                </div>
                            </div>

                            <div>
                                <p className="text-xs text-muted-foreground uppercase tracking-wider">Bucks ID</p>
                                <p className="text-lg font-bold text-primary tracking-wide -mt-0.5">{formattedUUID}</p>
                            </div>
                        </div>
                        
                        <div className="border-t border-dashed border-border/50 my-1"></div>

                        <div className="text-xs text-muted-foreground text-center">
                           <p>This card is issued by Bucks Authority.</p>
                           <p>Not transferable. Misuse is punishable.</p>
                        </div>
                        
                    </CardContent>

                     <CardFooter className="p-3 border-t border-border/50 bg-muted/20 mt-auto">
                        <div className="w-full text-center">
                             <p className="text-xs text-muted-foreground">
                                VALID: {format(validFromDate, 'MM/yy')} - {format(validThroughDate, 'MM/yy')}
                             </p>
                             <Button variant="link" size="sm" className="text-xs h-auto p-0 mt-1" onClick={handleEditPersonalProfile}>
                                 Update Info
                             </Button>
                        </div>
                    </CardFooter>
                </Card>
            </div>
        </ScrollArea>
    );
};

export default DigitalIdCardScreen;

