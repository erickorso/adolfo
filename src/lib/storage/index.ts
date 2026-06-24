import "server-only";
import { env } from "@/lib/env";
import type { Storage } from "./storage";
import { BlobStorage } from "./blob-storage";
import { LocalStorage } from "./local-storage";
import { S3Storage } from "./s3-storage";

function createStorage(): Storage {
  if (
    env.STORAGE_DRIVER === "local" &&
    process.env.VERCEL === "1" &&
    process.env.VERCEL_ENV === "production"
  ) {
    throw new Error(
      "STORAGE_DRIVER=local no está soportado en Vercel. Usá STORAGE_DRIVER=blob (recomendado) o s3.",
    );
  }

  if (env.STORAGE_DRIVER === "blob") {
    if (!env.BLOB_READ_WRITE_TOKEN) {
      throw new Error(
        "BLOB_READ_WRITE_TOKEN requerido cuando STORAGE_DRIVER=blob. Creá un Blob store en Vercel → Storage.",
      );
    }
    return new BlobStorage();
  }

  if (env.STORAGE_DRIVER === "s3") {
    if (
      !env.S3_BUCKET ||
      !env.S3_REGION ||
      !env.S3_ACCESS_KEY_ID ||
      !env.S3_SECRET_ACCESS_KEY
    ) {
      throw new Error(
        "S3_BUCKET, S3_REGION, S3_ACCESS_KEY_ID y S3_SECRET_ACCESS_KEY requeridos cuando STORAGE_DRIVER=s3",
      );
    }
    return new S3Storage({
      bucket: env.S3_BUCKET,
      region: env.S3_REGION,
      accessKeyId: env.S3_ACCESS_KEY_ID,
      secretAccessKey: env.S3_SECRET_ACCESS_KEY,
      endpoint: env.S3_ENDPOINT,
    });
  }
  return new LocalStorage();
}

/** Storage configurado según STORAGE_DRIVER (local | s3). */
export const storage: Storage = createStorage();

export type { Storage } from "./storage";
