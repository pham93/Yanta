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
import { MessageSquare, Star, MoreVertical } from "lucide-react";
import { SidebarTrigger } from "../sidebar";
import { useWorkspaceStore } from "~/store/workspaces.store";
import { getAcestry } from "~/utils/tree-control";
import { Link, useParams } from "@remix-run/react";
import { cn } from "~/lib/utils";
import { ShareButton } from "./share-button";
import { useAppStore } from "~/providers/app.provider";
import { useShallow } from "zustand/shallow";

function NavigationCrumb() {
  const { page: pageId, workspace: workspaceId } = useParams();
  const { pages, archivedPages } = useWorkspaceStore(
    useShallow((state) => ({
      pages: state.workspace?.pages,
      archivedPages: state.workspace?.archivedPages,
    }))
  );

  const navigationCrumbs = useMemo(() => {
    if (!pageId || !pages) {
      return [];
    }
    const tree = pages[pageId] ? pages : archivedPages ?? {};

    return getAcestry({ index: pageId, data: {} }, tree).map((e) => ({
      name: tree[e].data.title,
      id: e,
    }));
  }, [pages, pageId, archivedPages]);

  return (
    <Breadcrumb>
      <BreadcrumbList className="gap-0 sm:gap-0">
        {pages &&
          navigationCrumbs.map(({ id, name }, idx) => (
            <span key={id} className="flex flex-row">
              <BreadcrumbItem>
                <BreadcrumbLink
                  href="#"
                  className={cn({ "text-primary": id === pageId })}
                  asChild
                >
                  <Link to={`/${workspaceId}/${id}`}>{name}</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>

              {idx !== navigationCrumbs.length - 1 ? (
                <BreadcrumbSeparator className="mx-2">/</BreadcrumbSeparator>
              ) : null}
            </span>
          ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

export default function Header() {
  // State for editable breadcrumb items

  // const lastModified = useEditorStore((state) => state.lastModified);

  // const formattedDateTime = new Intl.DateTimeFormat("en-US", {
  //   month: "2-digit",
  //   day: "2-digit",
  //   hour: "2-digit",
  //   minute: "2-digit",
  //   second: "2-digit",
  // }).format(new Date(lastModified));

  const toggleSidebar = useAppStore((state) => state.toggleSidebar);

  return (
    <header className="flex items-center px-2 py-1 border-b w-full">
      <SidebarTrigger className="mr-2" onClick={() => toggleSidebar()} />
      <NavigationCrumb />
      <div className="flex flex-grow" />

      {/* Right Side - Actions */}
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-500">
          {/* Last edited: {formattedDateTime} */}
        </span>

        <ShareButton />

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
