import { useParams, Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  RiStarFill,
  RiStarLine,
  RiLeafLine,
  RiShoppingCartLine,
  RiArrowLeftLine,
  RiMapPinLine,
  RiTimeLine,
  RiCheckboxCircleLine,
  RiTruckLine,
  RiHeartLine,
  RiShareLine,
  RiUserLine,
  RiShieldCheckLine,
} from "react-icons/ri";
import PageLayout from "@/components/layout/PageLayout";
import { PRODUCTS, FARMERS } from "@/lib/mockData";
import { useCart } from "@/hooks/useCart";
import { toast } from "sonner";

const MOCK_REVIEWS = [
  { id: 1, name: "Alex J.", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&q=80", rating: 5, date: "Apr 14, 2026", verified: true, comment: "Absolutely the freshest produce I've ever had delivered! The tomatoes were still warm from the sun. Will order weekly." },
  { id: 2, name: "Lisa P.", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&q=80", rating: 4, date: "Apr 12, 2026", verified: true, comment: "Great quality and packaging. Arrived on time. Slightly smaller than expected but taste was amazing. Definitely buying again." },
  { id: 3, name: "Sam T.", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&q=80", rating: 5, date: "Apr 10, 2026", verified: false, comment: "Certified organic and you can taste the difference. My kids actually asked for more vegetables — that never happens!" },
  { id: 4, name: "Maria G.", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&q=80", rating: 4, date: "Apr 8, 2026", verified: true, comment: "Farm-fresh difference is real. Love knowing exactly which farm it came from. Packaging was eco-friendly too." },
];

const FRESHNESS_TIMELINE = [
  { label: "Harvested", time: "Today 6:00 AM", icon: RiLeafLine, done: true },
  { label: "Quality Check", time: "Today 8:00 AM", icon: RiShieldCheckLine, done: true },
  { label: "Dispatched", time: "Today 10:00 AM", icon: RiTruckLine, done: true },
  { label: "Delivered to You", time: "Today by 2 PM", icon: RiCheckboxCircleLine, done: false },
];

function StarRating({ rating, interactive = false, onChange }: { rating: number; interactive?: boolean; onChange?: (r: number) => void }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => {
        const filled = s <= (interactive ? (hovered || rating) : rating);
        return (
          <button
            key={s}
            type={interactive ? "button" : undefined}
            onClick={interactive && onChange ? () => onChange(s) : undefined}
            onMouseEnter={interactive ? () => setHovered(s) : undefined}
            onMouseLeave={interactive ? () => setHovered(0) : undefined}
            className={interactive ? "cursor-pointer" : "cursor-default"}
          >
            {filled
              ? <RiStarFill className="text-yellow-400 text-lg" />
              : <RiStarLine className="text-yellow-300 text-lg" />}
          </button>
        );
      })}
    </div>
  );
}

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const product = PRODUCTS.find((p) => p.id === id) ?? PRODUCTS[0];
  const farmer = FARMERS.find((f) => f.id === product.farmerId);

  const [qty, setQty] = useState(1);
  const [wishlisted, setWishlisted] = useState(false);
  const [reviewForm, setReviewForm] = useState({ name: "", rating: 5, comment: "" });
  const [reviews, setReviews] = useState(MOCK_REVIEWS);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const { addItem } = useCart();

  const finalPrice = product.discount
    ? product.price * (1 - product.discount / 100)
    : product.price;

  const avgRating = (reviews.reduce((a, r) => a + r.rating, 0) / reviews.length).toFixed(1);

  const handleAddToCart = () => {
    addItem(product, qty);
    toast.success(`${qty}× ${product.name} added to cart!`, {
      description: "Item saved to your cart.",
      action: { label: "View Cart", onClick: () => navigate("/dashboard/customer/cart") },
    });
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    const newReview = {
      id: Date.now(),
      name: reviewForm.name || "Anonymous",
      avatar: `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&q=80`,
      rating: reviewForm.rating,
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      verified: false,
      comment: reviewForm.comment,
    };
    setReviews((prev) => [newReview, ...prev]);
    setReviewForm({ name: "", rating: 5, comment: "" });
    setShowReviewForm(false);
    toast.success("Review submitted! Thank you.");
  };

  const related = PRODUCTS.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);

  return (
    <PageLayout>
      <div className="pt-24 pb-16">
        <div className="container mx-auto max-w-6xl">

          {/* Back */}
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 text-sm transition-colors">
            <RiArrowLeftLine /> Back to Marketplace
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

            {/* Left: Image + Details */}
            <div className="lg:col-span-2 space-y-6">

              {/* Product Image */}
              <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className="relative rounded-3xl overflow-hidden shadow-lg">
                <img src={product.image} alt={product.name}
                  className="w-full h-72 md:h-96 object-cover" />
                {/* Badges */}
                <div className="absolute top-4 left-4 flex gap-2 flex-wrap">
                  {product.organic && (
                    <span className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-green-600 text-white text-xs font-semibold shadow">
                      <RiLeafLine /> Organic
                    </span>
                  )}
                  {product.discount && (
                    <span className="px-3 py-1.5 rounded-full bg-accent text-white text-xs font-semibold shadow">
                      {product.discount}% OFF
                    </span>
                  )}
                  <span className={`px-3 py-1.5 rounded-full text-xs font-semibold shadow capitalize
                    ${product.freshness === "ultra-fresh" ? "bg-emerald-500 text-white" : product.freshness === "fresh" ? "bg-blue-500 text-white" : "bg-yellow-500 text-white"}`}>
                    {product.freshness}
                  </span>
                </div>
                <div className="absolute top-4 right-4 flex gap-2">
                  <button onClick={() => setWishlisted((w) => !w)}
                    className="w-10 h-10 rounded-full bg-white/90 backdrop-blur flex items-center justify-center shadow hover:scale-110 transition-transform">
                    <RiHeartLine className={`text-lg transition-colors ${wishlisted ? "text-red-500" : "text-muted-foreground"}`} />
                  </button>
                  <button onClick={() => toast.success("Link copied!")}
                    className="w-10 h-10 rounded-full bg-white/90 backdrop-blur flex items-center justify-center shadow hover:scale-110 transition-transform">
                    <RiShareLine className="text-lg text-muted-foreground" />
                  </button>
                </div>
              </motion.div>

              {/* Product Info */}
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                className="bg-card rounded-2xl shadow-card p-6">
                <div className="flex items-start justify-between gap-4 flex-wrap mb-3">
                  <div>
                    <span className="text-xs font-medium text-primary uppercase tracking-widest">{product.category}</span>
                    <h1 className="font-serif text-3xl font-bold mt-1">{product.name}</h1>
                  </div>
                  <div className="text-right">
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold text-primary">${finalPrice.toFixed(2)}</span>
                      <span className="text-muted-foreground text-sm">/ {product.unit}</span>
                    </div>
                    {product.discount && (
                      <span className="text-sm text-muted-foreground line-through">${product.price.toFixed(2)}</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 mb-4 flex-wrap">
                  <div className="flex items-center gap-1.5">
                    <StarRating rating={Math.round(product.rating)} />
                    <span className="font-bold text-sm">{product.rating}</span>
                  </div>
                  <span className="text-muted-foreground text-sm">({product.reviews} reviews)</span>
                  <span className="text-muted-foreground text-sm">·</span>
                  <span className={`text-sm font-medium ${product.stock > 20 ? "text-green-600" : "text-orange-500"}`}>
                    {product.stock > 20 ? "In Stock" : `Only ${product.stock} left`}
                  </span>
                </div>

                <p className="text-muted-foreground leading-relaxed mb-4">{product.description}</p>

                <div className="grid grid-cols-2 gap-3">
                  {[
                    ["Harvest Date", new Date(product.harvestDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })],
                    ["Certification", product.organic ? "Certified Organic" : "Conventional"],
                    ["Farmer", product.farmer],
                    ["Available Stock", `${product.stock} ${product.unit}s`],
                  ].map(([label, val]) => (
                    <div key={label} className="bg-muted/30 rounded-xl p-3">
                      <p className="text-xs text-muted-foreground mb-1">{label}</p>
                      <p className="font-semibold text-sm">{val}</p>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Freshness Timeline */}
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
                className="bg-card rounded-2xl shadow-card p-6">
                <h2 className="font-semibold text-lg mb-5 flex items-center gap-2">
                  <RiTimeLine className="text-primary" /> Farm-to-Table Journey
                </h2>
                <div className="flex items-start gap-0 overflow-x-auto pb-2">
                  {FRESHNESS_TIMELINE.map((step, i) => {
                    const Icon = step.icon;
                    return (
                      <div key={step.label} className="flex items-center flex-shrink-0">
                        <div className="flex flex-col items-center text-center w-28">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-all
                            ${step.done ? "bg-primary text-white" : "bg-muted text-muted-foreground"}`}>
                            <Icon className="text-base" />
                          </div>
                          <p className={`text-xs font-semibold mb-0.5 ${step.done ? "text-foreground" : "text-muted-foreground"}`}>{step.label}</p>
                          <p className="text-xs text-muted-foreground">{step.time}</p>
                        </div>
                        {i < FRESHNESS_TIMELINE.length - 1 && (
                          <div className={`h-0.5 w-8 mx-1 mb-6 rounded-full flex-shrink-0 ${step.done ? "bg-primary" : "bg-muted"}`} />
                        )}
                      </div>
                    );
                  })}
                </div>
              </motion.div>

              {/* Farmer Profile */}
              {farmer && (
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                  className="bg-card rounded-2xl shadow-card p-6">
                  <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
                    <RiUserLine className="text-primary" /> Meet the Farmer
                  </h2>
                  <div className="flex items-start gap-4">
                    <img src={farmer.image} alt={farmer.name}
                      className="w-16 h-16 rounded-2xl object-cover border-2 border-primary/20 shrink-0" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <p className="font-bold text-lg">{farmer.name}</p>
                        {farmer.approved && (
                          <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs bg-green-100 text-green-700 font-medium">
                            <RiShieldCheckLine /> Verified
                          </span>
                        )}
                      </div>
                      <p className="text-primary text-sm font-medium">{farmer.farm}</p>
                      <div className="flex items-center gap-1 text-muted-foreground text-sm mb-3">
                        <RiMapPinLine className="text-primary" /> {farmer.location}
                      </div>
                      <p className="text-muted-foreground text-sm leading-relaxed">{farmer.story}</p>
                      <div className="grid grid-cols-2 gap-3 mt-4">
                        <div className="bg-muted/30 rounded-xl p-3 text-center">
                          <p className="font-bold text-primary">{farmer.products}+</p>
                          <p className="text-xs text-muted-foreground">Products</p>
                        </div>
                        <div className="bg-muted/30 rounded-xl p-3 text-center">
                          <p className="font-bold text-primary">3+ yrs</p>
                          <p className="text-xs text-muted-foreground">On Platform</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Reviews */}
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
                className="bg-card rounded-2xl shadow-card p-6">
                <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
                  <div>
                    <h2 className="font-semibold text-lg">Customer Reviews</h2>
                    <div className="flex items-center gap-2 mt-1">
                      <StarRating rating={Math.round(Number(avgRating))} />
                      <span className="font-bold">{avgRating}</span>
                      <span className="text-muted-foreground text-sm">({reviews.length} reviews)</span>
                    </div>
                  </div>
                  <button onClick={() => setShowReviewForm((v) => !v)}
                    className="px-4 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-all">
                    Write a Review
                  </button>
                </div>

                {/* Review Form */}
                <AnimatePresence>
                  {showReviewForm && (
                    <motion.form
                      initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                      onSubmit={handleSubmitReview}
                      className="bg-muted/30 rounded-2xl p-5 mb-6 space-y-4 overflow-hidden">
                      <h3 className="font-semibold">Your Review</h3>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Your Name</label>
                        <input value={reviewForm.name} onChange={(e) => setReviewForm({ ...reviewForm, name: e.target.value })}
                          placeholder="e.g. John D." className="w-full px-4 py-3 rounded-xl border border-border bg-card focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm" />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Rating</label>
                        <StarRating rating={reviewForm.rating} interactive onChange={(r) => setReviewForm({ ...reviewForm, rating: r })} />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Comment</label>
                        <textarea required rows={3} value={reviewForm.comment}
                          onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                          placeholder="Share your experience with this product..."
                          className="w-full px-4 py-3 rounded-xl border border-border bg-card focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm resize-none" />
                      </div>
                      <div className="flex gap-3">
                        <button type="submit" className="px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-all">Submit</button>
                        <button type="button" onClick={() => setShowReviewForm(false)}
                          className="px-5 py-2.5 rounded-xl border border-border text-sm font-medium hover:bg-muted transition-colors">Cancel</button>
                      </div>
                    </motion.form>
                  )}
                </AnimatePresence>

                {/* Review List */}
                <div className="space-y-5">
                  {reviews.map((review, i) => (
                    <motion.div key={review.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                      className="border-b border-border last:border-0 pb-5 last:pb-0">
                      <div className="flex items-start gap-3">
                        <img src={review.avatar} alt={review.name}
                          className="w-10 h-10 rounded-full object-cover shrink-0" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <p className="font-semibold text-sm">{review.name}</p>
                            {review.verified && (
                              <span className="flex items-center gap-0.5 text-xs text-green-600 font-medium">
                                <RiCheckboxCircleLine /> Verified
                              </span>
                            )}
                            <span className="text-muted-foreground text-xs ml-auto">{review.date}</span>
                          </div>
                          <StarRating rating={review.rating} />
                          <p className="text-muted-foreground text-sm mt-2 leading-relaxed">{review.comment}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Right: Sticky Add to Cart Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-4">
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
                  className="bg-card rounded-2xl shadow-card p-6 border border-primary/10">
                  <div className="flex items-baseline justify-between mb-1">
                    <span className="text-3xl font-bold text-primary">${finalPrice.toFixed(2)}</span>
                    <span className="text-muted-foreground text-sm">per {product.unit}</span>
                  </div>
                  {product.discount && (
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-sm text-muted-foreground line-through">${product.price.toFixed(2)}</span>
                      <span className="px-2 py-0.5 rounded-full text-xs bg-accent/10 text-accent font-semibold">{product.discount}% OFF</span>
                    </div>
                  )}

                  {/* Quantity */}
                  <label className="text-sm font-medium mb-2 block">Quantity ({product.unit}s)</label>
                  <div className="flex items-center gap-3 mb-5">
                    <button onClick={() => setQty((q) => Math.max(1, q - 1))}
                      className="w-10 h-10 rounded-xl border border-border flex items-center justify-center hover:bg-muted transition-colors font-bold text-lg">−</button>
                    <span className="flex-1 text-center font-bold text-xl">{qty}</span>
                    <button onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
                      className="w-10 h-10 rounded-xl border border-border flex items-center justify-center hover:bg-muted transition-colors font-bold text-lg">+</button>
                  </div>

                  <div className="bg-muted/30 rounded-xl p-3 mb-5 flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-bold text-primary">${(finalPrice * qty).toFixed(2)}</span>
                  </div>

                  <button onClick={handleAddToCart}
                    className="w-full py-3.5 rounded-xl bg-primary text-white font-bold text-base hover:bg-primary/90 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-md mb-3">
                    <RiShoppingCartLine className="text-lg" /> Add to Cart
                  </button>
                  <button onClick={() => { handleAddToCart(); navigate("/dashboard/customer"); }}
                    className="w-full py-3 rounded-xl border-2 border-primary text-primary font-semibold text-sm hover:bg-primary/5 transition-all">
                    Buy Now
                  </button>

                  {/* Trust Badges */}
                  <div className="mt-5 space-y-2.5">
                    {[
                      [RiLeafLine, "Farm-certified fresh"],
                      [RiTruckLine, "Same-day delivery available"],
                      [RiShieldCheckLine, "Quality guaranteed"],
                    ].map(([Icon, text], i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Icon className="text-primary text-base shrink-0" />
                        {text as string}
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Farmer mini card */}
                {farmer && (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
                    className="bg-card rounded-2xl shadow-card p-4">
                    <p className="text-xs text-muted-foreground mb-3 uppercase tracking-wider font-medium">Sold by</p>
                    <div className="flex items-center gap-3">
                      <img src={farmer.image} alt={farmer.name} className="w-10 h-10 rounded-full object-cover" />
                      <div>
                        <p className="font-semibold text-sm">{farmer.name}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1"><RiMapPinLine className="text-primary" />{farmer.location}</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </div>

          {/* Related Products */}
          {related.length > 0 && (
            <div className="mt-12">
              <h2 className="font-serif text-2xl font-bold mb-6">More from this Category</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                {related.map((p) => (
                  <Link key={p.id} to={`/product/${p.id}`}
                    className="bg-card rounded-2xl shadow-card overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all group">
                    <img src={p.image} alt={p.name} className="w-full h-36 object-cover group-hover:scale-105 transition-transform duration-300" />
                    <div className="p-3">
                      <p className="font-semibold text-sm truncate">{p.name}</p>
                      <p className="text-primary font-bold text-sm">${p.price.toFixed(2)} / {p.unit}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
}
