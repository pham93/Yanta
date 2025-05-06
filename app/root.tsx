import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useParams,
} from "@remix-run/react";
import type { LinksFunction, LoaderFunctionArgs } from "@remix-run/node";

import "./tailwind.css";
import { SidebarProvider } from "./components/ui/sidebar";
import Sidebar from "./components/ui/app/sidebar";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "./components/ui/resizable";
import React, { useEffect, useRef, useState } from "react";
import { ImperativePanelHandle } from "react-resizable-panels";
import { cn } from "./lib/utils";
import { ToastProvider } from "./components/ui/toast";
import { Toaster } from "./components/ui/toaster";
import { AppProvider, useAppStore } from "./providers/app.provider";
import { parseYantaCookies } from "./cookies.server";
import { userPreferencesSchema } from "./schemas/user-preferences.schema";
import { tryCatch } from "./utils/tryCatch";
import Header from "./components/ui/app/header";

export const links: LinksFunction = () => [];

export async function loader({ request }: LoaderFunctionArgs) {
  const userPrefs = parseYantaCookies(request);
  const { result } = tryCatch(() => userPreferencesSchema.parse(userPrefs));
  if (!result) {
    return {};
  }
  return result;
}

export function Layout({ children }: { children: React.ReactNode }) {
  const { id } = useParams();
  const userPrefs = useLoaderData<typeof loader>();

  return (
    <html lang="en" className="dark">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{id ?? "Yanta"}</title>
        <Meta />
        <Links />
      </head>
      <body>
        <AppProvider initialValue={userPrefs}>{children}</AppProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  const ref = useRef<ImperativePanelHandle | null>(null);
  const [onDrag, setOnDrag] = useState(false);
  const [isClient, setIsClient] = useState(false);

  const sidebarOpen = useAppStore((state) => state.sidebarOpened);

  useEffect(() => {
    if (!ref?.current) {
      return;
    }
    setIsClient(true);
    sidebarOpen ? ref.current.expand(20) : ref.current.collapse();
  }, [sidebarOpen]);

  return (
    <ToastProvider>
      <SidebarProvider>
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel
            className={cn({
              "duration-300 transition-all ease-in-out": !onDrag && isClient,
            })}
            order={1}
            collapsible={!onDrag}
            collapsedSize={0}
            minSize={15}
            defaultSize={sidebarOpen ? 20 : 0}
            maxSize={30}
            ref={ref}
          >
            <Sidebar />
          </ResizablePanel>
          <ResizableHandle withHandle onDragging={setOnDrag} />
          <ResizablePanel defaultSize={80} order={2}>
            <main className="w-full h-screen overflow-hidden flex flex-col">
              <Header />
              <Outlet />
              <Toaster />
            </main>
          </ResizablePanel>
        </ResizablePanelGroup>
      </SidebarProvider>
    </ToastProvider>
  );
}
