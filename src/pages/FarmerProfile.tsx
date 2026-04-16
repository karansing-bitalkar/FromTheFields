import { useParams, Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  RiMapPinLine, RiArrowLeftLine, RiLeafLine, RiShieldCheckLine,
  RiStarFill, RiHeartLine, RiHeartFill, RiShoppingCartLine,
  RiCalendarLine, RiTruckLine, RiTeamLine,
} from "react-icons/ri";
import PageLayout from "@/components/layout/PageLayout";
import { FARMERS, PRODUCTS } from "@/lib/mockData";
import { toast } from "sonner";

export default function FarmerProfile() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const farmer = FARMERS.find((f) => f.id === id) ?? FARMERS[0];
  const farmerProducts = PRODUCTS.filter((p) => p.farmerId === farmer.id);
  const [followed, setFollowed] = useState(false);

  const totalReviews = farmerProducts.reduce((a, p) => a + p.reviews, 0);
  const avgRating = farmerProducts.length > 0
    ? (farmerProducts.reduce((a, p) => a + p.rating, 0) / farmerProducts.length).toFixed(1)
    : "—";

  const joinYear = new Date(farmer.joinedAt).getFullYear();
  const yearsOnPlatform = new Date().getFullYear() - joinYear;

  const handleFollow = () => {
    setFollowed((f) => !f);
    toast.success(followed ? `Unfollowed ${farmer.farm}` : `Now following ${farmer.farm}! You'll get updates on new products.`);
  };

  return (
    <PageLayout>
      {/* Hero Banner */}
      <section className="pt-32 pb-0">
        <div className="container mx-auto max-w-5xl">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 text-sm transition-colors">
            <RiArrowLeftLine /> Back
          </button>
        </div>
      </section>

      {/* Cover + Profile */}
      <section className="pb-10">
        <div className="container mx-auto max-w-5xl">
          {/* Cover */}
          <div className="relative rounded-3xl overflow-hidden h-52 bg-gradient-to-br from-primary/30 via-green-200/40 to-amber-100/40 mb-0">
            <div className="absolute inset-0 flex items-center justify-center opacity-10">
              <RiLeafLine className="text-[20rem] text-primary" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </div>

          {/* Profile Row */}
          <div className="relative px-6 pb-6 bg-card rounded-b-3xl shadow-card border border-border border-t-0 -mt-0.5">
            <div className="flex flex-col md:flex-row md:items-end gap-4 pt-0">
              {/* Avatar — overlaps cover */}
              <div className="relative -mt-12 shrink-0">
                <img src={farmer.image} alt={farmer.name}
                  className="w-24 h-24 rounded-2xl object-cover border-4 border-card shadow-lg" />
                {farmer.approved && (
                  <div className="absolute -bottom-2 -right-2 w-7 h-7 rounded-full bg-green-500 flex items-center justify-center border-2 border-card">
                    <RiShieldCheckLine className="text-white text-sm" />
                  </div>
                )}
              </div>

              <div className="flex-1 pt-3 md:pt-0">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 flex-wrap">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap mb-0.5">
                      <h1 className="font-serif text-3xl font-bold">{farmer.farm}</h1>
                      {farmer.approved && (
                        <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs bg-green-100 text-green-700 font-medium">
                          <RiShieldCheckLine /> Verified Farm
                        </span>
                      )}
                    </div>
                    <p className="text-muted-foreground text-sm">Run by <span className="font-medium text-foreground">{farmer.name}</span></p>
                    <p className="text-sm text-muted-foreground flex items-center gap-1 mt-0.5">
                      <RiMapPinLine className="text-primary" /> {farmer.location}
                    </p>
                  </div>
                  <button
                    onClick={handleFollow}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                      followed ? "bg-red-50 text-red-500 border border-red-200 hover:bg-red-100" : "bg-primary text-white hover:bg-primary/90 shadow-sm"
                    }`}
                  >
                    {followed ? <RiHeartFill /> : <RiHeartLine />}
                    {followed ? "Following" : "Follow this Farm"}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            {[
              { label: "Products", value: farmer.products + "+", icon: RiLeafLine, color: "text-primary" },
              { label: "Avg Rating", value: avgRating, icon: RiStarFill, color: "text-yellow-500" },
              { label: "Total Reviews", value: totalReviews + "+", icon: RiTeamLine, color: "text-blue-500" },
              { label: "Years Active", value: yearsOnPlatform > 0 ? yearsOnPlatform + "+ yrs" : "New", icon: RiCalendarLine, color: "text-purple-500" },
            ].map((stat, i) => {
              const Icon = stat.icon;
              return (
                <motion.div key={stat.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                  className="bg-card rounded-2xl p-4 shadow-card text-center border border-border">
                  <Icon className={`text-2xl mx-auto mb-1 ${stat.color}`} />
                  <p className="font-bold text-xl font-serif">{stat.value}</p>
                  <p className="text-muted-foreground text-xs">{stat.label}</p>
                </motion.div>
              );
            })}
          </div>

          {/* Story */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="bg-card rounded-2xl shadow-card p-6 mt-6 border border-border">
            <h2 className="font-semibold text-lg mb-3 flex items-center gap-2">
              <RiLeafLine className="text-primary" /> Our Story
            </h2>
            <p className="text-muted-foreground leading-relaxed">{farmer.story}</p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
              {[
                { icon: RiLeafLine, label: "Sustainable Practices", desc: "Zero synthetic pesticides, natural composting, cover cropping." },
                { icon: RiTruckLine, label: "Same-Day Harvest", desc: "Products are picked and dispatched the same morning." },
                { icon: RiShieldCheckLine, label: "Quality Certified", desc: farmer.approved ? "Verified & approved by FromTheFields." : "Pending verification." },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="bg-muted/30 rounded-xl p-4">
                    <Icon className="text-primary text-xl mb-2" />
                    <p className="font-semibold text-sm mb-1">{item.label}</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Products Grid */}
          <div className="mt-8">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-serif text-2xl font-bold">Products from {farmer.farm}</h2>
              <Link to="/marketplace" className="text-sm text-primary hover:underline font-medium">View All →</Link>
            </div>

            {farmerProducts.length === 0 ? (
              <div className="text-center py-16 bg-card rounded-2xl shadow-card">
                <RiLeafLine className="text-4xl text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">No products listed yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {farmerProducts.map((product, i) => (
                  <motion.div key={product.id}
                    initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.07 }}>
                    <Link to={`/product/${product.id}`}
                      className="block bg-card rounded-2xl shadow-card overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all group border border-border">
                      <div className="relative overflow-hidden h-44">
                        <img src={product.image} alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        <div className="absolute top-3 left-3 flex gap-2">
                          {product.organic && (
                            <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-green-600 text-white">
                              <RiLeafLine /> Organic
                            </span>
                          )}
                          {product.discount && (
                            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-accent text-white">
                              -{product.discount}%
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold mb-1">{product.name}</h3>
                        <div className="flex items-center gap-1.5 mb-2">
                          <RiStarFill className="text-yellow-400 text-xs" />
                          <span className="text-xs font-medium">{product.rating}</span>
                          <span className="text-xs text-muted-foreground">({product.reviews})</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-xl font-bold text-primary">${product.price.toFixed(2)}</span>
                            <span className="text-xs text-muted-foreground ml-1">/ {product.unit}</span>
                          </div>
                          <button
                            onClick={(e) => { e.preventDefault(); toast.success(`${product.name} added to cart!`); }}
                            className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-white hover:bg-primary/90 transition-all active:scale-95">
                            <RiShoppingCartLine />
                          </button>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* CTA Banner */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="mt-8 rounded-3xl bg-gradient-to-r from-primary to-green-700 text-white p-8 text-center">
            <h2 className="font-serif text-2xl font-bold mb-2">Subscribe for Weekly Deliveries</h2>
            <p className="text-white/80 mb-5">Get fresh produce from {farmer.farm} delivered every week automatically.</p>
            <Link to="/subscription"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-primary font-bold text-sm hover:bg-white/90 transition-all">
              View Subscription Plans
            </Link>
          </motion.div>
        </div>
      </section>
    </PageLayout>
  );
}
