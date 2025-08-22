import { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";
import { Link, useNavigate } from "react-router-dom";
import { RootRouter } from "@/Router";
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar";
import {
  Home,
  Package,
  User as UserIcon,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export const HomeContainer = () => {
  const { isSignedIn, email, id, name, role, managerId } =
    useContext(UserContext);
  const navigate = useNavigate();

  const [productOpen, setProductOpen] = useState(false);

  useEffect(() => {
    if (!isSignedIn) navigate("/login");
  }, [isSignedIn, navigate]);

  return (
    <SidebarProvider>
      <div className="flex h-screen">
        <Sidebar
          side="left"
          collapsible="icon"
          className="h-screen sticky top-0"
        >
          <SidebarContent>
            <SidebarHeader className="flex flex-row items-center gap-2">
              <Avatar className="w-12 h-12 p-2">
                <AvatarFallback>
                  <UserIcon />
                </AvatarFallback>
              </Avatar>
              <span className="text-lg font-bold px-2">BitStore</span>
            </SidebarHeader>

            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  className="flex justify-between items-center"
                >
                  <Link to="/dashboard" className="flex w-full items-center">
                    <span className="flex items-center">
                      <Home className="mr-2" />
                      Dashboard
                    </span>
                    <ChevronDown className="ml-auto opacity-50" size={16} />
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => setProductOpen((prev) => !prev)}
                  className="flex justify-between items-center w-full"
                >
                  <span className="flex items-center">
                    <Package className="mr-2" />
                    Store
                  </span>
                  {productOpen ? (
                    <ChevronUp className="opacity-50" size={16} />
                  ) : (
                    <ChevronDown className="opacity-50" size={16} />
                  )}
                </SidebarMenuButton>

                {productOpen && (
                  <SidebarMenuSub>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton asChild>
                        <Link to="/products">Products</Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton asChild>
                        <Link to="/products/add">Add Product</Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  </SidebarMenuSub>
                )}
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>

        <div className="flex flex-col overflow-hidden">
          <header className="sticky top-0 z-10 border-b border-gray-200 px-4 py-2">
            Header
          </header>

          <main className="overflow-auto p-6">
            <div className="mb-4">
              <ul className="space-y-1">
                <li>name: {name}</li>
                <li>email: {email}</li>
                <li>id: {id}</li>
                <li>role: {role}</li>
                <li>managerId: {managerId}</li>
              </ul>
            </div>

            <RootRouter />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};
