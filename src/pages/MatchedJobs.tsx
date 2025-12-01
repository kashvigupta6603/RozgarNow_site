import { useEffect, useState } from "react";
import JobCard from "@/components/JobCard";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Loader2 } from "lucide-react";

const MatchedJobs = () => {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchMatchedJobs = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token"); // ⭐ token from login

      const res = await fetch("http://localhost:4000/api/jobs/matching", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to fetch jobs");
      }

      setJobs(data.jobs || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatchedJobs();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold mb-6">Matched Jobs For You</h1>

        {loading && (
          <div className="flex justify-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
          </div>
        )}

        {error && !loading && (
          <p className="text-center text-red-500 text-lg py-10">{error}</p>
        )}

        {!loading && !error && jobs.length === 0 && (
          <p className="text-center text-muted-foreground text-lg py-10">
            No job matches found based on your preferences.
          </p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <JobCard
              key={job.id}
              id={job.id}
              title={job.title}
              organization={job.organization}
              location={job.location}
              qualification={job.qualificationRequired}
              applicationDeadline={job.deadline}
              category={job.category}
              vacancies={job.vacancies}
              applyLink={job.applyLink} // 🔥 Important
            />
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default MatchedJobs;
