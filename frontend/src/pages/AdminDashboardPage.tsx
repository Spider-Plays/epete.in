import { Link, Navigate } from "react-router-dom";
import { Icon } from "../components/Icon";
import { useAuth } from "../hooks";

export function AdminDashboardPage() {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user?.role !== "admin") {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <h1 className="font-headline text-headline-lg">Admin only</h1>
        <Link to="/" className="inline-block mt-4 text-primary font-bold">
          Back home
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-margin-desktop pb-space-3xl py-space-lg">
      <h1 className="font-headline text-headline-lg mb-space-xs">Admin Dashboard</h1>
      <p className="font-body text-body-md text-on-surface-variant mb-space-xl">
        Manage E-PETE store operations
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md">
        <Link
          to="/admin/products"
          className="bg-surface-container-lowest rounded-xl shadow-card p-space-lg hover:shadow-hover transition-shadow"
        >
          <div className="w-12 h-12 rounded-xl bg-primary text-on-primary flex items-center justify-center mb-space-md">
            <Icon name="inventory_2" className="text-[28px]" />
          </div>
          <h2 className="font-headline text-headline-sm">Products</h2>
          <p className="mt-1 font-body text-body-sm text-on-surface-variant">
            List new products and edit existing ones
          </p>
        </Link>
        <Link
          to="/shop"
          className="bg-surface-container-lowest rounded-xl shadow-card p-space-lg hover:shadow-hover transition-shadow"
        >
          <div className="w-12 h-12 rounded-xl bg-secondary text-on-secondary flex items-center justify-center mb-space-md">
            <Icon name="storefront" className="text-[28px]" />
          </div>
          <h2 className="font-headline text-headline-sm">View storefront</h2>
          <p className="mt-1 font-body text-body-sm text-on-surface-variant">
            Preview the shop as customers see it
          </p>
        </Link>
        <Link
          to="/account"
          className="bg-surface-container-lowest rounded-xl shadow-card p-space-lg hover:shadow-hover transition-shadow"
        >
          <div className="w-12 h-12 rounded-xl bg-tertiary text-on-tertiary flex items-center justify-center mb-space-md">
            <Icon name="person" className="text-[28px]" />
          </div>
          <h2 className="font-headline text-headline-sm">Account</h2>
          <p className="mt-1 font-body text-body-sm text-on-surface-variant">
            Signed in as {user.email}
          </p>
        </Link>
      </div>
    </div>
  );
}
