"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from "@/hooks/use-toast";

interface RegistrationScreenProps {
  onSwitchToLogin: () => void;
  onRegistrationSuccess: () => void;
}

const RegistrationScreen: React.FC<RegistrationScreenProps> = ({ onSwitchToLogin, onRegistrationSuccess }) => {
  const { toast } = useToast();
  // Remove all Firebase logic, keep state for UI only
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    toast({ title: "Registration Disabled", description: "Registration is disabled in demo mode. Please use the admin login.", variant: "destructive" });
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Register</CardTitle>
          <CardDescription>Registration is disabled in demo mode. Please use the admin login.</CardDescription>
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
              disabled
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
              disabled
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
              disabled
              autoComplete="new-password"
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-3">
          <Button className="w-full text-lg py-6" disabled>
            Registration Disabled
          </Button>
          <Button variant="link" onClick={onSwitchToLogin} className="text-sm text-primary">
            Already have an account? Sign In
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default RegistrationScreen;
