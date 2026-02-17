import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";

export const Header = () => {
  return (
    <header className="flex justify-center border-b mb-2 sticky top-0 bg-[#0b0b0f]">
      <NavigationMenu className="max-w-11/12">
        <div className="w-full">
          <NavigationMenuList className="justify-between w-full">
            {/* Tu contenido de navegación aquí */}
            <NavigationMenuItem>
              <h1 className="text-5xl select-none" lang="en">
                Velox
              </h1>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Button className="cursor-pointer">
                  <Link to={"/login"}>Login</Link>
                </Button>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </div>
      </NavigationMenu>
    </header>
  );
};
