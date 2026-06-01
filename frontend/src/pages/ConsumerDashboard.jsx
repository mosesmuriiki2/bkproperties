import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  LogOut, User, Heart, Calendar, Settings, Home, Loader2, 
  CheckCircle, Clock, XCircle, MapPin, Eye, MessageSquare 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import apiClient from "@/api/apiClient";
import { toast } from "sonner";

export default function ConsumerDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalBookings: 0,
    confirmedBookings: 0,
    pendingBookings: 0
  });

  useEffect(() => {
    const authData = sessionStorage.getItem("mg_user_auth") || sessionStorage.getItem("mg_consumer_auth");
    if (!authData) {
      navigate("/login");
      return;
    }
    
    try {
      const parsed = JSON.parse(authData);
      setUser(parsed);
      if (parsed.userId) {
        fetchBookings(parsed.userId);
      }
    } catch (e) {
      console.error("Error parsing auth data:", e);
      navigate("/login");
    }
  }, [navigate]);

  const fetchBookings = async (userId) => {
    try {
      setLoading(true);
      const response = await apiClient.bookings.getByCustomer(userId, 0, 100);
      const bookingsList = response.content || response || [];
      setBookings(bookingsList);
      
      // Calculate stats
      setStats({
        totalBookings: bookingsList.length,
        confirmedBookings: bookingsList.filter(b => b.status === 'CONFIRMED').length,
        pendingBookings: bookingsList.filter(b => b.status === 'PENDING').length
      });
    } catch (err) {
      console.error("Failed to fetch bookings:", err);
      toast.error("Failed to load bookings");
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("mg_user_auth");
    sessionStorage.removeItem("mg_consumer_auth");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    navigate("/");
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      PENDING: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Pending' },
      CONFIRMED: { bg: 'bg-green-100', text: 'text-green-700', label: 'Confirmed' },
      CANCELLED: { bg: 'bg-red-100', text: 'text-red-700', label: 'Cancelled' },
      COMPLETED: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Completed' },
      NO_SHOW: { bg: 'bg-gray-100', text: 'text-gray-700', label: 'No Show' }
    };
    
    const config = statusConfig[status] || statusConfig.PENDING;
    return (
      <Badge className={`${config.bg} ${config.text} border-0`}>
        {config.label}
      </Badge>
    );
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold">
              {user.email?.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-semibold text-gray-900">{user.email}</p>
              <p className="text-sm text-gray-500">Consumer Account</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={() => navigate("/")}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Home className="w-4 h-4" />
              Home
            </Button>
            <Button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Navigation Tabs */}
        <div className="flex gap-4 mb-8 border-b border-gray-200 overflow-x-auto">
          {[
            { id: "overview", label: "Overview", icon: Home },
            { id: "bookings", label: "My Bookings", icon: Calendar, count: stats.totalBookings },
            { id: "wishlist", label: "Wishlist", icon: Heart },
            { id: "profile", label: "Profile", icon: User },
          ].map(({ id, label, icon: Icon, count }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`pb-4 px-4 font-medium flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === id
                  ? "border-emerald-600 text-emerald-600"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
              {count > 0 && (
                <Badge className="bg-emerald-500 text-white border-0 text-xs">
                  {count}
                </Badge>
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        {activeTab === "overview" && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Dashboard Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* Quick Stats */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <Calendar className="w-8 h-8 text-emerald-600" />
                    <Badge className="bg-emerald-100 text-emerald-700 border-0">
                      Total
                    </Badge>
                  </div>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalBookings}</p>
                  <p className="text-gray-600 text-sm mt-1">Total Bookings</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                    <Badge className="bg-green-100 text-green-700 border-0">
                      Confirmed
                    </Badge>
                  </div>
                  <p className="text-3xl font-bold text-gray-900">{stats.confirmedBookings}</p>
                  <p className="text-gray-600 text-sm mt-1">Confirmed</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <Clock className="w-8 h-8 text-yellow-600" />
                    <Badge className="bg-yellow-100 text-yellow-700 border-0">
                      Pending
                    </Badge>
                  </div>
                  <p className="text-3xl font-bold text-gray-900">{stats.pendingBookings}</p>
                  <p className="text-gray-600 text-sm mt-1">Awaiting Confirmation</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Bookings */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Bookings</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-emerald-500" />
                  </div>
                ) : bookings.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p>No bookings yet</p>
                    <Button 
                      className="mt-4 bg-emerald-500 hover:bg-emerald-600 text-white"
                      onClick={() => navigate("/properties")}
                    >
                      Browse Properties
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {bookings.slice(0, 5).map(booking => (
                      <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900">{booking.propertyTitle}</p>
                          <p className="text-sm text-gray-600">
                            {formatDate(booking.bookingDate)} at {booking.bookingTime}
                          </p>
                        </div>
                        {getStatusBadge(booking.status)}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "bookings" && (
          <div>
            <h2 className="text-2xl font-bold mb-6">My Bookings</h2>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
              </div>
            ) : bookings.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No bookings yet</h3>
                  <p className="text-gray-600 mb-6">Start exploring properties and schedule viewings</p>
                  <Button 
                    className="bg-emerald-500 hover:bg-emerald-600 text-white"
                    onClick={() => navigate("/properties")}
                  >
                    Browse Properties
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {bookings.map(booking => (
                  <Card key={booking.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-bold text-gray-900">{booking.propertyTitle}</h3>
                            {getStatusBadge(booking.status)}
                          </div>
                          <div className="space-y-1 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              <span>{formatDate(booking.bookingDate)}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4" />
                              <span>{booking.bookingTime}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Eye className="w-4 h-4" />
                              <span>{booking.bookingType.replace('_', ' ')}</span>
                            </div>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/property/${booking.propertyId}`)}
                        >
                          View Property
                        </Button>
                      </div>

                      {booking.message && (
                        <div className="bg-gray-50 rounded-lg p-3 mb-3">
                          <p className="text-sm text-gray-700"><strong>Your message:</strong> {booking.message}</p>
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-3 border-t">
                        <div className="text-sm text-gray-500">
                          Booked on {new Date(booking.createdAt).toLocaleDateString()}
                        </div>
                        {booking.status === 'CONFIRMED' && booking.confirmedAt && (
                          <div className="flex items-center gap-2 text-sm text-green-600">
                            <CheckCircle className="w-4 h-4" />
                            Confirmed on {new Date(booking.confirmedAt).toLocaleDateString()}
                          </div>
                        )}
                        {booking.status === 'CANCELLED' && booking.cancelledAt && (
                          <div className="text-sm text-red-600">
                            Cancelled on {new Date(booking.cancelledAt).toLocaleDateString()}
                            {booking.cancellationReason && (
                              <p className="text-xs mt-1">Reason: {booking.cancellationReason}</p>
                            )}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "wishlist" && (
          <Card>
            <CardContent className="p-12 text-center">
              <Heart className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Wishlist Coming Soon</h3>
              <p className="text-gray-600">Save your favorite properties for later</p>
            </CardContent>
          </Card>
        )}

        {activeTab === "profile" && (
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-gray-700">Email</label>
                <p className="text-gray-900 mt-1">{user.email}</p>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700">User ID</label>
                <p className="text-gray-900 mt-1">#{user.userId}</p>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700">Role</label>
                <p className="text-gray-900 mt-1">{user.role || 'CONSUMER'}</p>
              </div>
              <Button variant="outline" className="mt-4">
                Edit Profile
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
