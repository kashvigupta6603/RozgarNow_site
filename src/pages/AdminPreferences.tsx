// src/pages/AdminPreferences.tsx

import { useEffect, useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
 TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Loader2, Search, SlidersHorizontal, User } from "lucide-react";

interface PrefUser {
  id: number;
  email: string;
  name: string | null;
}

interface AdminPreference {
  id: number;
  userId: number;
  qualification: string | null;
  category: string | null;
  location: string | null;
  keywords: string | null;
  experience: string | null;
  govt: string | null;
  user?: PrefUser | null;
}

const AdminPreferences = () => {
  const [prefs, setPrefs] = useState<AdminPreference[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  /* -----------------------------------
      FETCH PREFERENCES API
  ------------------------------------ */
  const fetchPreferences = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");
      if (!token) throw new Error("Not authenticated");

      const res = await fetch("http://localhost:4000/api/admin/preferences", {
        headers: {
          Authorization: `Bearer ${token}`, // FIXED
        },
      });

      if (!res.ok) throw new Error("Failed to load preferences");

      const data = await res.json();
      setPrefs(data.prefs ?? []);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPreferences();
  }, []);

  /* -----------------------------------
      SEARCH FILTER
  ------------------------------------ */
  const filteredPrefs = prefs.filter((p) => {
    const q = search.toLowerCase();
    const email = p.user?.email?.toLowerCase() || "";
    const name = p.user?.name?.toLowerCase() || "";
    const loc = (p.location || "").toLowerCase();
    const govt = (p.govt || "").toLowerCase();
    const cat = (p.category || "").toLowerCase();

    return (
      email.includes(q) ||
      name.includes(q) ||
      loc.includes(q) ||
      govt.includes(q) ||
      cat.includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* HEADER */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Admin • Preferences</h1>
            <p className="text-muted-foreground mt-1">
              View how users have configured their job preferences.
            </p>
          </div>
        </div>

        {/* TOP CARD */}
        <Card className="mb-6">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <SlidersHorizontal className="h-5 w-5 text-primary" />
              Preferences Overview
            </CardTitle>
          </CardHeader>

          <CardContent className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              Total preference profiles:{" "}
              <span className="font-semibold text-foreground">{prefs.length}</span>
            </p>

            <div className="relative w-full md:w-72">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by email, govt type or location"
                className="pl-8"
              />
            </div>
          </CardContent>
        </Card>

        {/* LOADING */}
        {loading && (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        {/* ERROR */}
        {!loading && error && (
          <p className="text-center text-red-500 py-10">{error}</p>
        )}

        {/* EMPTY STATE */}
        {!loading && !error && filteredPrefs.length === 0 && (
          <p className="text-center text-muted-foreground py-10">
            No preferences found.
          </p>
        )}

        {/* TABLE */}
        {!loading && !error && filteredPrefs.length > 0 && (
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16">ID</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Govt Type</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Qualification</TableHead>
                    <TableHead>Categories</TableHead>
                    <TableHead>Keywords</TableHead>
                    <TableHead>Experience</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {filteredPrefs.map((pref) => (
                    <TableRow key={pref.id}>
                      <TableCell className="font-mono text-xs">
                        {pref.id}
                      </TableCell>

                      {/* USER */}
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="flex items-center gap-1 text-sm font-medium">
                            <User className="h-3 w-3" />
                            {pref.user?.name || "—"}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {pref.user?.email || "No email"}
                          </span>
                        </div>
                      </TableCell>

                      {/* GOVT */}
                      <TableCell>
                        {pref.govt ? (
                          <Badge className="bg-primary/10 text-primary hover:bg-primary/20 text-xs">
                            {pref.govt}
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-xs">
                            None
                          </Badge>
                        )}
                      </TableCell>

                      {/* OTHER FIELDS */}
                      <TableCell className="text-sm text-muted-foreground">
                        {pref.location || "—"}
                      </TableCell>

                      <TableCell className="text-sm text-muted-foreground">
                        {pref.qualification || "—"}
                      </TableCell>

                      <TableCell className="text-xs text-muted-foreground max-w-[180px] truncate">
                        {pref.category || "—"}
                      </TableCell>

                      <TableCell className="text-xs text-muted-foreground max-w-[220px] truncate">
                        {pref.keywords || "—"}
                      </TableCell>

                      <TableCell className="text-sm text-muted-foreground">
                        {pref.experience || "—"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default AdminPreferences;
