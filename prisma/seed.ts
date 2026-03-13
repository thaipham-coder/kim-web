// prisma/seed.ts
import prisma from '@/lib/db';
import categories from './categories.json';
import products from './products.json';
import { toSlug } from '@/lib/utils';

async function main() {
  console.log('Bắt đầu seed categories...');

  for (const cat of categories) {
    const slug = toSlug(cat.name);

    await prisma.category.upsert({
      where: { id: cat.id },
      update: {
        name: cat.name,
        slug,
        image: cat.image,
        sortOrder: cat.id,
      },
      create: {
        id: cat.id,
        name: cat.name,
        slug,
        image: cat.image,
        sortOrder: cat.id,
      },
    });
  }
  console.log(`Đã seed ${categories.length} categories.`);

  console.log('Bắt đầu seed products...');
  for (const prod of products) {
    const slug = toSlug(prod.name);

    await prisma.product.upsert({
      where: { slug },
      update: {
        name: prod.name,
        price: prod.price,
        categoryId: prod.categoryId,
        image: prod.image,
      },
      create: {
        name: prod.name,
        slug,
        price: prod.price,
        categoryId: prod.categoryId,
        image: prod.image,
      },
    });
  }
  console.log(`Đã seed ${products.length} products.`);

  // Reset sequences for PostgreSQL
  console.log('Đang reset sequences...');
  await prisma.$executeRawUnsafe(`SELECT setval('category_id_seq', (SELECT MAX(id) FROM category))`);
  await prisma.$executeRawUnsafe(`SELECT setval('product_id_seq', (SELECT MAX(id) FROM product))`);

  console.log('Seed hoàn tất.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });