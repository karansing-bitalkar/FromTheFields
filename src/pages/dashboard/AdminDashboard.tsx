import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { motion } from "framer-motion";
import { RiGroupLine, RiShoppingBagLine, RiMoneyDollarCircleLine, RiCheckboxCircleLine, RiCloseCircleLine, RiEditLine, RiDeleteBinLine, RiAddLine, RiArrowLeftSLine, RiArrowRightSLine } from "react-icons/ri";
import DashboardSidebar from "@/components/features/DashboardSidebar";
import Modal from "@/components/ui/Modal";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { ORDERS, FARMERS } from "@/lib/mockData";
import { toast } from "sonner";
import type { Farmer } from "@/types";

const DEMO_USERS = [
  { id: "u1", name: "Alex Johnson", email: "customer@test.com", role: "Customer", status: "Active", joined: "Jan 15, 2024" },
  { id: "u2", name: "Lisa Park", email: "lisa@example.com", role: "Customer", status: "Active", joined: "Feb 3, 2024" },
  { id: "u3", name: "Robert Green", email: "farmer@test.com", role: "Farmer", status: "Active", joined: "Aug 20, 2023" },
  { id: "u4", name: "Mike Rider", email: "delivery@test.com", role: "Delivery", status: "Active", joined: "Mar 10, 2024" },
  { id: "u5", name: "Tom Rivera", email: "tom@example.com", role: "Customer", status: "Inactive", joined: "Dec 1, 2023" },
];

function Overview() {
  const stats = [
    { label: "Total Users", value: "1,284", icon: RiGroupLine, color: "bg-blue-50 text-blue-600", trend: "+12%" },
    { label: "Total Orders", value: ORDERS.length, icon: RiShoppingBagLine, color: "bg-green-50 text-green-600", trend: "+8%" },
    { label: "Revenue (Apr)", value: "$24,800", icon: RiMoneyDollarCircleLine, color: "bg-yellow-50 text-yellow-600", trend: "+22%" },
    { label: "Active Farmers", value: FARMERS.filter(f => f.approved).length, icon: RiCheckboxCircleLine, color: "bg-purple-50 text-purple-600", trend: "+5%" },
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
          <h2 className="font-semibold mb-4">Category Revenue</h2>
          <div className="space-y-3">
            {[["Vegetables", 42, "$10,416"], ["Fruits", 28, "$6,944"], ["Dairy & Eggs", 18, "$4,464"], ["Leafy Greens", 12, "$2,976"]].map(([cat, pct, rev]) => (
              <div key={cat as string}>
                <div className="flex justify-between text-sm mb-1"><span>{cat}</span><span className="font-medium">{rev}</span></div>
                <div className="h-2 rounded-full bg-muted overflow-hidden"><div className="h-full bg-primary rounded-full" style={{ width: `${pct}%` }} /></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const PAGE_SIZE = 3;

function ManageUsers() {
  const [users, setUsers] = useState(DEMO_USERS);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editUser, setEditUser] = useState<typeof DEMO_USERS[0] | null>(null);
  const [page, setPage] = useState(1);
  const [showAddUser, setShowAddUser] = useState(false);
  const [addForm, setAddForm] = useState({ name: "", email: "", role: "Customer", status: "Active" });

  const totalPages = Math.ceil(users.length / PAGE_SIZE);
  const paginated = users.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleAddUser = () => {
    if (!addForm.name || !addForm.email) { toast.error("Name and email are required."); return; }
    const newUser = { id: `u${Date.now()}`, name: addForm.name, email: addForm.email, role: addForm.role, status: addForm.status, joined: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) };
    setUsers((prev) => [...prev, newUser]);
    setAddForm({ name: "", email: "", role: "Customer", status: "Active" });
    setShowAddUser(false);
    toast.success(`User "${addForm.name}" added successfully!`);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h1 className="font-serif text-3xl font-bold">Manage Users</h1>
        <button onClick={() => setShowAddUser(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-primary/90 transition-all shadow-sm">
          <RiAddLine className="text-base" /> Add User
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
        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-border">
          <p className="text-xs text-muted-foreground">Showing {Math.min((page - 1) * PAGE_SIZE + 1, users.length)}–{Math.min(page * PAGE_SIZE, users.length)} of {users.length} users</p>
          <div className="flex items-center gap-1">
            <button disabled={page === 1} onClick={() => setPage((p) => p - 1)}
              className="w-8 h-8 rounded-lg border border-border flex items-center justify-center hover:bg-muted transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
              <RiArrowLeftSLine className="text-base" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button key={p} onClick={() => setPage(p)}
                className={`w-8 h-8 rounded-lg text-xs font-semibold transition-all ${p === page ? "bg-primary text-white" : "border border-border hover:bg-muted"}`}>{p}</button>
            ))}
            <button disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}
              className="w-8 h-8 rounded-lg border border-border flex items-center justify-center hover:bg-muted transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
              <RiArrowRightSLine className="text-base" />
            </button>
          </div>
        </div>
      </div>

      {/* Add User Modal */}
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

function ApproveFarmers() {
  const [farmers, setFarmers] = useState<Farmer[]>(FARMERS);
  const approve = (id: string) => { setFarmers((f) => f.map((fm) => fm.id === id ? { ...fm, approved: true } : fm)); toast.success("Farmer approved!"); };
  const reject = (id: string) => { setFarmers((f) => f.filter((fm) => fm.id !== id)); toast.success("Farmer rejected."); };
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
            {!farmer.approved && (
              <div className="flex gap-2">
                <button onClick={() => approve(farmer.id)} className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-green-600 text-white text-sm font-medium hover:bg-green-700 transition-colors">
                  <RiCheckboxCircleLine /> Approve
                </button>
                <button onClick={() => reject(farmer.id)} className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-destructive/40 text-destructive text-sm font-medium hover:bg-destructive/10 transition-colors">
                  <RiCloseCircleLine /> Reject
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function Analytics() {
  const bars = [{ label: "Veg", val: 42 }, { label: "Fruits", val: 28 }, { label: "Dairy", val: 18 }, { label: "Greens", val: 12 }];
  return (
    <div>
      <h1 className="font-serif text-3xl font-bold mb-6">Analytics</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-2xl p-6 shadow-card">
          <h2 className="font-semibold mb-6">Sales by Category (%)</h2>
          <div className="flex items-end gap-4 h-48">
            {bars.map((b) => (
              <div key={b.label} className="flex-1 flex flex-col items-center gap-2">
                <span className="text-xs font-medium text-primary">{b.val}%</span>
                <div className="w-full bg-muted rounded-t-lg overflow-hidden" style={{ height: "100%" }}>
                  <div className="w-full bg-primary rounded-t-lg transition-all" style={{ height: `${b.val}%` }} />
                </div>
                <span className="text-xs text-muted-foreground">{b.label}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-card rounded-2xl p-6 shadow-card">
          <h2 className="font-semibold mb-4">Platform Stats</h2>
          <div className="space-y-4">
            {[["Total Revenue", "$24,800", "↑ 22%", "text-green-600"], ["Avg. Order Value", "$18.40", "↑ 5%", "text-green-600"], ["Farmer Payouts", "$19,840", "80% of revenue", "text-primary"], ["Platform Fee", "$4,960", "20% commission", "text-orange-600"]].map(([label, val, sub, color]) => (
              <div key={label} className="flex items-center justify-between p-3 rounded-xl bg-muted/30">
                <span className="text-sm text-muted-foreground">{label}</span>
                <div className="text-right"><p className="font-bold">{val}</p><p className={`text-xs ${color}`}>{sub}</p></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <DashboardSidebar role="admin" />
      <main className="flex-1 overflow-y-auto">
        <div className="p-6 md:p-8 max-w-6xl mx-auto">
          <Routes>
            <Route index element={<Overview />} />
            <Route path="users" element={<ManageUsers />} />
            <Route path="farmers" element={<ApproveFarmers />} />
            <Route path="orders" element={
              <div>
                <h1 className="font-serif text-3xl font-bold mb-6">All Orders</h1>
                <div className="space-y-3">
                  {ORDERS.map((order) => (
                    <div key={order.id} className="bg-card rounded-2xl p-5 shadow-card flex items-center justify-between">
                      <div><p className="font-bold">{order.id}</p><p className="text-muted-foreground text-sm">{order.customerName} · {order.date}</p><p className="text-xs text-muted-foreground">{order.deliveryAddress}</p></div>
                      <div className="text-right"><p className="font-bold text-primary">${order.total.toFixed(2)}</p><span className={`inline-block mt-1 px-2.5 py-1 rounded-full text-xs font-medium capitalize ${order.status === "delivered" ? "bg-green-100 text-green-700" : order.status === "cancelled" ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"}`}>{order.status}</span></div>
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
