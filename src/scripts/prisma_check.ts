import "dotenv/config";
import { prisma } from "@/lib/prisma";

async function main() {
  const result = await prisma.$queryRawUnsafe("SELECT 1 as ok");
  console.log(result);
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });