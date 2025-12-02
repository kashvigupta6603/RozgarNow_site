import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Bell, Search, User, Menu, LogOut, Shield } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useJobAlerts } from "@/hooks/useJobAlerts";

// Backend URL
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:4000";

const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [token, setToken] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // --- CHECK TOKEN & FETCH USER STATUS
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
    setIsAdmin(false);

    if (storedToken) {
      fetch(`${API_BASE_URL}/api/auth/me`, {
        headers: { Authorization: `Bearer ${storedToken}` },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.isAdmin) {
            setIsAdmin(true);
          }
        })
        .catch((err) => console.error("Error fetching user:", err));
    }
  }, [location.pathname]);

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setIsAdmin(false);
    toast.success("Logged out successfully!");
    navigate("/");
  };

  const newJobs = useJobAlerts();

  // Trigger toast when new jobs found
  useEffect(() => {
    if (newJobs.length > 0) {
      toast.success(`🔥 ${newJobs.length} new job(s) match your preferences!`, {
        description: "Go to Matched Jobs to see details",
        action: {
          label: "View",
          onClick: () => navigate("/matched-jobs"),
        },
      });
    }
  }, [newJobs, navigate]);

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: "/", label: "Home" },
    { path: "/jobs", label: "Jobs" },
    { path: "/alerts", label: "Alerts" },
    { path: "/profile", label: "Profile" },
    { path: "/about", label: "About" },
  ];

  return (
    <nav className="bg-background border-b border-border shadow-soft sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 px-6">

          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-gradient-primary p-2 rounded-lg">
              <Search className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-primary">Vacantra</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-10">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-2 text-lg font-semibold transition-colors duration-200 ${
                  isActive(item.path)
                    ? "text-primary border-b-2 border-primary"
                    : "text-muted-foreground hover:text-primary"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Admin Panel Button */}
            {isAdmin && (
              <Link to="/admin">
                <Button variant="ghost" size="sm" className="flex items-center text-primary hover:bg-primary/10">
                  <Shield className="h-4 w-4 mr-2" />
                  Admin
                </Button>
              </Link>
            )}

            {/* Trigger Alerts */}
            <Button
              variant="ghost"
              size="sm"
              onClick={async () => {
                if (!token) return alert("Please login to receive alerts");

                try {
                  const res = await fetch(
                    `${API_BASE_URL}/api/alerts/trigger-one`,
                    {
                      method: "GET",
                      headers: { Authorization: `Bearer ${token}` },
                    }
                  );

                  const data = await res.json();

                  if (data.sent) {
                    alert("📩 Job alerts sent to your email!");
                  } else {
                    alert(data.message || "No matched jobs right now.");
                  }
                } catch {
                  alert("Request failed");
                }
              }}
            >
              <Bell className="h-5 w-5" />
            </Button>

            {/* If NOT logged in */}
            {!token ? (
              <>
                <Link to="/login">
                  <Button variant="outline" size="sm" className="flex items-center">
                    <User className="h-5 w-5 mr-2" />
                    Login
                  </Button>
                </Link>

                <Link to="/register">
                  <Button size="sm" className="bg-gradient-primary hover:bg-primary-hover">
                    Get Started
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link to="/matched-jobs">
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <Search className="h-4 w-4" />
                    Matched Jobs
                  </Button>
                </Link>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="flex items-center"
                >
                  <LogOut className="h-5 w-5 mr-2" />
                  Logout
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
