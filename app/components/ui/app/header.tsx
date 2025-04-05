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

  return (
    <header className="flex items-center px-2 py-1 border-b w-full">
      <SidebarTrigger className="mr-2" />
      {/* Left Side - Breadcrumb */}
      <div className="flex items-center gap-4">
        <Breadcrumb>
          <BreadcrumbList>
            {/* Workspace */}
            <BreadcrumbItem>
              <div className="flex items-center gap-2">
                <Home className="h-4 w-4" />
                {isEditing.workspace ? (
                  <div className="flex items-center gap-2">
                    <Input value={names.workspace} className="h-8 w-32" />
                    <Button size="sm" variant="ghost">
                      Save
                    </Button>
                  </div>
                ) : (
                  <BreadcrumbLink href="#" className="flex items-center gap-2">
                    {names.workspace}
                    <Edit className="h-3 w-3 opacity-50" />
                  </BreadcrumbLink>
                )}
              </div>
            </BreadcrumbItem>
            <BreadcrumbSeparator />

            {/* Page */}
            <BreadcrumbItem>
              {isEditing.page ? (
                <div className="flex items-center gap-2">
                  <Input value={names.page} className="h-8 w-32" />
                  <Button size="sm" variant="ghost">
                    Save
                  </Button>
                </div>
              ) : (
                <BreadcrumbLink href="#" className="flex items-center gap-2">
                  {names.page}
                  <Edit className="h-3 w-3 opacity-50" />
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
            <BreadcrumbSeparator />

            {/* Nested Page */}
            <BreadcrumbItem>
              {isEditing.nested ? (
                <div className="flex items-center gap-2">
                  <Input value={names.nested} className="h-8 w-32" />
                  <Button size="sm" variant="ghost">
                    Save
                  </Button>
                </div>
              ) : (
                <BreadcrumbPage className="flex items-center gap-2">
                  {names.nested}
                  <Edit className="h-3 w-3 opacity-50 cursor-pointer" />
                </BreadcrumbPage>
              )}
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
