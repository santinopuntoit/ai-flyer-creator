export const GENRE_OPTIONS = [
  "Electro / Breaks / UKG",
  "House / Tech-House",
  "Techno / Hard Techno / Industrial",
  "Hip-Hop / Trap",
  "Urban / Funk / Reggaeton",
  "Mainstream / Pop",
  "Rock / Indie / Alternative",
  "Shuffle",
] as const;

export const GENRE_PROMPTS = {
  "Electro / Breaks / UKG": "minimalist Y2K-inspired electronic music flyer, blue and magenta neon glow, sleek digital aesthetic, geometric shapes, holographic elements, dark background, futuristic interface design, high contrast, essential composition",
  "House / Tech-House": "ultra-minimal house music event poster with black background, subtle cyan blue accents, abstract geometric elements, clean negative space, 2000s tech-inspired grid layout, precise typography, digital essence",
  "Techno / Hard Techno / Industrial": "sharp-edged techno flyer, industrial neo-futurism, monochromatic with electric blue accents, dystopian minimal design, digital glitches, black background, sparse geometric elements, precise grid",
  "Hip-Hop / Trap": "minimal hip-hop event flyer with Y2K aesthetic, dark space, fluorescent orange and blue, clean silhouettes, high-tech minimal elements, digital noise texture, futuristic but essential",
  "Urban / Funk / Reggaeton": "minimalist urban music flyer, selective neon color highlights on black, clean lines, subtle gradient effects, Y2K-inspired digital aesthetics, sleek composition",
  "Mainstream / Pop": "crisp minimal pop flyer design, selective neon pink highlights, neo-Y2K aesthetic, clean black background, futuristic interface elements, essential geometric shapes, digital minimalism",
  "Rock / Indie / Alternative": "stark minimalist rock poster, high contrast black background, selective color accents, subtle texture, Y2K-inspired tech elements, sparse composition, digital noise, essential aesthetic",
} as const;

export type Genre = keyof typeof GENRE_PROMPTS | "Shuffle";

export const GENRE_TYPOGRAPHY = {
  "Electro / Breaks / UKG": {
    eventName: { fontSize: "48px", fontWeight: "200", letterSpacing: "0.1em", color: "#00f0ff" },
    date: { fontSize: "24px", fontWeight: "300", letterSpacing: "0.2em", color: "#ffffff" },
    location: { fontSize: "20px", fontWeight: "200", letterSpacing: "0.15em", color: "#ffffff80" },
    lineup: { fontSize: "16px", fontWeight: "200", letterSpacing: "0.1em", color: "#ffffff" },
  },
  "House / Tech-House": {
    eventName: { fontSize: "52px", fontWeight: "100", letterSpacing: "0.05em", color: "#00ffcc" },
    date: { fontSize: "24px", fontWeight: "200", letterSpacing: "0.3em", color: "#ffffff" },
    location: { fontSize: "18px", fontWeight: "200", letterSpacing: "0.2em", color: "#ffffff80" },
    lineup: { fontSize: "16px", fontWeight: "300", letterSpacing: "0.1em", color: "#ffffff" },
  },
  "Techno / Hard Techno / Industrial": {
    eventName: { fontSize: "56px", fontWeight: "300", letterSpacing: "0.15em", color: "#ff3366" },
    date: { fontSize: "28px", fontWeight: "200", letterSpacing: "0.25em", color: "#ffffff" },
    location: { fontSize: "20px", fontWeight: "200", letterSpacing: "0.2em", color: "#ffffff80" },
    lineup: { fontSize: "18px", fontWeight: "200", letterSpacing: "0.15em", color: "#ffffff" },
  },
  "Hip-Hop / Trap": {
    eventName: { fontSize: "54px", fontWeight: "700", letterSpacing: "0.02em", color: "#ffcc00" },
    date: { fontSize: "26px", fontWeight: "300", letterSpacing: "0.1em", color: "#ffffff" },
    location: { fontSize: "20px", fontWeight: "200", letterSpacing: "0.05em", color: "#ffffff80" },
    lineup: { fontSize: "18px", fontWeight: "400", letterSpacing: "0.05em", color: "#ffffff" },
  },
  "Urban / Funk / Reggaeton": {
    eventName: { fontSize: "50px", fontWeight: "500", letterSpacing: "0.05em", color: "#ff9900" },
    date: { fontSize: "24px", fontWeight: "300", letterSpacing: "0.15em", color: "#ffffff" },
    location: { fontSize: "18px", fontWeight: "200", letterSpacing: "0.1em", color: "#ffffff80" },
    lineup: { fontSize: "16px", fontWeight: "300", letterSpacing: "0.05em", color: "#ffffff" },
  },
  "Mainstream / Pop": {
    eventName: { fontSize: "52px", fontWeight: "400", letterSpacing: "0.1em", color: "#ff66cc" },
    date: { fontSize: "26px", fontWeight: "300", letterSpacing: "0.2em", color: "#ffffff" },
    location: { fontSize: "20px", fontWeight: "200", letterSpacing: "0.15em", color: "#ffffff80" },
    lineup: { fontSize: "18px", fontWeight: "300", letterSpacing: "0.1em", color: "#ffffff" },
  },
  "Rock / Indie / Alternative": {
    eventName: { fontSize: "54px", fontWeight: "600", letterSpacing: "0.05em", color: "#cc0000" },
    date: { fontSize: "26px", fontWeight: "300", letterSpacing: "0.2em", color: "#ffffff" },
    location: { fontSize: "20px", fontWeight: "200", letterSpacing: "0.15em", color: "#ffffff80" },
    lineup: { fontSize: "18px", fontWeight: "400", letterSpacing: "0.1em", color: "#ffffff" },
  },
} as const;

export const ASPECT_RATIOS = [
  { name: "Instagram Post", value: "1:1", width: 1080, height: 1080 },
  { name: "Instagram Story", value: "9:16", width: 1080, height: 1920 },
  { name: "Facebook Event", value: "16:9", width: 1920, height: 1080 },
  { name: "Print A4", value: "210:297", width: 2480, height: 3508 },
] as const;