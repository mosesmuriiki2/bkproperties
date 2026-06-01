import { useState, useEffect } from 'react';
import api from '@/api/apiClient';

export const useModules = () => {
  const [modules, setModules] = useState({
    products: false,
    hotels: false,
    properties: true,
    tours: false,
    orders: false,
    payments: false,
    vendors: true,
    users: true,
    notifications: false,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const response = await api.modules.getStatus();
        setModules(response.modules || modules);
      } catch (error) {
        console.warn('Could not fetch module status, using defaults:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchModules();
  }, []);

  return { modules, loading };
};
