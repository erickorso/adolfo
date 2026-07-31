import { randomUUID } from "node:crypto";
import type { KitItem } from "./schemas.js";

/** Store en memoria — el BFF Next usa Postgres; este microservicio es el twin local. */
export class MemoryKitStore {
  private readonly items = new Map<string, KitItem>();

  list(): KitItem[] {
    return [...this.items.values()].sort((a, b) =>
      b.createdAt.localeCompare(a.createdAt),
    );
  }

  create(title: string): KitItem {
    const now = new Date().toISOString();
    const item: KitItem = {
      id: randomUUID(),
      title,
      done: false,
      createdAt: now,
      updatedAt: now,
    };
    this.items.set(item.id, item);
    return item;
  }

  update(
    id: string,
    patch: { title?: string; done?: boolean },
  ): KitItem | null {
    const current = this.items.get(id);
    if (!current) return null;
    const next: KitItem = {
      ...current,
      ...(patch.title !== undefined ? { title: patch.title } : {}),
      ...(patch.done !== undefined ? { done: patch.done } : {}),
      updatedAt: new Date().toISOString(),
    };
    this.items.set(id, next);
    return next;
  }

  delete(id: string): boolean {
    return this.items.delete(id);
  }
}
