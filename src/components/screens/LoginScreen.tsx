
"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import type { TabName, UserDataForSideMenu } from '@/types';
import { useToast } from "@/hooks/use-toast";

interface LoginScreenProps {
  setActiveTab: (tab: TabName) => void;
  onLoginSuccess: (user: UserDataForSideMenu) => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ setActiveTab, onLoginSuccess }) => {
  const { toast } = useToast();
  const [userId, setUserId] = useState(''); // Can be email or custom user ID
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!userId.trim() || !password.trim()) {
      toast({
        title: "Input Required",
        description: "Please enter your User ID and Password.",
        variant: "destructive",
      });
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, password }), // Changed from 'email' to 'userId'
      });
      const result = await response.json();

      if (response.ok && result.success) {
        // Pass the email from result.user as the identifier to onLoginSuccess
        onLoginSuccess({ id: result.user.id, name: result.user.name, email: result.user.email });
      } else {
        toast({
          title: "Login Failed",
          description: result.message || "Invalid User ID or Password.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Network Error",
        description: error instanceof Error ? error.message : "Could not connect to the server.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-sm shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-primary font-headline">Bucks</CardTitle>
          <CardDescription>
            Welcome back! Please login to continue.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="userId">User ID / Email</Label>
            <Input
              id="userId"
              type="text"
              placeholder="Enter your User ID or Email"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="text-base"
              disabled={isLoading}
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
              disabled={isLoading}
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col">
          <Button className="w-full text-lg py-6" onClick={handleLogin} disabled={isLoading}>
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
            {isLoading ? 'Logging in...' : 'Login'}
          </Button>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{' '}
            <Button variant="link" className="p-0 h-auto text-sm text-primary" onClick={() => setActiveTab('registration')} disabled={isLoading}>
              Sign up
            </Button>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoginScreen;
