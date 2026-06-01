import { Button } from "@/components/ui/button";
import { ArrowRight, Play, Sparkles, Quote } from "lucide-react";
import storyVideo from "@/assets/story.mp4";

const StorySection = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-amber-50/30 via-white to-amber-50/20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Side - Text Content */}
          <div className="animate-fade-in">
            <div className="inline-flex items-center gap-2 bg-amber-100 rounded-full px-4 py-1.5 mb-6">
              <Sparkles className="h-4 w-4 text-amber-600" />
              <span className="text-amber-700 text-sm font-medium">OUR HERITAGE</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold text-[#3E2723] mb-6">
              Our Story
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-amber-500 to-amber-600 mb-8 rounded-full"></div>
            
            <div className="space-y-6 text-[#5D4037]/80 leading-relaxed">
              <p className="text-lg">
                Momore Limited was founded with a passion for celebrating African heritage through beautifully crafted products. We work directly with skilled artisans across Africa to create unique, high-quality items that blend traditional techniques with contemporary design.
              </p>
              <p className="text-lg">
                Our commitment to ethical production means that every purchase supports sustainable livelihoods and preserves cultural craftsmanship for future generations.
              </p>
            </div>
            
            <Button 
              className="mt-8 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white rounded-full px-8 py-6 shadow-md hover:shadow-xl transition-all duration-300 group"
            >
              Learn More About Us
              <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
            </Button>
          </div>

          {/* Right Side - Video Section */}
          <div className="relative animate-fade-in">
            <div className="relative overflow-hidden rounded-2xl shadow-2xl group">
              {/* Video Container */}
              <div className="relative overflow-hidden rounded-2xl">
                <video
                  src={storyVideo}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-96 object-cover transition-transform duration-700 group-hover:scale-105"
                />
                
                {/* Video Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#3E2723]/60 via-[#3E2723]/20 to-transparent" />
                
                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-90 group-hover:scale-100">
                    <Play className="h-8 w-8 text-white ml-1" />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Floating Card */}
            <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-2xl shadow-xl border-l-4 border-amber-500">
              <Quote className="h-8 w-8 text-amber-500 mb-2" />
              <p className="text-sm font-semibold text-[#3E2723]">Cultural Elegance</p>
              <p className="text-xs text-[#5D4037]/60">Crafted for You</p>
            </div>
            
            {/* Decorative Element */}
            <div className="absolute -top-4 -left-4 w-24 h-24 bg-amber-100 rounded-full -z-10"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StorySection;
