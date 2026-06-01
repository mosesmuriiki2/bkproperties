import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  Search, MapPin, Home as HomeIcon, Building2, TrendingUp, Shield, Users, 
  Phone, Mail, Facebook, Twitter, Instagram, Linkedin, Youtube,
  ArrowRight, CheckCircle, Star, MessageSquare, Calendar, Bed, Bath, Maximize, Award
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import apiClient from "@/api/apiClient";

export default function Home() {
  const [properties, setProperties] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFeaturedProperties();
  }, []);

  const loadFeaturedProperties = async () => {
    try {
      const response = await apiClient.properties.getActive(0, 6);
      setProperties(response.content || response || []);
    } catch (error) {
      console.error("Error loading properties:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      window.location.href = `/properties?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  const stats = [
    { icon: HomeIcon, label: "Properties Listed", value: "5,000+", color: "from-sky-500 to-sky-600" },
    { icon: Users, label: "Happy Clients", value: "10,000+", color: "from-amber-500 to-amber-600" },
    { icon: Building2, label: "Cities Covered", value: "47", color: "from-emerald-500 to-emerald-600" },
    { icon: TrendingUp, label: "Success Rate", value: "98%", color: "from-purple-500 to-purple-600" }
  ];

  const features = [
    {
      icon: Shield,
      title: "Verified Listings",
      description: "All properties are verified and authenticated for your safety and peace of mind"
    },
    {
      icon: Users,
      title: "Expert Agents",
      description: "Professional agents ready to assist you in finding your dream property"
    },
    {
      icon: TrendingUp,
      title: "Market Insights",
      description: "Get the latest market trends and property valuations in real-time"
    },
    {
      icon: MessageSquare,
      title: "24/7 Support",
      description: "Round-the-clock customer support for all your queries and concerns"
    }
  ];

  const blogPosts = [
    {
      id: 1,
      title: "Top 10 Neighborhoods in Nairobi for First-Time Home Buyers",
      excerpt: "Discover the best areas in Nairobi perfect for first-time buyers with great amenities and investment potential.",
      image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800",
      date: "May 15, 2026",
      category: "Buying Guide",
      readTime: "5 min read"
    },
    {
      id: 2,
      title: "Understanding Property Investment in Kenya: A Complete Guide",
      excerpt: "Everything you need to know about investing in Kenyan real estate, from legal requirements to ROI expectations.",
      image: "https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?w=800",
      date: "May 12, 2026",
      category: "Investment",
      readTime: "8 min read"
    },
    {
      id: 3,
      title: "Land Buying Process in Kenya: Step-by-Step Guide",
      excerpt: "Navigate the land acquisition process with confidence. Learn about title deeds, surveys, and legal procedures.",
      image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800",
      date: "May 10, 2026",
      category: "Legal",
      readTime: "6 min read"
    }
  ];

  const testimonials = [
    {
      name: "John Kamau",
      role: "Property Owner",
      content: "BK Properties helped me find my dream home in Nairobi. The process was smooth and professional!",
      rating: 5,
      image: "https://ui-avatars.com/api/?name=John+Kamau&background=0ea5e9&color=fff"
    },
    {
      name: "Mary Wanjiku",
      role: "Investor",
      content: "Excellent service! I've purchased 3 properties through BK Properties. Highly recommended!",
      rating: 5,
      image: "https://ui-avatars.com/api/?name=Mary+Wanjiku&background=0ea5e9&color=fff"
    },
    {
      name: "David Ochieng",
      role: "First-Time Buyer",
      content: "The team was patient and guided me through every step. Found the perfect apartment!",
      rating: 5,
      image: "https://ui-avatars.com/api/?name=David+Ochieng&background=0ea5e9&color=fff"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-32 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00em0wLTEwYzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-20"></div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-20 right-10 w-72 h-72 bg-sky-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl"></div>
        
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <Badge className="mb-6 bg-sky-500/20 text-sky-300 border-sky-500/30 px-4 py-1.5 text-sm">
              🏘️ Kenya's #1 Property Marketplace
            </Badge>
            <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
              Find Your Perfect<br />
              <span className="bg-gradient-to-r from-sky-400 to-amber-400 bg-clip-text text-transparent">Property in Kenya</span>
            </h1>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-10 leading-relaxed">
              Browse thousands of verified properties for sale, rent, and lease across Kenya and Africa. 
              Your trusted partner in real estate.
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-2xl p-8">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <Input
                    type="text"
                    placeholder="Search by location, property type, or keyword..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    className="pl-12 h-14 text-lg border-slate-200 focus:border-sky-500 focus:ring-sky-500"
                  />
                </div>
                <Button 
                  onClick={handleSearch}
                  className="bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white h-14 px-10 text-lg font-semibold shadow-lg"
                >
                  <Search className="w-5 h-5 mr-2" />
                  Search Properties
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-2 mt-6">
                <span className="text-sm text-slate-600 font-medium">Popular:</span>
                {["Nairobi", "Mombasa", "Kisumu", "Land", "Apartments", "Houses"].map(tag => (
                  <Badge key={tag} variant="outline" className="cursor-pointer hover:bg-sky-50 hover:border-sky-500 hover:text-sky-600 transition-colors">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, idx) => (
              <div key={idx} className="text-center group">
                <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-4xl font-bold text-slate-900 mb-2">{stat.value}</div>
                <div className="text-slate-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-sky-50 text-sky-600 border-sky-200">Featured</Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">Premium Properties</h2>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">Handpicked properties that match your lifestyle and investment goals</p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="w-12 h-12 border-4 border-sky-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {properties.slice(0, 6).map(property => (
                <Link key={property.id} to={`/property/${property.id}`}>
                  <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300 border-2 hover:border-sky-500 group">
                    <div className="relative h-64 overflow-hidden">
                      <img 
                        src={property.images?.[0] || "https://via.placeholder.com/400x300?text=Property"} 
                        alt={property.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <Badge className="absolute top-4 right-4 bg-sky-500 text-white border-0 shadow-lg">
                        {property.listingType}
                      </Badge>
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                        <div className="text-white text-2xl font-bold">
                          KSh {property.price?.toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <CardContent className="p-6">
                      <h3 className="font-bold text-xl text-slate-900 mb-2 line-clamp-1 group-hover:text-sky-600 transition-colors">{property.title}</h3>
                      <div className="flex items-center text-slate-600 mb-4">
                        <MapPin className="w-4 h-4 mr-1 text-sky-500" />
                        <span className="text-sm">{property.county}, Kenya</span>
                      </div>
                      <div className="flex items-center justify-between text-sm text-slate-600 pt-4 border-t">
                        {property.bedrooms && (
                          <span className="flex items-center gap-1">
                            <Bed className="w-4 h-4" /> {property.bedrooms} Beds
                          </span>
                        )}
                        {property.bathrooms && (
                          <span className="flex items-center gap-1">
                            <Bath className="w-4 h-4" /> {property.bathrooms} Baths
                          </span>
                        )}
                        {property.areaSqm && (
                          <span className="flex items-center gap-1">
                            <Maximize className="w-4 h-4" /> {property.areaSqm} m²
                          </span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link to="/properties">
              <Button className="bg-gradient-to-r from-slate-900 to-slate-800 hover:from-slate-800 hover:to-slate-700 text-white px-10 py-6 text-lg shadow-lg">
                View All Properties
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gradient-to-br from-slate-900 to-slate-800 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl"></div>
        
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-sky-500/20 text-sky-300 border-sky-500/30">Why Choose Us</Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Why BK Properties?</h2>
            <p className="text-slate-300 text-lg max-w-2xl mx-auto">Your success is our priority. We provide the best service in the industry</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, idx) => (
              <div key={idx} className="text-center p-8 rounded-2xl bg-slate-800/50 backdrop-blur hover:bg-slate-800 transition-all border border-slate-700 hover:border-sky-500 group">
                <div className="w-16 h-16 bg-gradient-to-br from-sky-500 to-sky-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-slate-400 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-amber-50 text-amber-600 border-amber-200">Latest Insights</Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">Property News & Guides</h2>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">Stay informed with expert advice and market insights</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {blogPosts.map(post => (
              <Card key={post.id} className="overflow-hidden hover:shadow-xl transition-all border-2 hover:border-sky-500 group">
                <div className="relative h-56 overflow-hidden">
                  <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                  <Badge className="absolute top-4 left-4 bg-amber-500 text-white border-0 shadow-lg">
                    {post.category}
                  </Badge>
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 text-xs text-slate-500 mb-3">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {post.date}
                    </span>
                    <span>{post.readTime}</span>
                  </div>
                  <h3 className="font-bold text-xl text-slate-900 mb-3 line-clamp-2 group-hover:text-sky-600 transition-colors">{post.title}</h3>
                  <p className="text-slate-600 mb-4 line-clamp-3 leading-relaxed">{post.excerpt}</p>
                  <Button variant="outline" className="w-full border-sky-500 text-sky-600 hover:bg-sky-50">
                    Read More
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-emerald-50 text-emerald-600 border-emerald-200">Testimonials</Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">What Our Clients Say</h2>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">Real stories from real people who found their dream properties</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, idx) => (
              <Card key={idx} className="p-8 border-2 hover:border-sky-500 hover:shadow-xl transition-all">
                <div className="flex items-center gap-1 mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-slate-700 mb-6 italic leading-relaxed">"{testimonial.content}"</p>
                <div className="flex items-center gap-4">
                  <img src={testimonial.image} alt={testimonial.name} className="w-14 h-14 rounded-full shadow-lg" />
                  <div>
                    <div className="font-bold text-slate-900">{testimonial.name}</div>
                    <div className="text-sm text-slate-600">{testimonial.role}</div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-24 bg-gradient-to-br from-sky-500 via-sky-600 to-sky-700 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-5xl mx-auto px-4 text-center relative z-10">
          <Award className="w-16 h-16 mx-auto mb-6 text-amber-300" />
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Find Your Dream Property?</h2>
          <p className="text-xl mb-10 text-sky-100 max-w-2xl mx-auto leading-relaxed">
            Get in touch with our expert team today. We're here to help you every step of the way.
          </p>
          
          <div className="flex flex-col md:flex-row gap-4 justify-center mb-10">
            <a href="tel:+254720321107">
              <Button className="bg-white text-sky-600 hover:bg-sky-50 px-10 py-6 text-lg shadow-xl font-semibold">
                <Phone className="w-5 h-5 mr-2" />
                Call: +254 720 321107
              </Button>
            </a>
            <a href="mailto:info@bkproperties.co.ke">
              <Button className="bg-slate-900 text-white hover:bg-slate-800 px-10 py-6 text-lg shadow-xl font-semibold">
                <Mail className="w-5 h-5 mr-2" />
                Email Us
              </Button>
            </a>
          </div>

          <div className="flex justify-center gap-4">
            <a href="https://facebook.com/bkproperties" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-white/10 backdrop-blur hover:bg-white/20 flex items-center justify-center transition-all hover:scale-110">
              <Facebook className="w-6 h-6" />
            </a>
            <a href="https://twitter.com/bkproperties" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-white/10 backdrop-blur hover:bg-white/20 flex items-center justify-center transition-all hover:scale-110">
              <Twitter className="w-6 h-6" />
            </a>
            <a href="https://instagram.com/bkproperties" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-white/10 backdrop-blur hover:bg-white/20 flex items-center justify-center transition-all hover:scale-110">
              <Instagram className="w-6 h-6" />
            </a>
            <a href="https://linkedin.com/company/bkproperties" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-white/10 backdrop-blur hover:bg-white/20 flex items-center justify-center transition-all hover:scale-110">
              <Linkedin className="w-6 h-6" />
            </a>
            <a href="https://youtube.com/@bkproperties" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-white/10 backdrop-blur hover:bg-white/20 flex items-center justify-center transition-all hover:scale-110">
              <Youtube className="w-6 h-6" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
