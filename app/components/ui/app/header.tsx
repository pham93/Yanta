import { useMemo } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Edit, MessageSquare, Star, MoreVertical } from "lucide-react";
import { SidebarTrigger } from "../sidebar";
import usePersistenceStore from "~/hooks/use-persistence-store";
import { useWorkspaceStore } from "~/store/workspaces.store";
import { getAcestry } from "~/utils/tree-control";
import { Link, useParams } from "@remix-run/react";
import { cn } from "~/lib/utils";

export default function Header() {
  // State for editable breadcrumb items
  const pages = useWorkspaceStore((state) => state.workspace?.pages);
  const { page: pageId, workspace: workspaceId } = useParams();

  const navigationCrumbs = useMemo(() => {
    if (!pageId || !pages) {
      return [];
    }

    return getAcestry({ index: pageId, data: "" }, pages);
  }, [pages, pageId]);

  const setSidebarExpanded = usePersistenceStore(
    (state) => state.setSidebarExpanded
  );

  return (
    <header className="flex items-center px-2 py-1 border-b w-full">
      <SidebarTrigger className="mr-2" onClick={() => setSidebarExpanded()} />
      <Breadcrumb>
        <BreadcrumbList className="gap-0 sm:gap-0">
          {pages &&
            navigationCrumbs.map((nav, idx) => (
              <span key={nav} className="flex flex-row">
                <BreadcrumbItem>
                  <BreadcrumbLink
                    href="#"
                    className={cn({ "text-primary": nav === pageId })}
                    asChild
                  >
                    <Link to={`${workspaceId}/${nav}`} prefetch="intent">
                      {pages[nav].data as string}
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>

                {idx !== navigationCrumbs.length - 1 ? (
                  <BreadcrumbSeparator className="mx-2">/</BreadcrumbSeparator>
                ) : null}
              </span>
            ))}
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex flex-grow" />

      {/* Right Side - Actions */}
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-500">Last edited: 2 min ago</span>

        <Button variant="outline" size="sm">
          Shared
        </Button>

        <Button variant="ghost" size="icon">
          <MessageSquare className="h-5 w-5" />
          <span className="sr-only">View all comments</span>
        </Button>

        <Button variant="ghost" size="icon">
          <Star className="h-5 w-5" />
          <span className="sr-only">Add to favorite</span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-5 w-5" />
              <span className="sr-only">More options</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Option 1</DropdownMenuItem>
            <DropdownMenuItem>Option 2</DropdownMenuItem>
            <DropdownMenuItem>Option 3</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
