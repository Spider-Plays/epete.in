import { Link } from "react-router-dom";
import { Icon } from "./Icon";
import { useCartStore } from "../store/cartStore";
import { useWishlistStore } from "../store/wishlistStore";
import { Product } from "../types";
import { formatPrice } from "../utils";

interface ProductCardProps {
  product: Product;
  badge?: string;
}

export function ProductCard({ product, badge }: ProductCardProps) {
  const addToCart = useCartStore((s) => s.addItem);
  const wishlistItems = useWishlistStore((s) => s.items);
  const addWishlist = useWishlistStore((s) => s.addItem);
  const removeWishlist = useWishlistStore((s) => s.removeItem);

  const primaryImage = product.images.find((img) => img.isPrimary) || product.images[0];
  const variant = product.variants[0];
  const price = variant?.price ?? product.basePrice;
  const compareAt = Math.round(price * 1.6 * 100) / 100;
  const discount = Math.round(((compareAt - price) / compareAt) * 100);
  const inWishlist = wishlistItems.some((item) => item.productId === product.id);
  const colors = Array.from(new Set(product.variants.map((v) => v.color)));
  const sizes = Array.from(new Set(product.variants.map((v) => v.size))).slice(0, 5);

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    if (inWishlist) {
      removeWishlist(product.id);
    } else {
      addWishlist({
        productId: product.id,
        name: product.name,
        price,
        image: primaryImage?.url || "",
      });
    }
  };

  const quickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart({
      productId: product.id,
      name: product.name,
      price,
      quantity: 1,
      image: primaryImage?.url || "",
      size: variant?.size,
      color: variant?.color,
    });
  };

  return (
    <article className="group bg-surface-container-lowest rounded-2xl border border-[#F1F3F5] shadow-card hover:shadow-hover transition-all overflow-hidden">
      <div className="relative aspect-[4/5] overflow-hidden bg-surface-container-low">
        <Link to={`/product/${product.id}`}>
          <img
            src={primaryImage?.url || "/images/brand/logo.jpg"}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </Link>
        <div className="absolute top-space-sm left-space-sm flex flex-col gap-space-2xs">
          {(badge || product.isFeatured) && (
            <span className="bg-on-surface text-surface-bright font-label text-label-sm px-space-sm py-1 rounded-full uppercase">
              {badge || "BESTSELLER"}
            </span>
          )}
          <span className="bg-tertiary text-on-tertiary font-label text-label-sm px-space-sm py-1 rounded-full uppercase">
            {discount}% OFF
          </span>
        </div>
        <button
          type="button"
          onClick={toggleWishlist}
          className="absolute top-space-sm right-space-sm w-9 h-9 rounded-full bg-surface-container-lowest/90 shadow-card flex items-center justify-center hover:scale-105 transition-transform"
          aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Icon name="favorite" filled={inWishlist} className={inWishlist ? "text-primary" : "text-outline"} />
        </button>
        {sizes.length > 0 && (
          <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-surface-container-lowest/95 backdrop-blur-md p-space-sm">
            <div className="flex items-center justify-center gap-space-xs">
              {sizes.map((size) => (
                <span
                  key={size}
                  className="min-w-8 h-8 px-2 rounded-full border border-outline-variant/50 font-label text-label-md flex items-center justify-center text-on-surface"
                >
                  {size}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="p-space-md space-y-space-xs">
        <p className="font-label text-label-sm uppercase tracking-wider text-outline truncate">
          {product.brand?.name || "E-PETE"}
        </p>
        <Link to={`/product/${product.id}`} className="block font-body text-body-md text-on-surface line-clamp-1 hover:text-primary transition-colors">
          {product.name}
        </Link>
        {colors.length > 0 && (
          <div className="flex items-center gap-1.5 pt-0.5">
            {colors.slice(0, 4).map((color) => {
              const hex =
                color === "Red"
                  ? "#e11f26"
                  : color === "Olive"
                    ? "#556B2F"
                    : color === "Black"
                      ? "#1a1a1a"
                      : color === "Navy"
                        ? "#1e3a5f"
                        : "#ccc";
              return (
                <span
                  key={color}
                  title={color}
                  className="w-3.5 h-3.5 rounded-full border border-outline-variant/40"
                  style={{ backgroundColor: hex }}
                />
              );
            })}
            <span className="font-label text-label-sm text-outline ml-1">
              {sizes.length} sizes
            </span>
          </div>
        )}
        <div className="flex items-baseline gap-space-xs">
          <span className="font-headline text-price-headline text-on-surface">{formatPrice(price)}</span>
          <span className="font-body text-price-strikethrough text-outline line-through">{formatPrice(compareAt)}</span>
          <span className="font-label text-label-md text-tertiary font-bold">{discount}% OFF</span>
        </div>
        <button
          type="button"
          onClick={quickAdd}
          className="w-full mt-space-xs h-11 rounded-lg bg-on-surface text-surface-bright font-label text-label-lg font-bold hover:bg-primary transition-colors"
        >
          ADD TO BAG
        </button>
      </div>
    </article>
  );
}
