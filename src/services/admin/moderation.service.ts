import "server-only";
import { prisma } from "@/lib/prisma";

/** Catálogo: incluye inactivos (vista de moderación). */
export async function listAllProducts() {
  return prisma.product.findMany({ orderBy: { createdAt: "desc" }, take: 200 });
}

export async function setProductActive(id: string, active: boolean) {
  await prisma.product.update({ where: { id }, data: { active } });
}

export async function listAllServices() {
  return prisma.service.findMany({ orderBy: { createdAt: "desc" }, take: 200 });
}

export async function setServiceActive(id: string, active: boolean) {
  await prisma.service.update({ where: { id }, data: { active } });
}

/** Empleos: incluye ocultos (vista de moderación). */
export async function listAllJobs() {
  return prisma.jobPosting.findMany({ orderBy: { fetchedAt: "desc" }, take: 200 });
}

export async function setJobHidden(id: string, hidden: boolean) {
  await prisma.jobPosting.update({ where: { id }, data: { hidden } });
}

/** Pedidos (solo lectura). */
export async function listOrders() {
  return prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: { user: { select: { email: true } } },
    take: 200,
  });
}

/** Conteos para el dashboard. */
export async function adminCounts() {
  const [users, products, services, jobs, orders] = await Promise.all([
    prisma.user.count(),
    prisma.product.count(),
    prisma.service.count(),
    prisma.jobPosting.count(),
    prisma.order.count(),
  ]);
  return { users, products, services, jobs, orders };
}
