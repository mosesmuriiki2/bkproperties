import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Headphones, Eye, EyeOff, Lock, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Demo: credentials set by admin; first login forces reset
const DEMO = { email: "support@bkproperties.com", tempPassword: "Temp@1234" };

export default function SupportLogin() {
  const navigate = useNavigate();
  const [step, setStep] = useState("login"); // login | otp | reset
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    setError("");
    if (!email || !password) { setError("Please enter your email and password."); return; }
    // Validate credentials
    if (email !== DEMO.email && email !== "support") {
      setError("Invalid credentials. Demo: support@bkproperties.com / Temp@1234");
      return;
    }
    // Move to OTP
    setStep("otp");
  };

  const handleOtp = () => {
    setError("");
    if (otp.length !== 6) { setError("Enter the 6-digit OTP."); return; }
    // Check if first login (temp password)
    if (password === DEMO.tempPassword || password === "Temp@1234") {
      setStep("reset");
    } else {
      sessionStorage.setItem("mg_support_auth", "true");
      navigate("/SupportPortal");
    }
  };

  const handleReset = () => {
    setError("");
    if (!newPassword || newPassword !== confirmPassword) {
      setError("Passwords must match and not be empty.");
      return;
    }
    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    sessionStorage.setItem("mg_support_auth", "true");
    navigate("/SupportPortal");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-950 to-gray-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to={createPageUrl("Home")} className="inline-flex items-center gap-2 text-white/60 hover:text-white text-sm mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to BK Properties
          </Link>
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg">
              <Headphones className="w-6 h-6 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white">Marketa<span className="text-blue-400">Global</span></h1>
          <p className="text-gray-400 text-sm mt-1">Support Portal</p>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-8">
          {step === "login" && (
            <>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                  <Headphones className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Support Sign In</h2>
                  <p className="text-xs text-gray-500">Credentials assigned by your administrator</p>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 mb-5 text-xs text-blue-700">
                🔐 Access is restricted to support staff. Your credentials were created by your administrator.
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1.5 block">Email Address</label>
                  <Input type="email" placeholder="support@bkproperties.com" value={email} onChange={e => setEmail(e.target.value)} className="h-11" onKeyDown={e => e.key === "Enter" && handleLogin()} />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1.5 block">Password</label>
                  <div className="relative">
                    <Input type={showPass ? "text" : "password"} placeholder="Enter your password" value={password} onChange={e => setPassword(e.target.value)} className="h-11 pr-10" onKeyDown={e => e.key === "Enter" && handleLogin()} />
                    <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white h-11 text-base font-semibold" onClick={handleLogin}>
                  Continue to OTP Verification
                </Button>
              </div>
              <p className="text-xs text-gray-400 text-center mt-5">Demo: <strong>support@bkproperties.com</strong> / <strong>Temp@1234</strong></p>
            </>
          )}

          {step === "otp" && (
            <>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                  <Lock className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">OTP Verification</h2>
                  <p className="text-xs text-gray-500">Enter the code sent to your email/phone</p>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 mb-5 text-xs text-blue-700">
                📧 A 6-digit OTP has been sent to your registered contact.
              </div>

              <div className="flex gap-2 justify-center mb-4">
                {[0,1,2,3,4,5].map(i => (
                  <div key={i} className={`w-10 h-12 border-2 rounded-lg flex items-center justify-center text-lg font-bold transition-colors ${otp[i] ? "border-blue-500 bg-blue-50 text-blue-700" : "border-gray-200 bg-gray-50"}`}>
                    {otp[i] ? "●" : ""}
                  </div>
                ))}
              </div>

              <Input
                type="text" maxLength={6} placeholder="Enter 6-digit OTP"
                className="h-11 text-center text-lg font-bold tracking-widest mb-4"
                value={otp}
                onChange={e => { setOtp(e.target.value.replace(/\D/g, "")); setError(""); }}
                onKeyDown={e => e.key === "Enter" && handleOtp()}
              />
              {error && <p className="text-red-500 text-sm mb-3 text-center">{error}</p>}
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white h-11 font-semibold" onClick={handleOtp}>
                Verify & Continue
              </Button>
              <button onClick={() => { setStep("login"); setOtp(""); setError(""); }} className="w-full text-center text-xs text-gray-400 hover:text-gray-600 mt-4">
                ← Back to login
              </button>
              <p className="text-xs text-gray-400 text-center mt-2">Demo: enter any 6 digits</p>
            </>
          )}

          {step === "reset" && (
            <>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">
                  <Lock className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Set New Password</h2>
                  <p className="text-xs text-gray-500">Your temporary password must be changed</p>
                </div>
              </div>
              <div className="bg-orange-50 border border-orange-200 rounded-xl p-3 mb-5 text-xs text-orange-700">
                🔐 You are using a <strong>temporary password</strong>. Please create a new secure password.
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1.5 block">New Password</label>
                  <Input type="password" placeholder="Minimum 8 characters" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="h-11" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1.5 block">Confirm Password</label>
                  <Input type="password" placeholder="Confirm new password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="h-11" />
                </div>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white h-11 font-semibold" onClick={handleReset}>
                  Set Password & Access Portal
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}