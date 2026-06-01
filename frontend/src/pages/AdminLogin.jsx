import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Shield, Eye, EyeOff, Globe, Lock, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Demo credentials
const DEMO = { username: "admin", password: "Admin@1234" };

export default function AdminLogin() {
  const navigate = useNavigate();
  const [step, setStep] = useState("login"); // login | otp
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    setError("");
    if (!username || !password) { setError("Please enter username and password."); return; }
    if (username !== DEMO.username || password !== DEMO.password) {
      setError("Invalid credentials. Demo: admin / Admin@1234");
      return;
    }
    // Proceed to OTP
    setStep("otp");
  };

  const handleOtp = () => {
    setError("");
    if (otp.length !== 6) { setError("Enter the 6-digit OTP sent to your email/phone."); return; }
    // Mark admin session
    sessionStorage.setItem("mg_admin_auth", "true");
    navigate("/AdminDashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-950 to-gray-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to={createPageUrl("Home")} className="inline-flex items-center gap-2 text-white/60 hover:text-white text-sm mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to BK Properties
          </Link>
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-2xl bg-red-600 flex items-center justify-center shadow-lg">
              <Shield className="w-6 h-6 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white">Marketa<span className="text-red-400">Global</span></h1>
          <p className="text-gray-400 text-sm mt-1">Admin Portal</p>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-8">
          {step === "login" && (
            <>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Admin Sign In</h2>
                  <p className="text-xs text-gray-500">Restricted — authorized personnel only</p>
                </div>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-5 text-xs text-red-700">
                🔐 This area is restricted to authorized administrators only. All access is logged and audited.
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1.5 block">Username</label>
                  <Input
                    placeholder="admin"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    className="h-11"
                    onKeyDown={e => e.key === "Enter" && handleLogin()}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1.5 block">Password</label>
                  <div className="relative">
                    <Input
                      type={showPass ? "text" : "password"}
                      placeholder="Enter admin password"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      className="h-11 pr-10"
                      onKeyDown={e => e.key === "Enter" && handleLogin()}
                    />
                    <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <Button className="w-full bg-red-600 hover:bg-red-700 text-white h-11 text-base font-semibold" onClick={handleLogin}>
                  Continue to OTP Verification
                </Button>
              </div>

              <p className="text-xs text-gray-400 text-center mt-5">Demo: <strong>admin</strong> / <strong>Admin@1234</strong></p>
            </>
          )}

          {step === "otp" && (
            <>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
                  <Lock className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">OTP Verification</h2>
                  <p className="text-xs text-gray-500">Enter the code sent to your email/phone</p>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 mb-5 text-xs text-blue-700">
                📧 A 6-digit OTP has been sent to your registered email and phone number.
              </div>

              {/* OTP boxes */}
              <div className="flex gap-2 justify-center mb-4">
                {[0,1,2,3,4,5].map(i => (
                  <div key={i} className={`w-10 h-12 border-2 rounded-lg flex items-center justify-center text-lg font-bold transition-colors ${otp[i] ? "border-red-500 bg-red-50 text-red-700" : "border-gray-200 bg-gray-50"}`}>
                    {otp[i] ? "●" : ""}
                  </div>
                ))}
              </div>

              <Input
                type="text"
                maxLength={6}
                placeholder="Enter 6-digit OTP"
                className="h-11 text-center text-lg font-bold tracking-widest mb-4"
                value={otp}
                onChange={e => { setOtp(e.target.value.replace(/\D/g, "")); setError(""); }}
                onKeyDown={e => e.key === "Enter" && handleOtp()}
              />
              {error && <p className="text-red-500 text-sm mb-3 text-center">{error}</p>}

              <Button className="w-full bg-red-600 hover:bg-red-700 text-white h-11 font-semibold" onClick={handleOtp}>
                Verify & Access Admin Portal
              </Button>

              <button onClick={() => { setStep("login"); setOtp(""); setError(""); }} className="w-full text-center text-xs text-gray-400 hover:text-gray-600 mt-4">
                ← Back to login
              </button>
              <p className="text-xs text-gray-400 text-center mt-2">Demo: enter any 6 digits</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}