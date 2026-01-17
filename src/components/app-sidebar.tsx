"use client";

import {
  Calendar,
  Home,
  Inbox,
  Search,
  Settings,
  Sparkles,
  Tag,
  PenTool,
  Code,
  BookOpen
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

// Menu items.
const items = [
  {
    title: "Tous les prompts",
    url: "#",
    icon: Home,
  },
  {
    title: "Favoris",
    url: "#",
    icon: Sparkles,
  },
  {
    title: "Brouillons",
    url: "#",
    icon: Inbox,
  },
];

const categories = [
  { title: "Développement", icon: Code },
  { title: "Rédaction", icon: PenTool },
  { title: "Marketing", icon: Tag },
  { title: "Documentation", icon: BookOpen },
];

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <SidebarGroup>
          <SidebarGroupLabel>Catégories</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {categories.map((cat) => (
                <SidebarMenuItem key={cat.title}>
                  <SidebarMenuButton asChild>
                    <a href="#">
                      <cat.icon />
                      <span>{cat.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}