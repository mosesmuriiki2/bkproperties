import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  Globe, Search, Menu, X, ChevronDown, Home, Hotel, Car,
  MapPin, Building2, Compass, Users, Shield, Headphones,
  LogIn, LayoutDashboard, BookOpen, LogOut, User, Calendar
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { useBranding } from "@/contexts/BrandingContext";
import { useModules } from "@/hooks/useModules";

const allNavItems = [
  { label: "Home", page: "Home", icon: Home, module: null }, // Always visible
  {
    label: "Tours & Adventures", page: "Tours", icon: Compass, module: "tours",
    children: [
      { label: "Safari & Adventures", page: "Tours" },
      { label: "Tourist Vehicles", page: "TouristVehicles" },
    ]
  },
  { label: "Hotels & Lodges", page: "Hotels", icon: Hotel, module: "hotels" },
  {
    label: "Cars", page: "Cars", icon: Car, module: "products",
    children: [
      { label: "Cars for Sale", page: "Cars" },
      { label: "Cars for Hire", page: "Cars" },
    ]
  },
  {
    label: "Properties", page: "Properties", icon: Building2, module: "properties",
    children: [
      { label: "Houses for Sale", page: "Properties" },
      { label: "Houses for Rent", page: "Properties" },
      { label: "Land", page: "Land" },
    ]
  },
  { label: "About", page: "About", icon: Globe, module: null }, // Always visible
];

export default function Layout({ children, currentPageName }) {
  const { branding } = useBranding();
  const { modules, loading } = useModules();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Check for logged in user on mount and when location changes
  useEffect(() => {
    const checkAuth = () => {
      const authData = sessionStorage.getItem("mg_user_auth") || 
                       sessionStorage.getItem("mg_consumer_auth") ||
                       sessionStorage.getItem("mg_vendor_auth") ||
                       sessionStorage.getItem("mg_admin_auth");
      if (authData) {
        try {
          const parsed = JSON.parse(authData);
          setUser(parsed);
          console.log("User authenticated:", parsed); // Debug log
        } catch (e) {
          console.error("Error parsing auth data:", e);
          setUser(null);
        }
      } else {
        setUser(null);
        console.log("No user authenticated"); // Debug log
      }
    };

    checkAuth();

    // Listen for storage events (when user logs in/out in another tab)
    window.addEventListener('storage', checkAuth);
    
    // Custom event for same-tab login
    window.addEventListener('userLoggedIn', checkAuth);
    window.addEventListener('userLoggedOut', checkAuth);

    return () => {
      window.removeEventListener('storage', checkAuth);
      window.removeEventListener('userLoggedIn', checkAuth);
      window.removeEventListener('userLoggedOut', checkAuth);
    };
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("mg_user_auth");
    sessionStorage.removeItem("mg_consumer_auth");
    sessionStorage.removeItem("mg_vendor_auth");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    setUser(null);
    
    // Dispatch custom event
    window.dispatchEvent(new Event('userLoggedOut'));
    navigate("/");
  };

  const isActive = (page) => currentPageName === page;

  // Filter navigation items based on enabled modules
  const navItems = allNavItems.filter(item => {
    // If no module specified, always show (Home, About)
    if (!item.module) return true;
    // Otherwise check if module is enabled
    return modules[item.module] === true;
  });

  // Show loading state briefly
  if (loading) {
    return (
      <div className="min-h-screen bg-background font-sans">
        <div className="flex items-center justify-center h-screen">
          <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background font-sans">
      {/* Top bar */}
      <div className="bg-slate-900 text-gray-300 text-xs py-2 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <span className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-sky-400" />
            <span className="hidden sm:inline">Nairobi, Kenya</span>
          </span>
          <div className="flex items-center gap-4">
            <a href="tel:+254720321107" className="hover:text-sky-400 transition-colors flex items-center gap-1">
              <Headphones className="w-3.5 h-3.5" /> +254 720 321107
            </a>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="hover:text-sky-400 flex items-center gap-1 transition-colors">
                  <Headphones className="w-3.5 h-3.5" /> Support <ChevronDown className="w-2.5 h-2.5" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44">
                <DropdownMenuItem asChild>
                  <Link to={createPageUrl("SupportCenter")} className="cursor-pointer flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-sky-500" /> Support Center
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to={createPageUrl("SupportLogin")} className="cursor-pointer flex items-center gap-2">
                    <LogOut className="w-4 h-4 text-gray-500" /> Support Portal Login
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Main navbar */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link to={createPageUrl("Home")} className="flex items-center gap-3 shrink-0">
            <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-sky-500 to-sky-600 flex items-center justify-center shadow-lg text-2xl">
              {branding.logo}
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-slate-900 leading-tight">
                {branding.logoText}
              </span>
              <span className="text-[10px] text-slate-500 leading-tight">Property Marketplace</span>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) =>
              item.children ? (
                <DropdownMenu key={item.label}>
                  <DropdownMenuTrigger asChild>
                    <button className={`flex items-center gap-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${isActive(item.page) ? "text-sky-600 bg-sky-50" : "text-slate-700 hover:text-sky-600 hover:bg-slate-50"}`}>
                      {item.label} <ChevronDown className="w-3.5 h-3.5 opacity-60" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-48">
                    {item.children.map((child) => (
                      <DropdownMenuItem key={child.label} asChild>
                        <Link to={createPageUrl(child.page)} className="cursor-pointer">{child.label}</Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link
                  key={item.label}
                  to={createPageUrl(item.page)}
                  className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${isActive(item.page) ? "text-sky-600 bg-sky-50" : "text-slate-700 hover:text-sky-600 hover:bg-slate-50"}`}
                >
                  {item.label}
                </Link>
              )
            )}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <Link to={createPageUrl("Search")} className="p-2.5 rounded-lg text-slate-500 hover:text-sky-600 hover:bg-slate-50 transition-colors">
              <Search className="w-5 h-5" />
            </Link>

            <Link to={createPageUrl("VendorPortal")} className="hidden md:flex">
              <Button variant="outline" size="sm" className="border-sky-500 text-sky-600 hover:bg-sky-50 font-medium">
                + List Property
              </Button>
            </Link>

            {/* User Authentication */}
            <div className="flex items-center gap-1">
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sky-500 to-sky-600 flex items-center justify-center text-white text-sm font-bold shadow">
                        {user.email?.charAt(0).toUpperCase()}
                      </div>
                      <span className="hidden md:inline text-slate-700 font-medium">{user.email}</span>
                      <ChevronDown className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="px-2 py-1.5 text-sm">
                      <p className="font-semibold text-slate-900">{user.email}</p>
                      <p className="text-xs text-slate-500">{user.role || 'User'}</p>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to={createPageUrl("ConsumerDashboard")} className="cursor-pointer flex items-center gap-2">
                        <LayoutDashboard className="w-4 h-4" /> My Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to={createPageUrl("ConsumerDashboard")} className="cursor-pointer flex items-center gap-2">
                        <Calendar className="w-4 h-4" /> My Bookings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to={createPageUrl("ConsumerDashboard")} className="cursor-pointer flex items-center gap-2">
                        <User className="w-4 h-4" /> Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600 flex items-center gap-2">
                      <LogOut className="w-4 h-4" /> Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <>
                  <Link to={createPageUrl("Login")}>
                    <Button variant="ghost" size="sm" className="text-slate-600 hover:text-sky-600 font-medium">
                      <LogIn className="w-4 h-4 mr-1" /> Login
                    </Button>
                  </Link>
                  <Link to={createPageUrl("Register")}>
                    <Button size="sm" className="bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white shadow-md font-medium">
                      Register
                    </Button>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile toggle */}
            <button className="lg:hidden p-2 rounded-lg text-slate-500" onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        {mobileOpen && (
          <div className="lg:hidden border-t bg-white px-4 py-3 space-y-1">
            {navItems.map((item) => (
              <div key={item.label}>
                <Link
                  to={createPageUrl(item.page)}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:text-sky-600 hover:bg-slate-50"
                  onClick={() => setMobileOpen(false)}
                >
                  <item.icon className="w-4 h-4" /> {item.label}
                </Link>
                {item.children && (
                  <div className="ml-6 space-y-1">
                    {item.children.map((child) => (
                      <Link
                        key={child.label}
                        to={createPageUrl(child.page)}
                        className="block px-3 py-1.5 text-sm text-slate-500 hover:text-sky-600"
                        onClick={() => setMobileOpen(false)}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div className="pt-2 border-t space-y-2">
              <Link to={createPageUrl("VendorPortal")} className="block" onClick={() => setMobileOpen(false)}>
                <Button variant="outline" size="sm" className="w-full border-sky-500 text-sky-600">+ List Property</Button>
              </Link>
              <div className="flex gap-2">
                <Link to={createPageUrl("Login")} className="flex-1" onClick={() => setMobileOpen(false)}>
                  <Button variant="ghost" size="sm" className="w-full text-slate-600">
                    <LogIn className="w-4 h-4 mr-1" /> Login
                  </Button>
                </Link>
                <Link to={createPageUrl("Register")} className="flex-1" onClick={() => setMobileOpen(false)}>
                  <Button size="sm" className="w-full bg-gradient-to-r from-sky-500 to-sky-600 text-white">
                    Register
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Page content */}
      <main>{children}</main>

      {/* Footer */}
      <footer className="bg-slate-900 text-gray-300 mt-20">
        <div className="max-w-7xl mx-auto px-4 py-16 grid grid-cols-1 md:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-sky-500 to-sky-600 flex items-center justify-center text-xl shadow-lg">
                {branding.logo}
              </div>
              <div className="flex flex-col">
                <span className="text-white font-bold text-lg leading-tight">{branding.logoText}</span>
                <span className="text-[10px] text-slate-400 leading-tight">Property Marketplace</span>
              </div>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed mb-4">
              Your trusted property partner in Kenya & Africa. Find your dream home, land, or investment property.
            </p>
            <div className="flex gap-3">
              <a href={branding.social.facebook} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-sky-600 flex items-center justify-center transition-colors">
                <span className="text-sm">f</span>
              </a>
              <a href={branding.social.twitter} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-sky-600 flex items-center justify-center transition-colors">
                <span className="text-sm">𝕏</span>
              </a>
              <a href={branding.social.instagram} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-sky-600 flex items-center justify-center transition-colors">
                <span className="text-sm">📷</span>
              </a>
              <a href={branding.social.linkedin} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-sky-600 flex items-center justify-center transition-colors">
                <span className="text-sm">in</span>
              </a>
            </div>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Properties</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to={createPageUrl("Properties")} className="hover:text-sky-400 transition-colors">Houses for Sale</Link></li>
              <li><Link to={createPageUrl("Properties")} className="hover:text-sky-400 transition-colors">Houses for Rent</Link></li>
              <li><Link to={createPageUrl("Land")} className="hover:text-sky-400 transition-colors">Land for Sale</Link></li>
              <li><Link to={createPageUrl("Properties")} className="hover:text-sky-400 transition-colors">Apartments</Link></li>
              <li><Link to={createPageUrl("Properties")} className="hover:text-sky-400 transition-colors">Commercial Properties</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">For Vendors</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to={createPageUrl("VendorPortal")} className="hover:text-sky-400 transition-colors">Vendor Portal</Link></li>
              <li><a href="#" className="hover:text-sky-400 transition-colors">List Your Property</a></li>
              <li><a href="#" className="hover:text-sky-400 transition-colors">Pricing Plans</a></li>
              <li><a href="#" className="hover:text-sky-400 transition-colors">Vendor Support</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Company</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to={createPageUrl("About")} className="hover:text-sky-400 transition-colors">About Us</Link></li>
              <li><Link to={createPageUrl("SupportCenter")} className="hover:text-sky-400 transition-colors">Support Center</Link></li>
              <li><a href="#" className="hover:text-sky-400 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-sky-400 transition-colors">Terms of Service</a></li>
              <li><a href="mailto:info@bkproperties.co.ke" className="hover:text-sky-400 transition-colors">Contact Us</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-800 px-4 py-6 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-3 text-sm text-slate-400">
            <span>© 2026 {branding.logoText}. All rights reserved.</span>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-sky-500" /> Nairobi, Kenya
              </span>
              <span className="flex items-center gap-1.5">
                <Headphones className="w-4 h-4 text-sky-500" /> +254 720 321107
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}