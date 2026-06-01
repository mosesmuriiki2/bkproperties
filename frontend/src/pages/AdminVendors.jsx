import { useState } from "react";
import { Shield, CheckCircle, Clock, XCircle, Search, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

const initialVendors = [
  { id: 1, name: "Bonfire Adventures", category: "Tours", status: "approved", model: "commission", integration: "api", revenue: 48200, bookings: 312, plan: "Enterprise API", joined: "2025-06-01" },
  { id: 2, name: "SafariBookings Kenya", category: "Tours", status: "approved", model: "commission", integration: "api", revenue: 31600, bookings: 198, plan: "Enterprise API", joined: "2025-07-15" },
  { id: 3, name: "Voyager Hotel", category: "Hotels", status: "approved", model: "pay_per_click", integration: "portal", revenue: 22400, bookings: 87, plan: "Professional", joined: "2025-08-01" },
  { id: 4, name: "Kiambu Motors", category: "Cars", status: "pending", model: "commission", integration: "portal", revenue: 0, bookings: 0, plan: "Professional", joined: "2026-02-28" },
  { id: 5, name: "Optiven Limited", category: "Land", status: "approved", model: "commission", integration: "api", revenue: 18900, bookings: 24, plan: "Enterprise API", joined: "2025-09-10" },
  { id: 6, name: "Land Lens Kenya", category: "Land", status: "suspended", model: "pay_per_click", integration: "portal", revenue: 0, bookings: 0, plan: "Basic Portal", joined: "2025-10-20" },
  { id: 7, name: "Karen Estates", category: "Properties", status: "approved", model: "commission", integration: "portal", revenue: 12800, bookings: 31, plan: "Professional", joined: "2025-11-05" },
  { id: 8, name: "Diani Reef Resorts", category: "Hotels", status: "pending", model: "commission", integration: "portal", revenue: 0, bookings: 0, plan: "Professional", joined: "2026-03-01" },
];

const statusConfig = {
  approved: { label: "Approved", color: "bg-green-100 text-green-700", icon: CheckCircle },
  pending: { label: "Pending", color: "bg-yellow-100 text-yellow-700", icon: Clock },
  suspended: { label: "Suspended", color: "bg-red-100 text-red-700", icon: XCircle },
};

export default function AdminVendors() {
  const [vendors, setVendors] = useState(initialVendors);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [configVendor, setConfigVendor] = useState(null);

  const updateStatus = (id, status) => {
    setVendors(vs => vs.map(v => v.id === id ? { ...v, status } : v));
  };

  const filtered = vendors.filter(v => {
    const matchSearch = !search || v.name.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "all" || v.status === filterStatus;
    return matchSearch && matchStatus;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gray-900 text-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-red-600 flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-bold">Vendor Management</p>
            <p className="text-xs text-gray-400">Admin Portal â€¢ BK Properties</p>
          </div>
        </div>
        <Link to={createPageUrl("AdminDashboard")}>
          <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10 text-xs">
            â† Dashboard
          </Button>
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Summary cards */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: "Approved", count: vendors.filter(v => v.status === "approved").length, color: "bg-green-50 border-green-200", textColor: "text-green-700", icon: CheckCircle },
            { label: "Pending Approval", count: vendors.filter(v => v.status === "pending").length, color: "bg-yellow-50 border-yellow-200", textColor: "text-yellow-700", icon: Clock },
            { label: "Suspended", count: vendors.filter(v => v.status === "suspended").length, color: "bg-red-50 border-red-200", textColor: "text-red-700", icon: XCircle },
          ].map(s => (
            <div key={s.label} className={`${s.color} border rounded-2xl p-5 flex items-center gap-4`}>
              <s.icon className={`w-8 h-8 ${s.textColor}`} />
              <div>
                <p className={`text-3xl font-extrabold ${s.textColor}`}>{s.count}</p>
                <p className={`text-sm ${s.textColor}`}>{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-6">
          <div className="flex items-center gap-2 flex-1 bg-white rounded-xl border px-4 py-2.5 max-w-sm">
            <Search className="w-4 h-4 text-gray-400 shrink-0" />
            <input 
              type="text" 
              placeholder="Search vendors..." 
              className="flex-1 outline-none text-sm text-gray-700" 
              value={search} 
              onChange={e => setSearch(e.target.value)} 
            />
          </div>
          <div className="flex gap-2">
            {["all", "approved", "pending", "suspended"].map(s => (
              <button 
                key={s} 
                onClick={() => setFilterStatus(s)} 
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors capitalize ${filterStatus === s ? "bg-gray-900 text-white" : "bg-white border text-gray-700 hover:bg-gray-50"}`}
              >
                {s === "all" ? "All" : s}
              </button>
            ))}
          </div>
        </div>

        {/* Vendors table */}
        <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left p-4 font-semibold text-gray-600">Vendor</th>
                <th className="text-left p-4 font-semibold text-gray-600">Category</th>
                <th className="text-left p-4 font-semibold text-gray-600">Integration</th>
                <th className="text-left p-4 font-semibold text-gray-600">Revenue Model</th>
                <th className="text-left p-4 font-semibold text-gray-600">Plan</th>
                <th className="text-left p-4 font-semibold text-gray-600">Status</th>
                <th className="text-left p-4 font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.map(v => {
                const s = statusConfig[v.status];
                return (
                  <tr key={v.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4">
                      <p className="font-semibold text-gray-900">{v.name}</p>
                      <p className="text-xs text-gray-400">Joined {v.joined}</p>
                    </td>
                    <td className="p-4 text-gray-600">{v.category}</td>
                    <td className="p-4">
                      <Badge className={`text-xs ${v.integration === "api" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-700"}`}>
                        {v.integration === "api" ? "âš¡ API" : "ðŸ¢ Portal"}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <Badge className={`text-xs ${v.model === "commission" ? "bg-emerald-100 text-emerald-700" : "bg-purple-100 text-purple-700"}`}>
                        {v.model === "commission" ? "Commission" : "Pay-per-click"}
                      </Badge>
                    </td>
                    <td className="p-4 text-gray-600 text-xs">{v.plan}</td>
                    <td className="p-4">
                      <Badge className={`text-xs ${s.color}`}>{s.label}</Badge>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2 flex-wrap">
                        {v.status === "pending" && (
                          <Button size="sm" className="bg-green-500 hover:bg-green-600 text-white text-xs h-7" onClick={() => updateStatus(v.id, "approved")}>
                            âœ… Approve
                          </Button>
                        )}
                        {v.status === "approved" && (
                          <Button size="sm" variant="outline" className="text-red-600 border-red-200 hover:bg-red-50 text-xs h-7" onClick={() => updateStatus(v.id, "suspended")}>
                            Suspend
                          </Button>
                        )}
                        {v.status === "suspended" && (
                          <Button size="sm" className="bg-emerald-500 hover:bg-emerald-600 text-white text-xs h-7" onClick={() => updateStatus(v.id, "approved")}>
                            Reinstate
                          </Button>
                        )}
                        <Button size="sm" variant="outline" className="text-xs h-7" onClick={() => setConfigVendor(v)}>
                          <Settings className="w-3 h-3 mr-1" /> Config
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Config modal */}
      <Dialog open={!!configVendor} onOpenChange={() => setConfigVendor(null)}>
        <DialogContent className="max-w-md">
          {configVendor && (
            <>
              <DialogHeader>
                <DialogTitle>Configure: {configVendor.name}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-2">Revenue Model</p>
                  <div className="grid grid-cols-2 gap-3">
                    {["commission", "pay_per_click"].map(m => (
                      <button 
                        key={m} 
                        onClick={() => setConfigVendor(v => ({ ...v, model: m }))} 
                        className={`p-3 rounded-xl border-2 text-sm font-medium transition-colors ${configVendor.model === m ? "border-emerald-500 bg-emerald-50 text-emerald-700" : "border-gray-200 text-gray-700 hover:border-gray-300"}`}
                      >
                        {m === "commission" ? "ðŸ’° Commission" : "ðŸ‘† Pay-per-click"}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-2">Access Rights</p>
                  <div className="space-y-2">
                    {["Booking Management", "Analytics Dashboard", "Upload Listings", "Payment Access"].map(r => (
                      <label key={r} className="flex items-center gap-3 cursor-pointer">
                        <input type="checkbox" defaultChecked className="rounded border-gray-300 text-emerald-500 w-4 h-4" />
                        <span className="text-sm text-gray-700">{r}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-2">Commission Rate (%)</p>
                  <Input type="number" defaultValue="15" min="0" max="50" />
                </div>
              </div>
              <Button 
                className="w-full bg-gray-900 hover:bg-gray-800 text-white mt-2" 
                onClick={() => { 
                  setVendors(vs => vs.map(v => v.id === configVendor.id ? configVendor : v)); 
                  setConfigVendor(null); 
                }}
              >
                Save Configuration
              </Button>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
