// src/pages/AdminUsers.tsx

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
import { Loader2, Search, ShieldCheck } from "lucide-react";

interface AdminUser {
  id: number;
  name: string | null;
  email: string;
  isAdmin?: boolean | null;
  createdAt?: string;
}

const AdminUsers = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  /* -----------------------------------
      FETCH USERS API
  ------------------------------------ */
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");
      if (!token) throw new Error("Not authenticated");

      const res = await fetch("http://localhost:4000/api/admin/users", {
        headers: {
          Authorization: `Bearer ${token}`, // FIXED
        },
      });

      if (!res.ok) throw new Error("Failed to load users");

      const data = await res.json();
      setUsers(data.users ?? []);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  /* -----------------------------------
      SEARCH FILTER
  ------------------------------------ */
  const filteredUsers = users.filter((u) => {
    const q = search.toLowerCase();
    return (
      u.email.toLowerCase().includes(q) ||
      (u.name || "").toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* HEADER */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Admin • Users</h1>
            <p className="text-muted-foreground mt-1">
              View and manage all registered users on Vacantra.
            </p>
          </div>
        </div>

        {/* TOP CARD */}
        <Card className="mb-6">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-primary" />
              Users Overview
            </CardTitle>
          </CardHeader>

          <CardContent className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              Total users:{" "}
              <span className="font-semibold text-foreground">
                {users.length}
              </span>
            </p>

            <div className="relative w-full md:w-72">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name or email"
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

        {/* EMPTY */}
        {!loading && !error && filteredUsers.length === 0 && (
          <p className="text-center text-muted-foreground py-10">
            No users found.
          </p>
        )}

        {/* TABLE */}
        {!loading && !error && filteredUsers.length > 0 && (
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16">ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead className="w-32">Role</TableHead>
                    <TableHead className="w-40">Joined</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-mono text-xs">
                        {user.id}
                      </TableCell>

                      <TableCell>{user.name || "—"}</TableCell>

                      <TableCell>{user.email}</TableCell>

                      <TableCell>
                        {user.isAdmin ? (
                          <Badge className="bg-primary/10 text-primary hover:bg-primary/20">
                            Admin
                          </Badge>
                        ) : (
                          <Badge variant="outline">User</Badge>
                        )}
                      </TableCell>

                      <TableCell className="text-sm text-muted-foreground">
                        {user.createdAt
                          ? new Date(user.createdAt).toLocaleDateString()
                          : "—"}
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

export default AdminUsers;
