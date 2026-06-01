import { useState } from "react";
import { Mail, Phone, MapPin, Clock, Send, Sparkles, ArrowRight, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { contactAPI } from "@/lib/api";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await contactAPI.send(formData);
      toast({
        title: "Message Sent!",
        description: "Thank you for contacting us. We'll get back to you soon.",
      });
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    {
      icon: Mail,
      title: "Email Us",
      info: "info@momore.com",
      description: "Send us an email anytime",
      color: "from-amber-500 to-amber-600",
    },
    {
      icon: Phone,
      title: "Call Us",
      info: "+250 788 123 456",
      description: "Mon-Fri from 8am to 5pm",
      color: "from-amber-600 to-amber-700",
    },
    {
      icon: MapPin,
      title: "Visit Us",
      info: "Kigali, Rwanda",
      description: "Come say hello at our office",
      color: "from-amber-500 to-amber-600",
    },
    {
      icon: Clock,
      title: "Business Hours",
      info: "Mon-Fri: 8am-5pm",
      description: "Weekend: 10am-2pm",
      color: "from-amber-600 to-amber-700",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-amber-50/30">
      {/* Hero Section - Brown Theme */}
      <section className="relative bg-gradient-to-r from-[#3E2723] via-[#4E342E] to-[#3E2723] py-20 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920')] bg-cover bg-center opacity-10"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-1.5 mb-6">
            <Sparkles className="h-4 w-4 text-amber-300" />
            <span className="text-amber-100 text-sm font-medium">GET IN TOUCH</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 animate-fade-in">
            Contact Us
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-amber-400 to-amber-500 mx-auto mb-6 rounded-full"></div>
          <p className="text-xl text-amber-100/90 max-w-3xl mx-auto animate-slide-up">
            We'd love to hear from you. Get in touch and let's start a conversation.
          </p>
        </div>
      </section>

      {/* Contact Information Cards */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {contactInfo.map((item, index) => (
              <Card
                key={item.title}
                className="group border-0 shadow-lg hover:shadow-2xl transition-all duration-500 rounded-2xl hover:-translate-y-2 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-8 text-center">
                  <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${item.color} flex items-center justify-center mx-auto mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <item.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-[#3E2723] mb-2">{item.title}</h3>
                  <p className="text-lg font-semibold text-amber-600 mb-1">{item.info}</p>
                  <p className="text-sm text-[#5D4037]/70">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Map Section */}
      <section className="py-20 bg-gradient-to-b from-amber-50/50 to-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact Form - Left Side */}
            <div className="animate-fade-in">
              <div className="inline-flex items-center gap-2 bg-amber-100 rounded-full px-3 py-1 mb-4">
                <MessageCircle className="h-3 w-3 text-amber-600" />
                <span className="text-amber-700 text-xs font-medium">SEND A MESSAGE</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-[#3E2723] mb-4">
                Send us a Message
              </h2>
              <div className="w-16 h-1 bg-gradient-to-r from-amber-500 to-amber-600 rounded-full mb-6"></div>
              <p className="text-[#5D4037]/70 mb-8">
                Fill out the form below and we'll get back to you as soon as possible.
              </p>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-[#3E2723] mb-2">
                      Full Name
                    </label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full border-amber-200 focus:border-amber-500 focus:ring-amber-500 bg-white rounded-lg h-11"
                      placeholder="Your full name"
                      disabled={loading}
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-[#3E2723] mb-2">
                      Email Address
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full border-amber-200 focus:border-amber-500 focus:ring-amber-500 bg-white rounded-lg h-11"
                      placeholder="your.email@example.com"
                      disabled={loading}
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-[#3E2723] mb-2">
                    Subject
                  </label>
                  <Input
                    id="subject"
                    name="subject"
                    type="text"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className="w-full border-amber-200 focus:border-amber-500 focus:ring-amber-500 bg-white rounded-lg h-11"
                    placeholder="What is this about?"
                    disabled={loading}
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-[#3E2723] mb-2">
                    Message
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    className="w-full border-amber-200 focus:border-amber-500 focus:ring-amber-500 bg-white rounded-lg"
                    placeholder="Tell us more about how we can help you..."
                    disabled={loading}
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white shadow-md hover:shadow-xl transition-all duration-300 rounded-lg h-12"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Sending...
                    </div>
                  ) : (
                    <>
                      Send Message
                      <Send className="h-4 w-4 ml-2" />
                    </>
                  )}
                </Button>
              </form>
            </div>

            {/* Store Information - Right Side */}
            <div className="animate-slide-up">
              <div className="inline-flex items-center gap-2 bg-amber-100 rounded-full px-3 py-1 mb-4">
                <MapPin className="h-3 w-3 text-amber-600" />
                <span className="text-amber-700 text-xs font-medium">VISIT US</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-[#3E2723] mb-4">
                Visit Our Store
              </h2>
              <div className="w-16 h-1 bg-gradient-to-r from-amber-500 to-amber-600 rounded-full mb-6"></div>
              <p className="text-[#5D4037]/70 mb-8">
                Located in the heart of Kigali, our store offers a curated selection of our premium products.
              </p>
              
              <div className="space-y-6 bg-white rounded-2xl p-6 shadow-lg border border-amber-100">
                <div className="flex items-start space-x-4 group">
                  <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0 group-hover:bg-amber-200 transition-colors">
                    <MapPin className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#3E2723] text-lg">Address</h4>
                    <p className="text-[#5D4037]/70">Kigali, Rwanda</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4 group">
                  <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0 group-hover:bg-amber-200 transition-colors">
                    <Clock className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#3E2723] text-lg">Store Hours</h4>
                    <p className="text-[#5D4037]/70">
                      Monday - Friday: 8:00 AM - 5:00 PM<br />
                      Saturday - Sunday: 10:00 AM - 2:00 PM
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 group">
                  <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0 group-hover:bg-amber-200 transition-colors">
                    <Mail className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#3E2723] text-lg">Email</h4>
                    <p className="text-[#5D4037]/70">info@momore.com</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 group">
                  <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0 group-hover:bg-amber-200 transition-colors">
                    <Phone className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#3E2723] text-lg">Phone</h4>
                    <p className="text-[#5D4037]/70">+250 788 123 456</p>
                  </div>
                </div>
              </div>

              {/* Map Placeholder */}
              <div className="mt-6 bg-gradient-to-r from-amber-100 to-amber-50 rounded-2xl p-6 text-center border border-amber-200">
                <p className="text-[#5D4037]/70 text-sm">📍 View on Google Maps</p>
                <p className="text-xs text-amber-600 mt-1">Coming soon: Interactive map</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-amber-100 rounded-full px-4 py-1.5 mb-4">
              <Sparkles className="h-4 w-4 text-amber-600" />
              <span className="text-amber-700 text-sm font-medium">FAQ</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-[#3E2723]">
              Frequently Asked Questions
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-amber-500 to-amber-600 mx-auto mt-4 rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <Card className="border-0 shadow-md bg-white rounded-xl">
              <CardContent className="p-5">
                <h3 className="font-semibold text-[#3E2723] mb-2">How long does shipping take?</h3>
                <p className="text-sm text-[#5D4037]/70">Standard shipping takes 5-7 business days. Express shipping available for 2-3 days.</p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-md bg-white rounded-xl">
              <CardContent className="p-5">
                <h3 className="font-semibold text-[#3E2723] mb-2">What is your return policy?</h3>
                <p className="text-sm text-[#5D4037]/70">We offer 30-day returns for unused items in original packaging.</p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-md bg-white rounded-xl">
              <CardContent className="p-5">
                <h3 className="font-semibold text-[#3E2723] mb-2">Do you ship internationally?</h3>
                <p className="text-sm text-[#5D4037]/70">Yes, we ship worldwide with tracking information provided.</p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-md bg-white rounded-xl">
              <CardContent className="p-5">
                <h3 className="font-semibold text-[#3E2723] mb-2">Are your products ethically sourced?</h3>
                <p className="text-sm text-[#5D4037]/70">Yes, all our products are ethically sourced from local artisans.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
