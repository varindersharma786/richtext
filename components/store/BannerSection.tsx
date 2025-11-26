"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface Banner {
  id: string;
  title: string;
  description: string | null;
  image_url: string;
  link_url: string | null;
  button_text: string | null;
}

export default function BannerSection({
  position,
}: {
  position: "home" | "products" | "all";
}) {
  const [banners, setBanners] = useState<Banner[]>([]);
  const supabase = createClient();

  useEffect(() => {
    const fetchBanners = async () => {
      const { data } = await supabase
        .from("banners")
        .select("*")
        .eq("is_active", true)
        .in("position", [position, "all"])
        .order("display_order", { ascending: true });

      if (data) {
        setBanners(data);
      }
    };

    fetchBanners();
  }, [position]);

  if (banners.length === 0) {
    return null;
  }

  return (
    <section className="py-12">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {banners.map((banner, index) => (
            <motion.div
              key={banner.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative h-96 rounded-2xl overflow-hidden group"
            >
              <Image
                src={banner.image_url}
                alt={banner.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex flex-col justify-end p-8">
                <h3 className="text-white text-3xl font-bold mb-2">
                  {banner.title}
                </h3>
                {banner.description && (
                  <p className="text-white/90 text-sm mb-4">
                    {banner.description}
                  </p>
                )}
                {banner.link_url && banner.button_text && (
                  <Link href={banner.link_url}>
                    <Button className="bg-white text-black hover:bg-gray-100">
                      {banner.button_text}
                    </Button>
                  </Link>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
