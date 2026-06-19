import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { LocalStorage } from "./local-storage";

let baseDir: string;
let storage: LocalStorage;

beforeAll(async () => {
  baseDir = await mkdtemp(path.join(tmpdir(), "storage-test-"));
  storage = new LocalStorage(baseDir);
});

afterAll(async () => {
  await rm(baseDir, { recursive: true, force: true });
});

describe("LocalStorage", () => {
  it("guarda y recupera el contenido (round-trip)", async () => {
    const key = "resumes/u1/cv.pdf";
    const data = Buffer.from("hola mundo");
    await storage.put(key, data, "application/pdf");
    const read = await storage.getBytes(key);
    expect(read.toString()).toBe("hola mundo");
  });

  it("elimina sin fallar si no existe", async () => {
    await expect(storage.delete("resumes/u1/no-existe.pdf")).resolves.toBeUndefined();
  });

  it("rechaza keys con path traversal", async () => {
    await expect(
      storage.put("../escape.pdf", Buffer.from("x"), "application/pdf"),
    ).rejects.toThrow(/path traversal/i);
  });
});
