import { useState } from "react";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
} from "@/components/ui/navigation-menu";
import { Button } from "./ui/button";
import { AuthDialog } from "./auth/AuthDialog";
import { useAuth } from "@/context/AuthContext";
import { ConfirmDialog } from "./AlertDialog";

export const Header = () => {
  const [dialogMode, setDialogMode] = useState<"login" | "register" | null>(
    null,
  );
  const [openAlertDialog, setOpenAlertDialog] = useState<boolean>(false);

  const { user, logout } = useAuth();

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

            <NavigationMenuItem className="flex gap-2">
              {!user ? (
                <>
                  <Button
                    className="cursor-pointer"
                    onClick={() => setDialogMode("login")}
                  >
                    Login
                  </Button>
                  <Button
                    variant="outline"
                    className="cursor-pointer"
                    onClick={() => setDialogMode("register")}
                  >
                    Register
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="outline"
                    className="cursor-pointer"
                    onClick={() => setOpenAlertDialog(true)}
                  >
                    Log out
                  </Button>
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
        onClose={() => setOpenAlertDialog(false)}
        handler={logout}
      />
    </header>
  );
};
