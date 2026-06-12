/**
 * pages.config.js - Page routing configuration
 * 
 * This file is AUTO-GENERATED. Do not add imports or modify PAGES manually.
 * Pages are auto-registered when you create files in the ./pages/ folder.
 * 
 * THE ONLY EDITABLE VALUE: mainPage
 * This controls which page is the landing page (shown when users visit the app).
 * 
 * Example file structure:
 * 
 *   import HomePage from './pages/HomePage';
 *   import Dashboard from './pages/Dashboard';
 *   import Settings from './pages/Settings';
 *   
 *   export const PAGES = {
 *       "HomePage": HomePage,
 *       "Dashboard": Dashboard,
 *       "Settings": Settings,
 *   }
 *   
 *   export const pagesConfig = {
 *       mainPage: "HomePage",
 *       Pages: PAGES,
 *   };
 * 
 * Example with Layout (wraps all pages):
 *
 *   import Home from './pages/Home';
 *   import Settings from './pages/Settings';
 *   import __Layout from './Layout.jsx';
 *
 *   export const PAGES = {
 *       "Home": Home,
 *       "Settings": Settings,
 *   }
 *
 *   export const pagesConfig = {
 *       mainPage: "Home",
 *       Pages: PAGES,
 *       Layout: __Layout,
 *   };
 *
 * To change the main page from HomePage to Dashboard, use find_replace:
 *   Old: mainPage: "HomePage",
 *   New: mainPage: "Dashboard",
 *
 * The mainPage value must match a key in the PAGES object exactly.
 */
import About from './pages/About';
import AdminAnalytics from './pages/AdminAnalytics';
import AdminVendors from './pages/AdminVendors';
import Blog from './pages/Blog';
import Cars from './pages/Cars';
import Home from './pages/Home';
import Hotels from './pages/Hotels';
import Land from './pages/Land';
import Login from './pages/Login';
import Properties from './pages/Properties';
import Register from './pages/Register';
import Search from './pages/Search';
import Support from './pages/Support';
import TouristVehicles from './pages/TouristVehicles';
import Tours from './pages/Tours';
import VendorPortal from './pages/VendorPortal';
import VendorLogin from './pages/VendorLogin';
import AdminLogin from './pages/AdminLogin';
import SupportLogin from './pages/SupportLogin';
import SupportCenter from './pages/SupportCenter';
import __Layout from './Layout.jsx';


export const PAGES = {
    "About": About,
    "AdminAnalytics": AdminAnalytics,
    "AdminVendors": AdminVendors,
    "Blog": Blog,
    "Cars": Cars,
    "Home": Home,
    "Hotels": Hotels,
    "Land": Land,
    "Login": Login,
    "Properties": Properties,
    "Register": Register,
    "Search": Search,
    "Support": Support,
    "TouristVehicles": TouristVehicles,
    "Tours": Tours,
    "VendorPortal": VendorPortal,
    "VendorLogin": VendorLogin,
    "AdminLogin": AdminLogin,
    "SupportLogin": SupportLogin,
    "SupportCenter": SupportCenter,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};