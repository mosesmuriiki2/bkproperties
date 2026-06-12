import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  Search, Menu, X, ChevronDown, Home, Hotel, Car,
  MapPin, Building2, Compass, Shield, Headphones,
  LogIn, LayoutDashboard, BookOpen, LogOut, User, Calendar,
  Phone, Mail, Facebook, Twitter, Instagram, Linkedin, Youtube,
  ArrowRight, ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuTrigger, DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { useBranding } from "@/contexts/BrandingContext";
import { useModules } from "@/hooks/useModules";

const allNavItems = [
  { label: "Home", page: "Home", icon: Home, module: null },
  {
    label: "Properties", page: "Properties", icon: Building2, module: "properties",
    children: [
      { label: "Houses for Sale", page: "Properties" },
      { label: "Houses for Rent", page: "Properties" },
      { label: "Land & Plots", page: "Land" },
      { label: "All Properties", page: "Properties" },
    ]
  },
  {
    label: "Tours", page: "Tours", icon: Compass, module: "tours",
    children: [
      { label: "Safari & Adventures", page: "Tours" },
      { label: "Tourist Vehicles", page: "TouristVehicles" },
    ]
  },
  { label: "Hotels", page: "Hotels", icon: Hotel, module: "hotels" },
  {
    label: "Cars", page: "Cars", icon: Car, module: "products",
    children: [
      { label: "Cars for Sale", page: "Cars" },
      { label: "Cars for Hire", page: "Cars" },
    ]
  },
  { label: "About", page: "About", icon: Shield, module: null },
];

export default function Layout({ children, currentPageName }) {
  const { branding } = useBranding();
  const { modules, loading } = useModules();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const checkAuth = () => {
      const authData =
        sessionStorage.getItem("mg_user_auth") ||
        sessionStorage.getItem("mg_consumer_auth") ||
        sessionStorage.getItem("mg_vendor_auth") ||
        sessionStorage.getItem("mg_admin_auth");
      if (authData) {
        try { setUser(JSON.parse(authData)); } catch { setUser(null); }
      } else {
        setUser(null);
      }
    };
    checkAuth();
    window.addEventListener("storage", checkAuth);
    window.addEventListener("userLoggedIn", checkAuth);
    window.addEventListener("userLoggedOut", checkAuth);
    return () => {
      window.removeEventListener("storage", checkAuth);
      window.removeEventListener("userLoggedIn", checkAuth);
      window.removeEventListener("userLoggedOut", checkAuth);
    };
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("mg_user_auth");
    sessionStorage.removeItem("mg_consumer_auth");
    sessionStorage.removeItem("mg_vendor_auth");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    setUser(null);
    window.dispatchEvent(new Event("userLoggedOut"));
    navigate("/");
  };

  const isActive = (page) => currentPageName === page;

  const navItems = allNavItems.filter(item =>
    !item.module || modules[item.module] === true
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <img src="/logo.png" alt="BK Properties" className="w-16 h-16 object-contain animate-pulse" />
          <div className="w-6 h-6 border-2 border-sky-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">

      {/* Top announcement bar */}
      <div className="bg-sky-600 text-white text-xs py-2 px-4 hidden md:block">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-6">
            <a href="tel:+254720321107" className="flex items-center gap-1.5 hover:text-sky-100 transition-colors">
              <Phone className="w-3 h-3" /> +254 720 321107
            </a>
            <a href="mailto:info@bkproperties.co.ke" className="flex items-center gap-1.5 hover:text-sky-100 transition-colors">
              <Mail className="w-3 h-3" /> info@bkproperties.co.ke
            </a>
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-sky-100">
              <MapPin className="w-3 h-3" /> Nairobi, Kenya
            </span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-1 hover:text-sky-100 transition-colors">
                  <Headphones className="w-3 h-3" /> Support <ChevronDown className="w-2.5 h-2.5" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild>
                  <Link to={createPageUrl("SupportCenter")} className="cursor-pointer flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-sky-500" /> Support Center
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to={createPageUrl("SupportLogin")} className="cursor-pointer flex items-center gap-2">
                    <LogOut className="w-4 h-4 text-slate-400" /> Support Portal
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Main navbar */}
      <header className={`bg-white sticky top-0 z-50 transition-shadow duration-300 ${scrolled ? "shadow-md" : "border-b border-gray-100"}`}>
        <div className="max-w-7xl mx-auto px-4 h-18 flex items-center justify-between gap-4 py-3">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 shrink-0">
            <img
              src="/logo.png"
              alt="BK Properties"
              className="h-11 w-auto object-contain"
            />
            <div className="hidden sm:flex flex-col leading-tight">
              <span className="text-lg font-bold text-slate-900 tracking-tight">BK Properties</span>
              <span className="text-[10px] text-slate-400 font-medium uppercase tracking-widest">Kenya's Property Hub</span>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-0.5">
            {navItems.map((item) =>
              item.children ? (
                <DropdownMenu key={item.label}>
                  <DropdownMenuTrigger asChild>
                    <button className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                      isActive(item.page)
                        ? "text-sky-600 bg-sky-50"
                        : "text-slate-600 hover:text-sky-600 hover:bg-slate-50"
                    }`}>
                      {item.label}
                      <ChevronDown className="w-3.5 h-3.5 opacity-60" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-52 mt-1 shadow-xl border border-gray-100 rounded-xl p-1">
                    {item.children.map((child) => (
                      <DropdownMenuItem key={child.label} asChild>
                        <Link
                          to={createPageUrl(child.page)}
                          className="cursor-pointer flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-700 hover:text-sky-600 hover:bg-sky-50"
                        >
                          <ChevronRight className="w-3.5 h-3.5 text-sky-400" />
                          {child.label}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link
                  key={item.label}
                  to={createPageUrl(item.page)}
                  className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive(item.page)
                      ? "text-sky-600 bg-sky-50"
                      : "text-slate-600 hover:text-sky-600 hover:bg-slate-50"
                  }`}
                >
                  {item.label}
                </Link>
              )
            )}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <Link to={createPageUrl("Search")} className="p-2 rounded-lg text-slate-500 hover:text-sky-600 hover:bg-slate-50 transition-colors">
              <Search className="w-5 h-5" />
            </Link>

            <Link to={createPageUrl("VendorPortal")} className="hidden md:block">
              <Button size="sm" variant="outline" className="border-sky-500 text-sky-600 hover:bg-sky-50 font-semibold text-sm px-4">
                + List Property
              </Button>
            </Link>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="flex items-center gap-2 pl-1 pr-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sky-500 to-sky-600 flex items-center justify-center text-white text-sm font-bold shadow">
                      {user.email?.charAt(0).toUpperCase()}
                    </div>
                    <span className="hidden md:inline text-slate-700 font-medium text-sm">{user.email?.split("@")[0]}</span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 shadow-xl rounded-xl border border-gray-100 p-1">
                  <div className="px-3 py-2">
                    <p className="font-semibold text-slate-900 text-sm">{user.email}</p>
                    <p className="text-xs text-slate-400 capitalize">{user.role || "User"}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to={createPageUrl("ConsumerDashboard")} className="cursor-pointer flex items-center gap-2 px-3 py-2 rounded-lg">
                      <LayoutDashboard className="w-4 h-4 text-sky-500" /> Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to={createPageUrl("ConsumerDashboard")} className="cursor-pointer flex items-center gap-2 px-3 py-2 rounded-lg">
                      <Calendar className="w-4 h-4 text-sky-500" /> My Bookings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to={createPageUrl("ConsumerDashboard")} className="cursor-pointer flex items-center gap-2 px-3 py-2 rounded-lg">
                      <User className="w-4 h-4 text-sky-500" /> Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer flex items-center gap-2 px-3 py-2 rounded-lg text-red-500 hover:bg-red-50">
                    <LogOut className="w-4 h-4" /> Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden md:flex items-center gap-1.5">
                <Link to={createPageUrl("Login")}>
                  <Button variant="ghost" size="sm" className="text-slate-600 hover:text-sky-600 font-medium">
                    <LogIn className="w-4 h-4 mr-1" /> Login
                  </Button>
                </Link>
                <Link to={createPageUrl("Register")}>
                  <Button size="sm" className="bg-sky-500 hover:bg-sky-600 text-white font-semibold shadow-sm px-4">
                    Register
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile toggle */}
            <button
              className="lg:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-gray-100 bg-white px-4 py-4 space-y-1 shadow-lg">
            {navItems.map((item) => (
              <div key={item.label}>
                <Link
                  to={createPageUrl(item.page)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 hover:text-sky-600 hover:bg-sky-50 transition-colors"
                >
                  <item.icon className="w-4 h-4 text-sky-400" /> {item.label}
                </Link>
                {item.children && (
                  <div className="ml-10 mt-1 space-y-1">
                    {item.children.map((child) => (
                      <Link
                        key={child.label}
                        to={createPageUrl(child.page)}
                        className="block px-3 py-2 text-sm text-slate-500 hover:text-sky-600 rounded-lg hover:bg-sky-50 transition-colors"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div className="pt-3 border-t border-gray-100 space-y-2">
              <Link to={createPageUrl("VendorPortal")} className="block">
                <Button variant="outline" size="sm" className="w-full border-sky-500 text-sky-600">
                  + List Property
                </Button>
              </Link>
              <div className="flex gap-2">
                <Link to={createPageUrl("Login")} className="flex-1">
                  <Button variant="ghost" size="sm" className="w-full text-slate-600">
                    <LogIn className="w-4 h-4 mr-1" /> Login
                  </Button>
                </Link>
                <Link to={createPageUrl("Register")} className="flex-1">
                  <Button size="sm" className="w-full bg-sky-500 hover:bg-sky-600 text-white">
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
      <footer className="bg-slate-900 text-slate-300">
        <div className="max-w-7xl mx-auto px-4 pt-16 pb-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
            {/* Brand */}
            <div className="md:col-span-1">
              <div className="flex items-center gap-3 mb-5">
                <img src="/logo.png" alt="BK Properties" className="h-10 w-auto object-contain brightness-200" />
                <div>
                  <div className="text-white font-bold text-base leading-tight">BK Properties</div>
                  <div className="text-slate-400 text-[10px] uppercase tracking-widest">Kenya's Property Hub</div>
                </div>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed mb-5">
                Your trusted partner for buying, selling, and renting property across Kenya and East Africa.
              </p>
              <div className="flex gap-2.5">
                {[
                  { href: branding.social?.facebook, icon: Facebook, label: "Facebook" },
                  { href: branding.social?.twitter, icon: Twitter, label: "Twitter" },
                  { href: branding.social?.instagram, icon: Instagram, label: "Instagram" },
                  { href: branding.social?.linkedin, icon: Linkedin, label: "LinkedIn" },
                  { href: branding.social?.youtube, icon: Youtube, label: "YouTube" },
                ].map(({ href, icon: Icon, label }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-sky-600 flex items-center justify-center transition-colors"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>

            {/* Properties */}
            <div>
              <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Properties</h4>
              <ul className="space-y-2.5 text-sm">
                {[
                  { label: "Houses for Sale", page: "Properties" },
                  { label: "Houses for Rent", page: "Properties" },
                  { label: "Land for Sale", page: "Land" },
                  { label: "Apartments", page: "Properties" },
                  { label: "Commercial", page: "Properties" },
                ].map(({ label, page }) => (
                  <li key={label}>
                    <Link to={createPageUrl(page)} className="hover:text-sky-400 transition-colors flex items-center gap-1.5">
                      <ArrowRight className="w-3 h-3 text-sky-500 opacity-0 group-hover:opacity-100" />
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Vendors */}
            <div>
              <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">For Vendors</h4>
              <ul className="space-y-2.5 text-sm">
                {[
                  { label: "Vendor Portal", page: "VendorPortal" },
                  { label: "List a Property", page: "VendorPortal" },
                  { label: "Vendor Dashboard", page: "VendorDashboard" },
                  { label: "Vendor Support", page: "SupportCenter" },
                ].map(({ label, page }) => (
                  <li key={label}>
                    <Link to={createPageUrl(page)} className="hover:text-sky-400 transition-colors">{label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company + Contact */}
            <div>
              <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Company</h4>
              <ul className="space-y-2.5 text-sm mb-6">
                {[
                  { label: "About Us", page: "About" },
                  { label: "Support Center", page: "SupportCenter" },
                ].map(({ label, page }) => (
                  <li key={label}>
                    <Link to={createPageUrl(page)} className="hover:text-sky-400 transition-colors">{label}</Link>
                  </li>
                ))}
                {[
                  { label: "Privacy Policy", href: "#" },
                  { label: "Terms of Service", href: "#" },
                ].map(({ label, href }) => (
                  <li key={label}>
                    <a href={href} className="hover:text-sky-400 transition-colors">{label}</a>
                  </li>
                ))}
              </ul>
              <div className="space-y-2 text-sm">
                <a href="tel:+254720321107" className="flex items-center gap-2 hover:text-sky-400 transition-colors">
                  <Phone className="w-4 h-4 text-sky-500" /> +254 720 321107
                </a>
                <a href="mailto:info@bkproperties.co.ke" className="flex items-center gap-2 hover:text-sky-400 transition-colors">
                  <Mail className="w-4 h-4 text-sky-500" /> info@bkproperties.co.ke
                </a>
                <span className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-sky-500" /> Nairobi, Kenya
                </span>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-3 text-sm text-slate-500">
            <span>© {new Date().getFullYear()} BK Properties. All rights reserved.</span>
            <span className="text-slate-600">Built with ❤️ for Kenya's Property Market</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
