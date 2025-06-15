
"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import Image from 'next/image';
import { useToast } from "@/hooks/use-toast";
import type { TabName, UserDataForSideMenu } from '@/types';
import { UserCircleIcon, PencilSquareIcon, CheckBadgeIcon, QrCodeIcon as QrCodeHeroIcon } from '@heroicons/react/24/outline'; // Added QrCodeHeroIcon as a fallback
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
    const userUUID = userData.id || 'N/A';
    const formattedUUID = userUUID.substring(0, 12).replace(/(.{4})/g, '$1 ').trim();

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

    // Placeholders for data not in UserDataForSideMenu
    const dateOfBirth = "01 / Jan / 1990";
    const gender = "User Defined";

    const handleEditPersonalProfile = () => {
        setActiveTab('account-settings');
        toast({ title: "Edit Display Info", description: "Opening settings to edit your ID card display name, avatar, etc." });
    };

    return (
        <ScrollArea className="h-full bg-gradient-to-br from-muted/10 via-background to-background p-2 sm:p-4">
            <div className="flex justify-center items-center min-h-full py-4">
                <Card className="w-full max-w-sm sm:max-w-md shadow-2xl rounded-xl overflow-hidden bg-card border-primary/20 aspect-[2/3] flex flex-col">
                    <CardHeader className="p-4 border-b border-border/50">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <UserCircleIcon className="h-7 w-7 text-primary" />
                                <CardTitle className="text-xl font-bold font-headline text-primary">Bucks Digital ID</CardTitle>
                            </div>
                             {/* Small logo/emblem placeholder on the right */}
                             <div className="h-7 w-7 bg-muted rounded-full flex items-center justify-center">
                                <CheckBadgeIcon className="h-4 w-4 text-primary"/>
                             </div>
                        </div>
                    </CardHeader>

                    <CardContent className="p-4 flex-grow space-y-4 flex flex-col">
                        <div className="flex-grow grid grid-cols-3 gap-4">
                            {/* Left Info Column (2/3 width) */}
                            <div className="col-span-2 space-y-3">
                                <div>
                                    <p className="text-xs text-muted-foreground">BUCKS ID NUMBER</p>
                                    <p className="text-xl sm:text-2xl font-bold text-foreground tracking-wider">{formattedUUID}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                                    <div>
                                        <p className="text-xs text-muted-foreground">FULL NAME</p>
                                        <p className="text-sm font-semibold text-foreground truncate" title={loggedInUserName}>{loggedInUserName}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground">DATE OF BIRTH</p>
                                        <p className="text-sm font-semibold text-foreground">{dateOfBirth}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground">GENDER</p>
                                        <p className="text-sm font-semibold text-foreground">{gender}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Right Avatar/QR Column (1/3 width) */}
                            <div className="col-span-1 flex flex-col items-center space-y-2">
                                <Avatar className="w-full aspect-square border-2 border-primary/30 rounded-md">
                                    <AvatarImage src={userData.avatarUrl || 'https://source.unsplash.com/random/120x120/?person,portrait'} alt={loggedInUserName} data-ai-hint={userData.avatarAiHint || "user portrait"}/>
                                    <AvatarFallback className="text-2xl bg-muted rounded-md">{loggedInUserName?.substring(0, 1).toUpperCase() || "U"}</AvatarFallback>
                                </Avatar>
                                <div className="w-full aspect-square bg-muted/50 rounded-md flex items-center justify-center p-1">
                                    <Image
                                        src={`https://placehold.co/100x100.png?text=QR`}
                                        alt="QR Code Placeholder"
                                        width={100}
                                        height={100}
                                        className="object-contain rounded-sm"
                                        data-ai-hint="qr code"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Bottom Info and Signature */}
                        <div className="border-t border-border/50 pt-3 space-y-2">
                            <div className="flex justify-between items-center text-xs">
                                <div>
                                    <p className="text-muted-foreground">VALID FROM</p>
                                    <p className="font-medium text-foreground">{format(validFromDate, 'dd/MM/yyyy')}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-muted-foreground">VALID THROUGH</p>
                                    <p className="font-medium text-foreground">{format(validThroughDate, 'dd/MM/yyyy')}</p>
                                </div>
                            </div>
                            <div className="mt-2">
                                <p className="text-xs text-muted-foreground">SIGNATURE</p>
                                <div className="h-10 bg-muted/30 rounded-md flex items-center justify-center italic text-sm text-muted-foreground">
                                    {loggedInUserName}
                                </div>
                            </div>
                        </div>
                    </CardContent>

                    <CardFooter className="p-4 border-t border-border/50 bg-muted/20">
                        <Button variant="outline" className="w-full text-sm" onClick={handleEditPersonalProfile}>
                            <PencilSquareIcon className="mr-2 h-4 w-4" /> Edit Display Information
                        </Button>
                    </CardFooter>
                    <div className="py-2 text-center text-xs text-muted-foreground bg-muted/10">
                        <CheckBadgeIcon className="inline h-3 w-3 mr-1 text-green-600"/> Verified Bucks Member
                    </div>
                </Card>
            </div>
        </ScrollArea>
    );
};

export default DigitalIdCardScreen;

    