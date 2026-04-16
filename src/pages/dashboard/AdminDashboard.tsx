import { useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  RiGroupLine, RiShoppingBagLine, RiMoneyDollarCircleLine,
  RiCheckboxCircleLine, RiCloseCircleLine, RiEditLine, RiDeleteBinLine,
  RiAddLine, RiArrowLeftSLine, RiArrowRightSLine,
  RiAlertLine, RiMegaphoneLine, RiLeafLine, RiSendPlaneLine,
  RiUserLine, RiDownloadLine, RiAddLine as RiAddNewLine,
} from "react-icons/ri";
import { useNotifications } from "@/hooks/useNotifications";
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell,
} from "recharts";
import DashboardSidebar from "@/components/features/DashboardSidebar";
import Modal from "@/components/ui/Modal";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { ORDERS, FARMERS, PRODUCTS } from "@/lib/mockData";
import { toast } from "sonner";
import type { Farmer } from "@/types";

const DEMO_USERS = [
  { id: "u1", name: "Alex Johnson",  email: "customer@test.com", role: "Customer", status: "Active",   joined: "Jan 15, 2024" },
  { id: "u2", name: "Lisa Park",     email: "lisa@example.com",  role: "Customer", status: "Active",   joined: "Feb 3, 2024"  },
  { id: "u3", name: "Robert Green",  email: "farmer@test.com",   role: "Farmer",   status: "Active",   joined: "Aug 20, 2023" },
  { id: "u4", name: "Mike Rider",    email: "delivery@test.com", role: "Delivery", status: "Active",   joined: "Mar 10, 2024" },
  { id: "u5", name: "Tom Rivera",    email: "tom@example.com",   role: "Customer", status: "Inactive", joined: "Dec 1, 2023"  },
];

// ─── Mock chart data ──────────────────────────────────────────────────────────
const MONTHLY_REVENUE = [
  { month: "Oct", revenue: 14200, orders: 72 },
  { month: "Nov", revenue: 17800, orders: 91 },
  { month: "Dec", revenue: 22100, orders: 118 },
  { month: "Jan", revenue: 18600, orders: 95 },
  { month: "Feb", revenue: 19400, orders: 103 },
  { month: "Mar", revenue: 21300, orders: 114 },
  { month: "Apr", revenue: 24800, orders: 132 },
];

const MONTHLY_USERS = [
  { month: "Oct", customers: 82, farmers: 8 },
  { month: "Nov", customers: 101, farmers: 11 },
  { month: "Dec", customers: 138, farmers: 14 },
  { month: "Jan", customers: 119, farmers: 16 },
  { month: "Feb", customers: 144, farmers: 19 },
  { month: "Mar", customers: 163, farmers: 22 },
  { month: "Apr", customers: 198, farmers: 27 },
];

const CATEGORY_DATA = [
  { name: "Vegetables",  value: 42, revenue: 10416, color: "#16a34a" },
  { name: "Fruits",      value: 28, revenue: 6944,  color: "#f59e0b" },
  { name: "Dairy & Eggs", value: 18, revenue: 4464, color: "#3b82f6" },
  { name: "Leafy Greens", value: 12, revenue: 2976, color: "#22c55e" },
];

const CHART_COLORS = { primary: "#16a34a", secondary: "#f59e0b", accent: "#3b82f6", muted: "#e5e7eb" };

// ─── Overview ─────────────────────────────────────────────────────────────────
const LOW_STOCK_PRODUCTS = PRODUCTS.filter((p) => p.stock < 20);

function Overview() {
  const stats = [
    { label: "Total Users",    value: "1,284",                              icon: RiGroupLine,             color: "bg-blue-50 text-blue-600",   trend: "+12%" },
    { label: "Total Orders",   value: ORDERS.length,                        icon: RiShoppingBagLine,       color: "bg-green-50 text-green-600", trend: "+8%"  },
    { label: "Revenue (Apr)",  value: "$24,800",                            icon: RiMoneyDollarCircleLine, color: "bg-yellow-50 text-yellow-600", trend: "+22%" },
    { label: "Total Products", value: PRODUCTS.length,                      icon: RiLeafLine,              color: "bg-purple-50 text-purple-600", trend: "+5%"  },
  ];
  return (
    <div>
      <h1 className="font-serif text-3xl font-bold mb-2">Admin Overview</h1>
      <p className="text-muted-foreground mb-8">Platform-wide metrics and controls.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              className="bg-card rounded-2xl p-5 shadow-card">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${stat.color}`}><Icon className="text-xl" /></div>
              <div className="text-2xl font-bold font-serif">{stat.value}</div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-sm">{stat.label}</span>
                <span className="text-xs text-green-600 font-medium">{stat.trend}</span>
              </div>
            </motion.div>
          );
        })}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-card rounded-2xl p-6 shadow-card">
          <h2 className="font-semibold mb-4">Recent Orders</h2>
          <div className="space-y-2">
            {ORDERS.map((order) => (
              <div key={order.id} className="flex items-center justify-between text-sm p-2 rounded-xl hover:bg-muted/40 transition-colors">
                <div><p className="font-medium">{order.id}</p><p className="text-xs text-muted-foreground">{order.customerName}</p></div>
                <div className="text-right"><p className="font-bold text-primary">${order.total.toFixed(2)}</p><p className="text-xs text-muted-foreground capitalize">{order.status}</p></div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-card rounded-2xl p-6 shadow-card">
          <h2 className="font-semibold mb-4">Revenue by Category</h2>
          <div className="space-y-3">
            {CATEGORY_DATA.map(({ name, value, revenue }) => (
              <div key={name}>
                <div className="flex justify-between text-sm mb-1"><span>{name}</span><span className="font-medium">${revenue.toLocaleString()}</span></div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${value}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Low Stock Alerts */}
      <div className="bg-card rounded-2xl p-6 shadow-card">
        <div className="flex items-center gap-2 mb-5">
          <div className="w-8 h-8 rounded-xl bg-orange-100 flex items-center justify-center">
            <RiAlertLine className="text-orange-500 text-base" />
          </div>
          <div>
            <h2 className="font-semibold">Low Stock Alerts</h2>
            <p className="text-xs text-muted-foreground">Products with fewer than 20 units remaining</p>
          </div>
          {LOW_STOCK_PRODUCTS.length > 0 && (
            <span className="ml-auto px-2.5 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-600">
              {LOW_STOCK_PRODUCTS.length} alerts
            </span>
          )}
        </div>
        {LOW_STOCK_PRODUCTS.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground text-sm">
            <RiCheckboxCircleLine className="text-3xl text-green-400 mx-auto mb-2" />
            All products are well-stocked!
          </div>
        ) : (
          <div className="space-y-3">
            {LOW_STOCK_PRODUCTS.map((p) => {
              const farmer = FARMERS.find((f) => f.id === p.farmerId);
              return (
                <LowStockRow key={p.id} product={p} farmer={farmer} />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function LowStockRow({ product, farmer }: { product: typeof PRODUCTS[0]; farmer?: typeof FARMERS[0] }) {
  const [notified, setNotified] = useState(false);
  const handleNotify = () => {
    setNotified(true);
    toast.success(`Notification sent to ${farmer?.name ?? "farmer"} for restocking "${product.name}"!`, { duration: 4000 });
  };
  return (
    <div className="flex items-center gap-4 p-3.5 rounded-xl bg-orange-50 border border-orange-200">
      <img src={product.image} alt={product.name} className="w-10 h-10 rounded-xl object-cover shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm truncate">{product.name}</p>
        <p className="text-xs text-muted-foreground">
          Farmer: <span className="font-medium text-foreground">{farmer?.name ?? "Unknown"}</span>
          {" · "}{farmer?.farm}
        </p>
      </div>
      <div className="text-center shrink-0">
        <p className={`text-lg font-bold ${product.stock === 0 ? "text-red-600" : "text-orange-500"}`}>{product.stock}</p>
        <p className="text-xs text-muted-foreground">{product.unit}s left</p>
      </div>
      <button
        onClick={handleNotify}
        disabled={notified}
        className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 ${
          notified ? "bg-green-100 text-green-700 cursor-default" : "bg-orange-500 text-white hover:bg-orange-600"
        }`}
      >
        {notified ? <><RiCheckboxCircleLine /> Notified</> : <><RiMegaphoneLine /> Notify Farmer</>}
      </button>
    </div>
  );
}

// ─── ManageUsers ──────────────────────────────────────────────────────────────
const PAGE_SIZE = 3;

function ManageUsers() {
  const [users, setUsers] = useState(DEMO_USERS);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editUser, setEditUser] = useState<typeof DEMO_USERS[0] | null>(null);
  const [page, setPage] = useState(1);
  const [showAddUser, setShowAddUser] = useState(false);
  const [addForm, setAddForm] = useState({ name: "", email: "", role: "Customer", status: "Active" });

  const totalPages = Math.ceil(users.length / PAGE_SIZE);
  const paginated  = users.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleAddUser = () => {
    if (!addForm.name || !addForm.email) { toast.error("Name and email are required."); return; }
    const newUser = { id: `u${Date.now()}`, name: addForm.name, email: addForm.email, role: addForm.role, status: addForm.status, joined: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) };
    setUsers((prev) => [...prev, newUser]);
    setAddForm({ name: "", email: "", role: "Customer", status: "Active" });
    setShowAddUser(false);
    toast.success(`User "${addForm.name}" added!`);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h1 className="font-serif text-3xl font-bold">Manage Users</h1>
        <button onClick={() => setShowAddUser(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-primary/90 transition-all shadow-sm">
          <RiAddLine /> Add User
        </button>
      </div>
      <div className="bg-card rounded-2xl shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                {["Name", "Email", "Role", "Status", "Joined", "Actions"].map((h) => (
                  <th key={h} className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {paginated.map((user) => (
                <tr key={user.id} className="hover:bg-muted/20 transition-colors">
                  <td className="py-3 px-4 font-medium text-sm">{user.name}</td>
                  <td className="py-3 px-4 text-sm text-muted-foreground">{user.email}</td>
                  <td className="py-3 px-4"><span className="px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">{user.role}</span></td>
                  <td className="py-3 px-4"><span className={`px-2.5 py-1 rounded-full text-xs font-medium ${user.status === "Active" ? "bg-green-100 text-green-700" : "bg-muted text-muted-foreground"}`}>{user.status}</span></td>
                  <td className="py-3 px-4 text-sm text-muted-foreground">{user.joined}</td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <button onClick={() => setEditUser(user)} className="w-8 h-8 rounded-lg border border-border flex items-center justify-center hover:bg-muted transition-colors"><RiEditLine className="text-sm" /></button>
                      <button onClick={() => setDeleteId(user.id)} className="w-8 h-8 rounded-lg border border-destructive/30 flex items-center justify-center hover:bg-destructive/10 text-destructive transition-colors"><RiDeleteBinLine className="text-sm" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between px-4 py-3 border-t border-border">
          <p className="text-xs text-muted-foreground">Showing {Math.min((page - 1) * PAGE_SIZE + 1, users.length)}–{Math.min(page * PAGE_SIZE, users.length)} of {users.length} users</p>
          <div className="flex items-center gap-1">
            <button disabled={page === 1} onClick={() => setPage((p) => p - 1)}
              className="w-8 h-8 rounded-lg border border-border flex items-center justify-center hover:bg-muted transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
              <RiArrowLeftSLine />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button key={p} onClick={() => setPage(p)}
                className={`w-8 h-8 rounded-lg text-xs font-semibold transition-all ${p === page ? "bg-primary text-white" : "border border-border hover:bg-muted"}`}>{p}</button>
            ))}
            <button disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}
              className="w-8 h-8 rounded-lg border border-border flex items-center justify-center hover:bg-muted transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
              <RiArrowRightSLine />
            </button>
          </div>
        </div>
      </div>

      <Modal isOpen={showAddUser} onClose={() => setShowAddUser(false)} title="Add New User">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Full Name <span className="text-destructive">*</span></label>
            <input value={addForm.name} onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
              placeholder="e.g. Jane Smith" className="w-full px-4 py-3 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm" />
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Email Address <span className="text-destructive">*</span></label>
            <input type="email" value={addForm.email} onChange={(e) => setAddForm({ ...addForm, email: e.target.value })}
              placeholder="jane@example.com" className="w-full px-4 py-3 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Role</label>
              <select value={addForm.role} onChange={(e) => setAddForm({ ...addForm, role: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm">
                {["Customer", "Farmer", "Delivery", "Admin"].map((r) => <option key={r}>{r}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Status</label>
              <select value={addForm.status} onChange={(e) => setAddForm({ ...addForm, status: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm">
                <option>Active</option><option>Inactive</option>
              </select>
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={handleAddUser}
              className="flex-1 py-3 rounded-xl bg-primary text-white font-semibold hover:bg-primary/90 transition-all flex items-center justify-center gap-2">
              <RiAddLine /> Add User
            </button>
            <button onClick={() => setShowAddUser(false)}
              className="flex-1 py-3 rounded-xl border border-border font-semibold hover:bg-muted transition-colors text-sm">Cancel</button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={!!editUser} onClose={() => setEditUser(null)} title="Edit User">
        <div className="space-y-4">
          <div><label className="text-sm font-medium mb-2 block">Name</label>
            <input defaultValue={editUser?.name} className="w-full px-4 py-3 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm" /></div>
          <div><label className="text-sm font-medium mb-2 block">Status</label>
            <select defaultValue={editUser?.status} className="w-full px-4 py-3 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm">
              <option>Active</option><option>Inactive</option>
            </select></div>
          <button onClick={() => { setEditUser(null); toast.success("User updated."); }} className="w-full py-3 rounded-xl bg-primary text-white font-semibold hover:bg-primary/90 transition-all">Save</button>
        </div>
      </Modal>
      <ConfirmDialog isOpen={!!deleteId} onCancel={() => setDeleteId(null)}
        onConfirm={() => { setUsers((u) => u.filter((usr) => usr.id !== deleteId)); setDeleteId(null); toast.success("User removed."); }}
        title="Remove User?" message="This will permanently delete the user account." confirmText="Delete" />
    </div>
  );
}

// ─── ApproveFarmers ───────────────────────────────────────────────────────────
function ApproveFarmers() {
  const [farmers, setFarmers] = useState<Farmer[]>(FARMERS);
  const [viewFarmer, setViewFarmer] = useState<Farmer | null>(null);
  const approve = (id: string) => { setFarmers((f) => f.map((fm) => fm.id === id ? { ...fm, approved: true } : fm)); toast.success("Farmer approved!"); };
  const reject  = (id: string) => { setFarmers((f) => f.filter((fm) => fm.id !== id)); toast.success("Farmer rejected."); };
  const farmerProducts = (farmerId: string) => PRODUCTS.filter((p) => p.farmerId === farmerId).length;
  return (
    <div>
      <h1 className="font-serif text-3xl font-bold mb-6">Approve Farmers</h1>
      <div className="space-y-4">
        {farmers.map((farmer) => (
          <div key={farmer.id} className="bg-card rounded-2xl p-5 shadow-card flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <img src={farmer.image} alt={farmer.name} className="w-12 h-12 rounded-full object-cover" />
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="font-semibold">{farmer.name}</p>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${farmer.approved ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                  {farmer.approved ? "Approved" : "Pending"}
                </span>
              </div>
              <p className="text-muted-foreground text-sm">{farmer.farm} · {farmer.location}</p>
              <p className="text-xs text-muted-foreground">{farmer.products} products · Joined {farmer.joinedAt}</p>
            </div>
            <div className="flex gap-2 flex-wrap">
              <button onClick={() => setViewFarmer(farmer)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-border text-sm font-medium hover:bg-muted transition-colors">
                <RiUserLine /> View Profile
              </button>
              {!farmer.approved && (
                <>
                  <button onClick={() => approve(farmer.id)} className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-green-600 text-white text-sm font-medium hover:bg-green-700 transition-colors">
                    <RiCheckboxCircleLine /> Approve
                  </button>
                  <button onClick={() => reject(farmer.id)} className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-destructive/40 text-destructive text-sm font-medium hover:bg-destructive/10 transition-colors">
                    <RiCloseCircleLine /> Reject
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Farmer Profile Modal */}
      <Modal isOpen={!!viewFarmer} onClose={() => setViewFarmer(null)} title="Farmer Profile">
        {viewFarmer && (
          <div className="space-y-5">
            {/* Header */}
            <div className="flex items-center gap-4 pb-5 border-b border-border">
              <img src={viewFarmer.image} alt={viewFarmer.name} className="w-16 h-16 rounded-2xl object-cover border-2 border-primary/20 shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-0.5">
                  <h3 className="font-bold text-lg">{viewFarmer.name}</h3>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${viewFarmer.approved ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                    {viewFarmer.approved ? "Approved" : "Pending Approval"}
                  </span>
                </div>
                <p className="text-primary font-medium text-sm">{viewFarmer.farm}</p>
                <p className="text-muted-foreground text-sm">{viewFarmer.location}</p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
              {[
                ["Products", farmerProducts(viewFarmer.id) || viewFarmer.products],
                ["Rating", "4.8 ★"],
                ["Years on Platform", "3+"],
              ].map(([label, val]) => (
                <div key={label} className="bg-muted/40 rounded-xl p-3 text-center">
                  <p className="font-bold text-lg text-primary">{val}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
                </div>
              ))}
            </div>

            {/* Details */}
            <div className="space-y-3">
              {[
                ["Email", viewFarmer.email],
                ["Location", viewFarmer.location],
                ["Member Since", viewFarmer.joinedAt],
              ].map(([label, val]) => (
                <div key={label} className="flex justify-between text-sm py-2 border-b border-border/60 last:border-0">
                  <span className="text-muted-foreground">{label}</span>
                  <span className="font-medium text-right">{val}</span>
                </div>
              ))}
            </div>

            {/* Story */}
            <div className="bg-muted/30 rounded-xl p-4">
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2 font-medium">Farm Story</p>
              <p className="text-sm text-muted-foreground leading-relaxed">{viewFarmer.story}</p>
            </div>

            {/* Certifications */}
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3 font-medium">Certification Status</p>
              <div className="space-y-2">
                {[["USDA Organic", viewFarmer.approved], ["Non-GMO Project", viewFarmer.approved], ["Platform Verified", viewFarmer.approved]].map(([cert, verified]) => (
                  <div key={cert as string} className="flex items-center justify-between p-2.5 rounded-xl bg-muted/30">
                    <span className="text-sm font-medium">{cert as string}</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${verified ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                      {verified ? "Verified" : "Pending"}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <Link to={`/farmer/${viewFarmer.id}`} target="_blank"
                onClick={() => setViewFarmer(null)}
                className="flex-1 py-3 rounded-xl bg-primary text-white font-semibold text-sm text-center hover:bg-primary/90 transition-all flex items-center justify-center gap-2">
                View Public Profile →
              </Link>
              <button onClick={() => setViewFarmer(null)}
                className="flex-1 py-3 rounded-xl border border-border font-semibold text-sm hover:bg-muted transition-colors">
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

// ─── Analytics (Recharts) ─────────────────────────────────────────────────────
function Analytics() {
  return (
    <div>
      <h1 className="font-serif text-3xl font-bold mb-2">Analytics</h1>
      <p className="text-muted-foreground mb-8">Platform growth metrics and revenue breakdown.</p>

      {/* Top KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          ["Total Revenue",    "$124,800", "+22%", "text-green-600"],
          ["Avg Order Value",  "$18.40",   "+5%",  "text-green-600"],
          ["Farmer Payouts",   "$99,840",  "80%",  "text-primary"  ],
          ["Platform Fee",     "$24,960",  "20%",  "text-orange-500"],
        ].map(([label, val, sub, color]) => (
          <div key={label} className="bg-card rounded-2xl p-4 shadow-card">
            <p className="text-xs text-muted-foreground mb-1">{label}</p>
            <p className="text-2xl font-bold font-serif">{val}</p>
            <p className={`text-xs font-semibold mt-0.5 ${color}`}>{sub}</p>
          </div>
        ))}
      </div>

      {/* Monthly Revenue Bar Chart */}
      <div className="bg-card rounded-2xl p-6 shadow-card mb-6">
        <h2 className="font-semibold mb-1">Monthly Revenue</h2>
        <p className="text-muted-foreground text-xs mb-5">Oct 2025 – Apr 2026</p>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={MONTHLY_REVENUE} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.muted} vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} width={44} />
            <Tooltip
              formatter={(value: number, name: string) => [
                name === "revenue" ? `$${value.toLocaleString()}` : value,
                name === "revenue" ? "Revenue" : "Orders",
              ]}
              contentStyle={{ borderRadius: 12, border: "1px solid #e5e7eb", fontSize: 12 }}
            />
            <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12, paddingTop: 12 }} />
            <Bar dataKey="revenue" fill={CHART_COLORS.primary} radius={[6, 6, 0, 0]} name="Revenue" />
            <Bar dataKey="orders" fill={CHART_COLORS.secondary} radius={[6, 6, 0, 0]} name="Orders" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* New Users Line Chart */}
      <div className="bg-card rounded-2xl p-6 shadow-card mb-6">
        <h2 className="font-semibold mb-1">New Users Per Month</h2>
        <p className="text-muted-foreground text-xs mb-5">Customers vs Farmers</p>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={MONTHLY_USERS} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.muted} vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} width={32} />
            <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e5e7eb", fontSize: 12 }} />
            <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12, paddingTop: 12 }} />
            <Line type="monotone" dataKey="customers" stroke={CHART_COLORS.primary}   strokeWidth={2.5} dot={{ r: 4, fill: CHART_COLORS.primary }}   name="Customers" />
            <Line type="monotone" dataKey="farmers"   stroke={CHART_COLORS.secondary} strokeWidth={2.5} dot={{ r: 4, fill: CHART_COLORS.secondary }} name="Farmers"   />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Category Pie + Table */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-2xl p-6 shadow-card">
          <h2 className="font-semibold mb-1">Sales by Category</h2>
          <p className="text-muted-foreground text-xs mb-4">% of total revenue</p>
          <div className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={CATEGORY_DATA} cx="50%" cy="50%" innerRadius={50} outerRadius={85}
                  paddingAngle={3} dataKey="value"
                  label={({ name, value }) => `${name} ${value}%`}
                  labelLine={false}
                >
                  {CATEGORY_DATA.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(v: number) => [`${v}%`, "Share"]} contentStyle={{ borderRadius: 12, border: "1px solid #e5e7eb", fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-card rounded-2xl p-6 shadow-card">
          <h2 className="font-semibold mb-4">Top-Selling Categories</h2>
          <div className="space-y-4">
            {CATEGORY_DATA.map(({ name, value, revenue, color }) => (
              <div key={name}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: color }} />
                    {name}
                  </span>
                  <span className="font-semibold">${revenue.toLocaleString()}</span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <motion.div className="h-full rounded-full" style={{ backgroundColor: color }}
                    initial={{ width: 0 }} animate={{ width: `${value}%` }} transition={{ duration: 0.8, delay: 0.1 }} />
                </div>
                <p className="text-xs text-muted-foreground mt-1">{value}% of revenue</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Send Announcement ────────────────────────────────────────────────────────
const ROLE_TARGETS = ["All Users", "Customers", "Farmers", "Delivery Partners"];

function SendAnnouncement() {
  const { pushNotification } = useNotifications();
  const [form, setForm] = useState({ message: "", target: "All Users", title: "" });
  const [sent, setSent] = useState<{ title: string; target: string; time: string }[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.message.trim()) {
      toast.error("Please fill in the title and message.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      pushNotification({
        type: "order",
        title: `📢 ${form.title}`,
        message: form.message,
        time: "Just now",
      });
      setSent((prev) => [{ title: form.title, target: form.target, time: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }) }, ...prev]);
      toast.success(`Announcement sent to ${form.target}!`);
      setForm({ message: "", target: "All Users", title: "" });
      setLoading(false);
    }, 600);
  };

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <RiMegaphoneLine className="text-primary text-xl" />
        </div>
        <div>
          <h1 className="font-serif text-3xl font-bold">Send Announcement</h1>
          <p className="text-muted-foreground text-sm">Push a notification to the Navbar bell and Notifications tab of all active users.</p>
        </div>
      </div>

      <div className="bg-card rounded-2xl shadow-card p-6 mb-6">
        <form onSubmit={handleSend} className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Target Audience</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {ROLE_TARGETS.map((role) => (
                <button key={role} type="button" onClick={() => setForm({ ...form, target: role })}
                  className={`py-2.5 px-3 rounded-xl border-2 text-sm font-medium transition-all ${
                    form.target === role ? "border-primary bg-primary/5 text-primary" : "border-border hover:border-primary/40"
                  }`}>
                  {role}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Announcement Title <span className="text-destructive">*</span></label>
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="e.g., Platform Maintenance Notice"
              className="w-full px-4 py-3 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm" />
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Message <span className="text-destructive">*</span></label>
            <textarea rows={4} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
              placeholder="Write your announcement message here..."
              className="w-full px-4 py-3 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm resize-none" />
            <p className="text-xs text-muted-foreground mt-1">{form.message.length} / 200 characters</p>
          </div>
          <button type="submit" disabled={loading}
            className="w-full py-3.5 rounded-xl bg-primary text-white font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-all disabled:opacity-60 text-sm">
            <RiSendPlaneLine /> {loading ? "Sending..." : `Send to ${form.target}`}
          </button>
        </form>
      </div>

      {sent.length > 0 && (
        <div className="bg-card rounded-2xl shadow-card p-6">
          <h2 className="font-semibold mb-4 flex items-center gap-2">
            <RiCheckboxCircleLine className="text-green-500" /> Sent Announcements
          </h2>
          <div className="space-y-3">
            {sent.map((s, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-muted/30">
                <div className="w-8 h-8 rounded-xl bg-green-100 flex items-center justify-center shrink-0">
                  <RiMegaphoneLine className="text-green-600 text-sm" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">{s.title}</p>
                  <p className="text-xs text-muted-foreground">Sent to {s.target}</p>
                </div>
                <span className="text-xs text-muted-foreground shrink-0">{s.time}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Product Management ───────────────────────────────────────────────────────
const EMPTY_ADD_FORM = { name: "", category: "Vegetables", price: "", farmerId: "", stock: "", unit: "lb", organic: false };

function exportProductsCSV(products: typeof PRODUCTS) {
  const headers = ["Name", "Category", "Farmer", "Price", "Unit", "Stock", "Organic", "Status"];
  const rows = products.map((p) => {
    const farmer = FARMERS.find((f) => f.id === p.farmerId);
    const status = p.stock > 20 ? "In Stock" : p.stock > 0 ? "Low Stock" : "Out of Stock";
    return [
      `"${p.name}"`,
      `"${p.category}"`,
      `"${farmer?.name ?? "Unknown"}"`,
      `$${p.price.toFixed(2)}`,
      p.unit,
      p.stock,
      p.organic ? "Yes" : "No",
      `"${status}"`,
    ].join(",");
  });
  const csv = [headers.join(","), ...rows].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url  = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `fromthefields_products_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  toast.success(`Exported ${products.length} products to CSV!`);
}

function ProductManagement() {
  const [products, setProducts] = useState(PRODUCTS);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState(EMPTY_ADD_FORM);
  const PAGE_SIZE = 10;

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleRemove = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    toast.success("Product removed.");
  };

  const handleAddProduct = () => {
    if (!addForm.name.trim() || !addForm.price || !addForm.stock || !addForm.farmerId) {
      toast.error("Please fill in all required fields.");
      return;
    }
    const farmer = FARMERS.find((f) => f.id === addForm.farmerId);
    const newProduct = {
      id: `prod-admin-${Date.now()}`,
      name: addForm.name.trim(),
      category: addForm.category,
      price: parseFloat(addForm.price),
      unit: addForm.unit,
      stock: parseInt(addForm.stock),
      organic: addForm.organic,
      farmerId: addForm.farmerId,
      farmer: farmer?.name ?? "",
      image: `https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&q=80`,
      rating: 0,
      reviews: 0,
      freshness: "fresh" as const,
      description: "",
      harvestDate: new Date().toISOString(),
      discount: undefined,
    };
    setProducts((prev) => [newProduct as any, ...prev]);
    setAddForm(EMPTY_ADD_FORM);
    setShowAddModal(false);
    toast.success(`Product "${newProduct.name}" added successfully!`);
    setPage(1);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="font-serif text-3xl font-bold">Product Management</h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            Total: <span className="font-semibold text-foreground">{products.length} products</span> across {[...new Set(products.map(p => p.category))].length} categories
          </p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search products..."
            className="px-4 py-2.5 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 w-48" />
          <button onClick={() => exportProductsCSV(filtered)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-border text-sm font-medium hover:bg-muted transition-colors">
            <RiDownloadLine /> Export CSV
          </button>
          <button onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-all">
            <RiAddLine /> Add Product
          </button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Products",  value: products.length,                          color: "text-primary"   },
          { label: "Organic",          value: products.filter(p => p.organic).length,  color: "text-green-600" },
          { label: "Low Stock (<20)",  value: products.filter(p => p.stock < 20).length, color: "text-orange-500" },
          { label: "Categories",       value: [...new Set(products.map(p => p.category))].length, color: "text-blue-500" },
        ].map((s) => (
          <div key={s.label} className="bg-card rounded-2xl p-4 shadow-card">
            <p className={`text-2xl font-bold font-serif ${s.color}`}>{s.value}</p>
            <p className="text-muted-foreground text-xs mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-card rounded-2xl shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                {["Product", "Category", "Farmer", "Price", "Stock", "Status", "Action"].map((h) => (
                  <th key={h} className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {paginated.map((p) => {
                const farmer = FARMERS.find((f) => f.id === p.farmerId);
                return (
                  <tr key={p.id} className="hover:bg-muted/20 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img src={p.image} alt={p.name} className="w-9 h-9 rounded-xl object-cover shrink-0" />
                        <div>
                          <p className="font-medium text-sm">{p.name}</p>
                          {p.organic && <span className="text-xs text-green-600 font-medium">Organic</span>}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-muted-foreground">{p.category}</td>
                    <td className="py-3 px-4 text-sm">{farmer?.name ?? "—"}</td>
                    <td className="py-3 px-4 text-sm font-semibold text-primary">${p.price.toFixed(2)}/{p.unit}</td>
                    <td className="py-3 px-4">
                      <span className={`font-semibold text-sm ${p.stock < 20 ? "text-orange-500" : "text-foreground"}`}>{p.stock}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        p.stock > 20 ? "bg-green-100 text-green-700" : p.stock > 0 ? "bg-orange-100 text-orange-700" : "bg-red-100 text-red-700"
                      }`}>
                        {p.stock > 20 ? "In Stock" : p.stock > 0 ? "Low Stock" : "Out of Stock"}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <button onClick={() => handleRemove(p.id)}
                        className="w-8 h-8 rounded-lg border border-destructive/30 flex items-center justify-center hover:bg-destructive/10 text-destructive transition-colors">
                        <RiDeleteBinLine className="text-sm" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-border">
            <p className="text-xs text-muted-foreground">Showing {Math.min((page - 1) * PAGE_SIZE + 1, filtered.length)}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}</p>
            <div className="flex items-center gap-1">
              <button disabled={page === 1} onClick={() => setPage((p) => p - 1)}
                className="w-8 h-8 rounded-lg border border-border flex items-center justify-center hover:bg-muted transition-colors disabled:opacity-40">
                <RiArrowLeftSLine />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button key={p} onClick={() => setPage(p)}
                  className={`w-8 h-8 rounded-lg text-xs font-semibold transition-all ${
                    p === page ? "bg-primary text-white" : "border border-border hover:bg-muted"
                  }`}>{p}</button>
              ))}
              <button disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}
                className="w-8 h-8 rounded-lg border border-border flex items-center justify-center hover:bg-muted transition-colors disabled:opacity-40">
                <RiArrowRightSLine />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add Product Modal */}
      <Modal isOpen={showAddModal} onClose={() => { setShowAddModal(false); setAddForm(EMPTY_ADD_FORM); }} title="Add New Product">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Product Name <span className="text-destructive">*</span></label>
            <input value={addForm.name} onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
              placeholder="e.g., Organic Tomatoes"
              className="w-full px-4 py-3 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Category</label>
              <select value={addForm.category} onChange={(e) => setAddForm({ ...addForm, category: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm">
                {["Vegetables", "Fruits", "Dairy & Eggs", "Leafy Greens", "Natural", "Herbs"].map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Unit</label>
              <select value={addForm.unit} onChange={(e) => setAddForm({ ...addForm, unit: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm">
                {["lb", "kg", "bunch", "pint", "dozen", "jar", "bag"].map((u) => <option key={u}>{u}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Price ($) <span className="text-destructive">*</span></label>
              <input type="number" step="0.01" min="0" value={addForm.price} onChange={(e) => setAddForm({ ...addForm, price: e.target.value })}
                placeholder="0.00"
                className="w-full px-4 py-3 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm" />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Stock Qty <span className="text-destructive">*</span></label>
              <input type="number" min="0" value={addForm.stock} onChange={(e) => setAddForm({ ...addForm, stock: e.target.value })}
                placeholder="50"
                className="w-full px-4 py-3 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm" />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Assign Farmer <span className="text-destructive">*</span></label>
            <select value={addForm.farmerId} onChange={(e) => setAddForm({ ...addForm, farmerId: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm">
              <option value="">— Select a farmer —</option>
              {FARMERS.map((f) => (
                <option key={f.id} value={f.id}>{f.name} · {f.farm}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-xl">
            <button type="button" onClick={() => setAddForm({ ...addForm, organic: !addForm.organic })}
              className={`relative w-12 h-6 rounded-full transition-colors shrink-0 ${addForm.organic ? "bg-primary" : "bg-muted border border-border"}`}>
              <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${addForm.organic ? "left-7" : "left-1"}`} />
            </button>
            <span className="text-sm font-medium flex items-center gap-1"><RiLeafLine className="text-primary" /> Certified Organic</span>
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={handleAddProduct}
              className="flex-1 py-3 rounded-xl bg-primary text-white font-semibold hover:bg-primary/90 transition-all flex items-center justify-center gap-2 text-sm">
              <RiAddNewLine /> Add Product
            </button>
            <button onClick={() => { setShowAddModal(false); setAddForm(EMPTY_ADD_FORM); }}
              className="flex-1 py-3 rounded-xl border border-border font-semibold hover:bg-muted transition-colors text-sm">Cancel</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────
export default function AdminDashboard() {
  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <DashboardSidebar role="admin" />
      <main className="flex-1 overflow-y-auto">
        <div className="p-6 md:p-8 max-w-6xl mx-auto">
          <Routes>
            <Route index element={<Overview />} />
            <Route path="users"   element={<ManageUsers />} />
            <Route path="farmers" element={<ApproveFarmers />} />
            <Route path="products" element={<ProductManagement />} />
            <Route path="announce" element={<SendAnnouncement />} />
            <Route path="orders" element={
              <div>
                <h1 className="font-serif text-3xl font-bold mb-6">All Orders</h1>
                <div className="space-y-3">
                  {ORDERS.map((order) => (
                    <div key={order.id} className="bg-card rounded-2xl p-5 shadow-card flex items-center justify-between">
                      <div>
                        <p className="font-bold">{order.id}</p>
                        <p className="text-muted-foreground text-sm">{order.customerName} · {order.date}</p>
                        <p className="text-xs text-muted-foreground">{order.deliveryAddress}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-primary">${order.total.toFixed(2)}</p>
                        <span className={`inline-block mt-1 px-2.5 py-1 rounded-full text-xs font-medium capitalize ${
                          order.status === "delivered" ? "bg-green-100 text-green-700"
                          : order.status === "cancelled" ? "bg-red-100 text-red-700"
                          : "bg-blue-100 text-blue-700"
                        }`}>{order.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            } />
            <Route path="analytics" element={<Analytics />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}
