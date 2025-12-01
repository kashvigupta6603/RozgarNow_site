import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Bell, Search, Target, Clock, CheckCircle, Star } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-government-jobs.jpg";

const Index = () => {
  const features = [
    {
      icon: Bell,
      title: "Real-time Alerts",
      description: "Get instant notifications about new government job openings matching your profile"
    },
    {
      icon: Target,
      title: "Personalized Matching",
      description: "AI-powered job recommendations based on your qualifications and preferences"
    },
    {
      icon: Search,
      title: "Comprehensive Database",
      description: "Access to thousands of government job listings from verified official sources"
    },
    {
      icon: Clock,
      title: "Deadline Reminders",
      description: "Never miss application deadlines with smart notification system"
    }
  ];

  const categories = [
    { name: "Banking & Finance", count: "500+", color: "bg-primary" },
    { name: "Railway Jobs", count: "300+", color: "bg-accent" },
    { name: "Teaching Jobs", count: "200+", color: "bg-primary" },
    { name: "Defense Jobs", count: "150+", color: "bg-accent" },
    { name: "Civil Services", count: "100+", color: "bg-primary" },
    { name: "Police Jobs", count: "250+", color: "bg-accent" }
  ];

  const testimonials = [
    {
      name: "Priya Sharma",
      role: "SBI PO",
      content: "RozgarNow helped me track my dream banking job. The alerts were timely and accurate!",
      rating: 5
    },
    {
      name: "Rajesh Kumar", 
      role: "Railway Officer",
      content: "The deadline reminders saved me from missing my application. Highly recommended!",
      rating: 5
    },
    {
      name: "Anita Singh",
      role: "Teaching Professional",
      content: "Best platform for government jobs. Easy to use and completely reliable.",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="relative bg-gradient-hero py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 text-center lg:text-left">
                Your Gateway to <span className="text-government">Government Jobs</span>
              </h1>
              <p className="text-xl text-primary-foreground/90 mb-8 leading-relaxed">
                One-stop platform for Government Job Alerts & Syllabus Tracking. 
                Get personalized notifications and never miss your dream opportunity.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link to="/jobs">
                  <Button className="bg-accent hover:bg-accent-hover text-accent-foreground px-8 py-6 text-lg font-semibold">
                    Browse Jobs
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/alerts">
                  <Button variant="outline" className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/20 px-8 py-6 text-lg">
                    Setup Alerts
                  </Button>
                </Link>
              </div>
            </div>

            <div className="relative">
              <img
                src={heroImage}
                alt="Government Jobs Platform"
                className="rounded-2xl shadow-elevated w-full h-auto"
              />
              <div className="absolute -top-4 -right-4 bg-accent text-accent-foreground px-4 py-2 rounded-full text-sm font-semibold shadow-card">
                50,000+ Jobs Listed
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Why Choose RozgarNow?
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Discover the features that make RozgarNow the most trusted platform for government job seekers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="shadow-card hover:shadow-elevated transition-all duration-300 hover:-translate-y-1 border-border/50">
                  <CardContent className="p-6 text-center">
                    <div className="bg-gradient-primary p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                      <Icon className="h-8 w-8 text-primary-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-3">{feature.title}</h3>
                    <p className="text-muted-foreground text-sm">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Job Categories */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Popular Job Categories
            </h2>
            <p className="text-lg text-muted-foreground">
              Explore opportunities across various government sectors
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category, index) => (
              <Link key={index} to={`/jobs?category=${category.name.toLowerCase()}`}>
                <Card className="shadow-card hover:shadow-elevated transition-all duration-300 hover:-translate-y-1 cursor-pointer border-border/50">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-foreground mb-2">{category.name}</h3>
                        <p className="text-muted-foreground text-sm">Available positions</p>
                      </div>
                      <Badge className={`${category.color} text-primary-foreground text-lg px-3 py-1`}>
                        {category.count}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/jobs">
              <Button className="bg-gradient-primary hover:bg-primary-hover px-8 py-6 text-lg">
                View All Categories
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-primary py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-6">
            Ready to Find Your Dream Government Job?
          </h2>
          <p className="text-xl text-primary-foreground/90 mb-8 max-w-3xl mx-auto">
            Join thousands of successful candidates who trust RozgarNow for their career journey. 
            Get started today and never miss another opportunity.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/profile">
              <Button className="bg-accent hover:bg-accent-hover text-accent-foreground px-8 py-6 text-lg font-semibold">
                Create Profile
                <CheckCircle className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/jobs">
              <Button variant="outline" className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/20 px-8 py-6 text-lg">
                Explore Jobs
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
