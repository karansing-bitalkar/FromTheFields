import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  RiSearchLine, RiFilterLine, RiCloseLine, RiLeafLine,
  RiArrowLeftSLine, RiArrowRightSLine, RiUserLine, RiMapPinLine,
  RiStarFill, RiShieldCheckLine, RiArrowRightLine, RiTruckLine,
} from "react-icons/ri";
import { Link, useNavigate } from "react-router-dom";
import PageLayout from "@/components/layout/PageLayout";
import ProductCard from "@/components/features/ProductCard";
import { PRODUCTS, FARMERS } from "@/lib/mockData";
import type { Product } from "@/types";

const CATEGORIES_ALL = ["All", "Vegetables", "Fruits", "Dairy & Eggs", "Leafy Greens", "Natural", "Herbs"];
const MARKET_PAGE_SIZE = 8;

// Mock distances for demo
const FARMER_DISTANCES: Record<string, string> = {
  "farm-001": "4.2 mi",
  "farm-002": "8.7 mi",
  "farm-003": "12.1 mi",
  "farm-004": "18.5 mi",
};

// Map grid positions for visual layout
const MAP_POSITIONS = [
  { top: "15%", left: "22%" },
  { top: "55%", left: "60%" },
  { top: "25%", left: "68%" },
  { top: "65%", left: "18%" },
];

function buildSuggestions(query: string, products: Product[]) {
  if (!query.trim()) return [];
  const q = query.toLowerCase();
  const seen = new Set<string>();
  const results: { label: string; type: "product" | "farmer"; id?: string }[] = [];

  for (const p of products) {
    if (p.name.toLowerCase().includes(q) && !seen.has(p.name)) {
      seen.add(p.name);
      results.push({ label: p.name, type: "product", id: p.id });
    }
    if (p.farmer.toLowerCase().includes(q) && !seen.has("farmer:" + p.farmer)) {
      seen.add("farmer:" + p.farmer);
      results.push({ label: p.farmer, type: "farmer", id: p.farmerId });
    }
    if (results.length >= 6) break;
  }
  return results;
}

function FarmerMapSection() {
  const navigate = useNavigate();
  const [hoveredFarm, setHoveredFarm] = useState<string | null>(null);
  const [activeFarm, setActiveFarm] = useState<string | null>(null);

  const activeFarmerData = FARMERS.find((f) => f.id === activeFarm) ?? null;

  return (
    <section className="py-14">
      <div className="container mx-auto">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <p className="text-primary font-medium text-sm uppercase tracking-widest mb-1">Discover</p>
            <h2 className="font-serif text-3xl font-bold">Farms Near You</h2>
            <p className="text-muted-foreground text-sm mt-1">Click a pin to explore any farm's full profile and products.</p>
          </div>
          <Link to="/marketplace"
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border text-sm font-medium hover:bg-muted transition-colors">
            View All Farmers <RiArrowRightLine />
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map Board */}
          <div className="lg:col-span-2">
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-green-50 via-emerald-50/60 to-lime-50 border border-green-100/80 shadow-card"
              style={{ height: 380 }}>

              {/* Grid overlay for map feel */}
              <div className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage: `linear-gradient(rgba(22,163,74,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(22,163,74,0.15) 1px, transparent 1px)`,
                  backgroundSize: "40px 40px",
                }} />

              {/* Subtle topography lines */}
              <svg className="absolute inset-0 w-full h-full opacity-10" viewBox="0 0 600 380" preserveAspectRatio="none">
                <ellipse cx="200" cy="180" rx="150" ry="100" fill="none" stroke="#16a34a" strokeWidth="1.5" />
                <ellipse cx="200" cy="180" rx="100" ry="65" fill="none" stroke="#16a34a" strokeWidth="1" />
                <ellipse cx="420" cy="220" rx="120" ry="80" fill="none" stroke="#16a34a" strokeWidth="1.5" />
                <ellipse cx="420" cy="220" rx="70" ry="45" fill="none" stroke="#16a34a" strokeWidth="1" />
              </svg>

              {/* Road lines */}
              <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 600 380" preserveAspectRatio="none">
                <path d="M 0 190 Q 150 160 300 190 Q 450 220 600 200" stroke="#15803d" strokeWidth="2" fill="none" strokeDasharray="8 4" />
                <path d="M 150 0 Q 200 120 280 190 Q 350 260 380 380" stroke="#15803d" strokeWidth="2" fill="none" strokeDasharray="8 4" />
              </svg>

              {/* "You Are Here" center marker */}
              <div className="absolute" style={{ top: "45%", left: "42%", transform: "translate(-50%, -50%)" }}>
                <div className="w-5 h-5 rounded-full bg-blue-500 border-2 border-white shadow-lg flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-white" />
                </div>
                <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] font-semibold text-blue-600 bg-white/80 px-1.5 py-0.5 rounded-full backdrop-blur-sm">
                  You
                </div>
              </div>

              {/* Farm Pins */}
              {FARMERS.map((farmer, i) => {
                const pos = MAP_POSITIONS[i] ?? { top: "30%", left: "50%" };
                const dist = FARMER_DISTANCES[farmer.id] ?? "?";
                const isHovered = hoveredFarm === farmer.id;
                const isActive = activeFarm === farmer.id;

                return (
                  <div key={farmer.id}
                    className="absolute"
                    style={{ top: pos.top, left: pos.left, transform: "translate(-50%, -100%)", zIndex: isHovered || isActive ? 20 : 10 }}>
                    <button
                      onClick={() => setActiveFarm(activeFarm === farmer.id ? null : farmer.id)}
                      onMouseEnter={() => setHoveredFarm(farmer.id)}
                      onMouseLeave={() => setHoveredFarm(null)}
                      className="relative group flex flex-col items-center focus:outline-none"
                    >
                      {/* Pin bubble */}
                      <motion.div
                        animate={{ scale: isActive ? 1.12 : isHovered ? 1.06 : 1, y: isHovered ? -3 : 0 }}
                        transition={{ duration: 0.2 }}
                        className={`relative flex flex-col items-center`}
                      >
                        {/* Distance label */}
                        <div className={`mb-1 px-2 py-0.5 rounded-full text-[10px] font-bold shadow transition-all duration-200 ${
                          isActive ? "bg-primary text-white opacity-100" : "bg-white text-primary opacity-0 group-hover:opacity-100"
                        }`}>
                          {dist}
                        </div>

                        {/* Circular avatar pin */}
                        <div className={`relative w-12 h-12 rounded-full border-3 shadow-lg transition-all duration-200 overflow-hidden ${
                          isActive ? "border-primary ring-2 ring-primary ring-offset-1" : "border-white hover:border-primary/60"
                        }`}
                          style={{ border: isActive ? "3px solid var(--primary)" : "3px solid white" }}>
                          <img src={farmer.image} alt={farmer.name} className="w-full h-full object-cover" />
                          {farmer.approved && (
                            <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-green-500 border-2 border-white flex items-center justify-center">
                              <RiShieldCheckLine className="text-white text-[8px]" />
                            </div>
                          )}
                        </div>

                        {/* Pin tail */}
                        <div className={`w-0.5 h-3 transition-colors duration-200 ${isActive ? "bg-primary" : "bg-white/70"}`} />
                        <div className={`w-2 h-2 rounded-full transition-colors duration-200 ${isActive ? "bg-primary" : "bg-white/70"}`} />

                        {/* Pulsing ring on active */}
                        {isActive && (
                          <motion.div
                            className="absolute top-6 w-14 h-14 rounded-full border-2 border-primary/40"
                            animate={{ scale: [1, 1.5, 1.5], opacity: [0.7, 0, 0] }}
                            transition={{ duration: 1.6, repeat: Infinity }}
                          />
                        )}
                      </motion.div>

                      {/* Tooltip on hover (only if not active) */}
                      <AnimatePresence>
                        {isHovered && !isActive && (
                          <motion.div
                            initial={{ opacity: 0, y: 4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 4 }}
                            transition={{ duration: 0.15 }}
                            className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 whitespace-nowrap bg-foreground text-background text-[11px] font-semibold px-2.5 py-1 rounded-lg shadow-lg pointer-events-none"
                          >
                            {farmer.farm}
                            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-foreground" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </button>
                  </div>
                );
              })}

              {/* Legend */}
              <div className="absolute bottom-3 right-3 flex items-center gap-3 bg-white/80 backdrop-blur-sm rounded-xl px-3 py-2 shadow-sm text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-blue-500" /> You
                </span>
                <span className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-primary" /> Farm
                </span>
              </div>

              {/* Scale bar */}
              <div className="absolute bottom-3 left-4 flex items-end gap-1 bg-white/80 backdrop-blur-sm rounded-xl px-3 py-2 shadow-sm">
                <div className="w-12 h-0.5 bg-foreground/40 relative">
                  <div className="absolute left-0 top-0 w-px h-2 bg-foreground/40 -translate-y-full" />
                  <div className="absolute right-0 top-0 w-px h-2 bg-foreground/40 -translate-y-full" />
                </div>
                <span className="text-[10px] text-muted-foreground ml-1">10 mi</span>
              </div>
            </div>
          </div>

          {/* Farm Detail Panel */}
          <div className="lg:col-span-1">
            <AnimatePresence mode="wait">
              {activeFarmerData ? (
                <motion.div key={activeFarmerData.id}
                  initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 16 }}
                  className="bg-card rounded-2xl shadow-card border border-border overflow-hidden h-full">
                  {/* Farm cover gradient */}
                  <div className="h-20 bg-gradient-to-br from-primary/20 via-green-100 to-amber-50 relative">
                    <div className="absolute inset-0 flex items-center justify-center opacity-10">
                      <RiLeafLine className="text-[8rem] text-primary" />
                    </div>
                  </div>

                  <div className="p-5 -mt-8">
                    <div className="flex items-end gap-3 mb-4">
                      <img src={activeFarmerData.image} alt={activeFarmerData.name}
                        className="w-14 h-14 rounded-2xl object-cover border-4 border-card shadow-md" />
                      <div className="pb-1">
                        {activeFarmerData.approved && (
                          <span className="flex items-center gap-1 text-xs text-green-700 bg-green-100 px-2 py-0.5 rounded-full font-medium mb-1 w-fit">
                            <RiShieldCheckLine /> Verified
                          </span>
                        )}
                        <h3 className="font-serif font-bold text-lg leading-tight">{activeFarmerData.farm}</h3>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <RiMapPinLine className="text-primary shrink-0" />
                        <span>{activeFarmerData.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <RiTruckLine className="text-primary shrink-0" />
                        <span>{FARMER_DISTANCES[activeFarmerData.id]} away</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <RiLeafLine className="text-primary shrink-0" />
                        <span>{activeFarmerData.products}+ products listed</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 mb-4">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <RiStarFill key={s} className={`text-sm ${s <= 4 ? "text-amber-400" : "text-muted-foreground/30"}`} />
                      ))}
                      <span className="text-xs text-muted-foreground ml-1">4.0+ avg</span>
                    </div>

                    <p className="text-xs text-muted-foreground leading-relaxed mb-5 line-clamp-3">{activeFarmerData.story}</p>

                    <button
                      onClick={() => navigate(`/farmer/${activeFarmerData.id}`)}
                      className="w-full py-3 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-primary/90 transition-all flex items-center justify-center gap-2">
                      Visit Farm Profile <RiArrowRightLine />
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div key="empty"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="bg-card rounded-2xl shadow-card border border-border border-dashed h-full flex flex-col items-center justify-center p-8 text-center min-h-[200px]">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                    <RiMapPinLine className="text-primary text-2xl" />
                  </div>
                  <h3 className="font-semibold mb-2">Explore Nearby Farms</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Click any farm pin on the map to see their profile, products, and distance from you.
                  </p>
                  <div className="mt-4 flex gap-2 flex-wrap justify-center">
                    {FARMERS.map((f) => (
                      <button key={f.id} onClick={() => setActiveFarm(f.id)}
                        className="px-3 py-1 rounded-full text-xs border border-border hover:border-primary hover:text-primary transition-colors font-medium">
                        {f.farm.split(" ")[0]}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Farmer Cards Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          {FARMERS.map((farmer, i) => (
            <motion.div key={farmer.id}
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
              <Link to={`/farmer/${farmer.id}`}
                className="flex items-center gap-3 p-4 bg-card rounded-2xl shadow-card border border-border hover:border-primary/30 hover:shadow-md hover:-translate-y-0.5 transition-all group">
                <img src={farmer.image} alt={farmer.name}
                  className="w-10 h-10 rounded-xl object-cover shrink-0 group-hover:ring-2 ring-primary/30 transition-all" />
                <div className="min-w-0">
                  <p className="font-semibold text-sm truncate">{farmer.farm}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 truncate">
                    <RiMapPinLine className="text-primary shrink-0" />
                    {FARMER_DISTANCES[farmer.id]} · {farmer.location.split(",")[0]}
                  </p>
                </div>
                {farmer.approved && (
                  <RiShieldCheckLine className="text-green-500 shrink-0 ml-auto" />
                )}
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Marketplace() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [organicOnly, setOrganicOnly] = useState(false);
  const [maxPrice, setMaxPrice] = useState(20);
  const [showFilters, setShowFilters] = useState(false);
  const [cart, setCart] = useState<{ [id: string]: number }>({});
  const [page, setPage] = useState(1);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlightIdx, setHighlightIdx] = useState(-1);
  const searchRef = useRef<HTMLDivElement>(null);

  const suggestions = useMemo(() => buildSuggestions(search, PRODUCTS), [search]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const applySuggestion = useCallback((label: string) => {
    setSearch(label);
    setShowSuggestions(false);
    setHighlightIdx(-1);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions || suggestions.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightIdx((i) => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightIdx((i) => Math.max(i - 1, -1));
    } else if (e.key === "Enter" && highlightIdx >= 0) {
      e.preventDefault();
      applySuggestion(suggestions[highlightIdx].label);
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
    }
  };

  const filtered = useMemo(() => {
    setPage(1);
    return PRODUCTS.filter((p) => {
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.farmer.toLowerCase().includes(search.toLowerCase());
      const matchCategory = selectedCategory === "All" || p.category === selectedCategory;
      const matchOrganic = !organicOnly || p.organic;
      const matchPrice = p.price <= maxPrice;
      return matchSearch && matchCategory && matchOrganic && matchPrice;
    });
  }, [search, selectedCategory, organicOnly, maxPrice]);

  const handleAddToCart = (product: Product) => {
    setCart((prev) => ({ ...prev, [product.id]: (prev[product.id] || 0) + 1 }));
  };

  const totalCartItems = Object.values(cart).reduce((a, b) => a + b, 0);
  const totalPages = Math.ceil(filtered.length / MARKET_PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * MARKET_PAGE_SIZE, page * MARKET_PAGE_SIZE);

  const goToPage = (p: number) => {
    setPage(p);
    window.scrollTo({ top: 400, behavior: "smooth" });
  };

  return (
    <PageLayout>
      {/* Header */}
      <section className="pt-32 pb-10 bg-hero-pattern">
        <div className="container mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-primary font-medium text-sm uppercase tracking-widest mb-2">Marketplace</p>
            <h1 className="font-serif text-5xl font-bold mb-4">Browse Fresh Produce</h1>
            <p className="text-muted-foreground text-lg max-w-xl">Explore hundreds of fresh, locally grown products from verified farmers near you.</p>
          </motion.div>
        </div>
      </section>

      <section className="py-10">
        <div className="container mx-auto">
          {/* Search & Filter Bar */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1" ref={searchRef}>
              <RiSearchLine className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground text-lg z-10" />
              <input
                type="text"
                placeholder="Search products or farmers..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setShowSuggestions(true); setHighlightIdx(-1); }}
                onFocus={() => { if (search) setShowSuggestions(true); }}
                onKeyDown={handleKeyDown}
                className="w-full pl-11 pr-10 py-3 rounded-xl border border-border bg-card focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm"
              />
              {search && (
                <button onClick={() => { setSearch(""); setShowSuggestions(false); }} className="absolute right-3 top-1/2 -translate-y-1/2 z-10">
                  <RiCloseLine className="text-muted-foreground" />
                </button>
              )}
              {showSuggestions && suggestions.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute top-full left-0 right-0 mt-1.5 bg-card border border-border rounded-2xl shadow-xl z-50 overflow-hidden"
                >
                  {suggestions.map((s, i) => (
                    <button
                      key={i}
                      onClick={() => applySuggestion(s.label)}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-sm text-left transition-colors border-b border-border/50 last:border-0 ${
                        i === highlightIdx ? "bg-primary/10 text-primary" : "hover:bg-muted"
                      }`}
                    >
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${s.type === "farmer" ? "bg-amber-100 text-amber-600" : "bg-primary/10 text-primary"}`}>
                        {s.type === "farmer" ? <RiUserLine className="text-sm" /> : <RiLeafLine className="text-sm" />}
                      </div>
                      <div>
                        <span className="font-medium">{s.label}</span>
                        <span className="ml-2 text-xs text-muted-foreground capitalize">{s.type === "farmer" ? "Farmer" : "Product"}</span>
                      </div>
                    </button>
                  ))}
                </motion.div>
              )}
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl border font-medium text-sm transition-colors ${showFilters ? "bg-primary text-white border-primary" : "border-border bg-card hover:bg-muted"}`}
            >
              <RiFilterLine className="text-lg" />
              Filters {(organicOnly || maxPrice < 20) && <span className="w-2 h-2 rounded-full bg-accent inline-block ml-1" />}
            </button>
            {totalCartItems > 0 && (
              <div className="flex items-center gap-2 px-5 py-3 rounded-xl bg-primary/10 text-primary font-medium text-sm">
                {totalCartItems} items in cart
              </div>
            )}
          </div>

          {/* Categories */}
          <div className="flex gap-2 flex-wrap mb-6">
            {CATEGORIES_ALL.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === cat ? "bg-primary text-white shadow-sm" : "bg-card border border-border hover:bg-muted"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-card rounded-2xl border border-border p-6 mb-8 grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              <div>
                <label className="text-sm font-medium mb-3 block">Max Price: <span className="text-primary">${maxPrice}</span></label>
                <input
                  type="range" min={1} max={20} step={0.5} value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-primary"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>$1</span><span>$20</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={() => setOrganicOnly(!organicOnly)}
                  className={`relative w-12 h-6 rounded-full transition-colors ${organicOnly ? "bg-primary" : "bg-muted"}`}>
                  <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${organicOnly ? "left-7" : "left-1"}`} />
                </button>
                <div>
                  <p className="text-sm font-medium flex items-center gap-1"><RiLeafLine className="text-primary" /> Organic Only</p>
                  <p className="text-xs text-muted-foreground">Show certified organic products</p>
                </div>
              </div>
              <div className="flex items-end">
                <button
                  onClick={() => { setMaxPrice(20); setOrganicOnly(false); setSearch(""); setSelectedCategory("All"); }}
                  className="px-4 py-2 rounded-xl border border-border text-sm hover:bg-muted transition-colors"
                >
                  Reset All Filters
                </button>
              </div>
            </motion.div>
          )}

          {/* Results Count */}
          <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
            <p className="text-muted-foreground text-sm">
              Showing <span className="font-semibold text-foreground">{filtered.length}</span> products
              {totalPages > 1 && <span> · Page {page} of {totalPages}</span>}
            </p>
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <RiSearchLine className="text-5xl text-muted-foreground mx-auto mb-4" />
              <h3 className="font-serif text-2xl font-bold mb-2">No Products Found</h3>
              <p className="text-muted-foreground">Try adjusting your search or filters.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {paginated.map((product, i) => (
                  <motion.div key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(i * 0.05, 0.3) }}>
                    <Link to={`/product/${product.id}`} className="block">
                      <ProductCard product={product} onAddToCart={(p) => handleAddToCart(p)} />
                    </Link>
                  </motion.div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-10 flex-wrap">
                  <button disabled={page === 1} onClick={() => goToPage(page - 1)}
                    className="flex items-center gap-1 px-4 py-2.5 rounded-xl border border-border text-sm font-medium hover:bg-muted transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                    <RiArrowLeftSLine /> Prev
                  </button>
                  <div className="flex gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                      <button key={p} onClick={() => goToPage(p)}
                        className={`w-10 h-10 rounded-xl text-sm font-semibold transition-all ${p === page ? "bg-primary text-white shadow-sm" : "border border-border hover:bg-muted"}`}>
                        {p}
                      </button>
                    ))}
                  </div>
                  <button disabled={page === totalPages} onClick={() => goToPage(page + 1)}
                    className="flex items-center gap-1 px-4 py-2.5 rounded-xl border border-border text-sm font-medium hover:bg-muted transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                    Next <RiArrowRightSLine />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Farmer Map Section */}
      <FarmerMapSection />
    </PageLayout>
  );
}
