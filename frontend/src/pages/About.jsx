import { Home, Shield, Users, TrendingUp, CheckCircle, ArrowRight, MapPin, Phone, Mail, Award, Target, Heart, Building2, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

const values = [
  { icon: Shield, title: "Trust & Transparency", desc: "Every property is verified and authenticated. We believe in honest dealings and transparent processes." },
  { icon: Users, title: "Customer First", desc: "Your satisfaction is our priority. We're here to guide you through every step of your property journey." },
  { icon: Award, title: "Excellence", desc: "We maintain the highest standards in property listings, customer service, and professional conduct." },
  { icon: Heart, title: "Community Focus", desc: "We're committed to building communities and helping Kenyans find their perfect homes and investments." },
];

const services = [
  { icon: "🏠", label: "Houses for Sale", desc: "Find your dream home from our extensive collection of verified houses across Kenya" },
  { icon: "🏢", label: "Houses for Rent", desc: "Quality rental properties in prime locations with flexible terms" },
  { icon: "🌳", label: "Land for Sale", desc: "Prime plots and acreage with clear title deeds in all counties" },
  { icon: "🏘️", label: "Apartments", desc: "Modern apartments for sale and rent in urban centers" },
  { icon: "🏪", label: "Commercial Properties", desc: "Office spaces, retail shops, and warehouses for your business" },
  { icon: "📋", label: "Property Leasing", desc: "Flexible lease options for residential and commercial properties" },
];

const whyChooseUs = [
  { step: "01", title: "Verified Listings", desc: "All properties are thoroughly verified with authentic documentation and clear ownership." },
  { step: "02", title: "Expert Guidance", desc: "Our experienced agents provide professional advice throughout your property journey." },
  { step: "03", title: "Wide Selection", desc: "Access thousands of properties across all 47 counties in Kenya and beyond." },
  { step: "04", title: "Secure Transactions", desc: "Safe and transparent processes with legal support for all property transactions." },
];

const stats = [
  { value: "5,000+", label: "Properties Listed", icon: Home },
  { value: "10,000+", label: "Happy Clients", icon: Users },
  { value: "47", label: "Counties Covered", icon: MapPin },
  { value: "98%", label: "Success Rate", icon: TrendingUp }
];

export default function About() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-32 px-4 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 rounded-full bg-sky-500 blur-3xl" />
          <div className="absolute bottom-10 right-20 w-96 h-96 rounded-full bg-amber-500 blur-3xl" />
        </div>
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <Badge className="mb-6 bg-sky-500/20 text-sky-300 border-sky-500/30 px-4 py-1.5">About BK Properties</Badge>
          <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-6 leading-tight">
            Your Trusted Property<br />
            <span className="bg-gradient-to-r from-sky-400 to-amber-400 bg-clip-text text-transparent">Partner in Kenya</span>
          </h1>
          <p className="text-slate-300 text-xl max-w-3xl mx-auto leading-relaxed">
            BK Properties is Kenya's leading property marketplace, connecting buyers, sellers, and renters with their perfect properties across Kenya and East Africa.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-gradient-to-r from-sky-500 to-sky-600 py-16">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map(({ value, label, icon: Icon }) => (
            <div key={label} className="group">
              <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-white/10 backdrop-blur flex items-center justify-center group-hover:scale-110 transition-transform">
                <Icon className="w-7 h-7 text-white" />
              </div>
              <p className="text-4xl font-extrabold text-white mb-1">{value}</p>
              <p className="text-sky-100 text-sm font-medium">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Who We Are */}
      <section className="max-w-6xl mx-auto px-4 py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <Badge className="mb-4 bg-sky-50 text-sky-600 border-sky-200">Who We Are</Badge>
            <h2 className="text-4xl font-bold text-slate-900 mb-6">Kenya's Premier Property Marketplace</h2>
            <p className="text-slate-600 mb-4 leading-relaxed text-lg">
              <strong className="text-slate-900">BK Properties</strong> is a dedicated property marketplace platform that specializes in connecting property seekers with verified listings across Kenya and East Africa. We focus exclusively on real estate, ensuring you get the best property solutions.
            </p>
            <p className="text-slate-600 mb-4 leading-relaxed">
              Whether you're looking to <strong className="text-slate-900">buy your first home</strong>, <strong className="text-slate-900">invest in land</strong>, <strong className="text-slate-900">rent an apartment</strong>, or <strong className="text-slate-900">lease commercial space</strong>, BK Properties provides a trusted platform with verified listings and professional support.
            </p>
            <p className="text-slate-600 leading-relaxed">
              We serve all <strong className="text-slate-900">47 counties in Kenya</strong> and are expanding across East Africa, making property transactions simple, secure, and transparent for everyone.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {services.map(s => (
              <Card key={s.label} className="p-5 hover:shadow-xl transition-all border-2 hover:border-sky-500 group">
                <span className="text-3xl mb-3 block">{s.icon}</span>
                <p className="font-semibold text-slate-900 text-sm mb-2 group-hover:text-sky-600 transition-colors">{s.label}</p>
                <p className="text-xs text-slate-500 leading-relaxed">{s.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Our Mission & Vision */}
      <section className="bg-slate-50 py-24">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-amber-50 text-amber-600 border-amber-200">Our Purpose</Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900">Mission & Vision</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="p-10 border-2 border-sky-100 hover:border-sky-500 hover:shadow-xl transition-all">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-sky-500 to-sky-600 flex items-center justify-center mb-6 shadow-lg">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Our Mission</h3>
              <p className="text-slate-600 leading-relaxed text-lg">
                To make property ownership accessible to every Kenyan by providing a transparent, secure, and efficient marketplace that connects property seekers with verified listings and trusted agents.
              </p>
            </Card>
            <Card className="p-10 border-2 border-amber-100 hover:border-amber-500 hover:shadow-xl transition-all">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center mb-6 shadow-lg">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Our Vision</h3>
              <p className="text-slate-600 leading-relaxed text-lg">
                To be Africa's most trusted property marketplace, empowering millions to find their dream homes and make smart property investments across the continent.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="max-w-6xl mx-auto px-4 py-24">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-emerald-50 text-emerald-600 border-emerald-200">Our Advantage</Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">Why Choose BK Properties?</h2>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">Your success is our priority</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {whyChooseUs.map(s => (
            <Card key={s.step} className="p-8 border-2 border-slate-100 hover:border-sky-500 hover:shadow-xl transition-all text-center group">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-sky-500 to-sky-600 flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform">
                <span className="text-white font-extrabold text-xl">{s.step}</span>
              </div>
              <h3 className="font-bold text-slate-900 mb-3 text-lg">{s.title}</h3>
              <p className="text-slate-600 text-sm leading-relaxed">{s.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Our Values */}
      <section className="bg-gradient-to-br from-slate-900 to-slate-800 py-24 px-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl"></div>
        
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-sky-500/20 text-sky-300 border-sky-500/30">Core Values</Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">What We Stand For</h2>
            <p className="text-slate-300 text-lg max-w-2xl mx-auto">The principles that guide everything we do</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map(v => (
              <div key={v.title} className="p-8 rounded-2xl bg-slate-800/50 backdrop-blur hover:bg-slate-800 transition-all border border-slate-700 hover:border-sky-500 group">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-sky-500 to-sky-600 flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform">
                  <v.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="font-bold text-white mb-3 text-lg">{v.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="max-w-6xl mx-auto px-4 py-24">
        <Card className="bg-gradient-to-br from-sky-500 via-sky-600 to-sky-700 rounded-3xl p-12 text-center text-white border-0 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          </div>
          
          <div className="relative z-10">
            <Building2 className="w-16 h-16 mx-auto mb-6 text-amber-300" />
            <h2 className="text-4xl font-bold mb-4">Ready to Find Your Dream Property?</h2>
            <p className="text-sky-100 mb-10 max-w-2xl mx-auto text-lg leading-relaxed">
              Get in touch with our expert team today. We're here to help you every step of the way.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              <div className="bg-white/10 rounded-2xl p-6 backdrop-blur hover:bg-white/20 transition-all">
                <Phone className="w-8 h-8 mx-auto mb-3" />
                <p className="font-semibold mb-1">Call Us</p>
                <p className="text-sky-100">+254 720 321107</p>
              </div>
              <div className="bg-white/10 rounded-2xl p-6 backdrop-blur hover:bg-white/20 transition-all">
                <Mail className="w-8 h-8 mx-auto mb-3" />
                <p className="font-semibold mb-1">Email Us</p>
                <p className="text-sky-100">info@bkproperties.co.ke</p>
              </div>
              <div className="bg-white/10 rounded-2xl p-6 backdrop-blur hover:bg-white/20 transition-all">
                <MapPin className="w-8 h-8 mx-auto mb-3" />
                <p className="font-semibold mb-1">Visit Us</p>
                <p className="text-sky-100">Nairobi, Kenya</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to={createPageUrl("Properties")}>
                <Button className="bg-white text-sky-600 hover:bg-sky-50 px-10 py-6 text-lg shadow-xl font-semibold">
                  <Home className="w-5 h-5 mr-2" /> Browse Properties
                </Button>
              </Link>
              <Link to={createPageUrl("VendorPortal")}>
                <Button variant="outline" className="border-white/30 text-white hover:bg-white/10 px-10 py-6 text-lg backdrop-blur font-semibold">
                  <Users className="w-5 h-5 mr-2" /> List Your Property
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
}
