import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Star, Sparkles, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const testimonials = [
  {
    id: 1,
    name: "Sarah J.",
    location: "New York, USA",
    text: "The quality of Momore's products is exceptional. I love that each piece tells a story and supports African artisans.",
    rating: 5,
  },
  {
    id: 2,
    name: "David K.",
    location: "London, UK",
    text: "As someone from the diaspora, wearing Momore's designs makes me feel connected to my roots. Beautiful craftsmanship!",
    rating: 5,
  },
  {
    id: 3,
    name: "Marie L.",
    location: "Paris, France",
    text: "I bought several items during my visit to Rwanda. These make perfect gifts and souvenirs with authentic cultural significance.",
    rating: 5,
  },
];

const Testimonials = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="py-20 bg-gradient-to-b from-amber-50/20 via-white to-amber-50/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center gap-2 bg-amber-100 rounded-full px-4 py-1.5 mb-4">
            <Sparkles className="h-4 w-4 text-amber-600" />
            <span className="text-amber-700 text-sm font-medium">TESTIMONIALS</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-[#3E2723] mb-6">
            What Our Customers Say
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-amber-500 to-amber-600 mx-auto mb-6 rounded-full"></div>
          <p className="text-xl text-[#5D4037]/70 max-w-2xl mx-auto">
            Hear from our community about their experience with our authentic African craftsmanship
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          <div className="overflow-hidden">
            {testimonials.map((testimonial, index) => (
              <Card
                key={testimonial.id}
                className={`transition-all duration-500 ${
                  index === currentTestimonial
                    ? "opacity-100 transform translate-x-0"
                    : "opacity-0 transform translate-x-full absolute top-0 left-0 w-full"
                } bg-white border-0 shadow-2xl rounded-2xl`}
              >
                <CardContent className="p-8 md:p-12 text-center">
                  {/* Quote Icon */}
                  <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center">
                      <Quote className="h-8 w-8 text-amber-600" />
                    </div>
                  </div>
                  
                  {/* Rating Stars */}
                  <div className="flex justify-center gap-1 mb-6">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-6 w-6 text-amber-500 fill-amber-500"
                      />
                    ))}
                  </div>
                  
                  {/* Testimonial Text */}
                  <blockquote className="text-xl md:text-2xl text-[#3E2723] mb-8 leading-relaxed font-medium">
                    "{testimonial.text}"
                  </blockquote>
                  
                  {/* Customer Info */}
                  <div className="flex flex-col items-center space-y-2">
                    <p className="font-bold text-amber-600 text-lg">{testimonial.name}</p>
                    <p className="text-[#5D4037]/60 text-sm">{testimonial.location}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Navigation Arrows - Brown Themed */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-8 text-amber-600 hover:text-amber-700 hover:bg-amber-100 rounded-full w-10 h-10 shadow-md bg-white"
            onClick={prevTestimonial}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-8 text-amber-600 hover:text-amber-700 hover:bg-amber-100 rounded-full w-10 h-10 shadow-md bg-white"
            onClick={nextTestimonial}
          >
            <ChevronRight className="h-5 w-5" />
          </Button>

          {/* Dots Indicator - Brown Themed */}
          <div className="flex justify-center gap-3 mt-10">
            {testimonials.map((_, index) => (
              <button
                key={index}
                className={`transition-all duration-300 rounded-full ${
                  index === currentTestimonial
                    ? "w-10 h-2 bg-amber-600"
                    : "w-2 h-2 bg-amber-300 hover:bg-amber-400"
                }`}
                onClick={() => setCurrentTestimonial(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
