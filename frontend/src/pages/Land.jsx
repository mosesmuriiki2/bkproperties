import { useState } from "react";
import { getModuleConfig } from "@/lib/issueStore";
import { MapPin, Search, Home, Filter, ChevronDown, ChevronUp, ArrowLeft, ArrowRight, CheckCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import { toast } from "sonner";

const vendors = [
  {
    id: "optiven", name: "Optiven Limited", logo: "🌍", rating: 4.8,
    listings: [
      { id: 1, title: "50x100 Residential Plot – Thika Road", location: "Ruiru, Kiambu", size: "50x100 ft", price: 18000, negotiable: true, use: ["Residential", "Commercial"], category: "residential", images: ["https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80", "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80"], description: "Prime plot in a fast-growing estate off Thika Superhighway with all utilities. Ready title deed.", availability: "Available" },
      { id: 2, title: "2.5 Acres Agricultural Land", location: "Nakuru County", size: "2.5 Acres", price: 35000, negotiable: false, use: ["Agricultural", "Farming"], category: "agricultural", images: ["https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80"], description: "Fertile agricultural land ideal for farming with borehole access and natural water supply.", availability: "Available" },
      { id: 3, title: "Beachfront Plot – Diani", location: "Diani Beach, Mombasa", size: "100x200 ft", price: 120000, negotiable: true, use: ["Commercial", "Resort"], category: "commercial", images: ["https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80", "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80"], description: "Rare beachfront plot steps from the Indian Ocean. Perfect for resort development. All approvals available.", availability: "Available" },
    ]
  },
  {
    id: "landlens", name: "Land Lens Kenya", logo: "🗺️", rating: 4.6,
    listings: [
      { id: 4, title: "1 Acre Plot – Karen", location: "Karen, Nairobi", size: "1 Acre", price: 85000, negotiable: true, use: ["Residential", "Villa"], category: "residential", images: ["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80"], description: "Serene 1-acre plot in Karen with ready title deed. Ideal for luxury home. Gated estate.", availability: "Available" },
      { id: 5, title: "Industrial Land – Mombasa Road", location: "Athi River, Machakos", size: "5 Acres", price: 220000, negotiable: false, use: ["Industrial", "Warehouse"], category: "industrial", images: ["https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80"], description: "Well-positioned industrial land along Mombasa Road with easy highway access. All utilities connected.", availability: "Available" },
    ]
  }
];

function ImageGallery({ images, title }) {
  const [idx, setIdx] = useState(0);
  if (!images || images.length === 0) return null;
  return (
    <div className="relative rounded-xl overflow-hidden mb-4">
      <img src={images[idx]} alt={title} className="w-full h-60 object-cover" />
      {images.length > 1 && (
        <>
          <button onClick={() => setIdx(i => (i - 1 + images.length) % images.length)} className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white w-9 h-9 rounded-full flex items-center justify-center">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <button onClick={() => setIdx(i => (i + 1) % images.length)} className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white w-9 h-9 rounded-full flex items-center justify-center">
            <ArrowRight className="w-4 h-4" />
          </button>
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {images.map((_, i) => <button key={i} onClick={() => setIdx(i)} className={`w-2 h-2 rounded-full ${i === idx ? "bg-white" : "bg-white/50"}`} />)}
          </div>
        </>
      )}
    </div>
  );
}

export default function Land() {
  const moduleConfig = getModuleConfig();
  const [search, setSearch] = useState("");
  const [filterLocation, setFilterLocation] = useState("");
  const [filterPrice, setFilterPrice] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterVendor, setFilterVendor] = useState("all");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selectedLand, setSelectedLand] = useState(null);
  const [inquiryLand, setInquiryLand] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!moduleConfig.land) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">🌍</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Land & Plots Unavailable</h2>
          <p className="text-gray-500 mb-6">This module has been temporarily disabled by the platform administrator. Please check back soon.</p>
          <Link to="/" className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-6 py-2.5 rounded-xl font-medium transition-colors"><Home className="w-4 h-4" /> Back to Home</Link>
        </div>
      </div>
    );
  }

  const allListings = vendors.flatMap(v => v.listings.map(l => ({ ...l, vendor: v })));

  const filtered = allListings.filter(l => {
    const matchSearch = !search || l.title.toLowerCase().includes(search.toLowerCase()) || l.location.toLowerCase().includes(search.toLowerCase());
    const matchVendor = filterVendor === "all" || l.vendor.id === filterVendor;
    const matchLoc = !filterLocation || l.location.toLowerCase().includes(filterLocation.toLowerCase());
    const matchCat = filterCategory === "all" || l.category === filterCategory;
    const matchPrice = !filterPrice || (() => {
      const [min, max] = filterPrice.split("-").map(Number);
      return max ? l.price >= min && l.price <= max : l.price >= min;
    })();
    return matchSearch && matchVendor && matchLoc && matchCat && matchPrice;
  });

  const relatedListings = (current) => allListings.filter(l => l.id !== current.id && l.vendor.id === current.vendor.id).slice(0, 2);

  const handleSubmit = async () => {
    if (!form.name || !form.email) { toast.error("Please fill in your name and email."); return; }
    setLoading(true);
    try {
      await base44.integrations.Core.SendEmail({
        to: form.email,
        subject: `Land Inquiry Received – ${inquiryLand?.title}`,
        body: `Dear ${form.name},\n\nThank you for your inquiry about:\n\n📍 ${inquiryLand?.title}\n📌 ${inquiryLand?.location}\n📐 ${inquiryLand?.size}\n💰 USD ${inquiryLand?.price?.toLocaleString()}\n\nThe vendor will get back to you within 24 hours.\n\nBest regards,\nBK Properties Team`
      });
      toast.success("Confirmation email sent!");
    } catch (e) {
      toast.info("Inquiry submitted successfully!");
    }
    setLoading(false);
    setDone(true);
  };

  const resetForm = () => { setDone(false); setInquiryLand(null); setForm({ name: "", email: "", phone: "", message: "" }); };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="relative py-20 md:py-28 px-4 overflow-hidden">
        <img src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1600&q=80" alt="Land" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-amber-900/85 to-yellow-900/75" />
        <div className="relative max-w-4xl mx-auto text-center">
          <Link to={createPageUrl("Home")} className="inline-flex items-center gap-2 text-white/70 hover:text-white text-sm mb-6 transition-colors">
            <Home className="w-4 h-4" /> Back to Home
          </Link>
          <Badge className="mb-4 bg-yellow-500/20 text-yellow-200 border-yellow-400/30 block w-fit mx-auto">🌍 Land & Plots</Badge>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4">Land & Plots</h1>
          <p className="text-yellow-100 text-base md:text-lg mb-8">Residential plots, agricultural land & commercial sites from verified vendors</p>
          <div className="bg-white rounded-2xl p-3 max-w-3xl mx-auto shadow-xl">
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="flex items-center gap-2 flex-1 px-3 sm:border-r border-gray-200">
                <Search className="w-4 h-4 text-gray-400 shrink-0" />
                <input type="text" placeholder="Search land listings..." className="w-full outline-none text-gray-700 text-sm py-1.5 bg-transparent" value={search} onChange={e => setSearch(e.target.value)} />
              </div>
              <div className="flex items-center gap-2 flex-1 px-3">
                <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
                <input type="text" placeholder="Location..." className="w-full outline-none text-gray-700 text-sm py-1.5 bg-transparent" value={filterLocation} onChange={e => setFilterLocation(e.target.value)} />
              </div>
              <Button className="bg-amber-500 hover:bg-amber-600 text-white rounded-xl px-6 shrink-0">Search</Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Filters — collapsible on mobile */}
        <div className="bg-white rounded-2xl shadow-sm mb-8 overflow-hidden">
          <button className="w-full flex items-center justify-between p-4 md:hidden" onClick={() => setFiltersOpen(!filtersOpen)}>
            <span className="flex items-center gap-2 font-semibold text-gray-700 text-sm"><Filter className="w-4 h-4" /> Filters ({filtered.length} results)</span>
            {filtersOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          <div className={`${filtersOpen ? "block" : "hidden"} md:block p-4 border-t md:border-t-0`}>
            <div className="flex flex-wrap gap-3 items-center">
              {/* Category */}
              <div className="flex flex-wrap gap-2">
                {[{ label: "All Types", value: "all" }, { label: "🏠 Residential", value: "residential" }, { label: "🌾 Agricultural", value: "agricultural" }, { label: "🏭 Industrial", value: "industrial" }, { label: "🏢 Commercial", value: "commercial" }].map(c => (
                  <button key={c.value} onClick={() => setFilterCategory(c.value)} className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${filterCategory === c.value ? "bg-amber-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-amber-50"}`}>
                    {c.label}
                  </button>
                ))}
              </div>
              {/* Price */}
              <select className="border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white" value={filterPrice} onChange={e => setFilterPrice(e.target.value)}>
                <option value="">Any Price</option>
                <option value="0-20000">Under USD 20,000</option>
                <option value="20000-80000">USD 20K–80K</option>
                <option value="80000-200000">USD 80K–200K</option>
                <option value="200000-">USD 200K+</option>
              </select>
              {/* Vendor */}
              <select className="border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white" value={filterVendor} onChange={e => setFilterVendor(e.target.value)}>
                <option value="all">All Vendors</option>
                {vendors.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
              </select>
              <span className="text-gray-400 text-sm ml-auto hidden md:block">{filtered.length} listing{filtered.length !== 1 ? "s" : ""} found</span>
            </div>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <MapPin className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="font-semibold">No land listings found</p>
            <p className="text-sm">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(land => (
              <div key={land.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group cursor-pointer" onClick={() => setSelectedLand(land)}>
                <div className="relative h-52 overflow-hidden">
                  <img src={land.images[0]} alt={land.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                  <div className="absolute top-3 left-3 flex gap-2">
                    {land.negotiable && <Badge className="bg-green-500 text-white text-xs">Negotiable</Badge>}
                    <Badge className="bg-white/90 text-gray-700 text-xs">{land.availability}</Badge>
                  </div>
                  <div className="absolute top-3 right-3">
                    <Badge className="bg-white/90 text-gray-700 text-xs">📐 {land.size}</Badge>
                  </div>
                  {land.images.length > 1 && (
                    <div className="absolute bottom-3 right-3 bg-black/50 text-white text-xs px-2 py-0.5 rounded-full">{land.images.length} photos</div>
                  )}
                </div>
                <div className="p-4">
                  <p className="font-bold text-gray-900 mb-1 leading-snug">{land.title}</p>
                  <p className="text-sm text-gray-500 flex items-center gap-1 mb-2"><MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />{land.location}</p>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {land.use.map(u => <span key={u} className="text-xs bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full">{u}</span>)}
                  </div>
                  <div className="flex items-center justify-between border-t pt-3">
                    <span className="text-xl font-bold text-amber-600">USD {land.price.toLocaleString()}</span>
                    <Button size="sm" className="bg-amber-500 hover:bg-amber-600 text-white text-xs" onClick={e => { e.stopPropagation(); setInquiryLand(land); }}>Inquire</Button>
                  </div>
                  <p className="text-xs text-gray-400 mt-2 truncate">{land.vendor.name}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Land Detail Modal */}
      <Dialog open={!!selectedLand} onOpenChange={() => setSelectedLand(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedLand && (
            <>
              <ImageGallery images={selectedLand.images} title={selectedLand.title} />
              <DialogHeader><DialogTitle className="text-xl leading-snug">{selectedLand.title}</DialogTitle></DialogHeader>
              <p className="text-gray-500 flex items-center gap-1 mb-3 text-sm"><MapPin className="w-4 h-4 text-amber-500" />{selectedLand.location}</p>
              <p className="text-gray-700 text-sm mb-4">{selectedLand.description}</p>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-gray-50 rounded-xl p-3"><p className="text-xs text-gray-400">Size</p><p className="font-semibold">📐 {selectedLand.size}</p></div>
                <div className="bg-gray-50 rounded-xl p-3"><p className="text-xs text-gray-400">Price</p><p className="font-semibold text-amber-600">USD {selectedLand.price.toLocaleString()}</p></div>
                <div className="bg-gray-50 rounded-xl p-3"><p className="text-xs text-gray-400">Negotiable</p><p className="font-semibold">{selectedLand.negotiable ? "✅ Yes" : "❌ No"}</p></div>
                <div className="bg-gray-50 rounded-xl p-3"><p className="text-xs text-gray-400">Best For</p><p className="font-semibold text-sm">{selectedLand.use.join(", ")}</p></div>
              </div>
              <div className="mb-4">
                <p className="font-semibold text-gray-900 mb-2 text-sm">Vendor</p>
                <div className="flex items-center gap-2 bg-amber-50 rounded-xl p-3">
                  <span className="text-2xl">{selectedLand.vendor.logo}</span>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{selectedLand.vendor.name}</p>
                    <p className="text-xs text-amber-600">⭐ {selectedLand.vendor.rating} rating</p>
                  </div>
                </div>
              </div>
              <Button className="w-full bg-amber-500 hover:bg-amber-600 text-white mb-4" onClick={() => { setSelectedLand(null); setInquiryLand(selectedLand); }}>Make Inquiry</Button>
              {relatedListings(selectedLand).length > 0 && (
                <div>
                  <p className="font-semibold text-gray-900 mb-3 text-sm">More from {selectedLand.vendor.name}</p>
                  <div className="grid grid-cols-2 gap-3">
                    {relatedListings(selectedLand).map(r => (
                      <div key={r.id} className="border rounded-xl overflow-hidden cursor-pointer hover:shadow-md transition-shadow" onClick={() => setSelectedLand(r)}>
                        <img src={r.images[0]} alt={r.title} className="w-full h-28 object-cover" />
                        <div className="p-2">
                          <p className="font-semibold text-sm text-gray-900 leading-tight line-clamp-2">{r.title}</p>
                          <p className="text-amber-600 text-sm font-bold mt-1">USD {r.price.toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Inquiry Modal */}
      <Dialog open={!!inquiryLand && !done} onOpenChange={() => setInquiryLand(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle className="leading-snug">Inquire: {inquiryLand?.title}</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <Input placeholder="Full Name *" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} autoFocus />
            <Input type="email" placeholder="Email Address *" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
            <Input placeholder="Phone Number" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
            <textarea className="w-full border rounded-xl p-3 text-sm text-gray-700 resize-none h-24 focus:outline-none focus:ring-2 focus:ring-amber-500" placeholder="Your message or questions..." value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} />
          </div>
          <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 text-xs text-amber-700">
            📧 A confirmation email will be sent to your inbox.
          </div>
          <Button className="w-full bg-amber-500 hover:bg-amber-600 text-white mt-2 gap-2" onClick={handleSubmit} disabled={loading}>
            {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Submitting...</> : "Send Inquiry"}
          </Button>
        </DialogContent>
      </Dialog>

      {/* Success Dialog */}
      <Dialog open={done} onOpenChange={resetForm}>
        <DialogContent className="max-w-sm text-center">
          <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-amber-600" />
          </div>
          <h3 className="text-xl font-bold mb-2">Inquiry Sent!</h3>
          <p className="text-gray-500 mb-2">Confirmation sent to <strong>{form.email}</strong>.</p>
          <p className="text-gray-500 mb-6 text-sm">The vendor will get back to you within 24 hours about <strong>{inquiryLand?.title}</strong>.</p>
          <Button className="bg-amber-500 hover:bg-amber-600 text-white w-full" onClick={resetForm}>Done</Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}