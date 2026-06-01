import { ArrowRight, Leaf, Recycle, Shield, HandHeart, Users, Heart, Award, Sparkles, Gem, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

// Import all images
import ourStoryImg from "@/assets/11.jpg";
import sustainabilityImg from "@/assets/12.jpg";
import artisanImg from "@/assets/13.jpg";

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-amber-50/30">
      {/* Hero Section - Brown Theme */}
      <section className="relative bg-gradient-to-r from-[#3E2723] via-[#4E342E] to-[#3E2723] py-20 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920')] bg-cover bg-center opacity-10"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-1.5 mb-6">
            <Sparkles className="h-4 w-4 text-amber-300" />
            <span className="text-amber-100 text-sm font-medium">OUR STORY</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 animate-fade-in">
            About Momore Limited
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-amber-400 to-amber-500 mx-auto mb-6 rounded-full"></div>
          <p className="text-xl text-amber-100/90 max-w-3xl mx-auto animate-slide-up">
            Learn about our mission, values, and the artisans behind our products
          </p>
        </div>
      </section>

      {/* Our Story Section - Brown Theme */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in">
              <div className="inline-flex items-center gap-2 bg-amber-100 rounded-full px-3 py-1 mb-4">
                <Gem className="h-3 w-3 text-amber-600" />
                <span className="text-amber-700 text-xs font-medium">OUR HERITAGE</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-[#3E2723] mb-6">
                Our Story
              </h2>
              <div className="w-16 h-1 bg-gradient-to-r from-amber-500 to-amber-600 rounded-full mb-6"></div>
              <div className="space-y-5 text-lg text-[#5D4037]/80 leading-relaxed">
                <p>
                  Momore Limited was founded in 2018 with a passion for celebrating African heritage through 
                  beautifully crafted products. Our name "Momore" comes from the Yoruba word meaning 
                  "a child to be cherished," reflecting our commitment to nurturing African craftsmanship.
                </p>
                <p>
                  We work directly with skilled artisans across Rwanda, Nigeria, Ghana, and Kenya to create 
                  unique, high-quality items that blend traditional techniques with contemporary design. 
                  Each product tells a story of cultural heritage and artistic excellence.
                </p>
                <p>
                  Our commitment to ethical production means that every purchase supports sustainable 
                  livelihoods and preserves cultural craftsmanship for future generations. We ensure 
                  fair wages, safe working conditions, and environmental sustainability in all our operations.
                </p>
              </div>
            </div>
            <div className="animate-fade-in order-first lg:order-last">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 to-amber-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-500"></div>
                <img 
                  src={ourStoryImg} 
                  alt="African artisans at work" 
                  className="relative w-full h-96 object-cover rounded-2xl shadow-xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section - New */}
      <section className="py-16 bg-gradient-to-b from-amber-50/50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-amber-100 rounded-full px-4 py-1.5 mb-4">
              <Award className="h-4 w-4 text-amber-600" />
              <span className="text-amber-700 text-sm font-medium">OUR VALUES</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-[#3E2723] mb-4">
              What We Stand For
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-amber-500 to-amber-600 mx-auto rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-0 shadow-lg bg-white rounded-2xl hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-8 w-8 text-amber-600" />
                </div>
                <h3 className="text-xl font-bold text-[#3E2723] mb-2">Authenticity</h3>
                <p className="text-[#5D4037]/70">Genuine African craftsmanship, preserving traditional techniques and cultural heritage.</p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg bg-white rounded-2xl hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-amber-600" />
                </div>
                <h3 className="text-xl font-bold text-[#3E2723] mb-2">Community</h3>
                <p className="text-[#5D4037]/70">Supporting local artisans and investing in community development.</p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg bg-white rounded-2xl hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
                  <Leaf className="h-8 w-8 text-amber-600" />
                </div>
                <h3 className="text-xl font-bold text-[#3E2723] mb-2">Sustainability</h3>
                <p className="text-[#5D4037]/70">Eco-friendly materials and ethical production practices.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Sustainability & Ethics Section - Brown Theme */}
      <section className="py-20 bg-gradient-to-b from-white to-amber-50/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 to-amber-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-500"></div>
                <img 
                  src={sustainabilityImg} 
                  alt="Sustainable crafting practices" 
                  className="relative w-full h-96 object-cover rounded-2xl shadow-xl"
                />
              </div>
            </div>
            <div className="animate-fade-in">
              <div className="inline-flex items-center gap-2 bg-amber-100 rounded-full px-3 py-1 mb-4">
                <Leaf className="h-3 w-3 text-amber-600" />
                <span className="text-amber-700 text-xs font-medium">SUSTAINABILITY</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-[#3E2723] mb-6">
                Sustainability & Ethics
              </h2>
              <div className="w-16 h-1 bg-gradient-to-r from-amber-500 to-amber-600 rounded-full mb-6"></div>
              <p className="text-lg text-[#5D4037]/80 leading-relaxed mb-6">
                At Momore, we believe in fashion that respects both people and the planet. 
                Our sustainability initiatives include:
              </p>
              <div className="space-y-4">
                <div className="flex items-start space-x-3 group">
                  <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0 group-hover:bg-amber-200 transition-colors">
                    <Leaf className="h-4 w-4 text-amber-600" />
                  </div>
                  <p className="text-[#5D4037]/80">Using organic, natural, and upcycled materials whenever possible</p>
                </div>
                <div className="flex items-start space-x-3 group">
                  <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0 group-hover:bg-amber-200 transition-colors">
                    <Recycle className="h-4 w-4 text-amber-600" />
                  </div>
                  <p className="text-[#5D4037]/80">Implementing zero-waste production techniques</p>
                </div>
                <div className="flex items-start space-x-3 group">
                  <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0 group-hover:bg-amber-200 transition-colors">
                    <Heart className="h-4 w-4 text-amber-600" />
                  </div>
                  <p className="text-[#5D4037]/80">Supporting traditional crafting methods that have low environmental impact</p>
                </div>
                <div className="flex items-start space-x-3 group">
                  <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0 group-hover:bg-amber-200 transition-colors">
                    <Shield className="h-4 w-4 text-amber-600" />
                  </div>
                  <p className="text-[#5D4037]/80">Ensuring fair wages and safe working conditions for all artisans</p>
                </div>
                <div className="flex items-start space-x-3 group">
                  <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0 group-hover:bg-amber-200 transition-colors">
                    <HandHeart className="h-4 w-4 text-amber-600" />
                  </div>
                  <p className="text-[#5D4037]/80">Investing in community development projects in our artisans' communities</p>
                </div>
              </div>
              <p className="text-lg text-[#5D4037]/80 leading-relaxed mt-6 pt-4 border-t border-amber-100">
                We're committed to transparency in our supply chain and continuously work to reduce 
                our environmental footprint while maximizing our positive social impact.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Meet Our Artisans Section - Brown Theme */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in">
              <div className="inline-flex items-center gap-2 bg-amber-100 rounded-full px-3 py-1 mb-4">
                <Users className="h-3 w-3 text-amber-600" />
                <span className="text-amber-700 text-xs font-medium">OUR PEOPLE</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-[#3E2723] mb-6">
                Meet Our Artisans
              </h2>
              <div className="w-16 h-1 bg-gradient-to-r from-amber-500 to-amber-600 rounded-full mb-6"></div>
              <div className="space-y-5 text-lg text-[#5D4037]/80 leading-relaxed">
                <p>
                  The heart of Momore is our community of talented artisans. We partner with over 
                  200 craftspeople across Africa, each bringing their unique skills and cultural 
                  heritage to our products.
                </p>
                <p>
                  From beadwork experts in Kenya to weaving masters in Ghana, from print designers 
                  in Nigeria to wood carvers in Rwanda, our network represents the rich diversity 
                  of African craftsmanship.
                </p>
                <p>
                  We provide our artisans with design support, business training, and access to 
                  global markets, helping to preserve traditional crafts while creating economic 
                  opportunities in their communities.
                </p>
              </div>
            </div>
            <div className="animate-fade-in order-first lg:order-last">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 to-amber-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-500"></div>
                <img 
                  src={artisanImg} 
                  alt="African artisans crafting products" 
                  className="relative w-full h-96 object-cover rounded-2xl shadow-xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Get in Touch Section - Brown Theme */}
      <section className="relative bg-gradient-to-r from-[#3E2723] via-[#4E342E] to-[#3E2723] py-20 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920')] bg-cover bg-center opacity-5"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-3xl mx-auto animate-fade-in">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-1.5 mb-6">
              <Sparkles className="h-4 w-4 text-amber-300" />
              <span className="text-amber-100 text-sm font-medium">CONNECT WITH US</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Get in Touch
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-amber-400 to-amber-500 mx-auto mb-6 rounded-full"></div>
            <p className="text-xl text-amber-100/90 mb-8 leading-relaxed">
              "Cultural Elegance, Crafted for You." Celebrating African heritage through beautifully handmade products.
            </p>
            <div className="space-y-3 text-amber-200/80 mb-8">
              <p className="flex items-center justify-center gap-2">
                <span>✨ Free shipping on orders over $50</span>
              </p>
              <p>📧 info@momore.com | 📞 +250 788 123 456</p>
              <p>📍 Kigali, Rwanda</p>
            </div>
            <Button className="bg-white text-[#3E2723] hover:bg-amber-50 shadow-lg hover:shadow-xl transition-all duration-300 rounded-full px-8 py-6">
              Explore Collection
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
