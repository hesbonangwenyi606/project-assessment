import { useState } from "react";
import { X } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

export default function AuthModal({ mode, setMode, onClose }) {
  const { signup, login } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function switchMode(next) {
    setMode(next);
    setError("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (mode === "signup") {
        await signup(form.name.trim(), form.email.trim(), form.password);
      } else {
        await login(form.email.trim(), form.password);
      }
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-semibold text-[color:var(--ink)]">
            {mode === "signup" ? "Create your account" : "Sign in"}
          </h2>
          <button type="button" onClick={onClose}>
            <X size={20} color="var(--ink)" />
          </button>
        </div>

        <div className="mb-4 flex rounded-full border border-[color:var(--line)] p-1">
          <button
            type="button"
            onClick={() => switchMode("signin")}
            className={`flex-1 rounded-full py-1.5 text-sm font-semibold transition-colors ${
              mode === "signin" ? "bg-[color:var(--ink)] text-[color:var(--paper)]" : "text-[color:var(--ink)]"
            }`}
          >
            Sign in
          </button>
          <button
            type="button"
            onClick={() => switchMode("signup")}
            className={`flex-1 rounded-full py-1.5 text-sm font-semibold transition-colors ${
              mode === "signup" ? "bg-[color:var(--ink)] text-[color:var(--paper)]" : "text-[color:var(--ink)]"
            }`}
          >
            Sign up
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          {mode === "signup" && (
            <input
              required
              placeholder="Full name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="rounded-lg border border-[color:var(--line)] px-3 py-2 text-sm outline-none"
            />
          )}
          <input
            required
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="rounded-lg border border-[color:var(--line)] px-3 py-2 text-sm outline-none"
          />
          <input
            required
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="rounded-lg border border-[color:var(--line)] px-3 py-2 text-sm outline-none"
          />

          {error && <p className="text-sm text-[color:var(--coral)]">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="mt-1 w-full rounded-xl bg-[color:var(--ink)] py-3 text-sm font-semibold text-[color:var(--paper)] disabled:opacity-60"
          >
            {loading ? "Please wait..." : mode === "signup" ? "Create account" : "Sign in"}
          </button>
        </form>

        <p className="mt-3 text-center text-xs text-neutral-400">
          Real accounts — passwords are hashed and sessions are saved on your device.
        </p>
      </div>
    </div>
  );
}
