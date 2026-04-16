import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { RiSearchLine, RiFilterLine, RiCloseLine, RiLeafLine, RiArrowLeftSLine, RiArrowRightSLine, RiUserLine } from "react-icons/ri";
import { Link } from "react-router-dom";
import PageLayout from "@/components/layout/PageLayout";
import ProductCard from "@/components/features/ProductCard";
import { PRODUCTS } from "@/lib/mockData";
import type { Product } from "@/types";

const CATEGORIES_ALL = ["All", "Vegetables", "Fruits", "Dairy & Eggs", "Leafy Greens", "Natural", "Herbs"];
const MARKET_PAGE_SIZE = 8;

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

  // Close suggestions on outside click
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
            {/* Autocomplete Search */}
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

              {/* Suggestions Dropdown */}
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
    </PageLayout>
  );
}
