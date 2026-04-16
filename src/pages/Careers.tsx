import { useState } from "react";
import { motion } from "framer-motion";
import { RiMapPinLine, RiTimeLine, RiArrowRightLine, RiBriefcaseLine, RiGroupLine, RiHeartLine, RiLeafLine } from "react-icons/ri";
import PageLayout from "@/components/layout/PageLayout";
import { toast } from "sonner";

const JOBS = [
  { id: 1, title: "Senior Full-Stack Engineer", dept: "Engineering", location: "Portland, OR / Remote", type: "Full-time", level: "Senior", desc: "Build and scale our marketplace platform serving 180K+ customers and 2,400 farmers." },
  { id: 2, title: "Farmer Relations Manager", dept: "Operations", location: "Portland, OR", type: "Full-time", level: "Mid", desc: "Onboard and support farmers, ensuring quality standards and compliance." },
  { id: 3, title: "UX/Product Designer", dept: "Design", location: "Remote", type: "Full-time", level: "Mid", desc: "Design intuitive experiences for customers, farmers, and delivery partners." },
  { id: 4, title: "Logistics Coordinator", dept: "Logistics", location: "Portland, OR", type: "Full-time", level: "Entry", desc: "Coordinate delivery routes and partner networks for on-time, fresh deliveries." },
  { id: 5, title: "Marketing Lead", dept: "Marketing", location: "Remote", type: "Full-time", level: "Senior", desc: "Drive growth through storytelling that connects consumers with local farm culture." },
  { id: 6, title: "Data Analyst", dept: "Analytics", location: "Remote", type: "Full-time", level: "Mid", desc: "Turn platform data into insights that help farmers grow and customers eat better." },
];

const PERKS = [
  { icon: RiLeafLine, title: "Farm Box Benefit", desc: "Weekly fresh produce box delivered to your home — on us." },
  { icon: RiHeartLine, title: "Health & Wellness", desc: "Comprehensive health, dental, and vision coverage for you and family." },
  { icon: RiGroupLine, title: "Remote-First", desc: "Work from anywhere. We trust you to do great work wherever you are." },
  { icon: RiBriefcaseLine, title: "Equity Package", desc: "Join early and share in our growth. Competitive stock option grants." },
];

export default function Careers() {
  const [selectedDept, setSelectedDept] = useState("All");
  const depts = ["All", ...Array.from(new Set(JOBS.map((j) => j.dept)))];
  const filtered = selectedDept === "All" ? JOBS : JOBS.filter((j) => j.dept === selectedDept);

  return (
    <PageLayout>
      <section className="pt-32 pb-16 bg-hero-pattern text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="container mx-auto">
          <p className="text-primary font-medium text-sm uppercase tracking-widest mb-2">We're Hiring</p>
          <h1 className="font-serif text-5xl md:text-6xl font-bold mb-6">Build the Future<br /><span className="text-primary">of Fresh Food</span></h1>
          <p className="text-muted-foreground text-xl max-w-xl mx-auto">Join a mission-driven team rebuilding the food system. Real work. Real impact. Real produce in your fridge.</p>
        </motion.div>
      </section>

      {/* Perks */}
      <section className="py-16 bg-muted/40">
        <div className="container mx-auto">
          <h2 className="font-serif text-3xl font-bold text-center mb-10">Why FromTheFields?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PERKS.map((perk, i) => {
              const Icon = perk.icon;
              return (
                <motion.div key={perk.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  className="bg-card rounded-2xl p-6 shadow-card text-center">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Icon className="text-primary text-2xl" />
                  </div>
                  <h3 className="font-semibold mb-2">{perk.title}</h3>
                  <p className="text-muted-foreground text-sm">{perk.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Jobs */}
      <section className="section-padding">
        <div className="container mx-auto">
          <h2 className="font-serif text-3xl font-bold mb-8">Open Positions</h2>

          {/* Filter */}
          <div className="flex gap-2 flex-wrap mb-8">
            {depts.map((d) => (
              <button key={d} onClick={() => setSelectedDept(d)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedDept === d ? "bg-primary text-white" : "bg-card border border-border hover:bg-muted"}`}>
                {d}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {filtered.map((job, i) => (
              <motion.div key={job.id} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
                className="bg-card rounded-2xl p-6 shadow-card border border-border hover:border-primary/30 transition-all group">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex flex-wrap gap-2 mb-2">
                      <span className="px-2.5 py-1 rounded-full text-xs bg-primary/10 text-primary font-medium">{job.dept}</span>
                      <span className="px-2.5 py-1 rounded-full text-xs bg-muted text-muted-foreground">{job.level}</span>
                      <span className="px-2.5 py-1 rounded-full text-xs bg-muted text-muted-foreground">{job.type}</span>
                    </div>
                    <h3 className="font-serif font-bold text-xl mb-1">{job.title}</h3>
                    <p className="text-muted-foreground text-sm mb-2">{job.desc}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><RiMapPinLine className="text-primary" /> {job.location}</span>
                      <span className="flex items-center gap-1"><RiTimeLine className="text-primary" /> {job.type}</span>
                    </div>
                  </div>
                  <button onClick={() => toast.success(`Applied to ${job.title}! We'll be in touch.`)}
                    className="shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white font-medium text-sm hover:bg-primary/90 transition-all group-hover:shadow-md">
                    Apply Now <RiArrowRightLine className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-farm-dark text-white text-center">
        <div className="container mx-auto">
          <h2 className="font-serif text-4xl font-bold mb-4">Don't See a Fit?</h2>
          <p className="text-white/70 mb-8 max-w-lg mx-auto">We're always growing. Send us your resume and tell us how you'd love to contribute to the local food movement.</p>
          <button onClick={() => toast.success("Open application submitted! We'll reach out when a role fits.")}
            className="btn-primary">Send Open Application</button>
        </div>
      </section>
    </PageLayout>
  );
}
