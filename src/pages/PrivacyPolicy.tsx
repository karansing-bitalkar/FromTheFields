import PageLayout from "@/components/layout/PageLayout";
import { motion } from "framer-motion";

const SECTIONS = [
  {
    title: "1. Information We Collect",
    content: `We collect information you provide directly to us when you create an account, place an order, subscribe to a plan, or contact our support team. This includes your name, email address, phone number, delivery address, and payment details.

We also automatically collect certain usage data when you interact with our platform, including device information, IP address, browser type, pages viewed, and time spent on the platform.`,
  },
  {
    title: "2. How We Use Your Information",
    content: `We use your personal information to: process and fulfill your orders; communicate with you about deliveries, subscriptions, and promotions; improve and personalize our platform; prevent fraud and ensure platform security; comply with legal obligations; and send transactional notifications related to your account.

We do not sell your personal data to third parties. Period.`,
  },
  {
    title: "3. Information Sharing",
    content: `We share your data only with: farmers fulfilling your orders (name, delivery address); delivery partners completing your delivery (name, address, order details); payment processors for secure transaction handling; and analytics providers to improve platform performance. All third parties are bound by strict data protection agreements.`,
  },
  {
    title: "4. Data Security",
    content: `We use industry-standard encryption (TLS/SSL) for all data transmission. Payment data is processed through PCI-DSS compliant payment processors and never stored on our servers. We conduct regular security audits and penetration tests.`,
  },
  {
    title: "5. Your Rights",
    content: `You have the right to: access the personal data we hold about you; request correction of inaccurate data; request deletion of your account and data; opt out of marketing communications; port your data to another service. Submit requests through your account settings or by emailing privacy@fromthefields.com.`,
  },
  {
    title: "6. Cookies",
    content: `We use cookies to maintain your session, remember preferences, and analyze platform usage. You can control cookies through your browser settings. Disabling cookies may affect platform functionality.`,
  },
  {
    title: "7. Children's Privacy",
    content: `Our platform is not directed to individuals under 13. We do not knowingly collect personal data from children. If you believe a child has provided us with personal data, contact us immediately.`,
  },
  {
    title: "8. Changes to This Policy",
    content: `We may update this policy to reflect changes in our practices or legal requirements. We will notify you of significant changes via email or platform notification at least 30 days before they take effect.`,
  },
];

export default function PrivacyPolicy() {
  return (
    <PageLayout>
      <section className="pt-32 pb-16 bg-hero-pattern">
        <div className="container mx-auto max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-primary font-medium text-sm uppercase tracking-widest mb-2">Legal</p>
            <h1 className="font-serif text-5xl font-bold mb-4">Privacy Policy</h1>
            <p className="text-muted-foreground">Last updated: April 16, 2026 · Effective: April 16, 2026</p>
          </motion.div>
        </div>
      </section>
      <section className="py-16">
        <div className="container mx-auto max-w-3xl">
          <div className="bg-primary/5 rounded-2xl p-6 mb-10 border border-primary/20">
            <p className="text-sm leading-relaxed text-foreground/80">
              At FromTheFields, your privacy is not an afterthought — it's a core value. We believe you should know exactly what we collect, why, and how it's used. This policy is written in plain language so you can actually understand it.
            </p>
          </div>
          <div className="space-y-10">
            {SECTIONS.map((section, i) => (
              <motion.div key={section.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
                <h2 className="font-serif text-xl font-bold mb-4 text-foreground">{section.title}</h2>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{section.content}</p>
              </motion.div>
            ))}
          </div>
          <div className="mt-12 p-6 bg-card rounded-2xl border border-border">
            <h3 className="font-semibold mb-2">Questions about your privacy?</h3>
            <p className="text-muted-foreground text-sm">Contact our Data Protection Officer at <span className="text-primary">privacy@fromthefields.com</span> or write to: FromTheFields Privacy Team, 123 Green Ave, Portland, OR 97201.</p>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
