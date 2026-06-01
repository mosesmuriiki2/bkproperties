import { useState } from "react";
import { MapPin, Star, Search, Home, X, ChevronLeft, ChevronRight, SlidersHorizontal } from "lucide-react";
import { getModuleConfig } from "@/lib/issueStore";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

const hotels = [
  {
    id: 1, name: "Voyager Hotel", location: "Nairobi, Kenya", rating: 4.9, reviews: 856, priceFrom: 320,
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80",
    images: ["https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80", "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80", "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80"],
    description: "A world-class hotel in the heart of Nairobi with breathtaking views of Nairobi National Park. Featuring elegant rooms, a rooftop pool, and a premier conference center.",
    facilities: [{ icon: "🏊", name: "Swimming Pool" }, { icon: "🍽️", name: "Restaurant & Bar" }, { icon: "🏋️", name: "Fitness Center" }, { icon: "📶", name: "Free WiFi" }, { icon: "🅿️", name: "Valet Parking" }, { icon: "🎤", name: "Conference Hall" }],
    conferenceHall: { capacity: 1000, description: "State-of-the-art conference facility for up to 1000 delegates" },
    rooms: [
      { type: "Standard Room", price: 320, image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=80", available: 12 },
      { type: "Deluxe Suite", price: 580, image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=600&q=80", available: 5 },
      { type: "Presidential Suite", price: 1200, image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600&q=80", available: 2 },
    ],
  },
  {
    id: 2, name: "Savannah Lodges & Resorts", location: "Masai Mara, Kenya", rating: 4.8, reviews: 412, priceFrom: 480,
    image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80",
    images: ["https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80", "https://images.unsplash.com/photo-1439066290691-dabb403de8e1?w=800&q=80"],
    description: "Luxury eco-lodge perched on the edge of the Masai Mara with panoramic views. Perfect for safari-goers seeking comfort in the wild.",
    facilities: [{ icon: "🌿", name: "Eco-Friendly" }, { icon: "🍽️", name: "Bush Dining" }, { icon: "📶", name: "Satellite WiFi" }, { icon: "🦒", name: "Game Drives" }],
    rooms: [
      { type: "Tented Suite", price: 480, image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&q=80", available: 8 },
      { type: "Luxury Tent", price: 720, image: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=600&q=80", available: 3 },
    ],
  },
  {
    id: 3, name: "Diani Reef Beach Resort", location: "Diani Beach, Mombasa", rating: 4.7, reviews: 623, priceFrom: 240,
    image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&q=80",
    images: ["https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&q=80"],
    description: "Beachfront resort on the pristine sands of Diani with crystal-clear Indian Ocean views. Water sports, spa, and world-class dining.",
    facilities: [{ icon: "🏖️", name: "Private Beach" }, { icon: "💆", name: "Spa & Wellness" }, { icon: "🤿", name: "Water Sports" }, { icon: "🍹", name: "Beach Bar" }],
    rooms: [
      { type: "Ocean View Room", price: 240, image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=80", available: 20 },
      { type: "Beach Villa", price: 650, image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&q=80", available: 4 },
    ],
  },
];

export default function Hotels() {
  const moduleConfig = getModuleConfig();
  const [search, setSearch] = useState("");
  const [filterLocation, setFilterLocation] = useState("");
  const [filterPrice, setFilterPrice] = useState("");
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [bookingRoom, setBookingRoom] = useState(null);
  const [activeImg, setActiveImg] = useState(0);
  const [bookingForm, setBookingForm] = useState({ checkIn: "", checkOut: "", guests: 1, name: "", email: "" });
  const [bookingDone, setBookingDone] = useState(false);

  if (!moduleConfig.hotels) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">🏨</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Hotels & Lodges Unavailable</h2>
          <p className="text-gray-500 mb-6">This module has been temporarily disabled by the platform administrator. Please check back soon.</p>
          <a href="/" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-medium transition-colors"><Home className="w-4 h-4" /> Back to Home</a>
        </div>
      </div>
    );
  }

  const filtered = hotels.filter(h => {
    const matchSearch = !search || h.name.toLowerCase().includes(search.toLowerCase()) || h.location.toLowerCase().includes(search.toLowerCase());
    const matchLoc = !filterLocation || h.location.toLowerCase().includes(filterLocation.toLowerCase());
    const matchPrice = !filterPrice || (() => {
      const [min, max] = filterPrice.split("-").map(Number);
      return max ? h.priceFrom >= min && h.priceFrom <= max : h.priceFrom >= min;
    })();
    return matchSearch && matchLoc && matchPrice;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero with real hotel background */}
      <div className="relative py-24 px-4 overflow-hidden">
        <img src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1600&q=80" alt="Hotels" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/85 to-indigo-900/75" />
        <div className="relative max-w-4xl mx-auto text-center">
          <Link to={createPageUrl("Home")} className="inline-flex items-center gap-2 text-white/70 hover:text-white text-sm mb-6 transition-colors">
            <Home className="w-4 h-4" /> Back to Home
          </Link>
          <Badge className="mb-4 bg-blue-500/20 text-blue-200 border-blue-400/30 block w-fit mx-auto">🏨 Hotels & Lodges</Badge>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">Hotels & Lodges</h1>
          <p className="text-blue-100 text-lg mb-8">From Nairobi city hotels to Mara safari lodges — find your perfect stay</p>
          <div className="bg-white rounded-2xl p-3 max-w-2xl mx-auto shadow-xl">
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="flex items-center gap-2 flex-1 px-3 border-r border-gray-200">
                <Search className="w-4 h-4 text-gray-400 shrink-0" />
                <input type="text" placeholder="Search hotels..." className="w-full outline-none text-gray-700 text-sm py-1.5 bg-transparent" value={search} onChange={e => setSearch(e.target.value)} />
              </div>
              <div className="flex items-center gap-2 flex-1 px-3 border-r border-gray-200">
                <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
                <input type="text" placeholder="Location" className="w-full outline-none text-gray-700 text-sm py-1.5 bg-transparent" value={filterLocation} onChange={e => setFilterLocation(e.target.value)} />
              </div>
              <select className="flex-1 outline-none text-gray-700 text-sm px-3 py-1.5 bg-transparent" value={filterPrice} onChange={e => setFilterPrice(e.target.value)}>
                <option value="">Any Price</option>
                <option value="0-300">Under USD 300/night</option>
                <option value="300-600">USD 300–600/night</option>
                <option value="600-">USD 600+/night</option>
              </select>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-6" onClick={() => {}}>Search</Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10">
        <p className="text-gray-500 text-sm mb-6"><span className="font-semibold text-gray-900">{filtered.length}</span> hotels found</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(hotel => (
            <div key={hotel.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group cursor-pointer" onClick={() => { setSelectedHotel(hotel); setActiveImg(0); }}>
              <div className="relative h-56 overflow-hidden">
                <img src={hotel.image} alt={hotel.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-3 right-3 bg-white/90 rounded-lg px-2 py-1 flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                  <span className="text-sm font-bold">{hotel.rating}</span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-gray-900 text-lg mb-1">{hotel.name}</h3>
                <p className="text-sm text-gray-500 flex items-center gap-1 mb-3"><MapPin className="w-3.5 h-3.5 text-blue-500" /> {hotel.location}</p>
                <div className="flex flex-wrap gap-2 mb-3">
                  {hotel.facilities.slice(0, 3).map(f => (
                    <span key={f.name} className="text-xs bg-gray-50 px-2 py-1 rounded-lg text-gray-600">{f.icon} {f.name}</span>
                  ))}
                </div>
                <div className="flex items-center justify-between border-t pt-3">
                  <div>
                    <span className="text-xs text-gray-400">From</span>
                    <div className="text-xl font-bold text-blue-600">USD {hotel.priceFrom}<span className="text-sm text-gray-400 font-normal">/night</span></div>
                  </div>
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">View Hotel</Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Hotel detail modal */}
      <Dialog open={!!selectedHotel} onOpenChange={() => setSelectedHotel(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {selectedHotel && (
            <>
              <div className="relative mb-4">
                <img src={selectedHotel.images[activeImg]} alt={selectedHotel.name} className="w-full h-64 object-cover rounded-xl" />
                {selectedHotel.images.length > 1 && (
                  <div className="flex gap-2 mt-2">
                    {selectedHotel.images.map((img, i) => (
                      <img key={i} src={img} alt="" className={`w-16 h-12 object-cover rounded-lg cursor-pointer border-2 ${activeImg === i ? "border-blue-500" : "border-transparent"}`} onClick={() => setActiveImg(i)} />
                    ))}
                  </div>
                )}
              </div>
              <DialogHeader>
                <DialogTitle className="text-2xl">{selectedHotel.name}</DialogTitle>
              </DialogHeader>
              <p className="text-gray-500 flex items-center gap-1 mb-3"><MapPin className="w-4 h-4 text-blue-500" /> {selectedHotel.location}</p>
              <p className="text-gray-700 mb-5">{selectedHotel.description}</p>
              {selectedHotel.conferenceHall && (
                <div className="bg-blue-50 rounded-xl p-4 mb-5">
                  <p className="font-semibold text-blue-900 mb-1">🎤 Conference Hall</p>
                  <p className="text-blue-700 text-sm">Capacity: {selectedHotel.conferenceHall.capacity.toLocaleString()} delegates</p>
                  <p className="text-blue-600 text-sm mt-1">{selectedHotel.conferenceHall.description}</p>
                </div>
              )}
              <div className="mb-5">
                <p className="font-semibold text-gray-900 mb-3">Facilities</p>
                <div className="flex flex-wrap gap-2">
                  {selectedHotel.facilities.map(f => (
                    <span key={f.name} className="bg-gray-100 px-3 py-1.5 rounded-lg text-sm text-gray-700">{f.icon} {f.name}</span>
                  ))}
                </div>
              </div>
              <div>
                <p className="font-semibold text-gray-900 mb-3">Available Rooms</p>
                <div className="space-y-3">
                  {selectedHotel.rooms.map(room => (
                    <div key={room.type} className="flex items-center gap-4 border rounded-xl p-3">
                      <img src={room.image} alt={room.type} className="w-24 h-16 object-cover rounded-lg shrink-0" />
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">{room.type}</p>
                        <p className="text-sm text-gray-500">{room.available} rooms available</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-blue-600 text-lg">USD {room.price}<span className="text-sm text-gray-400 font-normal">/night</span></p>
                        <Button size="sm" className="mt-1 bg-blue-600 hover:bg-blue-700 text-white text-xs" onClick={() => { setBookingRoom({ hotel: selectedHotel, room }); setSelectedHotel(null); }}>Book Room</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Room booking modal */}
      <Dialog open={!!bookingRoom && !bookingDone} onOpenChange={() => setBookingRoom(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Book {bookingRoom?.room?.type}</DialogTitle></DialogHeader>
          <p className="text-sm text-gray-500 mb-4">{bookingRoom?.hotel?.name}</p>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div><p className="text-xs text-gray-500 mb-1">Check-in</p><Input type="date" value={bookingForm.checkIn} onChange={e => setBookingForm(f => ({ ...f, checkIn: e.target.value }))} /></div>
              <div><p className="text-xs text-gray-500 mb-1">Check-out</p><Input type="date" value={bookingForm.checkOut} onChange={e => setBookingForm(f => ({ ...f, checkOut: e.target.value }))} /></div>
            </div>
            <Input placeholder="Full Name" value={bookingForm.name} onChange={e => setBookingForm(f => ({ ...f, name: e.target.value }))} />
            <Input type="email" placeholder="Email Address" value={bookingForm.email} onChange={e => setBookingForm(f => ({ ...f, email: e.target.value }))} />
            <Select><SelectTrigger><SelectValue placeholder="Payment Method" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="mpesa">📱 M-Pesa</SelectItem>
                <SelectItem value="bank">🏦 Bank Transfer</SelectItem>
                <SelectItem value="card">💳 Card</SelectItem>
              </SelectContent>
            </Select>
            <div className="bg-blue-50 rounded-lg p-3 text-sm text-blue-700 flex justify-between">
              <span>Price per night</span><strong>USD {bookingRoom?.room?.price}</strong>
            </div>
          </div>
          <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white mt-2" onClick={() => setBookingDone(true)}>Confirm Booking</Button>
        </DialogContent>
      </Dialog>

      <Dialog open={bookingDone} onOpenChange={() => { setBookingDone(false); setBookingRoom(null); }}>
        <DialogContent className="max-w-sm text-center">
          <div className="text-5xl mb-4">🏨</div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Booking Confirmed!</h3>
          <p className="text-gray-500 mb-4">Your room at <strong>{bookingRoom?.hotel?.name}</strong> has been reserved. A confirmation email is on its way!</p>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white w-full" onClick={() => { setBookingDone(false); setBookingRoom(null); }}>Done</Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}