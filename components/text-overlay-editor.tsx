"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GENRE_TYPOGRAPHY, ASPECT_RATIOS, type Genre } from "@/lib/constants";
import { toPng } from "html-to-image";
import { saveAs } from "file-saver";
import { format } from "date-fns";
import { Download, Move } from "lucide-react";

interface TextOverlayEditorProps {
  imageUrl: string;
  formData: {
    eventName: string;
    date: string;
    location: string;
    lineup: string;
    genre: Genre;
  };
}

export function TextOverlayEditor({ imageUrl, formData }: TextOverlayEditorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedRatio, setSelectedRatio] = useState<(typeof ASPECT_RATIOS)[number]>(ASPECT_RATIOS[0]);
  const [scale, setScale] = useState(1);
  const [fontLoaded, setFontLoaded] = useState(false);

  useEffect(() => {
    // Load Inter font
    const font = new FontFace('Inter', 'url(https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2)');
    font.load().then(() => {
      document.fonts.add(font);
      setFontLoaded(true);
    });
  }, []);

  useEffect(() => {
    if (!canvasRef.current || !fontLoaded) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions
    canvas.width = selectedRatio.width;
    canvas.height = selectedRatio.height;

    // Load and draw background image
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imageUrl;
    img.onload = () => {
      // Clear canvas
      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Calculate image scaling to cover canvas while maintaining aspect ratio
      const scale = Math.max(
        canvas.width / img.width,
        canvas.height / img.height
      );
      const scaledWidth = img.width * scale;
      const scaledHeight = img.height * scale;
      const x = (canvas.width - scaledWidth) / 2;
      const y = (canvas.height - scaledHeight) / 2;

      // Draw image
      ctx.drawImage(img, x, y, scaledWidth, scaledHeight);

      // Get typography settings
      const typography = GENRE_TYPOGRAPHY[formData.genre === "Shuffle" ? "Electro / Breaks / UKG" : formData.genre];

      // Helper function to draw text with proper font settings
      const drawText = (text: string, y: number, style: any) => {
        const fontSize = parseInt(style.fontSize);
        ctx.font = `${style.fontWeight} ${fontSize}px Inter`;
        ctx.fillStyle = style.color;
        ctx.textAlign = "left";
        ctx.fillText(text, 50, y);
      };

      // Draw event name
      drawText(formData.eventName.toUpperCase(), 100, typography.eventName);

      // Draw date
      const formattedDate = format(new Date(formData.date), "dd.MM.yyyy");
      drawText(formattedDate, 170, typography.date);

      // Draw location
      drawText(formData.location.toUpperCase(), 220, typography.location);

      // Draw lineup
      const lineupLines = formData.lineup.split(",").map(line => line.trim().toUpperCase());
      let lineupY = 280;
      lineupLines.forEach(line => {
        drawText(line, lineupY, typography.lineup);
        lineupY += 30;
      });
    };
  }, [imageUrl, formData, selectedRatio, fontLoaded]);

  const handleDownload = async () => {
    if (!containerRef.current) return;

    try {
      const dataUrl = await toPng(containerRef.current, { quality: 1 });
      saveAs(dataUrl, `${formData.eventName.toLowerCase().replace(/\s+/g, "-")}-flyer.png`);
    } catch (error) {
      console.error("Error downloading image:", error);
    }
  };

  const handleAspectRatioChange = (value: string) => {
    const newRatio = ASPECT_RATIOS.find((ratio) => ratio.value === value) || ASPECT_RATIOS[0];
    setSelectedRatio(newRatio);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Select
            value={selectedRatio.value}
            onValueChange={handleAspectRatioChange}
          >
            <SelectTrigger className="w-[180px] bg-black/40 border-white/10">
              <SelectValue placeholder="Select format" />
            </SelectTrigger>
            <SelectContent className="bg-black/90 border-white/10">
              {ASPECT_RATIOS.map((ratio) => (
                <SelectItem
                  key={ratio.value}
                  value={ratio.value}
                  className="text-white/80 hover:bg-white/10 focus:bg-white/10"
                >
                  {ratio.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex items-center gap-2">
            <Move className="h-4 w-4 text-white/60" />
            <Slider
              value={[scale]}
              min={0.5}
              max={2}
              step={0.1}
              onValueChange={([value]) => setScale(value)}
              className="w-[100px]"
            />
          </div>
        </div>
        <Button
          onClick={handleDownload}
          className="bg-[#00f0ff] text-black hover:bg-[#00f0ff]/90"
        >
          <Download className="mr-2 h-4 w-4" />
          Download
        </Button>
      </div>
      <div
        ref={containerRef}
        className="relative border border-white/10 rounded-lg overflow-hidden"
        style={{
          width: selectedRatio.width * scale,
          height: selectedRatio.height * scale,
        }}
      >
        <canvas 
          ref={canvasRef}
          style={{
            width: "100%",
            height: "100%",
          }}
        />
      </div>
    </div>
  );
}
