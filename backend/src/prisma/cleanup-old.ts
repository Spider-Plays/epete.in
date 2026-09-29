const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const old = await prisma.product.findMany({
    where: {
      OR: [
        { name: "Linen Shirt" },
        { name: "Tailored Trousers" },
        { name: "Wool Coat" },
      ],
    },
    select: { id: true },
  });
  const ids = old.map((p: { id: string }) => p.id);
  if (!ids.length) {
    console.log("Nothing to clean");
    return;
  }
  await prisma.productImage.deleteMany({ where: { productId: { in: ids } } });
  await prisma.productVariant.deleteMany({ where: { productId: { in: ids } } });
  await prisma.wishlistItem.deleteMany({ where: { productId: { in: ids } } });
  await prisma.cartItem.deleteMany({ where: { productId: { in: ids } } });
  await prisma.orderItem.deleteMany({ where: { productId: { in: ids } } });
  await prisma.review.deleteMany({ where: { productId: { in: ids } } });
  const result = await prisma.product.deleteMany({ where: { id: { in: ids } } });
  console.log(result);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
