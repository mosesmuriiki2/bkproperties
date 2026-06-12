import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Search, MapPin, Home as HomeIcon, Building2, TrendingUp, Shield, Users,
  Phone, Mail, Facebook, Twitter, Instagram, Linkedin, Youtube,
  ArrowRight, CheckCircle, Star, MessageSquare, Calendar, Bed, Bath,
  Maximize, Award, ChevronRight, Landmark, Trees, Car, Hotel
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import apiClient from "@/api/apiClient";
import { BLOG_POSTS } from "@/data/blogPosts";

const PROPERTY_TYPES = [
  { label: "All", value: "" },
  { label: "For Sale", value: "SALE" },
  { label: "For Rent", value: "RENT" },
  { label: "Land", value: "LAND" },
];

const POPULAR_LOCATIONS = ["Nairobi", "Mombasa", "Kisumu", "Nakuru", "Eldoret", "Thika"];

// Demo properties shown when backend is offline
const DEMO_PROPERTIES = [
  { id: "demo-1", title: "Modern 4BR Villa – Karen", price: "45,000,000", location: "Karen, Nairobi", type: "FOR SALE", img: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=70", beds: 4, baths: 3, area: 320, isDemo: true },
  { id: "demo-2", title: "2BR Apartment – Westlands", price: "85,000/mo", location: "Westlands, Nairobi", type: "FOR RENT", img: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&q=70", beds: 2, baths: 2, area: 95, isDemo: true },
  { id: "demo-3", title: "Half Acre Plot – Kitengela", price: "3,500,000", location: "Kitengela, Kajiado", type: "LAND", img: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&q=70", area: "0.5 acres", isDemo: true },
  { id: "demo-4", title: "3BR Townhouse – Syokimau", price: "12,500,000", location: "Syokimau, Nairobi", type: "FOR SALE", img: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=600&q=70", beds: 3, baths: 2, area: 175, isDemo: true },
  { id: "demo-5", title: "Studio Apartment – CBD", price: "35,000/mo", location: "Nairobi CBD", type: "FOR RENT", img: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&q=70", beds: 1, baths: 1, area: 45, isDemo: true },
  { id: "demo-6", title: "1 Acre Plot – Thika Road", price: "8,000,000", location: "Thika Road, Kiambu", type: "LAND", img: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&q=70", area: "1 acre", isDemo: true },
];

export default function Home() {
  const [properties, setProperties] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeType, setActiveType] = useState("");
  const [loading, setLoading] = useState(true);
  const [usingDemo, setUsingDemo] = useState(false);
  const [statsCount, setStatsCount] = useState({ properties: 0, clients: 0, cities: 0 });

  useEffect(() => {
    loadFeaturedProperties();
    // Animate counters
    const targets = { properties: 5000, clients: 10000, cities: 47 };
    const duration = 1500;
    const steps = 40;
    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      setStatsCount({
        properties: Math.floor(targets.properties * progress),
        clients: Math.floor(targets.clients * progress),
        cities: Math.floor(targets.cities * progress),
      });
      if (step >= steps) clearInterval(timer);
    }, duration / steps);
    return () => clearInterval(timer);
  }, []);

  const loadFeaturedProperties = async () => {
    try {
      const response = await apiClient.properties.getActive(0, 6);
      const data = response.content || response || [];
      if (Array.isArray(data) && data.length > 0) {
        setProperties(data);
        setUsingDemo(false);
      } else {
        // Backend returned empty — use demo
        setProperties(DEMO_PROPERTIES);
        setUsingDemo(true);
      }
    } catch (error) {
      // Backend offline — use demo
      setProperties(DEMO_PROPERTIES);
      setUsingDemo(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.set("search", searchQuery.trim());
    if (activeType) params.set("type", activeType);
    window.location.href = `/Properties?${params.toString()}`;
  };

  const stats = [
    { icon: HomeIcon, label: "Properties Listed", value: `${statsCount.properties.toLocaleString()}+`, color: "bg-sky-500" },
    { icon: Users, label: "Happy Clients", value: `${statsCount.clients.toLocaleString()}+`, color: "bg-amber-500" },
    { icon: Building2, label: "Counties Covered", value: `${statsCount.cities}`, color: "bg-emerald-500" },
    { icon: TrendingUp, label: "Success Rate", value: "98%", color: "bg-purple-500" },
  ];

  const categories = [
    { icon: HomeIcon, label: "Houses", sub: "Buy or rent homes", page: "Properties", count: "3,200+", color: "from-sky-400 to-sky-600" },
    { icon: Trees, label: "Land & Plots", sub: "Title deed plots", page: "Land", count: "900+", color: "from-emerald-400 to-emerald-600" },
    { icon: Building2, label: "Apartments", sub: "City apartments", page: "Properties", count: "1,800+", color: "from-violet-400 to-violet-600" },
    { icon: Landmark, label: "Commercial", sub: "Offices & retail", page: "Properties", count: "450+", color: "from-orange-400 to-orange-600" },
    { icon: Car, label: "Cars", sub: "Buy or hire cars", page: "Cars", count: "800+", color: "from-rose-400 to-rose-600" },
    { icon: Hotel, label: "Hotels", sub: "Lodges & hotels", page: "Hotels", count: "600+", color: "from-amber-400 to-amber-600" },
  ];

  const features = [
    { icon: Shield, title: "Verified Listings", description: "Every property is verified by our expert team before going live." },
    { icon: Users, title: "Expert Agents", description: "Professional agents ready to guide you through every step." },
    { icon: TrendingUp, title: "Market Insights", description: "Real-time data on property values and market trends in Kenya." },
    { icon: MessageSquare, title: "24/7 Support", description: "Our support team is always available for all your queries." },
  ];

  const testimonials = [
    { name: "John Kamau", role: "Property Owner", content: "BK Properties helped me find my dream home in Nairobi. Smooth and professional from start to finish!", rating: 5, initials: "JK", color: "from-sky-500 to-sky-600" },
    { name: "Mary Wanjiku", role: "Property Investor", content: "I've purchased 3 properties through BK Properties. Their team is knowledgeable and trustworthy.", rating: 5, initials: "MW", color: "from-violet-500 to-violet-600" },
    { name: "David Ochieng", role: "First-Time Buyer", content: "They were patient and guided me through every step. Found the perfect apartment in Westlands!", rating: 5, initials: "DO", color: "from-emerald-500 to-emerald-600" },
  ];

  return (
    <div className="min-h-screen bg-white">

      {/* ─── HERO ─── */}
      <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
        {/* Background image overlay */}
        <div
          className="absolute inset-0 opacity-10 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1600&q=60')" }}
        />
        {/* Gradient blobs */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-sky-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 py-28 md:py-36">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-sky-500/20 text-sky-300 border border-sky-500/30 rounded-full px-5 py-1.5 text-sm font-medium mb-8">
              🏘️ Kenya's #1 Property Marketplace
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-[1.1] tracking-tight">
              Find Your Perfect
              <span className="block bg-gradient-to-r from-sky-400 via-sky-300 to-amber-400 bg-clip-text text-transparent">
                Property in Kenya
              </span>
            </h1>
            <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed">
              Browse thousands of verified homes, land, and commercial properties across Kenya.
              Your trusted partner in real estate.
            </p>

            {/* Search card */}
            <div className="bg-white rounded-2xl shadow-2xl p-5 md:p-6 max-w-3xl mx-auto">
              {/* Type tabs */}
              <div className="flex gap-1 mb-4 bg-slate-100 rounded-xl p-1">
                {PROPERTY_TYPES.map(({ label, value }) => (
                  <button
                    key={value}
                    onClick={() => setActiveType(value)}
                    className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
                      activeType === value
                        ? "bg-white text-sky-600 shadow-sm"
                        : "text-slate-500 hover:text-slate-700"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <div className="flex gap-3">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <Input
                    type="text"
                    placeholder="Search by location, property type..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    className="pl-12 h-12 text-base border-slate-200 focus:border-sky-500 focus:ring-sky-500 rounded-xl"
                  />
                </div>
                <Button
                  onClick={handleSearch}
                  className="h-12 px-6 bg-sky-500 hover:bg-sky-600 text-white font-semibold rounded-xl shadow-md"
                >
                  Search
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-4 items-center">
                <span className="text-xs text-slate-500 font-medium">Popular:</span>
                {POPULAR_LOCATIONS.map((loc) => (
                  <button
                    key={loc}
                    onClick={() => { setSearchQuery(loc); }}
                    className="text-xs border border-slate-200 text-slate-600 rounded-full px-3 py-1 hover:border-sky-400 hover:text-sky-600 hover:bg-sky-50 transition-colors"
                  >
                    {loc}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 60L1440 60L1440 0C1200 50 900 70 720 40C540 10 240 50 0 0L0 60Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* ─── STATS ─── */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <div key={i} className="text-center group">
                <div className={`w-14 h-14 mx-auto mb-3 rounded-2xl ${stat.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon className="w-7 h-7 text-white" />
                </div>
                <div className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-1">{stat.value}</div>
                <div className="text-sm text-slate-500 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CATEGORIES ─── */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="mb-3 bg-sky-50 text-sky-600 border-sky-200 text-xs font-semibold uppercase tracking-wider">Browse</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">Explore by Category</h2>
            <p className="text-slate-500 max-w-xl mx-auto">Find exactly what you're looking for across our wide range of listings</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat, i) => (
              <Link key={i} to={`/${cat.page}`}>
                <div className="group bg-white rounded-2xl p-5 text-center hover:shadow-xl transition-all duration-300 border border-transparent hover:border-sky-100 cursor-pointer">
                  <div className={`w-14 h-14 mx-auto mb-3 rounded-2xl bg-gradient-to-br ${cat.color} flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300`}>
                    <cat.icon className="w-7 h-7 text-white" />
                  </div>
                  <div className="font-semibold text-slate-800 text-sm mb-0.5">{cat.label}</div>
                  <div className="text-xs text-slate-400 mb-1">{cat.sub}</div>
                  <div className="text-xs font-bold text-sky-500">{cat.count}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FEATURED PROPERTIES ─── */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <Badge className="mb-3 bg-amber-50 text-amber-600 border-amber-200 text-xs font-semibold uppercase tracking-wider">Featured</Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">Premium Properties</h2>
              <p className="text-slate-500">Handpicked listings that match your lifestyle and investment goals</p>
            </div>
            <Link to="/Properties">
              <Button variant="outline" className="border-sky-500 text-sky-600 hover:bg-sky-50 font-semibold gap-2">
                View All <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="rounded-2xl overflow-hidden border border-slate-100 animate-pulse">
                  <div className="h-56 bg-slate-100" />
                  <div className="p-5 space-y-3">
                    <div className="h-4 bg-slate-100 rounded w-3/4" />
                    <div className="h-3 bg-slate-100 rounded w-1/2" />
                    <div className="h-3 bg-slate-100 rounded w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              {usingDemo && (
                <div className="mb-6 px-4 py-3 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-700 flex items-center gap-2">
                  <span className="text-base">ℹ️</span>
                  Showing sample listings. Connect the backend to display live properties.
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {properties.slice(0, 6).map((property) => {
                  const isDemo = property.isDemo;
                  const href = isDemo ? "/Properties" : `/property/${property.id}`;
                  const imgSrc = isDemo
                    ? property.img
                    : (property.images?.[0] || "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=70");
                  const title = isDemo ? property.title : property.title;
                  const location = isDemo ? property.location : `${property.county}, Kenya`;
                  const badge = isDemo ? property.type : property.listingType;
                  const price = isDemo ? `KSh ${property.price}` : `KSh ${property.price?.toLocaleString()}`;
                  const beds = isDemo ? property.beds : property.bedrooms;
                  const baths = isDemo ? property.baths : property.bathrooms;
                  const area = isDemo ? property.area : property.areaSqm;
                  const areaLabel = isDemo && typeof area === "string" ? area : area ? `${area} m²` : null;

                  return (
                    <Link key={property.id} to={href}>
                      <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300 border border-slate-100 hover:border-sky-200 group rounded-2xl">
                        <div className="relative h-56 overflow-hidden bg-slate-100">
                          <img
                            src={imgSrc}
                            alt={title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute top-3 left-3">
                            <Badge className="bg-sky-500 text-white border-0 text-xs font-semibold shadow">{badge}</Badge>
                          </div>
                          {isDemo && (
                            <div className="absolute top-3 right-3">
                              <Badge className="bg-slate-700/80 text-slate-200 border-0 text-xs">Sample</Badge>
                            </div>
                          )}
                          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/70 to-transparent" />
                          <div className="absolute bottom-3 left-4 text-white font-bold text-xl">{price}</div>
                        </div>
                        <CardContent className="p-5">
                          <h3 className="font-bold text-slate-900 text-base mb-1.5 line-clamp-1 group-hover:text-sky-600 transition-colors">{title}</h3>
                          <div className="flex items-center text-slate-500 text-sm mb-4">
                            <MapPin className="w-3.5 h-3.5 mr-1 text-sky-400 shrink-0" />
                            <span className="truncate">{location}</span>
                          </div>
                          <div className="flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-100">
                            {beds && <span className="flex items-center gap-1"><Bed className="w-3.5 h-3.5 text-sky-400" /> {beds} Beds</span>}
                            {baths && <span className="flex items-center gap-1"><Bath className="w-3.5 h-3.5 text-sky-400" /> {baths} Baths</span>}
                            {areaLabel && <span className="flex items-center gap-1"><Maximize className="w-3.5 h-3.5 text-sky-400" /> {areaLabel}</span>}
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </section>

      {/* ─── WHY BK PROPERTIES ─── */}
      <section className="py-24 bg-gradient-to-br from-slate-900 to-slate-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 pointer-events-none"
          style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "40px 40px" }} />
        <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-sky-500/20 text-sky-300 border-sky-500/30 text-xs font-semibold uppercase tracking-wider">Why Us</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose BK Properties?</h2>
            <p className="text-slate-300 max-w-xl mx-auto">We put your success first with best-in-class service and deep local expertise</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feat, i) => (
              <div key={i} className="group p-7 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-sky-500/50 transition-all duration-300">
                <div className="w-14 h-14 bg-gradient-to-br from-sky-500 to-sky-600 rounded-2xl flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform">
                  <feat.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-lg font-bold mb-2">{feat.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{feat.description}</p>
              </div>
            ))}
          </div>

          {/* Trust badges */}
          <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "SSL Secured", icon: Shield },
              { label: "Verified Agents", icon: CheckCircle },
              { label: "47 Counties", icon: MapPin },
              { label: "Since 2020", icon: Award },
            ].map(({ label, icon: Icon }, i) => (
              <div key={i} className="flex items-center gap-3 bg-white/5 rounded-xl px-4 py-3 border border-white/10">
                <Icon className="w-5 h-5 text-sky-400 shrink-0" />
                <span className="text-sm font-medium text-slate-200">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ─── */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-14">
            <Badge className="mb-3 bg-emerald-50 text-emerald-600 border-emerald-200 text-xs font-semibold uppercase tracking-wider">Reviews</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">What Our Clients Say</h2>
            <p className="text-slate-500 max-w-xl mx-auto">Real stories from people who found their dream properties with us</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <Card key={i} className="p-7 border border-slate-100 hover:border-sky-200 hover:shadow-xl transition-all rounded-2xl bg-white">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(t.rating)].map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-slate-700 mb-6 italic leading-relaxed text-sm">"{t.content}"</p>
                <div className="flex items-center gap-3">
                  <div className={`w-11 h-11 rounded-full bg-gradient-to-br ${t.color} flex items-center justify-center text-white font-bold text-sm shadow`}>
                    {t.initials}
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900 text-sm">{t.name}</div>
                    <div className="text-xs text-slate-400">{t.role}</div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ─── BLOG ─── */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <Badge className="mb-3 bg-sky-50 text-sky-600 border-sky-200 text-xs font-semibold uppercase tracking-wider">Insights</Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">Property News & Guides</h2>
              <p className="text-slate-500">Stay informed with expert advice and Kenya market insights</p>
            </div>
            <Link to="/Blog">
              <Button variant="outline" className="border-sky-500 text-sky-600 hover:bg-sky-50 font-semibold gap-2 self-start md:self-auto">
                All Articles <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {BLOG_POSTS.slice(0, 3).map((post) => (
              <Link key={post.id} to={`/blog/${post.slug}`} className="group block">
                <Card className="overflow-hidden hover:shadow-xl transition-all border border-slate-100 hover:border-sky-100 rounded-2xl h-full">
                  <div className="relative h-52 overflow-hidden bg-slate-100">
                    <img src={post.thumbnail} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute top-3 left-3">
                      <Badge className="bg-amber-500 text-white border-0 text-xs shadow">{post.category}</Badge>
                    </div>
                  </div>
                  <CardContent className="p-5 flex flex-col">
                    <div className="flex items-center gap-3 text-xs text-slate-400 mb-3">
                      <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {post.date}</span>
                      <span>{post.readTime} read</span>
                    </div>
                    <h3 className="font-bold text-slate-900 mb-2 line-clamp-2 group-hover:text-sky-600 transition-colors text-sm leading-snug flex-1">
                      {post.title}
                    </h3>
                    <p className="text-slate-500 text-sm mb-4 line-clamp-2 leading-relaxed">{post.excerpt}</p>
                    <div className="flex items-center gap-2 text-sky-600 font-semibold text-sm">
                      Read More <ChevronRight className="w-4 h-4" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="py-24 bg-gradient-to-br from-sky-500 to-sky-700 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none"
          style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "40px 40px" }} />
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Award className="w-8 h-8 text-amber-300" />
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold mb-5 leading-tight">
            Ready to Find Your<br />Dream Property?
          </h2>
          <p className="text-sky-100 text-lg mb-10 max-w-xl mx-auto leading-relaxed">
            Get in touch with our expert team today. We're here to help you every step of the way.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
            <a href="tel:+254720321107">
              <Button className="bg-white text-sky-600 hover:bg-sky-50 font-bold px-8 py-6 text-base shadow-xl rounded-xl gap-2">
                <Phone className="w-5 h-5" /> Call: +254 720 321107
              </Button>
            </a>
            <a href="mailto:info@bkproperties.co.ke">
              <Button className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-8 py-6 text-base shadow-xl rounded-xl gap-2">
                <Mail className="w-5 h-5" /> Email Us
              </Button>
            </a>
          </div>

          <div className="flex justify-center gap-3">
            {[
              { href: "https://facebook.com/bkproperties", icon: Facebook, label: "Facebook" },
              { href: "https://twitter.com/bkproperties", icon: Twitter, label: "Twitter" },
              { href: "https://instagram.com/bkproperties", icon: Instagram, label: "Instagram" },
              { href: "https://linkedin.com/company/bkproperties", icon: Linkedin, label: "LinkedIn" },
              { href: "https://youtube.com/@bkproperties", icon: Youtube, label: "YouTube" },
            ].map(({ href, icon: Icon, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="w-11 h-11 rounded-xl bg-white/15 backdrop-blur hover:bg-white/25 flex items-center justify-center transition-all hover:scale-110"
              >
                <Icon className="w-5 h-5" />
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
