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
import { Link } from "@remix-run/react";

interface NavItemProps {
  icon: LucideIcon;
  label: string;
}

const NavItem: React.FC<NavItemProps> = ({ icon: Icon, label }) => (
  <SidebarMenuItem>
    <SidebarMenuButton>
      <Icon className="h-4 w-4 mr-2" />
      <span>{label}</span>
    </SidebarMenuButton>
  </SidebarMenuItem>
);

export default function Sidebar(): JSX.Element {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  return (
    <SidebarComponent collapsible="offcanvas" className="h-screen">
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
            <NavItem icon={SearchIcon} label="Search" />
            <NavItem icon={HomeIcon} label="Home" />
            <NavItem icon={InboxIcon} label="Inbox" />
          </SidebarMenu>
        </SidebarGroup>

        {/* Private Section */}
        <SidebarGroup>
          {!isCollapsed && (
            <h3 className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Private
            </h3>
          )}
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton>
                {!isCollapsed && "Getting Started"}
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton>
                {!isCollapsed && "Weekly To Do List"}
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton>
                {!isCollapsed && "Monthly Budget"}
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        {/* Bottom Navigation */}
        <SidebarGroup className="mt-auto">
          <SidebarMenu>
            <NavItem icon={SettingsIcon} label="Settings" />
            <NavItem icon={TrashIcon} label="Trash" />
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
