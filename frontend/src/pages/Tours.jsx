import { useState } from "react";
import { Link } from "react-router-dom";
import { getModuleConfig } from "@/lib/issueStore";
import { createPageUrl } from "@/utils";
import { Search, MapPin, Star, Calendar, Users, Home, ArrowLeft, ChevronRight, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const vendors = [
  {
    id: "bonfire",
    name: "Bonfire Adventures",
    integration: "api",
    logo: "🏕️",
    website: "https://www.bonfireadventures.com",
    rating: 4.9,
    reviews: 1240,
    tours: [
      { id: 1, title: "Masai Mara Safari – 3 Days", location: "Masai Mara, Kenya", price: 890, duration: "3 days", groupSize: "2-12", image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800&q=80", description: "Experience the world-famous wildebeest migration and Big Five game drives in the iconic Masai Mara.", highlights: ["Big Five game drives", "Bush breakfast", "Cultural village visit"] },
      { id: 2, title: "Amboseli National Park – 2 Days", location: "Amboseli, Kenya", price: 650, duration: "2 days", groupSize: "2-8", image: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=800&q=80", description: "Mount Kilimanjaro backdrop with massive elephant herds in Amboseli.", highlights: ["Elephant viewing", "Kilimanjaro views", "Night safari"] },
      { id: 3, title: "Diani Beach Getaway – 4 Days", location: "Diani, Mombasa", price: 1100, duration: "4 days", groupSize: "2-6", image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80", description: "Relax on pristine white sand beaches along the Indian Ocean.", highlights: ["Snorkeling", "Dhow cruise", "Deep sea fishing"] },
    ]
  },
  {
    id: "safaribookings",
    name: "SafariBookings Kenya",
    integration: "portal",
    logo: "🦁",
    rating: 4.8,
    reviews: 876,
    tours: [
      { id: 4, title: "Mount Kenya Trek – 5 Days", location: "Mount Kenya", price: 650, duration: "5 days", groupSize: "4-15", image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=80", description: "Summit Africa's second-highest peak through lush bamboo forests and alpine moorland.", highlights: ["Point Lenana summit", "Alpine lakes", "Certificate of achievement"] },
      { id: 5, title: "Lake Nakuru Flamingos – 1 Day", location: "Nakuru, Kenya", price: 280, duration: "1 day", groupSize: "2-20", image: "https://images.unsplash.com/photo-1551316679-9c6ae9dec224?w=800&q=80", description: "Witness millions of pink flamingos at Lake Nakuru, a UNESCO World Heritage site.", highlights: ["Flamingo viewing", "Rhino sanctuary", "Scenic lake drive"] },
    ]
  }
];

export default function Tours() {
  const moduleConfig = getModuleConfig();
  const [search, setSearch] = useState("");
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [selectedTour, setSelectedTour] = useState(null);
  const [bookingMode, setBookingMode] = useState(null);
  const [vendorWebsite, setVendorWebsite] = useState(null);
  const [bookingForm, setBookingForm] = useState({ date: "", people: 1, name: "", email: "", phone: "" });
  const [bookingStep, setBookingStep] = useState(1);
  const [bookingComplete, setBookingComplete] = useState(false);

  if (!moduleConfig.tours) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">✈️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Tours & Adventures Unavailable</h2>
          <p className="text-gray-500 mb-6">This module has been temporarily disabled by the platform administrator. Please check back soon.</p>
          <Link to="/" className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2.5 rounded-xl font-medium transition-colors"><Home className="w-4 h-4" /> Back to Home</Link>
        </div>
      </div>
    );
  }

  const filteredVendors = vendors.map(v => ({
    ...v,
    tours: v.tours.filter(t =>
      !search || t.title.toLowerCase().includes(search.toLowerCase()) || t.location.toLowerCase().includes(search.toLowerCase())
    )
  })).filter(v => !selectedVendor || v.id === selectedVendor);

  const handleBook = (vendor, tour) => {
    if (vendor.integration === "api") {
      setVendorWebsite(vendor);
    } else {
      setBookingMode({ vendor, tour });
      setBookingStep(1);
      setBookingComplete(false);
    }
  };

  const handleBookingSubmit = () => {
    if (bookingStep < 3) {
      setBookingStep(s => s + 1);
    } else {
      setBookingComplete(true);
    }
  };

  if (vendorWebsite) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col bg-white">
        <div className="bg-gray-900 px-4 py-3 flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => setVendorWebsite(null)} className="text-white border-white/30 hover:bg-white/10">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to BK Properties
          </Button>
          <div className="flex items-center gap-2 text-white text-sm">
            <Globe className="w-4 h-4 text-emerald-400" />
            <span className="text-gray-400">Booking on:</span>
            <span className="font-semibold">{vendorWebsite.name}</span>
          </div>
          <div className="ml-auto text-xs text-gray-500 bg-white/10 px-3 py-1 rounded-full">
            🔒 Secured by BK Properties
          </div>
        </div>
        <iframe
          src={vendorWebsite.website || "https://www.bonfireadventures.com"}
          className="flex-1 w-full border-0"
          title={vendorWebsite.name}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero with real safari background */}
      <div className="relative py-24 px-4 overflow-hidden">
        <img src="https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1600&q=80" alt="Tours" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/85 to-teal-900/75" />
        <div className="relative max-w-4xl mx-auto text-center">
          <Link to={createPageUrl("Home")} className="inline-flex items-center gap-2 text-white/70 hover:text-white text-sm mb-6 transition-colors">
            <Home className="w-4 h-4" /> Back to Home
          </Link>
          <Badge className="mb-4 bg-emerald-500/20 text-emerald-200 border-emerald-400/30 block w-fit mx-auto">✈️ Tours & Adventures</Badge>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">Tours & Adventures</h1>
          <p className="text-emerald-100 text-lg mb-8">From Masai Mara safaris to Mount Kenya treks — find and book your perfect tour</p>
          <div className="bg-white rounded-2xl p-3 max-w-lg mx-auto shadow-xl">
            <div className="flex gap-2">
              <div className="flex items-center gap-2 flex-1 px-3">
                <Search className="w-4 h-4 text-gray-400 shrink-0" />
                <Input placeholder="Search tours, destinations..." className="border-0 shadow-none focus-visible:ring-0 text-gray-700" value={search} onChange={e => setSearch(e.target.value)} />
              </div>
              <Button className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl px-6">Search</Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* Vendor filter */}
        <div className="flex flex-wrap gap-3 mb-8">
          <button
            onClick={() => setSelectedVendor(null)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${!selectedVendor ? "bg-emerald-500 text-white" : "bg-white border text-gray-700 hover:border-emerald-500"}`}
          >
            All Vendors
          </button>
          {vendors.map(v => (
            <button
              key={v.id}
              onClick={() => setSelectedVendor(v.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${selectedVendor === v.id ? "bg-emerald-500 text-white" : "bg-white border text-gray-700 hover:border-emerald-500"}`}
            >
              <span>{v.logo}</span> {v.name}
            </button>
          ))}
        </div>

        {/* Vendor sections */}
        {filteredVendors.map(vendor => (
          vendor.tours.length > 0 && (
            <div key={vendor.id} className="mb-12">
              <div className="flex items-center gap-4 mb-6">
                <span className="text-4xl">{vendor.logo}</span>
                <div>
                  <div className="flex items-center gap-3">
                    <h2 className="text-2xl font-bold text-gray-900">{vendor.name}</h2>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                    <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                    <span className="font-medium text-gray-700">{vendor.rating}</span>
                    <span>({vendor.reviews} reviews)</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {vendor.tours.map(tour => (
                  <div key={tour.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group cursor-pointer" onClick={() => setSelectedTour({ vendor, tour })}>
                    <div className="relative h-52 overflow-hidden">
                      <img src={tour.image} alt={tour.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute bottom-3 left-3 flex gap-2">
                        <Badge className="bg-white/90 text-gray-700 text-xs flex items-center gap-1">
                          <Calendar className="w-3 h-3" /> {tour.duration}
                        </Badge>
                        <Badge className="bg-white/90 text-gray-700 text-xs flex items-center gap-1">
                          <Users className="w-3 h-3" /> {tour.groupSize}
                        </Badge>
                      </div>
                    </div>
                    <div className="p-4">
                      <p className="font-bold text-gray-900 mb-1">{tour.title}</p>
                      <p className="text-sm text-gray-500 flex items-center gap-1 mb-3">
                        <MapPin className="w-3.5 h-3.5 text-emerald-500" /> {tour.location}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xl font-bold text-emerald-600">USD {tour.price.toLocaleString()}<span className="text-sm text-gray-400 font-normal">/person</span></span>
                        <Button size="sm" className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg" onClick={(e) => { e.stopPropagation(); handleBook(vendor, tour); }}>
                          Book Now
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        ))}
      </div>

      {/* Tour detail modal */}
      <Dialog open={!!selectedTour} onOpenChange={() => setSelectedTour(null)}>
        <DialogContent className="max-w-2xl">
          {selectedTour && (
            <>
              <img src={selectedTour.tour.image} alt={selectedTour.tour.title} className="w-full h-64 object-cover rounded-xl mb-4" />
              <DialogHeader>
                <DialogTitle className="text-2xl">{selectedTour.tour.title}</DialogTitle>
              </DialogHeader>
              <p className="text-gray-500 flex items-center gap-1 mb-3"><MapPin className="w-4 h-4 text-emerald-500" />{selectedTour.tour.location}</p>
              <p className="text-gray-700 mb-4">{selectedTour.tour.description}</p>
              <div className="mb-4">
                <p className="font-semibold mb-2">Tour Highlights</p>
                <ul className="space-y-1">
                  {selectedTour.tour.highlights.map(h => (
                    <li key={h} className="flex items-center gap-2 text-sm text-gray-600">
                      <ChevronRight className="w-3.5 h-3.5 text-emerald-500" /> {h}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex items-center justify-between pt-4 border-t">
                <span className="text-2xl font-bold text-emerald-600">USD {selectedTour.tour.price.toLocaleString()}/person</span>
                <Button className="bg-emerald-500 hover:bg-emerald-600 text-white" onClick={() => { setSelectedTour(null); handleBook(selectedTour.vendor, selectedTour.tour); }}>
                  Book This Tour
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Booking modal (portal vendors) */}
      <Dialog open={!!bookingMode && !bookingComplete} onOpenChange={() => setBookingMode(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Book: {bookingMode?.tour?.title}</DialogTitle>
          </DialogHeader>
          <div className="flex gap-2 mb-4">
            {[1, 2, 3].map(s => (
              <div key={s} className={`flex-1 h-1.5 rounded-full ${bookingStep >= s ? "bg-emerald-500" : "bg-gray-200"}`} />
            ))}
          </div>
          {bookingStep === 1 && (
            <div className="space-y-4">
              <p className="font-semibold text-gray-700">Select Date & Group Size</p>
              <Input type="date" value={bookingForm.date} onChange={e => setBookingForm(f => ({ ...f, date: e.target.value }))} />
              <div className="flex items-center gap-3">
                <Users className="w-4 h-4 text-gray-400" />
                <Input type="number" min={1} max={20} placeholder="Number of people" value={bookingForm.people} onChange={e => setBookingForm(f => ({ ...f, people: e.target.value }))} />
              </div>
              <div className="bg-emerald-50 rounded-lg p-3 text-sm text-emerald-700">
                Total Estimate: <strong>USD {bookingMode?.tour?.price * bookingForm.people}</strong>
              </div>
            </div>
          )}
          {bookingStep === 2 && (
            <div className="space-y-4">
              <p className="font-semibold text-gray-700">Your Details</p>
              <Input placeholder="Full Name" value={bookingForm.name} onChange={e => setBookingForm(f => ({ ...f, name: e.target.value }))} />
              <Input type="email" placeholder="Email Address" value={bookingForm.email} onChange={e => setBookingForm(f => ({ ...f, email: e.target.value }))} />
              <Input placeholder="Phone Number" value={bookingForm.phone} onChange={e => setBookingForm(f => ({ ...f, phone: e.target.value }))} />
            </div>
          )}
          {bookingStep === 3 && (
            <div className="space-y-4">
              <p className="font-semibold text-gray-700">Payment</p>
              <div className="border rounded-xl p-4 space-y-2 text-sm text-gray-700">
                <div className="flex justify-between"><span>Tour</span><span>{bookingMode?.tour?.title}</span></div>
                <div className="flex justify-between"><span>Date</span><span>{bookingForm.date}</span></div>
                <div className="flex justify-between"><span>People</span><span>{bookingForm.people}</span></div>
                <div className="flex justify-between font-bold text-emerald-600 border-t pt-2"><span>Total</span><span>USD {bookingMode?.tour?.price * bookingForm.people}</span></div>
              </div>
              <Select>
                <SelectTrigger><SelectValue placeholder="Select Payment Method" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="mpesa">📱 Safaricom M-Pesa</SelectItem>
                  <SelectItem value="bank">🏦 Bank Transfer</SelectItem>
                  <SelectItem value="card">💳 Credit/Debit Card</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
          <Button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white mt-2" onClick={handleBookingSubmit}>
            {bookingStep < 3 ? "Continue" : "Confirm & Pay"}
          </Button>
        </DialogContent>
      </Dialog>

      {/* Booking success modal */}
      <Dialog open={bookingComplete} onOpenChange={() => { setBookingComplete(false); setBookingMode(null); }}>
        <DialogContent className="max-w-sm text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">🎉</span>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Booking Confirmed!</h3>
          <p className="text-gray-500 mb-4">Your booking for <strong>{bookingMode?.tour?.title}</strong> has been confirmed. Check your email for details.</p>
          <Button className="bg-emerald-500 hover:bg-emerald-600 text-white w-full" onClick={() => { setBookingComplete(false); setBookingMode(null); }}>
            Done
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}