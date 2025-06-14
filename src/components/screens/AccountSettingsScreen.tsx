
"use client";

import React, { useState } from 'react'; // Added useState
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Cog6ToothIcon, BellIcon, LockClosedIcon, PaintBrushIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import { useToast } from "@/hooks/use-toast";

const AccountSettingsScreen: React.FC = () => {
  const { toast } = useToast();

  const [email, setEmail] = useState("user@example.com");
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const handleSaveChanges = () => {
    toast({
      title: "Settings Saved (Simulated)",
      description: "Your account settings have been updated.",
    });
  };

  const handleChangePassword = () => {
    toast({
      title: "Change Password (Simulated)",
      description: "Password change dialog would appear here.",
    });
  };

  return (
    <ScrollArea className="h-full bg-muted/30">
      <div className="container mx-auto max-w-3xl py-8 px-4">
        <Card className="shadow-lg">
          <CardHeader className="border-b">
            <CardTitle className="text-2xl font-headline flex items-center">
              <Cog6ToothIcon className="mr-3 h-6 w-6 text-primary" />
              Account Settings
            </CardTitle>
            <CardDescription>
              Manage your account preferences and settings.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-8">
            <section>
              <h3 className="text-lg font-semibold text-foreground mb-3">Profile Information</h3>
              <div className="space-y-4">
                <div className="space-y-1">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <Button variant="outline" onClick={handleChangePassword}>
                  <LockClosedIcon className="mr-2 h-4 w-4" /> Change Password
                </Button>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-foreground mb-3">Notifications</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-md bg-background">
                  <Label htmlFor="emailNotifications" className="flex items-center cursor-pointer">
                    <BellIcon className="mr-3 h-5 w-5 text-muted-foreground" />
                    Email Notifications
                  </Label>
                  <input type="checkbox" id="emailNotifications" className="form-checkbox h-5 w-5 text-primary rounded focus:ring-primary" checked={notificationsEnabled} onChange={(e) => setNotificationsEnabled(e.target.checked)} />
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-foreground mb-3">Appearance</h3>
              <div className="p-3 border rounded-md bg-background">
                <Label htmlFor="theme" className="flex items-center">
                  <PaintBrushIcon className="mr-3 h-5 w-5 text-muted-foreground" />
                  App Theme (Coming Soon)
                </Label>
                <p className="text-sm text-muted-foreground mt-1">Customize the look and feel of the app.</p>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-foreground mb-3">Privacy & Security</h3>
               <div className="p-3 border rounded-md bg-background">
                <Label htmlFor="privacy" className="flex items-center">
                  <ShieldCheckIcon className="mr-3 h-5 w-5 text-muted-foreground" />
                  Privacy Settings (Coming Soon)
                </Label>
                <p className="text-sm text-muted-foreground mt-1">Manage your data sharing and privacy options.</p>
              </div>
            </section>

            <div className="pt-6 border-t flex justify-end">
              <Button onClick={handleSaveChanges}>Save Changes</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </ScrollArea>
  );
};

export default AccountSettingsScreen;
