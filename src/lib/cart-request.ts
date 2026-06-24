import { getAppBaseUrl } from "@/lib/app-url";

export function isSecureRequest(request: Request): boolean {
  return new URL(request.url).protocol === "https:";
}

export function localeFromReferer(referer: string | null): string {
  if (!referer) {
    return "es";
  }
  try {
    const segment = new URL(referer).pathname.split("/").filter(Boolean)[0];
    return segment === "en" ? "en" : "es";
  } catch {
    return "es";
  }
}

export function cartPageUrl(
  locale: string,
  params?: { checkoutError?: string; cartError?: string },
): URL {
  const url = new URL(`/${locale}/cart`, getAppBaseUrl());
  if (params?.checkoutError) {
    url.searchParams.set("checkoutError", params.checkoutError);
  }
  if (params?.cartError) {
    url.searchParams.set("cartError", params.cartError);
  }
  return url;
}

export function resolveReturnTo(
  formData: FormData,
  request: Request,
  locale: string,
): URL {
  const raw = String(
    formData.get("returnTo") ?? request.headers.get("referer") ?? "",
  );
  try {
    const target = new URL(raw, request.url);
    if (target.pathname.includes("/cart")) {
      return target;
    }
  } catch {
    /* fallback */
  }
  return cartPageUrl(locale);
}
