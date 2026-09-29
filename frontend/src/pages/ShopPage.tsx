import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Icon } from "../components/Icon";
import { ProductCard } from "../components/ProductCard";
import { useProducts } from "../hooks";
import { Product } from "../types";

const FILTER_CATEGORIES = [
  "T-shirts & Polos",
  "Shirts & Blouses",
  "Crop Tops",
  "Everyday Hoodies",
  "Tank Tops",
];

export function ShopPage() {
  const [params] = useSearchParams();
  const search = params.get("search") || "";
  const category = params.get("category") || "";
  const [sort, setSort] = useState("recommended");
  const { productsData, isLoading, error } = useProducts();

  const products = useMemo(() => {
    let list = ([...(productsData as Product[] | undefined)] || []) as Product[];
    const q = search.toLowerCase();
    if (q) {
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category?.name?.toLowerCase().includes(q) ||
          p.brand?.name?.toLowerCase().includes(q)
      );
    }
    if (category) {
      list = list.filter((p) => p.category?.slug === category);
    }
    if (sort === "price-asc") list.sort((a, b) => a.basePrice - b.basePrice);
    if (sort === "price-desc") list.sort((a, b) => b.basePrice - a.basePrice);
    if (sort === "newest") list.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
    return list;
  }, [productsData, search, category, sort]);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-margin-desktop pb-space-3xl">
      <section className="py-space-md bg-surface-bright/70 rounded-xl mb-space-lg shadow-sm">
        <div className="flex flex-col gap-space-sm px-space-md">
          <nav className="flex items-center gap-space-xs font-label text-label-sm text-outline">
            <Link to="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <Icon name="chevron_right" className="text-[13px]" />
            <span className="text-on-surface font-semibold">
              {category ? category.toUpperCase() : "Shop"}
            </span>
          </nav>
          <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-space-xs">
            <div className="flex items-baseline gap-space-sm flex-wrap">
              <h1 className="font-headline text-headline-lg tracking-tight text-on-surface uppercase">
                Everyday Graphic Tees & Custom Prints
              </h1>
              <span className="font-body text-body-md text-outline font-medium tracking-wide">
                ({products.length} Items found)
              </span>
            </div>
            <div className="inline-flex items-center gap-space-2xs bg-surface-container-high px-space-sm py-space-2xs rounded-full">
              <span className="inline-block w-2 h-2 rounded-full bg-tertiary animate-pulse" />
              <span className="font-label text-label-sm text-tertiary">Live catalog</span>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-space-md pt-space-xs">
            <div className="flex items-center gap-space-xs flex-wrap">
              <span className="font-label text-label-sm uppercase text-outline mr-space-2xs">
                Active Filters:
              </span>
              {search && (
                <span className="inline-flex items-center gap-space-2xs bg-surface-container px-space-sm py-1 rounded-full font-label text-label-md">
                  {search}
                </span>
              )}
              {category && (
                <span className="inline-flex items-center gap-space-2xs bg-surface-container px-space-sm py-1 rounded-full font-label text-label-md">
                  {category}
                </span>
              )}
              {!search && !category && (
                <span className="font-body text-body-sm text-outline">None</span>
              )}
            </div>
            <div className="relative inline-flex items-center ml-auto">
              <label className="font-label text-label-md text-outline mr-space-xs hidden sm:inline" htmlFor="sortDropdown">
                Sort by:
              </label>
              <div className="relative bg-surface-container-lowest rounded-lg shadow-sm">
                <select
                  id="sortDropdown"
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="appearance-none bg-transparent pl-space-sm pr-space-xl py-space-xs font-label text-label-md text-on-surface outline-none cursor-pointer"
                >
                  <option value="recommended">Recommended</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="newest">Newest First</option>
                </select>
                <Icon
                  name="expand_more"
                  className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-outline text-[18px]"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter-desktop items-start">
        <aside className="hidden lg:block lg:col-span-3 sticky top-44 bg-surface-container-lowest p-space-md rounded-xl shadow-sm max-h-[calc(100vh-12rem)] overflow-y-auto">
          <div className="flex items-center justify-between pb-space-sm mb-space-sm bg-surface-container-low px-space-xs py-space-xs rounded-lg">
            <span className="font-headline text-headline-sm uppercase tracking-wide text-on-surface">
              Filters
            </span>
            <Link to="/shop" className="font-label text-label-sm text-primary font-bold uppercase tracking-wider">
              Reset All
            </Link>
          </div>
          <div className="py-space-sm">
            <span className="font-label text-label-lg font-bold text-on-surface">Category</span>
            <div className="mt-space-xs flex flex-col gap-space-2xs">
              {FILTER_CATEGORIES.map((name) => (
                <label
                  key={name}
                  className="flex items-center justify-between text-body-md font-body text-on-surface hover:text-primary cursor-pointer select-none"
                >
                  <span className="flex items-center gap-space-xs">
                    <input type="checkbox" className="w-4 h-4 rounded accent-primary" readOnly />
                    <span>{name}</span>
                  </span>
                </label>
              ))}
            </div>
          </div>
          <div className="py-space-sm mt-space-xs border-t border-surface-container">
            <div className="flex items-center justify-between mb-space-xs">
              <span className="font-label text-label-lg font-bold text-on-surface">Price Range</span>
              <span className="font-label text-label-md text-primary font-bold">₹499 - ₹999</span>
            </div>
            <div className="grid grid-cols-2 gap-space-xs mt-space-sm">
              {["Under ₹499", "₹500-₹699", "₹700-₹899", "₹900+"].map((chip) => (
                <button
                  key={chip}
                  type="button"
                  className="h-8 rounded-full border border-outline-variant/50 font-label text-label-md text-on-surface-variant hover:border-primary hover:text-primary transition-colors"
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>
        </aside>

        <div className="lg:col-span-9">
          {isLoading && (
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
            </div>
          )}
          {error && (
            <p className="text-error text-center py-12">{(error as Error).message}</p>
          )}
          {!isLoading && !error && products.length === 0 && (
            <p className="text-center py-20 font-body text-body-md text-on-surface-variant">
              No products match these filters.
            </p>
          )}
          {!isLoading && products.length > 0 && (
            <div className="grid grid-cols-2 xl:grid-cols-3 gap-space-md md:gap-gutter-desktop">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
