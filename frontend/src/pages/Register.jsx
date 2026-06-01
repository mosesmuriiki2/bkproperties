import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, User, Phone, Building2, Eye, EyeOff, Loader, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import api from "@/api/apiClient";

export default function Register() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Role selection, 2: Personal info, 3: Vendor info (if vendor)
  const [role, setRole] = useState(""); // CONSUMER, VENDOR
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    phone: "",
    businessName: "",
    businessEmail: "",
    businessPhone: "",
    businessAddress: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateStep = () => {
    if (step === 1) {
      if (!role) {
        setError("Please select a role");
        return false;
      }
    } else if (step === 2) {
      if (!formData.email || !formData.password || !formData.confirmPassword) {
        setError("Please fill in all fields");
        return false;
      }
      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match");
        return false;
      }
      if (formData.password.length < 8) {
        setError("Password must be at least 8 characters");
        return false;
      }
      if (!formData.firstName || !formData.lastName || !formData.phone) {
        setError("Please fill in all personal information");
        return false;
      }
    } else if (step === 3 && role === "VENDOR") {
      if (!formData.businessName || !formData.businessEmail || !formData.businessPhone || !formData.businessAddress) {
        setError("Please fill in all business information");
        return false;
      }
    }
    setError("");
    return true;
  };

  const handleNext = () => {
    if (validateStep()) {
      if (step === 2 && role === "VENDOR") {
        setStep(3);
      } else {
        handleRegister();
      }
    }
  };

  const handleRegister = async () => {
    if (!validateStep()) return;

    try {
      setLoading(true);
      const response = await api.auth.register({
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        role: role === "VENDOR" ? "VENDOR" : "CONSUMER",
        businessName: formData.businessName,
        businessEmail: formData.businessEmail,
        businessPhone: formData.businessPhone,
        businessAddress: formData.businessAddress,
      });

      // Store user info
      localStorage.setItem("user", JSON.stringify({
        id: response.userId,
        email: response.email,
        firstName: response.firstName,
        lastName: response.lastName,
        role: response.role
      }));

      // Redirect based on role
      if (role === "VENDOR") {
        navigate("/VendorDashboard");
      } else {
        navigate("/");
      }
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-4xl font-bold text-blue-600 mb-2">BK Properties</div>
          <p className="text-gray-600">Create your account</p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8 flex gap-2">
          {[1, 2, ...(role === "VENDOR" ? [3] : [])].map((s) => (
            <div
              key={s}
              className={`flex-1 h-2 rounded-full transition-colors ${
                s <= step ? "bg-blue-600" : "bg-gray-200"
              }`}
            />
          ))}
        </div>

        {/* Registration Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Step 1: Role Selection */}
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-gray-900 mb-6">What type of account do you need?</h2>

              <button
                onClick={() => {
                  setRole("CONSUMER");
                  setStep(2);
                }}
                className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                  role === "CONSUMER"
                    ? "border-blue-600 bg-blue-50"
                    : "border-gray-200 hover:border-blue-300"
                }`}
              >
                <div className="flex items-start gap-3">
                  <User className="w-6 h-6 text-blue-600 mt-1" />
                  <div>
                    <p className="font-semibold text-gray-900">Consumer Account</p>
                    <p className="text-sm text-gray-600">Browse and book hotels, tours, properties, and products</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => {
                  setRole("VENDOR");
                  setStep(2);
                }}
                className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                  role === "VENDOR"
                    ? "border-blue-600 bg-blue-50"
                    : "border-gray-200 hover:border-blue-300"
                }`}
              >
                <div className="flex items-start gap-3">
                  <Building2 className="w-6 h-6 text-blue-600 mt-1" />
                  <div>
                    <p className="font-semibold text-gray-900">Vendor Account</p>
                    <p className="text-sm text-gray-600">Manage your business and list products/services</p>
                  </div>
                </div>
              </button>
            </div>
          )}

          {/* Step 2: Personal Information */}
          {step === 2 && (
            <form className="space-y-4">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Personal Information</h2>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <Input
                      type="text"
                      name="firstName"
                      placeholder="John"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="pl-10"
                      disabled={loading}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                  <Input
                    type="text"
                    name="lastName"
                    placeholder="Doe"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    disabled={loading}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <Input
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="pl-10"
                    disabled={loading}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <Input
                    type="tel"
                    name="phone"
                    placeholder="+254712345678"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="pl-10"
                    disabled={loading}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="pl-10 pr-10"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                    disabled={loading}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="pl-10 pr-10"
                    disabled={loading}
                  />
                </div>
              </div>

              <Button
                type="button"
                onClick={handleNext}
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-medium flex items-center justify-center gap-2 mt-6"
              >
                {role === "VENDOR" ? "Next" : "Create Account"}
                {role === "VENDOR" && <ChevronRight className="w-4 h-4" />}
              </Button>
            </form>
          )}

          {/* Step 3: Business Information (Vendor Only) */}
          {step === 3 && role === "VENDOR" && (
            <form className="space-y-4">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Business Information</h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Business Name</label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <Input
                    type="text"
                    name="businessName"
                    placeholder="Your Business Name"
                    value={formData.businessName}
                    onChange={handleInputChange}
                    className="pl-10"
                    disabled={loading}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Business Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <Input
                    type="email"
                    name="businessEmail"
                    placeholder="business@example.com"
                    value={formData.businessEmail}
                    onChange={handleInputChange}
                    className="pl-10"
                    disabled={loading}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Business Phone</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <Input
                    type="tel"
                    name="businessPhone"
                    placeholder="+254712345678"
                    value={formData.businessPhone}
                    onChange={handleInputChange}
                    className="pl-10"
                    disabled={loading}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Business Address</label>
                <Input
                  type="text"
                  name="businessAddress"
                  placeholder="123 Business Street, City"
                  value={formData.businessAddress}
                  onChange={handleInputChange}
                  disabled={loading}
                />
              </div>

              <div className="flex gap-3 mt-6">
                <Button
                  type="button"
                  onClick={() => setStep(2)}
                  disabled={loading}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900 py-2.5 rounded-lg font-medium"
                >
                  Back
                </Button>
                <Button
                  type="button"
                  onClick={handleRegister}
                  disabled={loading}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-medium flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </div>
            </form>
          )}

          {/* Sign In Link */}
          {step === 1 && (
            <p className="text-center text-gray-600 mt-6">
              Already have an account?{" "}
              <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                Sign in
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
