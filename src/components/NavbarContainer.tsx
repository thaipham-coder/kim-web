import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getProducts } from "@/lib/data";
import StorefrontNavbar from "./StorefrontNavbar";

export async function NavbarContainer() {
  const [session, products] = await Promise.all([
    auth.api.getSession({ headers: await headers() }),
    getProducts(),
  ]);

  return <StorefrontNavbar user={session?.user} products={products} />;
}
