"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";

function LoginFormContent() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const registered = searchParams.get("registered");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: email.toLowerCase(),
        password,
      });

      if (result?.error) {
        throw new Error(result.error || "Failed to sign in");
      }

      router.push("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card w-full max-w-md bg-base-100 shadow-2xl border border-base-content/10">
      <div className="card-body">
        <h2 className="card-title text-3xl font-bold justify-center text-primary mb-2">
          Welcome Back
        </h2>
        <p className="text-center text-sm text-base-content/70 mb-6">
          Log in to manage your budget with AI Bei Hishab
        </p>

        {registered && (
          <div className="alert alert-success mb-4 shadow-sm py-2">
            <span className="text-sm font-medium">
              Registration successful! Please log in below.
            </span>
          </div>
        )}

        {error && (
          <div className="alert alert-error mb-4 shadow-sm py-2">
            <span className="text-sm font-medium">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
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
            <label className="label flex justify-between">
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
                "Login"
              )}
            </button>
          </div>
        </form>

        <div className="divider my-6 text-xs text-base-content/40">OR</div>

        <p className="text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="link link-primary font-semibold">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-base-200 to-base-300 p-4">
      <Suspense
        fallback={
          <div className="card w-full max-w-md bg-base-100 shadow-2xl border border-base-content/10">
            <div className="card-body items-center justify-center py-20">
              <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
          </div>
        }
      >
        <LoginFormContent />
      </Suspense>
    </div>
  );
}
