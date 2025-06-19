
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
  const [identifier, setIdentifier] = useState(''); // Can be email or mobile
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const handleSendOtp = async () => {
    if (!identifier.trim()) {
      toast({
        title: "Input Required",
        description: "Please enter your email or mobile number.",
        variant: "destructive",
      });
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier }),
      });
      const result = await response.json();

      if (response.ok && result.success) {
        toast({
          title: "OTP Sent (Simulated)",
          description: result.message || `An OTP has been "sent" to ${identifier}. Check server console.`,
        });
        setOtpSent(true);
      } else {
        toast({
          title: "Failed to Send OTP",
          description: result.message || "An error occurred while sending OTP.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Send OTP error:", error);
      toast({
        title: "Network Error",
        description: error instanceof Error ? error.message : "Could not connect to the server.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtpAndLogin = async () => {
    if (!otp.trim()) {
      toast({
        title: "OTP Required",
        description: "Please enter the OTP you received.",
        variant: "destructive",
      });
      return;
    }
    setIsVerifying(true);
    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, otp }),
      });
      const result = await response.json();

      if (response.ok && result.success) {
        onLoginSuccess(result.user);
        // Success toast is handled by onLoginSuccess in page.tsx
      } else {
        toast({
          title: "Login Failed",
          description: result.message || "Invalid OTP or an error occurred.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Verify OTP error:", error);
      toast({
        title: "Network Error",
        description: error instanceof Error ? error.message : "Could not connect to the server.",
        variant: "destructive",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleChangeIdentifier = () => {
    setOtpSent(false);
    setOtp('');
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-sm shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-primary font-headline">Locality Hub</CardTitle>
          <CardDescription>
            {otpSent ? "Enter OTP to login." : "Login or Sign Up with Email/Mobile."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {!otpSent ? (
            <div className="space-y-2">
              <Label htmlFor="identifier">Email or Mobile Number</Label>
              <Input
                id="identifier"
                type="text"
                placeholder="Enter email or mobile"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="text-base"
                disabled={isLoading}
              />
            </div>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="otp">One-Time Password (OTP)</Label>
              <Input
                id="otp"
                type="text"
                inputMode="numeric"
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength={6}
                className="text-base tracking-widest text-center"
                disabled={isVerifying}
              />
               <Button variant="link" size="sm" onClick={handleChangeIdentifier} className="p-0 h-auto text-xs">
                Change Email/Mobile
              </Button>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col">
          {!otpSent ? (
            <Button className="w-full text-lg py-6" onClick={handleSendOtp} disabled={isLoading}>
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
              {isLoading ? 'Sending OTP...' : 'Send OTP'}
            </Button>
          ) : (
            <Button className="w-full text-lg py-6" onClick={handleVerifyOtpAndLogin} disabled={isVerifying}>
              {isVerifying && (
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
              {isVerifying ? 'Verifying...' : 'Verify OTP & Login'}
            </Button>
          )}
          {!otpSent && (
            <p className="mt-4 text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{' '}
              <Button variant="link" className="p-0 h-auto text-sm text-primary" onClick={() => setActiveTab('registration')} disabled={isLoading}>
                Sign up
              </Button>
            </p>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoginScreen;
