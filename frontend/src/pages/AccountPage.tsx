import { Link, Navigate } from "react-router-dom";
import { Icon } from "../components/Icon";
import { useAuth } from "../hooks";
import { getInitials } from "../utils";

export function AccountPage() {
  const { user, isAuthenticated, logout } = useAuth();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-space-2xl">
      <h1 className="font-headline text-headline-lg mb-space-lg">My Account</h1>
      <div className="bg-surface-container-lowest rounded-xl shadow-card p-space-lg">
        <div className="flex items-center gap-space-md mb-space-lg">
          <div className="w-14 h-14 rounded-full bg-primary text-on-primary flex items-center justify-center font-headline text-headline-sm">
            {getInitials(user.name)}
          </div>
          <div>
            <p className="font-headline text-headline-sm">{user.name}</p>
            <p className="font-body text-body-sm text-on-surface-variant">{user.email}</p>
            {user.role === "admin" && (
              <span className="inline-block mt-1 px-2 py-0.5 rounded bg-tertiary/15 text-tertiary font-label text-label-sm font-bold">
                Admin
              </span>
            )}
          </div>
        </div>

        <div className="grid gap-space-sm">
          <Link
            to="/shop"
            className="flex items-center gap-space-sm p-space-md rounded-lg hover:bg-surface-container-low font-label text-label-md"
          >
            <Icon name="storefront" /> Continue shopping
          </Link>
          <Link
            to="/wishlist"
            className="flex items-center gap-space-sm p-space-md rounded-lg hover:bg-surface-container-low font-label text-label-md"
          >
            <Icon name="favorite" /> Wishlist
          </Link>
          <Link
            to="/cart"
            className="flex items-center gap-space-sm p-space-md rounded-lg hover:bg-surface-container-low font-label text-label-md"
          >
            <Icon name="shopping_bag" /> Bag
          </Link>
          {user.role === "admin" && (
            <>
              <Link
                to="/admin/products"
                className="flex items-center gap-space-sm p-space-md rounded-lg bg-primary/5 text-primary font-label text-label-md font-bold"
              >
                <Icon name="inventory_2" /> Manage products
              </Link>
              <Link
                to="/admin"
                className="flex items-center gap-space-sm p-space-md rounded-lg hover:bg-surface-container-low font-label text-label-md"
              >
                <Icon name="dashboard" /> Admin dashboard
              </Link>
            </>
          )}
          <button
            type="button"
            onClick={() => logout()}
            className="flex items-center gap-space-sm p-space-md rounded-lg hover:bg-error/10 text-error font-label text-label-md text-left"
          >
            <Icon name="logout" /> Sign out
          </button>
        </div>
      </div>
    </div>
  );
}
