import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  Search, MapPin, Home, Building2, TrendingUp, Shield, Users, 
  Phone, Mail, Facebook, Twitter, Instagram, Linkedin, Youtube,
  ArrowRight, CheckCircle, Star, MessageSquare, Calendar
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
    { icon: Home, label: "Properties Listed", value: "5,000+", color: "text-green-600" },
    { icon: Users, label: "Happy Clients", value: "10,000+", color: "text-green-600" },
    { icon: Building2, label: "Cities Covered", value: "47", color: "text-green-600" },
    { icon: TrendingUp, label: "Success Rate", value: "98%", color: "text-green-600" }
  ];

  const features = [
    {
      icon: Shield,
      title: "Verified Listings",
      description: "All properties are verified and authenticated for your safety"
    },
    {
      icon: Users,
      title: "Expert Agents",
      description: "Professional agents ready to assist you in finding your dream property"
    },
    {
      icon: TrendingUp,
      title: "Market Insights",
      description: "Get the latest market trends and property valuations"
    },
    {
      icon: MessageSquare,
      title: "24/7 Support",
      description: "Round-the-clock customer support for all your queries"
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
      image: "https://ui-avatars.com/api/?name=John+Kamau&background=16a34a&color=fff"
    },
    {
      name: "Mary Wanjiku",
      role: "Investor",
      content: "Excellent service! I've purchased 3 properties through BK Properties. Highly recommended!",
      rating: 5,
      image: "https://ui-avatars.com/api/?name=Mary+Wanjiku&background=16a34a&color=fff"
    },
    {
      name: "David Ochieng",
      role: "First-Time Buyer",
      content: "The team was patient and guided me through every step. Found the perfect apartment!",
      rating: 5,
      image: "https://ui-avatars.com/api/?name=David+Ochieng&background=16a34a&color=fff"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-black via-gray-900 to-green-900 text-white py-24 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00em0wLTEwYzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-20"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-green-600 text-white border-0 px-4 py-1">
              🏘️ Kenya's Trusted Property Marketplace
            </Badge>
            <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
              Find Your Dream<br />
              <span className="text-green-400">Property in Kenya</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Browse thousands of verified properties for sale, rent, and lease across Kenya and Africa. 
              Your trusted partner in real estate.
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-2xl p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    type="text"
                    placeholder="Search by location, property type, or keyword..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    className="pl-12 h-14 text-lg border-gray-200 focus:border-green-600"
                  />
                </div>
                <Button 
                  onClick={handleSearch}
                  className="bg-green-600 hover:bg-green-700 text-white h-14 px-8 text-lg font-semibold"
                >
                  <Search className="w-5 h-5 mr-2" />
                  Search Properties
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-2 mt-4">
                <span className="text-sm text-gray-600">Popular:</span>
                {["Nairobi", "Mombasa", "Kisumu", "Land", "Apartments"].map(tag => (
                  <Badge key={tag} variant="outline" className="cursor-pointer hover:bg-green-50 hover:border-green-600">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, idx) => (
              <div key={idx} className="text-center">
                <stat.icon className={`w-12 h-12 mx-auto mb-3 ${stat.color}`} />
                <div className="text-4xl font-bold text-black mb-1">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-black mb-4">Featured Properties</h2>
            <p className="text-gray-600 text-lg">Handpicked properties just for you</p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {properties.slice(0, 6).map(property => (
                <Link key={property.id} to={`/property/${property.id}`}>
                  <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300 border-2 hover:border-green-600">
                    <div className="relative h-64">
                      <img 
                        src={property.images?.[0] || "https://via.placeholder.com/400x300?text=Property"} 
                        alt={property.title}
                        className="w-full h-full object-cover"
                      />
                      <Badge className="absolute top-4 right-4 bg-green-600 text-white border-0">
                        {property.listingType}
                      </Badge>
                    </div>
                    <CardContent className="p-6">
                      <h3 className="font-bold text-xl text-black mb-2 line-clamp-1">{property.title}</h3>
                      <div className="flex items-center text-gray-600 mb-3">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span className="text-sm">{property.county}, Kenya</span>
                      </div>
                      <div className="text-3xl font-bold text-green-600 mb-4">
                        KSh {property.price?.toLocaleString()}
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        {property.bedrooms && <span>{property.bedrooms} Beds</span>}
                        {property.bathrooms && <span>{property.bathrooms} Baths</span>}
                        {property.areaSqm && <span>{property.areaSqm} m²</span>}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link to="/properties">
              <Button className="bg-black hover:bg-gray-800 text-white px-8 py-6 text-lg">
                View All Properties
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-black text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Why Choose BK Properties?</h2>
            <p className="text-gray-400 text-lg">Your success is our priority</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, idx) => (
              <div key={idx} className="text-center p-6 rounded-xl bg-gray-900 hover:bg-gray-800 transition-colors">
                <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-black mb-4">Property Insights & News</h2>
            <p className="text-gray-600 text-lg">Stay informed with our latest articles</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {blogPosts.map(post => (
              <Card key={post.id} className="overflow-hidden hover:shadow-xl transition-shadow">
                <div className="relative h-48">
                  <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
                  <Badge className="absolute top-4 left-4 bg-green-600 text-white border-0">
                    {post.category}
                  </Badge>
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {post.date}
                    </span>
                    <span>{post.readTime}</span>
                  </div>
                  <h3 className="font-bold text-xl text-black mb-3 line-clamp-2">{post.title}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
                  <Button variant="outline" className="w-full border-green-600 text-green-600 hover:bg-green-50">
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
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-black mb-4">What Our Clients Say</h2>
            <p className="text-gray-600 text-lg">Real stories from real people</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, idx) => (
              <Card key={idx} className="p-6">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-green-600 text-green-600" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic">"{testimonial.content}"</p>
                <div className="flex items-center gap-3">
                  <img src={testimonial.image} alt={testimonial.name} className="w-12 h-12 rounded-full" />
                  <div>
                    <div className="font-bold text-black">{testimonial.name}</div>
                    <div className="text-sm text-gray-600">{testimonial.role}</div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-green-700 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Find Your Dream Property?</h2>
          <p className="text-xl mb-8 text-green-50">
            Get in touch with our expert team today. We're here to help you every step of the way.
          </p>
          
          <div className="flex flex-col md:flex-row gap-4 justify-center mb-8">
            <a href="tel:+254720321107">
              <Button className="bg-white text-green-600 hover:bg-gray-100 px-8 py-6 text-lg">
                <Phone className="w-5 h-5 mr-2" />
                Call: +254 720 321107
              </Button>
            </a>
            <a href="mailto:info@bkproperties.co.ke">
              <Button className="bg-black text-white hover:bg-gray-900 px-8 py-6 text-lg">
                <Mail className="w-5 h-5 mr-2" />
                Email Us
              </Button>
            </a>
          </div>

          <div className="flex justify-center gap-6">
            <a href="https://facebook.com/bkproperties" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform">
              <Facebook className="w-8 h-8" />
            </a>
            <a href="https://twitter.com/bkproperties" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform">
              <Twitter className="w-8 h-8" />
            </a>
            <a href="https://instagram.com/bkproperties" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform">
              <Instagram className="w-8 h-8" />
            </a>
            <a href="https://linkedin.com/company/bkproperties" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform">
              <Linkedin className="w-8 h-8" />
            </a>
            <a href="https://youtube.com/@bkproperties" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform">
              <Youtube className="w-8 h-8" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
