import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import JobCard from "@/components/JobCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter, X } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

const Jobs = () => {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [selectedQualification, setSelectedQualification] = useState("all");

  // ==============================
  // Fetch Jobs
  // ==============================
  useEffect(() => {
    const loadJobs = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/jobs/all");
        const data = await res.json();

        if (data.success && data.jobs) {
          const cleanedJobs = data.jobs.map((job: any) => ({
            ...job,
            location: cleanLocation(job.location),
            deadline: cleanDate(job.deadline),
          }));

          setJobs(cleanedJobs);
        } else {
          toast.error("Failed to fetch jobs");
        }
      } catch (err) {
        console.error("Error fetching jobs:", err);
        toast.error("Backend connection error");
      } finally {
        setLoading(false);
      }
    };

    loadJobs();
  }, []);

  // ==============================
  // CLEAN LOCATION
  // ==============================
  const cleanLocation = (loc: string | null) => {
    if (!loc) return "Not specified";

    try {
      const parsed = JSON.parse(loc);
      if (Array.isArray(parsed) && parsed.length && parsed[0] !== "") {
        return parsed.join(", ");
      }
    } catch {
      // Not JSON
    }

    return loc.replace(/[\[\]\\"]/g, "").trim() || "Not specified";
  };

  // ==============================
  // CLEAN DATE  (Fixed Template String Bug)
  // ==============================
  const cleanDate = (d: string | null) => {
    if (!d) return "";

    const parts = d.split("-");
    if (parts.length === 3) {
      // "DD-MM-YYYY" ➝ "YYYY-MM-DD"
      return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
    return d;
  };

  // Dropdown Options
  const categories = ["All", "Government", "Railway", "Banking", "Police", "Teaching", "Defense"];
  const locations = ["All", "Punjab", "Delhi", "Chandigarh", "Mumbai", "Pan India"];
  const qualifications = ["All", "10th Pass", "12th Pass", "Graduate", "Post Graduate"];

  // ==============================
  // FILTERING LOGIC
  // ==============================
  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.organization?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === "all" ||
      job.govt?.toLowerCase().includes(selectedCategory.toLowerCase());

    const matchesLocation =
      selectedLocation === "all" ||
      job.location?.toLowerCase().includes(selectedLocation.toLowerCase());

    const matchesQualification =
      selectedQualification === "all" ||
      job.qualificationRequired?.toLowerCase().includes(selectedQualification.toLowerCase());

    return matchesSearch && matchesCategory && matchesLocation && matchesQualification;
  });

  const clearFilters = () => {
    setSelectedCategory("all");
    setSelectedLocation("all");
    setSelectedQualification("all");
    setSearchTerm("");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* HERO */}
      <div className="bg-gradient-hero py-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Government Job Listings</h1>
          <p className="text-lg text-gray-100">Find verified live updates from trusted sources</p>
        </div>
      </div>

      {/* Search + Filters */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-wrap gap-4 mb-6 items-center">
          {/* Search Bar */}
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-3 text-gray-500" />
            <Input
              placeholder="Search jobs, organizations, or keywords..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Category */}
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category.toLowerCase()}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Location */}
          <Select value={selectedLocation} onValueChange={setSelectedLocation}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Location" />
            </SelectTrigger>
            <SelectContent>
              {locations.map((loc) => (
                <SelectItem key={loc} value={loc.toLowerCase()}>
                  {loc}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Qualification */}
          <Select value={selectedQualification} onValueChange={setSelectedQualification}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Qualification" />
            </SelectTrigger>
            <SelectContent>
              {qualifications.map((q) => (
                <SelectItem key={q} value={q.toLowerCase()}>
                  {q}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Clear Filters */}
          {(selectedCategory !== "all" ||
            selectedLocation !== "all" ||
            selectedQualification !== "all") && (
            <Button variant="outline" onClick={clearFilters}>
              <X className="h-4 w-4 mr-2" />
              Clear Filters
            </Button>
          )}
        </div>

        {/* JOB GRID */}
        {loading ? (
          <p className="text-center text-gray-500 py-10">Loading jobs...</p>
        ) : filteredJobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.map((job) => (
              <JobCard
                key={job.id}
                id={job.id}
                title={job.title}
                organization={job.organization}
                location={job.location || "N/A"}
                qualification={job.qualificationRequired || "Not specified"}
                applicationDeadline={job.deadline || "2025-01-01"}
                category={job.category || "General"}
                vacancies={job.vacancies || 1}
                isNew={true}
                applyLink={job.applyLink} // IMPORTANT
              />
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 py-12">
            <Filter className="h-10 w-10 mx-auto mb-3" />
            <p>No jobs found matching your filters</p>
            <Button className="mt-3" onClick={clearFilters}>
              Reset Filters
            </Button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Jobs;
