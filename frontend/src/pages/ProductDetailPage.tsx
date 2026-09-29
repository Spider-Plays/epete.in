import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Icon } from "../components/Icon";
import { PRODUCT_COLORS } from "../constants/design";
import api from "../services/api";
import { useCartStore } from "../store/cartStore";
import { useWishlistStore } from "../store/wishlistStore";
import { Product } from "../types";
import { formatPrice } from "../utils";

function colorMeta(name: string) {
  return PRODUCT_COLORS.find((c) => c.name.toLowerCase() === name.toLowerCase());
}

export function ProductDetailPage() {
  const { id } = useParams();
  const addToCart = useCartStore((s) => s.addItem);
  const wishlistItems = useWishlistStore((s) => s.items);
  const addWishlist = useWishlistStore((s) => s.addItem);
  const removeWishlist = useWishlistStore((s) => s.removeItem);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");

  const { data, isLoading, error } = useQuery({
    queryKey: ["product", id],
    queryFn: () => api.get(`/products/${id}`).then((res) => res.data.data as Product),
    enabled: Boolean(id),
  });

  const product = data;

  const sizes = useMemo(
    () => Array.from(new Set(product?.variants?.map((v) => v.size) || [])),
    [product]
  );

  const colors = useMemo(() => {
    const fromVariants = Array.from(new Set(product?.variants?.map((v) => v.color) || []));
    // Prefer brand colour order when present
    const ordered = PRODUCT_COLORS.map((c) => c.name).filter((n) =>
      fromVariants.some((v) => v.toLowerCase() === n.toLowerCase())
    );
    const extras = fromVariants.filter(
      (v) => !ordered.some((o) => o.toLowerCase() === v.toLowerCase())
    );
    return [...ordered, ...extras];
  }, [product]);

  // Default size/colour once product loads
  useEffect(() => {
    if (!product) return;
    setSelectedSize((prev) => prev || sizes[0] || "");
    const primaryImg = product.images?.find((i) => i.isPrimary);
    const primaryColor =
      (primaryImg?.altText && colors.includes(primaryImg.altText) && primaryImg.altText) ||
      colors[0] ||
      "";
    setSelectedColor((prev) => prev || primaryColor);
  }, [product, sizes, colors]);

  const activeSize = selectedSize || sizes[0] || "";
  const activeColor = selectedColor || colors[0] || "";

  const activeVariant = useMemo(
    () =>
      product?.variants?.find(
        (v) =>
          v.size === activeSize &&
          v.color.toLowerCase() === activeColor.toLowerCase()
      ) || product?.variants?.[0],
    [product, activeSize, activeColor]
  );

  const activeImage = useMemo(() => {
    if (!product?.images?.length) return undefined;
    const byColor = product.images.find(
      (img) => img.altText?.toLowerCase() === activeColor.toLowerCase()
    );
    return byColor || product.images.find((i) => i.isPrimary) || product.images[0];
  }, [product, activeColor]);

  const colorThumbnails = useMemo(() => {
    if (!product?.images?.length) return [];
    return colors
      .map((color) => {
        const img = product.images.find(
          (i) => i.altText?.toLowerCase() === color.toLowerCase()
        );
        return img ? { color, img } : null;
      })
      .filter(Boolean) as Array<{ color: string; img: NonNullable<typeof activeImage> }>;
  }, [product, colors]);

  const price = activeVariant?.price ?? product?.basePrice ?? 0;
  const compareAt = Math.round(price * 1.6 * 100) / 100;
  const discount = price ? Math.round(((compareAt - price) / compareAt) * 100) : 0;
  const inWishlist = product
    ? wishlistItems.some((item) => item.productId === product.id)
    : false;

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <p className="text-error mb-4">Product not found</p>
        <Link to="/shop" className="text-primary font-bold">
          Back to shop
        </Link>
      </div>
    );
  }

  const addBag = () => {
    addToCart({
      productId: product.id,
      name: product.name,
      price,
      quantity: 1,
      image: activeImage?.url || "",
      size: activeSize,
      color: activeColor,
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-margin-desktop pb-space-3xl">
      <div className="py-space-sm flex items-center justify-between overflow-x-auto">
        <nav className="flex items-center gap-space-xs font-body text-body-sm text-on-surface-variant">
          <Link to="/" className="hover:text-primary">
            Home
          </Link>
          <Icon name="chevron_right" className="text-[14px] text-outline" />
          <Link to="/shop" className="hover:text-primary">
            Shop
          </Link>
          <Icon name="chevron_right" className="text-[14px] text-outline" />
          <span className="text-on-surface font-semibold truncate max-w-[200px]">{product.name}</span>
        </nav>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl mt-space-sm">
        <div className="lg:col-span-7 flex flex-col gap-space-md">
          <div className="relative bg-surface-container-low rounded-xl overflow-hidden shadow-sm aspect-[4/5] w-full">
            <img
              key={activeImage?.url + activeColor}
              className="w-full h-full object-cover transition-opacity duration-300"
              src={activeImage?.url || "/images/brand/logo.jpg"}
              alt={`${product.name} — ${activeColor}`}
            />
            <div className="absolute top-space-md left-space-md flex flex-col gap-space-xs items-start z-10">
              <span className="bg-on-surface text-surface-bright font-label text-label-sm px-space-sm py-1 rounded-full uppercase">
                100% Cotton · 180 GSM
              </span>
              <span className="bg-primary text-on-primary font-label text-label-sm px-space-sm py-1 rounded-full uppercase">
                {activeColor}
              </span>
            </div>
          </div>

          {colorThumbnails.length > 1 && (
            <div className="grid grid-cols-4 gap-space-sm">
              {colorThumbnails.map(({ color, img }) => (
                <button
                  key={img.id}
                  type="button"
                  onClick={() => setSelectedColor(color)}
                  className={`rounded-lg overflow-hidden aspect-[3/4] relative ${
                    color.toLowerCase() === activeColor.toLowerCase()
                      ? "ring-2 ring-primary"
                      : "opacity-80 hover:opacity-100"
                  }`}
                  aria-label={`View ${color}`}
                >
                  <img src={img.url} alt={color} className="w-full h-full object-cover" />
                  <span className="absolute bottom-1 left-1 right-1 text-center font-label text-[10px] bg-surface-container-lowest/90 rounded px-1 py-0.5">
                    {color}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="lg:col-span-5 flex flex-col gap-space-lg lg:sticky lg:top-36 self-start">
          <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col gap-space-md">
            <div>
              <div className="flex items-center justify-between mb-space-xs">
                <span className="font-label text-label-md text-primary font-bold uppercase tracking-wider inline-flex items-center gap-1">
                  {product.brand?.name || "E-PETE"}
                  <Icon name="verified" filled className="text-[16px] text-tertiary" />
                </span>
              </div>
              <h1 className="font-headline text-headline-lg text-on-surface leading-snug">
                {product.name}
              </h1>
              <p className="font-body text-body-sm text-on-surface-variant mt-1">
                {product.description}
              </p>
            </div>

            <div className="flex items-baseline gap-space-sm">
              <span className="font-display text-display-lg text-on-surface font-extrabold leading-none">
                {formatPrice(price)}
              </span>
              <span className="font-body text-price-strikethrough text-outline line-through">
                {formatPrice(compareAt)}
              </span>
              <span className="font-headline text-headline-sm text-primary font-bold bg-primary-fixed px-space-xs py-0.5 rounded">
                {discount}% OFF
              </span>
            </div>

            {colors.length > 0 && (
              <div>
                <p className="font-label text-label-md text-on-surface mb-space-xs">
                  Colour: <span className="font-bold">{activeColor}</span>
                </p>
                <div className="flex flex-wrap gap-space-sm">
                  {colors.map((color) => {
                    const meta = colorMeta(color);
                    const selected = color.toLowerCase() === activeColor.toLowerCase();
                    return (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setSelectedColor(color)}
                        title={color}
                        aria-label={`Select colour ${color}`}
                        aria-pressed={selected}
                        className={`w-10 h-10 rounded-full border-2 transition-transform ${
                          selected
                            ? "border-on-surface scale-110 shadow-md"
                            : "border-outline-variant/60 hover:scale-105"
                        }`}
                        style={{ backgroundColor: meta?.hex || "#ccc" }}
                      />
                    );
                  })}
                </div>
              </div>
            )}

            {sizes.length > 0 && (
              <div>
                <p className="font-label text-label-md text-on-surface mb-space-xs">
                  Size: <span className="font-bold">{activeSize}</span>
                </p>
                <div className="flex flex-wrap gap-space-xs">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={`min-w-12 h-11 px-3 rounded-lg border font-label text-label-md ${
                        activeSize === size
                          ? "bg-on-surface text-surface-bright border-on-surface"
                          : "bg-surface-container-lowest text-on-surface border-outline-variant/50 hover:border-primary"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {activeVariant && (
              <p className="font-body text-body-sm text-on-surface-variant">
                {activeVariant.stockQuantity > 0 ? (
                  <span className="text-tertiary font-semibold">In stock</span>
                ) : (
                  <span className="text-error font-semibold">Out of stock</span>
                )}
                <span className="text-outline"> · SKU {activeVariant.sku}</span>
              </p>
            )}

            <div className="grid grid-cols-2 gap-space-sm">
              <button
                type="button"
                onClick={addBag}
                className="h-12 rounded-lg bg-on-surface text-surface-bright font-label text-label-lg font-bold hover:bg-primary transition-colors"
              >
                ADD TO BAG
              </button>
              <button
                type="button"
                onClick={addBag}
                className="h-12 rounded-lg bg-primary text-on-primary font-label text-label-lg font-bold hover:bg-primary-container transition-colors"
              >
                BUY NOW
              </button>
            </div>

            <button
              type="button"
              onClick={() =>
                inWishlist
                  ? removeWishlist(product.id)
                  : addWishlist({
                      productId: product.id,
                      name: product.name,
                      price,
                      image: activeImage?.url || "",
                    })
              }
              className="inline-flex items-center justify-center gap-space-xs font-label text-label-md text-on-surface-variant hover:text-primary"
            >
              <Icon name="favorite" filled={inWishlist} className={inWishlist ? "text-primary" : ""} />
              {inWishlist ? "Saved to wishlist" : "Add to wishlist"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
