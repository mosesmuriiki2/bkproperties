import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Loader2, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import api from "@/api/apiClient";
import { toast } from "sonner";

export default function VendorLogin() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Email, 2: OTP
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Request OTP
      await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      toast.success("OTP sent to your email");
      setStep(2);
    } catch (error) {
      toast.error("Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Verify OTP and login
      const response = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      if (!response.ok) {
        throw new Error("Invalid OTP");
      }

      const userData = await response.json();

      // Store tokens
      localStorage.setItem("accessToken", userData.accessToken);
      localStorage.setItem("user", JSON.stringify({
        id: userData.userId,
        email: userData.email,
        role: userData.role
      }));

      sessionStorage.setItem("mg_vendor_auth", JSON.stringify({
        email: userData.email,
        role: userData.role,
        userId: userData.userId,
        vendorId: userData.vendorId || userData.userId
      }));

      toast.success("Login successful!");
      navigate("/VendorDashboard");
    } catch (error) {
      toast.error("Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-emerald-500 flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Vendor Login</h1>
          <p className="text-gray-600">Access your property listings dashboard</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          {step === 1 ? (
            <form onSubmit={handleSendOTP} className="space-y-5">
              <div>
                <Label htmlFor="email">Email Address</Label>
                <div className="relative mt-2">
                  <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="vendor@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-6"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Sending OTP...
                  </>
                ) : (
                  "Send OTP"
                )}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOTP} className="space-y-5">
              <div>
                <Label htmlFor="otp">Enter OTP</Label>
                <p className="text-sm text-gray-500 mb-2">
                  We sent a 6-digit code to {email}
                </p>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <Input
                    id="otp"
                    type="text"
                    placeholder="000000"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="pl-10 text-center text-2xl tracking-widest"
                    maxLength={6}
                    required
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(1)}
                  className="flex-1"
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Verifying...
                    </>
                  ) : (
                    "Verify & Login"
                  )}
                </Button>
              </div>

              <button
                type="button"
                onClick={() => {
                  setStep(1);
                  handleSendOTP(new Event("submit"));
                }}
                className="w-full text-sm text-emerald-600 hover:text-emerald-700"
              >
                Resend OTP
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
