import { Outlet, useLocation } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Navbar } from "./navbar";
import { useAnalytics } from "@/shared/hooks";
import { useEffect } from "react";

const queryClient = new QueryClient();

export function RootLayout() {
  const location = useLocation();
  const { trackPageView } = useAnalytics();

  useEffect(() => {
    const pageName = location.pathname === "/" ? "game" : location.pathname.slice(1);
    trackPageView(pageName, {
      page_path: location.pathname,
    });
  }, [location, trackPageView]);

  return (
    <QueryClientProvider client={queryClient}>
      <Navbar />
      <Outlet />
    </QueryClientProvider>
  );
}
