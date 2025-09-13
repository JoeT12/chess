import {
  ChevronUp,
  Home,
  Moon,
  Play,
  Settings,
  Sun,
  User2,
  Newspaper,
} from "lucide-react";
import { useRouter } from "next/router";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "../ui/button";
import { useTheme } from "next-themes";
import { useAuth } from "@/context/authContext";

// Menu items.
const items = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "Feed",
    url: "/feed",
    icon: Newspaper,
  },
  {
    title: "Play Computer",
    url: "/play-computer",
    icon: Play,
    requiresAuth: true,
  },
  {
    title: "Play Online",
    url: "/play-online",
    icon: Play,
    requiresAuth: true,
  }
];

export function AppSidebar() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const { user, loading, logout } = useAuth();
  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Chess</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const disabled = item.requiresAuth && !user && !loading;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      className={disabled ? "opacity-50" : ""}
                    >
                      <a
                        href={disabled ? undefined : item.url}
                        onClick={(e) => {
                          if (disabled) e.preventDefault();
                        }}
                        className="flex items-center gap-2"
                      >
                        <item.icon className="w-4 h-4" />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <Button variant="outline" size="icon" onClick={() => toggleTheme()}>
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>

        {!user && !loading && (
          <>
            <button
              onClick={() => router.push("/login")}
              className="w-full bg-chessGreen text-white py-2 mb-1 rounded-md"
            >
              Sign In
            </button>
            <button
              onClick={() => router.push("/create-account")}
              className="w-full bg-lightGrey text-white py-2 mb-2 rounded-md"
            >
              Create a Free Account
            </button>
          </>
        )}

        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild disabled={!user}>
                <SidebarMenuButton
                  className={!user ? "opacity-50 cursor-not-allowed" : ""}
                >
                  <User2 /> {user ? user.email : "Not Signed In"}
                  <ChevronUp className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>

              {user && (
                <DropdownMenuContent
                  side="top"
                  className="w-[--radix-popper-anchor-width]"
                >
                  <DropdownMenuItem onClick={() => router.push("/account")}>
                    <span>Account</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <span>Billing</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={logout}>
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              )}
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
