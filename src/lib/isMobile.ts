import { headers } from "next/headers";

export async function getIsMobile(): Promise<boolean> {
  const headersList = await headers();
  const ua = headersList.get("user-agent") ?? "";
  return /android|iphone|ipad|ipod|mobile/i.test(ua);
}