import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BRAND } from "../constants/design";
import { useAuth } from "../hooks";

export function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register({
        name: name.trim(),
        email: email.trim(),
        password,
        phone: phone.trim() || undefined,
      });
      navigate("/account", { replace: true });
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        (err as Error)?.message ||
        "Could not create account. Try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-space-2xl">
      <div className="text-center mb-space-xl">
        <img src={BRAND.logo} alt={BRAND.name} className="h-14 mx-auto object-contain" />
        <h1 className="mt-space-md font-headline text-headline-lg text-on-surface">Create account</h1>
        <p className="font-body text-body-md text-on-surface-variant">Join E-PETE — wear what feels like you</p>
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
          <label className="block font-label text-label-md text-on-surface mb-space-xs" htmlFor="name">
            Full name
          </label>
          <input
            id="name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full h-11 rounded-lg border border-outline-variant/50 px-space-md font-body text-body-sm outline-none focus:shadow-[0_0_0_2px_#e11f26]"
            placeholder="Your name"
          />
        </div>
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
          <label className="block font-label text-label-md text-on-surface mb-space-xs" htmlFor="phone">
            Phone (optional)
          </label>
          <input
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full h-11 rounded-lg border border-outline-variant/50 px-space-md font-body text-body-sm outline-none focus:shadow-[0_0_0_2px_#e11f26]"
            placeholder="+91 …"
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
            placeholder="At least 6 characters"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full h-12 rounded-lg bg-primary text-on-primary font-label text-label-lg font-bold hover:bg-primary-container disabled:opacity-60"
        >
          {loading ? "Creating…" : "Sign up"}
        </button>
        <p className="text-center font-body text-body-sm text-on-surface-variant">
          Already have an account?{" "}
          <Link to="/login" className="text-primary font-bold hover:underline">
            Sign in
          </Link>
        </p>
      </form>
    </div>
  );
}
