import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const SIZES = ["S", "M", "L", "XL", "XXL"] as const;
const COLORS = ["Red", "Olive", "Black", "Navy"] as const;

type ColorImages = Record<(typeof COLORS)[number], string>;

const catalog: Array<{
  name: string;
  description: string;
  categorySlug: "women" | "men";
  basePrice: number;
  skuPrefix: string;
  colorImages: ColorImages;
  primaryColor: (typeof COLORS)[number];
}> = [
  {
    name: "Baarisu Kannada Tee",
    description:
      "ಬಾರಿಸು ಕನ್ನಡ ಡಿಂಡಿಮವ — bold Kannada pride graphic. 100% cotton, 180 GSM unisex tee. Available in Red, Olive, Black & Navy. Made in India.",
    categorySlug: "women",
    basePrice: 699,
    skuPrefix: "EP-BAARISU",
    primaryColor: "Red",
    colorImages: {
      Red: "/images/designs/baarisu-red.jpg",
      Olive: "/images/designs/baarisu-olive.jpg",
      Black: "/images/designs/baarisu-black.jpg",
      Navy: "/images/designs/baarisu-navy.jpg",
    },
  },
  {
    name: "Hampi Stone Chariot Tee",
    description:
      "ಹಂಪಿ — ವಿಜಯನಗರದ ಗತವೈಭವ. Stone chariot graphic tee. 100% cotton, 180 GSM, unisex. Available in Red, Olive, Black & Navy.",
    categorySlug: "women",
    basePrice: 749,
    skuPrefix: "EP-HAMPI",
    primaryColor: "Black",
    colorImages: {
      Red: "/images/designs/baarisu-red.jpg",
      Olive: "/images/designs/baarisu-olive.jpg",
      Black: "/images/designs/hampi-white.jpg",
      Navy: "/images/designs/baarisu-navy.jpg",
    },
  },
  {
    name: "Bettada Jeeva Tee",
    description:
      "ಬೆಟ್ಟದ ಜೀವ — mountain soul trek graphic. Soft 180 GSM cotton, unisex fit. Available in all 4 popular colours.",
    categorySlug: "men",
    basePrice: 749,
    skuPrefix: "EP-BETTADA",
    primaryColor: "Olive",
    colorImages: {
      Red: "/images/designs/baarisu-red.jpg",
      Olive: "/images/designs/bettada-white.jpg",
      Black: "/images/designs/baarisu-black.jpg",
      Navy: "/images/designs/baarisu-navy.jpg",
    },
  },
  {
    name: "Nagu Naguta Tee",
    description:
      "ನಗುನಗುತಾ ನಲಿ ನಲಿ ಏನೇ ಆಗಲಿ — smile & be happy. Minimal smiley graphic on 100% cotton, 180 GSM. All sizes & 4 colours.",
    categorySlug: "men",
    basePrice: 649,
    skuPrefix: "EP-NAGU",
    primaryColor: "Black",
    colorImages: {
      Red: "/images/designs/baarisu-red.jpg",
      Olive: "/images/designs/baarisu-olive.jpg",
      Black: "/images/designs/nagu-black.jpg",
      Navy: "/images/designs/nagu-navy.jpg",
    },
  },
];

async function main() {
  const password = await bcrypt.hash("Admin123!", 12);

  await prisma.user.upsert({
    where: { email: "admin@epete.in" },
    update: {},
    create: {
      email: "admin@epete.in",
      password,
      name: "Store Admin",
      role: "admin",
      emailVerified: true,
    },
  });

  const culture = await prisma.category.upsert({
    where: { slug: "women" },
    update: { name: "Kannada / Culture", description: "Culture & Kannada pride graphic tees" },
    create: {
      name: "Kannada / Culture",
      slug: "women",
      description: "Culture & Kannada pride graphic tees",
    },
  });

  const ready = await prisma.category.upsert({
    where: { slug: "men" },
    update: { name: "Ready-to-Wear", description: "Everyday ready-to-wear graphic tees" },
    create: {
      name: "Ready-to-Wear",
      slug: "men",
      description: "Everyday ready-to-wear graphic tees",
    },
  });

  const brand = await prisma.brand.upsert({
    where: { slug: "epete" },
    update: {
      name: "E-PETE",
      description: "ಇ-ಪೇಟೆ — Custom apparel. Wear what feels like you.",
      logoUrl: "/images/brand/logo.jpg",
    },
    create: {
      name: "E-PETE",
      slug: "epete",
      description: "ಇ-ಪೇಟೆ — Custom apparel. Wear what feels like you.",
      logoUrl: "/images/brand/logo.jpg",
    },
  });

  const categoryId = (slug: "women" | "men") => (slug === "women" ? culture.id : ready.id);

  // Wipe previous E-PETE / TrendVibe products so variants & images match the new colour matrix
  for (const slug of ["epete", "trendvibe"]) {
    const b = await prisma.brand.findUnique({ where: { slug } });
    if (!b) continue;
    const products = await prisma.product.findMany({ where: { brandId: b.id } });
    for (const p of products) {
      await prisma.cartItem.deleteMany({ where: { productId: p.id } });
      await prisma.wishlistItem.deleteMany({ where: { productId: p.id } });
      await prisma.productImage.deleteMany({ where: { productId: p.id } });
      await prisma.productVariant.deleteMany({ where: { productId: p.id } });
      await prisma.product.delete({ where: { id: p.id } });
    }
  }

  for (const item of catalog) {
    const product = await prisma.product.create({
      data: {
        name: item.name,
        description: item.description,
        categoryId: categoryId(item.categorySlug),
        brandId: brand.id,
        basePrice: item.basePrice,
        isFeatured: true,
        images: {
          create: COLORS.map((color) => ({
            url: item.colorImages[color],
            altText: color,
            isPrimary: color === item.primaryColor,
          })),
        },
        variants: {
          create: SIZES.flatMap((size) =>
            COLORS.map((color) => ({
              size,
              color,
              price: item.basePrice,
              sku: `${item.skuPrefix}-${color.slice(0, 3).toUpperCase()}-${size}`,
              stockQuantity: 48,
            }))
          ),
        },
      },
    });
    console.log(`Created ${product.name} with ${SIZES.length * COLORS.length} variants`);
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
