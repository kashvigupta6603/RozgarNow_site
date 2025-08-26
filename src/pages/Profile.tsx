import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { User, Settings, Bell, Save, Edit } from "lucide-react";
import { useState } from "react";

const Profile = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    gender: "",
    address: "",
    state: "",
    city: "",
    qualification: "",
    experience: "",
    specialization: "",
    keywords: ""
  });

  const [preferences, setPreferences] = useState({
    jobTypes: [] as string[],
    locations: [] as string[],
    notifications: {
      email: true,
      push: true,
      sms: false
    }
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleJobTypeChange = (jobType: string, checked: boolean) => {
    setPreferences(prev => ({
      ...prev,
      jobTypes: checked 
        ? [...prev.jobTypes, jobType]
        : prev.jobTypes.filter(type => type !== jobType)
    }));
  };

  const handleLocationChange = (location: string, checked: boolean) => {
    setPreferences(prev => ({
      ...prev,
      locations: checked 
        ? [...prev.locations, location]
        : prev.locations.filter(loc => loc !== location)
    }));
  };

  const handleNotificationChange = (type: string, checked: boolean) => {
    setPreferences(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [type]: checked
      }
    }));
  };

  const jobTypes = [
    "Central Government",
    "State Government", 
    "Banking & Finance",
    "Railway",
    "Defense",
    "Police",
    "Teaching",
    "Healthcare",
    "Engineering",
    "Legal"
  ];

  const preferredLocations = [
    "All India",
    "Delhi NCR",
    "Mumbai",
    "Bangalore",
    "Chennai",
    "Kolkata",
    "Hyderabad",
    "Pune",
    "Ahmedabad",
    "Jaipur"
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ formData, preferences });
    // Handle form submission
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Header */}
      <div className="bg-gradient-hero py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-primary-foreground mb-4">
              My Profile
            </h1>
            <p className="text-xl text-primary-foreground/90">
              Manage your personal information and job preferences
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Profile Form */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Personal Information */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center text-foreground">
                  <User className="h-5 w-5 mr-3 text-primary" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">
                        Full Name *
                      </label>
                      <Input
                        placeholder="Enter your full name"
                        value={formData.fullName}
                        onChange={(e) => handleInputChange('fullName', e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">
                        Email Address *
                      </label>
                      <Input
                        type="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">
                        Phone Number
                      </label>
                      <Input
                        placeholder="Enter your phone number"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">
                        Date of Birth
                      </label>
                      <Input
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">
                        Gender
                      </label>
                      <Select value={formData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">
                        State
                      </label>
                      <Select value={formData.state} onValueChange={(value) => handleInputChange('state', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select state" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="delhi">Delhi</SelectItem>
                          <SelectItem value="mumbai">Maharashtra</SelectItem>
                          <SelectItem value="karnataka">Karnataka</SelectItem>
                          <SelectItem value="tamilnadu">Tamil Nadu</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Address
                    </label>
                    <Textarea
                      placeholder="Enter your complete address"
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      rows={3}
                    />
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Educational Background */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center text-foreground">
                  <Edit className="h-5 w-5 mr-3 text-primary" />
                  Educational Background
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">
                        Highest Qualification
                      </label>
                      <Select value={formData.qualification} onValueChange={(value) => handleInputChange('qualification', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select qualification" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="10th">10th Pass</SelectItem>
                          <SelectItem value="12th">12th Pass</SelectItem>
                          <SelectItem value="graduate">Graduate</SelectItem>
                          <SelectItem value="postgraduate">Post Graduate</SelectItem>
                          <SelectItem value="diploma">Diploma</SelectItem>
                          <SelectItem value="professional">Professional Course</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">
                        Experience (Years)
                      </label>
                      <Select value={formData.experience} onValueChange={(value) => handleInputChange('experience', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select experience" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="fresher">Fresher</SelectItem>
                          <SelectItem value="1-3">1-3 Years</SelectItem>
                          <SelectItem value="4-7">4-7 Years</SelectItem>
                          <SelectItem value="8-12">8-12 Years</SelectItem>
                          <SelectItem value="12+">12+ Years</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Specialization/Field
                    </label>
                    <Input
                      placeholder="e.g., Computer Science, Commerce, Arts"
                      value={formData.specialization}
                      onChange={(e) => handleInputChange('specialization', e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Keywords (Skills/Interests)
                    </label>
                    <Textarea
                      placeholder="Enter relevant keywords, skills, or areas of interest"
                      value={formData.keywords}
                      onChange={(e) => handleInputChange('keywords', e.target.value)}
                      rows={2}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Job Preferences */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center text-foreground">
                  <Settings className="h-5 w-5 mr-3 text-primary" />
                  Job Preferences
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-3 block">
                      Preferred Job Types
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {jobTypes.map((jobType) => (
                        <div key={jobType} className="flex items-center space-x-2">
                          <Checkbox
                            id={`jobtype-${jobType}`}
                            checked={preferences.jobTypes.includes(jobType)}
                            onCheckedChange={(checked) => handleJobTypeChange(jobType, checked as boolean)}
                          />
                          <label
                            htmlFor={`jobtype-${jobType}`}
                            className="text-sm text-foreground cursor-pointer"
                          >
                            {jobType}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-3 block">
                      Preferred Locations
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {preferredLocations.map((location) => (
                        <div key={location} className="flex items-center space-x-2">
                          <Checkbox
                            id={`location-${location}`}
                            checked={preferences.locations.includes(location)}
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
                </div>
              </CardContent>
            </Card>

            <Button type="submit" className="w-full bg-gradient-primary hover:bg-primary-hover text-lg py-6">
              <Save className="h-5 w-5 mr-2" />
              Save Profile
            </Button>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Notification Settings */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center text-foreground">
                  <Bell className="h-5 w-5 mr-3 text-primary" />
                  Notification Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">Email Notifications</p>
                    <p className="text-sm text-muted-foreground">Receive job alerts via email</p>
                  </div>
                  <Checkbox
                    checked={preferences.notifications.email}
                    onCheckedChange={(checked) => handleNotificationChange('email', checked as boolean)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">Push Notifications</p>
                    <p className="text-sm text-muted-foreground">Browser push notifications</p>
                  </div>
                  <Checkbox
                    checked={preferences.notifications.push}
                    onCheckedChange={(checked) => handleNotificationChange('push', checked as boolean)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">SMS Alerts</p>
                    <p className="text-sm text-muted-foreground">Text message notifications</p>
                  </div>
                  <Checkbox
                    checked={preferences.notifications.sms}
                    onCheckedChange={(checked) => handleNotificationChange('sms', checked as boolean)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Profile Completeness */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-foreground">Profile Completeness</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-foreground">Profile Complete</span>
                    <Badge className="bg-accent hover:bg-accent-hover">75%</Badge>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-gradient-primary h-2 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Complete your profile to get better job recommendations
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-foreground">Your Activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Jobs Applied</span>
                  <span className="font-semibold text-foreground">12</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Alerts Received</span>
                  <span className="font-semibold text-foreground">48</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Profile Views</span>
                  <span className="font-semibold text-foreground">156</span>
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

export default Profile;