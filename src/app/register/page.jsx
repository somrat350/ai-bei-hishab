"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email: email.toLowerCase(), password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Registration failed");
      }

      // Automatically log in the user
      const result = await signIn("credentials", {
        redirect: false,
        email: email.toLowerCase(),
        password,
      });

      if (result?.error) {
        setError("Account created, but sign in failed. Please login manually.");
        router.push("/login");
      } else {
        router.push("/dashboard");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-base-200 to-base-300 p-4">
      <div className="card w-full max-w-md bg-base-100 shadow-2xl border border-base-content/10">
        <div className="card-body">
          <h2 className="card-title text-3xl font-bold justify-center text-primary mb-2">
            Create an Account
          </h2>
          <p className="text-center text-sm text-base-content/70 mb-6">
            Start managing your budget with AI Bei Hishab
          </p>

          {error && (
            <div className="alert alert-error mb-4 shadow-sm py-2">
              <span className="text-sm font-medium">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Full Name</span>
              </label>
              <input
                type="text"
                placeholder="John Doe"
                className="input input-bordered w-full focus:input-primary"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Email Address</span>
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                className="input input-bordered w-full focus:input-primary"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Password</span>
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className="input input-bordered w-full focus:input-primary"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="form-control mt-6">
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary w-full shadow-lg"
              >
                {loading ? (
                  <span className="loading loading-spinner"></span>
                ) : (
                  "Register"
                )}
              </button>
            </div>
          </form>

          <div className="divider my-6 text-xs text-base-content/40">OR</div>

          <p className="text-center text-sm">
            Already have an account?{" "}
            <Link href="/login" className="link link-primary font-semibold">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
