
"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from "@/hooks/use-toast";
import type { UserDataForSideMenu } from '@/types';
import { EyeIcon, EyeSlashIcon, ClipboardDocumentIcon } from '@heroicons/react/24/outline';

interface RegistrationScreenProps {
  setActiveTab: (tab: 'login') => void; // More specific type
  onRegistrationSuccess: () => void;
}

const generatePassword = (length = 10) => {
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=";
  let retVal = "";
  for (let i = 0, n = charset.length; i < length; ++i) {
    retVal += charset.charAt(Math.floor(Math.random() * n));
  }
  return retVal;
};

const RegistrationScreen: React.FC<RegistrationScreenProps> = ({ setActiveTab, onRegistrationSuccess }) => {
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [userId, setUserId] = useState(''); // User ID / Email
  const [suggestedPassword, setSuggestedPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Auto-generate password when component mounts or when User ID field is interacted with (optional)
    // For simplicity, let's generate it once on mount, user can regenerate if needed.
    setSuggestedPassword(generatePassword());
  }, []);

  const handleRegeneratePassword = () => {
    setSuggestedPassword(generatePassword());
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({ title: "Copied!", description: "Password copied to clipboard." });
    }).catch(err => {
      toast({ title: "Copy Failed", description: "Could not copy password.", variant: "destructive" });
    });
  };

  const handleRegister = async () => {
    if (!name.trim() || !userId.trim() || !suggestedPassword) {
      toast({ title: "Registration Error", description: "Please fill in all fields and ensure a password is suggested.", variant: "destructive" });
      return;
    }
    
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, userId, password: suggestedPassword }),
      });
      const result = await response.json();

      if (response.ok && result.success) {
        onRegistrationSuccess();
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
    <div className="flex flex-col items-center justify-center min-h-full bg-background p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-primary font-headline">
            Create <span className="font-logo">bucks</span> Account
          </CardTitle>
          <CardDescription>Your credentials will be auto-suggested. Please save them securely.</CardDescription>
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
            <Label htmlFor="userId">User ID / Email</Label>
            <Input
              id="userId"
              type="text"
              placeholder="Enter your email or preferred User ID"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="text-base"
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="suggestedPassword">Suggested Password</Label>
            <div className="flex items-center space-x-2">
              <Input
                id="suggestedPassword"
                type={showPassword ? "text" : "password"}
                value={suggestedPassword}
                readOnly
                className="text-base bg-muted flex-grow"
                disabled={isLoading}
              />
              <Button type="button" variant="ghost" size="icon" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? "Hide password" : "Show password"}>
                {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
              </Button>
              <Button type="button" variant="ghost" size="icon" onClick={() => copyToClipboard(suggestedPassword)} aria-label="Copy password">
                <ClipboardDocumentIcon className="h-5 w-5" />
              </Button>
            </div>
            <Button type="button" variant="link" size="sm" className="p-0 h-auto text-xs" onClick={handleRegeneratePassword} disabled={isLoading}>
              Regenerate Password
            </Button>
            <p className="text-xs text-destructive">Please copy and save this password securely before registering.</p>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-3">
          <Button className="w-full text-lg py-6" onClick={handleRegister} disabled={isLoading || !suggestedPassword}>
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
