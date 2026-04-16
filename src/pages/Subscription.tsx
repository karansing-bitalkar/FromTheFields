import { useState } from "react";
import { motion } from "framer-motion";
import { RiCheckLine, RiArrowRightLine, RiLeafLine, RiCalendarLine, RiRefreshLine, RiShieldCheckLine } from "react-icons/ri";
import PageLayout from "@/components/layout/PageLayout";
import { SUBSCRIPTIONS } from "@/lib/mockData";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";

const FEATURES = [
  { icon: RiLeafLine, title: "Always Fresh", desc: "Produce is harvested within 24 hours of your delivery day." },
  { icon: RiCalendarLine, title: "Flexible Delivery", desc: "Choose your delivery day and change it anytime with 48 hours notice." },
  { icon: RiRefreshLine, title: "Easy Pause & Cancel", desc: "No lock-ins. Pause, modify, or cancel any time from your dashboard." },
  { icon: RiShieldCheckLine, title: "Freshness Guarantee", desc: "Not satisfied? We'll replace or refund — no questions asked." },
];

const FAQS = [
  { q: "How does delivery work?", a: "We partner with local delivery networks to bring your box from the farm directly to your door on your chosen day, typically within 24 hours of harvest." },
  { q: "Can I customize my box?", a: "Yes! Harvest and Abundance plan subscribers can set preferences and exclude items they don't like from their profile dashboard." },
  { q: "What happens if I'm not home?", a: "We'll leave the box in a designated safe spot you specify during checkout. Our insulated packaging keeps produce fresh for up to 4 hours." },
  { q: "How far in advance can I change my order?", a: "Changes can be made up to 48 hours before your delivery window. Log into your customer dashboard to manage your subscription." },
  { q: "Is there a minimum commitment?", a: "No! All plans are week-to-week or month-to-month. Cancel anytime without penalties." },
];

export default function Subscription() {
  const [billing, setBilling] = useState<"weekly" | "monthly">("weekly");
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const filteredPlans = SUBSCRIPTIONS.filter((s) => s.duration === billing || (billing === "monthly" && s.id === "sub-monthly"));

  const handleSubscribe = (planName: string) => {
    if (!isAuthenticated) {
      toast.error("Please login to subscribe", {
        action: { label: "Login", onClick: () => navigate("/login") },
      });
      return;
    }
    toast.success(`Subscribed to ${planName} plan!`);
    navigate("/dashboard/customer");
  };

  return (
    <PageLayout>
      {/* Hero */}
      <section className="pt-32 pb-16 bg-hero-pattern text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="container mx-auto">
          <p className="text-primary font-medium text-sm uppercase tracking-widest mb-3">Subscription Plans</p>
          <h1 className="font-serif text-5xl md:text-6xl font-bold mb-6">
            Fresh Every Week.<br />
            <span className="text-primary">Zero Effort.</span>
          </h1>
          <p className="text-muted-foreground text-xl max-w-2xl mx-auto mb-10">
            Set it and forget it. We'll deliver the freshest seasonal produce straight from local farms to your doorstep on a schedule that works for you.
          </p>

          {/* Toggle */}
          <div className="inline-flex bg-muted rounded-2xl p-1 mb-4">
            {(["weekly", "monthly"] as const).map((b) => (
              <button
                key={b}
                onClick={() => setBilling(b)}
                className={`px-6 py-2.5 rounded-xl text-sm font-medium transition-all capitalize ${billing === b ? "bg-card shadow-sm text-foreground" : "text-muted-foreground"}`}
              >
                {b === "monthly" ? "Monthly (Save 15%)" : "Weekly"}
              </button>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Plans */}
      <section className="py-16">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {SUBSCRIPTIONS.map((plan, i) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`relative rounded-3xl p-7 ${plan.popular ? "bg-primary text-white ring-4 ring-primary/20" : "bg-card border border-border"} shadow-lg`}
              >
                {plan.popular && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-5 py-1.5 bg-accent rounded-full text-xs font-bold text-white shadow-sm">Most Popular</span>
                )}
                <div className={`text-sm font-medium uppercase tracking-widest mb-2 ${plan.popular ? "text-white/70" : "text-primary"}`}>{plan.duration}</div>
                <h3 className={`font-serif text-2xl font-bold mb-2 ${plan.popular ? "text-white" : ""}`}>{plan.name}</h3>
                <p className={`text-sm mb-5 leading-relaxed ${plan.popular ? "text-white/70" : "text-muted-foreground"}`}>{plan.description}</p>
                <div className="mb-6">
                  <span className={`text-4xl font-bold font-serif ${plan.popular ? "text-white" : "text-primary"}`}>${plan.price}</span>
                  <span className={`text-sm ml-1 ${plan.popular ? "text-white/60" : "text-muted-foreground"}`}>/{plan.duration}</span>
                </div>
                <ul className="space-y-2.5 mb-7">
                  {plan.items.map((item) => (
                    <li key={item} className={`flex items-center gap-2 text-sm ${plan.popular ? "text-white/90" : ""}`}>
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${plan.popular ? "bg-white/20" : "bg-primary/10"}`}>
                        <RiCheckLine className={`text-xs ${plan.popular ? "text-white" : "text-primary"}`} />
                      </div>
                      {item}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => handleSubscribe(plan.name)}
                  className={`w-full py-3 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
                    plan.popular ? "bg-white text-primary hover:bg-white/90" : "bg-primary text-white hover:bg-primary/90"
                  }`}
                >
                  Subscribe Now <RiArrowRightLine />
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="section-padding bg-muted/40">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-serif text-4xl font-bold">Every Plan Includes</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((feat, i) => {
              const Icon = feat.icon;
              return (
                <motion.div key={feat.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  className="bg-card rounded-2xl p-6 shadow-card text-center">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Icon className="text-primary text-2xl" />
                  </div>
                  <h3 className="font-semibold mb-2">{feat.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{feat.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="section-padding">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-serif text-4xl font-bold">Plan Comparison</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-4 pr-6 font-medium text-muted-foreground text-sm">Feature</th>
                  {SUBSCRIPTIONS.map((p) => (
                    <th key={p.id} className={`py-4 px-6 text-center text-sm font-semibold ${p.popular ? "text-primary" : ""}`}>{p.name}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ["Vegetables", "5", "8", "12", "Full monthly"],
                  ["Fruits", "2", "4", "6", "Premium selection"],
                  ["Eggs", "—", "1 dozen", "1 dozen", "2 dozen"],
                  ["Free Delivery", "—", "—", "—", "✓"],
                  ["Custom Preferences", "—", "✓", "✓", "✓"],
                  ["Priority Support", "—", "—", "✓", "✓"],
                ].map(([feature, ...vals]) => (
                  <tr key={feature} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                    <td className="py-4 pr-6 text-sm font-medium">{feature}</td>
                    {vals.map((val, j) => (
                      <td key={j} className="py-4 px-6 text-center text-sm text-muted-foreground">{val}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-padding bg-muted/40">
        <div className="container mx-auto max-w-2xl">
          <div className="text-center mb-12">
            <h2 className="font-serif text-4xl font-bold">Frequently Asked</h2>
          </div>
          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <div key={i} className="bg-card rounded-2xl overflow-hidden shadow-sm">
                <button onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left font-medium">
                  {faq.q}
                  <span className={`transition-transform text-primary text-xl ml-4 ${expandedFaq === i ? "rotate-45" : ""}`}>+</span>
                </button>
                {expandedFaq === i && (
                  <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} className="overflow-hidden">
                    <p className="px-5 pb-5 text-muted-foreground text-sm leading-relaxed">{faq.a}</p>
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
