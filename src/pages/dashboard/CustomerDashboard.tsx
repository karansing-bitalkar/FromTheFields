import { useState } from "react";
import { Routes, Route, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  RiShoppingBagLine, RiHeartLine, RiCalendarCheckLine, RiUserLine,
  RiTruckLine, RiCheckLine, RiDeleteBinLine, RiEditLine, RiAddLine,
  RiSubtractLine, RiMapPinLine, RiBellLine, RiShoppingCartLine,
  RiLeafLine, RiStarFill, RiTimeLine,
} from "react-icons/ri";
import DashboardSidebar from "@/components/features/DashboardSidebar";
import Modal from "@/components/ui/Modal";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { useAuth } from "@/lib/auth";
import { ORDERS, PRODUCTS, SUBSCRIPTIONS } from "@/lib/mockData";
import { useWishlist } from "@/hooks/useWishlist";
import { useNotifications } from "@/hooks/useNotifications";
import { toast } from "sonner";

const statusConfig: Record<string, { label: string; color: string }> = {
  pending:    { label: "Pending",    color: "bg-yellow-100 text-yellow-700" },
  confirmed:  { label: "Confirmed",  color: "bg-blue-100 text-blue-700" },
  picked:     { label: "Picked Up",  color: "bg-purple-100 text-purple-700" },
  "in-transit": { label: "In Transit", color: "bg-orange-100 text-orange-700" },
  delivered:  { label: "Delivered",  color: "bg-green-100 text-green-700" },
  cancelled:  { label: "Cancelled",  color: "bg-red-100 text-red-700" },
};

function Overview() {
  const { user } = useAuth();
  const myOrders = ORDERS.filter((o) => o.customerId === "cust-001");
  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold">Welcome back, {user?.name?.split(" ")[0]}!</h1>
        <p className="text-muted-foreground mt-1">Here's what's happening with your account.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {[
          { label: "Total Orders", value: myOrders.length, icon: RiShoppingBagLine, color: "bg-blue-50 text-blue-600" },
          { label: "Active Orders", value: myOrders.filter(o => o.status !== "delivered" && o.status !== "cancelled").length, icon: RiTruckLine, color: "bg-orange-50 text-orange-600" },
          { label: "Delivered", value: myOrders.filter(o => o.status === "delivered").length, icon: RiCheckLine, color: "bg-green-50 text-green-600" },
          { label: "Subscriptions", value: 1, icon: RiCalendarCheckLine, color: "bg-purple-50 text-purple-600" },
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
            {myOrders.map((order) => {
              const conf = statusConfig[order.status];
              return (
                <div key={order.id} className="flex items-center justify-between p-3 rounded-xl bg-muted/40">
                  <div>
                    <p className="font-medium text-sm">{order.id}</p>
                    <p className="text-xs text-muted-foreground">{order.date} · ${order.total.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${conf.color}`}>{conf.label}</span>
                    {order.status !== "delivered" && order.status !== "cancelled" && (
                      <Link to={`/order/${order.id}/track`} className="text-xs text-primary hover:underline font-medium flex items-center gap-1">
                        <RiMapPinLine /> Track
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="bg-card rounded-2xl p-6 shadow-card">
          <h2 className="font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Browse Market", href: "/marketplace", icon: RiLeafLine, color: "bg-green-50 text-green-600" },
              { label: "Checkout", href: "/checkout", icon: RiShoppingCartLine, color: "bg-blue-50 text-blue-600" },
              { label: "Track Order", href: `/order/ORD-002/track`, icon: RiTruckLine, color: "bg-orange-50 text-orange-600" },
              { label: "Subscriptions", href: "/subscription", icon: RiCalendarCheckLine, color: "bg-purple-50 text-purple-600" },
            ].map((action) => {
              const Icon = action.icon;
              return (
                <Link key={action.label} to={action.href}
                  className="flex items-center gap-3 p-3 rounded-xl bg-muted/40 hover:bg-muted transition-colors">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${action.color}`}><Icon className="text-base" /></div>
                  <span className="text-sm font-medium">{action.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function MyOrders() {
  const myOrders = ORDERS.filter((o) => o.customerId === "cust-001");
  const [cancelId, setCancelId] = useState<string | null>(null);
  return (
    <div>
      <h1 className="font-serif text-3xl font-bold mb-6">My Orders</h1>
      <div className="space-y-4">
        {myOrders.map((order) => {
          const conf = statusConfig[order.status];
          return (
            <div key={order.id} className="bg-card rounded-2xl p-5 shadow-card border border-border">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div>
                  <p className="font-bold text-lg font-serif">{order.id}</p>
                  <p className="text-muted-foreground text-sm">{order.date} · {order.deliveryAddress}</p>
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                  <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${conf.color}`}>{conf.label}</span>
                  {order.status !== "delivered" && order.status !== "cancelled" && (
                    <Link to={`/order/${order.id}/track`}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-primary/10 text-primary text-xs font-medium hover:bg-primary/20 transition-colors">
                      <RiTruckLine /> Track Order
                    </Link>
                  )}
                  {order.status === "pending" && (
                    <button onClick={() => setCancelId(order.id)} className="text-xs text-destructive hover:underline">Cancel</button>
                  )}
                </div>
              </div>
              <div className="space-y-2 mb-4">
                {order.items.map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm">
                    <img src={item.product.image} alt={item.product.name} className="w-10 h-10 rounded-lg object-cover" />
                    <span className="flex-1">{item.product.name}</span>
                    <span className="text-muted-foreground">x{item.quantity}</span>
                    <span className="font-medium">${(item.product.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-end border-t border-border pt-3">
                <p className="font-bold text-primary">Total: ${order.total.toFixed(2)}</p>
              </div>
            </div>
          );
        })}
      </div>
      <ConfirmDialog isOpen={!!cancelId} onCancel={() => setCancelId(null)} onConfirm={() => { setCancelId(null); toast.success("Order cancelled successfully."); }}
        title="Cancel Order?" message="Are you sure you want to cancel this order? This cannot be undone." confirmText="Cancel Order" />
    </div>
  );
}

function Cart() {
  const [cartItems, setCartItems] = useState(PRODUCTS.slice(0, 3).map((p) => ({ product: p, quantity: 1 })));
  const [removeId, setRemoveId] = useState<string | null>(null);
  const navigate = useNavigate();
  const total = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const updateQty = (id: string, delta: number) => {
    setCartItems((prev) => prev.map((i) => i.product.id === id ? { ...i, quantity: Math.max(1, i.quantity + delta) } : i));
  };
  return (
    <div>
      <h1 className="font-serif text-3xl font-bold mb-6">My Cart</h1>
      {cartItems.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <RiShoppingCartLine className="text-5xl mx-auto mb-4 text-muted-foreground/40" />
          <p>Your cart is empty.</p>
          <Link to="/marketplace" className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-primary/90 transition-all">
            Browse Marketplace
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-3">
            {cartItems.map((item) => (
              <div key={item.product.id} className="bg-card rounded-2xl p-4 shadow-card flex items-center gap-4">
                <img src={item.product.image} alt={item.product.name} className="w-16 h-16 rounded-xl object-cover" />
                <div className="flex-1">
                  <p className="font-semibold">{item.product.name}</p>
                  <p className="text-muted-foreground text-sm">${item.product.price.toFixed(2)} / {item.product.unit}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => updateQty(item.product.id, -1)} className="w-8 h-8 rounded-lg border border-border flex items-center justify-center hover:bg-muted transition-colors"><RiSubtractLine /></button>
                  <span className="w-8 text-center font-medium">{item.quantity}</span>
                  <button onClick={() => updateQty(item.product.id, 1)} className="w-8 h-8 rounded-lg border border-border flex items-center justify-center hover:bg-muted transition-colors"><RiAddLine /></button>
                </div>
                <div className="text-right">
                  <p className="font-bold text-primary">${(item.product.price * item.quantity).toFixed(2)}</p>
                  <button onClick={() => setRemoveId(item.product.id)} className="text-xs text-destructive hover:underline mt-1">Remove</button>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-card rounded-2xl p-5 shadow-card h-fit">
            <h3 className="font-semibold mb-4">Order Summary</h3>
            <div className="space-y-2 text-sm mb-4">
              <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>${total.toFixed(2)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Delivery</span><span className="text-primary">Free</span></div>
              <div className="border-t border-border pt-2 flex justify-between font-bold text-lg"><span>Total</span><span className="text-primary">${total.toFixed(2)}</span></div>
            </div>
            <button onClick={() => navigate("/checkout")} className="w-full py-3 rounded-xl bg-primary text-white font-semibold hover:bg-primary/90 transition-all">Proceed to Checkout</button>
          </div>
        </div>
      )}
      <ConfirmDialog isOpen={!!removeId} onCancel={() => setRemoveId(null)} onConfirm={() => { setCartItems((p) => p.filter((i) => i.product.id !== removeId)); setRemoveId(null); toast.success("Item removed from cart."); }}
        title="Remove Item?" message="Remove this item from your cart?" confirmText="Remove" />
    </div>
  );
}

function Wishlist() {
  const { wishlistIds, removeFromWishlist, clearWishlist } = useWishlist();
  const [removeId, setRemoveId] = useState<string | null>(null);
  const savedProducts = PRODUCTS.filter((p) => wishlistIds.includes(p.id));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-3xl font-bold">Saved Products</h1>
        {savedProducts.length > 0 && (
          <button onClick={() => clearWishlist()} className="text-sm text-destructive hover:underline font-medium">Clear All</button>
        )}
      </div>

      {savedProducts.length === 0 ? (
        <div className="text-center py-20 bg-card rounded-2xl shadow-card">
          <RiHeartLine className="text-5xl mx-auto mb-4 text-muted-foreground/40" />
          <h3 className="font-semibold text-lg mb-2">No saved products yet</h3>
          <p className="text-muted-foreground text-sm mb-5">Tap the heart icon on any product to save it here.</p>
          <Link to="/marketplace" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-primary/90 transition-all">
            Browse Marketplace
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {savedProducts.map((product, i) => (
            <motion.div key={product.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
              className="bg-card rounded-2xl shadow-card overflow-hidden border border-border group">
              <Link to={`/product/${product.id}`} className="block">
                <div className="relative h-40 overflow-hidden">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  {product.organic && (
                    <span className="absolute top-3 left-3 flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-green-600 text-white">
                      <RiLeafLine /> Organic
                    </span>
                  )}
                </div>
              </Link>
              <div className="p-4">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <Link to={`/product/${product.id}`} className="font-semibold hover:text-primary transition-colors">{product.name}</Link>
                  <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full shrink-0">{product.category}</span>
                </div>
                <p className="text-xs text-muted-foreground mb-2">{product.farmer}</p>
                <div className="flex items-center gap-1 mb-3">
                  <RiStarFill className="text-amber-400 text-xs" />
                  <span className="text-xs font-medium">{product.rating}</span>
                  <span className="text-xs text-muted-foreground">({product.reviews})</span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <span className="text-lg font-bold text-primary">${product.price.toFixed(2)}</span>
                    <span className="text-xs text-muted-foreground ml-1">/ {product.unit}</span>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => toast.success(`${product.name} added to cart!`)}
                      className="flex items-center gap-1 px-3 py-2 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-primary/90 transition-all">
                      <RiShoppingCartLine /> Add
                    </button>
                    <button onClick={() => setRemoveId(product.id)}
                      className="w-8 h-8 rounded-xl border border-destructive/30 text-destructive flex items-center justify-center hover:bg-destructive/10 transition-colors">
                      <RiDeleteBinLine className="text-sm" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
      <ConfirmDialog isOpen={!!removeId} onCancel={() => setRemoveId(null)}
        onConfirm={() => { if (removeId) removeFromWishlist(removeId); setRemoveId(null); toast.success("Removed from wishlist."); }}
        title="Remove from Wishlist?" message="Remove this product from your saved items?" confirmText="Remove" />
    </div>
  );
}

function Notifications() {
  const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification } = useNotifications();
  const typeColors: Record<string, string> = {
    order: "bg-blue-100 text-blue-700",
    subscription: "bg-purple-100 text-purple-700",
    farmer: "bg-green-100 text-green-700",
    delivery: "bg-orange-100 text-orange-700",
  };
  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="font-serif text-3xl font-bold">Notifications</h1>
          {unreadCount > 0 && <p className="text-muted-foreground text-sm mt-1">{unreadCount} unread</p>}
        </div>
        {unreadCount > 0 && (
          <button onClick={markAllAsRead} className="px-4 py-2 rounded-xl bg-primary/10 text-primary text-sm font-medium hover:bg-primary/20 transition-colors">
            Mark all as read
          </button>
        )}
      </div>
      <div className="space-y-3">
        {notifications.length === 0 ? (
          <div className="text-center py-16 bg-card rounded-2xl shadow-card">
            <RiBellLine className="text-4xl text-muted-foreground/40 mx-auto mb-3" />
            <p className="text-muted-foreground">No notifications yet.</p>
          </div>
        ) : (
          notifications.map((n) => (
            <motion.div key={n.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              onClick={() => markAsRead(n.id)}
              className={`bg-card rounded-2xl p-4 shadow-card flex items-start gap-4 cursor-pointer transition-all hover:shadow-md border ${!n.read ? "border-primary/20 bg-primary/5" : "border-border"}`}>
              <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize shrink-0 ${typeColors[n.type]}`}>{n.type}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className={`text-sm font-semibold ${!n.read ? "text-foreground" : "text-muted-foreground"}`}>{n.title}</p>
                  <p className="text-xs text-muted-foreground shrink-0 flex items-center gap-1"><RiTimeLine />{n.time}</p>
                </div>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{n.message}</p>
              </div>
              <div className="flex flex-col items-end gap-2">
                {!n.read && <div className="w-2 h-2 rounded-full bg-primary shrink-0" />}
                <button onClick={(e) => { e.stopPropagation(); deleteNotification(n.id); }}
                  className="w-7 h-7 rounded-lg hover:bg-destructive/10 text-destructive flex items-center justify-center transition-colors">
                  <RiDeleteBinLine className="text-sm" />
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}

function Profile() {
  const { user } = useAuth();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: user?.name || "", phone: user?.phone || "", address: user?.address || "" });
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-3xl font-bold">My Profile</h1>
        <button onClick={() => setEditing(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 text-primary font-medium text-sm hover:bg-primary/20 transition-colors">
          <RiEditLine /> Edit Profile
        </button>
      </div>
      <div className="bg-card rounded-2xl p-6 shadow-card">
        <div className="flex items-center gap-5 mb-6 pb-6 border-b border-border">
          <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-white font-bold text-2xl">{user?.name?.charAt(0)}</div>
          <div>
            <h2 className="font-semibold text-xl">{user?.name}</h2>
            <p className="text-muted-foreground text-sm">{user?.email}</p>
            <span className="inline-block mt-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium capitalize">{user?.role}</span>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[["Phone", user?.phone], ["Address", user?.address], ["Member Since", user?.joinedAt], ["Email", user?.email]].map(([label, val]) => (
            <div key={label}>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">{label}</p>
              <p className="font-medium text-sm">{val || "—"}</p>
            </div>
          ))}
        </div>
      </div>
      <Modal isOpen={editing} onClose={() => setEditing(false)} title="Edit Profile">
        <div className="space-y-4">
          {[["Full Name", "name", "text"], ["Phone", "phone", "tel"], ["Address", "address", "text"]].map(([label, key, type]) => (
            <div key={key}>
              <label className="text-sm font-medium mb-2 block">{label}</label>
              <input type={type} value={form[key as keyof typeof form]} onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm" />
            </div>
          ))}
          <button onClick={() => { setEditing(false); toast.success("Profile updated successfully!"); }}
            className="w-full py-3 rounded-xl bg-primary text-white font-semibold hover:bg-primary/90 transition-all">Save Changes</button>
        </div>
      </Modal>
    </div>
  );
}

export default function CustomerDashboard() {
  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <DashboardSidebar role="customer" />
      <main className="flex-1 overflow-y-auto">
        <div className="p-6 md:p-8 max-w-5xl mx-auto">
          <Routes>
            <Route index element={<Overview />} />
            <Route path="orders" element={<MyOrders />} />
            <Route path="cart" element={<Cart />} />
            <Route path="wishlist" element={<Wishlist />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="subscriptions" element={
              <div>
                <h1 className="font-serif text-3xl font-bold mb-6">My Subscriptions</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {SUBSCRIPTIONS.slice(0, 2).map((sub) => (
                    <div key={sub.id} className="bg-card rounded-2xl p-5 shadow-card border border-border">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-serif font-bold text-xl">{sub.name}</h3>
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">Active</span>
                      </div>
                      <p className="text-2xl font-bold text-primary mb-1">${sub.price}<span className="text-sm text-muted-foreground font-normal">/{sub.duration}</span></p>
                      <p className="text-muted-foreground text-sm mb-4">{sub.description}</p>
                      <div className="flex gap-2">
                        <button onClick={() => toast.success("Subscription paused.")} className="px-4 py-2 rounded-xl border border-border text-sm hover:bg-muted transition-colors">Pause</button>
                        <button onClick={() => toast.success("Subscription cancelled.")} className="px-4 py-2 rounded-xl border border-destructive/30 text-destructive text-sm hover:bg-destructive/10 transition-colors">Cancel</button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 p-5 bg-card rounded-2xl shadow-card border border-dashed border-primary/30 text-center">
                  <p className="text-muted-foreground text-sm mb-3">Explore more subscription plans</p>
                  <Link to="/subscription" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-primary/90 transition-all">
                    View Plans
                  </Link>
                </div>
              </div>
            } />
            <Route path="profile" element={<Profile />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}
