"use client";

import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GENRE_OPTIONS, type Genre } from "@/lib/constants";
import { generateImage } from "@/lib/replicate";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { ApiTokenConfig } from "@/components/api-token-config";
import { TextOverlayEditor } from "@/components/text-overlay-editor";

const formSchema = z.object({
  eventName: z.string().min(1, "Event name is required"),
  date: z.string().min(1, "Date is required"),
  location: z.string().min(1, "Location is required"),
  lineup: z.string().min(1, "Lineup is required"),
  genre: z.enum(GENRE_OPTIONS),
  customPrompt: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

function buildPrompt(data: FormValues): string {
  const eventDetails = `event called "${data.eventName}" on ${data.date} at ${data.location} featuring ${data.lineup}`;
  
  let completePrompt = `Create a professional music event flyer for an ${eventDetails}. The image should be suitable for a flyer with ultra-minimalist neo-futuristic style, clean composition, precise details, digital aesthetic inspired by Y2K and modern tech interfaces. No text in the image - leave clean space for text overlay. Use dark backgrounds with selective neon accents, avoid clutter, high contrast, cinematic lighting.`;
  
  if (data.customPrompt) {
    completePrompt += ` Additional details: ${data.customPrompt}`;
  }
  
  return completePrompt;
}

export function FlyerCreator() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState<string>(GENRE_OPTIONS[0]);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [hasToken, setHasToken] = useState(false);
  const [formData, setFormData] = useState<FormValues | null>(null);

  useEffect(() => {
    const checkToken = () => {
      const token = localStorage.getItem("replicate_token") || process.env.NEXT_PUBLIC_REPLICATE_API_TOKEN;
      setHasToken(!!token);
    };

    checkToken();
    window.addEventListener("replicate_token_updated", checkToken);
    return () => window.removeEventListener("replicate_token_updated", checkToken);
  }, []);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      eventName: "",
      date: "",
      location: "",
      lineup: "",
      genre: GENRE_OPTIONS[0],
      customPrompt: "",
    },
  });

  async function onSubmit(data: FormValues) {
    if (!hasToken) {
      toast.error("Please configure your Replicate API token first");
      return;
    }

    setIsGenerating(true);
    try {
      const prompt = buildPrompt(data);
      console.log("Starting image generation with prompt:", prompt);
      
      const imageUrl = await generateImage(prompt);
      
      if (Array.isArray(imageUrl) && imageUrl.length > 0) {
        console.log("Image generated successfully:", imageUrl[0]);
        setGeneratedImage(imageUrl[0]);
        setFormData(data);
        toast.success("Flyer generated successfully!");
      } else {
        console.error("Invalid response format:", imageUrl);
        throw new Error("Invalid response from image generation");
      }
    } catch (error) {
      console.error("Error generating flyer:", error);
      toast.error(error instanceof Error ? error.message : "Failed to generate flyer. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex justify-end">
        <ApiTokenConfig />
      </div>
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="eventName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white/80">Event Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter event name"
                          className="bg-black/40 border-white/10"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white/80">Date</FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          className="bg-black/40 border-white/10"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white/80">Location</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter venue or location"
                          className="bg-black/40 border-white/10"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="lineup"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white/80">Lineup</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter artists (one per line)"
                          className="bg-black/40 border-white/10 min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="genre"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white/80">Genre</FormLabel>
                      <Select 
                        onValueChange={(value) => {
                          field.onChange(value);
                          setSelectedGenre(value);
                        }}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="bg-black/40 border-white/10">
                            <SelectValue placeholder="Select a genre" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-black/90 border-white/10">
                          {GENRE_OPTIONS.map((genre) => (
                            <SelectItem 
                              key={genre} 
                              value={genre}
                              className="text-white/80 hover:bg-white/10 focus:bg-white/10"
                            >
                              {genre}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="customPrompt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white/80">Custom Prompt (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Add custom details to guide the AI generation"
                          className="bg-black/40 border-white/10"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button
                type="submit"
                disabled={isGenerating || !hasToken}
                className="w-full bg-[#00f0ff] text-black hover:bg-[#00f0ff]/90"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  "Generate Flyer"
                )}
              </Button>
              {!hasToken && (
                <p className="text-sm text-white/60 text-center">
                  Please configure your API token to generate flyers
                </p>
              )}
            </form>
          </Form>
        </div>
        <div className="space-y-6">
          {generatedImage && formData ? (
            <TextOverlayEditor imageUrl={generatedImage} formData={formData} />
          ) : (
            <div className="rounded-lg border border-white/10 bg-black/40 p-4 aspect-[3/4] flex items-center justify-center text-white/60">
              {isGenerating ? (
                <div className="flex flex-col items-center space-y-4">
                  <Loader2 className="h-8 w-8 animate-spin text-[#00f0ff]" />
                  <p>Creating your flyer...</p>
                </div>
              ) : (
                "Generated flyer will appear here"
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}