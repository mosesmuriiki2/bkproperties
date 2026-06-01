import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  Shield, CheckCircle, Clock, XCircle, MessageSquare, Eye, Home,
  ChevronRight, AlertTriangle, Globe, Menu, X, Bell, LogOut, Headphones, Edit2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { getIssues, updateIssue, addComment } from "@/lib/issueStore";
import { toast } from "sonner";

const statusConfig = {
  pending: { label: "Pending", color: "bg-yellow-100 text-yellow-700", icon: Clock },
  assigned: { label: "In Review", color: "bg-blue-100 text-blue-700", icon: Eye },
  resolved: { label: "Resolved", color: "bg-green-100 text-green-700", icon: CheckCircle },
  rejected: { label: "Rejected", color: "bg-red-100 text-red-700", icon: XCircle },
};

const priorityColor = { high: "bg-red-100 text-red-700", medium: "bg-yellow-100 text-yellow-700", low: "bg-gray-100 text-gray-600" };

export default function SupportPortal() {
  const navigate = useNavigate();
  const [issues, setIssues] = useState([]);
  const [activeSection, setActiveSection] = useState("queue");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [analysisType, setAnalysisType] = useState("technical");
  const [portalName, setPortalName] = useState("BK Properties");
  const [editingLogo, setEditingLogo] = useState(false);
  const [logoInput, setLogoInput] = useState("");

  useEffect(() => {
    if (!sessionStorage.getItem("mg_support_auth")) {
      navigate("/SupportLogin");
    }
    setIssues(getIssues());
  }, [navigate]);

  const refresh = () => setIssues(getIssues());

  const myIssues = issues.filter(i => i.assignedTo === "Support Team");
  const displayed = (activeSection === "queue" ? myIssues : issues).filter(i => filterStatus === "all" || i.status === filterStatus);

  const handleResolve = (id) => {
    updateIssue(id, { status: "resolved", logEntry: { action: "Resolved by Support", by: "Support Team", time: new Date().toISOString().split("T")[0] } });
    refresh();
    if (selected?.id === id) setSelected({ ...selected, status: "resolved" });
    toast.success("Issue marked as resolved.");
  };

  const handleRequestChanges = (id) => {
    updateIssue(id, { status: "pending", assignedTo: null, logEntry: { action: "Returned to Admin for review", by: "Support Team", time: new Date().toISOString().split("T")[0] } });
    refresh();
    setSelected(null);
    toast.info("Issue returned to Admin for further review.");
  };

  const handleAddComment = (id) => {
    if (!commentText.trim()) return;
    addComment(id, { author: "Support", text: commentText, analysisType, time: new Date().toISOString().split("T")[0] });
    setCommentText("");
    refresh();
    const updated = getIssues().find(i => i.id === id);
    setSelected(updated);
    toast.success("Comment added.");
  };

  const navItems = [
    { id: "queue", label: "My Queue", icon: Headphones, count: myIssues.filter(i => i.status === "assigned").length },
    { id: "all", label: "All Issues", icon: Eye },
    { id: "resolved", label: "Resolved", icon: CheckCircle },
  ];

  const handleLogout = () => {
    sessionStorage.removeItem("mg_support_auth");
    navigate("/SupportLogin");
  };

  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden">
      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Sidebar — fixed, non-scrollable */}
      <aside className={`fixed lg:relative inset-y-0 left-0 z-50 ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"} w-60 bg-gray-900 flex flex-col transition-transform duration-300 h-screen flex-shrink-0`}>
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shrink-0"><Headphones className="w-4 h-4 text-white" /></div>
            <div className="flex-1 min-w-0">
              {editingLogo ? (
                <input
                  className="bg-white/10 text-white text-sm font-bold rounded px-2 py-0.5 w-full focus:outline-none focus:ring-1 focus:ring-blue-400"
                  value={logoInput}
                  onChange={e => setLogoInput(e.target.value)}
                  onBlur={() => { setPortalName(logoInput || portalName); setEditingLogo(false); }}
                  onKeyDown={e => { if (e.key === "Enter") { setPortalName(logoInput || portalName); setEditingLogo(false); } }}
                  autoFocus
                />
              ) : (
                <div className="flex items-center gap-1 group cursor-pointer" onClick={() => { setLogoInput(portalName); setEditingLogo(true); }}>
                  <p className="text-white font-bold text-sm truncate">{portalName}</p>
                  <Edit2 className="w-3 h-3 text-gray-500 group-hover:text-gray-300 shrink-0" />
                </div>
              )}
              <p className="text-blue-400 text-xs">Support Portal</p>
            </div>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-gray-400 shrink-0"><X className="w-5 h-5" /></button>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map(item => (
            <button key={item.id} onClick={() => { setActiveSection(item.id); setSidebarOpen(false); }} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors ${activeSection === item.id ? "bg-white/10 text-white" : "text-gray-400 hover:bg-white/5 hover:text-white"}`}>
              <item.icon className="w-4 h-4 shrink-0" />
              <span className="flex-1 text-left">{item.label}</span>
              {item.count > 0 && <span className="bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{item.count}</span>}
            </button>
          ))}
        </nav>
        <div className="p-3 border-t border-white/10 space-y-1 flex-shrink-0">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors">
            <LogOut className="w-4 h-4" /><span>Logout</span>
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-auto min-w-0">
        <div className="bg-white border-b px-4 lg:px-6 py-4 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="p-1.5 rounded-lg hover:bg-gray-100 lg:hidden"><Menu className="w-5 h-5 text-gray-600" /></button>
            <h1 className="font-bold text-gray-900">{navItems.find(n => n.id === activeSection)?.label || "Support Portal"}</h1>
          </div>
          <Badge className="bg-blue-100 text-blue-700 border-blue-200">Support Staff</Badge>
        </div>

        <div className="flex-1 p-4 lg:p-6">
          {/* Stats row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            {[
              { label: "Assigned to Me", value: myIssues.filter(i => i.status === "assigned").length, color: "text-blue-600", bg: "bg-blue-50" },
              { label: "Resolved This Week", value: issues.filter(i => i.status === "resolved").length, color: "text-green-600", bg: "bg-green-50" },
              { label: "High Priority", value: issues.filter(i => i.priority === "high" && i.status !== "resolved").length, color: "text-red-600", bg: "bg-red-50" },
              { label: "Pending Admin", value: issues.filter(i => i.status === "pending").length, color: "text-yellow-600", bg: "bg-yellow-50" },
            ].map(s => (
              <Card key={s.label}><CardContent className="p-4">
                <p className={`text-2xl font-extrabold ${s.color}`}>{s.value}</p>
                <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
              </CardContent></Card>
            ))}
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2 mb-4">
            {["all", "assigned", "resolved", "rejected"].map(s => (
              <button key={s} onClick={() => setFilterStatus(s)} className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize transition-colors ${filterStatus === s ? "bg-blue-600 text-white" : "bg-white border text-gray-600 hover:border-blue-400"}`}>
                {s === "all" ? "All" : s === "assigned" ? "In Review" : s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>

          {/* Issue list */}
          {displayed.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <CheckCircle className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="font-semibold">No issues in this queue</p>
            </div>
          ) : (
            <div className="space-y-3">
              {displayed.map(issue => {
                const s = statusConfig[issue.status] || statusConfig.pending;
                const SIcon = s.icon;
                return (
                  <div key={issue.id} className="bg-white rounded-2xl border p-4 hover:shadow-md transition-shadow cursor-pointer" onClick={() => setSelected(issue)}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="font-mono text-xs text-gray-400">{issue.id}</span>
                          <Badge className={`text-xs border-0 ${s.color}`}><SIcon className="w-3 h-3 mr-1 inline" />{s.label}</Badge>
                          <Badge className={`text-xs border-0 ${priorityColor[issue.priority] || "bg-gray-100 text-gray-600"}`}>{issue.priority}</Badge>
                        </div>
                        <p className="font-semibold text-gray-900">{issue.title}</p>
                        <p className="text-sm text-gray-500 mt-0.5">{issue.vendor} • {issue.category}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-xs text-gray-400">{issue.updatedAt}</p>
                        {issue.comments?.length > 0 && <p className="text-xs text-blue-500 mt-1">{issue.comments.length} comment{issue.comments.length > 1 ? "s" : ""}</p>}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Issue Detail Drawer */}
      <Dialog open={!!selected} onOpenChange={() => { setSelected(null); setCommentText(""); }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selected && (() => {
            const fresh = getIssues().find(i => i.id === selected.id) || selected;
            const s = statusConfig[fresh.status] || statusConfig.pending;
            return (
              <>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-sm text-gray-400">{fresh.id}</span>
                    <span>{fresh.title}</span>
                  </DialogTitle>
                </DialogHeader>
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge className={`text-xs border-0 ${s.color}`}>{s.label}</Badge>
                  <Badge className={`text-xs border-0 ${priorityColor[fresh.priority]}`}>{fresh.priority} priority</Badge>
                  <Badge className="text-xs bg-gray-100 text-gray-600 border-0">{fresh.category}</Badge>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 mb-4">
                  <p className="text-xs text-gray-400 mb-1">Vendor Description</p>
                  <p className="text-sm text-gray-700">{fresh.description}</p>
                </div>

                {/* Audit Log */}
                {fresh.auditLog?.length > 0 && (
                  <div className="mb-4">
                    <p className="font-semibold text-sm text-gray-700 mb-2">Audit Trail</p>
                    <div className="space-y-2">
                      {fresh.auditLog.map((log, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs text-gray-500">
                          <div className="w-2 h-2 rounded-full bg-blue-400 shrink-0" />
                          <span className="font-medium text-gray-700">{log.action}</span>
                          <span>by {log.by}</span>
                          <span className="ml-auto">{log.time}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Comments */}
                {fresh.comments?.length > 0 && (
                  <div className="mb-4">
                    <p className="font-semibold text-sm text-gray-700 mb-2">Comments & Analysis</p>
                    <div className="space-y-2">
                      {fresh.comments.map((c, i) => (
                        <div key={i} className={`rounded-xl p-3 text-sm ${c.author === "Support" ? "bg-blue-50 border border-blue-100" : "bg-gray-50 border border-gray-100"}`}>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-xs">{c.author}</span>
                            {c.analysisType && <Badge className="text-xs bg-purple-100 text-purple-700 border-0">{c.analysisType}</Badge>}
                            <span className="text-xs text-gray-400 ml-auto">{c.time}</span>
                          </div>
                          <p className="text-gray-700">{c.text}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Add comment */}
                {fresh.status === "assigned" && (
                  <div className="mb-4">
                    <p className="font-semibold text-sm text-gray-700 mb-2">Add Analysis / Response</p>
                    <div className="flex gap-2 mb-2">
                      {["technical", "finance", "general"].map(t => (
                        <button key={t} onClick={() => setAnalysisType(t)} className={`px-3 py-1 rounded-full text-xs font-medium capitalize transition-colors ${analysisType === t ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-blue-50"}`}>{t}</button>
                      ))}
                    </div>
                    <textarea
                      className="w-full border rounded-xl p-3 text-sm resize-none h-20 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Write your analysis or response..."
                      value={commentText}
                      onChange={e => setCommentText(e.target.value)}
                    />
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white mt-2" onClick={() => handleAddComment(fresh.id)}>
                      Submit Comment
                    </Button>
                  </div>
                )}

                {/* Actions */}
                {fresh.status === "assigned" && (
                  <div className="flex gap-2 pt-4 border-t">
                    <Button className="flex-1 bg-green-500 hover:bg-green-600 text-white" onClick={() => handleResolve(fresh.id)}>
                      <CheckCircle className="w-4 h-4 mr-2" /> Mark Resolved
                    </Button>
                    <Button variant="outline" className="flex-1 border-yellow-300 text-yellow-600 hover:bg-yellow-50" onClick={() => handleRequestChanges(fresh.id)}>
                      Return to Admin
                    </Button>
                  </div>
                )}
              </>
            );
          })()}
        </DialogContent>
      </Dialog>
    </div>
  );
}