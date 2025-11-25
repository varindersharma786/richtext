// components/store/Newsletter.tsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Confetti from "react-confetti";
import { Sparkles, Send, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useWindowSize } from "react-use";
import { toast } from "sonner";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const { width, height } = useWindowSize();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) {
      toast.error("Invalid email");
      return;
    }

    setLoading(true);

    // Simulate API call (replace with real Supabase insert later)
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setLoading(false);
    setSubscribed(true);
    setShowConfetti(true);
    setEmail("");

    toast("Welcome to the club! ✨");

    setTimeout(() => setShowConfetti(false), 8000);
  };

  return (
    <>
      {showConfetti && <Confetti width={width} height={height} recycle={false} numberOfPieces={400} gravity={0.15} />}

      <section className="relative py-24 px-6 overflow-hidden">
        {/* Animated Background Gradient Orbs */}
        <div className="absolute inset-0">
          <motion.div
            animate={{
              x: [-100, 100, -100],
              y: [-50, 100, -50],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute top-10 left-10 w-96 h-96 bg-purple-600 rounded-full blur-3xl opacity-30"
          />
          <motion.div
            animate={{
              x: [100, -100, 100],
              y: [50, -100, 50],
            }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-10 right-10 w-96 h-96 bg-pink-600 rounded-full blur-3xl opacity-30"
          />
        </div>

        <div className="container relative z-10 mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative rounded-3xl bg-white/10 backdrop-blur-2xl border border-white/20 shadow-2xl overflow-hidden"
          >
            {/* Inner Gradient Glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 via-transparent to-pink-600/20" />

            <div className="relative p-12 md:p-16 text-center">
              {/* Sparkles Top */}
              <div className="flex justify-center gap-8 mb-6">
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{ y: [0, -15, 0] }}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                  >
                    <Sparkles className="w-6 h-6 text-yellow-400" />
                  </motion.div>
                ))}
              </div>

              <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
                Join the Inner Circle
              </h2>
              <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
                Get <span className="font-bold text-yellow-300">15% OFF</span> your first order + exclusive weekly drops, secret sales, and early access to limited editions.
              </p>

              {subscribed ? (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="flex flex-col items-center gap-4"
                >
                  <CheckCircle className="w-20 h-20 text-green-400" />
                  <p className="text-2xl font-semibold text-white">
                    You're in! Check your email for your discount 🎉
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-14 px-6 text-lg bg-white/20 border-white/30 placeholder-white/60 text-white focus:border-white/60 backdrop-blur-xl"
                  />
                  <Button
                    type="submit"
                    size="lg"
                    disabled={loading}
                    className="h-14 px-8 text-lg font-semibold bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-xl"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <div className="w-5 h-5 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                        Subscribing...
                      </span>
                    ) : (
                      <>
                        Get My Discount
                        <Send className="ml-2 w-5 h-5" />
                      </>
                    )}
                  </Button>
                </form>
              )}

              <p className="mt-8 text-sm text-white/70">
                50,000+ happy shoppers • Unsubscribe anytime • No spam, ever.
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}