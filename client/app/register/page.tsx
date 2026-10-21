"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import type { User } from "@/lib/types";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { data } = await api.post<{
        token: string;
        user: User;
      }>("/auth/register", form);

      localStorage.setItem("stadthelfer_token", data.token);
      localStorage.setItem("stadthelfer_user", JSON.stringify(data.user));

      router.push("/");
    } catch {
      setError("Registration failed. Try another email.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto max-w-md space-y-4 rounded-xl bg-white p-6 shadow-sm"
    >
      <h1 className="text-xl font-bold">Create account</h1>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <input
        value={form.name}
        onChange={(event) =>
          setForm({ ...form, name: event.target.value })
        }
        placeholder="Full name"
        className="w-full rounded-lg border px-3 py-2 text-sm"
        required
      />

      <input
        type="email"
        value={form.email}
        onChange={(event) =>
          setForm({ ...form, email: event.target.value })
        }
        placeholder="Email"
        className="w-full rounded-lg border px-3 py-2 text-sm"
        required
      />

      <input
        type="password"
        value={form.password}
        onChange={(event) =>
          setForm({ ...form, password: event.target.value })
        }
        placeholder="Password"
        className="w-full rounded-lg border px-3 py-2 text-sm"
        required
      />

      <select
        value={form.role}
        onChange={(event) =>
          setForm({ ...form, role: event.target.value })
        }
        className="w-full rounded-lg border px-3 py-2 text-sm"
      >
        <option value="user">I want to find services</option>
        <option value="provider">I want to offer services</option>
      </select>

      <button
        disabled={loading}
        className="w-full rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white disabled:opacity-50"
      >
        {loading ? "Creating account..." : "Register"}
      </button>
    </form>
  );
}