// server/scripts/testUpdate.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const job = await prisma.job.findFirst({ orderBy: { id: "desc" } });
  console.log("Before:", job);
  if (!job) {
    console.log("No job found to update.");
    process.exit(0);
  }
  const updated = await prisma.job.update({
    where: { id: job.id },
    data: { applyLink: "https://example.com/test-apply", location: "Test City" },
  });
  console.log("After:", updated);
  process.exit(0);
}
main().catch(e => { console.error(e); process.exit(1); });
