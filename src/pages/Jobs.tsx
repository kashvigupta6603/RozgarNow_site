import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import JobCard from "@/components/JobCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, X } from "lucide-react";
import { useState } from "react";

const Jobs = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [selectedQualification, setSelectedQualification] = useState("all");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  // Mock job data
  const jobs = [
    {
      id: "1",
      title: "Staff Selection Commission - Multi Tasking Staff",
      organization: "Staff Selection Commission (SSC)",
      location: "All India",
      qualification: "10th Pass",
      applicationDeadline: "2025-02-15",
      category: "Government",
      vacancies: 8000,
      isNew: true
    },
    {
      id: "2", 
      title: "Railway Protection Force - Constable",
      organization: "Indian Railways",
      location: "Pan India",
      qualification: "12th Pass",
      applicationDeadline: "2025-02-28",
      category: "Railway",
      vacancies: 5000,
      isNew: true
    },
    {
      id: "3",
      title: "State Bank of India - Probationary Officer",
      organization: "State Bank of India",
      location: "All States",
      qualification: "Graduate",
      applicationDeadline: "2025-03-10",
      category: "Banking",
      vacancies: 2000,
      isNew: false
    },
    {
      id: "4",
      title: "IBPS - Clerk Recruitment",
      organization: "Institute of Banking Personnel Selection",
      location: "All India",
      qualification: "Graduate",
      applicationDeadline: "2025-03-05",
      category: "Banking",
      vacancies: 4000,
      isNew: false
    },
    {
      id: "5",
      title: "Delhi Police - Constable",
      organization: "Delhi Police",
      location: "Delhi",
      qualification: "12th Pass",
      applicationDeadline: "2025-02-20",
      category: "Police",
      vacancies: 25000,
      isNew: true
    },
    {
      id: "6",
      title: "UPSC - Civil Services Examination",
      organization: "Union Public Service Commission",
      location: "All India",
      qualification: "Graduate",
      applicationDeadline: "2025-03-15",
      category: "Civil Services",
      vacancies: 900,
      isNew: false
    }
  ];

  const categories = ["All", "Government", "Railway", "Banking", "Police", "Civil Services", "Teaching", "Defense"];
  const locations = ["All", "All India", "Delhi", "Mumbai", "Bangalore", "Chennai", "Kolkata", "Pan India"];
  const qualifications = ["All", "10th Pass", "12th Pass", "Graduate", "Post Graduate"];

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.organization.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || job.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesLocation = selectedLocation === "all" || job.location.toLowerCase().includes(selectedLocation.toLowerCase());
    const matchesQualification = selectedQualification === "all" || job.qualification.toLowerCase() === selectedQualification.toLowerCase();
    
    return matchesSearch && matchesCategory && matchesLocation && matchesQualification;
  });

  const clearFilters = () => {
    setSelectedCategory("all");
    setSelectedLocation("all");
    setSelectedQualification("all");
    setActiveFilters([]);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Header */}
      <div className="bg-gradient-hero py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-primary-foreground mb-4">
              Government Job Listings
            </h1>
            <p className="text-xl text-primary-foreground/90">
              Find your dream government job from thousands of opportunities
            </p>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-background shadow-soft border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search jobs, organizations, or keywords..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-3 text-lg"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4">
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

              <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                  {locations.map((location) => (
                    <SelectItem key={location} value={location.toLowerCase()}>
                      {location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedQualification} onValueChange={setSelectedQualification}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Qualification" />
                </SelectTrigger>
                <SelectContent>
                  {qualifications.map((qualification) => (
                    <SelectItem key={qualification} value={qualification.toLowerCase()}>
                      {qualification}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {(selectedCategory !== "all" || selectedLocation !== "all" || selectedQualification !== "all") && (
                <Button variant="outline" onClick={clearFilters} size="sm">
                  <X className="h-4 w-4 mr-2" />
                  Clear Filters
                </Button>
              )}
            </div>

            {/* Active Filters */}
            {activeFilters.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {activeFilters.map((filter, index) => (
                  <Badge key={index} variant="secondary" className="px-3 py-1">
                    {filter}
                    <X className="h-3 w-3 ml-2 cursor-pointer" />
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-foreground">
            {filteredJobs.length} Jobs Found
          </h2>
          <Select defaultValue="newest">
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="deadline">Deadline</SelectItem>
              <SelectItem value="vacancies">Most Vacancies</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Job Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.map((job) => (
            <JobCard key={job.id} {...job} />
          ))}
        </div>

        {filteredJobs.length === 0 && (
          <div className="text-center py-12">
            <div className="text-muted-foreground mb-4">
              <Filter className="h-12 w-12 mx-auto mb-4" />
              <h3 className="text-xl font-semibold">No jobs found</h3>
              <p className="mt-2">Try adjusting your search criteria or filters</p>
            </div>
            <Button onClick={clearFilters} variant="outline">
              Clear all filters
            </Button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Jobs;