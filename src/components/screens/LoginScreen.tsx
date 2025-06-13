
"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

interface LoginScreenProps {
  onLogin: (role: 'rider' | 'driver') => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('testuser'); // Default for quicker testing
  const [password, setPassword] = useState('password123'); // Default for quicker testing
  const [role, setRole] = useState<'rider' | 'driver'>('rider');
  const [error, setError] = useState('');

  const handleLoginAttempt = () => {
    // Basic validation for demo purposes
    if (username.trim() === '' || password.trim() === '') {
      setError('Please enter username and password.');
      return;
    }
    // Simulate successful login
    setError('');
    onLogin(role);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-sm shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-primary font-headline">bucks</CardTitle>
          <CardDescription>Welcome back! Please login to continue.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && (
            <div className="bg-destructive/10 border border-destructive text-destructive p-3 rounded-md text-sm" role="alert">
              {error}
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="text-base"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="text-base"
            />
          </div>
           <div className="space-y-3">
            <Label>Login as</Label>
            <RadioGroup defaultValue="rider" value={role} onValueChange={(value: 'rider' | 'driver') => setRole(value)} className="flex space-x-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="rider" id="role-rider" />
                <Label htmlFor="role-rider" className="font-normal">Rider</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="driver" id="role-driver" />
                <Label htmlFor="role-driver" className="font-normal">Driver</Label>
              </div>
            </RadioGroup>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col">
          <Button className="w-full text-lg py-6" onClick={handleLoginAttempt}>
            Sign In
          </Button>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            Don&apos;t have an account? <a href="#" className="text-primary hover:underline">Sign up</a>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoginScreen;
