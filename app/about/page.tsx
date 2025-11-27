import { Mail, MapPin, Phone } from "lucide-react";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-neutral-950">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center bg-gray-100 dark:bg-neutral-900">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/50 dark:to-neutral-950/50" />
        <div className="container mx-auto px-4 max-w-[1400px] text-center relative z-10">
          <h1 className="text-5xl md:text-7xl font-serif mb-6 text-gray-900 dark:text-white">
            About Us
          </h1>
          <div className="w-20 h-0.5 bg-gray-900 dark:bg-white mx-auto mb-6" />
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto font-light">
            Crafting timeless elegance through curated collections
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-24 bg-white dark:bg-neutral-950">
        <div className="container mx-auto px-4 max-w-[1200px]">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-serif mb-6 text-gray-900 dark:text-white">
                Our Story
              </h2>
              <div className="w-16 h-0.5 bg-gray-900 dark:bg-white mb-8" />
              <div className="space-y-4 text-gray-600 dark:text-gray-300 leading-relaxed">
                <p>
                  Founded with a passion for timeless design and exceptional
                  quality, we believe in creating pieces that transcend trends
                  and seasons.
                </p>
                <p>
                  Every item in our collection is thoughtfully curated to bring
                  you the perfect blend of contemporary aesthetics and enduring
                  craftsmanship.
                </p>
                <p>
                  We partner with artisans and makers who share our commitment
                  to sustainability, ethical production, and creating products
                  that tell a story.
                </p>
              </div>
            </div>
            <div className="relative aspect-[4/5] bg-gray-100 dark:bg-neutral-800 overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center text-gray-400 dark:text-gray-600">
                <p className="text-sm">Premium Brand Image</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 bg-gray-50 dark:bg-neutral-900/50">
        <div className="container mx-auto px-4 max-w-[1200px]">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif mb-4 text-gray-900 dark:text-white">
              Our Values
            </h2>
            <div className="w-20 h-0.5 bg-gray-900 dark:bg-white mx-auto" />
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                title: "Quality First",
                description:
                  "We believe in craftsmanship and attention to detail. Every product is selected for its exceptional quality and durability.",
              },
              {
                title: "Sustainable",
                description:
                  "Committed to ethical sourcing and sustainable practices. We care about the future of our planet.",
              },
              {
                title: "Timeless Design",
                description:
                  "Our collections are built to last, both in quality and style. Classic pieces that never go out of fashion.",
              },
            ].map((value, index) => (
              <div key={index} className="text-center">
                <h3 className="text-2xl font-serif mb-4 text-gray-900 dark:text-white">
                  {value.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24 bg-white dark:bg-neutral-950">
        <div className="container mx-auto px-4 max-w-[1200px]">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif mb-4 text-gray-900 dark:text-white">
              Meet Our Team
            </h2>
            <div className="w-20 h-0.5 bg-gray-900 dark:bg-white mx-auto mb-6" />
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              The passionate individuals behind our brand
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: "Sarah Johnson", role: "Founder & Creative Director" },
              { name: "Michael Chen", role: "Head of Design" },
              { name: "Emily Rodriguez", role: "Sustainability Lead" },
            ].map((member, index) => (
              <div key={index} className="group">
                <div className="relative aspect-[3/4] bg-gray-100 dark:bg-neutral-800 mb-4 overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center text-gray-400 dark:text-gray-600">
                    <p className="text-sm">Team Member Photo</p>
                  </div>
                </div>
                <h3 className="text-xl font-serif mb-1 text-gray-900 dark:text-white">
                  {member.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {member.role}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA Section */}
      <section className="py-24 bg-gray-900 dark:bg-black text-white">
        <div className="container mx-auto px-4 max-w-[1200px] text-center">
          <h2 className="text-4xl font-serif mb-6">
            Let's Start a Conversation
          </h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            We'd love to hear from you. Whether you have a question about our
            products, need styling advice, or just want to chat.
          </p>
          <a
            href="/contact"
            className="inline-block bg-white text-gray-900 px-8 py-4 hover:bg-gray-100 transition-colors"
          >
            Contact Us
          </a>
        </div>
      </section>
    </main>
  );
}
