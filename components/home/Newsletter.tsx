"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Newsletter() {
  return (
    <section className="py-24 bg-neutral-100 dark:bg-neutral-900">
      <div className="container mx-auto px-4 max-w-2xl text-center">
        <h2 className="text-3xl font-serif mb-4 text-gray-900 dark:text-white">
          Join Our Newsletter
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8 font-light">
          Subscribe to receive updates, access to exclusive deals, and more.
        </p>

        <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
          <Input
            type="email"
            placeholder="Enter your email address"
            className="h-12 rounded-none border-gray-300 bg-white dark:bg-neutral-800 dark:border-neutral-700 focus:ring-0 focus:border-gray-900"
          />
          <Button className="h-12 px-8 rounded-none bg-gray-900 text-white hover:bg-gray-800 uppercase tracking-widest text-xs">
            Subscribe
          </Button>
        </form>
      </div>
    </section>
  );
}
