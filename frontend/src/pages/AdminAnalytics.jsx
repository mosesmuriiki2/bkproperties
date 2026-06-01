import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { Shield, TrendingUp, Eye, Users, DollarSign } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

const monthly = [
  { month: "Sep", visitors: 12400, bookings: 340, revenue: 48000 },
  { month: "Oct", visitors: 18200, bookings: 520, revenue: 67000 },
  { month: "Nov", visitors: 22800, bookings: 690, revenue: 82000 },
  { month: "Dec", visitors: 31000, bookings: 940, revenue: 115000 },
  { month: "Jan", visitors: 28500, bookings: 820, revenue: 98000 },
  { month: "Feb", visitors: 35200, bookings: 1100, revenue: 134000 },
];

const categoryBreakdown = [
  { name: "Tours", value: 35, color: "#10b981" },
  { name: "Hotels", value: 28, color: "#3b82f6" },
  { name: "Cars", value: 18, color: "#f59e0b" },
  { name: "Land", value: 11, color: "#ef4444" },
  { name: "Houses", value: 8, color: "#8b5cf6" },
];

export default function AdminAnalytics() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gray-900 text-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-red-600 flex items-center justify-center"><Shield className="w-5 h-5 text-white" /></div>
          <div>
            <p className="font-bold">Analytics & Traffic</p>
            <p className="text-xs text-gray-400">Admin Portal • BK Properties</p>
          </div>
        </div>
        <Link to={createPageUrl("AdminDashboard")}><Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10 text-xs">← Dashboard</Button></Link>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Monthly Visitors", value: "35,200", icon: Eye, color: "text-blue-600", bg: "bg-blue-50", trend: "+24%" },
            { label: "Bookings (Feb)", value: "1,100", icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50", trend: "+34%" },
            { label: "Active Vendors", value: "5", icon: Users, color: "text-purple-600", bg: "bg-purple-50", trend: "+2" },
            { label: "Revenue (Feb)", value: "KSH 134000", icon: DollarSign, color: "text-amber-600", bg: "bg-amber-50", trend: "+37%" },
          ].map(s => (
            <Card key={s.label}>
              <CardContent className="p-5 flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center shrink-0`}>
                  <s.icon className={`w-5 h-5 ${s.color}`} />
                </div>
                <div>
                  <p className="text-xl font-bold text-gray-900">{s.value}</p>
                  <p className="text-xs text-gray-500">{s.label}</p>
                  <Badge className="mt-1 bg-green-100 text-green-700 text-xs">{s.trend}</Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <Card className="lg:col-span-2">
            <CardHeader><CardTitle>Traffic & Bookings Trend</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthly}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="visitors" stroke="#10b981" strokeWidth={2.5} dot={{ fill: "#10b981" }} name="Visitors" />
                  <Line type="monotone" dataKey="bookings" stroke="#3b82f6" strokeWidth={2.5} dot={{ fill: "#3b82f6" }} name="Bookings" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Bookings by Category</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={categoryBreakdown} cx="50%" cy="50%" innerRadius={55} outerRadius={85} dataKey="value">
                    {categoryBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => `${v}%`} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 mt-2">
                {categoryBreakdown.map(c => (
                  <div key={c.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: c.color }} />
                      <span className="text-gray-700">{c.name}</span>
                    </div>
                    <span className="font-semibold text-gray-900">{c.value}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader><CardTitle>Monthly Revenue</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={monthly}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(v) => `KSH ${v.toLocaleString()}`} />
                <Bar dataKey="revenue" fill="#10b981" radius={[6, 6, 0, 0]} name="Revenue" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}