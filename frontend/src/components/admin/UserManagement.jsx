import { useState } from "react";
import { UserPlus, Users, Globe, Headphones, Mail, Phone, CheckCircle, Send, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const initialUsers = [
  { id: 1, name: "Alice Kamau", phone: "+254 700 001 001", email: "alice@bkproperties.com", role: "Support", status: "active", joined: "2026-01-15" },
  { id: 2, name: "Brian Odhiambo", phone: "+254 722 002 002", email: "brian.vendor@safari.com", role: "Vendor", status: "active", joined: "2026-02-01" },
  { id: 3, name: "Carol Njeri", phone: "+254 733 003 003", email: "carol@support.com", role: "Support", status: "pending", joined: "2026-03-01" },
];

const roleConfig = {
  Vendor: { color: "bg-emerald-100 text-emerald-700", icon: Globe },
  Support: { color: "bg-purple-100 text-purple-700", icon: Headphones },
  Admin: { color: "bg-red-100 text-red-700", icon: Users },
};

export default function UserManagement() {
  const [users, setUsers] = useState(initialUsers);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", email: "", role: "Support" });
  const [emailSent, setEmailSent] = useState(false);

  const handleAdd = () => {
    if (!form.name || !form.email) return;
    const newUser = {
      id: Date.now(),
      ...form,
      status: "pending",
      joined: new Date().toISOString().split("T")[0],
    };
    setUsers(prev => [...prev, newUser]);
    setEmailSent(true);
  };

  const handleRemove = (id) => setUsers(prev => prev.filter(u => u.id !== id));

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">User Management</h2>
        <Button className="bg-emerald-500 hover:bg-emerald-600 text-white gap-2 text-sm" onClick={() => { setShowAdd(true); setEmailSent(false); setForm({ name: "", phone: "", email: "", role: "Support" }); }}>
          <UserPlus className="w-4 h-4" /> Add User
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {[
          { label: "Total Users", value: users.length, icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Vendors", value: users.filter(u => u.role === "Vendor").length, icon: Globe, color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "Support Staff", value: users.filter(u => u.role === "Support").length, icon: Headphones, color: "text-purple-600", bg: "bg-purple-50" },
        ].map(s => (
          <Card key={s.label}>
            <CardContent className="p-5 flex items-center gap-4">
              <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center`}>
                <s.icon className={`w-5 h-5 ${s.color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold">{s.value}</p>
                <p className="text-xs text-gray-500">{s.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Users table */}
      <div className="bg-white rounded-2xl border shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left p-4 font-semibold text-gray-600">User</th>
              <th className="text-left p-4 font-semibold text-gray-600">Phone</th>
              <th className="text-left p-4 font-semibold text-gray-600">Email</th>
              <th className="text-left p-4 font-semibold text-gray-600">Role</th>
              <th className="text-left p-4 font-semibold text-gray-600">Status</th>
              <th className="text-left p-4 font-semibold text-gray-600">Joined</th>
              <th className="text-left p-4 font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {users.map(u => {
              const rc = roleConfig[u.role] || roleConfig.Support;
              const RoleIcon = rc.icon;
              return (
                <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 font-semibold text-gray-900">{u.name}</td>
                  <td className="p-4 text-gray-600 text-xs">{u.phone}</td>
                  <td className="p-4 text-gray-600 text-xs">{u.email}</td>
                  <td className="p-4">
                    <Badge className={`text-xs gap-1 ${rc.color} border-0`}>
                      <RoleIcon className="w-3 h-3" /> {u.role}
                    </Badge>
                  </td>
                  <td className="p-4">
                    <Badge className={`text-xs border-0 ${u.status === "active" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                      {u.status === "active" ? "Active" : "Pending"}
                    </Badge>
                  </td>
                  <td className="p-4 text-gray-500 text-xs">{u.joined}</td>
                  <td className="p-4">
                    <button onClick={() => handleRemove(u.id)} className="text-red-400 hover:text-red-600 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Add User Dialog */}
      <Dialog open={showAdd} onOpenChange={v => { setShowAdd(v); if (!v) setEmailSent(false); }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{emailSent ? "User Added" : "Add New User"}</DialogTitle>
          </DialogHeader>

          {!emailSent ? (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1 block">Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Jane Wanjiku"
                  className="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1 block">Phone Number</label>
                <input
                  type="tel"
                  placeholder="+254 700 000 000"
                  className="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  value={form.phone}
                  onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1 block">Email Address</label>
                <input
                  type="email"
                  placeholder="user@email.com"
                  className="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1 block">Assign Role</label>
                <div className="grid grid-cols-2 gap-2">
                  {["Support", "Vendor"].map(r => (
                    <button
                      key={r}
                      onClick={() => setForm(f => ({ ...f, role: r }))}
                      className={`px-4 py-3 rounded-xl border-2 text-sm font-semibold transition-all flex items-center justify-center gap-2 ${form.role === r ? (r === "Vendor" ? "border-emerald-500 bg-emerald-50 text-emerald-700" : "border-purple-500 bg-purple-50 text-purple-700") : "border-gray-200 text-gray-600 hover:border-gray-300"}`}
                    >
                      {r === "Vendor" ? <Globe className="w-4 h-4" /> : <Headphones className="w-4 h-4" />}
                      {r}
                    </button>
                  ))}
                </div>
              </div>
              <div className="bg-blue-50 rounded-xl p-3 text-xs text-blue-700">
                <p className="font-semibold mb-1">After creation, the user will receive:</p>
                <ul className="space-y-0.5">
                  <li>📧 Email with a portal login link</li>
                  <li>🔐 A temporary password (expires 24h)</li>
                  <li>⚠️ Prompt to change password on first login</li>
                </ul>
              </div>
              <Button
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white gap-2"
                onClick={handleAdd}
                disabled={!form.name || !form.email}
              >
                <Send className="w-4 h-4" /> Create User & Send Email
              </Button>
            </div>
          ) : (
            <div className="text-center py-4">
              <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-7 h-7 text-emerald-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">User Created!</h3>
              <p className="text-gray-500 text-sm mb-4">
                An email has been sent to <strong>{form.email}</strong> with login instructions.
              </p>
              <div className="bg-gray-50 rounded-xl p-4 text-sm text-left space-y-2 mb-5">
                <div className="flex items-start gap-2"><Mail className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" /><span className="text-gray-600">Email includes link to <strong>Vendor Portal</strong> or instructions to visit the site and click <strong>Vendor Portal</strong></span></div>
                <div className="flex items-start gap-2"><Phone className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" /><span className="text-gray-600">Temporary password sent — user must change it on first login</span></div>
                <div className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" /><span className="text-gray-600">Role: <strong>{form.role}</strong> — portal features match this role</span></div>
              </div>
              <Button className="bg-emerald-500 hover:bg-emerald-600 text-white w-full" onClick={() => setShowAdd(false)}>Done</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}