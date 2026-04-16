import PageLayout from "@/components/layout/PageLayout";
import { motion } from "framer-motion";

const TERMS = [
  { title: "1. Acceptance of Terms", content: "By accessing or using the FromTheFields platform, you agree to be bound by these Terms of Service. If you disagree with any part of these terms, you may not access our services. These terms apply to all visitors, users, and others who access or use the service." },
  { title: "2. User Accounts", content: "You must be 18 years or older to create an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. Notify us immediately of any unauthorized use. We reserve the right to terminate accounts that violate our policies." },
  { title: "3. Marketplace Rules", content: "Farmers listing products represent and warrant that all product information is accurate, products meet applicable food safety standards, and pricing is fair and non-discriminatory. Customers agree to provide accurate delivery information and to inspect products upon delivery. Disputes between buyers and sellers are mediated by FromTheFields." },
  { title: "4. Payment Terms", content: "All prices are in USD. Payment is required at checkout. Farmers receive 80% of the sale price, minus applicable payment processing fees. FromTheFields retains 20% as a platform fee. Refunds are processed within 5-7 business days for eligible claims." },
  { title: "5. Delivery & Fulfillment", content: "Delivery times are estimates. FromTheFields is not liable for delays caused by weather, traffic, or other factors beyond our control. Delivery partners are independent contractors. If a delivery fails, we will attempt redelivery or issue a full refund at your request." },
  { title: "6. Subscriptions", content: "Subscriptions renew automatically on your chosen schedule. You may cancel, pause, or modify your subscription at any time with at least 48 hours notice before the next delivery window. Refunds for prepaid subscription periods are prorated." },
  { title: "7. Prohibited Uses", content: "You may not use our platform to: sell counterfeit or mislabeled products; engage in price manipulation; create fake reviews; spam other users; scrape platform data; or engage in any unlawful activity. Violations may result in immediate account termination." },
  { title: "8. Limitation of Liability", content: "FromTheFields is not liable for indirect, incidental, special, or consequential damages arising from your use of our platform. Our total liability for any claim shall not exceed the total amount paid by you in the 12 months preceding the claim." },
];

export default function Terms() {
  return (
    <PageLayout>
      <section className="pt-32 pb-16 bg-hero-pattern">
        <div className="container mx-auto max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-primary font-medium text-sm uppercase tracking-widest mb-2">Legal</p>
            <h1 className="font-serif text-5xl font-bold mb-4">Terms of Service</h1>
            <p className="text-muted-foreground">Last updated: April 16, 2026</p>
          </motion.div>
        </div>
      </section>
      <section className="py-16">
        <div className="container mx-auto max-w-3xl space-y-10">
          {TERMS.map((term, i) => (
            <motion.div key={term.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.04 }}>
              <h2 className="font-serif text-xl font-bold mb-3">{term.title}</h2>
              <p className="text-muted-foreground leading-relaxed">{term.content}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </PageLayout>
  );
}
