import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  Home, MapPin, Bed, Bath, Maximize, DollarSign, Loader2, 
  ArrowLeft, Phone, Mail, Share2, Heart, Calendar, Eye, Clock, CheckCircle 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import apiClient from "@/api/apiClient";
import { toast } from "sonner";

export default function PropertyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [bookingDialog, setBookingDialog] = useState(false);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [bookingForm, setBookingForm] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    message: "",
    bookingType: "VIEWING"
  });
  const [bookingSubmitting, setBookingSubmitting] = useState(false);
  const [inquiryDialog, setInquiryDialog] = useState(false);
  const [inquiryForm, setInquiryForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });
  const [inquirySubmitting, setInquirySubmitting] = useState(false);

  useEffect(() => {
    loadProperty();
  }, [id]);

  const loadProperty = async () => {
    setLoading(true);
    try {
      console.log("Loading property with ID:", id); // Debug log
      const data = await apiClient.properties.getById(id);
      console.log("Property data:", data); // Debug log
      setProperty(data);
    } catch (error) {
      console.error("Error loading property:", error);
      toast.error(error.message || "Failed to load property details");
      setProperty(null);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    if (!price) return "KSh 0";
    return `KSh ${price.toLocaleString()}`;
  };

  const handleContactVendor = () => {
    setInquiryDialog(true);
    
    // Pre-fill form if user is logged in
    const authData = sessionStorage.getItem("mg_user_auth") || 
                     sessionStorage.getItem("mg_consumer_auth") ||
                     sessionStorage.getItem("mg_vendor_auth") ||
                     sessionStorage.getItem("mg_admin_auth");
    if (authData) {
      try {
        const parsed = JSON.parse(authData);
        setInquiryForm(prev => ({
          ...prev,
          email: parsed.email || ""
        }));
      } catch (e) {
        console.error("Error parsing auth data:", e);
      }
    }
  };

  const handleSubmitInquiry = async () => {
    if (!inquiryForm.name || !inquiryForm.email || !inquiryForm.message) {
      toast.error("Please fill in all required fields");
      return;
    }

    setInquirySubmitting(true);
    try {
      const inquiryData = {
        propertyId: parseInt(id),
        vendorId: property.vendorId || 0,
        name: inquiryForm.name,
        email: inquiryForm.email,
        phone: inquiryForm.phone,
        message: inquiryForm.message,
        inquiryType: "PROPERTY_INQUIRY"
      };

      await apiClient.inquiries.create(inquiryData);
      toast.success("Inquiry sent successfully! The vendor will contact you soon.");
      setInquiryDialog(false);
      setInquiryForm({
        name: "",
        email: "",
        phone: "",
        message: ""
      });
    } catch (error) {
      console.error("Error submitting inquiry:", error);
      toast.error(error.message || "Failed to send inquiry");
    } finally {
      setInquirySubmitting(false);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: property.title,
        text: property.description,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  const handleScheduleViewing = async () => {
    setBookingDialog(true);
    setSlotsLoading(true);
    try {
      const slots = await apiClient.availability.getAvailableSlots(id);
      setAvailableSlots(slots);
    } catch (error) {
      console.error("Error loading available slots:", error);
      toast.error("Failed to load available time slots");
      setAvailableSlots([]);
    } finally {
      setSlotsLoading(false);
    }
  };

  const handleSubmitBooking = async () => {
    console.log("=== Submit booking called ===");
    console.log("Selected slot:", selectedSlot);
    console.log("Booking form:", bookingForm);
    
    if (!selectedSlot) {
      toast.error("Please select a time slot");
      return;
    }
    if (!bookingForm.customerName || !bookingForm.customerEmail || !bookingForm.customerPhone) {
      toast.error("Please fill in all required fields");
      return;
    }

    setBookingSubmitting(true);
    try {
      // Get user ID from session if logged in
      const authData = sessionStorage.getItem("mg_user_auth") || 
                       sessionStorage.getItem("mg_consumer_auth") ||
                       sessionStorage.getItem("mg_vendor_auth") ||
                       sessionStorage.getItem("mg_admin_auth");
      let customerId = 0;
      if (authData) {
        try {
          const parsed = JSON.parse(authData);
          customerId = parsed.userId || 0;
          console.log("User authenticated, customerId:", customerId);
        } catch (e) {
          console.error("Error parsing auth data:", e);
        }
      } else {
        console.log("No user authenticated, using customerId: 0");
      }

      const bookingData = {
        propertyId: parseInt(id),
        customerId: customerId,
        customerName: bookingForm.customerName,
        customerEmail: bookingForm.customerEmail,
        customerPhone: bookingForm.customerPhone,
        bookingDate: selectedSlot.availableDate,
        bookingTime: selectedSlot.startTime,
        bookingType: bookingForm.bookingType,
        message: bookingForm.message
      };

      console.log("=== Submitting booking data ===");
      console.log(JSON.stringify(bookingData, null, 2));

      const response = await apiClient.bookings.create(bookingData);
      console.log("=== Booking response ===");
      console.log(JSON.stringify(response, null, 2));

      toast.success("Booking request submitted! The vendor will confirm shortly.");
      setBookingDialog(false);
      setSelectedSlot(null);
      setBookingForm({
        customerName: "",
        customerEmail: "",
        customerPhone: "",
        message: "",
        bookingType: "VIEWING"
      });
    } catch (error) {
      console.error("=== Error submitting booking ===");
      console.error("Error object:", error);
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
      toast.error(error.message || "Failed to submit booking request");
    } finally {
      setBookingSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Home className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Property not found</h2>
          <Button onClick={() => navigate("/properties")} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Listings
          </Button>
        </div>
      </div>
    );
  }

  const images = property.images || [];
  const hasImages = images.length > 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Button onClick={() => navigate("/properties")} variant="ghost" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Listings
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <Card>
              <CardContent className="p-0">
                <div className="relative h-96 bg-gray-200">
                  {hasImages ? (
                    <img 
                      src={images[selectedImage]} 
                      alt={property.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600'%3E%3Crect fill='%23e5e7eb' width='800' height='600'/%3E%3Ctext fill='%239ca3af' font-family='sans-serif' font-size='24' x='50%25' y='50%25' text-anchor='middle' dominant-baseline='middle'%3ENo Image%3C/text%3E%3C/svg%3E";
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Home className="w-24 h-24 text-gray-400" />
                    </div>
                  )}
                  <div className="absolute top-4 right-4 flex gap-2">
                    <Button size="sm" variant="secondary" onClick={handleShare}>
                      <Share2 className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="secondary">
                      <Heart className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                {hasImages && images.length > 1 && (
                  <div className="p-4 grid grid-cols-6 gap-2">
                    {images.map((img, idx) => (
                      <div
                        key={idx}
                        onClick={() => setSelectedImage(idx)}
                        className={`h-16 rounded-lg overflow-hidden cursor-pointer border-2 ${
                          selectedImage === idx ? "border-emerald-500" : "border-transparent"
                        }`}
                      >
                        <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Property Details */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className="bg-emerald-500 text-white border-0">
                        {property.listingType}
                      </Badge>
                      <Badge variant="outline">{property.propertyType}</Badge>
                    </div>
                    <CardTitle className="text-3xl">{property.title}</CardTitle>
                    <div className="flex items-center text-gray-500 mt-2">
                      <MapPin className="w-4 h-4 mr-1" />
                      {property.address}, {property.county}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-emerald-600">
                      {formatPrice(property.price)}
                    </div>
                    <div className="text-sm text-gray-500 flex items-center justify-end mt-1">
                      <Eye className="w-4 h-4 mr-1" />
                      {property.viewsCount || 0} views
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Key Features */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {property.bedrooms && (
                    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                      <Bed className="w-5 h-5 text-emerald-600" />
                      <div>
                        <div className="text-sm text-gray-500">Bedrooms</div>
                        <div className="font-semibold">{property.bedrooms}</div>
                      </div>
                    </div>
                  )}
                  {property.bathrooms && (
                    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                      <Bath className="w-5 h-5 text-emerald-600" />
                      <div>
                        <div className="text-sm text-gray-500">Bathrooms</div>
                        <div className="font-semibold">{property.bathrooms}</div>
                      </div>
                    </div>
                  )}
                  {property.areaSqm && (
                    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                      <Maximize className="w-5 h-5 text-emerald-600" />
                      <div>
                        <div className="text-sm text-gray-500">Area</div>
                        <div className="font-semibold">{property.areaSqm} m²</div>
                      </div>
                    </div>
                  )}
                  {property.landSizeSqm && (
                    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                      <Maximize className="w-5 h-5 text-emerald-600" />
                      <div>
                        <div className="text-sm text-gray-500">Land Size</div>
                        <div className="font-semibold">{property.landSizeSqm} m²</div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Description */}
                <div>
                  <h3 className="font-semibold text-lg mb-2">Description</h3>
                  <p className="text-gray-600 whitespace-pre-line">{property.description}</p>
                </div>

                {/* Features */}
                {property.features && property.features.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Features</h3>
                    <div className="flex flex-wrap gap-2">
                      {property.features.map((feature, idx) => (
                        <Badge key={idx} variant="outline">{feature}</Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Amenities */}
                {property.amenities && property.amenities.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Amenities</h3>
                    <div className="flex flex-wrap gap-2">
                      {property.amenities.map((amenity, idx) => (
                        <Badge key={idx} variant="outline">{amenity}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Card */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Vendor</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-white"
                  onClick={handleContactVendor}
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Contact Vendor
                </Button>
                <Button 
                  className="w-full" 
                  variant="outline"
                  onClick={handleContactVendor}
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Send Inquiry
                </Button>
                <Button 
                  className="w-full" 
                  variant="outline"
                  onClick={(e) => {
                    e.preventDefault();
                    console.log("Schedule Viewing button clicked"); // Debug log
                    handleScheduleViewing();
                  }}
                  type="button"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule Viewing
                </Button>
              </CardContent>
            </Card>

            {/* Property Info */}
            <Card>
              <CardHeader>
                <CardTitle>Property Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Property ID</span>
                  <span className="font-semibold">#{property.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Type</span>
                  <span className="font-semibold">{property.propertyType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Listing</span>
                  <span className="font-semibold">{property.listingType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">County</span>
                  <span className="font-semibold">{property.county}</span>
                </div>
                {property.subCounty && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Sub County</span>
                    <span className="font-semibold">{property.subCounty}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-500">Listed</span>
                  <span className="font-semibold">
                    {new Date(property.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Booking Dialog */}
      <Dialog open={bookingDialog} onOpenChange={setBookingDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Schedule Property Viewing</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Available Slots */}
            <div>
              <h3 className="font-semibold text-lg mb-3">Select Available Time Slot</h3>
              {slotsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-emerald-500" />
                </div>
              ) : availableSlots.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p className="text-gray-600">No available time slots at the moment</p>
                  <p className="text-sm text-gray-500 mt-1">Please contact the vendor directly</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-64 overflow-y-auto">
                  {availableSlots.map(slot => (
                    <div
                      key={slot.id}
                      onClick={() => setSelectedSlot(slot)}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        selectedSlot?.id === slot.id
                          ? "border-emerald-500 bg-emerald-50"
                          : "border-gray-200 hover:border-emerald-300"
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-emerald-600" />
                          <span className="font-semibold">
                            {new Date(slot.availableDate).toLocaleDateString('en-US', { 
                              weekday: 'short', 
                              month: 'short', 
                              day: 'numeric' 
                            })}
                          </span>
                        </div>
                        {selectedSlot?.id === slot.id && (
                          <CheckCircle className="w-5 h-5 text-emerald-600" />
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span>{slot.startTime} - {slot.endTime}</span>
                      </div>
                      {slot.notes && (
                        <p className="text-xs text-gray-500 mt-2">{slot.notes}</p>
                      )}
                      <div className="mt-2">
                        <Badge variant="outline" className="text-xs">
                          {slot.maxBookings - slot.currentBookings} slots available
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Booking Form */}
            {selectedSlot && (
              <div className="space-y-4 border-t pt-4">
                <h3 className="font-semibold text-lg">Your Information</h3>
                
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    placeholder="Enter your full name"
                    value={bookingForm.customerName}
                    onChange={(e) => setBookingForm({...bookingForm, customerName: e.target.value})}
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="email"
                    placeholder="your.email@example.com"
                    value={bookingForm.customerEmail}
                    onChange={(e) => setBookingForm({...bookingForm, customerEmail: e.target.value})}
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="tel"
                    placeholder="+254 700 000 000"
                    value={bookingForm.customerPhone}
                    onChange={(e) => setBookingForm({...bookingForm, customerPhone: e.target.value})}
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">
                    Booking Type
                  </label>
                  <Select 
                    value={bookingForm.bookingType}
                    onValueChange={(value) => setBookingForm({...bookingForm, bookingType: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="VIEWING">Property Viewing</SelectItem>
                      <SelectItem value="INSPECTION">Property Inspection</SelectItem>
                      <SelectItem value="CONSULTATION">Consultation</SelectItem>
                      <SelectItem value="SITE_VISIT">Site Visit</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">
                    Message (Optional)
                  </label>
                  <textarea
                    className="w-full border rounded-lg p-3 text-sm resize-none h-20 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="Any specific requirements or questions..."
                    value={bookingForm.message}
                    onChange={(e) => setBookingForm({...bookingForm, message: e.target.value})}
                  />
                </div>

                {/* Selected Slot Summary */}
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                  <h4 className="font-semibold text-emerald-900 mb-2">Booking Summary</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Property:</span>
                      <span className="font-medium">{property.title}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Date:</span>
                      <span className="font-medium">
                        {new Date(selectedSlot.availableDate).toLocaleDateString('en-US', { 
                          weekday: 'long', 
                          month: 'long', 
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Time:</span>
                      <span className="font-medium">{selectedSlot.startTime} - {selectedSlot.endTime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Type:</span>
                      <span className="font-medium">{bookingForm.bookingType.replace('_', ' ')}</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-3">
                  <Button
                    type="button"
                    className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white"
                    onClick={handleSubmitBooking}
                    disabled={bookingSubmitting}
                  >
                    {bookingSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Confirm Booking
                      </>
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      setBookingDialog(false);
                      setSelectedSlot(null);
                    }}
                    disabled={bookingSubmitting}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Inquiry Dialog */}
      <Dialog open={inquiryDialog} onOpenChange={setInquiryDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Send Inquiry to Vendor</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Have questions about this property? Send an inquiry and the vendor will get back to you.
            </p>

            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block">
                Your Name <span className="text-red-500">*</span>
              </label>
              <Input
                placeholder="Enter your full name"
                value={inquiryForm.name}
                onChange={(e) => setInquiryForm({...inquiryForm, name: e.target.value})}
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block">
                Email <span className="text-red-500">*</span>
              </label>
              <Input
                type="email"
                placeholder="your.email@example.com"
                value={inquiryForm.email}
                onChange={(e) => setInquiryForm({...inquiryForm, email: e.target.value})}
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block">
                Phone Number
              </label>
              <Input
                type="tel"
                placeholder="+254 700 000 000"
                value={inquiryForm.phone}
                onChange={(e) => setInquiryForm({...inquiryForm, phone: e.target.value})}
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block">
                Message <span className="text-red-500">*</span>
              </label>
              <textarea
                className="w-full border rounded-lg p-3 text-sm resize-none h-32 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="What would you like to know about this property?"
                value={inquiryForm.message}
                onChange={(e) => setInquiryForm({...inquiryForm, message: e.target.value})}
              />
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-900">
                <strong>Property:</strong> {property.title}
              </p>
              <p className="text-sm text-blue-900">
                <strong>Price:</strong> {formatPrice(property.price)}
              </p>
            </div>

            <div className="flex gap-3 pt-3">
              <Button
                type="button"
                className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white"
                onClick={handleSubmitInquiry}
                disabled={inquirySubmitting}
              >
                {inquirySubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Mail className="w-4 h-4 mr-2" />
                    Send Inquiry
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setInquiryDialog(false);
                  setInquiryForm({
                    name: "",
                    email: "",
                    phone: "",
                    message: ""
                  });
                }}
                disabled={inquirySubmitting}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
