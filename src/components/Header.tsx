import { useState } from "react";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "./ui/dropdown-menu";
import { AuthDialog } from "./auth/AuthDialog";
import { useAuth } from "@/context/AuthContext";
import { ConfirmDialog } from "./AlertDialog";
import { Link } from "react-router-dom";
import { LogOut, Menu } from "lucide-react";

export const Header = () => {
  const [dialogMode, setDialogMode] = useState<"login" | "register" | null>(
    null,
  );
  const [openAlertDialog, setOpenAlertDialog] = useState<boolean>(false);

  const { user, logout } = useAuth();

  return (
    <header className="flex justify-center border-b mb-2 px-8 py-1.5 sticky top-0 bg-[#0b0b0f] z-50">
      <NavigationMenu className="max-w-[1500px]">
        <div className="w-full">
          <NavigationMenuList
            className={`flex justify-between md:grid ${user ? `md:grid-cols-3` : `md:grid-cols-2`} items-center w-full`}
          >
            {/* Brand */}
            <NavigationMenuItem className="justify-self-start">
              <h1 className="text-5xl select-none" lang="en">
                Velox
              </h1>
            </NavigationMenuItem>

            {/* Tabs */}
            {user && (
              <div className="hidden md:flex gap-5 justify-self-center">
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link to="/">Inicio</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link to="/dashboard">Dashboard</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </div>
            )}

            {/* Botones de sesion */}
            <NavigationMenuItem className="flex gap-2 justify-self-end items-center">
              {!user ? (
                // Usuario no autenticado
                <>
                  {/* desktop */}
                  <Button
                    className="hidden cursor-pointer md:flex"
                    onClick={() => setDialogMode("login")}
                  >
                    Iniciar sesión
                  </Button>
                  <Button
                    variant="outline"
                    className="hidden cursor-pointer md:flex"
                    onClick={() => setDialogMode("register")}
                  >
                    Registrarse
                  </Button>

                  {/* Mobile */}
                  <div className="md:hidden">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="cursor-pointer">
                          <Menu />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        sideOffset={8}
                        align="end"
                        className="w-40"
                      >
                        <DropdownMenuItem asChild>
                          <Button
                          variant={"link"}
                            className="cursor-pointer w-full"
                            onClick={() => setDialogMode("login")}
                          >
                            Iniciar sesión
                          </Button>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Button
                            variant="link"
                            className="cursor-pointer w-full"
                            onClick={() => setDialogMode("register")}
                          >
                            Registrarse
                          </Button>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </>
              ) : (
                // Usuario autenticado
                <>
                  {/* Desktop */}
                  <div className="hidden md:flex gap-2">
                    <Button
                      variant="outline"
                      className="cursor-pointer"
                      onClick={() => setOpenAlertDialog(true)}
                    >
                      Cerrar sesión
                    </Button>
                  </div>

                  {/* Mobile */}
                  <div className="md:hidden">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="cursor-pointer">
                          <Menu />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        sideOffset={8}
                        align="end"
                        className="w-40"
                      >
                        <DropdownMenuItem asChild>
                          <Link to="/">Inicio</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link to="/dashboard">Dashboard</Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          variant="destructive"
                          onSelect={() => setOpenAlertDialog(true)}
                        >
                          <LogOut />
                          Cerrar sesión
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </>
              )}
            </NavigationMenuItem>
          </NavigationMenuList>
        </div>
      </NavigationMenu>
      <AuthDialog mode={dialogMode} onClose={() => setDialogMode(null)} />
      <ConfirmDialog
        isOpen={openAlertDialog}
        title="Cerrar sesión"
        description="¿Está seguro que desea cerrar sesión?"
        destructiveConfirmVariant={true}
        onClose={() => setOpenAlertDialog(false)}
        handler={logout}
      />
    </header>
  );
};
