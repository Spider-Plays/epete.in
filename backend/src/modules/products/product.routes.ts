import { Router } from "express";
import prisma from "../../services/prisma.service";
import { authenticateToken, authorizeRole } from "../../middleware/auth.middleware";

const router = Router();
const SIZES = ["S", "M", "L", "XL", "XXL"];
const COLORS = ["Red", "Olive", "Black", "Navy"];

router.get("/", async (req, res, next) => {
  try {
    const search = typeof req.query.search === "string" ? req.query.search.trim() : "";
    const category = typeof req.query.category === "string" ? req.query.category : undefined;
    const brand = typeof req.query.brand === "string" ? req.query.brand : undefined;

    const products = await prisma.product.findMany({
      where: {
        isActive: true,
        ...(search
          ? {
              OR: [
                { name: { contains: search, mode: "insensitive" } },
                { description: { contains: search, mode: "insensitive" } },
              ],
            }
          : {}),
        ...(category ? { category: { slug: category } } : {}),
        ...(brand ? { brand: { slug: brand } } : {}),
      },
      include: {
        images: true,
        variants: true,
        category: true,
        brand: true,
      },
      orderBy: { createdAt: "desc" },
    });

    res.json({ success: true, data: products });
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: req.params.id },
      include: {
        images: true,
        variants: true,
        category: true,
        brand: true,
        reviews: { include: { user: { select: { id: true, name: true } } } },
      },
    });

    if (!product) {
      res.status(404).json({ success: false, message: "Product not found" });
      return;
    }

    res.json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
});

router.post("/", authenticateToken, authorizeRole("admin"), async (req, res, next) => {
  try {
    const {
      name,
      description,
      basePrice,
      categoryId,
      brandId,
      imageUrl,
      colorImages,
      primaryColor = "Red",
    } = req.body as {
      name: string;
      description: string;
      basePrice: number;
      categoryId: string;
      brandId?: string;
      imageUrl?: string;
      colorImages?: Record<string, string>;
      primaryColor?: string;
    };

    if (!name || !description || !basePrice || !categoryId) {
      res.status(400).json({ success: false, message: "name, description, basePrice, categoryId required" });
      return;
    }

    let brand = brandId
      ? await prisma.brand.findUnique({ where: { id: brandId } })
      : await prisma.brand.findUnique({ where: { slug: "epete" } });

    if (!brand) {
      brand = await prisma.brand.create({
        data: { name: "E-PETE", slug: "epete", description: "E-PETE apparel" },
      });
    }

    const imagesByColor: Record<string, string> = {};
    for (const color of COLORS) {
      imagesByColor[color] =
        colorImages?.[color] || imageUrl || "/images/designs/baarisu-red.jpg";
    }

    const skuBase = name
      .toUpperCase()
      .replace(/[^A-Z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 18);

    const product = await prisma.product.create({
      data: {
        name,
        description,
        categoryId,
        brandId: brand.id,
        basePrice: Number(basePrice),
        isFeatured: true,
        images: {
          create: COLORS.map((color) => ({
            url: imagesByColor[color],
            altText: color,
            isPrimary: color === primaryColor,
          })),
        },
        variants: {
          create: SIZES.flatMap((size) =>
            COLORS.map((color) => ({
              size,
              color,
              price: Number(basePrice),
              sku: `${skuBase}-${color.slice(0, 3).toUpperCase()}-${size}-${Date.now().toString(36).slice(-4)}`,
              stockQuantity: 48,
            }))
          ),
        },
      },
      include: { images: true, variants: true, category: true, brand: true },
    });

    res.status(201).json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
});

router.put("/:id", authenticateToken, authorizeRole("admin"), async (req, res, next) => {
  try {
    const { name, description, basePrice, isActive, isFeatured, imageUrl, colorImages } = req.body;

    const existing = await prisma.product.findUnique({ where: { id: req.params.id } });
    if (!existing) {
      res.status(404).json({ success: false, message: "Product not found" });
      return;
    }

    const product = await prisma.product.update({
      where: { id: req.params.id },
      data: {
        ...(name !== undefined ? { name } : {}),
        ...(description !== undefined ? { description } : {}),
        ...(basePrice !== undefined ? { basePrice: Number(basePrice) } : {}),
        ...(isActive !== undefined ? { isActive: Boolean(isActive) } : {}),
        ...(isFeatured !== undefined ? { isFeatured: Boolean(isFeatured) } : {}),
      },
      include: { images: true, variants: true, category: true, brand: true },
    });

    if (basePrice !== undefined) {
      await prisma.productVariant.updateMany({
        where: { productId: product.id },
        data: { price: Number(basePrice) },
      });
    }

    if (colorImages && typeof colorImages === "object") {
      for (const [color, url] of Object.entries(colorImages as Record<string, string>)) {
        const img = await prisma.productImage.findFirst({
          where: { productId: product.id, altText: color },
        });
        if (img) {
          await prisma.productImage.update({ where: { id: img.id }, data: { url } });
        } else {
          await prisma.productImage.create({
            data: { productId: product.id, url, altText: color, isPrimary: false },
          });
        }
      }
    } else if (imageUrl) {
      const primary = await prisma.productImage.findFirst({
        where: { productId: product.id, isPrimary: true },
      });
      if (primary) {
        await prisma.productImage.update({ where: { id: primary.id }, data: { url: imageUrl } });
      }
    }

    const refreshed = await prisma.product.findUnique({
      where: { id: product.id },
      include: { images: true, variants: true, category: true, brand: true },
    });

    res.json({ success: true, data: refreshed });
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", authenticateToken, authorizeRole("admin"), async (req, res, next) => {
  try {
    const id = req.params.id;
    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ success: false, message: "Product not found" });
      return;
    }

    await prisma.cartItem.deleteMany({ where: { productId: id } });
    await prisma.wishlistItem.deleteMany({ where: { productId: id } });
    await prisma.productImage.deleteMany({ where: { productId: id } });
    await prisma.productVariant.deleteMany({ where: { productId: id } });
    await prisma.product.delete({ where: { id } });

    res.json({ success: true, message: "Product deleted" });
  } catch (error) {
    next(error);
  }
});

export default router;
