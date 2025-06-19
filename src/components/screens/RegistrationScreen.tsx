
"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from "@/hooks/use-toast";
import type { TabName, UserDataForSideMenu } from '@/types';

interface RegistrationScreenProps {
  setActiveTab: (tab: TabName) => void;
  onRegistrationSuccess: (user: Pick<UserDataForSideMenu, 'name' | 'email'>) => void; // email can be identifier
}

const RegistrationScreen: React.FC<RegistrationScreenProps> = ({ setActiveTab, onRegistrationSuccess }) => {
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [identifier, setIdentifier] = useState(''); // For email or mobile
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    if (!name.trim() || !identifier.trim()) {
      toast({ title: "Registration Error", description: "Please fill in all fields.", variant: "destructive" });
      return;
    }
    
    // Basic validation for email or mobile (can be improved)
    const isEmail = identifier.includes('@');
    const isMobile = /^\+?[0-9\s-]{10,15}$/.test(identifier);

    if (!isEmail && !isMobile) {
      toast({ title: "Invalid Input", description: "Please enter a valid email or mobile number.", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    try {
      // The API will determine if it's an email or mobile.
      // For this prototype, 'email' field in API request will hold the identifier.
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, emailOrMobile: identifier }), // Sending identifier
      });
      const result = await response.json();

      if (response.ok && result.success) {
        toast({
          title: "Registration Successful!",
          description: `Welcome, ${result.user.name}! You can now log in with an OTP.`,
        });
        onRegistrationSuccess({ name: result.user.name, email: result.user.email }); // email here represents the identifier
      } else {
        toast({
          title: "Registration Failed",
          description: result.message || "An error occurred.",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error("Registration error:", err);
      const errorMessage = err instanceof Error ? err.message : "Could not connect to the server.";
      toast({ title: "Registration Failed", description: errorMessage, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-primary font-headline">Create Account</CardTitle>
          <CardDescription>Join Locality Hub today!</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="text-base"
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="identifier">Email or Mobile Number</Label>
            <Input
              id="identifier"
              type="text"
              placeholder="Enter your email or mobile"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="text-base"
              disabled={isLoading}
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-3">
          <Button className="w-full text-lg py-6" onClick={handleRegister} disabled={isLoading}>
            {isLoading && (
              <svg
                className="mr-2 h-5 w-5 animate-spin text-primary-foreground"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            {isLoading ? 'Registering...' : 'Register'}
          </Button>
          <Button variant="link" onClick={() => setActiveTab('login')} className="text-sm text-primary" disabled={isLoading}>
            Already have an account? Sign In
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default RegistrationScreen;
