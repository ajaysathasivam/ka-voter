"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import apiCall from "@/api/apiCall"; // make sure you exported it as named export
import { API_URL } from "@/lib/common";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const [step, setStep] = useState<"login" | "otp">("login");
    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");
    const [otp, setOtp] = useState("");

    const router = useRouter()

    const handleLoginSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const loginData = {
            username: identifier,
            password,
        };

        console.log(loginData, "loginData")
        try {
            const res = await apiCall({
                url: `${API_URL}/api/admin/login`,
                method: "POST",
                body: loginData,
            });

            // Example: check API response
            if (res.success) {
                toast("OTP sent successfully");
                cookieStore.set('username', identifier)
                setStep("otp");139958
            } else {
                toast.error(res.message || "Login failed");
            }
        } catch (err: any) {
            toast.error(err.message || "Login error");
        }
    };

    const handleOtpSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const res = await apiCall({
                url: `${API_URL}/api/admin/verify-otp`,
                method: "POST",
                body: { username: identifier, otp },
            });

            if (res.success) {
                toast.success("OTP Verified");
                cookieStore.set('token', res.token)
                router.push('/dashboard')
                console.log("Login successful!");
            } else {
                toast.error(res.message || "Invalid OTP");
            }
        } catch (err: any) {
            toast.error(err.message || "OTP verification error");
        }
    };

    return (
        <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
            {/* Left Section - Branding */}
            <div className="hidden md:flex items-center justify-center bg-gradient-to-br from-[#ffe3c7] to-[#c6b6e7] p-8">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-gray-800 mb-4">
                        Welcome to SecureVote
                    </h1>
                    <p className="text-gray-700 text-lg leading-relaxed">
                        Vote comfortably from anywhere. <br />
                        Secure. Simple. Verified.
                    </p>
                </div>
            </div>

            {/* Right Section - Form */}
            <div className="flex items-center justify-center p-6 bg-white">
                <div className="w-full max-w-md space-y-6">
                    {step === "login" && (
                        <>
                            <div className="text-center">
                                <h2 className="text-2xl font-bold text-gray-800">
                                    Sign in to your account
                                </h2>
                                <p className="text-sm text-gray-500 mt-1">
                                    Use your email or phone number to login
                                </p>
                            </div>

                            <form onSubmit={handleLoginSubmit} className="space-y-4">
                                <div>
                                    <Label htmlFor="identifier" className="text-sm">
                                        Email or Phone
                                    </Label>
                                    <Input
                                        id="identifier"
                                        type="text"
                                        placeholder="you@example.com or +123456789"
                                        value={identifier}
                                        onChange={(e) => setIdentifier(e.target.value)}
                                        required
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="password" className="text-sm">
                                        Password
                                    </Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full bg-[#9e7b7f] hover:bg-[#8b6b6f] text-white"
                                >
                                    Send OTP
                                </Button>
                            </form>
                        </>
                    )}

                    {step === "otp" && (
                        <>
                            <div className="text-center">
                                <h2 className="text-2xl font-bold text-gray-800">
                                    Enter OTP
                                </h2>
                                <p className="text-sm text-gray-500 mt-1">
                                    Please enter the OTP sent to your number or email.
                                </p>
                            </div>

                            <form onSubmit={handleOtpSubmit} className="space-y-4">
                                <div>
                                    <Label htmlFor="otp" className="text-sm">
                                        OTP Code
                                    </Label>
                                    <Input
                                        id="otp"
                                        type="text"
                                        placeholder="Enter OTP"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        required
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full bg-[#9e7b7f] hover:bg-[#8b6b6f] text-white"
                                >
                                    Verify OTP
                                </Button>
                            </form>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
