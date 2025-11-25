// components/layout/Footer.tsx
"use client";

import { motion } from "framer-motion";
import {
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Mail,
  MapPin,
  Phone,
  Send,
  Sparkles,
  Shield,
  Truck,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const footerLinks = [
  {
    title: "Shop",
    links: [
      "All Products",
      "New Arrivals",
      "Best Sellers",
      "Sale",
      "Gift Cards",
    ],
  },
  {
    title: "Categories",
    links: ["Electronics", "Fashion", "Home & Living", "Beauty", "Sports"],
  },
  {
    title: "Company",
    links: ["About Us", "Careers", "Press", "Blog", "Affiliates"],
  },
  {
    title: "Support",
    links: [
      "Help Center",
      "Track Order",
      "Shipping Info",
      "Returns",
      "Contact Us",
    ],
  },
];

const socials = [
  { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
  { icon: Facebook, href: "https://facebook.com", label: "Facebook" },
  { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
  { icon: Youtube, href: "https://youtube.com", label: "YouTube" },
];

export default function Footer() {
  return (
    <footer className="relative mt-32 overflow-hidden bg-gradient-to-t from-black via-purple-950 to-black text-white">
      {/* Animated Background Orbs */}
      <div className="absolute inset-0 opacity-30">
        <motion.div
          animate={{ x: [-200, 200, -200], y: [-100, 150, -100] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="absolute top-20 left-20 w-96 h-96 bg-purple-600 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ x: [200, -200, 200], y: [100, -150, 100] }}
          transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-20 right-20 w-96 h-96 bg-pink-600 rounded-full blur-3xl"
        />
      </div>

      <div className="relative container mx-auto px-6 py-20">
        {/* Top Section: Links + Newsletter */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-10 mb-16">
          {/* Brand */}
          <div className="lg:col-span-2 space-y-8">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
                <span className="text-white font-black text-2xl">S</span>
              </div>
              <span className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
                ShopFlow
              </span>
            </Link>

            <p className="text-gray-400 max-w-xs">
              Premium lifestyle products delivered with love. Join 500,000+
              happy customers.
            </p>

            {/* Socials */}
            <div className="flex gap-4">
              {socials.map((social) => {
                const Icon = social.icon;
                return (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    whileHover={{ y: -4 }}
                    className="w-12 h-12 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center hover:bg-white/20 transition"
                  >
                    <Icon className="w-6 h-6" />
                  </motion.a>
                );
              })}
            </div>
          </div>

          {/* Links */}
          {footerLinks.map((column) => (
            <div key={column.title}>
              <h3 className="font-bold text-lg mb-6 text-purple-300">
                {column.title}
              </h3>
              <ul className="space-y-4">
                {column.links.map((link) => (
                  <li key={link}>
                    <Link
                      href="#"
                      className="text-gray-400 hover:text-white transition duration-300"
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Newsletter */}
          <div className="lg:col-span-2">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-yellow-400" />
              Stay in the Loop
            </h3>
            <p className="text-gray-400 mb-6">
              Get exclusive offers & early access to new drops
            </p>
            <form className="flex gap-3">
              <Input
                type="email"
                placeholder="Your email"
                className="h-14 px-6 bg-white/10 border-white/20 placeholder-gray-500 text-white focus:border-purple-400"
              />
              <Button className="h-14 px-8 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                <Send className="w-5 h-5" />
              </Button>
            </form>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent mb-10" />

        {/* Bottom Section */}
        <div className="grid grid-cols-1 md:grid-cols-1 gap-2 items-center">
          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center align-center md:justify-center gap-8 text-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
                <Shield className="w-6 h-6 text-green-400" />
              </div>
              <span>100% Secure Payments</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
                <Truck className="w-6 h-6 text-blue-400" />
              </div>
              <span>Free Shipping</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
                <Mail className="w-6 h-6 text-purple-400" />
              </div>
              <span>24/7 Support</span>
            </div>
          </div>

          {/* Copyright */}
          <div className="flex flex-wrap justify-between align-center md:justify-between gap-8 text-sm">
            <div className="text-center md:text-right text-gray-500 text-sm">
              <p>Copyright © {new Date().getFullYear()} ShopFlow. All rights reserved.</p>
            </div>
            <div className="flex justify-center text-gray-500 align-center gap-4">
              <Link href="/privacy-policy">Privacy Policy</Link>
              <Link href="/terms-and-conditions">Terms & Conditions</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
