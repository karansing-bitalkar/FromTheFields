import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  RiArrowLeftLine, RiArrowRightLine, RiCheckboxCircleLine,
  RiTruckLine, RiMoneyDollarCircleLine, RiShoppingBagLine,
  RiTimeLine, RiMapPinLine, RiSmartphoneLine, RiBankCardLine, RiCashLine,
  RiLeafLine, RiShieldCheckLine,
} from "react-icons/ri";
import PageLayout from "@/components/layout/PageLayout";
import { PRODUCTS } from "@/lib/mockData";
import { toast } from "sonner";

const STEPS = [
  { key: "slot", label: "Delivery Slot", icon: RiTimeLine },
  { key: "payment", label: "Payment", icon: RiMoneyDollarCircleLine },
  { key: "review", label: "Review Order", icon: RiShoppingBagLine },
  { key: "confirm", label: "Confirmation", icon: RiCheckboxCircleLine },
];

const SLOTS = [
  { id: "morning", label: "Morning", time: "7:00 AM – 11:00 AM", note: "Best for fresh harvest" },
  { id: "afternoon", label: "Afternoon", time: "12:00 PM – 4:00 PM", note: "Most popular slot" },
  { id: "evening", label: "Evening", time: "5:00 PM – 8:00 PM", note: "After-work delivery" },
];

const PAYMENT_METHODS = [
  { id: "upi", label: "UPI", icon: RiSmartphoneLine, desc: "Pay via any UPI app" },
  { id: "card", label: "Card", icon: RiBankCardLine, desc: "Visa, Mastercard, Amex" },
  { id: "cod", label: "Cash on Delivery", icon: RiCashLine, desc: "Pay when you receive" },
];

const CART_ITEMS = PRODUCTS.slice(0, 3).map((p) => ({ product: p, quantity: 1 }));
const subtotal = CART_ITEMS.reduce((a, i) => a + i.product.price * i.quantity, 0);
const delivery = 0;
const total = subtotal + delivery;

function StepIndicator({ currentStep }: { currentStep: number }) {
  return (
    <div className="flex items-center justify-center gap-0 mb-10 flex-wrap">
      {STEPS.map((step, i) => {
        const Icon = step.icon;
        const done = i < currentStep;
        const active = i === currentStep;
        return (
          <div key={step.key} className="flex items-center">
            <div className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                done ? "bg-primary border-primary text-white" : active ? "border-primary text-primary bg-primary/10" : "border-border text-muted-foreground"
              }`}>
                {done ? <RiCheckboxCircleLine className="text-lg" /> : <Icon className="text-base" />}
              </div>
              <p className={`text-xs mt-1.5 font-medium whitespace-nowrap ${active ? "text-primary" : done ? "text-primary/70" : "text-muted-foreground"}`}>
                {step.label}
              </p>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`w-12 h-0.5 mb-5 mx-1 rounded-full transition-all ${i < currentStep ? "bg-primary" : "bg-border"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

function SlotStep({ selected, onSelect }: { selected: string; onSelect: (id: string) => void }) {
  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
      <h2 className="font-serif text-2xl font-bold mb-2">Choose Delivery Slot</h2>
      <p className="text-muted-foreground text-sm mb-6">Select a time window for your delivery today.</p>
      <div className="space-y-3 mb-6">
        {SLOTS.map((slot) => (
          <button key={slot.id} onClick={() => onSelect(slot.id)}
            className={`w-full p-4 rounded-2xl border-2 text-left transition-all flex items-center gap-4 ${
              selected === slot.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/40 hover:bg-muted/30"
            }`}>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
              selected === slot.id ? "bg-primary text-white" : "bg-muted text-muted-foreground"
            }`}>
              <RiTimeLine className="text-xl" />
            </div>
            <div className="flex-1">
              <p className="font-semibold">{slot.label}</p>
              <p className="text-muted-foreground text-sm">{slot.time}</p>
            </div>
            <span className="text-xs text-primary bg-primary/10 px-3 py-1 rounded-full font-medium">{slot.note}</span>
            {selected === slot.id && <RiCheckboxCircleLine className="text-primary text-xl shrink-0" />}
          </button>
        ))}
      </div>
      <div className="bg-muted/30 rounded-2xl p-4 flex items-center gap-3 text-sm text-muted-foreground">
        <RiMapPinLine className="text-primary text-xl shrink-0" />
        <div>
          <p className="font-medium text-foreground">Delivering to</p>
          <p>123 Main St, Springfield, IL 62701</p>
        </div>
      </div>
    </motion.div>
  );
}

function PaymentStep({ selected, onSelect }: { selected: string; onSelect: (id: string) => void }) {
  const [upiId, setUpiId] = useState("");
  const [cardNum, setCardNum] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
      <h2 className="font-serif text-2xl font-bold mb-2">Payment Method</h2>
      <p className="text-muted-foreground text-sm mb-6">Choose how you'd like to pay.</p>
      <div className="space-y-3 mb-6">
        {PAYMENT_METHODS.map((method) => {
          const Icon = method.icon;
          return (
            <div key={method.id}>
              <button onClick={() => onSelect(method.id)}
                className={`w-full p-4 rounded-2xl border-2 text-left transition-all flex items-center gap-4 ${
                  selected === method.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"
                }`}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${selected === method.id ? "bg-primary text-white" : "bg-muted text-muted-foreground"}`}>
                  <Icon className="text-xl" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold">{method.label}</p>
                  <p className="text-muted-foreground text-sm">{method.desc}</p>
                </div>
                {selected === method.id && <RiCheckboxCircleLine className="text-primary text-xl" />}
              </button>
              {/* Inline form */}
              <AnimatePresence>
                {selected === method.id && method.id === "upi" && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden">
                    <div className="border border-t-0 border-border rounded-b-2xl p-4 bg-card">
                      <label className="text-sm font-medium mb-2 block">UPI ID</label>
                      <input value={upiId} onChange={(e) => setUpiId(e.target.value)} placeholder="yourname@upi"
                        className="w-full px-4 py-3 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm" />
                    </div>
                  </motion.div>
                )}
                {selected === method.id && method.id === "card" && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden">
                    <div className="border border-t-0 border-border rounded-b-2xl p-4 bg-card space-y-3">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Card Number</label>
                        <input value={cardNum} onChange={(e) => setCardNum(e.target.value)} placeholder="1234 5678 9012 3456"
                          className="w-full px-4 py-3 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm" />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-sm font-medium mb-2 block">Expiry</label>
                          <input value={expiry} onChange={(e) => setExpiry(e.target.value)} placeholder="MM/YY"
                            className="w-full px-4 py-3 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm" />
                        </div>
                        <div>
                          <label className="text-sm font-medium mb-2 block">CVV</label>
                          <input value={cvv} onChange={(e) => setCvv(e.target.value)} placeholder="•••"
                            className="w-full px-4 py-3 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm" />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
                {selected === method.id && method.id === "cod" && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden">
                    <div className="border border-t-0 border-border rounded-b-2xl p-4 bg-card">
                      <p className="text-sm text-muted-foreground flex items-center gap-2">
                        <RiShieldCheckLine className="text-primary" /> Pay in cash when your order arrives at your door.
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}

function ReviewStep({ slot, payment }: { slot: string; payment: string }) {
  const slotObj = SLOTS.find((s) => s.id === slot);
  const payObj = PAYMENT_METHODS.find((p) => p.id === payment);
  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
      <h2 className="font-serif text-2xl font-bold mb-2">Review Your Order</h2>
      <p className="text-muted-foreground text-sm mb-6">Please check all details before placing your order.</p>

      {/* Items */}
      <div className="bg-card rounded-2xl shadow-card p-5 mb-4">
        <h3 className="font-semibold mb-4">Order Items</h3>
        <div className="space-y-3">
          {CART_ITEMS.map((item) => (
            <div key={item.product.id} className="flex items-center gap-3">
              <img src={item.product.image} alt={item.product.name} className="w-12 h-12 rounded-xl object-cover" />
              <div className="flex-1">
                <p className="font-medium text-sm">{item.product.name}</p>
                <p className="text-xs text-muted-foreground">by {item.product.farmer}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-primary text-sm">${(item.product.price * item.quantity).toFixed(2)}</p>
                <p className="text-xs text-muted-foreground">x{item.quantity}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="border-t border-border mt-4 pt-4 space-y-2 text-sm">
          <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Delivery</span><span className="text-primary font-medium">Free</span></div>
          <div className="flex justify-between font-bold text-base pt-1 border-t border-border">
            <span>Total</span><span className="text-primary">${total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Delivery & Payment Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-card rounded-2xl p-4 shadow-card">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Delivery Slot</p>
          <div className="flex items-center gap-2">
            <RiTimeLine className="text-primary" />
            <div>
              <p className="font-semibold text-sm">{slotObj?.label}</p>
              <p className="text-xs text-muted-foreground">{slotObj?.time}</p>
            </div>
          </div>
        </div>
        <div className="bg-card rounded-2xl p-4 shadow-card">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Payment</p>
          <div className="flex items-center gap-2">
            <RiMoneyDollarCircleLine className="text-primary" />
            <div>
              <p className="font-semibold text-sm">{payObj?.label}</p>
              <p className="text-xs text-muted-foreground">{payObj?.desc}</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function ConfirmStep({ orderId, slot }: { orderId: string; slot: string }) {
  const slotObj = SLOTS.find((s) => s.id === slot);
  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
      <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-5">
        <RiCheckboxCircleLine className="text-green-600 text-4xl" />
      </div>
      <h2 className="font-serif text-3xl font-bold mb-2 text-green-600">Order Placed!</h2>
      <p className="text-muted-foreground mb-6">Your order has been confirmed and is being processed.</p>

      <div className="bg-card rounded-2xl shadow-card p-6 text-left mb-6 max-w-sm mx-auto">
        <div className="space-y-3">
          {[
            ["Order ID", orderId],
            ["Delivery Slot", slotObj ? `${slotObj.label} · ${slotObj.time}` : "—"],
            ["Total Paid", `$${total.toFixed(2)}`],
            ["Estimated Delivery", "Today by " + (slot === "morning" ? "11:00 AM" : slot === "afternoon" ? "4:00 PM" : "8:00 PM")],
          ].map(([label, val]) => (
            <div key={label} className="flex justify-between text-sm">
              <span className="text-muted-foreground">{label}</span>
              <span className="font-semibold">{val}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link to={`/order/${orderId}/track`}
          className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-primary/90 transition-all">
          <RiTruckLine /> Track Order
        </Link>
        <Link to="/marketplace"
          className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-border font-semibold text-sm hover:bg-muted transition-colors">
          <RiLeafLine /> Continue Shopping
        </Link>
      </div>
    </motion.div>
  );
}

export default function Checkout() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [selectedSlot, setSelectedSlot] = useState("morning");
  const [selectedPayment, setSelectedPayment] = useState("upi");
  const orderId = "ORD-" + Math.floor(Math.random() * 900 + 100);

  const canProceed = () => {
    if (step === 0) return !!selectedSlot;
    if (step === 1) return !!selectedPayment;
    return true;
  };

  const handleNext = () => {
    if (!canProceed()) { toast.error("Please make a selection before continuing."); return; }
    if (step === 2) {
      toast.success("Order placed successfully!");
    }
    setStep((s) => Math.min(s + 1, 3));
  };

  return (
    <PageLayout>
      <section className="pt-32 pb-16">
        <div className="container mx-auto max-w-4xl">
          {step < 3 && (
            <button onClick={() => step === 0 ? navigate(-1) : setStep((s) => s - 1)}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 text-sm transition-colors">
              <RiArrowLeftLine /> {step === 0 ? "Back to Cart" : "Back"}
            </button>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2">
              <div className="bg-card rounded-3xl shadow-card p-8">
                <StepIndicator currentStep={step} />

                <AnimatePresence mode="wait">
                  {step === 0 && <SlotStep key="slot" selected={selectedSlot} onSelect={setSelectedSlot} />}
                  {step === 1 && <PaymentStep key="payment" selected={selectedPayment} onSelect={setSelectedPayment} />}
                  {step === 2 && <ReviewStep key="review" slot={selectedSlot} payment={selectedPayment} />}
                  {step === 3 && <ConfirmStep key="confirm" orderId={orderId} slot={selectedSlot} />}
                </AnimatePresence>

                {step < 3 && (
                  <button onClick={handleNext}
                    className="mt-8 w-full py-3.5 rounded-xl bg-primary text-white font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-all shadow-sm text-base">
                    {step === 2 ? "Place Order" : "Continue"} <RiArrowRightLine />
                  </button>
                )}
              </div>
            </div>

            {/* Order Summary Sidebar */}
            {step < 3 && (
              <div className="lg:col-span-1">
                <div className="bg-card rounded-2xl shadow-card p-5 sticky top-24">
                  <h3 className="font-semibold mb-4">Order Summary</h3>
                  <div className="space-y-3 mb-4">
                    {CART_ITEMS.map((item) => (
                      <div key={item.product.id} className="flex items-center gap-3">
                        <img src={item.product.image} alt={item.product.name} className="w-10 h-10 rounded-xl object-cover" />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{item.product.name}</p>
                          <p className="text-xs text-muted-foreground">x{item.quantity}</p>
                        </div>
                        <p className="font-semibold text-sm text-primary shrink-0">${(item.product.price * item.quantity).toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-border pt-3 space-y-2 text-sm">
                    <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Delivery</span><span className="text-primary font-medium">Free</span></div>
                    <div className="flex justify-between font-bold text-base pt-1 border-t border-border">
                      <span>Total</span><span className="text-primary">${total.toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="mt-4 space-y-2">
                    {[[RiLeafLine, "Farm-fresh produce"], [RiShieldCheckLine, "Secure checkout"], [RiTruckLine, "Free delivery"]].map(([Icon, text], i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Icon className="text-primary shrink-0" />
                        {text as string}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
