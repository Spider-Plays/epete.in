import { Link } from "react-router-dom";
import { Icon } from "../components/Icon";
import { useCartStore } from "../store/cartStore";
import { FREE_SHIPPING_THRESHOLD, STANDARD_SHIPPING } from "../constants/design";
import { formatPrice } from "../utils";

export function CartPage() {
  const items = useCartStore((s) => s.items);
  const totalPrice = useCartStore((s) => s.totalPrice);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <Icon name="shopping_bag" className="text-[48px] text-outline" />
        <h1 className="mt-4 font-headline text-headline-lg">Your bag is empty</h1>
        <Link
          to="/shop"
          className="inline-flex mt-6 h-12 px-space-xl items-center rounded-lg bg-primary text-on-primary font-label text-label-lg font-bold"
        >
          CONTINUE SHOPPING
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-margin-desktop pb-space-3xl">
      <h1 className="font-headline text-headline-lg mb-space-lg">Shopping Bag</h1>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl">
        <div className="lg:col-span-8 space-y-space-md">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex gap-space-md bg-surface-container-lowest rounded-xl p-space-md shadow-card"
            >
              <img
                src={item.image || "https://placehold.co/120x150"}
                alt={item.name}
                className="w-24 h-28 object-cover rounded-lg bg-surface-container-low"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-space-sm">
                  <div>
                    <h2 className="font-headline text-headline-sm truncate">{item.name}</h2>
                    <p className="font-body text-body-sm text-on-surface-variant">
                      {[item.size, item.color].filter(Boolean).join(" · ")}
                    </p>
                  </div>
                  <button type="button" onClick={() => removeItem(item.id)} aria-label="Remove">
                    <Icon name="close" className="text-outline hover:text-primary" />
                  </button>
                </div>
                <div className="mt-space-md flex items-center justify-between">
                  <div className="inline-flex items-center rounded-lg border border-outline-variant/50">
                    <button
                      type="button"
                      className="px-3 h-9"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      −
                    </button>
                    <span className="px-3 font-label text-label-md">{item.quantity}</span>
                    <button
                      type="button"
                      className="px-3 h-9"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                  <span className="font-headline text-price-headline">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <aside className="lg:col-span-4">
          <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-card sticky top-44 space-y-space-md">
            <h2 className="font-headline text-headline-sm">Order Summary</h2>
            <div className="flex justify-between font-body text-body-md">
              <span className="text-on-surface-variant">Subtotal</span>
              <span>{formatPrice(totalPrice)}</span>
            </div>
            <div className="flex justify-between font-body text-body-md">
              <span className="text-on-surface-variant">Shipping</span>
              <span className="text-tertiary font-bold">
                {totalPrice >= FREE_SHIPPING_THRESHOLD ? "FREE" : formatPrice(STANDARD_SHIPPING)}
              </span>
            </div>
            <div className="border-t border-surface-container pt-space-md flex justify-between font-headline text-price-headline">
              <span>Total</span>
              <span>
                {formatPrice(
                  totalPrice >= FREE_SHIPPING_THRESHOLD
                    ? totalPrice
                    : totalPrice + STANDARD_SHIPPING
                )}
              </span>
            </div>
            <Link
              to="/checkout"
              className="block text-center h-12 leading-[3rem] rounded-lg bg-primary text-on-primary font-label text-label-lg font-bold hover:bg-primary-container"
            >
              CHECKOUT
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
