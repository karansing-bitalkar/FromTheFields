import { motion } from "framer-motion";
import { RiTimeLine, RiUserLine, RiArrowRightLine, RiPriceTag3Line } from "react-icons/ri";
import PageLayout from "@/components/layout/PageLayout";
import { toast } from "sonner";

const POSTS = [
  { id: 1, title: "Why Farm-to-Table Isn't Just a Trend — It's the Future", category: "Sustainability", author: "Emma Collins", date: "Apr 12, 2026", readTime: "5 min", image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&q=80", excerpt: "The industrial food system is failing farmers and consumers alike. Here's why the farm-to-table movement is the most important food shift of our generation.", featured: true },
  { id: 2, title: "How We Vet Every Farmer on Our Platform", category: "Transparency", author: "Priya Patel", date: "Apr 8, 2026", readTime: "4 min", image: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=600&q=80", excerpt: "Our 12-point farmer verification process ensures every product you receive meets our freshness and ethical standards." },
  { id: 3, title: "Seasonal Eating Guide: What to Buy in Spring", category: "Guides", author: "Chef Marco", date: "Apr 5, 2026", readTime: "7 min", image: "https://images.unsplash.com/photo-1518977822534-7049a61ee0c2?w=600&q=80", excerpt: "Spring is the most exciting time for local produce. Here's everything that's at peak freshness right now and how to use it." },
  { id: 4, title: "Meet the Farmer: Robert Green of Sunny Acres", category: "Farmer Stories", author: "FromTheFields Team", date: "Apr 1, 2026", readTime: "6 min", image: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=600&q=80", excerpt: "Three generations. Zero pesticides. Robert shares how his family farm survived the corporate agriculture era." },
  { id: 5, title: "The Real Cost of Cheap Food", category: "Education", author: "Emma Collins", date: "Mar 28, 2026", readTime: "8 min", image: "https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=600&q=80", excerpt: "That $0.99 tomato has hidden costs — for farmers, for the environment, and for your health. The math is eye-opening." },
  { id: 6, title: "5 Recipes That Showcase Spring Vegetables", category: "Recipes", author: "Chef Marco", date: "Mar 25, 2026", readTime: "10 min", image: "https://images.unsplash.com/photo-1547592180-85f173990554?w=600&q=80", excerpt: "From roasted asparagus to spring pea risotto, these recipes let fresh, local produce be the star of your table." },
];

const CATEGORIES = ["All", "Sustainability", "Transparency", "Guides", "Farmer Stories", "Education", "Recipes"];

export default function Blog() {
  const featured = POSTS.find((p) => p.featured);
  const rest = POSTS.filter((p) => !p.featured);

  return (
    <PageLayout>
      <section className="pt-32 pb-16 bg-hero-pattern">
        <div className="container mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-primary font-medium text-sm uppercase tracking-widest mb-2">Stories & Insights</p>
            <h1 className="font-serif text-5xl font-bold mb-4">The FromTheFields Journal</h1>
            <p className="text-muted-foreground text-xl max-w-xl">Farm stories, seasonal guides, food education, and more from the people who grow and love local food.</p>
          </motion.div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto">
          {/* Categories */}
          <div className="flex gap-2 flex-wrap mb-10">
            {CATEGORIES.map((cat) => (
              <button key={cat} className="px-4 py-2 rounded-full text-sm font-medium bg-card border border-border hover:bg-primary hover:text-white hover:border-primary transition-all">
                {cat}
              </button>
            ))}
          </div>

          {/* Featured */}
          {featured && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
              <div className="bg-card rounded-3xl overflow-hidden shadow-xl grid grid-cols-1 lg:grid-cols-2">
                <div className="relative h-64 lg:h-auto">
                  <img src={featured.image} alt={featured.title} className="absolute inset-0 w-full h-full object-cover" />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1.5 rounded-full bg-primary text-white text-xs font-bold">Featured</span>
                  </div>
                </div>
                <div className="p-8 flex flex-col justify-center">
                  <span className="inline-flex items-center gap-1 text-primary text-xs font-medium mb-3"><RiPriceTag3Line />{featured.category}</span>
                  <h2 className="font-serif text-3xl font-bold mb-4 leading-tight">{featured.title}</h2>
                  <p className="text-muted-foreground leading-relaxed mb-6">{featured.excerpt}</p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground mb-6">
                    <span className="flex items-center gap-1"><RiUserLine />{featured.author}</span>
                    <span>{featured.date}</span>
                    <span className="flex items-center gap-1"><RiTimeLine />{featured.readTime} read</span>
                  </div>
                  <button onClick={() => toast.info("Full article coming soon!")} className="self-start flex items-center gap-2 text-primary font-semibold text-sm hover:gap-3 transition-all">
                    Read More <RiArrowRightLine />
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rest.map((post, i) => (
              <motion.div key={post.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                className="bg-card rounded-2xl overflow-hidden shadow-card card-hover">
                <div className="h-48 overflow-hidden">
                  <img src={post.image} alt={post.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-5">
                  <span className="inline-flex items-center gap-1 text-primary text-xs font-medium mb-2"><RiPriceTag3Line />{post.category}</span>
                  <h3 className="font-serif font-bold text-lg mb-2 leading-snug">{post.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-2">{post.excerpt}</p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <span>{post.author}</span>
                      <span>·</span>
                      <span className="flex items-center gap-1"><RiTimeLine />{post.readTime}</span>
                    </div>
                    <span>{post.date}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Newsletter */}
          <div className="mt-16 bg-primary/5 rounded-3xl p-10 text-center border border-primary/20">
            <h2 className="font-serif text-3xl font-bold mb-3">Stay in the Loop</h2>
            <p className="text-muted-foreground mb-6">Farm stories, seasonal guides, and recipes — delivered weekly to your inbox.</p>
            <div className="flex max-w-md mx-auto gap-3">
              <input type="email" placeholder="your@email.com" className="flex-1 px-4 py-3 rounded-xl border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
              <button onClick={() => toast.success("Subscribed to the newsletter!")} className="px-5 py-3 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-primary/90 transition-all">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
