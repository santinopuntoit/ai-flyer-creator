import { Sparkles } from "lucide-react";

export function Header() {
  return (
    <header className="border-b border-white/10 bg-black/40 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles className="h-6 w-6 text-[#00f0ff]" />
            <h1 className="text-2xl font-extralight tracking-wider">AI FLYER CREATOR</h1>
          </div>
          <p className="text-sm font-light tracking-wider text-white/60">
            generate <span className="text-[#00f0ff]">/</span> customize <span className="text-[#00f0ff]">/</span> download
          </p>
        </div>
      </div>
    </header>
  );
}