import { Link } from "react-router-dom";
import { Icon } from "../components/Icon";
import { useWishlistStore } from "../store/wishlistStore";
import { formatPrice } from "../utils";

export function WishlistPage() {
  const items = useWishlistStore((s) => s.items);
  const removeItem = useWishlistStore((s) => s.removeItem);

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <Icon name="favorite" className="text-[48px] text-outline" />
        <h1 className="mt-4 font-headline text-headline-lg">Wishlist is empty</h1>
        <Link to="/shop" className="inline-flex mt-6 text-primary font-bold">
          Browse products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-margin-desktop pb-space-3xl">
      <h1 className="font-headline text-headline-lg mb-space-lg">Wishlist</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-space-md">
        {items.map((item) => (
          <div key={item.id} className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-card">
            <Link to={`/product/${item.productId}`}>
              <img src={item.image || "https://placehold.co/400x500"} alt={item.name} className="aspect-[4/5] w-full object-cover" />
            </Link>
            <div className="p-space-md">
              <Link to={`/product/${item.productId}`} className="font-body text-body-md line-clamp-1 hover:text-primary">
                {item.name}
              </Link>
              <p className="font-headline text-price-headline mt-1">{formatPrice(item.price)}</p>
              <button
                type="button"
                onClick={() => removeItem(item.productId)}
                className="mt-space-sm font-label text-label-md text-outline hover:text-primary"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
