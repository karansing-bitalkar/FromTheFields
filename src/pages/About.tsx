import { motion } from "framer-motion";
import { RiLeafLine, RiHeartLine, RiGroupLine, RiGlobalLine, RiArrowRightLine, RiCheckLine, RiTimeLine, RiMapPinLine } from "react-icons/ri";
import PageLayout from "@/components/layout/PageLayout";
import { Link } from "react-router-dom";

const VALUES = [
  { icon: RiLeafLine, title: "Sustainability First", desc: "We work exclusively with farms that practice sustainable and regenerative agriculture, protecting the earth for future generations." },
  { icon: RiHeartLine, title: "Community Driven", desc: "Every purchase strengthens local farm economies and supports farming families who have worked the land for generations." },
  { icon: RiGroupLine, title: "Radical Transparency", desc: "Know exactly where your food comes from — farm name, location, harvest date, and the farmer who grew it." },
  { icon: RiGlobalLine, title: "Zero Middlemen", desc: "Direct relationships mean farmers earn more and you pay fair prices. Everyone wins except the middleman." },
];

const TEAM = [
  { name: "Emma Collins", role: "Co-Founder & CEO", image: "https://images.unsplash.com/photo-1494790108755-2616b612b77c?w=200&q=80", bio: "Former organic farmer turned tech entrepreneur." },
  { name: "James Harmon", role: "Co-Founder & CTO", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80", bio: "Built supply chain systems for 10+ years." },
  { name: "Priya Patel", role: "Head of Farmer Relations", image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&q=80", bio: "Agricultural economist with a passion for fairness." },
  { name: "Marcus Lee", role: "Head of Logistics", image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&q=80", bio: "Optimizing last-mile delivery for 8 years." },
];

const MILESTONES = [
  { year: "2020", event: "Founded in a Portland garage with 3 farmers" },
  { year: "2021", event: "Reached 500 customers and 25 farm partners" },
  { year: "2022", event: "Expanded to 5 states, launched subscription boxes" },
  { year: "2023", event: "Hit $1M in farmer payouts — farmers earn 80%" },
  { year: "2024", event: "2,400 farmers, 180,000 customers nationwide" },
  { year: "2026", event: "Launching AI-powered seasonal produce predictions" },
];

export default function About() {
  return (
    <PageLayout>
      {/* Hero */}
      <section className="pt-32 pb-20 bg-hero-pattern">
        <div className="container mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">Our Story</span>
            <h1 className="font-serif text-5xl md:text-6xl font-bold mt-6 mb-6">
              We Believe Food Should<br />
              <span className="text-primary">Tell Its Story</span>
            </h1>
            <p className="text-muted-foreground text-xl max-w-2xl mx-auto leading-relaxed">
              FromTheFields was born from a simple belief: the person who grows your food deserves to look you in the eye. We built a bridge between farms and families.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission */}
      <section className="section-padding">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <img src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=700&q=80" alt="Farm" className="rounded-3xl w-full object-cover h-80 shadow-xl" />
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <p className="text-primary font-medium text-sm uppercase tracking-widest mb-3">Our Mission</p>
              <h2 className="font-serif text-4xl font-bold mb-6">Rebuilding the Food System, One Farm at a Time</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">Modern food supply chains are broken. Food travels an average of 1,500 miles to reach your plate, losing nutrients and flavor along the way while farmers earn pennies on the dollar.</p>
              <p className="text-muted-foreground leading-relaxed mb-6">We're changing that. Our platform creates direct, transparent relationships between local farmers and conscious consumers — ensuring freshness, fairness, and food security for all.</p>
              {["Farmers keep 80% of every sale", "Produce delivered within 24 hours of harvest", "Full traceability from seed to table"].map((point) => (
                <div key={point} className="flex items-center gap-2 mb-2 text-sm">
                  <RiCheckLine className="text-primary shrink-0" />
                  <span>{point}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding bg-muted/40">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <p className="text-primary font-medium text-sm uppercase tracking-widest mb-2">Our Values</p>
            <h2 className="font-serif text-4xl font-bold">What We Stand For</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUES.map((val, i) => {
              const Icon = val.icon;
              return (
                <motion.div key={val.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  className="bg-card rounded-2xl p-6 shadow-card card-hover">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <Icon className="text-primary text-2xl" />
                  </div>
                  <h3 className="font-serif font-bold text-lg mb-3">{val.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{val.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section-padding">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <p className="text-primary font-medium text-sm uppercase tracking-widest mb-2">Our Journey</p>
            <h2 className="font-serif text-4xl font-bold">Milestones That Matter</h2>
          </div>
          <div className="max-w-2xl mx-auto">
            {MILESTONES.map((m, i) => (
              <motion.div key={m.year} initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="flex gap-6 mb-8">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold text-xs shrink-0">{m.year.slice(2)}</div>
                  {i < MILESTONES.length - 1 && <div className="w-0.5 flex-1 bg-border mt-2" />}
                </div>
                <div className="pb-6">
                  <p className="text-primary font-bold text-sm">{m.year}</p>
                  <p className="text-foreground mt-1">{m.event}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="section-padding bg-muted/40">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <p className="text-primary font-medium text-sm uppercase tracking-widest mb-2">Our Team</p>
            <h2 className="font-serif text-4xl font-bold">The Humans Behind FromTheFields</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {TEAM.map((member, i) => (
              <motion.div key={member.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="bg-card rounded-2xl p-6 text-center shadow-card card-hover">
                <img src={member.image} alt={member.name} className="w-20 h-20 rounded-full object-cover mx-auto mb-4 border-4 border-primary/20" />
                <h3 className="font-semibold">{member.name}</h3>
                <p className="text-primary text-sm mb-2">{member.role}</p>
                <p className="text-muted-foreground text-xs leading-relaxed">{member.bio}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact */}
      <section className="section-padding bg-primary text-white">
        <div className="container mx-auto text-center">
          <h2 className="font-serif text-4xl font-bold mb-4">Our Impact in Numbers</h2>
          <p className="text-white/70 mb-12">Real results for real people and the planet.</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { val: "2,400+", label: "Farmers Supported" },
              { val: "$4.2M+", label: "Paid to Farmers" },
              { val: "180K+", label: "Happy Families" },
              { val: "62 tons", label: "Food Waste Prevented" },
            ].map((s) => (
              <div key={s.label}>
                <div className="text-4xl font-bold font-serif">{s.val}</div>
                <div className="text-white/60 text-sm mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding">
        <div className="container mx-auto text-center">
          <h2 className="font-serif text-4xl font-bold mb-6">Join the Movement</h2>
          <p className="text-muted-foreground max-w-lg mx-auto mb-8">Whether you're a consumer wanting fresher food or a farmer wanting fairer pay — FromTheFields is your platform.</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/register" className="btn-primary flex items-center gap-2">Get Started Free <RiArrowRightLine /></Link>
            <Link to="/contact" className="px-6 py-3 rounded-xl border border-border font-semibold hover:bg-muted transition-all">Contact Us</Link>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
