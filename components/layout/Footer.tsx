import Link from "next/link";
import { Facebook, Twitter, Instagram, Youtube, Mail } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Database } from "@/types";

type StoreSettings = Database["public"]["Tables"]["store_settings"]["Row"];

export default function Footer({
  storeSettings,
}: {
  storeSettings?: StoreSettings | null;
}) {
  const socialLinks = storeSettings?.social_links as any;

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-6 max-w-7xl py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg" />
              <span className="font-bold text-xl text-white">
                {storeSettings?.store_name || "YourStore"}
              </span>
            </div>
            <p className="text-gray-400 mb-6 max-w-sm">
              Discover quality products at amazing prices. Your one-stop shop
              for everything you need.
            </p>
            {storeSettings?.support_email && (
              <p className="text-gray-400 mb-6 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <a
                  href={`mailto:${storeSettings.support_email}`}
                  className="hover:text-white transition-colors"
                >
                  {storeSettings.support_email}
                </a>
              </p>
            )}
            <div className="flex space-x-4">
              {socialLinks?.facebook && (
                <a
                  href={socialLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-gray-800 hover:bg-purple-600 flex items-center justify-center transition-colors"
                >
                  <Facebook className="w-5 h-5" />
                </a>
              )}
              {socialLinks?.twitter && (
                <a
                  href={socialLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-gray-800 hover:bg-purple-600 flex items-center justify-center transition-colors"
                >
                  <Twitter className="w-5 h-5" />
                </a>
              )}
              {socialLinks?.instagram && (
                <a
                  href={socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-gray-800 hover:bg-purple-600 flex items-center justify-center transition-colors"
                >
                  <Instagram className="w-5 h-5" />
                </a>
              )}
              {socialLinks?.youtube && (
                <a
                  href={socialLinks.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-gray-800 hover:bg-purple-600 flex items-center justify-center transition-colors"
                >
                  <Youtube className="w-5 h-5" />
                </a>
              )}
            </div>
          </div>

          {/* Shop */}
          <div>
            <h3 className="text-white font-semibold mb-4">Shop</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/products"
                  className="hover:text-white transition-colors"
                >
                  All Products
                </Link>
              </li>
              <li>
                <Link
                  href="/categories"
                  className="hover:text-white transition-colors"
                >
                  Categories
                </Link>
              </li>
              <li>
                <Link
                  href="/products?sort=new"
                  className="hover:text-white transition-colors"
                >
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link
                  href="/products?sale=true"
                  className="hover:text-white transition-colors"
                >
                  Sale
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/about"
                  className="hover:text-white transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="hover:text-white transition-colors"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-white transition-colors"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="hover:text-white transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="hover:text-white transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-semibold mb-4">Support</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/help"
                  className="hover:text-white transition-colors"
                >
                  Help Center
                </Link>
              </li>
              <li>
                <Link
                  href="/shipping"
                  className="hover:text-white transition-colors"
                >
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link
                  href="/returns"
                  className="hover:text-white transition-colors"
                >
                  Returns
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="hover:text-white transition-colors"
                >
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className="border-t border-gray-800 mt-12 pt-12">
          <div className="max-w-md">
            <h3 className="text-white font-semibold mb-2">
              Subscribe to our newsletter
            </h3>
            <p className="text-gray-400 text-sm mb-4">
              Get the latest updates on new products and upcoming sales
            </p>
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="Enter your email"
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
              />
              <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                <Mail className="w-4 h-4 mr-2" />
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()}{" "}
            {storeSettings?.store_name || "YourStore"}. All rights reserved.
          </p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <Link
              href="/privacy"
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              Terms
            </Link>
            <Link
              href="/cookies"
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
