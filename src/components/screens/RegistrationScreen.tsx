
"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from "@/hooks/use-toast";
import type { TabName } from '@/types'; // Assuming TabName is defined in types

interface RegistrationScreenProps {
  setActiveTab: (tab: TabName) => void;
  onRegistrationSuccess: (user: any) => void; // User data can be any for now
}

const RegistrationScreen: React.FC<RegistrationScreenProps> = ({ setActiveTab, onRegistrationSuccess }) => {
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleRegister = async () => {
    setError(''); // Clear previous errors

    if (!name.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      setError('Please fill in all fields.');
      toast({ title: "Registration Error", description: "Please fill in all fields.", variant: "destructive" });
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      toast({ title: "Registration Error", description: "Passwords do not match.", variant: "destructive" });
      return;
    }

    // Simulate API call for registration
    try {
      // In a real app, you would make an API call here:
      // const response = await fetch('/api/register', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ name, email, password }),
      // });
      // const data = await response.json();
      // if (!response.ok) throw new Error(data.message || 'Registration failed');

      // Simulate success
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
      const simulatedUser = { id: Date.now().toString(), name, email };

      toast({
        title: "Registration Successful!",
        description: `Welcome, ${name}! Please log in.`,
      });
      onRegistrationSuccess(simulatedUser); // Notify parent about successful registration
      // Optionally, navigate to login or auto-login (handled by onRegistrationSuccess in page.tsx)

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
      setError(errorMessage);
      toast({ title: "Registration Failed", description: errorMessage, variant: "destructive" });
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
          {error && (
            <div className="bg-destructive/10 border border-destructive text-destructive p-3 rounded-md text-sm" role="alert">
              {error}
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="text-base"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="text-base"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Choose a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="text-base"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="text-base"
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-3">
          <Button className="w-full text-lg py-6" onClick={handleRegister}>
            Register
          </Button>
          <Button variant="link" onClick={() => setActiveTab('login')} className="text-sm text-primary">
            Already have an account? Sign In
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default RegistrationScreen;
