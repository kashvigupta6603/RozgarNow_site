import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Briefcase, SlidersHorizontal } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface AdminStats {
  totalUsers: number;
  totalJobs: number;
  totalPreferences: number;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalJobs: 0,
    totalPreferences: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  /* -----------------------------
      FETCH ADMIN STATS
  ------------------------------ */
  const fetchStats = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const baseUrl = import.meta.env.VITE_API_URL; // must end with /
console.log("Final URL:", baseUrl + "api/admin/stats");

const res = await fetch(baseUrl + "api/admin/stats", {
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
});


      if (!res.ok) {
        throw new Error("Failed to load stats");
      }

      const data = await res.json();

      setStats({
        totalUsers: data.users ?? 0,
        totalJobs: data.jobs ?? 0,
        totalPreferences: data.preferences ?? 0,
      });
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Overview of users, jobs and saved preferences.
            </p>
          </div>

          <Button variant="outline" onClick={fetchStats} disabled={loading}>
            {loading ? "Refreshing..." : "Refresh"}
          </Button>
        </div>

        {/* Error */}
        {error && <p className="text-red-500 mb-4 text-sm">{error}</p>}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* USERS */}
          <Card className="shadow-card hover:shadow-elevated transition-all duration-200">
            <CardHeader className="flex items-center justify-between pb-2">
              <CardTitle>Users</CardTitle>
              <Users className="h-5 w-5 text-primary" />
            </CardHeader>

            <CardContent>
              <p className="text-3xl font-bold">{stats.totalUsers}</p>
              <p className="text-sm text-muted-foreground">
                Total registered users
              </p>

              <Button
                variant="outline"
                className="mt-4 w-full"
                onClick={() => navigate("/admin/users")}
              >
                View details
              </Button>
            </CardContent>
          </Card>

          {/* JOBS */}
          <Card className="shadow-card hover:shadow-elevated transition-all duration-200">
            <CardHeader className="flex items-center justify-between pb-2">
              <CardTitle>Jobs</CardTitle>
              <Briefcase className="h-5 w-5 text-primary" />
            </CardHeader>

            <CardContent>
              <p className="text-3xl font-bold">{stats.totalJobs}</p>
              <p className="text-sm text-muted-foreground">
                Total jobs in database
              </p>

              <Button
                variant="outline"
                className="mt-4 w-full"
                onClick={() => navigate("/admin/jobs")}
              >
                View details
              </Button>
            </CardContent>
          </Card>

          {/* PREFERENCES */}
          <Card className="shadow-card hover:shadow-elevated transition-all duration-200">
            <CardHeader className="flex items-center justify-between pb-2">
              <CardTitle>Preferences</CardTitle>
              <SlidersHorizontal className="h-5 w-5 text-primary" />
            </CardHeader>

            <CardContent>
              <p className="text-3xl font-bold">{stats.totalPreferences}</p>
              <p className="text-sm text-muted-foreground">
                Saved user preference profiles
              </p>

              <Button
                variant="outline"
                className="mt-4 w-full"
                onClick={() => navigate("/admin/preferences")}
              >
                View details
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AdminDashboard;
