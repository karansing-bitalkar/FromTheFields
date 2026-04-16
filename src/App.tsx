import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";

import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Home from "./pages/Home";
import About from "./pages/About";
import Marketplace from "./pages/Marketplace";
import Subscription from "./pages/Subscription";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Terms from "./pages/Terms";
import Careers from "./pages/Careers";
import Blog from "./pages/Blog";
import OrderTracking from "./pages/OrderTracking";
import ProductDetail from "./pages/ProductDetail";
import FarmerProfile from "./pages/FarmerProfile";
import Checkout from "./pages/Checkout";
import CustomerDashboard from "./pages/dashboard/CustomerDashboard";
import FarmerDashboard from "./pages/dashboard/FarmerDashboard";
import AdminDashboard from "./pages/dashboard/AdminDashboard";
import DeliveryDashboard from "./pages/dashboard/DeliveryDashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner richColors position="top-right" />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/home" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/subscription" element={<Subscription />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/order/:id/track" element={<OrderTracking />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/farmer/:id" element={<FarmerProfile />} />
            <Route path="/checkout" element={<Checkout />} />

            {/* Dashboards */}
            <Route path="/dashboard/customer/*" element={<CustomerDashboard />} />
            <Route path="/dashboard/farmer/*" element={<FarmerDashboard />} />
            <Route path="/dashboard/admin/*" element={<AdminDashboard />} />
            <Route path="/dashboard/delivery/*" element={<DeliveryDashboard />} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
