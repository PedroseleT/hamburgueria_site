import { headers } from "next/headers";
import HomeDesktop from "@/components/HomeDesktop";
import HomeMobile from "@/components/HomeMobile";

async function getIsMobile(): Promise<boolean> {
  const headersList = await headers();
  const ua = headersList.get("user-agent") ?? "";
  return /android|iphone|ipad|ipod|mobile/i.test(ua);
}

export default async function Page() {
  const mobile = await getIsMobile();
  return mobile ? <HomeMobile /> : <HomeDesktop />;
}