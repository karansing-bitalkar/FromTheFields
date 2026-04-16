import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { RiPlantLine, RiArrowLeftLine } from "react-icons/ri";

const NotFound = () => {
  const location = useLocation();
  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-md px-6">
        <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
          <RiPlantLine className="text-primary text-4xl" />
        </div>
        <h1 className="font-serif text-8xl font-bold text-primary mb-4">404</h1>
        <h2 className="font-serif text-2xl font-bold mb-3">Oops! This Field is Empty</h2>
        <p className="text-muted-foreground mb-8 leading-relaxed">The page you're looking for has wandered off the farm. Let's get you back to fresh ground.</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/home" className="btn-primary flex items-center justify-center gap-2">
            <RiArrowLeftLine /> Back to Home
          </Link>
          <Link to="/marketplace" className="px-6 py-3 rounded-xl border border-border font-semibold hover:bg-muted transition-all text-center">
            Browse Marketplace
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;
