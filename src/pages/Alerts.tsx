import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Bell, Mail, Smartphone, Settings, CheckCircle } from "lucide-react";
import { useState } from "react";

const Alerts = () => {
  const [email, setEmail] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedQualifications, setSelectedQualifications] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);

  const categories = [
    "Banking & Finance",
    "Railway Jobs",
    "Defense & Military",
    "Teaching Jobs",
    "Civil Services",
    "Police & Security",
    "Healthcare",
    "Engineering",
    "Clerk & Stenographer",
    "Other Government Jobs"
  ];

  const qualifications = [
    "10th Pass",
    "12th Pass", 
    "Graduate",
    "Post Graduate",
    "Diploma",
    "Engineering",
    "Medical",
    "Law"
  ];

  const locations = [
    "All India",
    "Delhi",
    "Mumbai", 
    "Bangalore",
    "Chennai",
    "Kolkata",
    "Hyderabad",
    "Pune",
    "Other Cities"
  ];

  const features = [
    {
      icon: Mail,
      title: "Email Alerts",
      description: "Get detailed job notifications directly in your inbox"
    },
    {
      icon: Smartphone,
      title: "Push Notifications",
      description: "Instant mobile notifications for urgent job openings"
    },
    {
      icon: Bell,
      title: "Deadline Reminders",
      description: "Never miss application deadlines with smart reminders"
    },
    {
      icon: Settings,
      title: "Custom Preferences",
      description: "Personalize alerts based on your qualifications and interests"
    }
  ];

  const handleCategoryChange = (category: string, checked: boolean) => {
    if (checked) {
      setSelectedCategories([...selectedCategories, category]);
    } else {
      setSelectedCategories(selectedCategories.filter(c => c !== category));
    }
  };

  const handleQualificationChange = (qualification: string, checked: boolean) => {
    if (checked) {
      setSelectedQualifications([...selectedQualifications, qualification]);
    } else {
      setSelectedQualifications(selectedQualifications.filter(q => q !== qualification));
    }
  };

  const handleLocationChange = (location: string, checked: boolean) => {
    if (checked) {
      setSelectedLocations([...selectedLocations, location]);
    } else {
      setSelectedLocations(selectedLocations.filter(l => l !== location));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    const res = await fetch("http://localhost:4000/api/alerts/subscribe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        categories: selectedCategories,
        qualifications: selectedQualifications,
        locations: selectedLocations,
      }),
    });

    const data = await res.json();

    if (data.success) {
      alert("🎉 Alerts activated! Check your email.");
    } else {
      alert("Failed: " + data.message);
    }
  } catch (err) {
    alert("Request failed");
  }
};


  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <div className="bg-gradient-hero py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-6">
            Job Alert Subscription
          </h1>
          <p className="text-xl text-primary-foreground/90 max-w-3xl mx-auto">
            Stay ahead of the competition with personalized job alerts. Never miss an opportunity again.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Features Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">
            How Our Alert System Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="shadow-card hover:shadow-elevated transition-all duration-300 text-center">
                  <CardContent className="p-6">
                    <div className="bg-gradient-primary p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Subscription Form */}
          <div className="lg:col-span-2">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-2xl text-foreground flex items-center">
                  <Bell className="h-6 w-6 mr-3 text-primary" />
                  Subscribe to Job Alerts
                </CardTitle>
                <p className="text-muted-foreground">
                  Customize your preferences to receive relevant job notifications
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  
                  {/* Email Input */}
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Email Address
                    </label>
                    <Input
                      type="email"
                      placeholder="Enter your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full"
                    />
                  </div>

                  {/* Job Categories */}
                  <div>
                    <label className="text-sm font-medium text-foreground mb-3 block">
                      Job Categories
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {categories.map((category) => (
                        <div key={category} className="flex items-center space-x-2">
                          <Checkbox
                            id={`category-${category}`}
                            checked={selectedCategories.includes(category)}
                            onCheckedChange={(checked) => handleCategoryChange(category, checked as boolean)}
                          />
                          <label
                            htmlFor={`category-${category}`}
                            className="text-sm text-foreground cursor-pointer"
                          >
                            {category}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Qualifications */}
                  <div>
                    <label className="text-sm font-medium text-foreground mb-3 block">
                      Qualifications
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {qualifications.map((qualification) => (
                        <div key={qualification} className="flex items-center space-x-2">
                          <Checkbox
                            id={`qualification-${qualification}`}
                            checked={selectedQualifications.includes(qualification)}
                            onCheckedChange={(checked) => handleQualificationChange(qualification, checked as boolean)}
                          />
                          <label
                            htmlFor={`qualification-${qualification}`}
                            className="text-sm text-foreground cursor-pointer"
                          >
                            {qualification}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Locations */}
                  <div>
                    <label className="text-sm font-medium text-foreground mb-3 block">
                      Preferred Locations
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {locations.map((location) => (
                        <div key={location} className="flex items-center space-x-2">
                          <Checkbox
                            id={`location-${location}`}
                            checked={selectedLocations.includes(location)}
                            onCheckedChange={(checked) => handleLocationChange(location, checked as boolean)}
                          />
                          <label
                            htmlFor={`location-${location}`}
                            className="text-sm text-foreground cursor-pointer"
                          >
                            {location}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button type="submit" className="w-full bg-gradient-primary hover:bg-primary-hover text-lg py-6">
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Subscribe to Alerts
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Benefits Sidebar */}
          <div className="space-y-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-lg text-foreground">Benefits of Subscribing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-foreground">Instant Notifications</p>
                    <p className="text-sm text-muted-foreground">Get alerted within minutes of job posting</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-foreground">Personalized Matches</p>
                    <p className="text-sm text-muted-foreground">Only relevant jobs based on your criteria</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-foreground">Deadline Reminders</p>
                    <p className="text-sm text-muted-foreground">Never miss application deadlines</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-foreground">Free Service</p>
                    <p className="text-sm text-muted-foreground">Completely free with no hidden charges</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-lg text-foreground">Popular Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Badge className="bg-primary/10 text-primary hover:bg-primary/20 w-full justify-center py-2">
                    Banking Jobs (500+)
                  </Badge>
                  <Badge className="bg-accent/10 text-accent hover:bg-accent/20 w-full justify-center py-2">
                    Railway Jobs (300+)
                  </Badge>
                  <Badge className="bg-primary/10 text-primary hover:bg-primary/20 w-full justify-center py-2">
                    Teaching Jobs (200+)
                  </Badge>
                  <Badge className="bg-accent/10 text-accent hover:bg-accent/20 w-full justify-center py-2">
                    Civil Services (150+)
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Alerts;