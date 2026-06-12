/**
 * DataService - Manages data fetching from mocked data or real API
 * Supports switching between mocked and real data easily
 */

const USE_MOCK_DATA = true; // Toggle to false when real backend is ready

// MOCKED DATA
const mockCategories = [
  {
    id: 1,
    icon: "✈️",
    label: "Tours & Adventures",
    sublabel: "Safaris, treks & adventures",
    count: "2,500+",
    page: "Tours",
    image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800&q=80",
    color: "emerald",
  },
  {
    id: 2,
    icon: "🏨",
    label: "Hotels & Lodges",
    sublabel: "City hotels & safari lodges",
    count: "1,200+",
    page: "Hotels",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80",
    color: "blue",
  },
  {
    id: 3,
    icon: "🔑",
    label: "Cars for Hire",
    sublabel: "Daily, weekly & monthly rentals",
    count: "1,800+",
    page: "Cars",
    image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&q=80",
    color: "amber",
  },
  {
    id: 4,
    icon: "🏡",
    label: "Houses & Apartments",
    sublabel: "Homes, villas & apartments",
    count: "3,200+",
    page: "Properties",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
    color: "pink",
  },
  {
    id: 5,
    icon: "🌍",
    label: "Land & Plots",
    sublabel: "Plots, acres & title deeds",
    count: "900+",
    page: "Land",
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80",
    color: "amber",
  },
  {
    id: 6,
    icon: "🚌",
    label: "Tourist Vehicles",
    sublabel: "Hire & sale of tour vehicles",
    count: "400+",
    page: "TouristVehicles",
    image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&q=80",
    color: "indigo",
  },
];

const mockFeaturedListings = [
  {
    id: 1,
    type: "Hotel",
    badge: "Featured",
    title: "Voyager Hotel – Executive Suite",
    location: "Nairobi, Kenya",
    price: "USD 320/night",
    rating: 4.9,
    reviews: 214,
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80",
    page: "Hotels",
  },
  {
    id: 2,
    type: "Tour",
    badge: "Top Rated",
    title: "Masai Mara Safari – 3 Days",
    location: "Masai Mara, Kenya",
    price: "USD 890/person",
    rating: 5.0,
    reviews: 312,
    image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800&q=80",
    page: "Tours",
  },
  {
    id: 3,
    type: "Car",
    badge: "Hot Deal",
    title: "Mercedes-Benz GLE 2023 – For Sale",
    location: "Westlands, Nairobi",
    price: "USD 78,000",
    rating: 4.7,
    reviews: 18,
    image: "https://images.unsplash.com/photo-1617886903355-9354bb57751f?w=800&q=80",
    page: "Cars",
  },
  {
    id: 4,
    type: "Land",
    badge: "New",
    title: "2 Acre Prime Plot – Kitengela",
    location: "Kitengela, Kenya",
    price: "USD 45,000",
    rating: 4.5,
    reviews: 9,
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80",
    page: "Land",
  },
  {
    id: 5,
    type: "House",
    badge: "For Rent",
    title: "Modern 3BR Apartment – Westlands",
    location: "Westlands, Nairobi",
    price: "USD 1,200/month",
    rating: 4.8,
    reviews: 31,
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
    page: "Properties",
  },
  {
    id: 6,
    type: "Tour",
    badge: "Adventure",
    title: "Mount Kenya Trek – 5 Days",
    location: "Mount Kenya, Kenya",
    price: "USD 650/person",
    rating: 4.8,
    reviews: 127,
    image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=80",
    page: "Tours",
  },
];

const mockStats = [
  { value: "12,000+", label: "Active Listings" },
  { value: "340+", label: "Verified Vendors" },
  { value: "50+", label: "Countries" },
  { value: "98%", label: "Satisfaction Rate" },
];

// API BASE URL - Change this when backend is ready
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

/**
 * Get all categories
 */
export const getCategories = async () => {
  if (USE_MOCK_DATA) {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockCategories), 300);
    });
  }

  try {
    const response = await fetch(`${API_BASE_URL}/categories`);
    if (!response.ok) throw new Error("Failed to fetch categories");
    return await response.json();
  } catch (error) {
    console.error("Error fetching categories:", error);
    return mockCategories; // Fallback to mock data
  }
};

/**
 * Get featured listings
 */
export const getFeaturedListings = async () => {
  if (USE_MOCK_DATA) {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockFeaturedListings), 300);
    });
  }

  try {
    const response = await fetch(`${API_BASE_URL}/listings/featured`);
    if (!response.ok) throw new Error("Failed to fetch listings");
    return await response.json();
  } catch (error) {
    console.error("Error fetching featured listings:", error);
    return mockFeaturedListings; // Fallback
  }
};

/**
 * Get platform statistics
 */
export const getStats = async () => {
  if (USE_MOCK_DATA) {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockStats), 200);
    });
  }

  try {
    const response = await fetch(`${API_BASE_URL}/stats`);
    if (!response.ok) throw new Error("Failed to fetch stats");
    return await response.json();
  } catch (error) {
    console.error("Error fetching stats:", error);
    return mockStats; // Fallback
  }
};

/**
 * Search listings
 */
export const searchListings = async (query, filters = {}) => {
  if (USE_MOCK_DATA) {
    return new Promise((resolve) => {
      const filtered = mockFeaturedListings.filter((item) => {
        const matchQuery =
          !query ||
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.location.toLowerCase().includes(query.toLowerCase());
        const matchCategory = !filters.category || item.type === filters.category;
        return matchQuery && matchCategory;
      });
      setTimeout(() => resolve(filtered), 300);
    });
  }

  try {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    Object.keys(filters).forEach((key) => {
      if (filters[key]) params.set(key, filters[key]);
    });

    const response = await fetch(`${API_BASE_URL}/listings/search?${params}`);
    if (!response.ok) throw new Error("Failed to search listings");
    return await response.json();
  } catch (error) {
    console.error("Error searching listings:", error);
    return mockFeaturedListings; // Fallback
  }
};

/**
 * Get listings by category
 */
export const getListingsByCategory = async (category) => {
  if (USE_MOCK_DATA) {
    return new Promise((resolve) => {
      const filtered = mockFeaturedListings.filter(
        (item) => item.type === category || item.page === category
      );
      setTimeout(() => resolve(filtered), 300);
    });
  }

  try {
    const response = await fetch(`${API_BASE_URL}/listings/category/${category}`);
    if (!response.ok) throw new Error("Failed to fetch listings");
    return await response.json();
  } catch (error) {
    console.error("Error fetching listings:", error);
    return mockFeaturedListings.filter(
      (item) => item.type === category || item.page === category
    );
  }
};

/**
 * Get branding configuration (logo, colors, etc)
 */
export const getBrandingConfig = async () => {
  if (USE_MOCK_DATA) {
    return new Promise((resolve) => {
      setTimeout(
        () =>
          resolve({
            logo: "/logo.png",
            logoText: "BK Properties",
            primaryColor: "#0ea5e9",
            secondaryColor: "#1e293b",
            social: {
              facebook: "https://facebook.com/bkproperties",
              twitter: "https://twitter.com/bkproperties",
              instagram: "https://instagram.com/bkproperties",
              linkedin: "https://linkedin.com/company/bkproperties",
              youtube: "https://youtube.com/@bkproperties",
            },
          }),
        100
      );
    });
  }

  try {
    const response = await fetch(`${API_BASE_URL}/config/branding`);
    if (!response.ok) throw new Error("Failed to fetch branding");
    return await response.json();
  } catch (error) {
    console.error("Error fetching branding:", error);
    return {
      logo: "/logo.png",
      logoText: "BK Properties",
      primaryColor: "#0ea5e9",
      secondaryColor: "#1e293b",
      social: {
        facebook: "https://facebook.com/bkproperties",
        twitter: "https://twitter.com/bkproperties",
        instagram: "https://instagram.com/bkproperties",
        linkedin: "https://linkedin.com/company/bkproperties",
        youtube: "https://youtube.com/@bkproperties",
      },
    };
  }
};

/**
 * Update branding configuration (Admin only)
 */
export const updateBrandingConfig = async (config) => {
  if (USE_MOCK_DATA) {
    return new Promise((resolve) => {
      setTimeout(() => resolve({ success: true, config }), 300);
    });
  }

  try {
    const response = await fetch(`${API_BASE_URL}/config/branding`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(config),
    });
    if (!response.ok) throw new Error("Failed to update branding");
    return await response.json();
  } catch (error) {
    console.error("Error updating branding:", error);
    return { success: false, error: error.message };
  }
};

/**
 * Get all listings with filters
 */
export const getAllListings = async (filters = {}) => {
  if (USE_MOCK_DATA) {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockFeaturedListings), 300);
    });
  }

  try {
    const params = new URLSearchParams();
    Object.keys(filters).forEach((key) => {
      if (filters[key]) params.set(key, filters[key]);
    });

    const response = await fetch(`${API_BASE_URL}/listings?${params}`);
    if (!response.ok) throw new Error("Failed to fetch listings");
    return await response.json();
  } catch (error) {
    console.error("Error fetching listings:", error);
    return mockFeaturedListings;
  }
};

export default {
  getCategories,
  getFeaturedListings,
  getStats,
  searchListings,
  getListingsByCategory,
  getBrandingConfig,
  updateBrandingConfig,
  getAllListings,
};
