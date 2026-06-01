import { useState } from "react";
import { MapPin, Search, Users, Fuel, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const vehicles = [
  { id: 1, name: "Toyota Coaster – 30 Seater", type: "hire", capacity: 30, price: 350, unit: "/day", image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&q=80", fuel: "Diesel", vendor: "Safari Transport Kenya", features: ["AC", "WiFi", "Reclining Seats", "PA System"] },
  { id: 2, name: "Mercedes Sprinter – 15 Seater", type: "hire", capacity: 15, price: 200, unit: "/day", image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&q=80", fuel: "Diesel", vendor: "Safari Transport Kenya", features: ["AC", "Luggage Storage", "USB Charging"] },
  { id: 3, name: "Land Rover Defender – Safari", type: "hire", capacity: 7, price: 280, unit: "/day", image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&q=80", fuel: "Diesel", vendor: "Mara Game Drives", features: ["Pop-up Roof", "4WD", "Cooler Box", "GPS"] },
  { id: 4, name: "Toyota Land Cruiser – For Sale", type: "sale", capacity: 8, price: 55000, image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&q=80", fuel: "Diesel", vendor: "Mara Game Drives", features: ["4WD", "Bull Bar", "Winch", "Roof Rack"] },
  { id: 5, name: "Luxury Coach – 50 Seater", type: "hire", capacity: 50, price: 600, unit: "/day", image: "https://images.unsplash.com/photo-1464219789935-c2d9d9aba644?w=800&q=80", fuel: "Diesel", vendor: "Safari Transport Kenya", features: ["AC", "Toilet", "Entertainment", "WiFi"] },
];

export default function TouristVehicles() {
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [booking, setBooking] = useState(null);
  const [form, setForm] = useState({ name: "", phone: "", startDate: "", endDate: "", people: "" });
  const [done, setDone] = useState(false);

  const filtered = vehicles.filter(v => {
    const matchSearch = !search || v.name.toLowerCase().includes(search.toLowerCase());
    const matchType = filterType === "all" || v.type === filterType;
    return matchSearch && matchType;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="relative py-24 px-4 overflow-hidden">
        <img src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1600&q=80" alt="Tourist Vehicles" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-900/85 to-sky-900/75" />
        <div className="relative max-w-4xl mx-auto text-center">
          <a href="/" className="inline-flex items-center gap-2 text-white/70 hover:text-white text-sm mb-6 transition-colors">
            <Home className="w-4 h-4" /> Back to Home
          </a>
          <Badge className="mb-4 bg-cyan-500/20 text-cyan-200 border-cyan-400/30 block w-fit mx-auto">🚌 Tourist Vehicles</Badge>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">Tourist & Safari Vehicles</h1>
          <p className="text-cyan-100 text-lg mb-8">Hire or buy safari vehicles, tour coaches and game drive vehicles</p>
          <div className="bg-white rounded-2xl p-3 max-w-lg mx-auto shadow-xl">
            <div className="flex gap-2">
              <div className="flex items-center gap-2 flex-1 px-3">
                <Search className="w-4 h-4 text-gray-400 shrink-0" />
                <Input placeholder="Search vehicles..." className="border-0 shadow-none focus-visible:ring-0" value={search} onChange={e => setSearch(e.target.value)} />
              </div>
              <Button className="bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl px-6">Search</Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-3 mb-8">
          {["all", "hire", "sale"].map(t => (
            <button key={t} onClick={() => setFilterType(t)} className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${filterType === t ? "bg-cyan-600 text-white" : "bg-white border text-gray-700 hover:border-cyan-500"}`}>
              {t === "all" ? "All" : t === "hire" ? "For Hire" : "For Sale"}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(v => (
            <div key={v.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
              <div className="relative h-52 overflow-hidden">
                <img src={v.image} alt={v.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-3 left-3">
                  <Badge className={`text-xs font-bold ${v.type === "sale" ? "bg-orange-500 text-white" : "bg-cyan-600 text-white"}`}>
                    {v.type === "sale" ? "For Sale" : "For Hire"}
                  </Badge>
                </div>
              </div>
              <div className="p-4">
                <p className="font-bold text-gray-900 mb-2">{v.name}</p>
                <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                  <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {v.capacity} seats</span>
                  <span className="flex items-center gap-1"><Fuel className="w-3 h-3" /> {v.fuel}</span>
                </div>
                <div className="flex flex-wrap gap-1 mb-3">
                  {v.features.map(f => <span key={f} className="text-xs bg-cyan-50 text-cyan-700 px-2 py-0.5 rounded-full">{f}</span>)}
                </div>
                <p className="text-xs text-gray-400 mb-3">{v.vendor}</p>
                <div className="flex items-center justify-between border-t pt-3">
                  <div>
                    <span className="text-xl font-bold text-cyan-600">USD {v.price.toLocaleString()}</span>
                    {v.unit && <span className="text-xs text-gray-400">{v.unit}</span>}
                  </div>
                  <Button size="sm" className="bg-cyan-600 hover:bg-cyan-700 text-white text-xs" onClick={() => setBooking(v)}>
                    {v.type === "sale" ? "Inquire" : "Book Now"}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Dialog open={!!booking && !done} onOpenChange={() => setBooking(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>{booking?.type === "sale" ? "Inquire About" : "Book"}: {booking?.name}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <Input placeholder="Full Name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
            <Input placeholder="Phone Number" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
            {booking?.type === "hire" && <>
              <Input placeholder="Number of People" type="number" value={form.people} onChange={e => setForm(f => ({ ...f, people: e.target.value }))} />
              <div className="grid grid-cols-2 gap-3">
                <div><p className="text-xs text-gray-500 mb-1">Start Date</p><Input type="date" value={form.startDate} onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))} /></div>
                <div><p className="text-xs text-gray-500 mb-1">End Date</p><Input type="date" value={form.endDate} onChange={e => setForm(f => ({ ...f, endDate: e.target.value }))} /></div>
              </div>
            </>}
            <Select><SelectTrigger><SelectValue placeholder="Payment Method" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="mpesa">📱 M-Pesa</SelectItem>
                <SelectItem value="bank">🏦 Bank Transfer</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button className="w-full bg-cyan-600 hover:bg-cyan-700 text-white mt-4" onClick={() => setDone(true)}>
            Confirm {booking?.type === "sale" ? "Inquiry" : "Booking"}
          </Button>
        </DialogContent>
      </Dialog>

      <Dialog open={done} onOpenChange={() => { setDone(false); setBooking(null); }}>
        <DialogContent className="max-w-sm text-center">
          <div className="text-5xl mb-4">🚌</div>
          <h3 className="text-xl font-bold mb-2">Request Sent!</h3>
          <p className="text-gray-500 mb-4">The vendor will contact you soon about <strong>{booking?.name}</strong>.</p>
          <Button className="bg-cyan-600 hover:bg-cyan-700 text-white w-full" onClick={() => { setDone(false); setBooking(null); }}>Done</Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}