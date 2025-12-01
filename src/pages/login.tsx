import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Login failed!");
        return;
      }

      toast.success("Login successful! Redirecting...");

      // ✅ save token
      if (data.token) {
        localStorage.setItem("token", data.token);
        window.dispatchEvent(new Event("storage")); // trigger navbar update
      }

      // ✅ redirect after login
      setTimeout(() => {
        navigate("/");
      }, 800);
    } catch (error) {
      toast.error("Server error. Try again!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-[400px] shadow-lg border-border/50 bg-card">
        <CardHeader>
          <h2 className="text-2xl font-semibold text-center text-foreground">
            Welcome Back 👋
          </h2>
          <p className="text-sm text-muted-foreground text-center mt-1">
            Login to access your dashboard
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                name="email"
                id="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                name="password"
                id="password"
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <Button type="submit" className="w-full bg-gradient-primary hover:bg-primary-hover">
              Login
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex justify-center text-sm text-muted-foreground">
          Don’t have an account?
          <button
            onClick={() => navigate("/register")}
            className="ml-2 text-primary hover:underline"
          >
            Register
          </button>
        </CardFooter>
      </Card>
    </div>
  );
}
