import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Sparkles, Shield, Truck, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import hero1 from "@/assets/hero-1.jpg";
import hero2 from "@/assets/hero-2.jpg";
import hero3 from "@/assets/hero-3.jpg";

const slides = [
  {
    image: hero1,
    title: "Cultural Elegance, Crafted for You",
    subtitle: "Discover our unique collection of handmade African print products and accessories that celebrate African culture through premium craftsmanship",
    primaryButton: "Shop Now",
    primaryLink: "/shop",
    secondaryButton: "Learn More",
    secondaryLink: "/about",
  },
  {
    image: hero2,
    title: "Authentic African Fashion",
    subtitle: "Handcrafted clothing and accessories that blend traditional techniques with contemporary design",
    primaryButton: "Shop Clothing",
    primaryLink: "/shop?category=Clothing",
    secondaryButton: "View Collection",
    secondaryLink: "/shop",
  },
  {
    image: hero3,
    title: "Heritage & Style",
    subtitle: "Every piece tells a story and supports skilled artisans across Africa while preserving cultural craftsmanship",
    primaryButton: "Shop Now",
    primaryLink: "/shop",
    secondaryButton: "Our Story",
    secondaryLink: "/about",
  },
];

const HeroCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);

    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="relative h-screen max-h-[900px] overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          {/* Background Image */}
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${slide.image})` }}
          />
          
          {/* Warm Brown Gradient Overlay - Centered focus */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#3E2723]/80 via-[#4E342E]/70 to-[#3E2723]/80" />
          
          {/* Subtle Radial Highlight - Center glow */}
          <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-[#3E2723]/60" />
          
          {/* Content - Centered */}
          <div className="relative z-20 h-full flex items-center justify-center text-center">
            <div className="container mx-auto px-4 py-20">
              <div className="max-w-4xl mx-auto">
                {/* Brand Badge */}
                <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-full px-5 py-2.5 mb-8 border border-white/20">
                  <Sparkles className="h-4 w-4 text-amber-300" />
                  <span className="text-amber-100 text-sm font-medium tracking-wide">HANDCRAFTED WITH LOVE</span>
                </div>
                
                {/* Title */}
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight animate-fade-in">
                  {slide.title}
                </h1>
                
                {/* Subtitle */}
                <p className="text-base sm:text-lg md:text-xl text-amber-50/90 mb-10 max-w-2xl mx-auto leading-relaxed">
                  {slide.subtitle}
                </p>
                
                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
                  <Button 
                    className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-6 rounded-full text-base font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 min-w-[180px] cursor-pointer"
                    onClick={() => handleNavigation(slide.primaryLink)}
                  >
                    {slide.primaryButton}
                  </Button>
                  <Button 
                    variant="outline" 
                    className="bg-white/10 backdrop-blur-sm border-2 border-white/40 text-white hover:bg-white/20 hover:border-white/60 px-8 py-6 rounded-full text-base font-semibold transition-all duration-300 min-w-[180px] cursor-pointer"
                    onClick={() => handleNavigation(slide.secondaryLink)}
                  >
                    {slide.secondaryButton}
                  </Button>
                </div>

                {/* Trust Indicators */}
                <div className="flex flex-wrap justify-center gap-8 mt-16 pt-8">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-amber-600/20 flex items-center justify-center">
                      <Truck className="h-4 w-4 text-amber-300" />
                    </div>
                    <span className="text-amber-100 text-sm font-medium">Free Shipping</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-amber-600/20 flex items-center justify-center">
                      <Shield className="h-4 w-4 text-amber-300" />
                    </div>
                    <span className="text-amber-100 text-sm font-medium">Secure Payment</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-amber-600/20 flex items-center justify-center">
                      <Sparkles className="h-4 w-4 text-amber-300" />
                    </div>
                    <span className="text-amber-100 text-sm font-medium">Premium Quality</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-amber-600/20 flex items-center justify-center">
                      <Star className="h-4 w-4 text-amber-300" />
                    </div>
                    <span className="text-amber-100 text-sm font-medium">5-Star Reviews</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-30 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-amber-200 hover:text-white hover:bg-white/20 transition-all duration-300 flex items-center justify-center cursor-pointer"
        onClick={prevSlide}
      >
        <ChevronLeft className="h-5 w-5 md:h-6 md:w-6" />
      </button>
      <button
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-30 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-amber-200 hover:text-white hover:bg-white/20 transition-all duration-300 flex items-center justify-center cursor-pointer"
        onClick={nextSlide}
      >
        <ChevronRight className="h-5 w-5 md:h-6 md:w-6" />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30">
        <div className="flex gap-2 md:gap-3">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`transition-all duration-300 cursor-pointer ${
                index === currentSlide
                  ? "w-12 h-1.5 bg-amber-400"
                  : "w-2 h-1.5 bg-white/40 hover:bg-white/60"
              } rounded-full`}
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 translate-y-12 z-30 hidden md:block">
        <div className="flex flex-col items-center gap-2">
          <span className="text-white/60 text-xs tracking-wider uppercase">Scroll</span>
          <div className="w-5 h-8 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-2 bg-white/50 rounded-full mt-1.5 animate-scroll-bounce"></div>
          </div>
        </div>
      </div>

      {/* Add custom animation keyframes */}
      <style>{`
        @keyframes scroll-bounce {
          0%, 100% { transform: translateY(0); opacity: 0.5; }
          50% { transform: translateY(4px); opacity: 1; }
        }
        .animate-scroll-bounce {
          animation: scroll-bounce 1.5s ease-in-out infinite;
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
        .bg-radial-gradient {
          background: radial-gradient(ellipse at center, transparent 0%, #3E2723 100%);
        }
      `}</style>
    </section>
  );
};

export default HeroCarousel;