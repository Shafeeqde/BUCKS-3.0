
"use client";

import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from "@/hooks/use-toast";
import type { TabName, UserDataForSideMenu } from '@/types';
import { UserCircleIcon, PencilSquareIcon, CheckBadgeIcon, BuildingOfficeIcon } from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

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

    const formatUUIDAsCardNumber = (uuid: string) => {
        const cleanUUID = uuid.replace(/-/g, '').toUpperCase();
        let formatted = '';
        for (let i = 0; i < cleanUUID.length; i += 4) {
            formatted += cleanUUID.substring(i, i + 4) + ' ';
        }
        return formatted.trim().substring(0, 19);
    };
    const formattedCardNumberUUID = formatUUIDAsCardNumber(userUUID);


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

    const qrCodeDataUri = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAJySURBVHhe7dJBDQAgDAAx2P+FF7JgSRMAAAAAAAAAAAAAAAAAAAAAAABAQkmb/Vf2nAHtMkH+P3AGtMsE+f/AGdAuE+T/A2dAu0yQ/w+cAW0zQ0IWMiIiIzIicyIiIjMiIzIiIiMyIiMyIiIiMyIiMyIiIiMyIiMyIiIiMyIiMyIiIiMyIiMyIiIiMyIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMyIiIiMxf3f4A9hMHg8gS7LwAAAAASUVORK5CYII=";

    const avatarHint = userData.avatarAiHint || "user portrait";
    const avatarSrc = userData.avatarUrl || `https://source.unsplash.com/random/120x120/?${avatarHint.split(' ').join(',')}`;

    return (
        <ScrollArea className="h-full bg-gradient-to-br from-primary/5 via-background to-background p-2 sm:p-4">
            <div className="flex justify-center items-center min-h-full py-4">
                <Card className={cn(
                    "w-full max-w-xl shadow-2xl rounded-xl overflow-hidden bg-card border border-border",
                    "aspect-[16/10]"
                )}>
                    <div className="h-full flex flex-col p-4 sm:p-5 bg-gradient-to-br from-primary/10 via-background to-secondary/5">
                        <div className="flex justify-between items-center mb-3 sm:mb-4">
                            <div className="flex items-center space-x-1.5">
                                <BuildingOfficeIcon className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                                <p className="text-sm sm:text-md font-semibold text-primary">Digital user id</p>
                            </div>
                            <CheckBadgeIcon className="h-5 w-5 sm:h-6 sm:w-6 text-green-500" />
                        </div>

                        <div className="flex-grow grid grid-cols-3 gap-3 sm:gap-4">
                            <div className="col-span-2 flex flex-col justify-between space-y-2 sm:space-y-3">
                                <div>
                                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Bucks ID</p>
                                    <p className="text-xl sm:text-2xl font-bold text-primary tracking-wider font-mono break-all">
                                        {formattedCardNumberUUID}
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-x-2 sm:gap-x-3">
                                    <div>
                                        <p className="text-[0.6rem] sm:text-xs text-muted-foreground uppercase">Valid From</p>
                                        <p className="text-xs sm:text-sm font-medium text-foreground">{format(validFromDate, 'MM/yy')}</p>
                                    </div>
                                    <div>
                                        <p className="text-[0.6rem] sm:text-xs text-muted-foreground uppercase">Valid Thru</p>
                                        <p className="text-xs sm:text-sm font-medium text-foreground">{format(validThroughDate, 'MM/yy')}</p>
                                    </div>
                                </div>

                                <div>
                                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Cardholder Name</p>
                                    <p className="text-md sm:text-lg font-semibold text-foreground truncate">{loggedInUserName}</p>
                                </div>
                            </div>

                            <div className="col-span-1 flex flex-col items-center justify-between space-y-2 sm:space-y-3">
                                <Avatar className="h-16 w-16 sm:h-20 sm:w-20 border-2 border-primary/30 rounded-md">
                                    <AvatarImage src={avatarSrc} alt={loggedInUserName} data-ai-hint={avatarHint}/>
                                    <AvatarFallback className="text-xl sm:text-2xl bg-muted rounded-md">{loggedInUserName?.substring(0, 1).toUpperCase() || "U"}</AvatarFallback>
                                </Avatar>
                                <Image
                                    src={qrCodeDataUri}
                                    alt="QR Code"
                                    width={60}
                                    height={60}
                                    className="object-contain rounded-sm border p-0.5 bg-white"
                                    data-ai-hint="qr code"
                                />
                            </div>
                        </div>

                        <div className="mt-auto pt-3 sm:pt-4 border-t border-border/30 flex justify-between items-center">
                             <p className="text-xs text-muted-foreground/70">Bucks Network</p>
                             <Button variant="link" size="sm" className="text-xs h-auto p-0 text-primary/80 hover:text-primary" onClick={handleEditPersonalProfile}>
                                 Update Info
                             </Button>
                        </div>
                    </div>
                </Card>
            </div>
        </ScrollArea>
    );
};

export default DigitalIdCardScreen;
