import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Icon } from "../components/Icon";
import { BRAND, CATEGORY_CHIPS, FREE_SHIPPING_THRESHOLD, NAV_LINKS } from "../constants/design";
import { useAuth } from "../hooks";
import { useCartStore } from "../store/cartStore";
import { useWishlistStore } from "../store/wishlistStore";
import { formatPrice } from "../utils";

export function Header() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [query, setQuery] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const totalItems = useCartStore((s) => s.totalItems);
  const totalPrice = useCartStore((s) => s.totalPrice);
  const wishlistCount = useWishlistStore((s) => s.items.length);

  const onSearch = (e: FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    navigate(q ? `/shop?search=${encodeURIComponent(q)}` : "/shop");
    setMobileOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-surface-container-lowest/95 backdrop-blur-md shadow-header">
      <div className="bg-on-surface text-surface-bright py-space-xs px-4 md:px-margin-desktop">
        <div className="max-w-7xl mx-auto flex items-center justify-between font-label text-label-sm">
          <div className="flex items-center gap-space-sm overflow-hidden">
            <span className="inline-block w-2 h-2 rounded-full bg-primary-container animate-pulse shrink-0" />
            <span className="truncate">
              FREE SHIPPING ON ORDERS OVER {formatPrice(FREE_SHIPPING_THRESHOLD)} | CUSTOM & BULK
              PRINTS · DM US | CODE: <strong className="text-primary-fixed">EPETE15</strong>
            </span>
          </div>
          <div className="hidden md:flex items-center gap-space-lg shrink-0">
            <button type="button" className="flex items-center gap-space-2xs text-surface-variant hover:text-surface-bright transition-colors">
              <span>INR / EN</span>
              <Icon name="expand_more" className="text-[14px]" />
            </button>
            <a
              href={BRAND.whatsapp}
              target="_blank"
              rel="noreferrer"
              className="text-surface-variant hover:text-surface-bright transition-colors"
            >
              WhatsApp {BRAND.phoneDisplay}
            </a>
          </div>
        </div>
      </div>

      <div className="h-16 md:h-20 max-w-7xl mx-auto px-4 md:px-margin-desktop flex items-center justify-between gap-space-lg">
        <div className="flex items-center gap-space-xl min-w-0">
          <Link to="/" className="flex items-center shrink-0" aria-label="E-Pete home">
            <img
              src={BRAND.logo}
              alt={`${BRAND.name} — ${BRAND.nameKannada}`}
              className="h-11 md:h-14 w-auto object-contain"
            />
          </Link>
          <nav className="hidden lg:flex items-center gap-space-md">
            {NAV_LINKS.map((link) => (
              <div key={link.label} className="relative flex items-center">
                <Link
                  to={link.to}
                  className="font-label text-label-lg px-space-sm py-space-xs text-on-surface-variant hover:text-on-surface transition-colors"
                >
                  {link.label}
                </Link>
                {link.badge && (
                  <span
                    className={`absolute -top-1.5 right-0 font-label text-[9px] px-1 py-0.5 rounded-full font-bold leading-none pointer-events-none ${
                      link.badgeTone === "primary"
                        ? "bg-primary-container text-on-primary"
                        : "bg-surface-container-high text-secondary"
                    }`}
                  >
                    {link.badge}
                  </span>
                )}
              </div>
            ))}
          </nav>
        </div>

        <form onSubmit={onSearch} className="flex-1 max-w-md hidden md:block">
          <div className="relative flex items-center bg-surface-container-low rounded-full px-space-md py-space-xs focus-within:bg-surface-container-lowest focus-within:shadow-[0_0_0_2px_#e11f26] transition-all">
            <Icon name="search" className="text-outline mr-space-sm" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-transparent border-0 outline-none font-body text-body-sm text-on-surface placeholder:text-outline"
              placeholder="Search graphic tees, custom prints, Hampi..."
              type="search"
            />
          </div>
        </form>

        <div className="flex items-center gap-space-sm md:gap-space-lg">
          <Link to="/wishlist" className="relative p-space-xs text-on-surface-variant hover:text-primary transition-colors">
            <Icon name="favorite" className="text-[24px]" />
            {wishlistCount > 0 && (
              <span className="absolute top-0 right-0 w-4 h-4 rounded-full bg-primary text-on-primary font-label text-[10px] flex items-center justify-center font-bold leading-none">
                {wishlistCount}
              </span>
            )}
          </Link>
          <Link to="/cart" className="flex items-center gap-space-xs p-space-xs text-on-surface-variant hover:text-on-surface transition-colors">
            <div className="relative">
              <Icon name="shopping_bag" className="text-[24px]" />
              {totalItems > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 rounded-full bg-primary text-on-primary font-label text-[10px] flex items-center justify-center font-bold leading-none">
                  {totalItems}
                </span>
              )}
            </div>
            <span className="hidden xl:block font-headline text-price-headline text-on-surface">
              {formatPrice(totalPrice)}
            </span>
          </Link>
          <Link to="/account" className="hidden sm:flex items-center gap-space-xs text-on-surface-variant hover:text-on-surface">
            <Icon name="person" className="text-[24px]" />
            <span className="hidden xl:block font-label text-label-md text-on-surface">
              {isAuthenticated ? user?.name?.split(" ")[0] || "Account" : "Account"}
            </span>
          </Link>
          {isAuthenticated && user?.role === "admin" ? (
            <Link
              to="/admin/products"
              className="hidden md:inline-flex items-center font-label text-label-md text-primary font-bold hover:underline"
            >
              Admin
            </Link>
          ) : !isAuthenticated ? (
            <Link
              to="/login"
              className="hidden md:inline-flex items-center font-label text-label-md text-on-surface-variant hover:text-primary"
            >
              Sign in
            </Link>
          ) : null}
          <button
            type="button"
            className="lg:hidden p-space-xs text-on-surface-variant"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            <Icon name={mobileOpen ? "close" : "menu"} className="text-[24px]" />
          </button>
        </div>
      </div>

      <div className="bg-surface-container-low/70 py-space-xs px-4 md:px-margin-desktop hidden sm:block">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-space-xl overflow-x-auto text-center">
          {CATEGORY_CHIPS.map((chip) => (
            <Link
              key={chip}
              to={`/shop?search=${encodeURIComponent(chip)}`}
              className="font-label text-label-sm text-on-surface-variant hover:text-on-surface whitespace-nowrap transition-colors"
            >
              {chip}
            </Link>
          ))}
        </div>
      </div>

      {mobileOpen && (
        <div className="lg:hidden border-t border-surface-container bg-surface-container-lowest px-4 py-space-md space-y-space-sm">
          <form onSubmit={onSearch} className="md:hidden">
            <div className="flex items-center bg-surface-container-low rounded-full px-space-md py-space-sm">
              <Icon name="search" className="text-outline mr-space-sm" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-transparent outline-none text-body-sm"
                placeholder="Search products..."
              />
            </div>
          </form>
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              onClick={() => setMobileOpen(false)}
              className="block font-label text-label-lg py-space-xs text-on-surface"
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
