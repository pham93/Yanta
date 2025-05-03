import {
  Sidebar as SidebarComponent,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "~/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import {
  Search as SearchIcon,
  Home as HomeIcon,
  Inbox as InboxIcon,
  Settings as SettingsIcon,
  Trash2 as TrashIcon,
  Share2 as ShareIcon,
  Calendar as CalendarIcon,
  LucideIcon,
  Menu,
  Plus,
} from "lucide-react";
import { useState } from "react";
import IconButton from "./icon-button";
import { Link, LinkProps } from "@remix-run/react";
import { WorkspaceView } from "./workspace-view";
import { Trash } from "./trash";

interface NavItemProps {
  icon: LucideIcon;
  label: string;
  link: LinkProps["to"];
}

function NavItem({ icon: Icon, label, link }: NavItemProps) {
  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild>
        <Link to={link}>
          <Icon className="h-4 w-4 mr-2" />
          <span>{label}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

export default function Sidebar() {
  const [isCollapsed] = useState<boolean>(false);

  return (
    <SidebarComponent collapsible="none" className="h-screen w-full">
      {/* Header */}
      <SidebarHeader className="border-b">
        <SidebarMenuItem className="flex">
          <SidebarMenuButton className="flex items-center justify-between flex-row">
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarImage alt="User avatar" />
                <AvatarFallback color="green">JD</AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium">John Doe</span>
            </div>
            <div>
              <IconButton tooltipContent="Open this" asChild>
                <Link to="/">
                  <Menu className="h-4 w-4" />
                </Link>
              </IconButton>
              <IconButton tooltipContent="Add new note" asChild>
                <Link to="/">
                  <Plus className="h-3 w-3 mr-1" />
                </Link>
              </IconButton>
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarHeader>

      {/* Content */}
      <SidebarContent>
        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarMenu>
            <NavItem icon={SearchIcon} label="Search" link="/home" />
            <NavItem icon={HomeIcon} label="Home" link="/home" />
            <NavItem icon={InboxIcon} label="Inbox" link="/home" />
          </SidebarMenu>
        </SidebarGroup>
        <WorkspaceView />
        {/* Private Section */}
        {/* Bottom Navigation */}
        <SidebarGroup className="mt-auto">
          <SidebarMenu>
            <NavItem icon={SettingsIcon} label="Settings" link="/home" />
            <Trash />
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter>
        <div
          className={`flex ${isCollapsed ? "flex-col" : "justify-between"} p-2`}
        >
          <IconButton tooltipContent="Share">
            <ShareIcon className="h-4 w-4" />
          </IconButton>
          <IconButton variant="ghost" size="icon" tooltipContent="Calendar">
            <CalendarIcon className="h-4 w-4" />
          </IconButton>
        </div>
      </SidebarFooter>
    </SidebarComponent>
  );
}
