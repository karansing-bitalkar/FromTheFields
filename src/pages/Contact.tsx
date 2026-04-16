import { useState } from "react";
import { motion } from "framer-motion";
import { RiMailLine, RiPhoneLine, RiMapPinLine, RiTimeLine, RiSendPlaneLine, RiCheckLine, RiLeafLine, RiQuestionLine } from "react-icons/ri";
import PageLayout from "@/components/layout/PageLayout";
import { toast } from "sonner";

const CONTACT_INFO = [
  { icon: RiMailLine, label: "Email Us", value: "hello@fromthefields.com", sub: "We reply within 2 hours" },
  { icon: RiPhoneLine, label: "Call Us", value: "+1 (800) 555-FARM", sub: "Mon–Fri, 8am–8pm EST" },
  { icon: RiMapPinLine, label: "Visit Us", value: "123 Green Ave, Portland, OR 97201", sub: "By appointment only" },
  { icon: RiTimeLine, label: "Support Hours", value: "Mon–Sun, 8am–10pm", sub: "365 days a year" },
];

const FAQ_QUICK = [
  { q: "How do I track my order?", a: "Login to your customer dashboard and visit the 'My Orders' tab for real-time tracking." },
  { q: "Can I become a farmer partner?", a: "Absolutely! Register as a farmer and submit your verification documents. Approval takes 1-3 business days." },
  { q: "What if my produce arrives damaged?", a: "Contact us within 24 hours with a photo. We'll replace or refund immediately — no questions asked." },
  { q: "How do I pause my subscription?", a: "Go to your customer dashboard > Subscriptions and click 'Pause'. Changes apply to your next delivery." },
];

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSent(true);
      toast.success("Message sent! We'll get back to you within 2 hours.");
    }, 1500);
  };

  return (
    <PageLayout>
      {/* Hero */}
      <section className="pt-32 pb-16 bg-hero-pattern">
        <div className="container mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-primary font-medium text-sm uppercase tracking-widest mb-2">Get In Touch</p>
            <h1 className="font-serif text-5xl font-bold mb-4">We're Here to Help</h1>
            <p className="text-muted-foreground text-xl max-w-xl mx-auto">Have a question, feedback, or want to become a farm partner? Our team responds fast.</p>
          </motion.div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-12 -mt-8">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {CONTACT_INFO.map((info, i) => {
              const Icon = info.icon;
              return (
                <motion.div key={info.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                  className="bg-card rounded-2xl p-5 shadow-card text-center border border-border">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                    <Icon className="text-primary text-xl" />
                  </div>
                  <p className="font-semibold text-sm mb-1">{info.label}</p>
                  <p className="text-foreground text-sm mb-1">{info.value}</p>
                  <p className="text-muted-foreground text-xs">{info.sub}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Form + FAQ */}
      <section className="py-16">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Form */}
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <h2 className="font-serif text-3xl font-bold mb-2">Send Us a Message</h2>
              <p className="text-muted-foreground mb-8">Fill out the form and our team will respond within 2 hours.</p>

              {sent ? (
                <div className="bg-primary/10 rounded-3xl p-10 text-center">
                  <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                    <RiCheckLine className="text-primary text-3xl" />
                  </div>
                  <h3 className="font-serif text-2xl font-bold mb-2">Message Sent!</h3>
                  <p className="text-muted-foreground">We'll get back to you at {form.email} within 2 hours.</p>
                  <button onClick={() => { setSent(false); setForm({ name: "", email: "", subject: "", message: "" }); }}
                    className="mt-6 px-6 py-2.5 rounded-xl border border-border text-sm font-medium hover:bg-muted transition-colors">
                    Send Another
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Name</label>
                      <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="Your full name"
                        className="w-full px-4 py-3 rounded-xl border border-border bg-card focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm" />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Email</label>
                      <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder="your@email.com"
                        className="w-full px-4 py-3 rounded-xl border border-border bg-card focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm" />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Subject</label>
                    <select value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-border bg-card focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm">
                      <option value="">Select a topic</option>
                      <option>Order Issue</option>
                      <option>Subscription Help</option>
                      <option>Farmer Onboarding</option>
                      <option>Delivery Partner</option>
                      <option>General Inquiry</option>
                      <option>Partnership</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Message</label>
                    <textarea required rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
                      placeholder="Tell us how we can help..."
                      className="w-full px-4 py-3 rounded-xl border border-border bg-card focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm resize-none" />
                  </div>
                  <button type="submit" disabled={loading}
                    className="w-full py-3 rounded-xl bg-primary text-white font-semibold flex items-center justify-center gap-2 hover:bg-primary/90 transition-all disabled:opacity-60">
                    {loading ? "Sending..." : <><RiSendPlaneLine /> Send Message</>}
                  </button>
                </form>
              )}
            </motion.div>

            {/* FAQ */}
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <h2 className="font-serif text-3xl font-bold mb-2">Quick Answers</h2>
              <p className="text-muted-foreground mb-8">Common questions answered instantly.</p>
              <div className="space-y-4">
                {FAQ_QUICK.map((faq, i) => (
                  <div key={i} className="bg-card rounded-2xl p-5 shadow-sm border border-border">
                    <div className="flex items-start gap-3">
                      <RiQuestionLine className="text-primary text-lg shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-sm mb-2">{faq.q}</p>
                        <p className="text-muted-foreground text-sm leading-relaxed">{faq.a}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Map placeholder */}
              <div className="mt-6 rounded-2xl overflow-hidden border border-border h-48 bg-muted flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <RiMapPinLine className="text-4xl text-primary mx-auto mb-2" />
                  <p className="text-sm font-medium">123 Green Ave, Portland, OR</p>
                  <p className="text-xs">Headquarters</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="section-padding bg-muted/40">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <RiLeafLine className="text-primary text-2xl" />
            <h2 className="font-serif text-3xl font-bold">Join 180,000+ Satisfied Customers</h2>
          </div>
          <p className="text-muted-foreground">Our support team has a 4.9/5 satisfaction rating. We're here for you, always.</p>
        </div>
      </section>
    </PageLayout>
  );
}
