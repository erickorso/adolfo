const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1", "::1"]);

/** Ualá v2 exige callbacks y webhook con URL pública HTTPS (no localhost). */
export function validateUalaCallbackUrls(urls: {
  callbackSuccess: string;
  callbackFail: string;
  notificationUrl: string;
}): string | null {
  for (const [label, raw] of Object.entries(urls)) {
    let parsed: URL;
    try {
      parsed = new URL(raw);
    } catch {
      return `URL inválida para ${label}: ${raw}`;
    }

    if (LOCAL_HOSTS.has(parsed.hostname)) {
      return "Ualá no acepta localhost en callbacks ni webhook. Exponé la app con ngrok y seteá AUTH_URL=https://tu-subdominio.ngrok.io";
    }

    if (parsed.protocol !== "https:") {
      return `Ualá requiere HTTPS en ${label}. Configurá AUTH_URL con tu URL pública (ej. ngrok).`;
    }
  }

  return null;
}
