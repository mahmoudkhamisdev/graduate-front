"use client";

import axios from "axios";
import { motion } from "framer-motion";
import { ImageIcon } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "src/components/ui/button";
import { cn } from "src/lib/utils";
import { timeAgo } from "src/utils/DateTimeFormate";
import { BaseUrlApi, ErrorMessage } from "../../lib/api";
import { itemVariants } from "./../../utils/MotionVariants";
import SlideView from "./../Presentation/slide-view";
import AlertDialog from "./AlertDialog";
import { useAPI } from "../../context/ApiContext";

export const ProjectCard = ({
  createdAt,
  projectId,
  slideData,
  title,
  isDelete = false,
  isPublic = false,
  views = 0,
}) => {
  const navigate = useNavigate();
  const { projectsItems, trashProjectsItems } = useAPI();
  const { getAllProjects } = projectsItems;
  const { getAllTrashProjects } = trashProjectsItems;

  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  // const { setSlides } = useStore();

  const handleNavigation = () => {
    // setSlides(JSON.parse(JSON.stringify(slideData)));
    navigate(`/presentation/${projectId}`);
  };

  const handleRecover = async () => {
    setLoading(true);
    if (!projectId) {
      setLoading(false);
      toast.error("Project not found.");
      return;
    }
    try {
      const res = await axios.put(
        `${BaseUrlApi}/projects/${projectId}/restore`
      );
      if (res.status !== 200) {
        toast.error(res.error || "Something went wrong");
        return;
      }
      setOpen(false);
      toast.success("Project recovered successfully");
      await getAllProjects();
      navigate("/projects", { replace: true });
      await getAllTrashProjects();
    } catch (error) {
      toast.error(
        ErrorMessage(error) || "Something went wrong. Please contact support."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    if (!projectId) {
      setLoading(false);
      toast.error("Error", {
        description: "Project not found.",
      });
      return;
    }
    try {
      const res = await axios.delete(`${BaseUrlApi}/projects/${projectId}`);
      if (res.status !== 200) {
        toast.error(res.error || "Failed to delete the project");
        return;
      }
      setOpen(false);
      toast.success("Project deleted successfully");
      await getAllProjects();
      navigate("/trash", { replace: true });
      await getAllTrashProjects();
    } catch (error) {
      toast.error(
        ErrorMessage(error) || "Something went wrong. Please contact support."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className={`group w-full flex flex-col gap-y-3 rounded-xl p-3 transition-colors ${
        !isDelete && "hover:bg-muted/50"
      }`}
      variants={itemVariants}
    >
      <div className="relative aspect-[16/10] rounded-lg cursor-pointer">
        {isPublic && (
          <div className="absolute top-2 right-1 z-10 transform rotate-12">
            <div className="bg-primary text-primary-foreground px-2 py-1 rounded-full text-xs font-medium shadow-md">
              {views} Views
            </div>
          </div>
        )}
        <div
          className={cn(
            "w-full relative aspect-[16/9] rounded-lg overflow-hidden transition-all duration-200 p-2"
          )}
          onClick={handleNavigation}
        >
          {slideData.length !== 0 ? (
            <div
              className="transform scale-[0.25] origin-top-left overflow-hidden"
              style={{ width: 960, height: 540 }}
            >
              <SlideView
                slide={slideData[0] || {}}
                isActive={true}
                isPresentationMode={false}
                isThumbnail={true}
              />
            </div>
          ) : (
            <div className="w-full h-full bg-gray-400 flex justify-center items-center rounded-lg">
              <ImageIcon className="w-6 h-6 text-gray-500" />
            </div>
          )}
        </div>

        <div className="w-full">
          <div className="space-y-1">
            <div className=" flex items-center gap-2 flex-1">
              <h3 className="font-semibold text-base text-primary line-clamp-1">
                {title}
              </h3>
            </div>
            <div className="flex w-full justify-between items-center gap-2">
              <p
                className="text-sm text-muted-foreground "
                suppressHydrationWarning
              >
                {timeAgo(createdAt)}
              </p>
              {isDelete ? (
                <AlertDialog
                  description={
                    "This will recover your project and restore your data."
                  }
                  className="bg-green-500 text-white dark:bg-green-600 hover:bg-green-600 dark:hover:bg-green-700"
                  loading={loading}
                  open={open}
                  onClick={handleRecover}
                  handleOpen={() => setOpen(!open)}
                >
                  <Button
                    size="sm"
                    variant="ghost"
                    className="bg-background-80 dark:hover:bg-background-90 border"
                    disabled={loading}
                  >
                    Recover
                  </Button>
                </AlertDialog>
              ) : (
                <AlertDialog
                  description="This will delete your project and send to trash."
                  className="bg-red-500 text-white dark:bg-red-600 hover:bg-red-600 dark:hover:bg-red-700"
                  onClick={handleDelete}
                  loading={loading}
                  open={open}
                  handleOpen={() => setOpen(!open)}
                >
                  <Button
                    size="sm"
                    variant="ghost"
                    className="bg-background-80 dark:hover:bg-background-90 border"
                    disabled={loading}
                  >
                    Delete
                  </Button>
                </AlertDialog>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
