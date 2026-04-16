import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { motion } from "framer-motion";
import {
  RiAddCircleLine, RiEditLine, RiDeleteBinLine, RiMoneyDollarCircleLine,
  RiLeafLine, RiShoppingBagLine, RiBarChartLine, RiAlertLine, RiShieldCheckLine,
  RiUserLine, RiMapPinLine,
} from "react-icons/ri";
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import DashboardSidebar from "@/components/features/DashboardSidebar";
import Modal from "@/components/ui/Modal";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { PRODUCTS, ORDERS, FARMERS } from "@/lib/mockData";
import { toast } from "sonner";
import type { Product } from "@/types";

const farmerProducts = PRODUCTS.filter((p) => p.farmerId === "farm-001");
const farmerOrders = ORDERS.filter((o) => o.farmerId === "farm-001");
const farmer = FARMERS[0];

function Overview() {
  return (
    <div>
      <h1 className="font-serif text-3xl font-bold mb-2">Farmer Dashboard</h1>
      <p className="text-muted-foreground mb-8">Manage your products and track your earnings.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {[
          { label: "My Products", value: farmerProducts.length, icon: RiLeafLine, color: "bg-green-50 text-green-600" },
          { label: "Total Orders", value: farmerOrders.length, icon: RiShoppingBagLine, color: "bg-blue-50 text-blue-600" },
          { label: "This Month", value: "$1,340", icon: RiMoneyDollarCircleLine, color: "bg-yellow-50 text-yellow-600" },
          { label: "Total Earnings", value: "$4,280", icon: RiBarChartLine, color: "bg-purple-50 text-purple-600" },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              className="bg-card rounded-2xl p-5 shadow-card">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${stat.color}`}><Icon className="text-xl" /></div>
              <div className="text-2xl font-bold font-serif">{stat.value}</div>
              <div className="text-muted-foreground text-sm">{stat.label}</div>
            </motion.div>
          );
        })}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-2xl p-6 shadow-card">
          <h2 className="font-semibold mb-4">Recent Orders</h2>
          <div className="space-y-3">
            {farmerOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-3 rounded-xl bg-muted/40">
                <div>
                  <p className="font-medium text-sm">{order.id}</p>
                  <p className="text-xs text-muted-foreground">{order.customerName} · {order.date}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-primary text-sm">${order.total.toFixed(2)}</p>
                  <span className="text-xs capitalize text-muted-foreground">{order.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-card rounded-2xl p-6 shadow-card">
          <h2 className="font-semibold mb-4">Low Stock Alerts</h2>
          <div className="space-y-3">
            {farmerProducts.filter((p) => p.stock < 35).map((p) => (
              <div key={p.id} className="flex items-center gap-3 p-3 rounded-xl bg-orange-50 border border-orange-200">
                <RiAlertLine className="text-orange-500 shrink-0" />
                <div className="flex-1">
                  <p className="font-medium text-sm">{p.name}</p>
                  <p className="text-xs text-orange-600">{p.stock} {p.unit}s remaining</p>
                </div>
                <button onClick={() => toast.success(`Restock request sent for ${p.name}`)}
                  className="text-xs text-orange-600 font-medium hover:underline">Restock</button>
              </div>
            ))}
            {farmerProducts.filter((p) => p.stock < 35).length === 0 && (
              <p className="text-muted-foreground text-sm text-center py-4">All products are well-stocked!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function AddProduct() {
  const [form, setForm] = useState({ name: "", price: "", unit: "lb", category: "Vegetables", stock: "", organic: false, description: "", harvestDate: "" });
  const [loading, setLoading] = useState(false);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success("Product added successfully!");
      setForm({ name: "", price: "", unit: "lb", category: "Vegetables", stock: "", organic: false, description: "", harvestDate: "" });
    }, 1000);
  };
  return (
    <div className="max-w-xl">
      <h1 className="font-serif text-3xl font-bold mb-6">Add New Product</h1>
      <div className="bg-card rounded-2xl p-6 shadow-card">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Product Name</label>
            <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g., Organic Tomatoes" className="w-full px-4 py-3 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Price ($)</label>
              <input type="number" required step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })}
                placeholder="0.00" className="w-full px-4 py-3 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm" />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Unit</label>
              <select value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm">
                {["lb", "kg", "bunch", "pint", "dozen", "jar", "bag"].map((u) => <option key={u}>{u}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Category</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm">
                {["Vegetables", "Fruits", "Dairy & Eggs", "Leafy Greens", "Natural", "Herbs"].map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Stock Quantity</label>
              <input type="number" required value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })}
                placeholder="50" className="w-full px-4 py-3 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm" />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Harvest Date</label>
            <input type="date" value={form.harvestDate} onChange={(e) => setForm({ ...form, harvestDate: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm" />
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Description</label>
            <textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Describe your product..." className="w-full px-4 py-3 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm resize-none" />
          </div>
          <div className="flex items-center gap-3">
            <button type="button" onClick={() => setForm({ ...form, organic: !form.organic })}
              className={`relative w-12 h-6 rounded-full transition-colors ${form.organic ? "bg-primary" : "bg-muted"}`}>
              <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${form.organic ? "left-7" : "left-1"}`} />
            </button>
            <span className="text-sm font-medium flex items-center gap-1"><RiLeafLine className="text-primary" /> Certified Organic</span>
          </div>
          <button type="submit" disabled={loading} className="w-full py-3 rounded-xl bg-primary text-white font-semibold hover:bg-primary/90 transition-all disabled:opacity-60 flex items-center justify-center gap-2">
            <RiAddCircleLine /> {loading ? "Adding..." : "Add Product"}
          </button>
        </form>
      </div>
    </div>
  );
}

function ManageProducts() {
  const [products, setProducts] = useState(farmerProducts);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ price: "", stock: "" });
  const openEdit = (p: Product) => { setEditProduct(p); setEditForm({ price: String(p.price), stock: String(p.stock) }); };

  return (
    <div>
      <h1 className="font-serif text-3xl font-bold mb-6">My Products</h1>
      <div className="space-y-3">
        {products.map((product) => (
          <div key={product.id} className="bg-card rounded-2xl p-4 shadow-card flex items-center gap-4">
            <img src={product.image} alt={product.name} className="w-14 h-14 rounded-xl object-cover" />
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="font-semibold">{product.name}</p>
                {product.organic && <span className="px-2 py-0.5 rounded-full text-xs bg-green-100 text-green-700">Organic</span>}
                {product.stock < 20 && <span className="px-2 py-0.5 rounded-full text-xs bg-orange-100 text-orange-700 flex items-center gap-1"><RiAlertLine /> Low Stock</span>}
              </div>
              <p className="text-muted-foreground text-sm">{product.category} · Stock: {product.stock} {product.unit}s</p>
            </div>
            <div className="text-right mr-4">
              <p className="font-bold text-primary">${product.price.toFixed(2)}</p>
              <p className="text-xs text-muted-foreground">per {product.unit}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => openEdit(product)} className="w-9 h-9 rounded-xl border border-border flex items-center justify-center hover:bg-muted transition-colors">
                <RiEditLine className="text-base" />
              </button>
              <button onClick={() => setDeleteId(product.id)} className="w-9 h-9 rounded-xl border border-destructive/30 flex items-center justify-center hover:bg-destructive/10 text-destructive transition-colors">
                <RiDeleteBinLine className="text-base" />
              </button>
            </div>
          </div>
        ))}
      </div>
      <Modal isOpen={!!editProduct} onClose={() => setEditProduct(null)} title={`Edit: ${editProduct?.name}`}>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Price ($)</label>
            <input type="number" step="0.01" value={editForm.price} onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm" />
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Stock Quantity</label>
            <input type="number" value={editForm.stock} onChange={(e) => setEditForm({ ...editForm, stock: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm" />
          </div>
          <button onClick={() => { setEditProduct(null); toast.success("Product updated successfully!"); }} className="w-full py-3 rounded-xl bg-primary text-white font-semibold hover:bg-primary/90 transition-all">Save Changes</button>
        </div>
      </Modal>
      <ConfirmDialog isOpen={!!deleteId} onCancel={() => setDeleteId(null)}
        onConfirm={() => { setProducts((p) => p.filter((pr) => pr.id !== deleteId)); setDeleteId(null); toast.success("Product deleted."); }}
        title="Delete Product?" message="This will permanently remove the product from your listings." confirmText="Delete" />
    </div>
  );
}

function Inventory() {
  const [products, setProducts] = useState(farmerProducts);
  return (
    <div>
      <h1 className="font-serif text-3xl font-bold mb-6">Inventory Management</h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-6">
        {[
          { label: "Total Items", value: products.length, color: "text-primary" },
          { label: "Low Stock (<20)", value: products.filter(p => p.stock < 20).length, color: "text-orange-500" },
          { label: "Out of Stock", value: products.filter(p => p.stock === 0).length, color: "text-red-500" },
        ].map((s) => (
          <div key={s.label} className="bg-card rounded-2xl p-5 shadow-card">
            <p className={`text-3xl font-bold font-serif ${s.color}`}>{s.value}</p>
            <p className="text-muted-foreground text-sm mt-1">{s.label}</p>
          </div>
        ))}
      </div>
      <div className="bg-card rounded-2xl shadow-card overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              {["Product", "Category", "Stock", "Unit", "Status", "Action"].map((h) => (
                <th key={h} className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {products.map((p) => (
              <tr key={p.id} className="hover:bg-muted/20 transition-colors">
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <img src={p.image} alt={p.name} className="w-8 h-8 rounded-lg object-cover" />
                    <span className="font-medium text-sm">{p.name}</span>
                  </div>
                </td>
                <td className="py-3 px-4 text-sm text-muted-foreground">{p.category}</td>
                <td className="py-3 px-4">
                  <input type="number" defaultValue={p.stock} min={0}
                    onChange={(e) => setProducts((prev) => prev.map((pr) => pr.id === p.id ? { ...pr, stock: Number(e.target.value) } : pr))}
                    className="w-20 px-2 py-1 rounded-lg border border-border text-sm focus:outline-none focus:ring-1 focus:ring-primary/30" />
                </td>
                <td className="py-3 px-4 text-sm text-muted-foreground">{p.unit}</td>
                <td className="py-3 px-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${p.stock > 20 ? "bg-green-100 text-green-700" : p.stock > 0 ? "bg-orange-100 text-orange-700" : "bg-red-100 text-red-700"}`}>
                    {p.stock > 20 ? "In Stock" : p.stock > 0 ? "Low Stock" : "Out of Stock"}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <button onClick={() => toast.success(`${p.name} stock updated!`)} className="text-xs text-primary font-medium hover:underline">Save</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const FARMER_MONTHLY = [
  { month: "Jan", earnings: 820, orders: 18 },
  { month: "Feb", earnings: 1140, orders: 24 },
  { month: "Mar", earnings: 980, orders: 21 },
  { month: "Apr", earnings: 1340, orders: 29 },
];
const CHART_COLORS = { primary: "#16a34a", secondary: "#f59e0b", accent: "#3b82f6" };

function Analytics() {
  return (
    <div>
      <h1 className="font-serif text-3xl font-bold mb-2">Sales Analytics</h1>
      <p className="text-muted-foreground mb-6">Performance overview for your farm listings.</p>

      {/* KPI row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-6">
        {[
          ["Top Product", "Organic Tomatoes"],
          ["Avg. Order Value", "$15.72"],
          ["Total Reviews", farmerProducts.reduce((a, p) => a + p.reviews, 0) + "+"],
        ].map(([label, val]) => (
          <div key={label} className="bg-card rounded-2xl p-5 shadow-card">
            <p className="text-muted-foreground text-sm mb-1">{label}</p>
            <p className="font-bold text-lg text-foreground">{val}</p>
          </div>
        ))}
      </div>

      {/* Monthly Earnings Bar Chart */}
      <div className="bg-card rounded-2xl p-6 shadow-card mb-6">
        <h2 className="font-semibold mb-1">Monthly Earnings &amp; Orders</h2>
        <p className="text-muted-foreground text-xs mb-5">Jan – Apr 2026</p>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={FARMER_MONTHLY} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis yAxisId="left" tickFormatter={(v) => `$${v}`} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} width={48} />
            <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} width={32} />
            <Tooltip
              formatter={(value: number, name: string) => [
                name === "earnings" ? `$${value}` : value,
                name === "earnings" ? "Earnings" : "Orders",
              ]}
              contentStyle={{ borderRadius: 12, border: "1px solid #e5e7eb", fontSize: 12 }}
            />
            <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12, paddingTop: 12 }} />
            <Bar yAxisId="left" dataKey="earnings" fill={CHART_COLORS.primary} radius={[6, 6, 0, 0]} name="Earnings" />
            <Bar yAxisId="right" dataKey="orders" fill={CHART_COLORS.secondary} radius={[6, 6, 0, 0]} name="Orders" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Order Trend Line Chart */}
      <div className="bg-card rounded-2xl p-6 shadow-card mb-6">
        <h2 className="font-semibold mb-1">Order Trend</h2>
        <p className="text-muted-foreground text-xs mb-5">Monthly order volume over time</p>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={FARMER_MONTHLY} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} width={32} />
            <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e5e7eb", fontSize: 12 }} />
            <Line type="monotone" dataKey="orders" stroke={CHART_COLORS.primary} strokeWidth={2.5} dot={{ r: 5, fill: CHART_COLORS.primary }} name="Orders" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Demand Insights */}
      <div className="bg-card rounded-2xl p-6 shadow-card">
        <h2 className="font-semibold mb-5">Demand Insights — Product Comparison</h2>
        <ResponsiveContainer width="100%" height={farmerProducts.length * 52 + 40}>
          <BarChart
            layout="vertical"
            data={farmerProducts.map((p) => ({ name: p.name.length > 18 ? p.name.slice(0, 18) + "…" : p.name, reviews: p.reviews, rating: p.rating }))}
            margin={{ top: 4, right: 16, left: 8, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" horizontal={false} />
            <XAxis type="number" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} width={120} />
            <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e5e7eb", fontSize: 12 }} />
            <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12, paddingTop: 12 }} />
            <Bar dataKey="reviews" fill={CHART_COLORS.primary}  radius={[0, 6, 6, 0]} name="Reviews" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function Earnings() {
  const months = ["Jan", "Feb", "Mar", "Apr"];
  const data = [820, 1140, 980, 1340];
  const max = Math.max(...data);
  return (
    <div>
      <h1 className="font-serif text-3xl font-bold mb-6">Earnings</h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
        {[["Total Earned", "$4,280", "text-primary"], ["This Month", "$1,340", "text-green-600"], ["Pending Payout", "$620", "text-orange-500"]].map(([label, val, color]) => (
          <div key={label} className="bg-card rounded-2xl p-5 shadow-card">
            <p className="text-muted-foreground text-sm mb-1">{label}</p>
            <p className={`text-3xl font-bold font-serif ${color}`}>{val}</p>
          </div>
        ))}
      </div>
      <div className="bg-card rounded-2xl p-6 shadow-card mb-6">
        <h2 className="font-semibold mb-6">Monthly Earnings</h2>
        <div className="flex items-end gap-4 h-40">
          {data.map((val, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-2">
              <span className="text-xs font-medium text-primary">${val}</span>
              <div className="w-full bg-primary/10 rounded-t-lg" style={{ height: `${(val / max) * 100}%` }}>
                <div className="w-full bg-primary rounded-t-lg h-full opacity-80" />
              </div>
              <span className="text-xs text-muted-foreground">{months[i]}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-card rounded-2xl p-6 shadow-card">
        <h2 className="font-semibold mb-4">Payment History</h2>
        <div className="space-y-3">
          {[["Apr 1", "$980", "Paid"], ["Mar 1", "$1,140", "Paid"], ["Feb 1", "$820", "Paid"], ["Jan 1", "$760", "Paid"]].map(([date, amt, status]) => (
            <div key={date} className="flex items-center justify-between p-3 rounded-xl bg-muted/30">
              <div>
                <p className="font-medium text-sm">{date}, 2026</p>
                <p className="text-xs text-muted-foreground">Monthly payout</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-primary">{amt}</p>
                <span className="text-xs text-green-600 font-medium">{status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function FarmProfile() {
  const [editing, setEditing] = useState(false);
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-3xl font-bold">Farm Profile</h1>
        <button onClick={() => setEditing(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 text-primary font-medium text-sm hover:bg-primary/20 transition-colors">
          <RiEditLine /> Edit Profile
        </button>
      </div>
      <div className="bg-card rounded-2xl p-6 shadow-card mb-6">
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-border">
          <img src={farmer.image} alt={farmer.name} className="w-16 h-16 rounded-2xl object-cover border-2 border-primary/20" />
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <h2 className="font-semibold text-xl">{farmer.farm}</h2>
              {farmer.approved && <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-green-100 text-green-700 font-medium"><RiShieldCheckLine /> Verified</span>}
            </div>
            <p className="text-muted-foreground text-sm">{farmer.name}</p>
            <p className="text-sm text-muted-foreground flex items-center gap-1 mt-0.5"><RiMapPinLine className="text-primary" /> {farmer.location}</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[["Email", farmer.email], ["Location", farmer.location], ["Joined", farmer.joinedAt], ["Products Listed", farmer.products + ""]].map(([label, val]) => (
            <div key={label}>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">{label}</p>
              <p className="font-medium text-sm">{val}</p>
            </div>
          ))}
        </div>
        <div className="mt-5 pt-5 border-t border-border">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Farm Story</p>
          <p className="text-sm text-muted-foreground leading-relaxed">{farmer.story}</p>
        </div>
      </div>
      <div className="bg-card rounded-2xl p-6 shadow-card">
        <h2 className="font-semibold mb-4 flex items-center gap-2"><RiShieldCheckLine className="text-primary" /> Certifications</h2>
        <div className="space-y-3">
          {[["USDA Organic", "Verified", "green"], ["Non-GMO Project", "Verified", "green"], ["Sustainable Farming", "Pending renewal", "yellow"]].map(([cert, status, color]) => (
            <div key={cert} className="flex items-center justify-between p-3 rounded-xl bg-muted/30">
              <div className="flex items-center gap-2"><RiShieldCheckLine className="text-primary" /><span className="font-medium text-sm">{cert}</span></div>
              <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${color === "green" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>{status}</span>
            </div>
          ))}
        </div>
      </div>
      <Modal isOpen={editing} onClose={() => setEditing(false)} title="Edit Farm Profile">
        <div className="space-y-4">
          {[["Farm Name", farmer.farm], ["Location", farmer.location], ["Story", farmer.story]].map(([label, val]) => (
            <div key={label}>
              <label className="text-sm font-medium mb-2 block">{label}</label>
              {label === "Story" ? (
                <textarea rows={3} defaultValue={val} className="w-full px-4 py-3 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm resize-none" />
              ) : (
                <input defaultValue={val} className="w-full px-4 py-3 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm" />
              )}
            </div>
          ))}
          <button onClick={() => { setEditing(false); toast.success("Farm profile updated!"); }} className="w-full py-3 rounded-xl bg-primary text-white font-semibold hover:bg-primary/90 transition-all">Save Changes</button>
        </div>
      </Modal>
    </div>
  );
}

export default function FarmerDashboard() {
  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <DashboardSidebar role="farmer" />
      <main className="flex-1 overflow-y-auto">
        <div className="p-6 md:p-8 max-w-5xl mx-auto">
          <Routes>
            <Route index element={<Overview />} />
            <Route path="add" element={<AddProduct />} />
            <Route path="products" element={<ManageProducts />} />
            <Route path="orders" element={
              <div>
                <h1 className="font-serif text-3xl font-bold mb-6">My Orders</h1>
                <div className="space-y-3">
                  {farmerOrders.map((order) => (
                    <div key={order.id} className="bg-card rounded-2xl p-5 shadow-card border border-border">
                      <div className="flex justify-between items-start mb-3">
                        <div><p className="font-bold">{order.id}</p><p className="text-muted-foreground text-sm">{order.customerName} · {order.date}</p></div>
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 capitalize">{order.status}</span>
                      </div>
                      <div className="space-y-1.5 mb-3">
                        {order.items.map((item, i) => (
                          <div key={i} className="flex items-center gap-2 text-sm">
                            <img src={item.product.image} alt={item.product.name} className="w-8 h-8 rounded-lg object-cover" />
                            <span className="flex-1">{item.product.name}</span>
                            <span className="text-muted-foreground">x{item.quantity}</span>
                          </div>
                        ))}
                      </div>
                      <div className="flex justify-between items-center pt-3 border-t border-border">
                        <p className="text-sm text-muted-foreground">{order.deliveryAddress}</p>
                        <p className="font-bold text-primary">${order.total.toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            } />
            <Route path="inventory" element={<Inventory />} />
            <Route path="earnings" element={<Earnings />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="profile" element={<FarmProfile />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}
