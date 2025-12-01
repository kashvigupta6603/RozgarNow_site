import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { User, Settings, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const Profile = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    qualification: "",
    location: "",
    experience: "",
    govt: "",
    keywords: "",
  });

  const [preferences, setPreferences] = useState({
    jobTypes: [] as string[],
  });

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
    "Legal",
  ];

  const token = localStorage.getItem("token");

  // Fetch user info & preferences
  useEffect(() => {
    if (!token) return;

    fetch("http://localhost:4000/api/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setFormData((prev) => ({
          ...prev,
          email: data.email || "",
          fullName: data.name || "",
        }));
      });

    fetch("http://localhost:4000/api/preferences/get", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.pref) {
          setFormData((prev) => ({
            ...prev,
            qualification: data.pref.qualification || "",
            location: data.pref.location || "",
            experience: data.pref.experience || "",
            govt: data.pref.govt || "",
            keywords: data.pref.keywords || "",
          }));

          setPreferences((prev) => ({
            ...prev,
            jobTypes: data.pref.category ? data.pref.category.split(",") : [],
          }));
        }
      });
  }, []);

  // Handlers
  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleJobTypeChange = (jobType: string, checked: boolean) => {
    setPreferences((prev) => ({
      ...prev,
      jobTypes: checked
        ? [...prev.jobTypes, jobType]
        : prev.jobTypes.filter((type) => type !== jobType),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      qualification: formData.qualification,
      location: formData.location,
      experience: formData.experience,
      govt: formData.govt,
      category: preferences.jobTypes.join(","),
      keywords: formData.keywords,
    };

    const res = await fetch("http://localhost:4000/api/preferences/set", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      toast.success("Profile & preferences updated successfully!");
    } else {
      toast.error("Failed to update preferences");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="max-w-7xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold">My Profile</h1>

        <form onSubmit={handleSubmit}>
          {/* Personal Info */}
          <Card className="mt-6 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User size={20} /> Personal Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                value={formData.fullName}
                onChange={(e) => handleInputChange("fullName", e.target.value)}
                placeholder="Full Name"
              />
              <Input value={formData.email} disabled placeholder="Email" />
            </CardContent>
          </Card>

          {/* Job Preferences */}
          <Card className="mt-6 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings size={20} /> Job Preferences
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Location */}
              <Input
                value={formData.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
                placeholder="Preferred Location (Punjab, Delhi...)"
              />

              {/* Experience */}
              <Input
                value={formData.experience}
                onChange={(e) => handleInputChange("experience", e.target.value)}
                placeholder="Experience (Fresher, 2 years...)"
              />

              {/* Government Type */}
              <Select
                value={formData.govt}
                onValueChange={(value) => handleInputChange("govt", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Government Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Government of India">
                    Government of India
                  </SelectItem>
                  <SelectItem value="State Government">
                    State Government
                  </SelectItem>
                  <SelectItem value="None">None</SelectItem>
                </SelectContent>
              </Select>

              {/* Qualification */}
              <Input
                value={formData.qualification}
                onChange={(e) =>
                  handleInputChange("qualification", e.target.value)
                }
                placeholder="Qualification (10th, 12th, B.Tech...)"
              />

              {/* Job Categories */}
              <label className="font-medium">Job Categories</label>
              <div className="grid grid-cols-2 gap-3">
                {jobTypes.map((jobType) => (
                  <div key={jobType} className="flex gap-2 items-center">
                    <Checkbox
                      checked={preferences.jobTypes.includes(jobType)}
                      onCheckedChange={(checked) =>
                        handleJobTypeChange(jobType, checked as boolean)
                      }
                    />
                    <p>{jobType}</p>
                  </div>
                ))}
              </div>

              {/* Keywords */}
              <Textarea
                value={formData.keywords}
                placeholder="Keywords (banking, IT, defense...)"
                onChange={(e) => handleInputChange("keywords", e.target.value)}
              />
            </CardContent>
          </Card>

          <Button type="submit" className="w-full mt-6 py-6">
            <Save className="mr-2" /> Save Profile
          </Button>
        </form>
      </div>

      <Footer />
    </div>
  );
};

export default Profile;
