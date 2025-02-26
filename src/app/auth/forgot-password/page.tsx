"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // First step: send OTP
  const handleSendOtp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "An error occurred");
        return;
      }
      setOtpSent(true);
      setMessage("OTP sent to your email. Please check your inbox.");
    } catch (err: any) {
      setError(err.message);
    }
  };

  // Second step: verify OTP and reset password
  const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "An error occurred");
        return;
      }
      setMessage("Password updated successfully. Redirecting to login...");
      setTimeout(() => router.push("/auth/login"), 2000);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md p-4">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">Forgot Password</CardTitle>
        </CardHeader>
        <CardContent>
          {message && <p className="mb-4 text-sm text-green-500">{message}</p>}
          {error && <p className="mb-4 text-sm text-red-500">{error}</p>}
          <form onSubmit={otpSent ? handleResetPassword : handleSendOtp}>
            <div className="mb-4">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1"
                disabled={otpSent}
              />
            </div>
            {otpSent && (
              <>
                <div className="mb-4">
                  <Label htmlFor="otp">OTP</Label>
                  <Input
                    id="otp"
                    type="text"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                    className="mt-1"
                  />
                </div>
                <div className="mb-4">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    className="mt-1"
                  />
                </div>
              </>
            )}
            <Button type="submit" className="w-full">
              {otpSent ? "Reset Password" : "Send OTP"}
            </Button>
          </form>
        </CardContent>
        <CardFooter>
          <a href="/auth/login" className="text-sm text-blue-500 hover:underline">
            Back to Login
          </a>
        </CardFooter>
      </Card>
    </div>
  );
}
