import "server-only";
import type { Storage } from "./storage";
import { LocalStorage } from "./local-storage";

/**
 * Storage configurado para el entorno actual.
 * Por ahora siempre local; cuando haya credenciales se elige el adapter de nube
 * según una env (ej. STORAGE_DRIVER) sin tocar a los consumidores.
 */
export const storage: Storage = new LocalStorage();

export type { Storage } from "./storage";
