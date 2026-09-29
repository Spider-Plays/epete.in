import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BRAND } from "../constants/design";
import { useAuth } from "../hooks";

export function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email.trim(), password);
      navigate("/account", { replace: true });
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        (err as Error)?.message ||
        "Login failed. Check your email and password.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-space-2xl">
      <div className="text-center mb-space-xl">
        <img src={BRAND.logo} alt={BRAND.name} className="h-14 mx-auto object-contain" />
        <h1 className="mt-space-md font-headline text-headline-lg text-on-surface">Welcome back</h1>
        <p className="font-body text-body-md text-on-surface-variant">Sign in to your E-PETE account</p>
      </div>

      <form
        onSubmit={onSubmit}
        className="bg-surface-container-lowest rounded-xl shadow-card p-space-lg space-y-space-md"
      >
        {error && (
          <p className="rounded-lg bg-error/10 text-error font-body text-body-sm px-space-md py-space-sm">
            {error}
          </p>
        )}
        <div>
          <label className="block font-label text-label-md text-on-surface mb-space-xs" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full h-11 rounded-lg border border-outline-variant/50 px-space-md font-body text-body-sm outline-none focus:shadow-[0_0_0_2px_#e11f26]"
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label className="block font-label text-label-md text-on-surface mb-space-xs" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full h-11 rounded-lg border border-outline-variant/50 px-space-md font-body text-body-sm outline-none focus:shadow-[0_0_0_2px_#e11f26]"
            placeholder="••••••••"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full h-12 rounded-lg bg-primary text-on-primary font-label text-label-lg font-bold hover:bg-primary-container disabled:opacity-60"
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>
        <p className="text-center font-body text-body-sm text-on-surface-variant">
          New here?{" "}
          <Link to="/register" className="text-primary font-bold hover:underline">
            Create an account
          </Link>
        </p>
        <p className="text-center font-body text-body-sm text-outline">
          Admin demo: admin@epete.in / Admin123!
        </p>
      </form>
    </div>
  );
}
