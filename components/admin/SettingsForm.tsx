"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import ImageUploader from "./image-uploader";
import { Database } from "@/types";

type StoreSettings = Database["public"]["Tables"]["store_settings"]["Row"];

interface SettingsFormProps {
  initialSettings: StoreSettings | null;
}

export default function SettingsForm({ initialSettings }: SettingsFormProps) {
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState<Partial<StoreSettings>>(
    initialSettings || {
      store_name: "YourStore",
      support_email: "support@example.com",
      social_links: {
        facebook: "",
        twitter: "",
        instagram: "",
        youtube: "",
      },
      logo_url: null,
      maintenance_mode: false,
    }
  );

  const handleSocialChange = (platform: string, value: string) => {
    setSettings((prev) => ({
      ...prev,
      social_links: {
        ...(prev.social_links as any),
        [platform]: value,
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from("store_settings")
        .upsert({
          id: initialSettings?.id, // If id exists, it updates; otherwise it might create new but we want to update the single row
          store_name: settings.store_name!,
          support_email: settings.support_email!,
          social_links: settings.social_links!,
          logo_url: settings.logo_url,
          maintenance_mode: settings.maintenance_mode || false,
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;

      toast.success("Settings updated successfully");
    } catch (error) {
      console.error("Error updating settings:", error);
      toast.error("Failed to update settings");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-8">
        <Card className="border-none shadow-sm bg-white dark:bg-neutral-900">
          <CardHeader>
            <CardTitle>General Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="store-name">Store Name</Label>
              <Input
                id="store-name"
                value={settings.store_name}
                onChange={(e) =>
                  setSettings({ ...settings, store_name: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="support-email">Support Email</Label>
              <Input
                id="support-email"
                type="email"
                value={settings.support_email}
                onChange={(e) =>
                  setSettings({ ...settings, support_email: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Store Logo</Label>
              <ImageUploader
                value={settings.logo_url || ""}
                onChange={(url) => setSettings({ ...settings, logo_url: url })}
                onRemove={() => setSettings({ ...settings, logo_url: null })}
                bucket="store-logo"
              />
            </div>
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <Label className="text-base">Maintenance Mode</Label>
                <p className="text-sm text-muted-foreground">
                  Disable the storefront for visitors.
                </p>
              </div>
              <Switch
                checked={settings.maintenance_mode}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, maintenance_mode: checked })
                }
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-white dark:bg-neutral-900">
          <CardHeader>
            <CardTitle>Social Media Links</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="facebook">Facebook</Label>
                <Input
                  id="facebook"
                  placeholder="https://facebook.com/..."
                  value={(settings.social_links as any)?.facebook || ""}
                  onChange={(e) =>
                    handleSocialChange("facebook", e.target.value)
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="twitter">Twitter / X</Label>
                <Input
                  id="twitter"
                  placeholder="https://twitter.com/..."
                  value={(settings.social_links as any)?.twitter || ""}
                  onChange={(e) =>
                    handleSocialChange("twitter", e.target.value)
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="instagram">Instagram</Label>
                <Input
                  id="instagram"
                  placeholder="https://instagram.com/..."
                  value={(settings.social_links as any)?.instagram || ""}
                  onChange={(e) =>
                    handleSocialChange("instagram", e.target.value)
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="youtube">YouTube</Label>
                <Input
                  id="youtube"
                  placeholder="https://youtube.com/..."
                  value={(settings.social_links as any)?.youtube || ""}
                  onChange={(e) =>
                    handleSocialChange("youtube", e.target.value)
                  }
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button
            type="submit"
            className="bg-taupe-900 hover:bg-taupe-800 text-white"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </form>
  );
}
