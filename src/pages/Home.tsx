import { useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import {
  RiLeafLine, RiTruckLine, RiShieldCheckLine, RiArrowRightLine,
  RiStarFill, RiPlantLine, RiGroupLine, RiHeartLine,
  RiCheckLine, RiMapPinLine, RiTimeLine
} from "react-icons/ri";
import PageLayout from "@/components/layout/PageLayout";
import ProductCard from "@/components/features/ProductCard";
import { PRODUCTS, FARMERS, SUBSCRIPTIONS } from "@/lib/mockData";
import heroImg from "@/assets/hero-farm.jpg";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

function SectionRef({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div ref={ref} variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"} className={className}>
      {children}
    </motion.div>
  );
}

const CATEGORIES = [
  { name: "Vegetables", icon: "🥕", count: 48, color: "bg-green-50 border-green-200", desc: "From root to leaf" },
  { name: "Fruits", icon: "🍓", count: 36, color: "bg-red-50 border-red-200", desc: "Nature's candy" },
  { name: "Dairy & Eggs", icon: "🥛", count: 22, color: "bg-blue-50 border-blue-200", desc: "Pure and creamy" },
  { name: "Leafy Greens", icon: "🥬", count: 18, color: "bg-emerald-50 border-emerald-200", desc: "Power-packed greens" },
  { name: "Herbs", icon: "🌿", count: 14, color: "bg-teal-50 border-teal-200", desc: "Garden-fresh aroma" },
  { name: "Natural", icon: "🍯", count: 12, color: "bg-amber-50 border-amber-200", desc: "Wild and pure" },
];

const HOW_IT_WORKS = [
  { step: "01", title: "Browse & Discover", desc: "Explore hundreds of fresh products directly listed by verified local farmers in your region.", icon: RiLeafLine },
  { step: "02", title: "Place Your Order", desc: "Add to cart, choose your delivery slot, and checkout securely in seconds.", icon: RiShieldCheckLine },
  { step: "03", title: "We Pick & Deliver", desc: "Your order is harvested fresh and delivered to your doorstep within 24 hours.", icon: RiTruckLine },
];

const TESTIMONIALS = [
  { name: "Lisa M.", role: "Customer", text: "The tomatoes I got were still warm from the sun. I've never tasted anything like it from a grocery store.", rating: 5, location: "Portland, OR" },
  { name: "David K.", role: "Chef", text: "FromTheFields has transformed my restaurant kitchen. The herbs alone are worth every penny.", rating: 5, location: "Seattle, WA" },
  { name: "Anna B.", role: "Parent", text: "My kids actually want to eat vegetables now! The freshness and taste difference is undeniable.", rating: 5, location: "Austin, TX" },
];

const STATS = [
  { value: "2,400+", label: "Local Farmers", icon: RiPlantLine },
  { value: "180K+", label: "Happy Customers", icon: RiGroupLine },
  { value: "98%", label: "Satisfaction Rate", icon: RiHeartLine },
  { value: "24h", label: "Farm to Door", icon: RiTruckLine },
];

export default function Home() {
  const navigate = useNavigate();

  return (
    <PageLayout>
      {/* 1. Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroImg} alt="Farm fields" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-farm-dark/80 via-farm-dark/50 to-transparent" />
        </div>

        <div className="relative container mx-auto pt-20 pb-16">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-dark text-white/80 text-sm mb-6"
            >
              <RiLeafLine className="text-primary" />
              100% Locally Grown · Farm-to-Door in 24h
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-serif text-5xl md:text-7xl font-bold text-white leading-tight mb-6"
            >
              Fresh From Farms<br />
              <span className="text-primary">To Your Doorstep</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-white/80 text-lg leading-relaxed mb-10 max-w-lg"
            >
              Connect directly with local farmers. Get the freshest seasonal produce, free from middlemen — harvested just for you.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap gap-4"
            >
              <button onClick={() => navigate("/marketplace")} className="btn-primary flex items-center gap-2 text-base">
                Shop Now <RiArrowRightLine />
              </button>
              <button onClick={() => navigate("/subscription")} className="px-6 py-3 rounded-xl border border-white/30 text-white font-semibold hover:bg-white/10 transition-all text-base">
                View Plans
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex flex-wrap gap-4 mt-10"
            >
              {["No Preservatives", "Certified Organic Options", "Same-Day Delivery"].map((tag) => (
                <span key={tag} className="flex items-center gap-1.5 text-white/70 text-sm">
                  <RiCheckLine className="text-primary text-base" /> {tag}
                </span>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-white/50 text-xs"
        >
          <span>Scroll</span>
          <div className="w-0.5 h-6 bg-white/30 rounded-full" />
        </motion.div>
      </section>

      {/* 2. Stats */}
      <section className="py-10 bg-primary">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {STATS.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="text-center text-white"
                >
                  <Icon className="text-2xl mx-auto mb-2 text-white/70" />
                  <div className="text-3xl font-bold font-serif">{stat.value}</div>
                  <div className="text-white/70 text-sm">{stat.label}</div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. Categories */}
      <section className="section-padding">
        <div className="container mx-auto">
          <SectionRef className="text-center mb-12">
            <p className="text-primary font-medium text-sm uppercase tracking-widest mb-2">Browse by Category</p>
            <h2 className="font-serif text-4xl font-bold mb-4">What's Growing This Season</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Explore our categories filled with seasonal, locally grown produce handpicked from farms near you.</p>
          </SectionRef>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {CATEGORIES.map((cat, i) => (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ scale: 1.05 }}
              >
                <Link to="/marketplace" className={`flex flex-col items-center gap-2 p-5 rounded-2xl border ${cat.color} transition-all hover:shadow-lg cursor-pointer group`}>
                  <span className="text-4xl group-hover:scale-110 transition-transform">{cat.icon}</span>
                  <span className="font-semibold text-sm text-center">{cat.name}</span>
                  <span className="text-xs text-muted-foreground">{cat.count} items</span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Featured Products */}
      <section className="section-padding bg-muted/40">
        <div className="container mx-auto">
          <SectionRef className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 gap-4">
            <div>
              <p className="text-primary font-medium text-sm uppercase tracking-widest mb-2">Featured Products</p>
              <h2 className="font-serif text-4xl font-bold">Freshest Picks Today</h2>
            </div>
            <Link to="/marketplace" className="flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all">
              View All <RiArrowRightLine />
            </Link>
          </SectionRef>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PRODUCTS.slice(0, 8).map((product, i) => (
              <motion.div key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}>
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. How It Works */}
      <section className="section-padding">
        <div className="container mx-auto">
          <SectionRef className="text-center mb-14">
            <p className="text-primary font-medium text-sm uppercase tracking-widest mb-2">Simple Process</p>
            <h2 className="font-serif text-4xl font-bold mb-4">Farm Fresh in 3 Easy Steps</h2>
            <p className="text-muted-foreground max-w-lg mx-auto">From browsing to doorstep delivery — we've made it simple to eat fresh, eat local.</p>
          </SectionRef>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {HOW_IT_WORKS.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.2 }}
                  className="relative text-center p-8 rounded-3xl bg-card shadow-card"
                >
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center">
                    {step.step}
                  </div>
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-5 mt-2">
                    <Icon className="text-primary text-3xl" />
                  </div>
                  <h3 className="font-serif font-bold text-xl mb-3">{step.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{step.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. Subscription Plans */}
      <section className="section-padding bg-farm-dark text-white">
        <div className="container mx-auto">
          <SectionRef className="text-center mb-12">
            <p className="text-primary font-medium text-sm uppercase tracking-widest mb-2">Subscription Plans</p>
            <h2 className="font-serif text-4xl font-bold mb-4 text-white">Fresh Delivered, Every Week</h2>
            <p className="text-white/60 max-w-xl mx-auto">Automate your fresh produce shopping with flexible subscription boxes tailored to your needs.</p>
          </SectionRef>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {SUBSCRIPTIONS.map((plan, i) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`relative rounded-2xl p-6 ${plan.popular ? "bg-primary ring-2 ring-primary/50" : "bg-white/10"}`}
              >
                {plan.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-accent rounded-full text-xs font-bold text-white">Most Popular</span>
                )}
                <h3 className="font-serif font-bold text-xl mb-1 text-white">{plan.name}</h3>
                <p className="text-white/60 text-xs mb-4">{plan.description}</p>
                <div className="mb-4">
                  <span className="text-3xl font-bold text-white">${plan.price}</span>
                  <span className="text-white/50 text-sm">/{plan.duration}</span>
                </div>
                <ul className="space-y-2 mb-6">
                  {plan.items.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-white/80">
                      <RiCheckLine className="text-primary shrink-0" /> {item}
                    </li>
                  ))}
                </ul>
                <button onClick={() => navigate("/subscription")} className={`w-full py-2.5 rounded-xl font-semibold text-sm transition-all ${plan.popular ? "bg-white text-primary hover:bg-white/90" : "bg-white/10 text-white hover:bg-white/20"}`}>
                  Choose Plan
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Farmer Stories */}
      <section className="section-padding">
        <div className="container mx-auto">
          <SectionRef className="text-center mb-12">
            <p className="text-primary font-medium text-sm uppercase tracking-widest mb-2">Farmer Stories</p>
            <h2 className="font-serif text-4xl font-bold mb-4">Meet the People Behind Your Food</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Every product has a story. Get to know the passionate farmers growing food with purpose.</p>
          </SectionRef>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {FARMERS.filter(f => f.approved).map((farmer, i) => (
              <motion.div
                key={farmer.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="bg-card rounded-2xl overflow-hidden shadow-card card-hover"
              >
                <div className="relative h-48">
                  <img src={`https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=600&q=80&random=${i}`} alt={farmer.farm} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 flex items-center gap-3">
                    <img src={farmer.image} alt={farmer.name} className="w-12 h-12 rounded-full border-2 border-white object-cover" />
                    <div>
                      <p className="text-white font-semibold text-sm">{farmer.name}</p>
                      <p className="text-white/70 text-xs flex items-center gap-1"><RiMapPinLine className="text-primary" /> {farmer.location}</p>
                    </div>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-serif font-bold text-lg mb-2">{farmer.farm}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{farmer.story}</p>
                  <div className="flex gap-4 mt-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><RiLeafLine className="text-primary" /> {farmer.products} products</span>
                    <span className="flex items-center gap-1"><RiTimeLine className="text-primary" /> Since {new Date(farmer.joinedAt).getFullYear()}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Testimonials */}
      <section className="section-padding bg-muted/40">
        <div className="container mx-auto">
          <SectionRef className="text-center mb-12">
            <p className="text-primary font-medium text-sm uppercase tracking-widest mb-2">Testimonials</p>
            <h2 className="font-serif text-4xl font-bold mb-4">Loved by Thousands</h2>
          </SectionRef>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="bg-card rounded-2xl p-6 shadow-card"
              >
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <RiStarFill key={j} className="text-amber-400 text-base" />
                  ))}
                </div>
                <p className="text-foreground/80 text-sm leading-relaxed mb-4 italic">"{t.text}"</p>
                <div>
                  <p className="font-semibold text-sm">{t.name}</p>
                  <p className="text-muted-foreground text-xs">{t.role} · {t.location}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-hero-pattern">
        <div className="container mx-auto text-center">
          <SectionRef>
            <div className="max-w-2xl mx-auto">
              <h2 className="font-serif text-5xl font-bold mb-6 text-gradient">Start Eating Fresh Today</h2>
              <p className="text-muted-foreground text-lg mb-10">Join thousands of families who have already made the switch to fresh, locally sourced produce.</p>
              <div className="flex flex-wrap gap-4 justify-center">
                <button onClick={() => navigate("/register")} className="btn-primary text-base flex items-center gap-2">
                  Create Free Account <RiArrowRightLine />
                </button>
                <button onClick={() => navigate("/marketplace")} className="px-6 py-3 rounded-xl border border-border text-foreground font-semibold hover:bg-muted transition-all text-base">
                  Browse Marketplace
                </button>
              </div>
            </div>
          </SectionRef>
        </div>
      </section>
    </PageLayout>
  );
}
