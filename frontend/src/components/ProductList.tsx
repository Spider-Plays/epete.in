import { ProductCard } from "./ProductCard";
import { useProducts } from "../hooks";
import { Product } from "../types";

type ProductListProps = {
  limit?: number;
  badge?: string;
};

export function ProductList({ limit, badge }: ProductListProps) {
  const { productsData, isLoading, error } = useProducts();

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
        <p className="mt-4 font-body text-body-md text-on-surface-variant">Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-error font-body text-body-md">
          Error loading products: {(error as Error).message}
        </p>
      </div>
    );
  }

  const products = ((productsData as Product[]) || []).slice(0, limit);

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="font-body text-body-md text-on-surface-variant">No products found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-space-md md:gap-gutter-desktop">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} badge={badge} />
      ))}
    </div>
  );
}
