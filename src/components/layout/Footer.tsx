import { Link } from "react-router-dom";
import { RiPlantLine, RiFacebookFill, RiTwitterXFill, RiInstagramLine, RiYoutubeLine, RiMailLine, RiPhoneLine, RiMapPinLine } from "react-icons/ri";

const footerLinks = {
  Company: [
    { label: "About Us", href: "/about" },
    { label: "Careers", href: "/careers" },
    { label: "Blog", href: "/blog" },
    { label: "Press", href: "/blog" },
  ],
  Marketplace: [
    { label: "Browse Products", href: "/marketplace" },
    { label: "Subscriptions", href: "/subscription" },
    { label: "Become a Farmer", href: "/register" },
    { label: "Delivery Partners", href: "/register" },
  ],
  Support: [
    { label: "Contact Us", href: "/contact" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "FAQs", href: "/contact" },
  ],
};

const categories = ["Vegetables", "Fruits", "Dairy & Eggs", "Leafy Greens", "Herbs", "Natural & Honey"];

export default function Footer() {
  return (
    <footer className="bg-farm-dark text-white">
      {/* Main Footer */}
      <div className="container mx-auto py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
                <RiPlantLine className="text-white text-xl" />
              </div>
              <span className="font-serif font-bold text-xl">
                From<span className="text-primary">The</span>Fields
              </span>
            </div>
            <p className="text-white/60 text-sm leading-relaxed mb-6 max-w-xs">
              Connecting local farmers with conscious consumers. Fresh, honest, and delivered with care straight from the source.
            </p>
            <div className="space-y-2 text-sm text-white/60">
              <div className="flex items-center gap-2"><RiMailLine className="text-primary" /> hello@fromthefields.com</div>
              <div className="flex items-center gap-2"><RiPhoneLine className="text-primary" /> +1 (800) 555-FARM</div>
              <div className="flex items-center gap-2"><RiMapPinLine className="text-primary" /> 123 Green Ave, Portland, OR</div>
            </div>
            <div className="flex gap-3 mt-6">
              {[RiFacebookFill, RiTwitterXFill, RiInstagramLine, RiYoutubeLine].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center hover:bg-primary transition-colors">
                  <Icon className="text-base" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-semibold text-sm uppercase tracking-wider text-white/40 mb-4">{title}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link to={link.href} className="text-white/70 hover:text-primary text-sm transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Categories */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <p className="text-white/40 text-xs uppercase tracking-wider mb-3">Browse Categories</p>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <Link key={cat} to="/marketplace" className="px-3 py-1.5 rounded-full border border-white/20 text-white/60 text-xs hover:border-primary hover:text-primary transition-colors">
                {cat}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="container mx-auto py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-white/40">
          <p>© 2026 FromTheFields. All rights reserved.</p>
          <div className="flex gap-4">
            <Link to="/privacy" className="hover:text-white/70 transition-colors">Privacy</Link>
            <Link to="/terms" className="hover:text-white/70 transition-colors">Terms</Link>
            <Link to="/contact" className="hover:text-white/70 transition-colors">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
