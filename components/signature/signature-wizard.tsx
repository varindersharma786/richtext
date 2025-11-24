"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SignatureData, templates } from "./templates";
import { SignatureElement } from "./signature-builder";
import { Wand2 } from "lucide-react";
import ImageUploader from "@/components/admin/image-uploader";

interface SignatureWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (elements: SignatureElement[]) => void;
}

export default function SignatureWizard({
  isOpen,
  onClose,
  onGenerate,
}: SignatureWizardProps) {
  const [data, setData] = useState<SignatureData>({
    fullName: "",
    jobTitle: "",
    company: "",
    email: "",
    phone: "",
    website: "",
    address: "",
    avatarUrl: "",
    linkedin: "",
    twitter: "",
    facebook: "",
    instagram: "",
  });

  const [selectedTemplateId, setSelectedTemplateId] = useState(templates[0].id);

  const handleGenerate = () => {
    const template = templates.find((t) => t.id === selectedTemplateId);
    if (template) {
      const elements = template.generate(data);
      onGenerate(elements);
      onClose();
    }
  };

  const handleChange = (key: keyof SignatureData, value: string) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wand2 className="w-5 h-5" /> Signature Wizard
          </DialogTitle>
          <DialogDescription>
            Enter your details and choose a template to instantly create a
            professional signature.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex gap-6 pt-4">
          {/* Left Side: Input Form */}
          <div className="w-1/2 flex flex-col gap-4 overflow-y-auto pr-2">
            <Tabs defaultValue="basics" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="basics">Basics</TabsTrigger>
                <TabsTrigger value="social">Social & Images</TabsTrigger>
              </TabsList>

              <TabsContent value="basics" className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    placeholder="John Doe"
                    value={data.fullName}
                    onChange={(e) => handleChange("fullName", e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="jobTitle">Job Title</Label>
                    <Input
                      id="jobTitle"
                      placeholder="Software Engineer"
                      value={data.jobTitle}
                      onChange={(e) => handleChange("jobTitle", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company">Company</Label>
                    <Input
                      id="company"
                      placeholder="Acme Corp"
                      value={data.company}
                      onChange={(e) => handleChange("company", e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    placeholder="john@example.com"
                    value={data.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    placeholder="+1 (555) 123-4567"
                    value={data.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    placeholder="www.example.com"
                    value={data.website}
                    onChange={(e) => handleChange("website", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    placeholder="123 Main St, City, Country"
                    value={data.address}
                    onChange={(e) => handleChange("address", e.target.value)}
                  />
                </div>
              </TabsContent>

              <TabsContent value="social" className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label>Profile Picture</Label>
                  <div className="flex gap-4 items-center">
                    <div className="w-20 h-20 bg-muted rounded-full overflow-hidden flex items-center justify-center border">
                      {data.avatarUrl ? (
                        <img
                          src={data.avatarUrl}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-xs text-muted-foreground">
                          No Image
                        </span>
                      )}
                    </div>
                    <div className="flex-1 space-y-2">
                      <ImageUploader
                        value={data.avatarUrl}
                        onChange={(url) => handleChange("avatarUrl", url)}
                      />
                      <Input
                        placeholder="Or image URL..."
                        value={data.avatarUrl}
                        onChange={(e) =>
                          handleChange("avatarUrl", e.target.value)
                        }
                        className="text-xs"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="linkedin">LinkedIn URL</Label>
                  <Input
                    id="linkedin"
                    placeholder="https://linkedin.com/in/..."
                    value={data.linkedin}
                    onChange={(e) => handleChange("linkedin", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="twitter">Twitter/X URL</Label>
                  <Input
                    id="twitter"
                    placeholder="https://twitter.com/..."
                    value={data.twitter}
                    onChange={(e) => handleChange("twitter", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="facebook">Facebook URL</Label>
                  <Input
                    id="facebook"
                    placeholder="https://facebook.com/..."
                    value={data.facebook}
                    onChange={(e) => handleChange("facebook", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="instagram">Instagram URL</Label>
                  <Input
                    id="instagram"
                    placeholder="https://instagram.com/..."
                    value={data.instagram}
                    onChange={(e) => handleChange("instagram", e.target.value)}
                  />
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Side: Template Selection */}
          <div className="w-1/2 flex flex-col gap-4">
            <Label className="text-lg font-semibold">Select Layout</Label>
            <ScrollArea className="flex-1 border rounded-md p-4 bg-muted/20">
              <div className="grid grid-cols-1 gap-4">
                {templates.map((template) => (
                  <div
                    key={template.id}
                    className={`
                      border-2 rounded-lg p-4 cursor-pointer transition-all hover:border-primary/50
                      ${
                        selectedTemplateId === template.id
                          ? "border-primary bg-primary/5"
                          : "border-border bg-card"
                      }
                    `}
                    onClick={() => setSelectedTemplateId(template.id)}
                  >
                    <div className="font-semibold mb-1">{template.name}</div>
                    <div className="text-sm text-muted-foreground mb-3">
                      {template.description}
                    </div>
                    {/* Mini Preview Placeholder */}
                    <div className="h-24 bg-white rounded border border-dashed border-gray-300 flex items-center justify-center text-xs text-gray-400">
                      Preview of {template.name}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleGenerate} className="gap-2">
            <Wand2 className="w-4 h-4" /> Generate Signature
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
