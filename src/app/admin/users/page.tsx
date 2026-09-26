"use client";

import React, { useState, useEffect } from "react";
import { Users, Shield, UserCheck, Search, CheckCircle2, AlertCircle } from "lucide-react";
import { UserRole } from "@/lib/auth/types";

interface UserItem {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  status: "active" | "suspended" | "pending_verification";
  createdAt: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [feedback, setFeedback] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      if (res.ok && data.users) {
        setUsers(data.users);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleUpdateRole = async (userId: string, newRole: UserRole) => {
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, role: newRole }),
      });
      if (res.ok) {
        setFeedback("Role updated successfully");
        fetchUsers();
        setTimeout(() => setFeedback(null), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateStatus = async (userId: string, newStatus: "active" | "suspended") => {
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, status: newStatus }),
      });
      if (res.ok) {
        setFeedback("Account status updated");
        fetchUsers();
        setTimeout(() => setFeedback(null), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = users.filter((u) => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === "all" || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              Phase 1 Deliverable
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            User & Role Administration
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400">
            Manage granular RBAC permissions, account status, and role assignments.
          </p>
        </div>
      </div>

      {feedback && (
        <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 flex items-center gap-2.5 text-xs text-emerald-300">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-[#121218] border border-zinc-800 flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-10 pr-3 py-2 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-mono text-zinc-400">Filter Role:</span>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
          >
            <option value="all">All Roles</option>
            <option value="customer">Buyer (Customer)</option>
            <option value="agent">Agent</option>
            <option value="owner">Owner</option>
            <option value="developer">Developer</option>
            <option value="admin">Admin</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="rounded-2xl bg-[#121218] border border-zinc-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-zinc-300">
            <thead className="border-b border-zinc-800 bg-zinc-900/60 text-zinc-400 uppercase font-mono text-[10px]">
              <tr>
                <th className="py-3.5 px-4">User Details</th>
                <th className="py-3.5 px-4">Role</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Created Date</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {filtered.map((user) => (
                <tr key={user.id} className="hover:bg-zinc-800/30">
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-white">{user.name}</div>
                    <div className="text-[11px] text-zinc-400 font-mono">{user.email}</div>
                    {user.phone && <div className="text-[10px] text-zinc-500">{user.phone}</div>}
                  </td>
                  <td className="py-3.5 px-4">
                    <select
                      value={user.role}
                      onChange={(e) => handleUpdateRole(user.id, e.target.value as UserRole)}
                      className="bg-zinc-900 border border-zinc-700 rounded-lg px-2.5 py-1 text-xs text-cyan-300 font-mono capitalize focus:outline-none"
                    >
                      <option value="customer">customer</option>
                      <option value="agent">agent</option>
                      <option value="owner">owner</option>
                      <option value="developer">developer</option>
                      <option value="admin">admin</option>
                    </select>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-mono border ${
                        user.status === "active"
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                          : "bg-red-500/10 text-red-400 border-red-500/20"
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-zinc-400 text-[11px]">
                    {new Date(user.createdAt).toLocaleDateString("en-IN")}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    {user.status === "active" ? (
                      <button
                        onClick={() => handleUpdateStatus(user.id, "suspended")}
                        className="px-2.5 py-1 rounded-lg text-[11px] text-red-400 hover:bg-red-950/40 border border-red-900/40 transition-colors cursor-pointer"
                      >
                        Suspend
                      </button>
                    ) : (
                      <button
                        onClick={() => handleUpdateStatus(user.id, "active")}
                        className="px-2.5 py-1 rounded-lg text-[11px] text-emerald-400 hover:bg-emerald-950/40 border border-emerald-900/40 transition-colors cursor-pointer"
                      >
                        Activate
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
