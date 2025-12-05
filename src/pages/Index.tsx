import { Link } from "react-router-dom";
import { Shield, Mic, MapPin, Users, Bell, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import FeatureCard from "@/components/FeatureCard";

const Index = () => {
  const features = [
    {
      icon: Mic,
      title: "Voice Detection",
      description: "Advanced AI continuously listens for your chosen emergency keywords, even in noisy environments.",
    },
    {
      icon: MapPin,
      title: "Location Sharing",
      description: "Automatically shares your real-time GPS location with trusted contacts during emergencies.",
    },
    {
      icon: Users,
      title: "Trusted Network",
      description: "Add family and friends who will receive instant alerts when you need help.",
    },
    {
      icon: Bell,
      title: "Instant Alerts",
      description: "SMS and call alerts are triggered immediately when danger is detected.",
    },
    {
      icon: Zap,
      title: "Hands-Free",
      description: "No need to unlock your phone or press any buttons. Just speak your safe word.",
    },
    {
      icon: Shield,
      title: "Always Protected",
      description: "Runs silently in the background, ready to act when you need it most.",
    },
  ];

  return (
    <div className="min-h-screen">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden py-20 lg:py-32">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-primary/10 blur-3xl" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-accent/10 blur-3xl" />
          </div>
          
          <div className="container relative">
            <div className="max-w-3xl mx-auto text-center space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm font-medium text-primary opacity-0 animate-fade-in">
                <Shield className="w-4 h-4" />
                AI-Powered Safety
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight opacity-0 animate-fade-in" style={{ animationDelay: '100ms' }}>
                Your Voice is Your{" "}
                <span className="text-gradient-hero">Shield</span>
              </h1>
              
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed opacity-0 animate-fade-in" style={{ animationDelay: '200ms' }}>
                Aurora listens for your emergency keyword and instantly alerts your trusted contacts with your location. 
                Hands-free protection that works when you can't reach your phone.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center opacity-0 animate-fade-in" style={{ animationDelay: '300ms' }}>
                <Button variant="hero" size="xl" asChild>
                  <Link to="/dashboard">
                    Get Protected Now
                  </Link>
                </Button>
                <Button variant="outline" size="xl" asChild>
                  <Link to="/dashboard">
                    Learn More
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-secondary/30">
          <div className="container">
            <div className="text-center mb-16 space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground opacity-0 animate-fade-in">
                How Aurora Protects You
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto opacity-0 animate-fade-in" style={{ animationDelay: '100ms' }}>
                Simple, reliable, and always ready to help when you need it most.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <FeatureCard
                  key={feature.title}
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                  delay={200 + index * 100}
                />
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="container">
            <div className="max-w-4xl mx-auto text-center p-12 rounded-3xl gradient-hero shadow-glow-primary opacity-0 animate-fade-in" style={{ animationDelay: '200ms' }}>
              <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
                Start Your Protection Today
              </h2>
              <p className="text-primary-foreground/90 mb-8 max-w-xl mx-auto">
                Set up Aurora in under 2 minutes. Add your emergency contacts and choose your safe word.
              </p>
              <Button variant="secondary" size="xl" asChild className="bg-card text-foreground hover:bg-card/90">
                <Link to="/dashboard">
                  Open Dashboard
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg gradient-hero flex items-center justify-center">
                <Shield className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-semibold text-foreground">Aurora</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Empowering safety through voice technology
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
