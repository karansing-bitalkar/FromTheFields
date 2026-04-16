import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { motion } from "framer-motion";
import {
  RiTruckLine, RiCheckboxCircleLine, RiTimeLine, RiMapPinLine, RiRouteLine,
  RiPhoneLine, RiMoneyDollarCircleLine, RiUserLine, RiEditLine,
} from "react-icons/ri";
import DashboardSidebar from "@/components/features/DashboardSidebar";
import Modal from "@/components/ui/Modal";
import { ORDERS } from "@/lib/mockData";
import { useNotifications } from "@/hooks/useNotifications";
import { toast } from "sonner";

const myOrders = ORDERS.filter((o) => o.deliveryPartnerId === "del-001");

const statusColors: Record<string, string> = {
  pending:      "bg-yellow-100 text-yellow-700",
  confirmed:    "bg-blue-100 text-blue-700",
  picked:       "bg-purple-100 text-purple-700",
  "in-transit": "bg-orange-100 text-orange-700",
  delivered:    "bg-green-100 text-green-700",
  cancelled:    "bg-red-100 text-red-700",
};

const NEXT_STATUS: Record<string, string> = {
  confirmed:    "picked",
  picked:       "in-transit",
  "in-transit": "delivered",
};

const STATUS_LABEL: Record<string, string> = {
  picked:       "Mark as Picked Up",
  "in-transit": "Mark In Transit",
  delivered:    "Mark Delivered",
};

// Notification messages for each transition
const STATUS_NOTIFICATIONS: Record<string, { title: string; message: (id: string) => string; type: "delivery" | "order" }> = {
  picked:       { type: "delivery", title: "Order Picked Up",  message: (id) => `Your order ${id} has been picked up by the delivery partner.` },
  "in-transit": { type: "delivery", title: "Order In Transit", message: (id) => `Your order ${id} is on the way! Estimated delivery in 45 mins.` },
  delivered:    { type: "order",    title: "Order Delivered!",  message: (id) => `Your order ${id} has been delivered successfully. Enjoy!` },
};

function useOrdersWithNotifications() {
  const [orders, setOrders] = useState(myOrders);
  const { pushNotification } = useNotifications();

  const updateStatus = (id: string, currentStatus: string) => {
    const next = NEXT_STATUS[currentStatus];
    if (!next) return;
    setOrders((prev) => prev.map((o) => o.id === id ? { ...o, status: next as any } : o));

    // Push notification to shared context
    const notifConfig = STATUS_NOTIFICATIONS[next];
    if (notifConfig) {
      pushNotification({
        type: notifConfig.type,
        title: notifConfig.title,
        message: notifConfig.message(id),
        time: "Just now",
      });
    }

    toast.success(`Order ${id} updated → ${next.replace("-", " ")}.`);
  };

  return { orders, updateStatus };
}

function Overview() {
  const { orders } = useOrdersWithNotifications();
  const pending   = orders.filter((o) => o.status !== "delivered").length;
  const delivered = orders.filter((o) => o.status === "delivered").length;
  return (
    <div>
      <h1 className="font-serif text-3xl font-bold mb-2">Delivery Dashboard</h1>
      <p className="text-muted-foreground mb-8">Manage your assigned deliveries and track routes.</p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
        {[
          { label: "Assigned Orders",  value: orders.length, icon: RiTruckLine,          color: "bg-blue-50 text-blue-600"   },
          { label: "Pending Delivery", value: pending,        icon: RiTimeLine,           color: "bg-yellow-50 text-yellow-600" },
          { label: "Delivered Today",  value: delivered,      icon: RiCheckboxCircleLine, color: "bg-green-50 text-green-600"  },
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
          <h2 className="font-semibold mb-4">Today's Route Summary</h2>
          <div className="space-y-3">
            {orders.map((order, i) => (
              <div key={order.id} className="flex items-center gap-3 p-3 rounded-xl bg-muted/30">
                <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold shrink-0">{i + 1}</div>
                <div className="flex-1">
                  <p className="font-medium text-sm">{order.customerName}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1"><RiMapPinLine className="text-primary" />{order.deliveryAddress}</p>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[order.status]}`}>{order.status}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-card rounded-2xl p-6 shadow-card">
          <h2 className="font-semibold mb-4">Today's Earnings</h2>
          <div className="space-y-3">
            {[["Per Delivery", "$4.50"], ["Bonus (3+ deliveries)", "$5.00"], ["Total Today", "$18.50"], ["This Week", "$89.50"]].map(([label, val]) => (
              <div key={label} className="flex justify-between p-3 rounded-xl bg-muted/30 text-sm">
                <span className="text-muted-foreground">{label}</span>
                <span className="font-bold text-primary">{val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function AssignedOrders() {
  const { orders, updateStatus } = useOrdersWithNotifications();
  return (
    <div>
      <h1 className="font-serif text-3xl font-bold mb-6">Assigned Orders</h1>
      <div className="space-y-4">
        {orders.map((order) => {
          const next = NEXT_STATUS[order.status];
          return (
            <div key={order.id} className="bg-card rounded-2xl p-5 shadow-card border border-border">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div>
                  <p className="font-bold text-lg font-serif">{order.id}</p>
                  <p className="text-muted-foreground text-sm">{order.date} · ${order.total.toFixed(2)}</p>
                </div>
                <span className={`self-start sm:self-auto px-3 py-1.5 rounded-full text-xs font-semibold ${statusColors[order.status]}`}>
                  {order.status.replace("-", " ")}
                </span>
              </div>
              <div className="bg-muted/30 rounded-xl p-3 mb-4">
                <p className="text-sm font-medium flex items-center gap-1.5 mb-1"><RiMapPinLine className="text-primary" /> {order.deliveryAddress}</p>
                <p className="text-sm text-muted-foreground">Customer: <span className="font-medium text-foreground">{order.customerName}</span></p>
                <p className="text-sm text-muted-foreground flex items-center gap-1.5"><RiPhoneLine className="text-primary" /> +1 555-0101</p>
              </div>
              <div className="space-y-2 mb-4">
                {order.items.map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    <img src={item.product.image} alt={item.product.name} className="w-8 h-8 rounded-lg object-cover" />
                    <span className="flex-1">{item.product.name}</span>
                    <span className="text-muted-foreground">x{item.quantity}</span>
                  </div>
                ))}
              </div>
              {next ? (
                <button onClick={() => updateStatus(order.id, order.status)}
                  className="w-full py-2.5 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-primary/90 transition-all">
                  {STATUS_LABEL[next]}
                </button>
              ) : order.status === "delivered" && (
                <div className="text-center text-sm text-green-600 font-medium flex items-center justify-center gap-1 py-1">
                  <RiCheckboxCircleLine className="text-base" /> Delivered Successfully
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function DeliveryStatus() {
  const { orders, updateStatus } = useOrdersWithNotifications();
  const statuses = ["confirmed", "picked", "in-transit", "delivered"];
  return (
    <div>
      <h1 className="font-serif text-3xl font-bold mb-6">Delivery Status</h1>
      <div className="space-y-5">
        {orders.map((order) => {
          const currentIdx = statuses.indexOf(order.status);
          const next = NEXT_STATUS[order.status];
          return (
            <div key={order.id} className="bg-card rounded-2xl p-5 shadow-card border border-border">
              <div className="flex justify-between items-center mb-4">
                <p className="font-bold font-serif">{order.id}</p>
                <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${statusColors[order.status]}`}>{order.status.replace("-", " ")}</span>
              </div>
              <div className="flex gap-1 mb-4">
                {statuses.map((s, idx) => {
                  const isActive = idx <= currentIdx;
                  return (
                    <div key={s} className="flex-1 flex flex-col items-center gap-1">
                      <div className={`w-full h-2 rounded-full ${isActive ? "bg-primary" : "bg-muted"}`} />
                      <span className="text-xs text-muted-foreground capitalize hidden sm:block">{s.replace("-", " ")}</span>
                    </div>
                  );
                })}
              </div>
              <p className="text-sm text-muted-foreground mb-3 flex items-center gap-1"><RiMapPinLine className="text-primary" /> {order.deliveryAddress}</p>
              {next && (
                <button onClick={() => updateStatus(order.id, order.status)}
                  className="w-full py-2.5 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-primary/90 transition-all">
                  {STATUS_LABEL[next]}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function RouteInfo() {
  const { orders } = useOrdersWithNotifications();
  return (
    <div>
      <h1 className="font-serif text-3xl font-bold mb-6">Route Information</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-card rounded-2xl p-5 shadow-card">
          <h2 className="font-semibold mb-4 flex items-center gap-2"><RiRouteLine className="text-primary" /> Today's Route</h2>
          <div className="space-y-4">
            {orders.map((order, i) => (
              <div key={order.id} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold">{i + 1}</div>
                  {i < orders.length - 1 && <div className="w-0.5 h-8 bg-border mt-1" />}
                </div>
                <div>
                  <p className="font-medium text-sm">{order.customerName}</p>
                  <p className="text-muted-foreground text-xs flex items-center gap-1"><RiMapPinLine className="text-primary" />{order.deliveryAddress}</p>
                  <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[order.status]}`}>{order.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-card rounded-2xl p-5 shadow-card">
          <h2 className="font-semibold mb-4">Route Stats</h2>
          <div className="space-y-3">
            {[["Total Stops", orders.length], ["Est. Distance", "18.4 miles"], ["Est. Duration", "2h 15min"], ["Deliveries Done", orders.filter((o) => o.status === "delivered").length]].map(([label, val]) => (
              <div key={label} className="flex justify-between p-3 rounded-xl bg-muted/30 text-sm">
                <span className="text-muted-foreground">{label}</span>
                <span className="font-semibold">{val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="bg-muted/40 rounded-3xl h-64 flex items-center justify-center border border-border">
        <div className="text-center text-muted-foreground">
          <RiMapPinLine className="text-5xl text-primary mx-auto mb-3" />
          <p className="font-semibold">Route Map</p>
          <p className="text-sm">Interactive map available in full version</p>
        </div>
      </div>
    </div>
  );
}

function Earnings() {
  const { orders } = useOrdersWithNotifications();
  return (
    <div>
      <h1 className="font-serif text-3xl font-bold mb-6">Earnings</h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
        {[["Today", "$18.50", "text-primary"], ["This Week", "$89.50", "text-green-600"], ["This Month", "$312.00", "text-blue-600"]].map(([label, val, color]) => (
          <div key={label} className="bg-card rounded-2xl p-5 shadow-card">
            <p className="text-muted-foreground text-sm mb-1">{label}</p>
            <p className={`text-3xl font-bold font-serif ${color}`}>{val}</p>
          </div>
        ))}
      </div>
      <div className="bg-card rounded-2xl p-6 shadow-card">
        <h2 className="font-semibold mb-4">Per Delivery Breakdown</h2>
        <div className="space-y-3">
          {orders.map((order) => (
            <div key={order.id} className="flex items-center justify-between p-3 rounded-xl bg-muted/30">
              <div>
                <p className="font-medium text-sm">{order.id}</p>
                <p className="text-xs text-muted-foreground">{order.customerName} · {order.date}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-primary">$4.50</p>
                <span className={`text-xs font-medium capitalize px-2 py-0.5 rounded-full ${statusColors[order.status]}`}>{order.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function DeliveryProfile() {
  const [editing, setEditing] = useState(false);
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-3xl font-bold">My Profile</h1>
        <button onClick={() => setEditing(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 text-primary font-medium text-sm hover:bg-primary/20 transition-colors">
          <RiEditLine /> Edit
        </button>
      </div>
      <div className="bg-card rounded-2xl p-6 shadow-card">
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-border">
          <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-white font-bold text-2xl">M</div>
          <div>
            <h2 className="font-semibold text-xl">Mike Rider</h2>
            <p className="text-muted-foreground text-sm">delivery@test.com</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">Delivery Partner</span>
              <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium">Active</span>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[["Phone", "+1 555-0404"], ["Vehicle", "Electric Bike · EB-4421"], ["Rating", "4.9 ★"], ["Total Deliveries", "348"], ["Zone", "Springfield, IL"], ["Member Since", "Mar 10, 2024"]].map(([label, val]) => (
            <div key={label}>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">{label}</p>
              <p className="font-medium text-sm">{val}</p>
            </div>
          ))}
        </div>
      </div>
      <Modal isOpen={editing} onClose={() => setEditing(false)} title="Edit Profile">
        <div className="space-y-4">
          {[["Full Name", "Mike Rider"], ["Phone", "+1 555-0404"], ["Vehicle ID", "EB-4421"]].map(([label, val]) => (
            <div key={label}>
              <label className="text-sm font-medium mb-2 block">{label}</label>
              <input defaultValue={val} className="w-full px-4 py-3 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm" />
            </div>
          ))}
          <button onClick={() => { setEditing(false); toast.success("Profile updated!"); }}
            className="w-full py-3 rounded-xl bg-primary text-white font-semibold hover:bg-primary/90 transition-all">Save Changes</button>
        </div>
      </Modal>
    </div>
  );
}

export default function DeliveryDashboard() {
  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <DashboardSidebar role="delivery" />
      <main className="flex-1 overflow-y-auto">
        <div className="p-6 md:p-8 max-w-4xl mx-auto">
          <Routes>
            <Route index element={<Overview />} />
            <Route path="orders"   element={<AssignedOrders />} />
            <Route path="status"   element={<DeliveryStatus />} />
            <Route path="routes"   element={<RouteInfo />} />
            <Route path="earnings" element={<Earnings />} />
            <Route path="profile"  element={<DeliveryProfile />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}
