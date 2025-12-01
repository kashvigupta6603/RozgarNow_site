import { useEffect, useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2, Trash2, Plus } from "lucide-react";

interface Job {
  id: number;
  title: string;
  organization: string;
  location: string | null;
  deadline: string | null;
  qualificationRequired: string | null;
}

const AdminJobs = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    title: "",
    organization: "",
    location: "",
    deadline: "",
    qualificationRequired: "",
  });

  const token = localStorage.getItem("token");

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await fetch("http://localhost:4000/api/admin/jobs", {
        headers: {
          Authorization: `Bearer ${token}`, // FIXED
        },
      });

      if (!res.ok) {
        throw new Error("Failed to load jobs");
      }

      const data = await res.json();
      setJobs(data.jobs || []);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete this job?")) return;

    try {
      const res = await fetch(
        `http://localhost:4000/api/admin/jobs/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`, // FIXED
          },
        }
      );

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Delete failed");
      }

      setJobs((prev) => prev.filter((j) => j.id !== id));
    } catch (err: any) {
      alert(err.message || "Failed to delete");
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:4000/api/admin/jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // FIXED
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Create failed");
      }

      setJobs((prev) => [data.job, ...prev]);

      setForm({
        title: "",
        organization: "",
        location: "",
        deadline: "",
        qualificationRequired: "",
      });
    } catch (err: any) {
      alert(err.message || "Failed to create job");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Admin – Jobs</h1>

          <Button
            variant="outline"
            onClick={fetchJobs}
            disabled={loading}
            className="flex items-center gap-2"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            Refresh
          </Button>
        </div>

        {error && (
          <p className="text-red-500 text-sm">
            Failed to load jobs: {error}
          </p>
        )}

        {/* Create Job Form */}
        <Card className="p-4 space-y-3">
          <h2 className="font-semibold flex items-center gap-2">
            <Plus className="h-4 w-4" /> Add New Job (Admin)
          </h2>

          <form
            onSubmit={handleCreate}
            className="grid grid-cols-1 md:grid-cols-5 gap-3"
          >
            <Input
              placeholder="Title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />

            <Input
              placeholder="Organization"
              value={form.organization}
              onChange={(e) =>
                setForm({ ...form, organization: e.target.value })
              }
              required
            />

            <Input
              placeholder="Location"
              value={form.location}
              onChange={(e) =>
                setForm({ ...form, location: e.target.value })
              }
            />

            <Input
              placeholder="Deadline (YYYY-MM-DD)"
              value={form.deadline}
              onChange={(e) =>
                setForm({ ...form, deadline: e.target.value })
              }
            />

            <Input
              placeholder="Qualification"
              value={form.qualificationRequired}
              onChange={(e) =>
                setForm({
                  ...form,
                  qualificationRequired: e.target.value,
                })
              }
            />

            <div className="md:col-span-5 flex justify-end">
              <Button type="submit" className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Create Job
              </Button>
            </div>
          </form>
        </Card>

        {/* Jobs Table */}
        <Card className="p-4">
          <h2 className="font-semibold mb-4">Jobs in Database</h2>

          {loading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : jobs.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No jobs found in the database.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Organization</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Deadline</TableHead>
                    <TableHead>Qualification</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {jobs.map((job) => (
                    <TableRow key={job.id}>
                      <TableCell>{job.id}</TableCell>
                      <TableCell>{job.title}</TableCell>
                      <TableCell>{job.organization}</TableCell>
                      <TableCell>{job.location || "—"}</TableCell>
                      <TableCell>{job.deadline || "—"}</TableCell>
                      <TableCell>
                        {job.qualificationRequired || "—"}
                      </TableCell>

                      <TableCell className="text-right">
                        <Button
                          variant="destructive"
                          size="sm"
                          className="flex items-center gap-1"
                          onClick={() => handleDelete(job.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </Card>
      </div>

      <Footer />
    </div>
  );
};

export default AdminJobs;
