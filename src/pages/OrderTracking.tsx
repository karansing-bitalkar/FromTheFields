import { useParams, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  RiCheckboxCircleLine,
  RiTruckLine,
  RiMapPinLine,
  RiPhoneLine,
  RiArrowLeftLine,
  RiTimeLine,
  RiUserLine,
  RiStarLine,
  RiLeafLine,
  RiShoppingBagLine,
} from "react-icons/ri";
import PageLayout from "@/components/layout/PageLayout";
import { ORDERS } from "@/lib/mockData";

const STEPS = [
  { key: "confirmed", label: "Order Confirmed", desc: "Your order has been placed and confirmed.", icon: RiCheckboxCircleLine },
  { key: "picked",    label: "Picked Up",       desc: "Farmer has packed and handed over to delivery.", icon: RiLeafLine },
  { key: "in-transit",label: "In Transit",      desc: "Your order is on the way to your address.", icon: RiTruckLine },
  { key: "delivered", label: "Delivered",        desc: "Package delivered successfully.", icon: RiShoppingBagLine },
];

const STATUS_INDEX: Record<string, number> = {
  pending: -1,
  confirmed: 0,
  picked: 1,
  "in-transit": 2,
  delivered: 3,
  cancelled: -1,
};

const ETA: Record<string, string> = {
  confirmed:  "Estimated delivery in 2–4 hours",
  picked:     "Estimated delivery in 1–2 hours",
  "in-transit": "Estimated delivery in 30–60 mins",
  delivered:  "Delivered — Thank you!",
  pending:    "Awaiting confirmation",
  cancelled:  "Order Cancelled",
};

const PARTNER = {
  name: "Mike Rider",
  phone: "+1 555-0404",
  vehicle: "Electric Bike · EB-4421",
  avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80",
  rating: 4.9,
  trips: 348,
};

export default function OrderTracking() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const order = ORDERS.find((o) => o.id === id) ?? ORDERS[1]; // fallback to in-transit order for demo
  const currentStep = STATUS_INDEX[order.status] ?? 0;
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setPulse((p) => !p), 1800);
    return () => clearInterval(t);
  }, []);

  return (
    <PageLayout>
      <section className="pt-32 pb-10 bg-hero-pattern">
        <div className="container mx-auto max-w-4xl">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 text-sm transition-colors">
            <RiArrowLeftLine /> Back
          </button>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-primary font-medium text-sm uppercase tracking-widest mb-1">Live Tracking</p>
            <h1 className="font-serif text-4xl font-bold mb-1">Order {order.id}</h1>
            <p className="text-muted-foreground">Placed on {order.date} · {order.deliveryAddress}</p>
          </motion.div>
        </div>
      </section>

      <section className="py-10">
        <div className="container mx-auto max-w-4xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Left: Timeline + ETA */}
            <div className="lg:col-span-2 space-y-6">

              {/* ETA Banner */}
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                className="bg-primary text-white rounded-2xl p-5 flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full bg-white/20 flex items-center justify-center shrink-0 transition-all duration-700 ${pulse ? "scale-110" : "scale-100"}`}>
                  <RiTimeLine className="text-2xl" />
                </div>
                <div>
                  <p className="font-bold text-lg">{ETA[order.status]}</p>
                  <p className="text-white/70 text-sm">{order.deliveryAddress}</p>
                </div>
              </motion.div>

              {/* Step Timeline */}
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
                className="bg-card rounded-2xl shadow-card p-6">
                <h2 className="font-semibold mb-6">Delivery Timeline</h2>
                <div className="relative">
                  {/* Vertical connector line */}
                  <div className="absolute left-5 top-6 bottom-6 w-0.5 bg-border" />
                  <div
                    className="absolute left-5 top-6 w-0.5 bg-primary transition-all duration-700"
                    style={{ height: `${Math.max(0, currentStep) * (100 / (STEPS.length - 1))}%` }}
                  />

                  <div className="space-y-8">
                    {STEPS.map((step, i) => {
                      const Icon = step.icon;
                      const done = i <= currentStep;
                      const active = i === currentStep;
                      return (
                        <motion.div key={step.key}
                          initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.2 + i * 0.08 }}
                          className="flex items-start gap-5 relative">
                          {/* Circle icon */}
                          <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center shrink-0 border-2 transition-all duration-500
                            ${done ? "bg-primary border-primary text-white" : "bg-card border-border text-muted-foreground"}`}>
                            <Icon className="text-base" />
                            {active && order.status !== "delivered" && (
                              <span className="absolute inset-0 rounded-full bg-primary animate-ping opacity-30" />
                            )}
                          </div>
                          <div className="pt-1.5 flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className={`font-semibold text-sm ${done ? "text-foreground" : "text-muted-foreground"}`}>{step.label}</p>
                              {active && order.status !== "delivered" && (
                                <span className="px-2 py-0.5 rounded-full text-xs bg-primary/10 text-primary font-medium animate-pulse">In Progress</span>
                              )}
                              {done && i < currentStep && (
                                <span className="px-2 py-0.5 rounded-full text-xs bg-green-100 text-green-700 font-medium">Done</span>
                              )}
                              {i === currentStep && order.status === "delivered" && (
                                <span className="px-2 py-0.5 rounded-full text-xs bg-green-100 text-green-700 font-medium">Completed</span>
                              )}
                            </div>
                            <p className={`text-xs mt-0.5 ${done ? "text-muted-foreground" : "text-muted-foreground/50"}`}>{step.desc}</p>
                            {done && (
                              <p className="text-xs text-primary/70 mt-0.5 font-medium">
                                {i === 0 ? order.date + " · Confirmed" : i === 1 ? "Packed & ready" : i === 2 ? "On the way" : "Delivered ✓"}
                              </p>
                            )}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>

              {/* Order Items */}
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
                className="bg-card rounded-2xl shadow-card p-6">
                <h2 className="font-semibold mb-4">Order Items</h2>
                <div className="space-y-3">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex items-center gap-4 p-3 rounded-xl bg-muted/30">
                      <img src={item.product.image} alt={item.product.name}
                        className="w-14 h-14 rounded-xl object-cover" />
                      <div className="flex-1">
                        <p className="font-medium text-sm">{item.product.name}</p>
                        <p className="text-xs text-muted-foreground">by {item.product.farmer}</p>
                        <p className="text-xs text-muted-foreground">Qty: {item.quantity} × ${item.product.price.toFixed(2)}</p>
                      </div>
                      <p className="font-bold text-primary text-sm">${(item.quantity * item.product.price).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
                <div className="border-t border-border mt-4 pt-4 flex justify-between items-center">
                  <span className="font-semibold">Total</span>
                  <span className="font-bold text-primary text-lg">${order.total.toFixed(2)}</span>
                </div>
              </motion.div>
            </div>

            {/* Right: Delivery Partner + Address */}
            <div className="space-y-6">

              {/* Delivery Partner Card */}
              {order.deliveryPartnerId && (
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
                  className="bg-card rounded-2xl shadow-card p-6">
                  <h2 className="font-semibold mb-4">Delivery Partner</h2>
                  <div className="flex items-center gap-3 mb-4">
                    <img src={PARTNER.avatar} alt={PARTNER.name}
                      className="w-14 h-14 rounded-full object-cover border-2 border-primary/20" />
                    <div>
                      <p className="font-bold">{PARTNER.name}</p>
                      <div className="flex items-center gap-1 text-xs text-yellow-500">
                        <RiStarLine className="fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold text-foreground">{PARTNER.rating}</span>
                        <span className="text-muted-foreground">· {PARTNER.trips} deliveries</span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-muted/40 rounded-xl p-3 mb-4 text-sm text-muted-foreground">
                    <RiTruckLine className="inline text-primary mr-1.5" />
                    {PARTNER.vehicle}
                  </div>
                  <a href={`tel:${PARTNER.phone}`}
                    className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-primary/90 transition-all">
                    <RiPhoneLine /> Call Partner
                  </a>
                </motion.div>
              )}

              {/* Delivery Address */}
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                className="bg-card rounded-2xl shadow-card p-6">
                <h2 className="font-semibold mb-4">Delivery Address</h2>
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                    <RiMapPinLine className="text-primary text-lg" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{order.customerName}</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">{order.deliveryAddress}</p>
                  </div>
                </div>
                {/* Mini map placeholder */}
                <div className="bg-muted/40 rounded-xl h-32 flex items-center justify-center border border-border">
                  <div className="text-center text-muted-foreground text-xs">
                    <RiMapPinLine className="text-3xl text-primary mx-auto mb-1" />
                    Interactive map
                  </div>
                </div>
              </motion.div>

              {/* Help */}
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
                className="bg-card rounded-2xl shadow-card p-6">
                <h2 className="font-semibold mb-3">Need Help?</h2>
                <p className="text-muted-foreground text-sm mb-4">Issue with your order? Our support team is available 24/7.</p>
                <Link to="/contact"
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-border text-sm font-medium hover:bg-muted transition-colors">
                  <RiUserLine /> Contact Support
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
