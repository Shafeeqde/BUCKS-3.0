
"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from "@/hooks/use-toast";
import { auth } from '@/lib/firebase/client';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';

interface RegistrationScreenProps {
  onSwitchToLogin: () => void;
  onRegistrationSuccess: () => void;
}

const RegistrationScreen: React.FC<RegistrationScreenProps> = ({ onSwitchToLogin, onRegistrationSuccess }) => {
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      toast({ title: "Registration Error", description: "Please fill in all fields.", variant: "destructive" });
      return;
    }
    if (password.length < 6) {
      toast({ title: "Weak Password", description: "Password must be at least 6 characters long.", variant: "destructive" });
      return;
    }
    
    setIsLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      // Update the user's profile with the name
      await updateProfile(userCredential.user, { displayName: name });
      
      toast({
        title: "Registration Successful!",
        description: "You can now log in with your new credentials.",
      });
      onRegistrationSuccess();

    } catch (err: any) {
      console.error("Firebase Registration error:", err);
      let errorMessage = "An unknown error occurred during registration.";
      switch (err.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'This email address is already in use.';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Please enter a valid email address.';
          break;
        case 'auth/weak-password':
          errorMessage = 'The password is too weak. Please use at least 6 characters.';
          break;
        default:
          errorMessage = 'Could not create account. Please check your network connection.';
      }
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
          <CardDescription>Join our community by creating an account.</CardDescription>
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
              autoComplete="name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="text-base"
              disabled={isLoading}
              autoComplete="email"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Choose a strong password (min. 6 characters)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="text-base"
              disabled={isLoading}
              autoComplete="new-password"
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
            {isLoading ? 'Registering...' : 'Create Account'}
          </Button>
          <Button variant="link" onClick={onSwitchToLogin} className="text-sm text-primary" disabled={isLoading}>
            Already have an account? Sign In
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default RegistrationScreen;
