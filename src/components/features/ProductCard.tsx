import { motion } from "framer-motion";
import { RiShoppingCartLine, RiStarFill, RiLeafLine, RiHeartLine, RiHeartFill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { useWishlist } from "@/hooks/useWishlist";
import { toast } from "sonner";
import type { Product } from "@/types";

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
}

const freshnessConfig = {
  "ultra-fresh": { label: "Ultra Fresh", color: "bg-green-100 text-green-700 border-green-200" },
  "fresh":        { label: "Fresh",       color: "bg-blue-100 text-blue-700 border-blue-200" },
  "good":         { label: "Good",        color: "bg-yellow-100 text-yellow-700 border-yellow-200" },
};

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const wishlisted = isWishlisted(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      toast.error("Please login to add items to cart", {
        action: { label: "Login", onClick: () => navigate("/login") },
      });
      return;
    }
    if (onAddToCart) onAddToCart(product);
    toast.success(`${product.name} added to cart!`);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const added = toggleWishlist(product);
    if (added) {
      toast.success(`${product.name} saved to wishlist!`);
    } else {
      toast.info(`${product.name} removed from wishlist.`);
    }
  };

  const freshConf = freshnessConfig[product.freshness];

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25 }}
      className="bg-card rounded-2xl shadow-card overflow-hidden hover:shadow-card-hover transition-shadow duration-300 group"
    >
      <div className="relative overflow-hidden h-48">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${freshConf.color}`}>
            {freshConf.label}
          </span>
          {product.organic && (
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20 flex items-center gap-1">
              <RiLeafLine className="text-xs" /> Organic
            </span>
          )}
        </div>
        {product.discount && (
          <div className="absolute top-3 right-10 w-10 h-10 rounded-full bg-accent flex items-center justify-center text-white text-xs font-bold">
            -{product.discount}%
          </div>
        )}

        {/* Wishlist button */}
        <button
          onClick={handleWishlist}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur flex items-center justify-center shadow-sm hover:scale-110 transition-transform"
        >
          {wishlisted
            ? <RiHeartFill className="text-red-500 text-base" />
            : <RiHeartLine className="text-muted-foreground text-base" />}
        </button>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-semibold text-foreground text-base leading-tight">{product.name}</h3>
          <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full shrink-0">{product.category}</span>
        </div>
        <p className="text-muted-foreground text-xs mb-2">{product.farmer}</p>

        <div className="flex items-center gap-1 mb-3">
          <RiStarFill className="text-amber-400 text-xs" />
          <span className="text-xs font-medium">{product.rating}</span>
          <span className="text-xs text-muted-foreground">({product.reviews})</span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-xl font-bold text-primary">${product.price.toFixed(2)}</span>
            <span className="text-xs text-muted-foreground ml-1">/ {product.unit}</span>
          </div>
          <button
            onClick={handleAddToCart}
            className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white hover:bg-primary/90 hover:shadow-md transition-all active:scale-95"
          >
            <RiShoppingCartLine className="text-lg" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
