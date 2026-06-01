import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, Home as HomeIcon, MapPin, FileText, User, Phone, Mail, Building2, File, CheckCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import api from "@/api/apiClient";
import { toast } from "sonner";
import { KENYAN_COUNTIES, getSubCounties } from "@/data/kenyanCounties";

export default function ListProperty() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: Vendor Info, 2: Property Details
  const [subCounties, setSubCounties] = useState([]);
  const [idDocument, setIdDocument] = useState(null);
  const [businessLicense, setBusinessLicense] = useState(null);
  const [propertyImages, setPropertyImages] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  
  const [vendorForm, setVendorForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    idNumber: "",
    businessName: "",
    businessType: "individual",
    taxNumber: "",
    licenseNumber: "",
    propertyCategory: "",
    listingType: "",
    county: "",
    subCounty: "",
    address: "",
    description: "",
    website: "",
  });

  const [propertyForm, setPropertyForm] = useState({
    title: "",
    description: "",
    propertyType: "",
    listingType: "",
    price: "",
    bedrooms: "",
    bathrooms: "",
    areaSqm: "",
    landSizeSqm: "",
    address: "",
    county: "",
    subCounty: "",
    features: [],
    amenities: [],
  });

  useEffect(() => {
    if (vendorForm.county) {
      const subs = getSubCounties(vendorForm.county);
      setSubCounties(subs);
      if (vendorForm.subCounty && !subs.includes(vendorForm.subCounty)) {
        setVendorForm(f => ({ ...f, subCounty: "" }));
      }
    } else {
      setSubCounties([]);
    }
  }, [vendorForm.county]);

  const handleVendorSubmit = async (e) => {
    e.preventDefault();
    
    if (!vendorForm.firstName || !vendorForm.lastName || !vendorForm.email || !vendorForm.phone) {
      toast.error("Please fill in all required personal information");
      return;
    }

    if (!vendorForm.businessName || !vendorForm.propertyCategory || !vendorForm.listingType) {
      toast.error("Please fill in all required business details");
      return;
    }

    if (!vendorForm.county || !vendorForm.subCounty || !vendorForm.address) {
      toast.error("Please provide complete location details");
      return;
    }

    if (!idDocument) {
      toast.error("Please upload a copy of your ID or Passport");
      return;
    }

    setStep(2);
  };

  const handlePropertySubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Step 1: Register user with VENDOR role
      const registerData = {
        email: vendorForm.email,
        password: vendorForm.idNumber,
        firstName: vendorForm.firstName,
        lastName: vendorForm.lastName,
        phone: vendorForm.phone,
        role: "VENDOR",
      };

      console.log("Creating user account...");
      const authResponse = await api.auth.register(registerData);

      if (!authResponse.userId) {
        throw new Error("User registration failed");
      }

      // Step 2: Create vendor profile
      const vendorData = {
        userId: authResponse.userId,
        businessName: vendorForm.businessName,
        businessType: vendorForm.businessType,
        taxNumber: vendorForm.taxNumber || null,
        licenseNumber: vendorForm.licenseNumber || null,
        propertyCategory: vendorForm.propertyCategory,
        listingType: vendorForm.listingType,
        email: vendorForm.email,
        phone: vendorForm.phone,
        address: vendorForm.address,
        county: vendorForm.county,
        subCounty: vendorForm.subCounty || null,
        website: vendorForm.website || null,
        description: vendorForm.description || null,
        idNumber: vendorForm.idNumber,
      };

      console.log("Creating vendor profile...");
      const vendorResponse = await api.vendors.register(vendorData);

      // Step 3: Upload documents
      if (idDocument || businessLicense) {
        const formData = new FormData();
        if (idDocument) formData.append("idDocument", idDocument);
        if (businessLicense) formData.append("businessLicense", businessLicense);
        
        const docResponse = await fetch(`/api/vendors/${vendorResponse.id}/documents/upload`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          body: formData,
        });
        
        if (!docResponse.ok) {
          console.error("Document upload failed:", await docResponse.text());
        } else {
          console.log("Documents uploaded successfully");
        }
      }

      // Step 4: Create property listing
      const propertyData = {
        vendorId: vendorResponse.id,
        title: propertyForm.title,
        description: propertyForm.description,
        propertyType: propertyForm.propertyType,
        listingType: propertyForm.listingType,
        price: parseFloat(propertyForm.price),
        bedrooms: propertyForm.bedrooms ? parseInt(propertyForm.bedrooms) : null,
        bathrooms: propertyForm.bathrooms ? parseInt(propertyForm.bathrooms) : null,
        areaSqm: propertyForm.areaSqm ? parseFloat(propertyForm.areaSqm) : null,
        landSizeSqm: propertyForm.landSizeSqm ? parseFloat(propertyForm.landSizeSqm) : null,
        address: propertyForm.address,
        county: propertyForm.county,
        subCounty: propertyForm.subCounty || null,
        features: propertyForm.features,
        amenities: propertyForm.amenities,
      };

      console.log("Creating property listing...");
      
      // Create property with images using API client
      const propertyResponse = await api.properties.create(propertyData, propertyImages);
      console.log("Property created:", propertyResponse);

      setSubmitted(true);
      toast.success("Property listing submitted successfully!");
    } catch (error) {
      console.error("Submission error:", error);
      toast.error(error.message || "Failed to submit listing");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl p-10 max-w-md w-full text-center shadow-xl border">
          <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-5">
            <CheckCircle className="w-8 h-8 text-emerald-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Listing Submitted!</h2>
          <p className="text-gray-500 mb-5">
            Your property listing has been submitted for review. You will receive an OTP via email to login and track your listing status.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-700 text-left mb-6">
            <p className="font-semibold mb-2">What happens next:</p>
            <ul className="space-y-1">
              <li>✅ Admin reviews your listing</li>
              <li>✅ You receive OTP via email</li>
              <li>✅ Login to vendor dashboard</li>
              <li>✅ Track approval status</li>
              <li>✅ Once approved, listing goes live</li>
            </ul>
          </div>
          <div className="space-y-2">
            <Button onClick={() => navigate("/vendor-login")} className="w-full bg-emerald-500 hover:bg-emerald-600 text-white">
              Login to Vendor Dashboard
            </Button>
            <Button onClick={() => navigate("/")} variant="outline" className="w-full">
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-4">
            <div className={`flex items-center gap-2 ${step >= 1 ? "text-emerald-600" : "text-gray-400"}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? "bg-emerald-500 text-white" : "bg-gray-200"}`}>
                1
              </div>
              <span className="font-medium">Vendor Info</span>
            </div>
            <div className="w-16 h-0.5 bg-gray-300" />
            <div className={`flex items-center gap-2 ${step >= 2 ? "text-emerald-600" : "text-gray-400"}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? "bg-emerald-500 text-white" : "bg-gray-200"}`}>
                2
              </div>
              <span className="font-medium">Property Details</span>
            </div>
          </div>
        </div>

        {/* Step 1: Vendor Information */}
        {step === 1 && (
          <div className="bg-white rounded-2xl p-8 shadow-sm border">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Vendor Information</h2>
            <form onSubmit={handleVendorSubmit} className="space-y-6">
              {/* Personal Info */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-emerald-600" /> Personal Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>First Name *</Label>
                    <Input value={vendorForm.firstName} onChange={e => setVendorForm(f => ({ ...f, firstName: e.target.value }))} required />
                  </div>
                  <div>
                    <Label>Last Name *</Label>
                    <Input value={vendorForm.lastName} onChange={e => setVendorForm(f => ({ ...f, lastName: e.target.value }))} required />
                  </div>
                  <div>
                    <Label>Email *</Label>
                    <Input type="email" value={vendorForm.email} onChange={e => setVendorForm(f => ({ ...f, email: e.target.value }))} required />
                  </div>
                  <div>
                    <Label>Phone *</Label>
                    <Input value={vendorForm.phone} onChange={e => setVendorForm(f => ({ ...f, phone: e.target.value }))} required />
                  </div>
                  <div>
                    <Label>ID/Passport Number *</Label>
                    <Input value={vendorForm.idNumber} onChange={e => setVendorForm(f => ({ ...f, idNumber: e.target.value }))} required />
                  </div>
                </div>
              </div>

              {/* Business Info */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-emerald-600" /> Business Information
                </h3>
                <div className="space-y-4">
                  <div>
                    <Label>Business Name *</Label>
                    <Input value={vendorForm.businessName} onChange={e => setVendorForm(f => ({ ...f, businessName: e.target.value }))} required />
                  </div>
                  <div>
                    <Label>Business Type *</Label>
                    <RadioGroup value={vendorForm.businessType} onValueChange={v => setVendorForm(f => ({ ...f, businessType: v }))}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="individual" id="individual" />
                        <Label htmlFor="individual" className="font-normal cursor-pointer">Individual</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="company" id="company" />
                        <Label htmlFor="company" className="font-normal cursor-pointer">Company</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Property Category *</Label>
                      <Select value={vendorForm.propertyCategory} onValueChange={v => setVendorForm(f => ({ ...f, propertyCategory: v }))}>
                        <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="HOUSE">Houses</SelectItem>
                          <SelectItem value="LAND">Land</SelectItem>
                          <SelectItem value="BOTH">Both</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Listing Type *</Label>
                      <Select value={vendorForm.listingType} onValueChange={v => setVendorForm(f => ({ ...f, listingType: v }))}>
                        <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="SALE">Sale</SelectItem>
                          <SelectItem value="RENT">Rent</SelectItem>
                          <SelectItem value="BOTH">Both</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Location */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-emerald-600" /> Location
                </h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>County *</Label>
                      <Select value={vendorForm.county} onValueChange={v => setVendorForm(f => ({ ...f, county: v }))}>
                        <SelectTrigger><SelectValue placeholder="Select county" /></SelectTrigger>
                        <SelectContent>
                          {KENYAN_COUNTIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Sub-County *</Label>
                      <Select value={vendorForm.subCounty} onValueChange={v => setVendorForm(f => ({ ...f, subCounty: v }))} disabled={!vendorForm.county}>
                        <SelectTrigger><SelectValue placeholder="Select sub-county" /></SelectTrigger>
                        <SelectContent>
                          {subCounties.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label>Address *</Label>
                    <Textarea value={vendorForm.address} onChange={e => setVendorForm(f => ({ ...f, address: e.target.value }))} required />
                  </div>
                </div>
              </div>

              {/* Documents */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <File className="w-5 h-5 text-emerald-600" /> Documents
                </h3>
                <div className="space-y-4">
                  <div>
                    <Label>ID/Passport Copy *</Label>
                    <Input type="file" accept="image/*,.pdf" onChange={e => setIdDocument(e.target.files[0])} required />
                    {idDocument && <p className="text-xs text-emerald-600 mt-1">✓ {idDocument.name}</p>}
                  </div>
                  <div>
                    <Label>Business License (Optional)</Label>
                    <Input type="file" accept="image/*,.pdf" onChange={e => setBusinessLicense(e.target.files[0])} />
                    {businessLicense && <p className="text-xs text-emerald-600 mt-1">✓ {businessLicense.name}</p>}
                  </div>
                </div>
              </div>

              <Button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-6">
                Continue to Property Details
              </Button>
            </form>
          </div>
        )}

        {/* Step 2: Property Details */}
        {step === 2 && (
          <div className="bg-white rounded-2xl p-8 shadow-sm border">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Property Details</h2>
            <form onSubmit={handlePropertySubmit} className="space-y-6">
              <div>
                <Label>Property Title *</Label>
                <Input value={propertyForm.title} onChange={e => setPropertyForm(f => ({ ...f, title: e.target.value }))} required />
              </div>
              <div>
                <Label>Description *</Label>
                <Textarea value={propertyForm.description} onChange={e => setPropertyForm(f => ({ ...f, description: e.target.value }))} rows={4} required />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Property Type *</Label>
                  <Select value={propertyForm.propertyType} onValueChange={v => setPropertyForm(f => ({ ...f, propertyType: v }))}>
                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="HOUSE">House</SelectItem>
                      <SelectItem value="APARTMENT">Apartment</SelectItem>
                      <SelectItem value="LAND">Land</SelectItem>
                      <SelectItem value="COMMERCIAL">Commercial</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Listing Type *</Label>
                  <Select value={propertyForm.listingType} onValueChange={v => setPropertyForm(f => ({ ...f, listingType: v }))}>
                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SALE">For Sale</SelectItem>
                      <SelectItem value="RENT">For Rent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Price (KSh) *</Label>
                  <Input type="number" value={propertyForm.price} onChange={e => setPropertyForm(f => ({ ...f, price: e.target.value }))} required />
                </div>
                <div>
                  <Label>Bedrooms</Label>
                  <Input type="number" value={propertyForm.bedrooms} onChange={e => setPropertyForm(f => ({ ...f, bedrooms: e.target.value }))} />
                </div>
                <div>
                  <Label>Bathrooms</Label>
                  <Input type="number" value={propertyForm.bathrooms} onChange={e => setPropertyForm(f => ({ ...f, bathrooms: e.target.value }))} />
                </div>
                <div>
                  <Label>Area (sqm)</Label>
                  <Input type="number" value={propertyForm.areaSqm} onChange={e => setPropertyForm(f => ({ ...f, areaSqm: e.target.value }))} />
                </div>
              </div>
              <div>
                <Label>Property Images *</Label>
                <Input type="file" accept="image/*" multiple onChange={e => setPropertyImages(Array.from(e.target.files))} required />
                {propertyImages.length > 0 && <p className="text-xs text-emerald-600 mt-1">✓ {propertyImages.length} images selected</p>}
              </div>
              <div className="flex gap-4">
                <Button type="button" variant="outline" onClick={() => setStep(1)} className="flex-1">
                  Back
                </Button>
                <Button type="submit" disabled={loading} className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white">
                  {loading ? <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Submitting...</> : "Submit Listing"}
                </Button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
