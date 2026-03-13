import { getProducts } from "@/lib/data";
import StorefrontNavbar from "./StorefrontNavbar";
import { getUser } from "@/lib/dal";

export async function NavbarContainer() {
  const [user, products] = await Promise.all([
    getUser(),
    getProducts(),
  ]);

  return <StorefrontNavbar user={user!} products={products} />;
}
