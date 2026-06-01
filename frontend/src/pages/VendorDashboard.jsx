import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  Upload, BarChart2, BookOpen, Settings, CheckCircle, Globe, Shield, Plus,
  DollarSign, Eye, TrendingUp, Bell, LogOut, Menu, X, Home,
  Calendar, ChevronRight, AlertCircle, Loader2, ImageIcon, ChevronLeft, AlertTriangle,
  Download, Edit2, Search, MessageSquare
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Legend } from "recharts";
import { toast } from "sonner";
import { getIssues, addIssue, getModuleConfig } from "@/lib/issueStore";
import apiClient from "@/api/apiClient";
import { KENYAN_COUNTIES as KENYAN_COUNTIES_LIST, getSubCounties } from "@/data/kenyanCounties";

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: BarChart2 },
  { id: "listings", label: "My Properties", icon: BookOpen },
  { id: "upload", label: "Add Property", icon: Upload },
  { id: "calendar", label: "Booking Calendar", icon: Calendar },
  { id: "bookings", label: "Bookings", icon: MessageSquare },
  { id: "inquiries", label: "Inquiries", icon: AlertCircle },
  { id: "issues", label: "My Issues", icon: AlertTriangle },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "analytics", label: "Analytics", icon: TrendingUp },
  { id: "settings", label: "Settings", icon: Settings },
];

const uploadSteps = ["Basic Info", "Property Details", "Images", "Review & Submit"];

const KENYAN_COUNTIES = KENYAN_COUNTIES_LIST;

const monthlyData = [
  { month: "Jan", views: 120, inquiries: 15, bookings: 3, revenue: 8500 },
  { month: "Feb", views: 180, inquiries: 22, bookings: 5, revenue: 12300 },
  { month: "Mar", views: 240, inquiries: 28, bookings: 7, revenue: 15800 },
  { month: "Apr", views: 310, inquiries: 35, bookings: 9, revenue: 19200 },
  { month: "May", views: 280, inquiries: 30, bookings: 8, revenue: 17600 },
  { month: "Jun", views: 350, inquiries: 42, bookings: 11, revenue: 23400 },
];

const mockListings = [
  { id: 1, title: "3BR House in Westlands", image: "https://via.placeholder.com/150", views: 245, status: "active", category: "House", revenue: 8500 },
  { id: 2, title: "Land in Kiambu", image: "https://via.placeholder.com/150", views: 189, status: "active", category: "Land", revenue: 6200 },
  { id: 3, title: "Apartment in Kilimani", image: "https://via.placeholder.com/150", views: 156, status: "pending", category: "Apartment", revenue: 0 },
];

export default function VendorDashboard() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [logoText, setLogoText] = useState("Property Vendor");
  const [editingLogo, setEditingLogo] = useState(false);
  const [logoInput, setLogoInput] = useState("");
  const [uploadStep, setUploadStep] = useState(0);
  const [uploadForm, setUploadForm] = useState({
    title: "", description: "", propertyType: "", listingType: "", price: "",
    bedrooms: "", bathrooms: "", areaSqm: "", landSizeSqm: "", address: "",
    county: "", subCounty: "", latitude: "", longitude: "", features: [], amenities: []
  });
  const [uploadImages, setUploadImages] = useState([]);
  const [uploadDone, setUploadDone] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [properties, setProperties] = useState([]);
  const [propertiesLoading, setPropertiesLoading] = useState(false);
  const [issues, setIssues] = useState([]);
  const [issueForm, setIssueForm] = useState({ title: "", category: "", description: "", priority: "medium" });
  const [issueDialog, setIssueDialog] = useState(false);
  const [vendorId, setVendorId] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [inquiries, setInquiries] = useState([]);
  const [inquiriesLoading, setInquiriesLoading] = useState(false);
  const [newInquiriesCount, setNewInquiriesCount] = useState(0);
  const [dashboardStats, setDashboardStats] = useState({
    totalViews: 0,
    totalInquiries: 0,
    totalRevenue: 0,
    activeListings: 0,
    pendingListings: 0
  });
  const [availableSubCounties, setAvailableSubCounties] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [propertyDetailsDialog, setPropertyDetailsDialog] = useState(false);
  
  // Calendar and Bookings state
  const [availabilitySlots, setAvailabilitySlots] = useState([]);
  const [availabilityLoading, setAvailabilityLoading] = useState(false);
  const [availabilityDialog, setAvailabilityDialog] = useState(false);
  const [availabilityForm, setAvailabilityForm] = useState({
    propertyId: "",
    availableDate: "",
    startTime: "09:00",
    endTime: "10:00",
    maxBookings: 1,
    notes: ""
  });
  const [bookings, setBookings] = useState([]);
  const [bookingsLoading, setBookingsLoading] = useState(false);
  const [newBookingsCount, setNewBookingsCount] = useState(0);

  useEffect(() => {
    const authData = sessionStorage.getItem("mg_vendor_auth");
    if (!authData) {
      navigate("/VendorLogin");
      return;
    }
    
    try {
      const parsed = JSON.parse(authData);
      const userId = parsed.userId;
      
      // Fetch vendor by userId
      if (userId) {
        fetchVendorByUserId(userId);
      }
    } catch (e) {
      console.error("Error parsing auth data:", e);
      navigate("/VendorLogin");
    }
    
    const vendorIssues = getIssues().filter(i => i.vendor === "Property Vendor");
    setIssues(vendorIssues);
    setUnreadCount(vendorIssues.filter(i => i.status === "pending").length);
  }, [navigate]);

  const fetchVendorByUserId = async (userId) => {
    try {
      const vendor = await apiClient.vendors.getByUserId(userId);
      setVendorId(vendor.id);
      
      // Load properties for this vendor
      loadVendorProperties(vendor.id);
      
      // Load inquiries for this vendor
      loadVendorInquiries(vendor.id);
      
      // Load dashboard stats
      loadDashboardStats(vendor.id);
    } catch (error) {
      console.error("Error fetching vendor:", error);
      toast.error(error.message || "Failed to load vendor profile");
    }
  };

  useEffect(() => {
    if (activeSection === "listings" && vendorId) {
      loadVendorProperties(vendorId);
    }
    if (activeSection === "inquiries" && vendorId) {
      loadVendorInquiries(vendorId);
    }
    if (activeSection === "calendar" && vendorId) {
      loadVendorAvailability(vendorId);
    }
    if (activeSection === "bookings" && vendorId) {
      loadVendorBookings(vendorId);
    }
  }, [activeSection, vendorId]);

  const loadVendorProperties = async (vId) => {
    if (!vId) return;
    
    setPropertiesLoading(true);
    try {
      const response = await apiClient.properties.getByVendor(vId);
      setProperties(response.content || response || []);
    } catch (error) {
      console.error("Error loading properties:", error);
      toast.error(error.message || "Failed to load properties");
      setProperties([]);
    } finally {
      setPropertiesLoading(false);
    }
  };

  const loadVendorInquiries = async (vId) => {
    if (!vId) return;
    
    setInquiriesLoading(true);
    try {
      const response = await apiClient.inquiries.getByVendor(vId, 0, 100);
      setInquiries(response.content || response || []);
      
      // Count new inquiries
      const newCount = await apiClient.inquiries.countNewForVendor(vId);
      setNewInquiriesCount(newCount);
    } catch (error) {
      console.error("Error loading inquiries:", error);
      toast.error(error.message || "Failed to load inquiries");
      setInquiries([]);
    } finally {
      setInquiriesLoading(false);
    }
  };

  const handleMarkInquiryAsRead = async (inquiryId) => {
    try {
      await apiClient.inquiries.markAsRead(inquiryId);
      // Reload inquiries
      if (vendorId) {
        loadVendorInquiries(vendorId);
      }
      toast.success("Inquiry marked as read");
    } catch (error) {
      console.error("Error marking inquiry as read:", error);
      toast.error("Failed to update inquiry");
    }
  };

  const loadDashboardStats = async (vId) => {
    if (!vId) return;
    
    try {
      // Load properties to calculate stats
      const propertiesResponse = await apiClient.properties.getByVendor(vId);
      const vendorProperties = propertiesResponse.content || propertiesResponse || [];
      
      // Calculate total views
      const totalViews = vendorProperties.reduce((sum, prop) => sum + (prop.viewsCount || 0), 0);
      
      // Count active and pending listings
      const activeListings = vendorProperties.filter(p => p.status === 'ACTIVE').length;
      const pendingListings = vendorProperties.filter(p => p.status === 'DRAFT').length;
      
      // Get inquiry count
      const inquiriesResponse = await apiClient.inquiries.getByVendor(vId, 0, 1000);
      const totalInquiries = (inquiriesResponse.content || inquiriesResponse || []).length;
      
      // Calculate revenue (sum of all property prices for active listings)
      const totalRevenue = vendorProperties
        .filter(p => p.status === 'ACTIVE')
        .reduce((sum, prop) => sum + (Number(prop.price) || 0), 0);
      
      setDashboardStats({
        totalViews,
        totalInquiries,
        totalRevenue,
        activeListings,
        pendingListings
      });
    } catch (error) {
      console.error("Error loading dashboard stats:", error);
    }
  };

  const loadVendorAvailability = async (vId) => {
    if (!vId) return;
    
    setAvailabilityLoading(true);
    try {
      const response = await apiClient.availability.getByVendor(vId);
      setAvailabilitySlots(response || []);
    } catch (error) {
      console.error("Error loading availability:", error);
      toast.error("Failed to load availability");
      setAvailabilitySlots([]);
    } finally {
      setAvailabilityLoading(false);
    }
  };

  const loadVendorBookings = async (vId) => {
    if (!vId) return;
    
    setBookingsLoading(true);
    try {
      const response = await apiClient.bookings.getByVendor(vId, 0, 100);
      setBookings(response.content || response || []);
      
      // Count new bookings
      const newCount = await apiClient.bookings.countNewForVendor(vId);
      setNewBookingsCount(newCount);
    } catch (error) {
      console.error("Error loading bookings:", error);
      toast.error("Failed to load bookings");
      setBookings([]);
    } finally {
      setBookingsLoading(false);
    }
  };

  const handleCreateAvailability = async () => {
    if (!availabilityForm.propertyId || !availabilityForm.availableDate) {
      toast.error("Please select property and date");
      return;
    }
    
    try {
      await apiClient.availability.create({
        vendorId,
        ...availabilityForm
      });
      toast.success("Availability slot created");
      setAvailabilityDialog(false);
      setAvailabilityForm({
        propertyId: "",
        availableDate: "",
        startTime: "09:00",
        endTime: "10:00",
        maxBookings: 1,
        notes: ""
      });
      loadVendorAvailability(vendorId);
    } catch (error) {
      console.error("Error creating availability:", error);
      toast.error("Failed to create availability");
    }
  };

  const handleDeleteAvailability = async (availabilityId) => {
    if (!confirm("Delete this availability slot?")) return;
    
    try {
      await apiClient.availability.delete(availabilityId);
      toast.success("Availability deleted");
      loadVendorAvailability(vendorId);
    } catch (error) {
      console.error("Error deleting availability:", error);
      toast.error("Failed to delete availability");
    }
  };

  const handleConfirmBooking = async (bookingId) => {
    try {
      await apiClient.bookings.confirm(bookingId);
      await apiClient.bookings.markNotified(bookingId);
      toast.success("Booking confirmed");
      loadVendorBookings(vendorId);
    } catch (error) {
      console.error("Error confirming booking:", error);
      toast.error("Failed to confirm booking");
    }
  };

  const handleCancelBooking = async (bookingId) => {
    const reason = prompt("Enter cancellation reason:");
    if (!reason) return;
    
    try {
      await apiClient.bookings.cancel(bookingId, reason);
      toast.success("Booking cancelled");
      loadVendorBookings(vendorId);
    } catch (error) {
      console.error("Error cancelling booking:", error);
      toast.error("Failed to cancel booking");
    }
  };

  const handleNav = (id) => {
    setActiveSection(id);
    setSidebarOpen(false);
  };

  const handleSubmitIssue = () => {
    if (!issueForm.title || !issueForm.description) { 
      toast.error("Please fill in all required fields."); 
      return; 
    }
    addIssue({ ...issueForm, vendor: "Property Vendor" });
    setIssueDialog(false);
    setIssueForm({ title: "", category: "", description: "", priority: "medium" });
    setIssues(getIssues().filter(i => i.vendor === "Property Vendor"));
    toast.success("Issue submitted to Admin for review.");
  };

  const handleLogout = () => {
    sessionStorage.removeItem("mg_vendor_auth");
    navigate("/VendorLogin");
  };

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    if (files.length + uploadImages.length > 10) {
      toast.error("Maximum 10 files allowed");
      return;
    }
    
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    
    const validFiles = files.filter(file => {
      if (file.size > 10 * 1024 * 1024) {
        toast.error(`${file.name} is too large. Maximum 10MB per file.`);
        return false;
      }
      if (!allowedTypes.includes(file.type)) {
        toast.error(`${file.name} is not a supported file type.`);
        return false;
      }
      return true;
    });
    
    setUploadImages(prev => [...prev, ...validFiles]);
  };

  const removeImage = (index) => {
    setUploadImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleUploadSubmit = async () => {
    if (!uploadForm.title || !uploadForm.propertyType || !uploadForm.listingType || !uploadForm.price || !uploadForm.address || !uploadForm.county) {
      toast.error("Please fill in all required fields.");
      return;
    }
    
    if (uploadImages.length === 0) {
      toast.error("Please upload at least one property image.");
      return;
    }
    
    if (!vendorId) {
      toast.error("Vendor profile not loaded. Please refresh and try again.");
      return;
    }
    
    setUploadLoading(true);
    try {
      // Prepare property data
      const propertyData = {
        ...uploadForm,
        vendorId: vendorId,
        price: parseFloat(uploadForm.price),
        bedrooms: uploadForm.bedrooms ? parseInt(uploadForm.bedrooms) : null,
        bathrooms: uploadForm.bathrooms ? parseInt(uploadForm.bathrooms) : null,
        areaSqm: uploadForm.areaSqm ? parseFloat(uploadForm.areaSqm) : null,
        landSizeSqm: uploadForm.landSizeSqm ? parseFloat(uploadForm.landSizeSqm) : null,
        latitude: uploadForm.latitude ? parseFloat(uploadForm.latitude) : null,
        longitude: uploadForm.longitude ? parseFloat(uploadForm.longitude) : null,
      };
      
      // Use the apiClient properties.create method
      await apiClient.properties.create(propertyData, uploadImages);
      
      setUploadDone(true);
      toast.success("Property submitted for review!");
      
      // Refresh the properties list
      if (vendorId) {
        loadVendorProperties(vendorId);
      }
    } catch (error) {
      console.error("Error submitting property:", error);
      toast.error(error.message || "Failed to submit property. Please try again.");
    } finally {
      setUploadLoading(false);
    }
  };

  const formatPrice = (price) => {
    if (!price) return "KSh 0";
    return `KSh ${price.toLocaleString()}`;
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      DRAFT: { label: "⏳ Pending", class: "bg-yellow-100 text-yellow-700 border-0" },
      ACTIVE: { label: "✅ Active", class: "bg-green-100 text-green-700 border-0" },
      INACTIVE: { label: "❌ Rejected", class: "bg-red-100 text-red-700 border-0" }
    };
    
    const statusInfo = statusMap[status] || statusMap.DRAFT;
    return <Badge className={statusInfo.class}>{statusInfo.label}</Badge>;
  };

  const activeProperties = properties.filter(p => p.status === 'ACTIVE');
  const pendingProperties = properties.filter(p => p.status === 'DRAFT');
  const totalViews = properties.reduce((sum, p) => sum + (p.viewsCount || 0), 0);
  const totalRevenue = activeProperties.reduce((sum, p) => sum + (p.price || 0), 0);

  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar — fixed, non-scrollable */}
      <aside className={`
        fixed lg:relative inset-y-0 left-0 z-50
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        w-64 bg-gray-900 flex flex-col transition-transform duration-300 ease-in-out h-screen flex-shrink-0
      `}>
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center shrink-0">
              <Globe className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              {editingLogo ? (
                <input
                  className="bg-white/10 text-white text-sm font-bold rounded px-2 py-0.5 w-full focus:outline-none focus:ring-1 focus:ring-emerald-400"
                  value={logoInput}
                  onChange={e => setLogoInput(e.target.value)}
                  onBlur={() => { setLogoText(logoInput || logoText); setEditingLogo(false); }}
                  onKeyDown={e => { if (e.key === "Enter") { setLogoText(logoInput || logoText); setEditingLogo(false); } }}
                  autoFocus
                />
              ) : (
                <div className="flex items-center gap-1 group cursor-pointer" onClick={() => { setLogoInput(logoText); setEditingLogo(true); }}>
                  <p className="text-white font-bold text-sm truncate">{logoText}</p>
                  <Edit2 className="w-3 h-3 text-gray-500 group-hover:text-gray-300 shrink-0" />
                </div>
              )}
              <p className="text-emerald-400 text-xs">Vendor Portal</p>
            </div>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-1 text-gray-400 hover:text-white shrink-0">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-4 py-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white text-xs font-bold shrink-0">V</div>
            <div className="overflow-hidden">
              <p className="text-white text-xs font-semibold truncate">My Business</p>
              <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-xs px-1.5 py-0">✅ Approved</Badge>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => handleNav(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors ${activeSection === item.id ? "bg-emerald-500/20 text-emerald-400" : "text-gray-400 hover:bg-white/5 hover:text-white"}`}
            >
              <item.icon className="w-4 h-4 shrink-0" />
              <span>{item.label}</span>
              {item.id === "issues" && issues.filter(i => i.status === "pending").length > 0 && (
                <span className="ml-auto bg-yellow-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{issues.filter(i => i.status === "pending").length}</span>
              )}
              {item.id === "notifications" && unreadCount > 0 && (
                <span className="ml-auto bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{unreadCount}</span>
              )}
            </button>
          ))}
        </nav>

        <div className="p-3 border-t border-white/10 space-y-1 flex-shrink-0">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors">
            <LogOut className="w-4 h-4 shrink-0" /><span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main content — scrollable area */}
      <div className="flex-1 flex flex-col overflow-auto lg:ml-0">
        {/* Top bar */}
        <div className="bg-white border-b px-4 lg:px-6 py-4 flex items-center justify-between sticky top-0 z-20 shadow-sm">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors lg:hidden">
              <Menu className="w-5 h-5 text-gray-600" />
            </button>
            <h1 className="font-bold text-gray-900">{navItems.find(n => n.id === activeSection)?.label}</h1>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => handleNav("notifications")} className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <Bell className="w-5 h-5 text-gray-500" />
              {unreadCount > 0 && <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />}
            </button>
            <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 hidden sm:flex">Professional Plan</Badge>
          </div>
        </div>

        <div className="flex-1 p-4 lg:p-6">
          {/* Dashboard */}
          {activeSection === "dashboard" && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
                {[
                  { label: "Total Views", value: dashboardStats.totalViews.toLocaleString(), change: "All time", icon: Eye, color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-100" },
                  { label: "Total Inquiries", value: dashboardStats.totalInquiries.toString(), change: "All time", icon: MessageSquare, color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-100" },
                  { label: "Total Value", value: `KSh ${(dashboardStats.totalRevenue / 1000000).toFixed(1)}M`, change: "Active listings", icon: DollarSign, color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-100" },
                  { label: "Active Listings", value: dashboardStats.activeListings.toString(), change: `${dashboardStats.pendingListings} pending`, icon: CheckCircle, color: "text-purple-600", bg: "bg-purple-50", border: "border-purple-100" },
                ].map(s => (
                  <Card key={s.label} className={`border ${s.border}`}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className={`w-8 h-8 rounded-xl ${s.bg} flex items-center justify-center`}>
                          <s.icon className={`w-4 h-4 ${s.color}`} />
                        </div>
                        <Badge className="bg-gray-100 text-gray-600 text-xs border-0">{s.change}</Badge>
                      </div>
                      <p className="text-lg lg:text-xl font-extrabold text-gray-900">{s.value}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-base">Recent Listings</CardTitle>
                  <Button size="sm" variant="outline" onClick={() => handleNav("listings")} className="gap-1 text-xs">
                    View All <ChevronRight className="w-3 h-3" />
                  </Button>
                </CardHeader>
                <CardContent>
                  {propertiesLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                    </div>
                  ) : properties.length === 0 ? (
                    <div className="text-center py-8 text-gray-400">
                      <Home className="w-12 h-12 mx-auto mb-2 opacity-30" />
                      <p className="text-sm">No properties yet</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {properties.slice(0, 3).map(property => (
                        <div 
                          key={property.id} 
                          className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
                          onClick={() => {
                            setSelectedProperty(property);
                            setPropertyDetailsDialog(true);
                          }}
                        >
                          <div className="w-12 h-12 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0">
                            <Home className="w-6 h-6 text-emerald-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-gray-900 text-sm truncate">{property.title}</p>
                            <p className="text-xs text-gray-500">{property.propertyType} • {property.viewsCount || 0} views</p>
                          </div>
                          <Badge className={`text-xs shrink-0 ${property.status === "ACTIVE" ? "bg-green-100 text-green-700 border-0" : "bg-yellow-100 text-yellow-700 border-0"}`}>
                            {property.status === "ACTIVE" ? "Active" : property.status}
                          </Badge>
                          <p className="font-bold text-emerald-600 text-sm shrink-0 hidden sm:block">{formatPrice(property.price)}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {/* Listings */}
          {activeSection === "listings" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">My Properties</h2>
                <Button className="bg-emerald-500 hover:bg-emerald-600 text-white gap-2 text-sm" onClick={() => { setUploadStep(0); setUploadDone(false); handleNav("upload"); }}>
                  <Plus className="w-4 h-4" /> Add Property
                </Button>
              </div>
              
              {propertiesLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                </div>
              ) : properties.length === 0 ? (
                <div className="text-center py-16 text-gray-400">
                  <Home className="w-16 h-16 mx-auto mb-4 opacity-30" />
                  <p className="font-semibold text-lg">No properties yet</p>
                  <p className="text-sm mb-6">Start by adding your first property listing.</p>
                  <Button className="bg-emerald-500 hover:bg-emerald-600 text-white gap-2" onClick={() => handleNav("upload")}>
                    <Plus className="w-4 h-4" /> Add Your First Property
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {properties.map(property => (
                    <div 
                      key={property.id} 
                      className="bg-white rounded-2xl p-4 border flex items-center gap-4 hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => {
                        setSelectedProperty(property);
                        setPropertyDetailsDialog(true);
                      }}
                    >
                      <div className="w-14 h-14 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
                        <Home className="w-7 h-7 text-emerald-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-gray-900 truncate">{property.title}</p>
                        <p className="text-sm text-gray-500">{property.propertyType} • {property.county} • {property.viewsCount || 0} views</p>
                        <p className="text-xs text-gray-400">{property.listingType} • {property.bedrooms ? `${property.bedrooms} bed` : ''} {property.bathrooms ? `${property.bathrooms} bath` : ''}</p>
                      </div>
                      {getStatusBadge(property.status)}
                      <div className="text-right shrink-0 hidden sm:block">
                        <p className="font-bold text-emerald-600">{formatPrice(property.price)}</p>
                        <p className="text-xs text-gray-400">price</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Upload Property */}
          {activeSection === "upload" && (
            <div className="max-w-2xl mx-auto">
              {!uploadDone ? (
                <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
                  <div className="bg-gray-50 border-b px-6 py-4">
                    <div className="flex items-center gap-2">
                      {uploadSteps.map((step, i) => (
                        <div key={step} className="flex items-center gap-2 flex-1">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${i <= uploadStep ? "bg-emerald-500 text-white" : "bg-gray-200 text-gray-500"}`}>
                            {i < uploadStep ? <CheckCircle className="w-4 h-4" /> : i + 1}
                          </div>
                          <span className={`text-xs hidden sm:block ${i === uploadStep ? "text-gray-900 font-semibold" : "text-gray-400"}`}>{step}</span>
                          {i < uploadSteps.length - 1 && <div className={`flex-1 h-0.5 ${i < uploadStep ? "bg-emerald-500" : "bg-gray-200"}`} />}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="p-6 space-y-4">
                    {uploadStep === 0 && (
                      <>
                        <h3 className="font-bold text-gray-900 text-lg">Basic Information</h3>
                        <Input 
                          placeholder="Property Title *" 
                          value={uploadForm.title} 
                          onChange={e => setUploadForm(f => ({ ...f, title: e.target.value }))} 
                        />
                        <Select onValueChange={v => setUploadForm(f => ({ ...f, propertyType: v }))}>
                          <SelectTrigger><SelectValue placeholder="Property Type *" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="HOUSE">House</SelectItem>
                            <SelectItem value="APARTMENT">Apartment</SelectItem>
                            <SelectItem value="LAND">Land</SelectItem>
                            <SelectItem value="COMMERCIAL">Commercial</SelectItem>
                            <SelectItem value="INDUSTRIAL">Industrial</SelectItem>
                          </SelectContent>
                        </Select>
                        <Select onValueChange={v => setUploadForm(f => ({ ...f, listingType: v }))}>
                          <SelectTrigger><SelectValue placeholder="Listing Type *" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="SALE">For Sale</SelectItem>
                            <SelectItem value="RENT">For Rent</SelectItem>
                          </SelectContent>
                        </Select>
                        <textarea 
                          className="w-full border rounded-xl p-3 text-sm resize-none h-24 focus:outline-none focus:ring-2 focus:ring-emerald-500" 
                          placeholder="Property Description *" 
                          value={uploadForm.description} 
                          onChange={e => setUploadForm(f => ({ ...f, description: e.target.value }))} 
                        />
                      </>
                    )}
                    {uploadStep === 1 && (
                      <>
                        <h3 className="font-bold text-gray-900 text-lg">Property Details</h3>
                        <div className="grid grid-cols-2 gap-4">
                          <Input 
                            type="number" 
                            placeholder="Price (KSh) *" 
                            value={uploadForm.price} 
                            onChange={e => setUploadForm(f => ({ ...f, price: e.target.value }))} 
                          />
                          
                          {/* Show bedrooms/bathrooms for HOUSE, APARTMENT, COMMERCIAL */}
                          {(uploadForm.propertyType === 'HOUSE' || uploadForm.propertyType === 'APARTMENT' || uploadForm.propertyType === 'COMMERCIAL') && (
                            <>
                              <Input 
                                type="number" 
                                placeholder="Bedrooms *" 
                                value={uploadForm.bedrooms} 
                                onChange={e => setUploadForm(f => ({ ...f, bedrooms: e.target.value }))} 
                              />
                              <Input 
                                type="number" 
                                placeholder="Bathrooms *" 
                                value={uploadForm.bathrooms} 
                                onChange={e => setUploadForm(f => ({ ...f, bathrooms: e.target.value }))} 
                              />
                              <Input 
                                type="number" 
                                placeholder="Floor Area (sqm) *" 
                                value={uploadForm.areaSqm} 
                                onChange={e => setUploadForm(f => ({ ...f, areaSqm: e.target.value }))} 
                              />
                            </>
                          )}
                          
                          {/* Show land size for LAND */}
                          {uploadForm.propertyType === 'LAND' && (
                            <Input 
                              type="number" 
                              placeholder="Land Size (sqm) *" 
                              value={uploadForm.landSizeSqm} 
                              onChange={e => setUploadForm(f => ({ ...f, landSizeSqm: e.target.value }))} 
                            />
                          )}
                          
                          {/* Show both for INDUSTRIAL */}
                          {uploadForm.propertyType === 'INDUSTRIAL' && (
                            <>
                              <Input 
                                type="number" 
                                placeholder="Building Area (sqm)" 
                                value={uploadForm.areaSqm} 
                                onChange={e => setUploadForm(f => ({ ...f, areaSqm: e.target.value }))} 
                              />
                              <Input 
                                type="number" 
                                placeholder="Total Land Size (sqm) *" 
                                value={uploadForm.landSizeSqm} 
                                onChange={e => setUploadForm(f => ({ ...f, landSizeSqm: e.target.value }))} 
                              />
                            </>
                          )}
                        </div>
                        
                        <Input 
                          placeholder="Full Address *" 
                          value={uploadForm.address} 
                          onChange={e => setUploadForm(f => ({ ...f, address: e.target.value }))} 
                        />
                        <div className="grid grid-cols-2 gap-4">
                          <Select onValueChange={v => {
                            setUploadForm(f => ({ ...f, county: v, subCounty: "" }));
                            setAvailableSubCounties(getSubCounties(v));
                          }}>
                            <SelectTrigger><SelectValue placeholder="County *" /></SelectTrigger>
                            <SelectContent>
                              {KENYAN_COUNTIES.map(county => (
                                <SelectItem key={county} value={county}>{county}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Select 
                            onValueChange={v => setUploadForm(f => ({ ...f, subCounty: v }))}
                            disabled={!uploadForm.county || availableSubCounties.length === 0}
                            value={uploadForm.subCounty}
                          >
                            <SelectTrigger><SelectValue placeholder="Sub County *" /></SelectTrigger>
                            <SelectContent>
                              {availableSubCounties.map(subCounty => (
                                <SelectItem key={subCounty} value={subCounty}>{subCounty}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </>
                    )}
                    {uploadStep === 2 && (
                      <>
                        <h3 className="font-bold text-gray-900 text-lg">Upload Images *</h3>
                        <p className="text-sm text-gray-500 mb-3">At least one image is required</p>
                        <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center">
                          <input
                            type="file"
                            multiple
                            accept="image/*,.pdf,.doc,.docx"
                            onChange={handleImageUpload}
                            className="hidden"
                            id="image-upload"
                          />
                          <label htmlFor="image-upload" className="cursor-pointer">
                            <ImageIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                            <p className="text-gray-500 font-medium">Click to upload files *</p>
                            <p className="text-xs text-gray-400 mt-1">Up to 10 files • Images, PDF, DOC, DOCX • Max 10MB each</p>
                            <p className="text-xs text-red-500 mt-1 font-medium">Required: At least 1 file</p>
                          </label>
                        </div>
                        {uploadImages.length > 0 && (
                          <div className="grid grid-cols-3 gap-3 mt-4">
                            {uploadImages.map((image, index) => (
                              <div key={index} className="relative">
                                <img 
                                  src={URL.createObjectURL(image)} 
                                  alt={`Upload ${index + 1}`}
                                  className="w-full h-20 object-cover rounded-lg"
                                />
                                <button
                                  onClick={() => removeImage(index)}
                                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600"
                                >
                                  ×
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                        {uploadImages.length === 0 && (
                          <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-700">
                            ⚠️ Please upload at least one property image to continue
                          </div>
                        )}
                      </>
                    )}
                    {uploadStep === 3 && (
                      <>
                        <h3 className="font-bold text-gray-900 text-lg">Review & Submit</h3>
                        <div className="space-y-3 bg-gray-50 rounded-xl p-4">
                          <div className="flex justify-between text-sm"><span className="text-gray-500">Title</span><span className="font-semibold text-right ml-4">{uploadForm.title || "—"}</span></div>
                          <div className="flex justify-between text-sm"><span className="text-gray-500">Type</span><span className="font-semibold">{uploadForm.propertyType || "—"}</span></div>
                          <div className="flex justify-between text-sm"><span className="text-gray-500">Listing</span><span className="font-semibold">{uploadForm.listingType || "—"}</span></div>
                          <div className="flex justify-between text-sm"><span className="text-gray-500">Price</span><span className="font-semibold">{uploadForm.price ? formatPrice(parseFloat(uploadForm.price)) : "—"}</span></div>
                          <div className="flex justify-between text-sm"><span className="text-gray-500">County</span><span className="font-semibold">{uploadForm.county || "—"}</span></div>
                          <div className="flex justify-between text-sm"><span className="text-gray-500">Images</span><span className="font-semibold">{uploadImages.length} uploaded</span></div>
                        </div>
                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-700">
                          <AlertCircle className="w-4 h-4 inline mr-1" /> Properties are reviewed by admin before going live (within 24 hrs).
                        </div>
                      </>
                    )}
                  </div>
                  <div className="px-6 pb-6 flex gap-3">
                    {uploadStep > 0 && (
                      <Button variant="outline" onClick={() => setUploadStep(s => s - 1)} className="gap-2">
                        <ChevronLeft className="w-4 h-4" /> Back
                      </Button>
                    )}
                    {uploadStep < uploadSteps.length - 1 ? (
                      <Button className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white gap-2" onClick={() => setUploadStep(s => s + 1)}>
                        Next <ChevronRight className="w-4 h-4" />
                      </Button>
                    ) : (
                      <Button className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white gap-2" onClick={handleUploadSubmit} disabled={uploadLoading}>
                        {uploadLoading ? <><Loader2 className="w-4 h-4 animate-spin" /> Submitting...</> : "Submit for Review"}
                      </Button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-2xl p-8 border shadow-sm text-center">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-emerald-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Property Submitted!</h3>
                  <p className="text-gray-500 mb-6">Your property will appear on the marketplace once approved (within 24 hours).</p>
                  <Button className="bg-emerald-500 hover:bg-emerald-600 text-white" onClick={() => { 
                    setUploadDone(false); 
                    setUploadStep(0); 
                    setUploadForm({
                      title: "", description: "", propertyType: "", listingType: "", price: "",
                      bedrooms: "", bathrooms: "", areaSqm: "", landSizeSqm: "", address: "",
                      county: "", subCounty: "", latitude: "", longitude: "", features: [], amenities: []
                    });
                    setUploadImages([]);
                  }}>
                    Add Another Property
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Inquiries */}
          {activeSection === "inquiries" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Property Inquiries</h2>
                {newInquiriesCount > 0 && (
                  <Badge className="bg-emerald-500 text-white">{newInquiriesCount} New</Badge>
                )}
              </div>
              
              {inquiriesLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                </div>
              ) : inquiries.length === 0 ? (
                <div className="text-center py-16 text-gray-400">
                  <AlertCircle className="w-16 h-16 mx-auto mb-4 opacity-30" />
                  <p className="font-semibold text-lg">No inquiries yet</p>
                  <p className="text-sm">When customers inquire about your properties, they'll appear here.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {inquiries.map(inquiry => (
                    <div key={inquiry.id} className={`bg-white rounded-2xl p-5 border ${inquiry.status === 'NEW' ? 'border-emerald-200 bg-emerald-50/30' : ''} hover:shadow-md transition-shadow`}>
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-bold text-gray-900">{inquiry.name}</p>
                            {inquiry.status === 'NEW' && (
                              <Badge className="bg-emerald-500 text-white text-xs">New</Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mb-1">Property: <span className="font-medium">{inquiry.propertyTitle}</span></p>
                          <p className="text-sm text-gray-500">{inquiry.email} • {inquiry.phone}</p>
                        </div>
                        <p className="text-xs text-gray-400">{new Date(inquiry.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3 mb-3">
                        <p className="text-sm text-gray-700">{inquiry.message}</p>
                      </div>
                      {inquiry.status === 'NEW' && (
                        <Button 
                          size="sm" 
                          className="bg-emerald-500 hover:bg-emerald-600 text-white text-xs"
                          onClick={() => handleMarkInquiryAsRead(inquiry.id)}
                        >
                          Mark as Read
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Booking Calendar */}
          {activeSection === "calendar" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Booking Calendar</h2>
                <Button 
                  className="bg-emerald-500 hover:bg-emerald-600 text-white gap-2"
                  onClick={() => setAvailabilityDialog(true)}
                >
                  <Plus className="w-4 h-4" /> Add Availability
                </Button>
              </div>

              {availabilityLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
                </div>
              ) : availabilitySlots.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-2xl border">
                  <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p className="font-semibold text-lg text-gray-700">No availability set</p>
                  <p className="text-sm text-gray-500 mb-4">Add your available time slots for property viewings</p>
                  <Button 
                    className="bg-emerald-500 hover:bg-emerald-600 text-white"
                    onClick={() => setAvailabilityDialog(true)}
                  >
                    <Plus className="w-4 h-4 mr-2" /> Add Availability
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {availabilitySlots.map(slot => (
                    <Card key={slot.id} className={`${slot.isAvailable ? 'border-emerald-200' : 'border-gray-200 opacity-60'}`}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <p className="font-bold text-gray-900">{new Date(slot.availableDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</p>
                            <p className="text-sm text-gray-600">{slot.startTime} - {slot.endTime}</p>
                          </div>
                          <Badge className={`${slot.isAvailable ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'} border-0 text-xs`}>
                            {slot.status}
                          </Badge>
                        </div>
                        <div className="mb-3">
                          <p className="text-xs text-gray-500">Property ID: {slot.propertyId}</p>
                          <p className="text-xs text-gray-500">Bookings: {slot.currentBookings}/{slot.maxBookings}</p>
                          {slot.notes && <p className="text-xs text-gray-600 mt-1">{slot.notes}</p>}
                        </div>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="w-full text-red-600 border-red-200 text-xs"
                          onClick={() => handleDeleteAvailability(slot.id)}
                        >
                          Delete
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Bookings */}
          {activeSection === "bookings" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Property Bookings</h2>
                {newBookingsCount > 0 && (
                  <Badge className="bg-emerald-500 text-white">{newBookingsCount} New</Badge>
                )}
              </div>

              {bookingsLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
                </div>
              ) : bookings.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-2xl border">
                  <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p className="font-semibold text-lg text-gray-700">No bookings yet</p>
                  <p className="text-sm text-gray-500">Customer bookings will appear here</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {bookings.map(booking => (
                    <div key={booking.id} className={`bg-white rounded-2xl p-5 border ${!booking.vendorNotified ? 'border-emerald-200 bg-emerald-50/30' : ''} hover:shadow-md transition-shadow`}>
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-bold text-gray-900">{booking.customerName}</p>
                            {!booking.vendorNotified && (
                              <Badge className="bg-emerald-500 text-white text-xs">New</Badge>
                            )}
                            <Badge className={`text-xs border-0 ${
                              booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' :
                              booking.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                              booking.status === 'CANCELLED' ? 'bg-red-100 text-red-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {booking.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-1">Property: <span className="font-medium">{booking.propertyTitle}</span></p>
                          <p className="text-sm text-gray-500">{booking.customerEmail} • {booking.customerPhone}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-gray-900">{new Date(booking.bookingDate).toLocaleDateString()}</p>
                          <p className="text-xs text-gray-500">{booking.bookingTime}</p>
                        </div>
                      </div>
                      {booking.message && (
                        <div className="bg-gray-50 rounded-lg p-3 mb-3">
                          <p className="text-sm text-gray-700">{booking.message}</p>
                        </div>
                      )}
                      <div className="flex gap-2">
                        {booking.status === 'PENDING' && (
                          <>
                            <Button 
                              size="sm" 
                              className="bg-emerald-500 hover:bg-emerald-600 text-white text-xs"
                              onClick={() => handleConfirmBooking(booking.id)}
                            >
                              Confirm
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="text-red-600 border-red-200 text-xs"
                              onClick={() => handleCancelBooking(booking.id)}
                            >
                              Cancel
                            </Button>
                          </>
                        )}
                        {booking.status === 'CONFIRMED' && (
                          <Badge className="bg-green-100 text-green-700 border-0">Confirmed for {new Date(booking.bookingDate).toLocaleDateString()}</Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Issues */}
          {activeSection === "issues" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">My Issues</h2>
                <Button className="bg-yellow-500 hover:bg-yellow-600 text-white gap-2 text-sm" onClick={() => setIssueDialog(true)}>
                  <Plus className="w-4 h-4" /> Submit Issue
                </Button>
              </div>
              {issues.length === 0 ? (
                <div className="text-center py-16 text-gray-400">
                  <CheckCircle className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p className="font-semibold">No issues submitted</p>
                  <p className="text-sm">Submit an issue if you encounter a problem.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {issues.map(issue => {
                    const statusMap = { pending: "bg-yellow-100 text-yellow-700", assigned: "bg-blue-100 text-blue-700", resolved: "bg-green-100 text-green-700", rejected: "bg-red-100 text-red-700" };
                    return (
                      <div key={issue.id} className="bg-white rounded-2xl border p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-mono text-xs text-gray-400">{issue.id}</span>
                              <Badge className={`text-xs border-0 ${statusMap[issue.status]}`}>{issue.status === "assigned" ? "In Review" : issue.status.charAt(0).toUpperCase() + issue.status.slice(1)}</Badge>
                            </div>
                            <p className="font-semibold text-gray-900">{issue.title}</p>
                            <p className="text-sm text-gray-500">{issue.category} • Submitted {issue.createdAt}</p>
                          </div>
                          <p className="text-xs text-gray-400 shrink-0">{issue.updatedAt}</p>
                        </div>
                        {issue.comments?.length > 0 && (
                          <div className="mt-3 border-t pt-3 space-y-2">
                            {issue.comments.map((c, i) => (
                              <div key={i} className="bg-blue-50 rounded-xl p-3 text-sm">
                                <p className="font-semibold text-xs text-blue-700 mb-0.5">{c.author} {c.analysisType ? `(${c.analysisType})` : ""}</p>
                                <p className="text-gray-700">{c.text}</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Analytics */}
          {activeSection === "analytics" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">Analytics</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { label: "Total Properties", value: properties.length.toString(), sub: "All listings" },
                  { label: "Active Properties", value: activeProperties.length.toString(), sub: "Live on marketplace" },
                  { label: "Pending Review", value: pendingProperties.length.toString(), sub: "Awaiting approval" },
                ].map(s => (
                  <Card key={s.label}><CardContent className="p-5">
                    <p className="text-2xl font-extrabold text-gray-900">{s.value}</p>
                    <p className="text-sm font-semibold text-gray-700 mt-1">{s.label}</p>
                    <p className="text-xs text-gray-400">{s.sub}</p>
                  </CardContent></Card>
                ))}
              </div>
              
              {properties.length === 0 ? (
                <div className="text-center py-16 text-gray-400">
                  <BarChart2 className="w-16 h-16 mx-auto mb-4 opacity-30" />
                  <p className="font-semibold text-lg">No analytics data yet</p>
                  <p className="text-sm mb-6">Add properties to see analytics and insights.</p>
                  <Button className="bg-emerald-500 hover:bg-emerald-600 text-white gap-2" onClick={() => handleNav("upload")}>
                    <Plus className="w-4 h-4" /> Add Your First Property
                  </Button>
                </div>
              ) : (
                <Card>
                  <CardHeader><CardTitle className="text-base">Property Performance</CardTitle></CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {properties.map(property => (
                        <div key={property.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-semibold text-sm">{property.title}</p>
                            <p className="text-xs text-gray-500">{property.propertyType} • {property.county}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-bold text-gray-900">{property.viewsCount || 0} views</p>
                            {getStatusBadge(property.status)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Settings */}
          {activeSection === "settings" && (
            <div className="max-w-lg space-y-6">
              <Card>
                <CardHeader><CardTitle>Vendor Settings</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <Input placeholder="Business Name" defaultValue="Property Vendor" />
                  <Input placeholder="Contact Email" defaultValue="vendor@properties.com" />
                  <Input placeholder="Phone Number" />
                  <Button className="bg-emerald-500 hover:bg-emerald-600 text-white w-full">Save Changes</Button>
                </CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle>Property Preferences</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Email notifications for new inquiries</span>
                    <input type="checkbox" defaultChecked className="rounded" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">SMS alerts for property approvals</span>
                    <input type="checkbox" defaultChecked className="rounded" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Weekly performance reports</span>
                    <input type="checkbox" className="rounded" />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>

      {/* Issue Submit Dialog */}
      <Dialog open={issueDialog} onOpenChange={setIssueDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Submit an Issue</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <Input placeholder="Issue Title *" value={issueForm.title} onChange={e => setIssueForm(f => ({ ...f, title: e.target.value }))} autoFocus />
            <Select onValueChange={v => setIssueForm(f => ({ ...f, category: v }))}>
              <SelectTrigger><SelectValue placeholder="Category" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Property">Property Issue</SelectItem>
                <SelectItem value="Payment">Payment Issue</SelectItem>
                <SelectItem value="Technical">Technical Problem</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
            <Select onValueChange={v => setIssueForm(f => ({ ...f, priority: v }))} defaultValue="medium">
              <SelectTrigger><SelectValue placeholder="Priority" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="high">High Priority</SelectItem>
                <SelectItem value="medium">Medium Priority</SelectItem>
                <SelectItem value="low">Low Priority</SelectItem>
              </SelectContent>
            </Select>
            <textarea
              className="w-full border rounded-xl p-3 text-sm resize-none h-24 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              placeholder="Describe the issue in detail *"
              value={issueForm.description}
              onChange={e => setIssueForm(f => ({ ...f, description: e.target.value }))}
            />
          </div>
          <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-3 text-xs text-yellow-700">
            ⚠️ Your issue will be reviewed by Admin and may be assigned to the Support team.
          </div>
          <Button className="w-full bg-yellow-500 hover:bg-yellow-600 text-white mt-2" onClick={handleSubmitIssue}>
            Submit Issue
          </Button>
        </DialogContent>
      </Dialog>

      {/* Property Details Dialog */}
      <Dialog open={propertyDetailsDialog} onOpenChange={setPropertyDetailsDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Property Details</DialogTitle>
          </DialogHeader>
          {selectedProperty && (
            <div className="space-y-4">
              {/* Property Images */}
              {selectedProperty.images && selectedProperty.images.length > 0 && (
                <div className="grid grid-cols-2 gap-2">
                  {selectedProperty.images.slice(0, 4).map((image, index) => (
                    <img 
                      key={index}
                      src={image} 
                      alt={`${selectedProperty.title} ${index + 1}`}
                      className="w-full h-40 object-cover rounded-lg"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/400x300?text=Property+Image';
                      }}
                    />
                  ))}
                </div>
              )}
              
              {/* Property Info */}
              <div className="space-y-3">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">{selectedProperty.title}</h3>
                  <p className="text-emerald-600 font-bold text-xl mt-1">{formatPrice(selectedProperty.price)}</p>
                </div>
                
                <div className="flex items-center gap-2">
                  {getStatusBadge(selectedProperty.status)}
                  <Badge className="bg-gray-100 text-gray-700 border-0">{selectedProperty.propertyType}</Badge>
                  <Badge className="bg-blue-100 text-blue-700 border-0">{selectedProperty.listingType}</Badge>
                </div>
                
                {/* Property Stats */}
                <div className="grid grid-cols-3 gap-3 py-3 border-y">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900">{selectedProperty.viewsCount || 0}</p>
                    <p className="text-xs text-gray-500">Views</p>
                  </div>
                  {selectedProperty.bedrooms && (
                    <div className="text-center">
                      <p className="text-2xl font-bold text-gray-900">{selectedProperty.bedrooms}</p>
                      <p className="text-xs text-gray-500">Bedrooms</p>
                    </div>
                  )}
                  {selectedProperty.bathrooms && (
                    <div className="text-center">
                      <p className="text-2xl font-bold text-gray-900">{selectedProperty.bathrooms}</p>
                      <p className="text-xs text-gray-500">Bathrooms</p>
                    </div>
                  )}
                </div>
                
                {/* Description */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Description</h4>
                  <p className="text-gray-600 text-sm">{selectedProperty.description || "No description provided"}</p>
                </div>
                
                {/* Property Details */}
                <div className="grid grid-cols-2 gap-3 bg-gray-50 rounded-lg p-4">
                  <div>
                    <p className="text-xs text-gray-500">Location</p>
                    <p className="font-semibold text-sm">{selectedProperty.county}, {selectedProperty.subCounty}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Address</p>
                    <p className="font-semibold text-sm">{selectedProperty.address}</p>
                  </div>
                  {selectedProperty.areaSqm && (
                    <div>
                      <p className="text-xs text-gray-500">Floor Area</p>
                      <p className="font-semibold text-sm">{selectedProperty.areaSqm} sqm</p>
                    </div>
                  )}
                  {selectedProperty.landSizeSqm && (
                    <div>
                      <p className="text-xs text-gray-500">Land Size</p>
                      <p className="font-semibold text-sm">{selectedProperty.landSizeSqm} sqm</p>
                    </div>
                  )}
                </div>
                
                {/* Inquiry Count */}
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-emerald-600" />
                    <span className="text-sm font-medium text-gray-700">Property Inquiries</span>
                  </div>
                  <span className="text-lg font-bold text-emerald-600">
                    {inquiries.filter(inq => inq.propertyId === selectedProperty.id).length}
                  </span>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Availability Dialog */}
      <Dialog open={availabilityDialog} onOpenChange={setAvailabilityDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Availability Slot</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block">Property</label>
              <Select 
                value={availabilityForm.propertyId} 
                onValueChange={(value) => setAvailabilityForm({...availabilityForm, propertyId: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select property" />
                </SelectTrigger>
                <SelectContent>
                  {properties.map(prop => (
                    <SelectItem key={prop.id} value={prop.id.toString()}>
                      {prop.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block">Date</label>
              <Input 
                type="date" 
                value={availabilityForm.availableDate}
                onChange={(e) => setAvailabilityForm({...availabilityForm, availableDate: e.target.value})}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">Start Time</label>
                <Input 
                  type="time" 
                  value={availabilityForm.startTime}
                  onChange={(e) => setAvailabilityForm({...availabilityForm, startTime: e.target.value})}
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">End Time</label>
                <Input 
                  type="time" 
                  value={availabilityForm.endTime}
                  onChange={(e) => setAvailabilityForm({...availabilityForm, endTime: e.target.value})}
                />
              </div>
            </div>
            
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block">Max Bookings</label>
              <Input 
                type="number" 
                min="1"
                value={availabilityForm.maxBookings}
                onChange={(e) => setAvailabilityForm({...availabilityForm, maxBookings: parseInt(e.target.value)})}
              />
            </div>
            
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block">Notes (Optional)</label>
              <Input 
                placeholder="e.g., Morning slot, Open house"
                value={availabilityForm.notes}
                onChange={(e) => setAvailabilityForm({...availabilityForm, notes: e.target.value})}
              />
            </div>
            
            <div className="flex gap-2 pt-3">
              <Button 
                className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white"
                onClick={handleCreateAvailability}
              >
                Create Availability
              </Button>
              <Button 
                variant="outline"
                className="flex-1"
                onClick={() => setAvailabilityDialog(false)}
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