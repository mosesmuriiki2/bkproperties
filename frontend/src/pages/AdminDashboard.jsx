import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import {
  Shield, Users, TrendingUp, DollarSign, Eye, BookOpen, CheckCircle, Clock, XCircle,
  BarChart2, Settings, LogOut, Download, AlertTriangle, UserPlus, Headphones, ChevronRight,
  Globe, Menu, X, Bell, List, MessageSquare, Edit2, Home as HomeIcon, Loader2
} from "lucide-react";
import { createPageUrl } from "@/utils";
import { getIssues, updateIssue, addComment, getModuleConfig, saveModuleConfig } from "@/lib/issueStore";
import { toast } from "sonner";
import UserManagement from "@/components/admin/UserManagement";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import apiClient from "@/api/apiClient";

const trafficData = [
  { month: "Sep", visitors: 12400, bookings: 340 },
  { month: "Oct", visitors: 18200, bookings: 520 },
  { month: "Nov", visitors: 22800, bookings: 690 },
  { month: "Dec", visitors: 31000, bookings: 940 },
  { month: "Jan", visitors: 28500, bookings: 820 },
  { month: "Feb", visitors: 35200, bookings: 1100 },
];

const revenueData = [
  { month: "Sep", revenue: 48000, commission: 7200 },
  { month: "Oct", revenue: 67000, commission: 10050 },
  { month: "Nov", revenue: 82000, commission: 12300 },
  { month: "Dec", revenue: 115000, commission: 17250 },
  { month: "Jan", revenue: 98000, commission: 14700 },
  { month: "Feb", revenue: 134000, commission: 20100 },
];

const categoryData = [
  { name: "Tours", value: 35, color: "#10b981" },
  { name: "Hotels", value: 28, color: "#3b82f6" },
  { name: "Cars", value: 18, color: "#f59e0b" },
  { name: "Land", value: 11, color: "#ef4444" },
  { name: "Houses", value: 8, color: "#8b5cf6" },
];

const allVendors = [
  { name: "Bonfire Adventures", category: "Tours", status: "approved", model: "commission", integration: "api", revenue: 48200, bookings: 312 },
  { name: "SafariBookings Kenya", category: "Tours", status: "approved", model: "commission", integration: "api", revenue: 31600, bookings: 198 },
  { name: "Voyager Hotel", category: "Hotels", status: "approved", model: "pay_per_click", integration: "portal", revenue: 22400, bookings: 87 },
  { name: "Kiambu Motors", category: "Cars", status: "pending", model: "commission", integration: "portal", revenue: 0, bookings: 0 },
  { name: "Optiven Limited", category: "Land", status: "approved", model: "commission", integration: "api", revenue: 18900, bookings: 24 },
  { name: "Land Lens Kenya", category: "Land", status: "suspended", model: "pay_per_click", integration: "portal", revenue: 0, bookings: 0 },
  { name: "Karen Estates", category: "Properties", status: "approved", model: "commission", integration: "portal", revenue: 12800, bookings: 31 },
  { name: "Diani Reef Resorts", category: "Hotels", status: "pending", model: "commission", integration: "portal", revenue: 0, bookings: 0 },
];

const allListings = [
  { id: 1, title: "Masai Mara Safari – 3 Days", vendor: "Bonfire Adventures", category: "Tours", status: "active", views: 1240, bookings: 32 },
  { id: 2, title: "Executive Suite Room", vendor: "Voyager Hotel", category: "Hotels", status: "active", views: 876, bookings: 18 },
  { id: 3, title: "Toyota Landcruiser Hire", vendor: "Kiambu Motors", category: "Cars", status: "pending", views: 0, bookings: 0 },
  { id: 4, title: "50x100 Plot – Thika Road", vendor: "Optiven Limited", category: "Land", status: "active", views: 540, bookings: 8 },
  { id: 5, title: "Karen Luxury Villa – 5BR", vendor: "Karen Estates", category: "Properties", status: "active", views: 320, bookings: 5 },
];

const navItems = [
  { id: "overview", label: "Overview", icon: BarChart2 },
  { id: "properties", label: "Property Management", icon: HomeIcon },
  { id: "inquiries", label: "Property Inquiries", icon: MessageSquare },
  { id: "vendors", label: "Vendor Management", icon: Users },
  { id: "listings", label: "Listings", icon: List },
  { id: "issues", label: "Issue Management", icon: AlertTriangle },
  { id: "users", label: "User Management", icon: UserPlus },
  { id: "analytics", label: "Analytics & Traffic", icon: TrendingUp },
  { id: "revenue", label: "Revenue", icon: DollarSign },
  { id: "support", label: "Support Portal", icon: Headphones },
  { id: "settings", label: "System Settings", icon: Settings },
];

const statusConfig = {
  approved: { label: "Approved", color: "bg-green-100 text-green-700" },
  pending: { label: "Pending", color: "bg-yellow-100 text-yellow-700" },
  suspended: { label: "Suspended", color: "bg-red-100 text-red-700" },
  active: { label: "Active", color: "bg-green-100 text-green-700" },
};



const exportCSV = (data, filename) => {
  if (!data.length) return;
  const keys = Object.keys(data[0]);
  const csv = [keys.join(","), ...data.map(row => keys.map(k => `"${row[k]}"`).join(","))].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
};

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [portalName, setPortalName] = useState("BK Properties");
  const [editingLogo, setEditingLogo] = useState(false);
  const [logoInput, setLogoInput] = useState("");
  const [vendors, setVendors] = useState(allVendors);
  const [issues, setIssues] = useState([]);
  const [moduleConfig, setModuleConfig] = useState(getModuleConfig());
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [adminComment, setAdminComment] = useState("");
  const [properties, setProperties] = useState([]);
  const [propertiesLoading, setPropertiesLoading] = useState(false);
  const [vendorsData, setVendorsData] = useState([]);
  const [vendorsLoading, setVendorsLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [inquiries, setInquiries] = useState([]);
  const [inquiriesLoading, setInquiriesLoading] = useState(false);
  const [newInquiriesCount, setNewInquiriesCount] = useState(0);
  const [selectedPropertyDetails, setSelectedPropertyDetails] = useState(null);
  const [propertyDetailsDialog, setPropertyDetailsDialog] = useState(false);
  const [stats, setStats] = useState({
    totalProperties: 0,
    pendingProperties: 0,
    activeProperties: 0,
    totalVendors: 0,
    pendingVendors: 0,
    approvedVendors: 0,
    totalUsers: 0,
    totalRevenue: 0
  });

  // Guard: redirect to login if not authenticated
  useEffect(() => {
    if (!sessionStorage.getItem("mg_admin_auth")) {
      navigate("/AdminLogin");
    }
  }, [navigate]);

  useEffect(() => { setIssues(getIssues()); setModuleConfig(getModuleConfig()); }, [activeSection]);

  // Load data when section changes
  useEffect(() => {
    if (activeSection === "properties") {
      loadProperties();
    } else if (activeSection === "vendors") {
      loadVendors();
    } else if (activeSection === "inquiries") {
      loadInquiries();
    } else if (activeSection === "listings") {
      loadAllListings();
    } else if (activeSection === "overview") {
      loadDashboardStats();
    }
  }, [activeSection]);

  const loadDashboardStats = async () => {
    try {
      // Load properties stats
      const propsResponse = await apiClient.properties.getPending(0, 1);
      const activePropsResponse = await apiClient.properties.getActive(0, 1);
      
      setStats(prev => ({
        ...prev,
        totalProperties: (propsResponse.totalElements || 0) + (activePropsResponse.totalElements || 0),
        pendingProperties: propsResponse.totalElements || 0,
        activeProperties: activePropsResponse.totalElements || 0
      }));
    } catch (error) {
      console.error("Error loading dashboard stats:", error);
    }
  };

  const loadProperties = async () => {
    setPropertiesLoading(true);
    try {
      const response = await apiClient.properties.getPending(0, 50);
      setProperties(response.content || []);
      
      // Update stats
      setStats(prev => ({
        ...prev,
        pendingProperties: response.totalElements || response.content?.length || 0
      }));
    } catch (error) {
      console.error("Error loading properties:", error);
      toast.error("Failed to load properties");
      setProperties([]);
    } finally {
      setPropertiesLoading(false);
    }
  };

  const loadVendors = async () => {
    setVendorsLoading(true);
    try {
      const response = await apiClient.vendors.getAll(0, 50);
      console.log("Vendors response:", response);
      
      // Handle both array and paginated response
      if (Array.isArray(response)) {
        setVendorsData(response);
      } else if (response.content) {
        setVendorsData(response.content);
      } else if (response.data) {
        setVendorsData(Array.isArray(response.data) ? response.data : response.data.content || []);
      } else {
        setVendorsData([]);
      }
    } catch (error) {
      console.error("Error loading vendors:", error);
      toast.error("Failed to load vendors");
      setVendorsData([]);
    } finally {
      setVendorsLoading(false);
    }
  };

  const loadInquiries = async () => {
    setInquiriesLoading(true);
    try {
      const response = await apiClient.inquiries.getAll(0, 100);
      setInquiries(response.content || response || []);
      
      // Count new inquiries
      const newCount = await apiClient.inquiries.countNew();
      setNewInquiriesCount(newCount);
    } catch (error) {
      console.error("Error loading inquiries:", error);
      toast.error("Failed to load inquiries");
      setInquiries([]);
    } finally {
      setInquiriesLoading(false);
    }
  };

  const handleApproveProperty = async (propertyId) => {
    try {
      await apiClient.properties.approve(propertyId);
      toast.success("Property approved successfully");
      loadProperties();
      loadDashboardStats();
    } catch (error) {
      console.error("Error approving property:", error);
      toast.error("Failed to approve property");
    }
  };

  const handleRejectProperty = async (propertyId) => {
    const reason = prompt("Enter rejection reason:");
    if (!reason) return;
    
    try {
      await apiClient.properties.reject(propertyId, reason);
      toast.success("Property rejected");
      loadProperties();
      loadDashboardStats();
    } catch (error) {
      console.error("Error rejecting property:", error);
      toast.error("Failed to reject property");
    }
  };

  const loadAllListings = async () => {
    setPropertiesLoading(true);
    try {
      // Load ALL properties (not just pending)
      const response = await apiClient.properties.getAll({ page: 0, size: 100 });
      console.log("All listings response:", response);
      setProperties(response.content || []);
    } catch (error) {
      console.error("Error loading all listings:", error);
      toast.error("Failed to load listings");
      setProperties([]);
    } finally {
      setPropertiesLoading(false);
    }
  };

  const handleViewPropertyDetails = (property) => {
    setSelectedPropertyDetails(property);
    setPropertyDetailsDialog(true);
  };

  const handleDelistProperty = async (propertyId) => {
    if (!confirm("Are you sure you want to delist this property?")) return;
    
    try {
      await apiClient.properties.changeStatus(propertyId, "INACTIVE");
      toast.success("Property delisted successfully");
      loadAllListings();
    } catch (error) {
      console.error("Error delisting property:", error);
      toast.error("Failed to delist property");
    }
  };

  const formatPrice = (price) => {
    if (!price) return "KSh 0";
    return `KSh ${Number(price).toLocaleString()}`;
  };

  const handleApproveVendor = async (vendorId) => {
    try {
      await apiClient.vendors.approve(vendorId);
      toast.success("Vendor approved successfully");
      loadVendors();
      loadDashboardStats();
    } catch (error) {
      console.error("Error approving vendor:", error);
      toast.error("Failed to approve vendor");
    }
  };

  const handleRejectVendor = async (vendorId) => {
    const reason = prompt("Enter rejection reason:");
    if (!reason) return;
    
    try {
      await apiClient.vendors.reject(vendorId, reason);
      toast.success("Vendor rejected");
      loadVendors();
      loadDashboardStats();
    } catch (error) {
      console.error("Error rejecting vendor:", error);
      toast.error("Failed to reject vendor");
    }
  };

  const refreshIssues = () => setIssues(getIssues());

  const handleAssignToSupport = (id) => {
    updateIssue(id, { status: "assigned", assignedTo: "Support Team", logEntry: { action: "Assigned to Support Team", by: "Admin", time: new Date().toISOString().split("T")[0] } });
    refreshIssues();
    if (selectedIssue?.id === id) setSelectedIssue(null);
    toast && toast.success ? toast.success("Assigned to Support Team.") : null;
  };

  const handleRejectIssue = (id) => {
    updateIssue(id, { status: "rejected", logEntry: { action: "Rejected by Admin", by: "Admin", time: new Date().toISOString().split("T")[0] } });
    refreshIssues();
    setSelectedIssue(null);
  };

  const handleApproveResolution = (id) => {
    updateIssue(id, { status: "resolved", logEntry: { action: "Resolution approved by Admin", by: "Admin", time: new Date().toISOString().split("T")[0] } });
    refreshIssues();
    setSelectedIssue(null);
  };

  const handleAdminComment = (id) => {
    if (!adminComment.trim()) return;
    addComment(id, { author: "Admin", text: adminComment, time: new Date().toISOString().split("T")[0] });
    setAdminComment("");
    refreshIssues();
  };

  const handleModuleToggle = (key) => {
    const updated = { ...moduleConfig, [key]: !moduleConfig[key] };
    setModuleConfig(updated);
    saveModuleConfig(updated);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("mg_admin_auth");
    navigate("/AdminLogin");
  };

  const pendingIssues = issues.filter(i => i.status === "pending").length;
  const approved = vendors.filter(v => v.status === "approved").length;
  const pending = vendors.filter(v => v.status === "pending").length;
  const suspended = vendors.filter(v => v.status === "suspended").length;

  const handleNav = (id) => { setActiveSection(id); setSidebarOpen(false); };

  const updateVendorStatus = (name, status) => {
    setVendors(vs => vs.map(v => v.name === name ? { ...v, status } : v));
  };

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
            <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center shrink-0">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              {editingLogo ? (
                <input
                  className="bg-white/10 text-white text-sm font-bold rounded px-2 py-0.5 w-full focus:outline-none focus:ring-1 focus:ring-red-400"
                  value={logoInput}
                  onChange={e => setLogoInput(e.target.value)}
                  onBlur={() => { setPortalName(logoInput || portalName); setEditingLogo(false); }}
                  onKeyDown={e => { if (e.key === "Enter") { setPortalName(logoInput || portalName); setEditingLogo(false); } }}
                  autoFocus
                />
              ) : (
                <div className="flex items-center gap-1 group cursor-pointer" onClick={() => { setLogoInput(portalName); setEditingLogo(true); }}>
                  <p className="text-white font-bold text-sm truncate">{portalName}</p>
                  <Edit2 className="w-3 h-3 text-gray-500 group-hover:text-gray-300 shrink-0" />
                </div>
              )}
              <p className="text-gray-400 text-xs">Admin Portal</p>
            </div>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-1 text-gray-400 hover:text-white shrink-0">
            <X className="w-5 h-5" />
          </button>
        </div>
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => handleNav(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors ${activeSection === item.id ? "bg-white/10 text-white" : "text-gray-400 hover:bg-white/5 hover:text-white"}`}
            >
              <item.icon className="w-4 h-4 shrink-0" />
              <span>{item.label}</span>
              {item.id === "vendors" && pending > 0 && (
                <span className="ml-auto bg-amber-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{pending}</span>
              )}
              {item.id === "issues" && pendingIssues > 0 && (
                <span className="ml-auto bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{pendingIssues}</span>
              )}
            </button>
          ))}
        </nav>
        <div className="p-3 border-t border-white/10 space-y-1 flex-shrink-0">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors">
            <LogOut className="w-4 h-4 shrink-0" /><span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main content — scrollable */}
      <div className="flex-1 flex flex-col overflow-auto">
        {/* Top bar */}
        <div className="bg-white border-b px-4 lg:px-6 py-4 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors lg:hidden">
              <Menu className="w-5 h-5 text-gray-600" />
            </button>
            <h1 className="font-bold text-gray-900">{navItems.find(n => n.id === activeSection)?.label}</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-2 text-xs hidden sm:flex" onClick={() => exportCSV(vendors, "vendors-report.csv")}>
              <Download className="w-3.5 h-3.5" /> Export CSV
            </Button>
            <Badge className="bg-red-100 text-red-700 border-red-200">🔐 Super Admin</Badge>
          </div>
        </div>

        <div className="flex-1 p-4 lg:p-6">
          {/* Overview */}
          {activeSection === "overview" && (
            <div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mb-6">
                {[
                  { label: "Total Properties", value: stats.totalProperties.toString(), sub: `${stats.pendingProperties} pending approval`, icon: HomeIcon, bg: "bg-emerald-500", link: "properties", trend: "+12%" },
                  { label: "Total Vendors", value: stats.totalVendors || vendors.length, sub: `${stats.pendingVendors || pending} pending`, icon: Users, bg: "bg-blue-500", link: "vendors", trend: "+25%" },
                  { label: "Active Listings", value: stats.activeProperties.toString(), sub: "Approved properties", icon: BookOpen, bg: "bg-purple-500", link: "listings", trend: "+8%" },
                  { label: "Total Revenue", value: "KSh 544K", sub: "Feb commission: KSh 20K", icon: DollarSign, bg: "bg-amber-500", link: "revenue", trend: "+37%" },
                ].map(s => (
                  <Card key={s.label} className="cursor-pointer hover:shadow-lg transition-all hover:-translate-y-0.5 overflow-hidden" onClick={() => handleNav(s.link)}>
                    <CardContent className="p-0">
                      <div className={`${s.bg} p-4`}>
                        <div className="flex items-center justify-between mb-2">
                          <s.icon className="w-5 h-5 text-white/90" />
                          <span className="text-white/80 text-xs font-semibold bg-white/20 px-2 py-0.5 rounded-full">{s.trend}</span>
                        </div>
                        <p className="text-xl lg:text-2xl font-extrabold text-white">{s.value}</p>
                      </div>
                      <div className="px-4 py-3">
                        <p className="text-sm font-semibold text-gray-800">{s.label}</p>
                        <p className="text-xs text-gray-400">{s.sub}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-3 mb-6">
                {[
                  { label: "Approved Vendors", count: approved, color: "bg-green-50 border-green-200", text: "text-green-700", icon: CheckCircle },
                  { label: "Pending Approval", count: pending, color: "bg-yellow-50 border-yellow-200", text: "text-yellow-700", icon: Clock },
                  { label: "Suspended", count: suspended, color: "bg-red-50 border-red-200", text: "text-red-700", icon: XCircle },
                ].map(s => (
                  <div key={s.label} className={`${s.color} border rounded-2xl p-4 text-center cursor-pointer hover:shadow-md transition-shadow`} onClick={() => handleNav("vendors")}>
                    <s.icon className={`w-7 h-7 ${s.text} mx-auto mb-1`} />
                    <p className={`text-2xl lg:text-3xl font-extrabold ${s.text}`}>{s.count}</p>
                    <p className={`text-xs lg:text-sm ${s.text}`}>{s.label}</p>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2">
                  <CardHeader><CardTitle className="text-base">Monthly Traffic & Bookings</CardTitle></CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={240}>
                      <BarChart data={trafficData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="month" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip />
                        <Bar dataKey="visitors" fill="#10b981" radius={[4,4,0,0]} name="Visitors" />
                        <Bar dataKey="bookings" fill="#3b82f6" radius={[4,4,0,0]} name="Bookings" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader><CardTitle className="text-base">Bookings by Category</CardTitle></CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={150}>
                      <PieChart>
                        <Pie data={categoryData} cx="50%" cy="50%" innerRadius={40} outerRadius={65} dataKey="value">
                          {categoryData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                        </Pie>
                        <Tooltip formatter={v => `${v}%`} />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="space-y-1 mt-2">
                      {categoryData.map(c => (
                        <div key={c.name} className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: c.color }} /><span className="text-gray-600">{c.name}</span></div>
                          <span className="font-semibold">{c.value}%</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Property Management */}
          {activeSection === "properties" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Property Management</h2>
                <Badge className="bg-yellow-100 text-yellow-700 border-0">
                  {stats.pendingProperties} Pending Approval
                </Badge>
              </div>

              {propertiesLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
                </div>
              ) : properties.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-2xl border">
                  <HomeIcon className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p className="text-gray-500">No pending properties</p>
                </div>
              ) : (
                <div className="bg-white rounded-2xl border shadow-sm overflow-x-auto">
                  <table className="w-full text-sm min-w-[900px]">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="text-left p-4 font-semibold text-gray-600">Property</th>
                        <th className="text-left p-4 font-semibold text-gray-600">Vendor</th>
                        <th className="text-left p-4 font-semibold text-gray-600">Type</th>
                        <th className="text-left p-4 font-semibold text-gray-600">Location</th>
                        <th className="text-left p-4 font-semibold text-gray-600">Price</th>
                        <th className="text-left p-4 font-semibold text-gray-600">Images</th>
                        <th className="text-left p-4 font-semibold text-gray-600">Status</th>
                        <th className="text-left p-4 font-semibold text-gray-600">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {properties.map(property => (
                        <tr key={property.id} className="hover:bg-gray-50 transition-colors">
                          <td className="p-4">
                            <p className="font-semibold text-gray-900">{property.title}</p>
                            <p className="text-xs text-gray-500 line-clamp-1">{property.description}</p>
                          </td>
                          <td className="p-4 text-gray-600 text-xs">Vendor #{property.vendorId}</td>
                          <td className="p-4">
                            <Badge className="bg-blue-100 text-blue-700 text-xs border-0">
                              {property.propertyType}
                            </Badge>
                            <Badge className="bg-purple-100 text-purple-700 text-xs border-0 ml-1">
                              {property.listingType}
                            </Badge>
                          </td>
                          <td className="p-4 text-gray-600 text-xs">
                            {property.county}
                            {property.subCounty && `, ${property.subCounty}`}
                          </td>
                          <td className="p-4 font-semibold text-emerald-600">
                            {formatPrice(property.price)}
                          </td>
                          <td className="p-4">
                            {property.images && property.images.length > 0 ? (
                              <div className="flex items-center gap-2">
                                <img 
                                  src={property.images[0]} 
                                  alt={property.title}
                                  className="w-12 h-12 rounded object-cover"
                                  onError={(e) => {
                                    e.target.src = 'https://via.placeholder.com/48?text=No+Image';
                                  }}
                                />
                                <span className="text-xs text-gray-500">
                                  {property.images.length} image{property.images.length > 1 ? 's' : ''}
                                </span>
                              </div>
                            ) : (
                              <span className="text-xs text-gray-400">No images</span>
                            )}
                          </td>
                          <td className="p-4">
                            <Badge className="bg-yellow-100 text-yellow-700 text-xs border-0">
                              {property.status}
                            </Badge>
                          </td>
                          <td className="p-4">
                            <div className="flex gap-1.5">
                              <Button 
                                size="sm" 
                                className="bg-green-500 hover:bg-green-600 text-white text-xs h-7"
                                onClick={() => handleApproveProperty(property.id)}
                              >
                                Approve
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="text-red-600 border-red-200 text-xs h-7"
                                onClick={() => handleRejectProperty(property.id)}
                              >
                                Reject
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="text-xs h-7"
                                onClick={() => window.open(`/property/${property.id}`, '_blank')}
                              >
                                View
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Property Inquiries */}
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
                  <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
                </div>
              ) : inquiries.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-2xl border">
                  <MessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p className="text-gray-500">No inquiries yet</p>
                </div>
              ) : (
                <div className="bg-white rounded-2xl border shadow-sm overflow-x-auto">
                  <table className="w-full text-sm min-w-[900px]">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="text-left p-4 font-semibold text-gray-600">Customer</th>
                        <th className="text-left p-4 font-semibold text-gray-600">Property</th>
                        <th className="text-left p-4 font-semibold text-gray-600">Contact</th>
                        <th className="text-left p-4 font-semibold text-gray-600">Message</th>
                        <th className="text-left p-4 font-semibold text-gray-600">Vendor</th>
                        <th className="text-left p-4 font-semibold text-gray-600">Status</th>
                        <th className="text-left p-4 font-semibold text-gray-600">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {inquiries.map(inquiry => (
                        <tr key={inquiry.id} className={`hover:bg-gray-50 transition-colors ${inquiry.status === 'NEW' ? 'bg-emerald-50/30' : ''}`}>
                          <td className="p-4">
                            <p className="font-semibold text-gray-900">{inquiry.name}</p>
                            {inquiry.status === 'NEW' && (
                              <Badge className="bg-emerald-500 text-white text-xs mt-1">New</Badge>
                            )}
                          </td>
                          <td className="p-4">
                            <p className="font-medium text-gray-900 text-xs">{inquiry.propertyTitle}</p>
                            <p className="text-xs text-gray-500">ID: {inquiry.propertyId}</p>
                          </td>
                          <td className="p-4 text-xs text-gray-600">
                            <p>{inquiry.email}</p>
                            <p>{inquiry.phone}</p>
                          </td>
                          <td className="p-4">
                            <p className="text-xs text-gray-700 line-clamp-2 max-w-xs">{inquiry.message}</p>
                          </td>
                          <td className="p-4 text-xs text-gray-600">
                            Vendor #{inquiry.vendorId}
                          </td>
                          <td className="p-4">
                            <Badge className={`text-xs border-0 ${
                              inquiry.status === 'NEW' ? 'bg-emerald-100 text-emerald-700' :
                              inquiry.status === 'READ' ? 'bg-blue-100 text-blue-700' :
                              inquiry.status === 'RESPONDED' ? 'bg-purple-100 text-purple-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {inquiry.status}
                            </Badge>
                          </td>
                          <td className="p-4 text-xs text-gray-500">
                            {new Date(inquiry.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Vendor Management */}
          {activeSection === "vendors" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Vendor Management</h2>
                <div className="flex gap-2">
                  <Badge className="bg-yellow-100 text-yellow-700 border-0">
                    {vendorsData.filter(v => v.status === "PENDING").length} Pending
                  </Badge>
                  <Button className="bg-emerald-500 hover:bg-emerald-600 text-white gap-2 text-sm">
                    <UserPlus className="w-4 h-4" /> Add Vendor
                  </Button>
                </div>
              </div>

              {vendorsLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
                </div>
              ) : vendorsData.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-2xl border">
                  <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p className="text-gray-500">No vendors found</p>
                </div>
              ) : (
                <div className="bg-white rounded-2xl border shadow-sm overflow-x-auto">
                  <table className="w-full text-sm min-w-[800px]">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="text-left p-4 font-semibold text-gray-600">Business Name</th>
                        <th className="text-left p-4 font-semibold text-gray-600">Contact</th>
                        <th className="text-left p-4 font-semibold text-gray-600">Property Type</th>
                        <th className="text-left p-4 font-semibold text-gray-600">Location</th>
                        <th className="text-left p-4 font-semibold text-gray-600">Status</th>
                        <th className="text-left p-4 font-semibold text-gray-600">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {vendorsData.map(vendor => (
                        <tr key={vendor.id} className="hover:bg-gray-50 transition-colors">
                          <td className="p-4">
                            <p className="font-semibold text-gray-900">{vendor.businessName}</p>
                            <p className="text-xs text-gray-500">{vendor.businessType}</p>
                          </td>
                          <td className="p-4 text-gray-600 text-xs">
                            <p>{vendor.email}</p>
                            <p>{vendor.phone}</p>
                          </td>
                          <td className="p-4">
                            <Badge className="bg-emerald-100 text-emerald-700 text-xs border-0">
                              {vendor.propertyCategory}
                            </Badge>
                            <Badge className="bg-blue-100 text-blue-700 text-xs border-0 ml-1">
                              {vendor.listingType}
                            </Badge>
                          </td>
                          <td className="p-4 text-gray-600 text-xs">
                            {vendor.county}
                            {vendor.subCounty && `, ${vendor.subCounty}`}
                          </td>
                          <td className="p-4">
                            <Badge className={`text-xs border-0 ${
                              vendor.status === "APPROVED" ? "bg-green-100 text-green-700" :
                              vendor.status === "PENDING" ? "bg-yellow-100 text-yellow-700" :
                              "bg-red-100 text-red-700"
                            }`}>
                              {vendor.status}
                            </Badge>
                          </td>
                          <td className="p-4">
                            <div className="flex gap-1.5">
                              {vendor.status === "PENDING" && (
                                <>
                                  <Button 
                                    size="sm" 
                                    className="bg-green-500 hover:bg-green-600 text-white text-xs h-7"
                                    onClick={() => handleApproveVendor(vendor.id)}
                                  >
                                    Approve
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    variant="outline" 
                                    className="text-red-600 border-red-200 text-xs h-7"
                                    onClick={() => handleRejectVendor(vendor.id)}
                                  >
                                    Reject
                                  </Button>
                                </>
                              )}
                              {vendor.status === "APPROVED" && (
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  className="text-red-600 border-red-200 text-xs h-7"
                                  onClick={() => handleRejectVendor(vendor.id)}
                                >
                                  Suspend
                                </Button>
                              )}
                              <Button size="sm" variant="outline" className="text-xs h-7">View</Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Listings Management */}
          {activeSection === "listings" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">All Property Listings</h2>
                <div className="flex gap-2">
                  <Button 
                    onClick={() => loadAllListings()} 
                    variant="outline" 
                    size="sm"
                    className="gap-2"
                  >
                    <Download className="w-4 h-4" /> Refresh
                  </Button>
                </div>
              </div>

              {propertiesLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
                </div>
              ) : properties.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-2xl border">
                  <HomeIcon className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p className="text-gray-500">No properties found</p>
                </div>
              ) : (
                <div className="bg-white rounded-2xl border shadow-sm overflow-x-auto">
                  <table className="w-full text-sm min-w-[800px]">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="text-left p-4 font-semibold text-gray-600">Property</th>
                        <th className="text-left p-4 font-semibold text-gray-600">Type</th>
                        <th className="text-left p-4 font-semibold text-gray-600">Location</th>
                        <th className="text-left p-4 font-semibold text-gray-600">Price</th>
                        <th className="text-left p-4 font-semibold text-gray-600">Views</th>
                        <th className="text-left p-4 font-semibold text-gray-600">Status</th>
                        <th className="text-left p-4 font-semibold text-gray-600">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {properties.map(property => (
                        <tr key={property.id} className="hover:bg-gray-50 transition-colors">
                          <td className="p-4">
                            <p className="font-semibold text-gray-900">{property.title}</p>
                            <p className="text-xs text-gray-500">
                              {property.bedrooms && `${property.bedrooms} bed`}
                              {property.bathrooms && ` • ${property.bathrooms} bath`}
                            </p>
                          </td>
                          <td className="p-4">
                            <Badge className="bg-emerald-100 text-emerald-700 text-xs border-0">
                              {property.propertyType}
                            </Badge>
                            <Badge className="bg-blue-100 text-blue-700 text-xs border-0 ml-1">
                              {property.listingType}
                            </Badge>
                          </td>
                          <td className="p-4 text-gray-600 text-xs">
                            {property.county}
                            {property.subCounty && `, ${property.subCounty}`}
                          </td>
                          <td className="p-4 font-semibold text-gray-900">
                            {formatPrice(property.price)}
                          </td>
                          <td className="p-4 text-gray-600">{property.viewsCount || 0}</td>
                          <td className="p-4">
                            <Badge className={`text-xs border-0 ${
                              property.status === "ACTIVE" ? "bg-green-100 text-green-700" :
                              property.status === "DRAFT" ? "bg-yellow-100 text-yellow-700" :
                              "bg-red-100 text-red-700"
                            }`}>
                              {property.status}
                            </Badge>
                          </td>
                          <td className="p-4">
                            <div className="flex gap-1.5">
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="text-xs h-7"
                                onClick={() => handleViewPropertyDetails(property)}
                              >
                                <Eye className="w-3 h-3 mr-1" /> View
                              </Button>
                              {property.status === "DRAFT" && (
                                <Button 
                                  size="sm" 
                                  className="bg-green-500 hover:bg-green-600 text-white text-xs h-7"
                                  onClick={() => handleApproveProperty(property.id)}
                                >
                                  Approve
                                </Button>
                              )}
                              {property.status === "ACTIVE" && (
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  className="text-red-600 border-red-200 text-xs h-7"
                                  onClick={() => handleDelistProperty(property.id)}
                                >
                                  Delist
                                </Button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Issue Management */}
          {activeSection === "issues" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Issue Management</h2>
                <div className="flex gap-2 flex-wrap">
                  {["all", "pending", "assigned", "resolved", "rejected"].map(s => (
                    <button key={s} onClick={() => {}} className="px-3 py-1.5 rounded-full text-xs font-medium bg-white border text-gray-600 hover:border-red-400 capitalize">{s === "assigned" ? "In Review" : s}</button>
                  ))}
                </div>
              </div>
              <div className="space-y-3 mb-4">
                {issues.length === 0 && (
                  <div className="text-center py-12 text-gray-400"><CheckCircle className="w-10 h-10 mx-auto mb-2 opacity-30" /><p>No issues submitted yet.</p></div>
                )}
                {issues.map(issue => {
                  const statusMap = { pending: "bg-yellow-100 text-yellow-700", assigned: "bg-blue-100 text-blue-700", resolved: "bg-green-100 text-green-700", rejected: "bg-red-100 text-red-700" };
                  const priorityColor = { high: "bg-red-100 text-red-700", medium: "bg-yellow-100 text-yellow-700", low: "bg-gray-100 text-gray-600" };
                  return (
                    <div key={issue.id} className="bg-white rounded-2xl border p-4 hover:shadow-md transition-shadow cursor-pointer" onClick={() => setSelectedIssue(issue)}>
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <span className="font-mono text-xs text-gray-400">{issue.id}</span>
                            <Badge className={`text-xs border-0 ${statusMap[issue.status]}`}>{issue.status === "assigned" ? "In Review" : issue.status.charAt(0).toUpperCase() + issue.status.slice(1)}</Badge>
                            <Badge className={`text-xs border-0 ${priorityColor[issue.priority] || "bg-gray-100"}`}>{issue.priority}</Badge>
                          </div>
                          <p className="font-semibold text-gray-900">{issue.title}</p>
                          <p className="text-sm text-gray-500">{issue.vendor} • {issue.category}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-xs text-gray-400">{issue.createdAt}</p>
                          {issue.assignedTo && <p className="text-xs text-blue-500 mt-1">{issue.assignedTo}</p>}
                        </div>
                      </div>
                      <div className="flex gap-2 mt-3">
                        {issue.status === "pending" && <>
                          <Button size="sm" className="bg-blue-500 hover:bg-blue-600 text-white text-xs h-7" onClick={e => { e.stopPropagation(); handleAssignToSupport(issue.id); }}>Assign to Support</Button>
                          <Button size="sm" variant="outline" className="text-red-500 border-red-200 text-xs h-7" onClick={e => { e.stopPropagation(); handleRejectIssue(issue.id); }}>Reject</Button>
                        </>}
                        {issue.status === "assigned" && <Button size="sm" className="bg-green-500 hover:bg-green-600 text-white text-xs h-7" onClick={e => { e.stopPropagation(); handleApproveResolution(issue.id); }}>Approve Resolution</Button>}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Issue Detail Dialog */}
              <Dialog open={!!selectedIssue} onOpenChange={() => setSelectedIssue(null)}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  {selectedIssue && (() => {
                    const statusMap = { pending: "bg-yellow-100 text-yellow-700", assigned: "bg-blue-100 text-blue-700", resolved: "bg-green-100 text-green-700", rejected: "bg-red-100 text-red-700" };
                    return (
                      <>
                        <DialogHeader><DialogTitle>{selectedIssue.id} – {selectedIssue.title}</DialogTitle></DialogHeader>
                        <div className="flex gap-2 mb-3 flex-wrap">
                          <Badge className={`text-xs border-0 ${statusMap[selectedIssue.status]}`}>{selectedIssue.status}</Badge>
                          <Badge className="bg-gray-100 text-gray-600 text-xs border-0">{selectedIssue.category}</Badge>
                          <Badge className="bg-gray-100 text-gray-600 text-xs border-0">{selectedIssue.vendor}</Badge>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-4 mb-4"><p className="text-sm text-gray-700">{selectedIssue.description}</p></div>
                        {selectedIssue.auditLog?.length > 0 && (
                          <div className="mb-4">
                            <p className="font-semibold text-sm mb-2">Audit Trail</p>
                            <div className="space-y-1">
                              {selectedIssue.auditLog.map((l, i) => (
                                <div key={i} className="flex items-center gap-2 text-xs text-gray-500">
                                  <div className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                                  <span className="font-medium text-gray-700">{l.action}</span>
                                  <span>by {l.by}</span>
                                  <span className="ml-auto">{l.time}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        {selectedIssue.comments?.length > 0 && (
                          <div className="mb-4">
                            <p className="font-semibold text-sm mb-2">Comments</p>
                            <div className="space-y-2">
                              {selectedIssue.comments.map((c, i) => (
                                <div key={i} className="bg-gray-50 rounded-xl p-3 text-sm">
                                  <p className="font-semibold text-xs text-gray-500 mb-0.5">{c.author} {c.analysisType ? `(${c.analysisType})` : ""} · {c.time}</p>
                                  <p className="text-gray-700">{c.text}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        <div className="mb-4">
                          <p className="font-semibold text-sm mb-2">Add Admin Comment</p>
                          <textarea className="w-full border rounded-xl p-3 text-sm resize-none h-20 focus:outline-none focus:ring-2 focus:ring-gray-400" placeholder="Write a note..." value={adminComment} onChange={e => setAdminComment(e.target.value)} />
                          <Button size="sm" variant="outline" className="mt-2" onClick={() => handleAdminComment(selectedIssue.id)}>Add Comment</Button>
                        </div>
                        <div className="flex gap-2 border-t pt-4">
                          {selectedIssue.status === "pending" && <>
                            <Button className="flex-1 bg-blue-500 hover:bg-blue-600 text-white" onClick={() => handleAssignToSupport(selectedIssue.id)}>Assign to Support</Button>
                            <Button variant="outline" className="flex-1 text-red-500 border-red-200" onClick={() => handleRejectIssue(selectedIssue.id)}>Reject</Button>
                          </>}
                          {selectedIssue.status === "assigned" && <Button className="w-full bg-green-500 hover:bg-green-600 text-white" onClick={() => handleApproveResolution(selectedIssue.id)}>Approve Resolution</Button>}
                        </div>
                      </>
                    );
                  })()}
                </DialogContent>
              </Dialog>
            </div>
          )}

          {/* User Management */}
          {activeSection === "users" && <UserManagement />}

          {/* Analytics */}
          {activeSection === "analytics" && (
            <div className="space-y-6">
              <Card>
                <CardHeader><CardTitle>Traffic & Bookings Trend</CardTitle></CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={280}>
                    <LineChart data={trafficData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="month" /><YAxis /><Tooltip />
                      <Line type="monotone" dataKey="visitors" stroke="#10b981" strokeWidth={2.5} name="Visitors" />
                      <Line type="monotone" dataKey="bookings" stroke="#3b82f6" strokeWidth={2.5} name="Bookings" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle>Top Performing Vendors</CardTitle></CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {vendors.filter(v => v.revenue > 0).sort((a, b) => b.revenue - a.revenue).map((v, i) => (
                      <div key={v.name} className="flex items-center gap-3">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 ${i === 0 ? "bg-amber-400" : i === 1 ? "bg-gray-400" : "bg-orange-400"}`}>{i + 1}</div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm truncate">{v.name}</p>
                          <p className="text-xs text-gray-500">{v.category} • {v.bookings} bookings</p>
                        </div>
                        <p className="font-bold text-emerald-600 text-sm shrink-0">USD {v.revenue.toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Revenue */}
          {activeSection === "revenue" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { label: "Total GMV (Feb)", value: "USD 134,000", change: "+37%" },
                  { label: "Platform Commission", value: "USD 20,100", change: "+37%" },
                  { label: "Commission Rate", value: "15%", change: "Standard" },
                ].map(s => (
                  <Card key={s.label}><CardContent className="p-5">
                    <p className="text-sm text-gray-500 mb-1">{s.label}</p>
                    <p className="text-2xl font-extrabold">{s.value}</p>
                    <Badge className="mt-2 bg-green-100 text-green-700 text-xs border-0">{s.change}</Badge>
                  </CardContent></Card>
                ))}
              </div>
              <Card>
                <CardHeader><CardTitle>Revenue & Commission Overview</CardTitle></CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="month" /><YAxis /><Tooltip />
                      <Bar dataKey="revenue" fill="#10b981" radius={[4,4,0,0]} name="Total Revenue" />
                      <Bar dataKey="commission" fill="#f59e0b" radius={[4,4,0,0]} name="Platform Commission" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Support */}
          {activeSection === "support" && (
            <div>
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <p className="text-sm text-amber-700">Support staff have limited access based on permissions assigned by admin.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader><CardTitle>Open Tickets</CardTitle></CardHeader>
                  <CardContent>
                    {[
                      { id: "MG-10234", issue: "Payment not received", user: "user@email.com", status: "Open" },
                      { id: "MG-10235", issue: "Booking cancellation", user: "buyer@gmail.com", status: "In Progress" },
                      { id: "MG-10236", issue: "Vendor account locked", user: "vendor@co.ke", status: "Open" },
                    ].map(t => (
                      <div key={t.id} className="flex items-center justify-between p-3 border-b last:border-0 hover:bg-gray-50">
                        <div>
                          <p className="font-semibold text-sm">{t.id}</p>
                          <p className="text-xs text-gray-500">{t.issue} • {t.user}</p>
                        </div>
                        <Badge className={`text-xs ${t.status === "Open" ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"} border-0`}>{t.status}</Badge>
                      </div>
                    ))}
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader><CardTitle>Support Staff Permissions</CardTitle></CardHeader>
                  <CardContent className="space-y-2">
                    {["View open tickets", "Respond to user queries", "View booking details", "Escalate to admin"].map(p => (
                      <div key={p} className="flex items-center gap-2 text-sm"><CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />{p}</div>
                    ))}
                    {["Approve vendors", "Configure payments", "Manage users", "Access revenue data"].map(p => (
                      <div key={p} className="flex items-center gap-2 text-sm text-gray-400"><XCircle className="w-4 h-4 text-gray-300 shrink-0" />{p}</div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Settings */}
          {activeSection === "settings" && (
            <div className="max-w-xl space-y-6">
              <Card>
                <CardHeader><CardTitle>System Configuration</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-2">Default Commission Rate (%)</p>
                    <input type="number" defaultValue="15" className="border rounded-xl px-4 py-2.5 text-sm w-full focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-2">Temp Password Expiry (hours)</p>
                    <input type="number" defaultValue="24" className="border rounded-xl px-4 py-2.5 text-sm w-full focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                  </div>
                  <div className="flex items-center justify-between py-2 border-t">
                    <div><p className="text-sm font-semibold text-gray-700">Require 2FA for all admins</p><p className="text-xs text-gray-400">All admin logins require OTP</p></div>
                    <div className="w-10 h-6 bg-emerald-500 rounded-full relative cursor-pointer shrink-0"><div className="absolute right-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow" /></div>
                  </div>
                  <div className="flex items-center justify-between py-2 border-t">
                    <div><p className="text-sm font-semibold text-gray-700">Email Notifications</p><p className="text-xs text-gray-400">Send emails on bookings and inquiries</p></div>
                    <div className="w-10 h-6 bg-emerald-500 rounded-full relative cursor-pointer shrink-0"><div className="absolute right-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow" /></div>
                  </div>
                  <Button className="w-full bg-gray-900 hover:bg-gray-800 text-white mt-2">Save Settings</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle>Vendor Portal Module Configuration</CardTitle></CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500 mb-4">Enable or disable which listing categories vendors can upload. Changes apply immediately.</p>
                  <div className="space-y-3">
                    {Object.entries({
                      tours: "Tours & Adventures",
                      hotels: "Hotels & Rooms",
                      cars_sale: "Cars for Sale",
                      cars_hire: "Cars for Hire",
                      land: "Land & Plots",
                      properties_sale: "Houses for Sale",
                      properties_rent: "Houses for Rent",
                      tourist_vehicles: "Tourist Vehicles",
                    }).map(([key, label]) => (
                      <div key={key} className="flex items-center justify-between py-2 border-b last:border-0">
                        <div>
                          <p className="text-sm font-medium text-gray-800">{label}</p>
                          <p className="text-xs text-gray-400">{moduleConfig[key] ? "Currently enabled for vendors" : "Hidden from vendor upload form"}</p>
                        </div>
                        <button
                          onClick={() => handleModuleToggle(key)}
                          className={`w-10 h-6 rounded-full relative transition-colors shrink-0 ${moduleConfig[key] ? "bg-emerald-500" : "bg-gray-300"}`}
                        >
                          <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${moduleConfig[key] ? "right-0.5" : "left-0.5"}`} />
                        </button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>

      {/* Property Details Dialog */}
      <Dialog open={propertyDetailsDialog} onOpenChange={setPropertyDetailsDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Property Details</DialogTitle>
          </DialogHeader>
          {selectedPropertyDetails && (
            <div className="space-y-4">
              {/* Property Images */}
              {selectedPropertyDetails.images && selectedPropertyDetails.images.length > 0 && (
                <div className="grid grid-cols-2 gap-2">
                  {selectedPropertyDetails.images.slice(0, 4).map((image, index) => (
                    <img 
                      key={index}
                      src={image} 
                      alt={`${selectedPropertyDetails.title} ${index + 1}`}
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
                  <h3 className="text-2xl font-bold text-gray-900">{selectedPropertyDetails.title}</h3>
                  <p className="text-emerald-600 font-bold text-xl mt-1">{formatPrice(selectedPropertyDetails.price)}</p>
                </div>
                
                <div className="flex items-center gap-2">
                  <Badge className={`${
                    selectedPropertyDetails.status === "ACTIVE" ? "bg-green-100 text-green-700" :
                    selectedPropertyDetails.status === "DRAFT" ? "bg-yellow-100 text-yellow-700" :
                    "bg-red-100 text-red-700"
                  } border-0`}>
                    {selectedPropertyDetails.status}
                  </Badge>
                  <Badge className="bg-gray-100 text-gray-700 border-0">{selectedPropertyDetails.propertyType}</Badge>
                  <Badge className="bg-blue-100 text-blue-700 border-0">{selectedPropertyDetails.listingType}</Badge>
                </div>
                
                {/* Property Stats */}
                <div className="grid grid-cols-3 gap-3 py-3 border-y">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900">{selectedPropertyDetails.viewsCount || 0}</p>
                    <p className="text-xs text-gray-500">Views</p>
                  </div>
                  {selectedPropertyDetails.bedrooms && (
                    <div className="text-center">
                      <p className="text-2xl font-bold text-gray-900">{selectedPropertyDetails.bedrooms}</p>
                      <p className="text-xs text-gray-500">Bedrooms</p>
                    </div>
                  )}
                  {selectedPropertyDetails.bathrooms && (
                    <div className="text-center">
                      <p className="text-2xl font-bold text-gray-900">{selectedPropertyDetails.bathrooms}</p>
                      <p className="text-xs text-gray-500">Bathrooms</p>
                    </div>
                  )}
                </div>
                
                {/* Description */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Description</h4>
                  <p className="text-gray-600 text-sm">{selectedPropertyDetails.description || "No description provided"}</p>
                </div>
                
                {/* Property Details */}
                <div className="grid grid-cols-2 gap-3 bg-gray-50 rounded-lg p-4">
                  <div>
                    <p className="text-xs text-gray-500">Location</p>
                    <p className="font-semibold text-sm">{selectedPropertyDetails.county}, {selectedPropertyDetails.subCounty}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Address</p>
                    <p className="font-semibold text-sm">{selectedPropertyDetails.address}</p>
                  </div>
                  {selectedPropertyDetails.areaSqm && (
                    <div>
                      <p className="text-xs text-gray-500">Floor Area</p>
                      <p className="font-semibold text-sm">{selectedPropertyDetails.areaSqm} sqm</p>
                    </div>
                  )}
                  {selectedPropertyDetails.landSizeSqm && (
                    <div>
                      <p className="text-xs text-gray-500">Land Size</p>
                      <p className="font-semibold text-sm">{selectedPropertyDetails.landSizeSqm} sqm</p>
                    </div>
                  )}
                  <div>
                    <p className="text-xs text-gray-500">Property ID</p>
                    <p className="font-semibold text-sm">#{selectedPropertyDetails.id}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Vendor ID</p>
                    <p className="font-semibold text-sm">#{selectedPropertyDetails.vendorId}</p>
                  </div>
                </div>
                
                {/* Admin Actions */}
                <div className="flex gap-2 pt-3 border-t">
                  {selectedPropertyDetails.status === "DRAFT" && (
                    <Button 
                      className="bg-green-500 hover:bg-green-600 text-white"
                      onClick={() => {
                        handleApproveProperty(selectedPropertyDetails.id);
                        setPropertyDetailsDialog(false);
                      }}
                    >
                      Approve Property
                    </Button>
                  )}
                  {selectedPropertyDetails.status === "ACTIVE" && (
                    <Button 
                      variant="outline"
                      className="text-red-600 border-red-200"
                      onClick={() => {
                        handleDelistProperty(selectedPropertyDetails.id);
                        setPropertyDetailsDialog(false);
                      }}
                    >
                      Delist Property
                    </Button>
                  )}
                  <Button 
                    variant="outline"
                    onClick={() => setPropertyDetailsDialog(false)}
                  >
                    Close
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}