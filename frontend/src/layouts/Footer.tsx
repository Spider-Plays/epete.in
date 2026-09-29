import { Link } from "react-router-dom";
import { Icon } from "../components/Icon";
import { BRAND } from "../constants/design";

const FOOTER_COLS = [
  {
    title: "SHOP",
    links: [
      { label: "Graphic Tees", to: "/shop" },
      { label: "Custom Prints", to: "/shop?search=Custom" },
      { label: "Bulk Orders", to: "/shop?search=Bulk" },
      { label: "New Arrivals", to: "/shop?sort=newest" },
    ],
  },
  {
    title: "CUSTOMER POLICIES",
    links: [
      { label: "Contact Us", to: "/account" },
      { label: "FAQ", to: "/account" },
      { label: "Returns", to: "/account" },
      { label: "Shipping", to: "/account" },
    ],
  },
];

const TRUST = [
  { icon: "verified", label: "100% Cotton" },
  { icon: "assignment_return", label: "Easy Returns" },
  { icon: "local_shipping", label: "Pan-India Delivery" },
  { icon: "lock", label: "Secure Payments" },
];

export function Footer() {
  return (
    <footer className="mt-space-3xl bg-surface-container-lowest border-t border-surface-container">
      <div className="bg-surface-container-low">
        <div className="max-w-7xl mx-auto px-4 md:px-margin-desktop py-space-xl grid grid-cols-2 md:grid-cols-4 gap-space-lg">
          {TRUST.map((item) => (
            <div key={item.label} className="flex items-center gap-space-sm">
              <div className="w-10 h-10 rounded-full bg-surface-container-lowest flex items-center justify-center text-primary shadow-card">
                <Icon name={item.icon} />
              </div>
              <span className="font-label text-label-md text-on-surface">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-margin-desktop py-space-2xl grid gap-space-xl md:grid-cols-4">
        <div>
          <Link to="/" className="inline-block" aria-label="E-Pete home">
            <img
              src={BRAND.logo}
              alt={`${BRAND.name} — ${BRAND.nameKannada}`}
              className="h-14 w-auto object-contain"
            />
          </Link>
          <p className="mt-space-sm font-body text-body-md text-on-surface-variant max-w-xs">
            Custom apparel from India. Graphic tees, made-to-order prints, bulk & group orders —
            wear what feels like you. {BRAND.tagline}
          </p>
        </div>
        {FOOTER_COLS.map((col) => (
          <div key={col.title}>
            <p className="font-label text-label-sm uppercase tracking-wider text-outline mb-space-sm">
              {col.title}
            </p>
            <ul className="space-y-space-xs">
              {col.links.map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className="font-body text-body-md text-on-surface-variant hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
        <div>
          <p className="font-label text-label-sm uppercase tracking-wider text-outline mb-space-sm">
            GET ALL THE LATEST DROPS
          </p>
          <form
            className="flex gap-space-xs"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="email"
              placeholder="Email address"
              className="flex-1 h-11 rounded-lg bg-surface-container-low border border-outline-variant/40 px-space-md text-body-sm outline-none focus:shadow-[0_0_0_2px_#e11f26]"
            />
            <button
              type="submit"
              className="h-11 px-space-md rounded-lg bg-primary text-on-primary font-label text-label-md font-bold hover:bg-primary-container transition-colors"
            >
              SIGN UP
            </button>
          </form>
          <a
            href={BRAND.instagram}
            target="_blank"
            rel="noreferrer"
            className="mt-space-md inline-flex items-center gap-space-xs font-label text-label-md text-on-surface-variant hover:text-primary"
          >
            <Icon name="photo_camera" />
            @epete.in
          </a>
        </div>
      </div>

      <div className="border-t border-surface-container px-4 md:px-margin-desktop py-space-md">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-space-sm">
          <p className="font-body text-body-sm text-outline">
            © {new Date().getFullYear()} E-PETE. All rights reserved. Made in India.
          </p>
          <div className="flex items-center gap-space-md text-on-surface-variant">
            <a href={BRAND.instagram} target="_blank" rel="noreferrer" aria-label="Instagram">
              <Icon name="photo_camera" />
            </a>
            <a href={BRAND.whatsapp} target="_blank" rel="noreferrer" aria-label="WhatsApp">
              <Icon name="chat" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
