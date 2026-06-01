import { useState } from "react";
import { MapPin, Star, Filter, Search, Fuel, Settings, Home } from "lucide-react";
import { getModuleConfig } from "@/lib/issueStore";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import CarImageGallery from "@/components/cars/CarImageGallery";

const vendors = [
  {
    id: "kiambu", name: "Kiambu Motors", logo: "🚗", location: "Westlands, Nairobi", rating: 4.7,
    cars: [
      { id: 1, name: "Mercedes-Benz GLE 2023", brand: "Mercedes-Benz", type: "sale", price: 78000, image: "https://images.unsplash.com/photo-1617886903355-9354bb57751f?w=800&q=80", fuel: "Petrol", trans: "Automatic", year: 2023, color: "White", mileage: "5,000 km", availability: "Available" },
      { id: 2, name: "Toyota Land Cruiser V8", brand: "Toyota", type: "hire", price: 180, unit: "/day", image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&q=80", fuel: "Diesel", trans: "Automatic", year: 2022, color: "Black", mileage: "42,000 km", availability: "Available" },
      { id: 3, name: "BMW X5 2022", brand: "BMW", type: "sale", price: 65000, image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&q=80", fuel: "Petrol", trans: "Automatic", year: 2022, color: "Blue", mileage: "18,000 km", availability: "Available" },
      { id: 4, name: "Toyota Hilux – For Hire", brand: "Toyota", type: "hire", price: 120, unit: "/day", image: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=800&q=80", fuel: "Diesel", trans: "Manual", year: 2021, color: "Silver", mileage: "65,000 km", availability: "Available" },
    ]
  },
  {
    id: "johnmotors", name: "John Motors", logo: "🏎️", location: "Industrial Area, Nairobi", rating: 4.5,
    cars: [
      { id: 5, name: "Honda CR-V 2023", brand: "Honda", type: "sale", price: 38000, image: "https://images.unsplash.com/photo-1568844293986-8d0400bd4745?w=800&q=80", fuel: "Petrol", trans: "Automatic", year: 2023, color: "Red", mileage: "12,000 km", availability: "Available" },
      { id: 6, name: "Nissan X-Trail – For Hire", brand: "Nissan", type: "hire", price: 90, unit: "/day", image: "https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=800&q=80", fuel: "Petrol", trans: "Automatic", year: 2020, color: "Grey", mileage: "78,000 km", availability: "Available" },
      { id: 7, name: "Subaru Forester 2022", brand: "Subaru", type: "sale", price: 28000, image: "https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=800&q=80", fuel: "Petrol", trans: "Automatic", year: 2022, color: "Green", mileage: "25,000 km", availability: "Available" },
    ]
  }
];

const brands = ["All Brands", "Mercedes-Benz", "Toyota", "BMW", "Honda", "Nissan", "Subaru"];

export default function Cars() {
  const moduleConfig = getModuleConfig();
  const saleEnabled = moduleConfig.cars_sale;
  const hireEnabled = moduleConfig.cars_hire;

  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterBrand, setFilterBrand] = useState("All Brands");
  const [filterLocation, setFilterLocation] = useState("");
  const [filterPrice, setFilterPrice] = useState("");
  const [selectedCar, setSelectedCar] = useState(null);
  const [bookingCar, setBookingCar] = useState(null);
  const [bookingForm, setBookingForm] = useState({ startDate: "", endDate: "", name: "", phone: "" });
  const [bookingDone, setBookingDone] = useState(false);

  const allCars = vendors.flatMap(v => v.cars.map(c => ({ ...c, vendor: v })));

  const filtered = allCars.filter(c => {
    if (c.type === "sale" && !saleEnabled) return false;
    if (c.type === "hire" && !hireEnabled) return false;
    const matchSearch = !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.vendor.name.toLowerCase().includes(search.toLowerCase());
    const matchType = filterType === "all" || c.type === filterType;
    const matchBrand = filterBrand === "All Brands" || c.brand === filterBrand;
    const matchLoc = !filterLocation || c.vendor.location.toLowerCase().includes(filterLocation.toLowerCase());
    const matchPrice = !filterPrice || (() => {
      const [min, max] = filterPrice.split("-").map(Number);
      return max ? c.price >= min && c.price <= max : c.price >= min;
    })();
    return matchSearch && matchType && matchBrand && matchLoc && matchPrice;
  });

  if (!saleEnabled && !hireEnabled) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">🚗</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Cars Marketplace Unavailable</h2>
          <p className="text-gray-500 mb-6">This module has been temporarily disabled by the platform administrator. Please check back soon.</p>
          <Link to="/" className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-2.5 rounded-xl font-medium transition-colors"><Home className="w-4 h-4" /> Back to Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero with real car background */}
      <div className="relative py-24 px-4 overflow-hidden">
        <img src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1600&q=80" alt="Cars" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-orange-900/85 to-red-900/75" />
        <div className="relative max-w-4xl mx-auto text-center">
          <Link to={createPageUrl("Home")} className="inline-flex items-center gap-2 text-white/70 hover:text-white text-sm mb-6 transition-colors">
            <Home className="w-4 h-4" /> Back to Home
          </Link>
          <Badge className="mb-4 bg-orange-500/20 text-orange-200 border-orange-400/30 block w-fit mx-auto">🚗 Cars Marketplace</Badge>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">Cars for Sale & Hire</h1>
          <p className="text-orange-100 text-lg mb-8">Browse verified dealers — from daily hire to permanent purchase</p>
          {/* Advanced search */}
          <div className="bg-white rounded-2xl p-3 max-w-3xl mx-auto shadow-xl">
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="flex items-center gap-2 flex-1 px-3 border-r border-gray-200">
                <Search className="w-4 h-4 text-gray-400 shrink-0" />
                <input type="text" placeholder="Search car model..." className="w-full outline-none text-gray-700 text-sm py-1.5 bg-transparent" value={search} onChange={e => setSearch(e.target.value)} />
              </div>
              <div className="flex items-center gap-2 flex-1 px-3 border-r border-gray-200">
                <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
                <input type="text" placeholder="Location" className="w-full outline-none text-gray-700 text-sm py-1.5 bg-transparent" value={filterLocation} onChange={e => setFilterLocation(e.target.value)} />
              </div>
              <select className="flex-1 outline-none text-gray-700 text-sm px-3 py-1.5 bg-transparent" value={filterPrice} onChange={e => setFilterPrice(e.target.value)}>
                <option value="">Any Price</option>
                <option value="0-50">Hire: Under USD 50/day</option>
                <option value="50-200">Hire: USD 50–200/day</option>
                <option value="0-30000">Sale: Under USD 30,000</option>
                <option value="30000-80000">Sale: USD 30,000–80,000</option>
                <option value="80000-">Sale: USD 80,000+</option>
              </select>
              <Button className="bg-orange-500 hover:bg-orange-600 text-white rounded-xl px-6">Search</Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-8 bg-white p-4 rounded-2xl shadow-sm">
          <div className="flex items-center gap-2 text-gray-500 text-sm font-medium"><Filter className="w-4 h-4" /> Filters:</div>
          <div className="flex gap-2">
            {["all", ...(saleEnabled ? ["sale"] : []), ...(hireEnabled ? ["hire"] : [])].map(t => (
              <button key={t} onClick={() => setFilterType(t)} className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${filterType === t ? "bg-orange-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-orange-50"}`}>
                {t === "all" ? "All" : t === "sale" ? "For Sale" : "For Hire"}
              </button>
            ))}
          </div>
          <Select value={filterBrand} onValueChange={setFilterBrand}>
            <SelectTrigger className="w-44 border-gray-200"><SelectValue /></SelectTrigger>
            <SelectContent>{brands.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}</SelectContent>
          </Select>
        </div>

        {/* Vendor sections */}
        {vendors.map(vendor => {
          const vendorCars = filtered.filter(c => c.vendor.id === vendor.id);
          if (!vendorCars.length) return null;
          return (
            <div key={vendor.id} className="mb-12">
              <div className="flex items-center gap-3 mb-5">
                <span className="text-4xl">{vendor.logo}</span>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{vendor.name}</h2>
                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-orange-500" /> {vendor.location} •
                    <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400 ml-1" />
                    <span className="font-medium text-gray-700">{vendor.rating}</span>
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {vendorCars.map(car => (
                  <div key={car.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group cursor-pointer" onClick={() => setSelectedCar(car)}>
                    <div className="relative h-44 overflow-hidden">
                      <img src={car.image} alt={car.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute top-3 left-3">
                        <Badge className={`text-xs font-bold ${car.type === "sale" ? "bg-orange-500 text-white" : "bg-blue-500 text-white"}`}>
                          {car.type === "sale" ? "For Sale" : "For Hire"}
                        </Badge>
                      </div>
                      <div className="absolute top-3 right-3">
                        <Badge className="bg-green-500 text-white text-xs">{car.availability}</Badge>
                      </div>
                    </div>
                    <div className="p-4">
                      <p className="font-bold text-gray-900 text-sm mb-2">{car.name}</p>
                      <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                        <span className="flex items-center gap-1"><Fuel className="w-3 h-3" />{car.fuel}</span>
                        <span className="flex items-center gap-1"><Settings className="w-3 h-3" />{car.trans}</span>
                        <span>{car.year}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-lg font-bold text-orange-600">USD {car.price.toLocaleString()}</span>
                          {car.unit && <span className="text-xs text-gray-400">{car.unit}</span>}
                        </div>
                        <Button size="sm" className="bg-orange-500 hover:bg-orange-600 text-white text-xs rounded-lg" onClick={e => { e.stopPropagation(); setBookingCar(car); }}>
                          {car.type === "sale" ? "Inquire" : "Hire"}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Car detail modal — multi-image gallery */}
      <Dialog open={!!selectedCar} onOpenChange={() => setSelectedCar(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedCar && (
            <>
              <CarImageGallery carId={selectedCar.id} onClose={() => setSelectedCar(null)} />
              <DialogHeader>
                <div className="flex items-center gap-3">
                  <DialogTitle className="text-xl flex-1">{selectedCar.name}</DialogTitle>
                  <Badge className={`text-sm font-bold shrink-0 ${selectedCar.type === "sale" ? "bg-orange-500 text-white" : "bg-blue-500 text-white"}`}>
                    {selectedCar.type === "sale" ? "For Sale" : "For Hire"}
                  </Badge>
                </div>
              </DialogHeader>
              <p className="text-sm text-gray-500 flex items-center gap-1 mb-4">
                <MapPin className="w-4 h-4 text-orange-500" /> {selectedCar.vendor.location} • {selectedCar.vendor.name}
              </p>
              <div className="grid grid-cols-3 gap-3 text-sm mb-5">
                {[["Brand", selectedCar.brand], ["Year", selectedCar.year], ["Fuel", selectedCar.fuel], ["Transmission", selectedCar.trans], ["Color", selectedCar.color], ["Mileage", selectedCar.mileage]].map(([k, v]) => (
                  <div key={k} className="bg-gray-50 rounded-lg p-3">
                    <p className="text-gray-400 text-xs mb-0.5">{k}</p>
                    <p className="font-semibold text-gray-800 text-sm">{v}</p>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between border-t pt-4">
                <div>
                  <span className="text-2xl font-bold text-orange-600">USD {selectedCar.price.toLocaleString()}</span>
                  {selectedCar.unit && <span className="text-sm text-gray-400">{selectedCar.unit}</span>}
                </div>
                <Button className="bg-orange-500 hover:bg-orange-600 text-white" onClick={() => { setSelectedCar(null); setBookingCar(selectedCar); }}>
                  {selectedCar.type === "sale" ? "Make Inquiry" : "Book Now"}
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Booking/inquiry modal */}
      <Dialog open={!!bookingCar && !bookingDone} onOpenChange={() => setBookingCar(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{bookingCar?.type === "sale" ? "Inquire About" : "Hire"}: {bookingCar?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input placeholder="Full Name" value={bookingForm.name} onChange={e => setBookingForm(f => ({ ...f, name: e.target.value }))} />
            <Input placeholder="Phone Number" value={bookingForm.phone} onChange={e => setBookingForm(f => ({ ...f, phone: e.target.value }))} />
            {bookingCar?.type === "hire" && (
              <div className="grid grid-cols-2 gap-3">
                <div><p className="text-xs text-gray-500 mb-1">Start Date</p><Input type="date" value={bookingForm.startDate} onChange={e => setBookingForm(f => ({ ...f, startDate: e.target.value }))} /></div>
                <div><p className="text-xs text-gray-500 mb-1">End Date</p><Input type="date" value={bookingForm.endDate} onChange={e => setBookingForm(f => ({ ...f, endDate: e.target.value }))} /></div>
              </div>
            )}
            <Select><SelectTrigger><SelectValue placeholder="Payment Method" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="mpesa">📱 M-Pesa</SelectItem>
                <SelectItem value="bank">🏦 Bank Transfer</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white mt-4" onClick={() => setBookingDone(true)}>
            Submit {bookingCar?.type === "sale" ? "Inquiry" : "Booking"}
          </Button>
        </DialogContent>
      </Dialog>

      <Dialog open={bookingDone} onOpenChange={() => { setBookingDone(false); setBookingCar(null); }}>
        <DialogContent className="max-w-sm text-center">
          <div className="text-5xl mb-4">🚗</div>
          <h3 className="text-xl font-bold mb-2">{bookingCar?.type === "sale" ? "Inquiry Sent!" : "Booking Confirmed!"}</h3>
          <p className="text-gray-500 mb-4">The dealer will contact you shortly regarding <strong>{bookingCar?.name}</strong>.</p>
          <Button className="bg-orange-500 hover:bg-orange-600 text-white w-full" onClick={() => { setBookingDone(false); setBookingCar(null); }}>Done</Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}