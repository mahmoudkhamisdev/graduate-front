import { Folder, Forward, MoreHorizontal, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "../ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Skeleton } from "../ui/skeleton";
import { useState } from "react";
import { useAPI } from "../../context/ApiContext";
import axios from "axios";
import { BaseUrlApi, ErrorMessage } from "../../lib/api";
import { toast } from "sonner";

const NavProjects = () => {
  const navigate = useNavigate();
  const { isMobile } = useSidebar();

  const { projectsItems } = useAPI();
  const { projects, loadingProjects, getAllProjects } = projectsItems;

  const handleDelete = async (projectId) => {
    if (!projectId) {
      toast.error("Project not found.");
      return;
    }
    try {
      const res = await axios.delete(`${BaseUrlApi}/projects/${projectId}`);
      if (res.status !== 200) {
        toast.error(res.error || "Failed to delete the project");
        return;
      }
      toast.success("Project deleted successfully");
      await getAllProjects();
      // navigate("/trash", { replace: true });
      navigate(0);
    } catch (error) {
      toast.error(
        ErrorMessage(error) || "Something went wrong. Please contact support."
      );
    }
  };

  const handleNavigation = (projectId) => {
    navigate(`/presentation/${projectId}`);
  };

  const [showMore, setShowMore] = useState(3);

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Projects</SidebarGroupLabel>
      {loadingProjects ? (
        <div className="grid gap-2 px-2">
          <Skeleton className="w-full h-4 rounded-full" />
          <Skeleton className="w-full h-4 rounded-full" />
          <Skeleton className="w-full h-4 rounded-full" />
        </div>
      ) : (
        <SidebarMenu>
          {projects.length === 0 ? (
            <SidebarMenuButton onClick={() => navigate(`/project-form`)}>
              There is no projects, Add one!
            </SidebarMenuButton>
          ) : (
            <>
              {projects.slice(0, showMore).map((item) => (
                <SidebarMenuItem key={item?.projectName}>
                  <SidebarMenuButton
                    asChild
                    onClick={() => handleNavigation(item?._id)}
                  >
                    <button className="truncate">{item?.projectName}</button>
                  </SidebarMenuButton>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <SidebarMenuAction showOnHover>
                        <MoreHorizontal />
                        <span className="sr-only">More</span>
                      </SidebarMenuAction>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      className="w-48 rounded-lg"
                      side={isMobile ? "bottom" : "right"}
                      align={isMobile ? "end" : "start"}
                    >
                      <DropdownMenuItem
                        onClick={() =>
                          handleNavigation(item?.slides, item?._id)
                        }
                      >
                        <Folder className="text-muted-foreground " />
                        <span>View Project</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Forward className="text-muted-foreground " />
                        <span>Share Project</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleDelete(item?._id)}>
                        <Trash2 className="text-muted-foreground " />
                        <span>Delete Project</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </SidebarMenuItem>
              ))}
              {projects.length > 4 && projects.length >= showMore ? (
                <SidebarMenuButton
                  onClick={() => setShowMore((prev) => prev + 3)}
                  className="flex items-center justify-between gap-4"
                >
                  Show More
                  <MoreHorizontal />
                </SidebarMenuButton>
              ) : null}
            </>
          )}
        </SidebarMenu>
      )}
    </SidebarGroup>
  );
};

export default NavProjects;
