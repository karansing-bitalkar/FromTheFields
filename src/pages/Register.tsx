import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { RiPlantLine, RiUserLine, RiMailLine, RiLockLine, RiArrowLeftLine, RiEyeLine, RiEyeOffLine, RiCheckLine } from "react-icons/ri";
import { toast } from "sonner";
import type { UserRole } from "@/types";

const ROLE_OPTIONS: { value: UserRole; label: string; desc: string; color: string }[] = [
  { value: "customer", label: "Customer", desc: "Buy fresh produce", color: "border-blue-300 bg-blue-50 text-blue-700" },
  { value: "farmer", label: "Farmer", desc: "Sell your harvest", color: "border-green-300 bg-green-50 text-green-700" },
  { value: "delivery", label: "Delivery Partner", desc: "Deliver orders", color: "border-orange-300 bg-orange-50 text-orange-700" },
];

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "customer" as UserRole });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success("Account created! Please login with your credentials.");
      navigate("/login");
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-farm-dark relative overflow-hidden">
        <img src="https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800&q=80" alt="Farm" className="absolute inset-0 w-full h-full object-cover opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-br from-secondary/40 via-farm-dark/60 to-farm-dark" />
        <div className="relative z-10 flex flex-col justify-between p-12 text-white">
          <Link to="/home" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
              <RiPlantLine className="text-white text-xl" />
            </div>
            <span className="font-serif font-bold text-xl">FromTheFields</span>
          </Link>
          <div>
            <h2 className="font-serif text-4xl font-bold mb-4 leading-tight">Join the Local Food Revolution</h2>
            <p className="text-white/70 text-lg mb-8">Whether you grow it, buy it, or deliver it — there's a place for you at FromTheFields.</p>
            <div className="space-y-4">
              {[
                "Access to 2,400+ local farms",
                "Freshness guaranteed or money back",
                "Flexible subscription plans",
                "Real-time order tracking",
              ].map((point) => (
                <div key={point} className="flex items-center gap-3 text-white/80">
                  <div className="w-6 h-6 rounded-full bg-primary/30 flex items-center justify-center">
                    <RiCheckLine className="text-primary text-xs" />
                  </div>
                  <span className="text-sm">{point}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center p-6 overflow-y-auto">
        <div className="w-full max-w-md py-8">
          <Link to="/home" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm mb-8 transition-colors">
            <RiArrowLeftLine /> Back to Home
          </Link>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="font-serif text-3xl font-bold mb-2">Create Your Account</h1>
            <p className="text-muted-foreground mb-8">Join thousands already eating fresh from local farms</p>

            {/* Role Selection */}
            <div className="mb-6">
              <p className="text-sm font-medium mb-3">I want to join as a...</p>
              <div className="grid grid-cols-3 gap-2">
                {ROLE_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setForm({ ...form, role: opt.value })}
                    className={`p-3 rounded-xl border-2 text-center transition-all ${form.role === opt.value ? opt.color + " border-opacity-100" : "border-border bg-card hover:bg-muted"}`}
                  >
                    <div className={`text-xs font-bold ${form.role === opt.value ? "" : "text-foreground"}`}>{opt.label}</div>
                    <div className={`text-xs mt-0.5 ${form.role === opt.value ? "opacity-70" : "text-muted-foreground"}`}>{opt.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Full Name</label>
                <div className="relative">
                  <RiUserLine className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Your full name"
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-border bg-card focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Email Address</label>
                <div className="relative">
                  <RiMailLine className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="your@email.com"
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-border bg-card focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Password</label>
                <div className="relative">
                  <RiLockLine className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    placeholder="Min. 6 characters"
                    className="w-full pl-11 pr-12 py-3 rounded-xl border border-border bg-card focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                    {showPassword ? <RiEyeOffLine /> : <RiEyeLine />}
                  </button>
                </div>
              </div>

              <p className="text-xs text-muted-foreground">
                By registering, you agree to our{" "}
                <Link to="/terms" className="text-primary hover:underline">Terms of Service</Link> and{" "}
                <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>.
              </p>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-primary text-white font-semibold hover:bg-primary/90 transition-all disabled:opacity-60"
              >
                {loading ? "Creating Account..." : "Create Account"}
              </button>
            </form>

            <p className="text-center text-sm text-muted-foreground mt-6">
              Already have an account?{" "}
              <Link to="/login" className="text-primary font-semibold hover:underline">Sign in</Link>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
