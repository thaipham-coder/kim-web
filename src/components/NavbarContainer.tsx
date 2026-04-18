import { getProducts } from "@/lib/data";
import StorefrontNavbar from "./StorefrontNavbar";
import { getOptionalSession } from "@/lib/dal";

export async function NavbarContainer() {
  const [session, products] = await Promise.all([
    getOptionalSession(),
    getProducts(),
  ]);

  return <StorefrontNavbar user={session?.user} products={products} />;
}
