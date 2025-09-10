import React from "react";
import "@/styles/globals.css";

import { AppSidebar } from "@/components/app-sidebar";
import { useRouter } from "next/router";
import { AppProps } from "next/app";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import FooterSection from "@/components/app-footer";
import { AuthProvider } from "@/context/authContext";

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const pathSegments = router.pathname.split("/").filter(Boolean);

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <AuthProvider>
        <SidebarProvider>
          <div className="flex flex-col min-h-screen overflow-x-hidden">
            <div className="flex flex-1 w-full min-w-0">
              <AppSidebar />
              <main className="flex-1 p-2 w-full overflow-x-hidden">
                <div className="flex items-center gap-4">
                  <SidebarTrigger />
                  <Breadcrumb>
                    <BreadcrumbList>
                      <BreadcrumbItem>
                        <BreadcrumbLink href="/">Home</BreadcrumbLink>
                      </BreadcrumbItem>
                      {pathSegments.map((segment, index) => {
                        const href =
                          "/" + pathSegments.slice(0, index + 1).join("/");
                        const isLast = index === pathSegments.length - 1;
                        return (
                          <React.Fragment key={href}>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                              {isLast ? (
                                <BreadcrumbPage>
                                  {decodeURIComponent(segment)}
                                </BreadcrumbPage>
                              ) : (
                                <BreadcrumbLink href={href}>
                                  {decodeURIComponent(segment)}
                                </BreadcrumbLink>
                              )}
                            </BreadcrumbItem>
                          </React.Fragment>
                        );
                      })}
                    </BreadcrumbList>
                  </Breadcrumb>
                </div>
                <Component {...pageProps} />
                <Toaster richColors position="top-right" />
              </main>
            </div>
          </div>
        </SidebarProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default MyApp;
