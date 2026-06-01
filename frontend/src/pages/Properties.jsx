import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Home, Search, Filter, MapPin, Bed, Bath, Maximize, DollarSign, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import apiClient from "@/api/apiClient";
import { toast } from "sonner";

const KENYAN_COUNTIES = [
  "All Counties", "Baringo", "Bomet", "Bungoma", "Busia", "Elgeyo-Marakwet", "Embu", "Garissa", "Homa Bay",
  "Isiolo", "Kajiado", "Kakamega", "Kericho", "Kiambu", "Kilifi", "Kirinyaga", "Kisii",
  "Kisumu", "Kitui", "Kwale", "Laikipia", "Lamu", "Machakos", "Makueni", "Mandera",
  "Marsabit", "Meru", "Migori", "Mombasa", "Murang'a", "Nairobi", "Nakuru", "Nandi",
  "Narok", "Nyamira", "Nyandarua", "Nyeri", "Samburu", "Siaya", "Taita-Taveta", "Tana River",
  "Tharaka-Nithi", "Trans Nzoia", "Turkana", "Uasin Gishu", "Vihiga", "Wajir", "West Pokot"
];

export default function Properties() {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    county: "",
    propertyType: "",
    listingType: "",
    minPrice: "",
    maxPrice: "",
    search: ""
  });
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    loadProperties();
  }, [page, filters]);

  const loadProperties = async () => {
    setLoading(true);
    try {
      // Use the apiClient.properties.getActive method
      const response = await apiClient.properties.getActive(page, 100); // Load more properties for client-side filtering
      
      console.log("Properties response:", response); // Debug log
      
      // Handle both paginated and non-paginated responses
      let allProperties = [];
      if (response.content) {
        allProperties = response.content;
      } else if (Array.isArray(response)) {
        allProperties = response;
      } else {
        console.error("Unexpected response format:", response);
        allProperties = [];
      }
      
      // Apply client-side filtering if filters are set
      let filteredProperties = allProperties;
      
      if (filters.county && filters.county !== "All Counties") {
        filteredProperties = filteredProperties.filter(p => p.county === filters.county);
      }
      if (filters.propertyType && filters.propertyType !== "ALL") {
        filteredProperties = filteredProperties.filter(p => p.propertyType === filters.propertyType);
      }
      if (filters.listingType && filters.listingType !== "ALL") {
        filteredProperties = filteredProperties.filter(p => p.listingType === filters.listingType);
      }
      if (filters.minPrice) {
        filteredProperties = filteredProperties.filter(p => p.price >= parseFloat(filters.minPrice));
      }
      if (filters.maxPrice) {
        filteredProperties = filteredProperties.filter(p => p.price <= parseFloat(filters.maxPrice));
      }
      
      console.log("Filtered properties:", filteredProperties); // Debug log
      
      setProperties(filteredProperties);
      setTotalPages(response.totalPages || 1);
    } catch (error) {
      console.error("Error loading properties:", error);
      toast.error(error.message || "Failed to load properties");
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    if (!price) return "KSh 0";
    return `KSh ${price.toLocaleString()}`;
  };

  const handlePropertyClick = (id) => {
    navigate(`/property/${id}`);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPage(0); // Reset to first page when filters change
  };

  const clearFilters = () => {
    setFilters({
      county: "",
      propertyType: "",
      listingType: "",
      minPrice: "",
      maxPrice: "",
      search: ""
    });
    setPage(0);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Property Listings</h1>
          <p className="text-gray-600">Find your dream property in Kenya</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-b shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
            <Select value={filters.county} onValueChange={(v) => handleFilterChange("county", v)}>
              <SelectTrigger>
                <SelectValue placeholder="All Counties" />
              </SelectTrigger>
              <SelectContent>
                {KENYAN_COUNTIES.map(county => (
                  <SelectItem key={county} value={county}>{county}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filters.propertyType} onValueChange={(v) => handleFilterChange("propertyType", v)}>
              <SelectTrigger>
                <SelectValue placeholder="Property Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Types</SelectItem>
                <SelectItem value="HOUSE">House</SelectItem>
                <SelectItem value="APARTMENT">Apartment</SelectItem>
                <SelectItem value="LAND">Land</SelectItem>
                <SelectItem value="COMMERCIAL">Commercial</SelectItem>
                <SelectItem value="INDUSTRIAL">Industrial</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.listingType} onValueChange={(v) => handleFilterChange("listingType", v)}>
              <SelectTrigger>
                <SelectValue placeholder="Listing Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Listings</SelectItem>
                <SelectItem value="SALE">For Sale</SelectItem>
                <SelectItem value="RENT">For Rent</SelectItem>
              </SelectContent>
            </Select>

            <Input
              type="number"
              placeholder="Min Price (KSh)"
              value={filters.minPrice}
              onChange={(e) => handleFilterChange("minPrice", e.target.value)}
            />

            <Input
              type="number"
              placeholder="Max Price (KSh)"
              value={filters.maxPrice}
              onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
            />
          </div>

          <div className="flex gap-2 mt-3">
            <Button onClick={loadProperties} className="bg-emerald-500 hover:bg-emerald-600 text-white">
              <Search className="w-4 h-4 mr-2" /> Search
            </Button>
            <Button onClick={clearFilters} variant="outline">
              Clear Filters
            </Button>
          </div>
        </div>
      </div>

      {/* Property Grid */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center py-20">
            <Home className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No properties found</h3>
            <p className="text-gray-500 mb-6">Try adjusting your filters or check back later</p>
            <Button onClick={clearFilters} variant="outline">Clear Filters</Button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map(property => (
                <Card 
                  key={property.id} 
                  className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => handlePropertyClick(property.id)}
                >
                  <div className="relative h-48 bg-gray-200">
                    {property.images && property.images.length > 0 ? (
                      <img 
                        src={property.images[0]} 
                        alt={property.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect fill='%23e5e7eb' width='400' height='300'/%3E%3Ctext fill='%239ca3af' font-family='sans-serif' font-size='18' x='50%25' y='50%25' text-anchor='middle' dominant-baseline='middle'%3ENo Image%3C/text%3E%3C/svg%3E";
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Home className="w-16 h-16 text-gray-400" />
                      </div>
                    )}
                    <div className="absolute top-3 right-3">
                      <Badge className="bg-emerald-500 text-white border-0">
                        {property.listingType}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <div className="mb-2">
                      <Badge variant="outline" className="text-xs">
                        {property.propertyType}
                      </Badge>
                    </div>
                    <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-1">
                      {property.title}
                    </h3>
                    <div className="flex items-center text-sm text-gray-500 mb-3">
                      <MapPin className="w-4 h-4 mr-1" />
                      {property.county}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                      {property.bedrooms && (
                        <div className="flex items-center">
                          <Bed className="w-4 h-4 mr-1" />
                          {property.bedrooms}
                        </div>
                      )}
                      {property.bathrooms && (
                        <div className="flex items-center">
                          <Bath className="w-4 h-4 mr-1" />
                          {property.bathrooms}
                        </div>
                      )}
                      {property.areaSqm && (
                        <div className="flex items-center">
                          <Maximize className="w-4 h-4 mr-1" />
                          {property.areaSqm} m²
                        </div>
                      )}
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t">
                      <span className="text-2xl font-bold text-emerald-600">
                        {formatPrice(property.price)}
                      </span>
                      <Button size="sm" className="bg-emerald-500 hover:bg-emerald-600 text-white">
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                <Button
                  onClick={() => setPage(p => Math.max(0, p - 1))}
                  disabled={page === 0}
                  variant="outline"
                >
                  Previous
                </Button>
                <span className="flex items-center px-4 text-sm text-gray-600">
                  Page {page + 1} of {totalPages}
                </span>
                <Button
                  onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                  disabled={page >= totalPages - 1}
                  variant="outline"
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
