import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import type { LinksFunction } from "@remix-run/node";

import "./tailwind.css";
import { SidebarProvider, useSidebar } from "./components/ui/sidebar";
import Sidebar from "./components/ui/app/sidebar";
import Header from "./components/ui/app/header";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "./components/ui/resizable";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { ImperativePanelHandle } from "react-resizable-panels";
import { Button } from "./components/ui/button";
import { cn } from "./lib/utils";
import usePersistenceStore from "./hooks/use-persistence-store";

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const ref = useRef<ImperativePanelHandle | null>(null);
  const [onDrag, setOnDrag] = useState(false);
  const [isClient, setIsClient] = useState(false);

  const sidebarExpanded = usePersistenceStore((state) => state.sidebarExpanded);

  useEffect(() => {
    if (!ref?.current) {
      return;
    }
    setIsClient(true);
    sidebarExpanded ? ref.current.expand(20) : ref.current.collapse();
  }, [sidebarExpanded]);

  return (
    <html lang="en" className="dark">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
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
              defaultSize={20}
              maxSize={30}
              ref={ref}
            >
              <Sidebar />
            </ResizablePanel>
            <ResizableHandle withHandle onDragging={setOnDrag} />
            <ResizablePanel defaultSize={75} order={2}>
              <main className="w-full h-screen overflow-hidden flex flex-col">
                <Header />
                {children}
              </main>
            </ResizablePanel>
          </ResizablePanelGroup>
        </SidebarProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
