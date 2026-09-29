import { Link } from "react-router-dom";
import { Icon } from "../components/Icon";
import { ProductList } from "../components/ProductList";
import { BRAND, FREE_SHIPPING_THRESHOLD, HERO_IMAGE, MOOD_LOOKS, SHOP_CATEGORIES } from "../constants/design";
import { formatPrice } from "../utils";

export function HomePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 md:px-margin-desktop pb-space-3xl">
      <section className="relative w-full rounded-2xl overflow-hidden bg-gradient-to-br from-surface-container-low via-surface-container to-surface-bright shadow-md mb-space-3xl">
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-primary-fixed/40 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-secondary-fixed/50 blur-3xl pointer-events-none" />
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-space-xl p-space-xl lg:p-space-3xl items-center">
          <div className="lg:col-span-7 flex flex-col items-start space-y-space-md">
            <div className="flex flex-wrap items-center gap-space-xs">
              <span className="inline-flex items-center gap-space-2xs bg-primary text-on-primary font-label text-label-sm uppercase px-space-sm py-1 rounded-full shadow-sm">
                <Icon name="bolt" className="text-[14px]" /> CUSTOM APPAREL · MADE TO ORDER
              </span>
              <span className="bg-surface-container-lowest text-on-surface font-label text-label-sm uppercase px-space-sm py-1 rounded-full shadow-sm">
                CODE: <strong className="text-primary font-black">EPETE15</strong>
              </span>
              <span className="bg-tertiary-container text-on-tertiary-container font-label text-label-sm uppercase px-space-sm py-1 rounded-full shadow-sm inline-flex items-center gap-1">
                <Icon name="local_shipping" className="text-[13px]" /> FREE SHIPPING OVER{" "}
                {formatPrice(FREE_SHIPPING_THRESHOLD)}
              </span>
            </div>
            <div className="space-y-space-2xs">
              <div className="font-label text-label-md uppercase tracking-widest text-on-surface-variant font-bold">
                {BRAND.tagline} · GRAPHIC TEES · CUSTOM PRINTS
              </div>
              <h1 className="font-display text-[2rem] leading-tight sm:text-display-xl text-on-surface tracking-tight uppercase">
                T-SHIRTS MADE <span className="text-primary">YOUR WAY</span>
                <br />
                <span className="text-on-surface">ಕನ್ನಡ</span>{" "}
                <span className="text-tertiary-container">PRIDE</span> PRINTS
              </h1>
            </div>
            <p className="font-body text-body-lg text-on-surface-variant max-w-xl">
              E-PETE (ಇ-ಪೇಟೆ) — 100% cotton, 180 GSM unisex tees with Kannada culture graphics:
              Baarisu, Hampi, Bettada Jeeva, Nagu Naguta, and custom prints made for you.
            </p>
            <div className="flex flex-wrap items-center gap-space-md pt-space-xs">
              <Link
                to="/shop"
                className="bg-primary text-on-primary font-label text-label-lg font-bold px-space-xl py-3.5 rounded-lg shadow-md hover:bg-primary-container hover:shadow-xl transition-all transform hover:-translate-y-0.5 inline-flex items-center gap-space-xs"
              >
                <span>SHOP GRAPHIC TEES</span>
                <Icon name="arrow_forward" className="text-[18px]" />
              </Link>
              <a
                href={BRAND.whatsapp}
                target="_blank"
                rel="noreferrer"
                className="bg-surface-container-lowest text-on-surface font-label text-label-lg font-bold px-space-xl py-3.5 rounded-lg shadow-sm hover:bg-surface-container-high transition-all inline-flex items-center gap-space-xs"
              >
                <span>CUSTOM / BULK ON WHATSAPP</span>
                <Icon name="north_east" className="text-[18px]" />
              </a>
            </div>
            <div className="flex items-center gap-space-md pt-space-sm">
              <img
                src={BRAND.logo}
                alt=""
                className="w-10 h-10 rounded-full object-cover shadow-sm"
              />
              <div className="font-body text-body-sm text-on-surface-variant">
                <span className="font-bold text-on-surface">100% cotton · 180 GSM</span> — soft,
                breathable tees for every mood, moment and mission.
              </div>
            </div>
          </div>
          <div className="lg:col-span-5 relative">
            <div className="relative w-full aspect-[4/5] rounded-xl overflow-hidden shadow-xl bg-surface-container-lowest">
              <img className="w-full h-full object-cover" src={HERO_IMAGE} alt="E-PETE mustard graphic tee" />
              <div className="absolute inset-0 bg-gradient-to-t from-inverse-surface/60 via-transparent to-transparent" />
              <div className="absolute bottom-space-md left-space-md right-space-md bg-surface-container-lowest/90 backdrop-blur-md p-space-md rounded-lg shadow-md flex items-center justify-between">
                <div>
                  <div className="font-label text-label-sm uppercase tracking-wider text-primary font-bold">
                    READY-TO-WEAR DROP
                  </div>
                  <div className="font-headline text-headline-sm text-on-surface font-bold">
                    Everyday Graphic Tees
                  </div>
                  <div className="font-body text-body-sm text-on-surface-variant">
                    From {formatPrice(649)} · 100% Cotton · 180 GSM
                  </div>
                </div>
                <Link
                  to="/shop"
                  className="w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-md hover:scale-105 transition-transform"
                >
                  <Icon name="shopping_bag" className="text-[20px]" />
                </Link>
              </div>
            </div>
            <div className="absolute -top-4 -left-4 bg-secondary text-on-secondary p-space-sm rounded-lg shadow-lg hidden sm:flex items-center gap-space-xs">
              <Icon name="auto_awesome" className="text-[22px]" />
              <div>
                <div className="font-label text-label-sm leading-none font-bold">100% COTTON</div>
                <div className="font-label text-label-sm text-secondary-fixed leading-none">
                  180 GSM EVERYDAY
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full mb-space-3xl">
        <div className="flex items-end justify-between mb-space-lg gap-space-md">
          <div>
            <div className="font-label text-label-sm uppercase text-primary font-bold tracking-wider">
              WHAT&apos;S AT E-PETE
            </div>
            <h2 className="font-headline text-headline-lg text-on-surface font-bold">Shop by Category</h2>
          </div>
          <Link
            to="/shop"
            className="font-label text-label-lg text-primary hover:text-primary-container font-bold inline-flex items-center gap-1 transition-colors shrink-0"
          >
            <span className="hidden sm:inline">Explore All Tees</span>
            <span className="sm:hidden">All</span>
            <Icon name="chevron_right" className="text-[16px]" />
          </Link>
        </div>
        <div className="grid grid-cols-4 md:grid-cols-8 gap-space-md">
          {SHOP_CATEGORIES.map((cat) => (
            <Link key={cat.slug} to={`/shop?search=${encodeURIComponent(cat.name)}`} className="group flex flex-col items-center text-center">
              <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-full p-1 bg-gradient-to-tr from-primary to-secondary group-hover:scale-105 transition-transform duration-300 shadow-sm">
                <div className="w-full h-full rounded-full overflow-hidden bg-surface-container-lowest">
                  <img
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    src={cat.image}
                    alt={cat.name}
                  />
                </div>
                {cat.badge && (
                  <span className="absolute -bottom-1 -right-1 bg-primary text-on-primary font-label text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase shadow-sm">
                    {cat.badge}
                  </span>
                )}
              </div>
              <span className="mt-space-xs font-label text-label-md text-on-surface font-semibold group-hover:text-primary transition-colors">
                {cat.name}
              </span>
            </Link>
          ))}
          <Link to="/shop?sort=sale" className="group flex flex-col items-center text-center">
            <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-full p-1 bg-primary group-hover:scale-105 transition-transform duration-300 shadow-md">
              <div className="w-full h-full rounded-full bg-primary-container flex flex-col items-center justify-center text-on-primary">
                <Icon name="local_fire_department" className="text-[24px]" />
                <span className="font-headline text-headline-sm font-black tracking-tight leading-none">
                  ₹499
                </span>
              </div>
            </div>
            <span className="mt-space-xs font-label text-label-md text-primary font-bold">
              Under ₹499
            </span>
          </Link>
        </div>
      </section>

      <section className="w-full p-space-xl rounded-2xl bg-surface-container-low shadow-sm mb-space-3xl relative overflow-hidden">
        <div className="absolute top-0 right-1/4 w-72 h-72 bg-primary-fixed/30 rounded-full blur-3xl pointer-events-none" />
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-space-md mb-space-xl">
          <div className="flex items-center gap-space-md">
            <div className="w-12 h-12 rounded-xl bg-primary text-on-primary flex items-center justify-center shadow-md">
              <Icon name="timer" className="text-[28px]" />
            </div>
            <div>
              <div className="font-label text-label-sm uppercase text-primary font-bold tracking-widest">
                LIMITED DROP · MADE TO ORDER
              </div>
              <h2 className="font-headline text-headline-lg text-on-surface font-bold">
                Featured Graphic Tees
              </h2>
            </div>
          </div>
          <div className="flex items-center gap-space-xs bg-surface-container-lowest px-space-md py-space-xs rounded-xl shadow-sm">
            <span className="font-label text-label-sm uppercase text-on-surface-variant font-bold mr-space-xs">
              ENDS IN:
            </span>
            {["04", "32", "07"].map((unit, idx) => (
              <div key={unit} className="flex items-center gap-space-xs">
                <span className="min-w-10 text-center bg-on-surface text-surface-bright font-headline text-headline-sm px-space-sm py-1 rounded-lg">
                  {unit}
                </span>
                {idx < 2 && <span className="font-bold text-on-surface">:</span>}
              </div>
            ))}
          </div>
        </div>
        <ProductList limit={4} badge="FEATURED" />
      </section>

      <section className="w-full mb-space-3xl">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-space-md mb-space-lg">
          <div>
            <div className="font-label text-label-sm uppercase text-secondary font-bold tracking-wider">
              MORE THAN A T-SHIRT
            </div>
            <h2 className="font-headline text-headline-lg text-on-surface font-bold">
              Shop the full collection
            </h2>
            <p className="mt-space-xs font-body text-body-md text-on-surface-variant max-w-xl">
              Every design comes in S–XXL and Red, Olive, Black &amp; Navy — pick colour on the product page.
            </p>
          </div>
          <Link
            to="/shop"
            className="font-label text-label-lg text-primary hover:text-primary-container font-bold inline-flex items-center gap-1 transition-colors shrink-0"
          >
            View all products
            <Icon name="arrow_forward" className="text-[16px]" />
          </Link>
        </div>
      </section>

      <section className="w-full mb-space-3xl">
        <div className="mb-space-lg">
          <div className="font-label text-label-sm uppercase text-primary font-bold tracking-wider">
            WHY E-PETE
          </div>
          <h2 className="font-headline text-headline-lg text-on-surface font-bold">
            Shop by Mood & Mission
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md">
          {MOOD_LOOKS.map((look) => (
            <Link
              key={look.title}
              to="/shop"
              className="relative aspect-[3/4] rounded-2xl overflow-hidden group shadow-card"
            >
              <img
                src={look.image}
                alt={look.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-inverse-surface/80 via-inverse-surface/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-space-lg">
                <h3 className="font-headline text-headline-sm text-surface-bright font-bold">
                  {look.title}
                </h3>
                <span className="inline-block mt-space-xs font-label text-label-md text-surface-bright underline underline-offset-4">
                  {look.cta}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
