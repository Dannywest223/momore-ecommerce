import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Sparkles, Gem, Crown, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Import your local images
import clothingImg from "@/assets/99.jpg";
import homewareImg from "@/assets/98.jpg";

const categories = [
  {
    name: "Clothing",
    image: clothingImg,
    description: "Authentic African print dresses, shirts, and traditional wear",
    categoryParam: "Clothing",
    icon: Gem,
  },
  {
    name: "Bags & Accessories",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    description: "Handcrafted bags, jewelry, and accessories with cultural flair",
    categoryParam: "Bags & Accessories",
    icon: Crown,
  },
  {
    name: "Homeware",
    image: homewareImg,
    description: "Beautiful home decor and functional items for modern living",
    categoryParam: "Homeware",
    icon: Star,
  },
  {
    name: "Art & Decor",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    description: "Hand-painted artwork and cultural pieces for your space",
    categoryParam: "Art & Decor",
    icon: Sparkles,
  },
];

const CategorySection = () => {
  const navigate = useNavigate();

  const handleExploreClick = (categoryName: string) => {
    navigate(`/shop?category=${encodeURIComponent(categoryName)}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getImageUrl = (imagePath: string) => {
    if (!imagePath) return "https://via.placeholder.com/400x300?text=No+Image";
    if (imagePath.startsWith('http')) return imagePath;
    return imagePath;
  };

  return (
    <section className="py-20 bg-gradient-to-b from-white to-amber-50/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center gap-2 bg-amber-100 rounded-full px-5 py-2 mb-5 shadow-sm">
            <Sparkles className="h-4 w-4 text-amber-600" />
            <span className="text-amber-700 text-sm font-medium tracking-wide">DISCOVER OUR COLLECTION</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-[#3E2723] mb-4">
            Shop By Category
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-amber-500 to-amber-600 mx-auto mb-6 rounded-full"></div>
          <p className="text-lg md:text-xl text-[#5D4037]/70 max-w-2xl mx-auto">
            Explore our diverse collection of authentic African craftsmanship
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {categories.map((category, index) => {
            const IconComponent = category.icon;
            return (
              <Card
                key={category.name}
                className="group bg-white border-0 shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden rounded-2xl hover:-translate-y-2 cursor-pointer"
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => handleExploreClick(category.categoryParam)}
              >
                {/* Image Container - Fixed to show full image */}
                <div className="relative overflow-hidden bg-amber-50">
                  {/* Changed from h-64 md:h-72 to use aspect ratio */}
                  <div className="aspect-square w-full">
                    <img
                      src={getImageUrl(category.image)}
                      alt={category.name}
                      className="w-full h-full object-contain bg-gradient-to-br from-amber-50 to-white p-4 transition-transform duration-700 group-hover:scale-105"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://via.placeholder.com/400x400?text=" + category.name;
                      }}
                    />
                  </div>
                  
                  {/* Gradient Overlay - Only at bottom */}
                  <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#3E2723]/80 via-[#3E2723]/40 to-transparent" />
                  
                  {/* Category Name Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6">
                    <div className="flex items-center gap-2 mb-2">
                      <IconComponent className="h-5 w-5 text-amber-300" />
                      <h3 className="text-2xl md:text-3xl font-bold text-white">{category.name}</h3>
                    </div>
                    <div className="w-12 h-0.5 bg-amber-400 rounded-full group-hover:w-20 transition-all duration-300"></div>
                  </div>
                </div>
                
                {/* Card Content */}
                <CardContent className="p-5 md:p-6">
                  <p className="text-[#5D4037]/80 mb-5 leading-relaxed text-sm md:text-base">
                    {category.description}
                  </p>
                  <Button 
                    className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white rounded-full py-5 shadow-md hover:shadow-lg transition-all duration-300 group/btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleExploreClick(category.categoryParam);
                    }}
                  >
                    <span>Explore {category.name}</span>
                    <ArrowRight className="h-4 w-4 ml-2 group-hover/btn:translate-x-1 transition-transform duration-300" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* View All Categories Link */}
        <div className="text-center mt-12">
          <button
            onClick={() => navigate('/shop')}
            className="inline-flex items-center gap-2 text-amber-600 hover:text-amber-700 font-medium transition-colors duration-300 group"
          >
            <span>View All Categories</span>
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
        }
      `}</style>
    </section>
  );
};

export default CategorySection;