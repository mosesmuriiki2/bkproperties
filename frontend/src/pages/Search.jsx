import { useState, useEffect, useRef } from "react";
import { MapPin, Search, Star, X, TrendingUp, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

const allListings = [
  { id: 1, type: "Hotels", title: "Voyager Hotel – Executive Suite", location: "Nairobi, Kenya", price: "KSH 320/night", rating: 4.9, reviews: 214, image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80", vendor: "Voyager Hotels", page: "Hotels" },
  { id: 2, type: "Tours", title: "Masai Mara Safari – 3 Days", location: "Masai Mara, Kenya", price: "KSH 890/person", rating: 5.0, reviews: 312, image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800&q=80", vendor: "Bonfire Adventures", page: "Tours" },
  { id: 3, type: "Cars", title: "Mercedes-Benz GLE 2023", location: "Westlands, Nairobi", price: "KSH 78,000", rating: 4.7, reviews: 18, image: "https://images.unsplash.com/photo-1617886903355-9354bb57751f?w=800&q=80", vendor: "Kiambu Motors", page: "Cars" },
  { id: 4, type: "Land", title: "2 Acre Prime Plot – Kitengela", location: "Kitengela, Kenya", price: "KSH 45,000", rating: 4.5, reviews: 9, image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80", vendor: "Optiven Limited", page: "Land" },
  { id: 5, type: "Houses", title: "Modern 3BR Apartment – Westlands", location: "Westlands, Nairobi", price: "KSH 1,200/month", rating: 4.8, reviews: 31, image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80", vendor: "Karen Estates", page: "Properties" },
  { id: 6, type: "Tours", title: "Mount Kenya Trek – 5 Days", location: "Mount Kenya, Kenya", price: "KSH 650/person", rating: 4.8, reviews: 127, image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=80", vendor: "SafariBookings Kenya", page: "Tours" },
  { id: 7, type: "Cars", title: "Toyota Land Cruiser V8 – Hire", location: "Nairobi, Kenya", price: "KSH 180/day", rating: 4.7, reviews: 89, image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&q=80", vendor: "Kiambu Motors", page: "Cars" },
  { id: 8, type: "Hotels", title: "Diani Reef Beach Resort", location: "Diani Beach, Mombasa", price: "KSH 240/night", rating: 4.7, reviews: 623, image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&q=80", vendor: "Diani Reef Resorts", page: "Hotels" },
  { id: 9, type: "Land", title: "1 Acre Plot – Karen", location: "Karen, Nairobi", price: "KSH 120,000", rating: 4.6, reviews: 5, image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80", vendor: "Land Lens Kenya", page: "Land" },
  { id: 10, type: "Houses", title: "5BR Villa – Karen", location: "Karen, Nairobi", price: "KSH 850,000", rating: 4.9, reviews: 12, image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80", vendor: "Karen Estates", page: "Properties" },
];

const trendingSearches = ["Masai Mara Safari", "Hotels in Nairobi", "Land in Karen", "Cars for hire", "Beach resorts"];
const categories = ["All", "Hotels", "Tours", "Cars", "Land", "Houses"];

const RECENT_KEY = "mg_recent_searches";

export default function SearchPage() {
  const urlParams = new URLSearchParams(window.location.search);
  const [query, setQuery] = useState(urlParams.get("q") || "");
  const [category, setCategory] = useState(urlParams.get("category") || "All");
  const [sortBy, setSortBy] = useState("relevance");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [recentSearches, setRecentSearches] = useState(() => {
    try { return JSON.parse(localStorage.getItem(RECENT_KEY) || "[]"); } catch { return []; }
  });
  const inputRef = useRef(null);

  const suggestions = query.length >= 2
    ? allListings.filter(l =>
        l.title.toLowerCase().includes(query.toLowerCase()) ||
        l.location.toLowerCase().includes(query.toLowerCase()) ||
        l.vendor.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 5)
    : [];

  const saveRecent = (term) => {
    const updated = [term, ...recentSearches.filter(r => r !== term)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem(RECENT_KEY, JSON.stringify(updated));
  };

  const handleSelect = (term) => {
    setQuery(term);
    saveRecent(term);
    setShowSuggestions(false);
  };

  const clearRecent = () => {
    setRecentSearches([]);
    localStorage.removeItem(RECENT_KEY);
  };

  let filtered = allListings.filter(l => {
    const matchCat = category === "All" || l.type === category;
    const matchQ = !query || l.title.toLowerCase().includes(query.toLowerCase()) || l.location.toLowerCase().includes(query.toLowerCase()) || l.vendor.toLowerCase().includes(query.toLowerCase());
    return matchCat && matchQ;
  });

  if (sortBy === "rating") filtered = [...filtered].sort((a, b) => b.rating - a.rating);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search bar */}
      <div className="bg-white border-b py-5 px-4 shadow-sm sticky top-16 z-30">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-3">
          {/* Global search input with suggestions */}
          <div className="relative flex-1">
            <div className="flex items-center gap-2 bg-gray-100 rounded-xl px-4 py-2.5">
              <Search className="w-4 h-4 text-gray-400 shrink-0" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search listings, vendors, locations..."
                className="flex-1 bg-transparent outline-none text-gray-700 text-sm"
                value={query}
                onChange={e => { setQuery(e.target.value); setShowSuggestions(true); }}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                onKeyDown={e => { if (e.key === "Enter" && query) { saveRecent(query); setShowSuggestions(false); } }}
              />
              {query && (
                <button onClick={() => { setQuery(""); inputRef.current?.focus(); }}>
                  <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                </button>
              )}
            </div>

            {/* Dropdown suggestions */}
            {showSuggestions && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-xl border z-50 overflow-hidden">
                {suggestions.length > 0 && (
                  <div>
                    <p className="text-xs text-gray-400 font-semibold px-4 pt-3 pb-1 uppercase tracking-wide">Suggestions</p>
                    {suggestions.map(l => (
                      <button key={l.id} className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 text-left" onMouseDown={() => handleSelect(l.title)}>
                        <Search className="w-3.5 h-3.5 text-gray-300 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{l.title}</p>
                          <p className="text-xs text-gray-400">{l.type} • {l.location}</p>
                        </div>
                        <Badge className="bg-gray-100 text-gray-500 text-xs border-0">{l.type}</Badge>
                      </button>
                    ))}
                  </div>
                )}
                {recentSearches.length > 0 && query.length < 2 && (
                  <div>
                    <div className="flex items-center justify-between px-4 pt-3 pb-1">
                      <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide">Recent</p>
                      <button className="text-xs text-gray-400 hover:text-gray-600" onMouseDown={clearRecent}>Clear</button>
                    </div>
                    {recentSearches.map(r => (
                      <button key={r} className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50 text-left" onMouseDown={() => handleSelect(r)}>
                        <Clock className="w-3.5 h-3.5 text-gray-300 shrink-0" />
                        <span className="text-sm text-gray-700">{r}</span>
                      </button>
                    ))}
                  </div>
                )}
                {query.length < 2 && (
                  <div>
                    <p className="text-xs text-gray-400 font-semibold px-4 pt-3 pb-1 uppercase tracking-wide">Trending</p>
                    {trendingSearches.map(t => (
                      <button key={t} className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50 text-left" onMouseDown={() => handleSelect(t)}>
                        <TrendingUp className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span className="text-sm text-gray-700">{t}</span>
                      </button>
                    ))}
                  </div>
                )}
                {suggestions.length === 0 && query.length >= 2 && (
                  <p className="text-sm text-gray-400 px-4 py-4 text-center">No matches found</p>
                )}
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-36 border-gray-200"><SelectValue /></SelectTrigger>
              <SelectContent>{categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-40 border-gray-200"><SelectValue placeholder="Sort by" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="relevance">Relevance</SelectItem>
                <SelectItem value="rating">Top Rated</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <p className="text-gray-600 text-sm">
            <span className="font-semibold text-gray-900">{filtered.length}</span> results
            {query && <> for "<span className="font-semibold text-emerald-600">{query}</span>"</>}
          </p>
          <div className="flex flex-wrap gap-2">
            {categories.map(c => (
              <button key={c} onClick={() => setCategory(c)} className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${category === c ? "bg-emerald-500 text-white" : "bg-white border text-gray-600 hover:border-emerald-500"}`}>
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(l => (
            <Link key={l.id} to={createPageUrl(l.page)}>
              <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
                <div className="relative h-48 overflow-hidden">
                  <img src={l.image} alt={l.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-3 left-3">
                    <Badge className="bg-white/90 text-gray-700 text-xs">{l.type}</Badge>
                  </div>
                  <div className="absolute top-3 right-3 bg-white/90 rounded-lg px-2 py-1 flex items-center gap-1">
                    <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                    <span className="text-xs font-bold">{l.rating}</span>
                  </div>
                </div>
                <div className="p-4">
                  <p className="font-bold text-gray-900 text-sm mb-1">{l.title}</p>
                  <p className="text-xs text-gray-500 flex items-center gap-1 mb-2"><MapPin className="w-3 h-3 text-emerald-500" />{l.location}</p>
                  <div className="flex items-center justify-between border-t pt-2">
                    <span className="font-bold text-emerald-600 text-sm">{l.price}</span>
                    <span className="text-xs text-gray-400">{l.vendor}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <Search className="w-12 h-12 text-gray-200 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-700 mb-2">No results found</h3>
            <p className="text-gray-400 mb-4">Try adjusting your search or browse all categories</p>
            <div className="flex flex-wrap justify-center gap-2">
              {trendingSearches.map(t => (
                <button key={t} onClick={() => setQuery(t)} className="px-4 py-2 rounded-full bg-emerald-50 text-emerald-700 text-sm font-medium hover:bg-emerald-100 transition-colors">
                  {t}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}