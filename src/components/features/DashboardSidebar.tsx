import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  RiPlantLine, RiMenuFoldLine, RiMenuUnfoldLine, RiLogoutBoxLine,
  RiShoppingBagLine, RiShoppingCartLine, RiCalendarCheckLine, RiUserLine,
  RiStoreLine, RiFileListLine, RiMoneyDollarCircleLine, RiAddCircleLine,
  RiDashboardLine, RiGroupLine, RiCheckboxCircleLine, RiBarChartLine,
  RiTruckLine, RiRouteLine, RiHeartLine, RiBellLine,
  RiBox3Line, RiLeafLine, RiShieldCheckLine, RiBarChart2Line,
  RiStarLine, RiMegaphoneLine,
} from "react-icons/ri";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { useAuth } from "@/lib/auth";
import { useNotifications } from "@/hooks/useNotifications";
import { useWishlist } from "@/hooks/useWishlist";
import type { UserRole } from "@/types";

interface SidebarItem {
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: "notifications" | "wishlist";
}

const SIDEBAR_ITEMS: Record<UserRole, SidebarItem[]> = {
  customer: [
    { label: "Overview",       href: "/dashboard/customer",                icon: RiDashboardLine },
    { label: "My Orders",      href: "/dashboard/customer/orders",         icon: RiShoppingBagLine },
    { label: "My Cart",        href: "/dashboard/customer/cart",           icon: RiShoppingCartLine },
    { label: "Wishlist",       href: "/dashboard/customer/wishlist",       icon: RiHeartLine, badge: "wishlist" },
    { label: "Subscriptions",  href: "/dashboard/customer/subscriptions",  icon: RiCalendarCheckLine },
    { label: "Notifications",  href: "/dashboard/customer/notifications",  icon: RiBellLine, badge: "notifications" },
    { label: "My Reviews",     href: "/dashboard/customer/reviews",        icon: RiStarLine },
    { label: "Profile",        href: "/dashboard/customer/profile",        icon: RiUserLine },
  ],
  farmer: [
    { label: "Overview",       href: "/dashboard/farmer",            icon: RiDashboardLine },
    { label: "Add Product",    href: "/dashboard/farmer/add",        icon: RiAddCircleLine },
    { label: "My Products",    href: "/dashboard/farmer/products",   icon: RiStoreLine },
    { label: "Orders",         href: "/dashboard/farmer/orders",     icon: RiFileListLine },
    { label: "Inventory",      href: "/dashboard/farmer/inventory",  icon: RiBox3Line },
    { label: "Earnings",       href: "/dashboard/farmer/earnings",   icon: RiMoneyDollarCircleLine },
    { label: "Analytics",      href: "/dashboard/farmer/analytics",  icon: RiBarChart2Line },
    { label: "Farm Profile",   href: "/dashboard/farmer/profile",    icon: RiLeafLine },
  ],
  admin: [
    { label: "Overview",         href: "/dashboard/admin",           icon: RiDashboardLine },
    { label: "Manage Users",     href: "/dashboard/admin/users",     icon: RiGroupLine },
    { label: "Approve Farmers",  href: "/dashboard/admin/farmers",   icon: RiShieldCheckLine },
    { label: "Products",         href: "/dashboard/admin/products",  icon: RiLeafLine },
    { label: "All Orders",       href: "/dashboard/admin/orders",    icon: RiFileListLine },
    { label: "Analytics",        href: "/dashboard/admin/analytics", icon: RiBarChartLine },
    { label: "Announcements",    href: "/dashboard/admin/announce",  icon: RiMegaphoneLine },
  ],
  delivery: [
    { label: "Overview",         href: "/dashboard/delivery",          icon: RiDashboardLine },
    { label: "Assigned Orders",  href: "/dashboard/delivery/orders",   icon: RiTruckLine },
    { label: "Delivery Status",  href: "/dashboard/delivery/status",   icon: RiCheckboxCircleLine },
    { label: "Route Info",       href: "/dashboard/delivery/routes",   icon: RiRouteLine },
    { label: "Earnings",         href: "/dashboard/delivery/earnings", icon: RiMoneyDollarCircleLine },
    { label: "Profile",          href: "/dashboard/delivery/profile",  icon: RiUserLine },
  ],
};

const ROLE_LABELS: Record<UserRole, string> = {
  customer: "Customer",
  farmer:   "Farmer",
  admin:    "Admin",
  delivery: "Delivery",
};

interface DashboardSidebarProps {
  role: UserRole;
}

export default function DashboardSidebar({ role }: DashboardSidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [showLogout, setShowLogout] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { unreadCount } = useNotifications();
  const { wishlistIds } = useWishlist();
  const items = SIDEBAR_ITEMS[role];

  const getBadgeCount = (badge?: string) => {
    if (badge === "notifications") return unreadCount;
    if (badge === "wishlist") return wishlistIds.length;
    return 0;
  };

  const handleLogout = () => {
    logout();
    navigate("/home");
  };

  return (
    <>
      <motion.aside
        animate={{ width: collapsed ? 72 : 240 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="relative flex flex-col h-screen bg-farm-dark text-white shrink-0 z-30 shadow-xl"
      >
        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-5 border-b border-white/10">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shrink-0">
            <RiPlantLine className="text-white text-xl" />
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="overflow-hidden">
                <p className="font-serif font-bold text-sm whitespace-nowrap">FromTheFields</p>
                <p className="text-xs text-white/40 whitespace-nowrap">{ROLE_LABELS[role]} Portal</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 py-4 overflow-y-auto">
          {items.map((item) => {
            const Icon = item.icon;
            const badgeCount = getBadgeCount(item.badge);
            return (
              <NavLink
                key={item.href}
                to={item.href}
                end
                className={({ isActive }) =>
                  `relative flex items-center gap-3 mx-2 my-0.5 px-3 py-3 rounded-xl transition-all duration-200 ${
                    isActive
                      ? "bg-primary text-white shadow-lg shadow-primary/20"
                      : "text-white/60 hover:bg-white/10 hover:text-white"
                  }`
                }
              >
                <div className="relative shrink-0">
                  <Icon className="text-lg" />
                  {badgeCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center">
                      {badgeCount > 9 ? "9+" : badgeCount}
                    </span>
                  )}
                </div>
                <AnimatePresence>
                  {!collapsed && (
                    <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      className="text-sm font-medium whitespace-nowrap overflow-hidden flex-1">
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
                {!collapsed && badgeCount > 0 && (
                  <span className="shrink-0 px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-red-500 text-white min-w-[20px] text-center">
                    {badgeCount}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* User & Actions */}
        <div className="border-t border-white/10 p-3 space-y-1">
          <div className="flex items-center gap-3 px-2 py-2">
            <div className="w-8 h-8 rounded-full bg-primary/30 flex items-center justify-center text-primary font-bold text-sm shrink-0">
              {user?.name?.charAt(0) || "U"}
            </div>
            <AnimatePresence>
              {!collapsed && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="overflow-hidden">
                  <p className="text-xs font-medium text-white whitespace-nowrap truncate max-w-[130px]">{user?.name}</p>
                  <p className="text-xs text-white/40 whitespace-nowrap truncate max-w-[130px]">{user?.email}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <button
            onClick={() => setShowLogout(true)}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-white/60 hover:bg-red-500/10 hover:text-red-400 transition-colors"
          >
            <RiLogoutBoxLine className="text-lg shrink-0" />
            <AnimatePresence>
              {!collapsed && (
                <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="text-sm font-medium whitespace-nowrap">Logout</motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>

        {/* Toggle Button */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-4 top-20 w-8 h-8 rounded-full bg-farm-dark border border-white/20 flex items-center justify-center text-white/60 hover:text-white transition-colors shadow-lg"
        >
          {collapsed ? <RiMenuUnfoldLine className="text-sm" /> : <RiMenuFoldLine className="text-sm" />}
        </button>
      </motion.aside>

      <ConfirmDialog
        isOpen={showLogout}
        onConfirm={handleLogout}
        onCancel={() => setShowLogout(false)}
        title="Logout?"
        message="Are you sure you want to logout from your account?"
        confirmText="Yes, Logout"
        confirmClass="bg-destructive text-white hover:bg-destructive/90"
      />
    </>
  );
}
