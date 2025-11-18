// lib/featureWhiteboy.ts
import { prisma } from "@/lib/prisma";

export async function featureNextWhiteboy() {
  // Pull all approved submissions
  const approved = await prisma.submission.findMany({
    where: { status: "APPROVED" },
    orderBy: { createdAt: "asc" },
  });

  if (approved.length === 0) {
    console.warn("No approved submissions available to feature.");
    return null;
  }

  // Find whoever is currently featured
  const currentlyFeatured = await prisma.submission.findFirst({
    where: { featured: true },
  });

  let next;

  if (!currentlyFeatured) {
    // If nothing is featured yet, feature the first approved one
    next = approved[0];
  } else {
    const idx = approved.findIndex((s) => s.id === currentlyFeatured.id);

    // If not found or current is last, wrap back to first
    if (idx === -1 || idx === approved.length - 1) {
      next = approved[0];
    } else {
      next = approved[idx + 1];
    }
  }

  // Clear previous featured
  await prisma.submission.updateMany({
    where: { featured: true },
    data: { featured: false },
  });

  // Set the new one
  const updated = await prisma.submission.update({
    where: { id: next.id },
    data: { featured: true },
  });

  return updated;
}
