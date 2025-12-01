// src/App.tsx

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Index from "./pages/Index";
import Jobs from "./pages/Jobs";
import About from "./pages/About";
import Alerts from "./pages/Alerts";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import Register from "./pages/register";
import Login from "./pages/login";
import MatchedJobs from "@/pages/MatchedJobs";

// Admin pages
import AdminDashboard from "@/pages/AdminDashboard";
import AdminUsers from "@/pages/AdminUsers";
import AdminJobs from "@/pages/AdminJobs";
import AdminPreferences from "@/pages/AdminPreferences";
import AdminJobCreate from "@/pages/AdminJobCreate";

import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />

      <BrowserRouter>
        <Routes>
          {/* ---------- Public Routes ---------- */}
          <Route path="/" element={<Index />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/about" element={<About />} />
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/matched-jobs" element={<MatchedJobs />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />

          {/* ---------- Protected (User) ---------- */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* ---------- Admin Routes ---------- */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/users"
            element={
              <ProtectedRoute>
                <AdminUsers />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/jobs"
            element={
              <ProtectedRoute>
                <AdminJobs />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/jobs/new"
            element={
              <ProtectedRoute>
                <AdminJobCreate />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/preferences"
            element={
              <ProtectedRoute>
                <AdminPreferences />
              </ProtectedRoute>
            }
          />

          {/* ---------- 404 ---------- */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
