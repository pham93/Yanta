import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useParams,
} from "@remix-run/react";
import type { LinksFunction } from "@remix-run/node";

import "./tailwind.css";
import { SidebarProvider } from "./components/ui/sidebar";
import Sidebar from "./components/ui/app/sidebar";
import Header from "./components/ui/app/header";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "./components/ui/resizable";
import React, { useEffect, useRef, useState } from "react";
import { ImperativePanelHandle } from "react-resizable-panels";
import { cn } from "./lib/utils";
import usePersistenceStore from "./hooks/use-persistence-store";

export const links: LinksFunction = () => [];

export function Layout({ children }: { children: React.ReactNode }) {
  const { id } = useParams();

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
        {children}
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
  const sidebarExpanded = usePersistenceStore((state) => state.sidebarExpanded);

  useEffect(() => {
    if (!ref?.current) {
      return;
    }
    setIsClient(true);
    sidebarExpanded ? ref.current.expand(20) : ref.current.collapse();
  }, [sidebarExpanded]);

  return (
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
            <Outlet />;
          </main>
        </ResizablePanel>
      </ResizablePanelGroup>
    </SidebarProvider>
  );
}
