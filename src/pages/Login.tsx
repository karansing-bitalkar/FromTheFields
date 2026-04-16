import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { RiPlantLine, RiMailLine, RiLockLine, RiArrowLeftLine, RiEyeLine, RiEyeOffLine } from "react-icons/ri";
import { useAuth } from "@/lib/auth";
import { DEMO_ACCOUNTS, ROLE_DASHBOARD } from "@/lib/auth";
import { toast } from "sonner";
import type { UserRole } from "@/types";

interface DemoAccount {
  label: string;
  email: string;
  role: UserRole;
  color: string;
}

const DEMOS: DemoAccount[] = [
  { label: "Customer", email: "customer@test.com", role: "customer", color: "bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100" },
  { label: "Farmer", email: "farmer@test.com", role: "farmer", color: "bg-green-50 border-green-200 text-green-700 hover:bg-green-100" },
  { label: "Admin", email: "admin@test.com", role: "admin", color: "bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100" },
  { label: "Delivery", email: "delivery@test.com", role: "delivery", color: "bg-orange-50 border-orange-200 text-orange-700 hover:bg-orange-100" },
];

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleDemoClick = (demo: DemoAccount) => {
    setEmail(demo.email);
    setPassword("123456");
    toast.info(`Demo account filled for ${demo.label}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      const result = login(email.trim(), password);
      setLoading(false);
      if (result.success) {
        const account = DEMO_ACCOUNTS[email.toLowerCase()];
        toast.success(`Welcome back, ${account?.user?.name}!`);
        navigate(ROLE_DASHBOARD[account.user.role]);
      } else {
        toast.error(result.message);
      }
    }, 800);
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-farm-dark relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80"
          alt="Farm"
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/40 via-farm-dark/60 to-farm-dark" />
        <div className="relative z-10 flex flex-col justify-between p-12 text-white">
          <Link to="/home" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
              <RiPlantLine className="text-white text-xl" />
            </div>
            <span className="font-serif font-bold text-xl">FromTheFields</span>
          </Link>
          <div>
            <h2 className="font-serif text-4xl font-bold mb-4 leading-tight">Fresh from the farm.<br />Delivered to your door.</h2>
            <p className="text-white/70 text-lg leading-relaxed mb-8">Join 180,000 families who eat fresh, support local farmers, and enjoy hassle-free weekly delivery.</p>
            <div className="grid grid-cols-2 gap-4">
              {[["2,400+", "Local Farmers"], ["98%", "Satisfaction Rate"], ["24h", "Farm to Door"], ["100%", "Organic Options"]].map(([val, label]) => (
                <div key={label} className="glass-dark rounded-2xl p-4">
                  <div className="text-2xl font-bold font-serif text-primary">{val}</div>
                  <div className="text-white/60 text-sm">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <Link to="/home" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm mb-8 transition-colors">
            <RiArrowLeftLine /> Back to Home
          </Link>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="font-serif text-3xl font-bold mb-2">Welcome Back</h1>
            <p className="text-muted-foreground mb-8">Sign in to your FromTheFields account</p>

            {/* Demo Accounts */}
            <div className="mb-6">
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-3">Demo Accounts — click to auto-fill</p>
              <div className="grid grid-cols-2 gap-2">
                {DEMOS.map((demo) => (
                  <button
                    key={demo.role}
                    onClick={() => handleDemoClick(demo)}
                    className={`p-3 rounded-xl border text-sm font-semibold transition-all ${demo.color}`}
                  >
                    {demo.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3 mb-6">
              <div className="flex-1 h-px bg-border" />
              <span className="text-xs text-muted-foreground">or enter credentials</span>
              <div className="flex-1 h-px bg-border" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Email Address</label>
                <div className="relative">
                  <RiMailLine className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-border bg-card focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm transition-all"
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
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-11 pr-12 py-3 rounded-xl border border-border bg-card focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm transition-all"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    {showPassword ? <RiEyeOffLine /> : <RiEyeLine />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-primary text-white font-semibold hover:bg-primary/90 transition-all disabled:opacity-60 mt-2"
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>

            <p className="text-center text-sm text-muted-foreground mt-6">
              Don't have an account?{" "}
              <Link to="/register" className="text-primary font-semibold hover:underline">Create one free</Link>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
