import { useState } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Home, Edit, MessageSquare, Star, MoreVertical } from "lucide-react";
import { SidebarTrigger } from "../sidebar";
import usePersistenceStore from "~/hooks/use-persistence-store";

export default function Header() {
  // State for editable breadcrumb items
  const [isEditing, setIsEditing] = useState({
    workspace: false,
    page: false,
    nested: false,
  });
  const [names, setNames] = useState({
    workspace: "My workspace",
    page: "My page",
    nested: "My nested page",
  });

  // Handle edit toggle and save
  // const toggleEdit = (field) => {
  //   setIsEditing((prev) => ({ ...prev, [field]: !prev[field] }));
  // };

  // const handleNameChange = (field, value) => {
  //   setNames((prev) => ({ ...prev, [field]: value }));
  // };
  const setSidebarExpanded = usePersistenceStore(
    (state) => state.setSidebarExpanded
  );

  return (
    <header className="flex items-center px-2 py-1 border-b w-full">
      <SidebarTrigger className="mr-2" onClick={() => setSidebarExpanded()} />
      {/* Left Side - Breadcrumb */}
      <div className="flex items-center gap-4">
        <Breadcrumb>
          <BreadcrumbList>
            {/* Workspace */}
            <BreadcrumbItem>
              <div className="flex items-center gap-2">
                <Home className="h-4 w-4" />
                <BreadcrumbLink href="#" className="flex items-center gap-2">
                  {names.workspace}
                </BreadcrumbLink>
              </div>
            </BreadcrumbItem>
            <BreadcrumbSeparator>/</BreadcrumbSeparator>

            {/* Page */}
            <BreadcrumbItem>
              <BreadcrumbLink href="#" className="flex items-center gap-2">
                <Edit className="h-4 w-4" />
                {names.page}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>/</BreadcrumbSeparator>

            {/* Nested Page */}
            <BreadcrumbItem>
              <BreadcrumbPage className="flex items-center gap-2">
                {names.nested}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
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
