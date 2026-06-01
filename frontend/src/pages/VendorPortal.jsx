import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Upload, BarChart2, CheckCircle, Zap, Globe, Shield, Home as HomeIcon, MapPin, FileText, User, Phone, Mail, Building2, File } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import api from "@/api/apiClient";
import { useToast } from "@/components/ui/use-toast";
import { KENYAN_COUNTIES, getSubCounties } from "@/data/kenyanCounties";

export default function VendorPortal() {
  const { toast } = useToast();
  const [registered, setRegistered] = useState(false);
  const [loading, setLoading] = useState(false);
  const [subCounties, setSubCounties] = useState([]);
  const [idDocument, setIdDocument] = useState(null);
  const [businessLicense, setBusinessLicense] = useState(null);
  const [form, setForm] = useState({
    // Personal Information
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    idNumber: "",
    
    // Business Information
    businessName: "",
    businessType: "individual", // individual or company
    taxNumber: "",
    licenseNumber: "",
    
    // Property Details
    propertyCategory: "", // HOUSE, LAND, BOTH
    listingType: "", // SALE, RENT, BOTH
    
    // Location
    county: "",
    subCounty: "",
    address: "",
    
    // Additional
    description: "",
    website: "",
  });

  // Update sub-counties when county changes
  useEffect(() => {
    if (form.county) {
      const subs = getSubCounties(form.county);
      setSubCounties(subs);
      // Reset sub-county if it's not in the new list
      if (form.subCounty && !subs.includes(form.subCounty)) {
        setForm(f => ({ ...f, subCounty: "" }));
      }
    } else {
      setSubCounties([]);
      setForm(f => ({ ...f, subCounty: "" }));
    }
  }, [form.county]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate required fields
      if (!form.firstName || !form.lastName || !form.email || !form.phone) {
        toast({
          title: "Missing Information",
          description: "Please fill in all required personal information fields.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      if (!form.businessName || !form.propertyCategory || !form.listingType) {
        toast({
          title: "Missing Information",
          description: "Please fill in all required business and property details.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      if (!form.county || !form.subCounty || !form.address) {
        toast({
          title: "Missing Information",
          description: "Please provide your complete location details including sub-county.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      if (!idDocument) {
        toast({
          title: "Missing Document",
          description: "Please upload a copy of your ID or Passport.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      // Step 1: Register user with VENDOR role
      const registerData = {
        email: form.email,
        password: form.idNumber, // Use ID number as temporary password
        firstName: form.firstName,
        lastName: form.lastName,
        phone: form.phone,
        role: "VENDOR",
      };

      console.log("Step 1: Creating user account...", registerData);
      const authResponse = await api.auth.register(registerData);
      console.log("User created successfully:", authResponse);

      if (!authResponse.userId) {
        throw new Error("User registration failed - no userId returned");
      }

      // Step 2: Create vendor profile with the userId
      const vendorData = {
        userId: authResponse.userId,
        businessName: form.businessName,
        businessType: form.businessType,
        taxNumber: form.taxNumber || null,
        licenseNumber: form.licenseNumber || null,
        propertyCategory: form.propertyCategory,
        listingType: form.listingType,
        email: form.email,
        phone: form.phone,
        address: form.address,
        county: form.county,
        subCounty: form.subCounty || null,
        website: form.website || null,
        description: form.description || null,
        idNumber: form.idNumber,
      };

      console.log("Step 2: Creating vendor profile...", vendorData);
      const vendorResponse = await api.vendors.register(vendorData);
      console.log("Vendor created successfully:", vendorResponse);

      setRegistered(true);
      toast({
        title: "Application Submitted!",
        description: `Your property owner application has been received. Login with email: ${form.email} and password: ${form.idNumber}`,
      });
    } catch (error) {
      console.error("Vendor registration error:", error);
      toast({
        title: "Registration Failed",
        description: error.message || "Failed to submit application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (registered) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl p-10 max-w-md w-full text-center shadow-xl border">
          <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-5">
            <CheckCircle className="w-8 h-8 text-emerald-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Application Received!</h2>
          <p className="text-gray-500 mb-5">
            Thank you for applying to list your property. Our team will review your application and you will receive an email with your login credentials <strong>within 24 hours</strong> upon approval.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-700 text-left mb-6">
            <p className="font-semibold mb-2">What happens next:</p>
            <ul className="space-y-1">
              <li>✅ Team reviews your application</li>
              <li>✅ Verification of provided documents</li>
              <li>✅ Upon approval, email with login link sent</li>
              <li>✅ Log in and start listing your properties</li>
            </ul>
          </div>
          <Link to={createPageUrl("Home")}>
            <Button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white">Back to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-br from-gray-900 to-emerald-900 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <Badge className="mb-5 bg-emerald-500/20 text-emerald-300 border-emerald-500/30">
            <HomeIcon className="w-3 h-3 mr-1" /> Property Owner Portal
          </Badge>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-5">List Your Property</h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Join 850+ verified property owners. Reach thousands of buyers and renters across Kenya.
          </p>
        </div>
      </div>

      {/* Benefits */}
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            { icon: Zap, title: "Quick Listings", desc: "List your property in minutes with our simple form" },
            { icon: Globe, title: "Wide Reach", desc: "Access thousands of active property seekers daily" },
            { icon: Shield, title: "Secure Platform", desc: "Verified buyers and secure payment processing" },
          ].map(b => (
            <div key={b.title} className="bg-white rounded-xl p-6 shadow-sm border text-center">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                <b.icon className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">{b.title}</h3>
              <p className="text-gray-500 text-sm">{b.desc}</p>
            </div>
          ))}
        </div>

        {/* Registration Form */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border max-w-3xl mx-auto">
          <h3 className="text-2xl font-bold text-gray-900 mb-2 text-center">Apply to Sell / Become a Vendor</h3>
          <p className="text-gray-500 text-center mb-8">Fill in the details below to start listing your properties</p>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Personal Information */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-emerald-600" /> Personal Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input 
                    id="firstName"
                    placeholder="John" 
                    value={form.firstName} 
                    onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input 
                    id="lastName"
                    placeholder="Doe" 
                    value={form.lastName} 
                    onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input 
                    id="email"
                    type="email" 
                    placeholder="john@example.com" 
                    value={form.email} 
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input 
                    id="phone"
                    placeholder="+254 700 000 000" 
                    value={form.phone} 
                    onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="idNumber">ID/Passport Number *</Label>
                  <Input 
                    id="idNumber"
                    placeholder="12345678" 
                    value={form.idNumber} 
                    onChange={e => setForm(f => ({ ...f, idNumber: e.target.value }))}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Business Information */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-emerald-600" /> Business Information
              </h4>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="businessName">Business/Trading Name *</Label>
                  <Input 
                    id="businessName"
                    placeholder="e.g., Nairobi Properties Ltd" 
                    value={form.businessName} 
                    onChange={e => setForm(f => ({ ...f, businessName: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label>Business Type *</Label>
                  <RadioGroup value={form.businessType} onValueChange={v => setForm(f => ({ ...f, businessType: v }))}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="individual" id="individual" />
                      <Label htmlFor="individual" className="font-normal cursor-pointer">Individual Property Owner</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="company" id="company" />
                      <Label htmlFor="company" className="font-normal cursor-pointer">Registered Company/Agency</Label>
                    </div>
                  </RadioGroup>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="taxNumber">KRA PIN (Optional)</Label>
                    <Input 
                      id="taxNumber"
                      placeholder="A000000000A" 
                      value={form.taxNumber} 
                      onChange={e => setForm(f => ({ ...f, taxNumber: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="licenseNumber">Business License No. (Optional)</Label>
                    <Input 
                      id="licenseNumber"
                      placeholder="BL/2024/12345" 
                      value={form.licenseNumber} 
                      onChange={e => setForm(f => ({ ...f, licenseNumber: e.target.value }))}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Property Details */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <HomeIcon className="w-5 h-5 text-emerald-600" /> Property Details
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="propertyCategory">What will you list? *</Label>
                  <Select value={form.propertyCategory} onValueChange={v => setForm(f => ({ ...f, propertyCategory: v }))}>
                    <SelectTrigger id="propertyCategory">
                      <SelectValue placeholder="Select property type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="HOUSE">Houses/Apartments Only</SelectItem>
                      <SelectItem value="LAND">Land/Plots Only</SelectItem>
                      <SelectItem value="BOTH">Both Houses and Land</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="listingType">Listing Type *</Label>
                  <Select value={form.listingType} onValueChange={v => setForm(f => ({ ...f, listingType: v }))}>
                    <SelectTrigger id="listingType">
                      <SelectValue placeholder="Select listing type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SALE">For Sale Only</SelectItem>
                      <SelectItem value="RENT">For Rent Only</SelectItem>
                      <SelectItem value="BOTH">Both Sale and Rent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Location */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-emerald-600" /> Location
              </h4>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="county">County *</Label>
                    <Select value={form.county} onValueChange={v => setForm(f => ({ ...f, county: v }))}>
                      <SelectTrigger id="county">
                        <SelectValue placeholder="Select county" />
                      </SelectTrigger>
                      <SelectContent>
                        {KENYAN_COUNTIES.map(county => (
                          <SelectItem key={county} value={county}>{county}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="subCounty">Sub-County *</Label>
                    <Select 
                      value={form.subCounty} 
                      onValueChange={v => setForm(f => ({ ...f, subCounty: v }))}
                      disabled={!form.county || subCounties.length === 0}
                    >
                      <SelectTrigger id="subCounty">
                        <SelectValue placeholder={form.county ? "Select sub-county" : "Select county first"} />
                      </SelectTrigger>
                      <SelectContent>
                        {subCounties.map(subCounty => (
                          <SelectItem key={subCounty} value={subCounty}>{subCounty}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="address">Physical Address *</Label>
                  <Textarea 
                    id="address"
                    placeholder="Enter your business/office address" 
                    value={form.address} 
                    onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
                    rows={2}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Document Uploads */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <File className="w-5 h-5 text-emerald-600" /> Document Uploads
              </h4>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="idDocument">ID/Passport Copy *</Label>
                  <div className="mt-2">
                    <Input 
                      id="idDocument"
                      type="file"
                      accept="image/*,.pdf"
                      onChange={e => setIdDocument(e.target.files[0])}
                      className="cursor-pointer"
                    />
                    {idDocument && (
                      <p className="text-xs text-emerald-600 mt-1">✓ {idDocument.name} selected</p>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Upload a clear copy of your ID or Passport (JPG, PNG, or PDF)</p>
                </div>
                <div>
                  <Label htmlFor="businessLicense">Business License (Optional)</Label>
                  <div className="mt-2">
                    <Input 
                      id="businessLicense"
                      type="file"
                      accept="image/*,.pdf"
                      onChange={e => setBusinessLicense(e.target.files[0])}
                      className="cursor-pointer"
                    />
                    {businessLicense && (
                      <p className="text-xs text-emerald-600 mt-1">✓ {businessLicense.name} selected</p>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Upload your business license if you have one (JPG, PNG, or PDF)</p>
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-600" /> Additional Information
              </h4>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="description">About Your Business (Optional)</Label>
                  <Textarea 
                    id="description"
                    placeholder="Tell us about your property business, experience, and what makes you unique..." 
                    value={form.description} 
                    onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="website">Website (Optional)</Label>
                  <Input 
                    id="website"
                    type="url"
                    placeholder="https://yourwebsite.com" 
                    value={form.website} 
                    onChange={e => setForm(f => ({ ...f, website: e.target.value }))}
                  />
                </div>
              </div>
            </div>

            {/* Submit */}
            <div className="pt-4">
              <Button 
                type="submit" 
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-6 text-lg"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Shield className="w-5 h-5 mr-2" /> Submit Application
                  </>
                )}
              </Button>
              <p className="text-xs text-gray-400 text-center mt-3">
                Applications are reviewed within 24 hours. You will receive an email with login credentials upon approval.
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
