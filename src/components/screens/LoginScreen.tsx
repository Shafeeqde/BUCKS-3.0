
"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import type { TabName } from '@/types'; // Assuming TabName is defined in types

interface LoginScreenProps {
  setActiveTab: (tab: TabName) => void;
  onLoginSuccess: (user: any) => void; // Expects user data
}

const LoginScreen: React.FC<LoginScreenProps> = ({ setActiveTab, onLoginSuccess }) => {
  const [username, setUsername] = useState('testuser'); // Default for quicker testing
  const [password, setPassword] = useState('password123'); // Default for quicker testing
  const [error, setError] = useState('');

  const handleLoginAttempt = () => {
    if (username.trim() === '' || password.trim() === '') {
      setError('Please enter username and password.');
      return;
    }
    setError('');
    // Simulate login success and create a user object
    const simulatedUser = { 
      name: username, 
      email: `${username}@example.com` 
      // Add any other relevant user data you expect in onLoginSuccess
    };
    onLoginSuccess(simulatedUser); 
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
              autoComplete="username"
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
              autoComplete="current-password"
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col">
          <Button className="w-full text-lg py-6" onClick={handleLoginAttempt}>
            Sign In
          </Button>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{' '}
            <Button variant="link" className="p-0 h-auto text-sm text-primary" onClick={() => setActiveTab('registration')}>
              Sign up
            </Button>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoginScreen;
