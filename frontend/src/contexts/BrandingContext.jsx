import React, { createContext, useContext, useState, useEffect } from "react";
import { getBrandingConfig, updateBrandingConfig } from "../services/dataService";

const BrandingContext = createContext();

export const BrandingProvider = ({ children }) => {
  const [branding, setBranding] = useState({
    logo: "🏘️",
    logoText: "BK Properties",
    primaryColor: "#16a34a",
    secondaryColor: "#000000",
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBranding = async () => {
      try {
        const config = await getBrandingConfig();
        setBranding(config);
      } catch (error) {
        console.error("Failed to load branding config:", error);
      } finally {
        setLoading(false);
      }
    };
    loadBranding();
  }, []);

  const updateBranding = async (newConfig) => {
    try {
      const updated = { ...branding, ...newConfig };
      const result = await updateBrandingConfig(updated);
      if (result.success) {
        setBranding(updated);
        localStorage.setItem("bk_branding", JSON.stringify(updated));
        return { success: true };
      }
      return result;
    } catch (error) {
      console.error("Failed to update branding:", error);
      return { success: false, error: error.message };
    }
  };

  return (
    <BrandingContext.Provider value={{ branding, updateBranding, loading }}>
      {children}
    </BrandingContext.Provider>
  );
};

export const useBranding = () => {
  const context = useContext(BrandingContext);
  if (!context) {
    throw new Error("useBranding must be used within BrandingProvider");
  }
  return context;
};
