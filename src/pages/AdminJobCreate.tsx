import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const AdminJobCreate = () => {
  const token = localStorage.getItem("token");

  const [job, setJob] = useState({
    title: "",
    organization: "",
    location: "",
    qualificationRequired: "",
    deadline: "",
    applyLink: "",
  });

  const handleChange = (e: any) => {
    setJob({
      ...job,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const res = await fetch("http://localhost:4000/api/admin/jobs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // FIXED
      },
      body: JSON.stringify(job),
    });

    if (res.ok) {
      alert("Job uploaded successfully!");
      window.location.href = "/admin/jobs";
    } else {
      alert("Failed to create job");
    }
  };

  return (
    <div>
      <Navigation />

      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Create Job Posting</h1>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {Object.keys(job).map((key) => (
            <Input
              key={key}
              name={key}
              placeholder={key}
              value={(job as any)[key]}
              onChange={handleChange}
              required
            />
          ))}

          <Button type="submit" className="w-full bg-primary">
            Upload Job
          </Button>
        </form>
      </div>

      <Footer />
    </div>
  );
};

export default AdminJobCreate;
