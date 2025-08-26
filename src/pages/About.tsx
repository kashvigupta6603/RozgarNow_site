import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Zap, Users, Target, Award, Clock } from "lucide-react";

const About = () => {
  const features = [
    {
      icon: Zap,
      title: "Real-time Alerts",
      description: "Get instant notifications about new job openings that match your preferences"
    },
    {
      icon: Target,
      title: "Personalized Matching",
      description: "AI-powered job matching based on your qualifications and interests"
    },
    {
      icon: Shield,
      title: "Verified Information",
      description: "All job postings are verified from official government sources"
    },
    {
      icon: Award,
      title: "Exam Preparation",
      description: "Access comprehensive syllabus and exam patterns for all government jobs"
    },
    {
      icon: Users,
      title: "Community Support",
      description: "Join thousands of aspirants sharing tips and experiences"
    },
    {
      icon: Clock,
      title: "Never Miss Deadlines",
      description: "Smart reminders ensure you never miss important application deadlines"
    }
  ];

  const stats = [
    { number: "50,000+", label: "Active Users" },
    { number: "1,000+", label: "Job Listings Monthly" },
    { number: "95%", label: "Success Rate" },
    { number: "24/7", label: "Support Available" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <div className="bg-gradient-hero py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-6">
            About RozgarNow
          </h1>
          <p className="text-xl text-primary-foreground/90 max-w-3xl mx-auto">
            Empowering millions of job aspirants with the most comprehensive platform 
            for government job opportunities, exam preparation, and career guidance.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Mission Section */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-6">Our Mission</h2>
          <p className="text-lg text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            RozgarNow was founded with a simple yet powerful mission: to democratize access to government 
            job opportunities across India. We believe that every qualified candidate deserves equal access 
            to information about government positions, regardless of their location or background.
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">{stat.number}</div>
              <div className="text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Features Grid */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">
            Why Choose RozgarNow?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="shadow-card hover:shadow-elevated transition-all duration-300 border-border/50">
                  <CardContent className="p-6 text-center">
                    <div className="bg-gradient-primary p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                      <Icon className="h-8 w-8 text-primary-foreground" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-3">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Values Section */}
        <div className="bg-muted/30 rounded-2xl p-8 md:p-12 mb-16">
          <h2 className="text-3xl font-bold text-center text-foreground mb-8">Our Core Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-accent/10 p-4 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                <Shield className="h-10 w-10 text-accent" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Transparency</h3>
              <p className="text-muted-foreground">
                We provide accurate, verified information from official sources with complete transparency.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-primary/10 p-4 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                <Users className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Accessibility</h3>
              <p className="text-muted-foreground">
                Making government job information accessible to everyone, everywhere, at any time.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-gradient-primary/10 p-4 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                <Award className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Excellence</h3>
              <p className="text-muted-foreground">
                Committed to delivering the highest quality service and user experience.
              </p>
            </div>
          </div>
        </div>

        {/* Impact Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-foreground mb-6">Our Impact</h2>
          <div className="bg-gradient-card p-8 rounded-2xl shadow-card max-w-4xl mx-auto">
            <p className="text-lg text-muted-foreground mb-6">
              Since our launch, RozgarNow has helped thousands of candidates secure their dream government jobs. 
              Our platform has become the go-to destination for job seekers across India, providing them with 
              timely information, expert guidance, and the tools they need to succeed.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Badge className="bg-accent hover:bg-accent-hover text-lg px-4 py-2">Trusted by 50,000+ Users</Badge>
              <Badge className="bg-primary hover:bg-primary-hover text-lg px-4 py-2">99% Uptime</Badge>
              <Badge className="bg-gradient-primary text-lg px-4 py-2">Award Winning Platform</Badge>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default About;