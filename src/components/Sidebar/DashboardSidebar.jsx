import {
  BadgeCheck,
  Bell,
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
  CreditCard,
  CreditCardIcon,
  Home,
  LayoutTemplate,
  LogOut,
  Package,
  Projector,
  Settings,
  Share2,
  Sparkles,
  Trash2,
  Users,
} from "lucide-react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "../ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import { useTheme } from "next-themes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import NavProjects from "./NavProjects";
import { useAuth } from "../../context/AuthContext";
import { Skeleton } from "../ui/skeleton";
import { useAPI } from "../../context/ApiContext";
import UserAvatar from "../common/UserAvatar";

const LogoSideBar = ({ logoName }) => {
  const { theme } = useTheme();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        >
          <Link to={"/dashboard"} className="flex items-center gap-2">
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg text-sidebar-primary-foreground">
              <img
                src={"/logo-dark.svg"}
                alt="Logo"
                className="object-contain size-8"
              />
            </div>
            <span className="truncate font-semibold uppercase">Ufo</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};

export function DashboardSidebar() {
  const { open } = useSidebar();
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <Sidebar
      variant={"floating"}
      collapsible={"icon"}
      // side={language === "ar" ? "right" : "left"}
      // dir={language === "ar" ? "rtl" : "ltr"}
    >
      <SidebarHeader>
        <LogoSideBar logoName={"UFO"} />
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <MenuItemComponent
                Icon={Home}
                url={"/dashboard"}
                title={"Dashboard"}
              />
              {user?.role === "admin" && (
                <>
                  <MenuItemComponent
                    Icon={Users}
                    url="/admin/users"
                    title="Users"
                  />
                  <MenuItemComponent
                    Icon={CreditCard}
                    url="/admin/billings"
                    title="Billings"
                  />
                  <MenuItemComponent
                    Icon={Package}
                    url="/admin/plans"
                    title="Plans"
                  />
                  <MenuItemComponent
                    Icon={LayoutTemplate}
                    url="/admin/templetes"
                    title="Templates"
                  />
                </>
              )}
              <MenuItemComponent
                Icon={Projector}
                url={"/projects"}
                title={"Projects"}
              />
              <MenuItemComponent
                Icon={Share2}
                url={"/shared"}
                title={"Shared"}
              />
              <MenuItemComponent Icon={Trash2} url={"/trash"} title={"Trash"} />
              <MenuItemComponent
                Icon={Settings}
                url={"/settings"}
                title={"Settings"}
              />
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* NavProjects */}
        <NavProjects />
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          {!user?.subscription?.isActive && (
            <SidebarMenuItem
              className={`dark:bg-zinc-900 border dark:border-zinc-800 rounded-xl p-4 space-y-2 ${
                !open && "hidden"
              }`}
            >
              <p className="font-semibold text-lg">
                Get <span className="text-ufo">Creative AI</span>
              </p>
              <p className="text-sm text-muted-foreground ">
                Unlock all features including AI and More
              </p>
              <div className="p-px rounded-full bg-ufo">
                <Button
                  className="rounded-full w-full bg-zinc-900 text-primary hover:bg-accent h-10"
                  onClick={() => navigate("pricing")}
                >
                  Upgrade
                </Button>
              </div>
            </SidebarMenuItem>
          )}
          <SidebarMenuItem>
            <NavUser />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

const MenuItemComponent = ({ title, url, Icon }) => (
  <SidebarMenuItem>
    <SidebarMenuButton asChild tooltip={title}>
      <NavLink to={url}>
        <Icon />
        <span>{title}</span>
      </NavLink>
    </SidebarMenuButton>
  </SidebarMenuItem>
);

const CollapsComponent = ({ Icon, title, items }) => {
  const ArrowIcon = ChevronRight;

  return (
    <Collapsible asChild className="group/collapsible">
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton tooltip={title}>
            {Icon && <Icon />}
            <span>{title}</span>
            {/* <ArrowIcon
              className={`${
                language === "ar"
                  ? "mr-auto group-data-[state=open]/collapsible:-rotate-90"
                  : "ml-auto group-data-[state=open]/collapsible:rotate-90"
              } transition-transform duration-200`}
            /> */}
          </SidebarMenuButton>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <SidebarMenuSub>
            {items.map((item) => (
              <SidebarMenuSubItem key={item.title} tooltip={item.title}>
                <SidebarMenuSubButton asChild>
                  <Link to={item.url}>
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  );
};

export function NavUser() {
  const { user, loading, logout } = useAuth();
  const { isMobile } = useSidebar();
  const navigate = useNavigate();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            {loading ? (
              <Skeleton className={"w-full h-12"} />
            ) : (
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <UserAvatar name={user?.name} image={user?.avatar} />
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold capitalize">
                    {user?.name}
                  </span>
                  <span className="truncate text-xs">{user?.email}</span>
                </div>
                <ChevronsUpDown className="ml-auto size-4" />
              </SidebarMenuButton>
            )}
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <UserAvatar
                  name={user?.name}
                  image={user?.avatar || "/favicon.ico"}
                />

                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{user?.name}</span>
                  <span className="truncate text-xs">{user?.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => navigate("/pricing")}>
                <Sparkles />
                Upgrade to Pro
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem
                onClick={() =>
                  navigate("/settings", { state: { tab: "profile" } })
                }
              >
                <BadgeCheck />
                Account
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  navigate("/settings", { state: { tab: "billing" } })
                }
              >
                <CreditCardIcon />
                Billing
              </DropdownMenuItem>
              {/* <DropdownMenuItem>
                <Bell />
                Notifications
              </DropdownMenuItem> */}
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout}>
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
