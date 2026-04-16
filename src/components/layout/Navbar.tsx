import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  RiPlantLine, RiMenuLine, RiCloseLine, RiDashboardLine,
  RiBellLine, RiCheckDoubleLine, RiDeleteBinLine,
  RiShoppingBagLine, RiCalendarCheckLine, RiUserFollowLine, RiTruckLine,
} from "react-icons/ri";
import { useAuth } from "@/lib/auth";
import { ROLE_DASHBOARD } from "@/lib/auth";
import { useNotifications } from "@/hooks/useNotifications";
import type { Notification } from "@/hooks/useNotifications";

const NAV_LINKS = [
  { label: "Home", href: "/home" },
  { label: "About", href: "/about" },
  { label: "Marketplace", href: "/marketplace" },
  { label: "Subscription", href: "/subscription" },
  { label: "Contact", href: "/contact" },
];

const TYPE_CONFIG: Record<string, { icon: React.ElementType; color: string }> = {
  order:        { icon: RiShoppingBagLine,    color: "text-blue-500 bg-blue-50" },
  subscription: { icon: RiCalendarCheckLine,  color: "text-purple-500 bg-purple-50" },
  farmer:       { icon: RiUserFollowLine,      color: "text-green-500 bg-green-50" },
  delivery:     { icon: RiTruckLine,          color: "text-orange-500 bg-orange-50" },
};

function NotificationItem({ n, onRead, onDelete }: { n: Notification; onRead: (id: string) => void; onDelete: (id: string) => void }) {
  const Cfg = TYPE_CONFIG[n.type];
  const Icon = Cfg.icon;
  return (
    <div
      onClick={() => onRead(n.id)}
      className={`flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-colors hover:bg-muted/50 ${!n.read ? "bg-primary/5" : ""}`}
    >
      <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${Cfg.color}`}>
        <Icon className="text-sm" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className={`text-sm font-medium leading-snug ${!n.read ? "text-foreground" : "text-muted-foreground"}`}>{n.title}</p>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(n.id); }}
            className="shrink-0 p-1 rounded hover:bg-muted transition-colors opacity-0 group-hover:opacity-100"
          >
            <RiDeleteBinLine className="text-xs text-muted-foreground" />
          </button>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">{n.message}</p>
        <p className="text-xs text-muted-foreground/60 mt-1">{n.time}</p>
      </div>
      {!n.read && <div className="w-2 h-2 rounded-full bg-primary shrink-0 mt-2" />}
    </div>
  );
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification } = useNotifications();
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => { setIsOpen(false); }, [location.pathname]);

  // Close notif dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <motion.nav
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "glass shadow-glass py-3" : "py-5 bg-transparent"
      }`}
    >
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link to="/home" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
            <RiPlantLine className="text-white text-xl" />
          </div>
          <span className="font-serif font-bold text-xl text-foreground">
            From<span className="text-primary">The</span>Fields
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                location.pathname === link.href
                  ? "bg-primary/10 text-primary"
                  : "text-foreground/70 hover:text-foreground hover:bg-muted"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Actions */}
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated && user ? (
            <>
              {/* Notification Bell */}
              <div className="relative" ref={notifRef}>
                <button
                  onClick={() => setNotifOpen((o) => !o)}
                  className="relative w-9 h-9 rounded-xl hover:bg-muted flex items-center justify-center transition-colors"
                >
                  <RiBellLine className="text-xl text-foreground/70" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center shadow">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </button>

                <AnimatePresence>
                  {notifOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.97 }}
                      transition={{ duration: 0.18 }}
                      className="absolute right-0 top-12 w-80 bg-card rounded-2xl shadow-2xl border border-border z-50 overflow-hidden"
                    >
                      {/* Header */}
                      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-sm">Notifications</p>
                          {unreadCount > 0 && (
                            <span className="px-2 py-0.5 rounded-full text-xs bg-red-100 text-red-600 font-semibold">{unreadCount} new</span>
                          )}
                        </div>
                        {unreadCount > 0 && (
                          <button onClick={markAllAsRead} className="flex items-center gap-1 text-xs text-primary hover:underline font-medium">
                            <RiCheckDoubleLine /> Mark all read
                          </button>
                        )}
                      </div>

                      {/* List */}
                      <div className="max-h-80 overflow-y-auto divide-y divide-border/50 group">
                        {notifications.length === 0 ? (
                          <div className="text-center py-10 text-muted-foreground text-sm">
                            <RiBellLine className="text-3xl mx-auto mb-2 text-muted-foreground/40" />
                            No notifications yet
                          </div>
                        ) : (
                          notifications.map((n) => (
                            <NotificationItem key={n.id} n={n} onRead={markAsRead} onDelete={deleteNotification} />
                          ))
                        )}
                      </div>

                      {/* Footer */}
                      <div className="border-t border-border px-4 py-2.5 text-center">
                        <button onClick={() => { setNotifOpen(false); navigate(ROLE_DASHBOARD[user.role] + "/notifications"); }}
                          className="text-xs text-primary font-medium hover:underline">
                          View all in dashboard →
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <button
                onClick={() => navigate(ROLE_DASHBOARD[user.role])}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 text-primary font-medium text-sm hover:bg-primary/20 transition-colors"
              >
                <RiDashboardLine className="text-base" />
                Dashboard
              </button>
              <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-white font-semibold text-sm cursor-pointer"
                onClick={() => navigate(ROLE_DASHBOARD[user.role])}>
                {user.name.charAt(0)}
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="px-4 py-2 rounded-xl text-sm font-medium text-foreground/70 hover:text-foreground hover:bg-muted transition-all">
                Login
              </Link>
              <Link to="/register" className="px-4 py-2 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-all shadow-sm">
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Btn */}
        <button
          className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl hover:bg-muted transition-colors"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <RiCloseLine className="text-2xl" /> : <RiMenuLine className="text-2xl" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden glass border-t border-border/50 overflow-hidden"
          >
            <div className="container mx-auto py-4 flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                    location.pathname === link.href
                      ? "bg-primary/10 text-primary"
                      : "text-foreground/70 hover:bg-muted hover:text-foreground"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex gap-3 mt-2 pt-3 border-t border-border/50">
                {isAuthenticated && user ? (
                  <button
                    onClick={() => navigate(ROLE_DASHBOARD[user.role])}
                    className="flex-1 py-3 rounded-xl bg-primary text-white font-semibold text-sm"
                  >
                    Dashboard
                  </button>
                ) : (
                  <>
                    <Link to="/login" className="flex-1 py-3 rounded-xl border border-border text-center text-sm font-medium">Login</Link>
                    <Link to="/register" className="flex-1 py-3 rounded-xl bg-primary text-white text-center text-sm font-semibold">Register</Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
