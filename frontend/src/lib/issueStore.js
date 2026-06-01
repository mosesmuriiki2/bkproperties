// Shared issue store using localStorage — simulates cross-portal state
import { MODULE_CONFIG } from './moduleConfig';

const KEY = "mg_issues";
const CONFIG_KEY = "mg_module_config";

const defaultModuleConfig = {
  tours: true,
  hotels: true,
  cars_sale: true,
  cars_hire: true,
  land: true,
  properties_sale: true,
  properties_rent: true,
  tourist_vehicles: true,
};

const seed = [
  { id: "ISS-001", title: "Listing not showing on marketplace", vendor: "Bonfire Adventures", category: "Tours", description: "My Masai Mara Safari listing was approved but doesn't appear in search results.", status: "assigned", priority: "high", assignedTo: "Support Team", createdAt: "2026-03-20", updatedAt: "2026-03-22", comments: [{ author: "Admin", text: "Assigned to support for investigation.", time: "2026-03-21" }], auditLog: [{ action: "Submitted", by: "Bonfire Adventures", time: "2026-03-20" }, { action: "Assigned to Support", by: "Admin", time: "2026-03-21" }] },
  { id: "ISS-002", title: "Payment not reflected in dashboard", vendor: "Voyager Hotel", category: "Hotels", description: "Booking BK-4422 was paid but revenue hasn't updated in my vendor dashboard.", status: "pending", priority: "high", assignedTo: null, createdAt: "2026-03-22", updatedAt: "2026-03-22", comments: [], auditLog: [{ action: "Submitted", by: "Voyager Hotel", time: "2026-03-22" }] },
  { id: "ISS-003", title: "Wrong commission rate applied", vendor: "Optiven Limited", category: "Land", description: "Commission deducted was 20% instead of the agreed 15%.", status: "resolved", priority: "medium", assignedTo: "Support Team", createdAt: "2026-03-15", updatedAt: "2026-03-18", comments: [{ author: "Support", text: "Investigated — rate config was misconfigured. Fixed and refund processed.", time: "2026-03-18" }], auditLog: [{ action: "Submitted", by: "Optiven Limited", time: "2026-03-15" }, { action: "Assigned to Support", by: "Admin", time: "2026-03-16" }, { action: "Resolved", by: "Support", time: "2026-03-18" }] },
];

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) { save(seed); return seed; }
    return JSON.parse(raw);
  } catch { return seed; }
}

function save(issues) {
  localStorage.setItem(KEY, JSON.stringify(issues));
}

export function getIssues() { return load(); }

export function addIssue(issue) {
  const issues = load();
  const newIssue = {
    ...issue,
    id: `ISS-${String(issues.length + 1).padStart(3, "0")}`,
    status: "pending",
    assignedTo: null,
    createdAt: new Date().toISOString().split("T")[0],
    updatedAt: new Date().toISOString().split("T")[0],
    comments: [],
    auditLog: [{ action: "Submitted", by: issue.vendor, time: new Date().toISOString().split("T")[0] }],
  };
  issues.unshift(newIssue);
  save(issues);
  return newIssue;
}

export function updateIssue(id, updates) {
  const issues = load();
  const idx = issues.findIndex(i => i.id === id);
  if (idx === -1) return;
  const log = updates.logEntry ? [...(issues[idx].auditLog || []), updates.logEntry] : issues[idx].auditLog;
  issues[idx] = { ...issues[idx], ...updates, auditLog: log, updatedAt: new Date().toISOString().split("T")[0] };
  delete issues[idx].logEntry;
  save(issues);
  return issues[idx];
}

export function addComment(id, comment) {
  const issues = load();
  const idx = issues.findIndex(i => i.id === id);
  if (idx === -1) return;
  issues[idx].comments = [...(issues[idx].comments || []), comment];
  issues[idx].updatedAt = new Date().toISOString().split("T")[0];
  save(issues);
}

export function getModuleConfig() {
  try {
    const raw = localStorage.getItem(CONFIG_KEY);
    const adminConfig = raw ? { ...defaultModuleConfig, ...JSON.parse(raw) } : { ...defaultModuleConfig };
    // Code-level config takes precedence: if MODULE_CONFIG says false, force false
    const merged = { ...adminConfig };
    Object.keys(MODULE_CONFIG).forEach(key => {
      if (MODULE_CONFIG[key] === false) merged[key] = false;
    });
    return merged;
  } catch { return { ...defaultModuleConfig }; }
}

export function saveModuleConfig(config) {
  localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
}