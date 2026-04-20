import { useState } from "react";
import { toast } from "sonner";
import { Trash, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "src/components/ui/alert-dialog";
import { useNavigate } from "react-router-dom";
import { Button } from "../../ui/button";
import { MainButton } from "../../common/Customs/MainButton";
import { SecondaryButton } from "../../common/Customs/SecondaryButton";
import { useAPI } from "../../../context/ApiContext";
import { BaseUrlApi, ErrorMessage } from "../../../lib/api";
import axios from "axios";

const DeleteAllButton = ({ Projects }) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const { trashProjectsItems } = useAPI();
  const { getAllTrashProjects } = trashProjectsItems;

  const handleDeleteAllProjects = async () => {
    setLoading(true);

    if (!Projects || Projects.length == 0) {
      setLoading(false);
      toast.error("No projects found");
      setOpen(false);
      return;
    }

    try {
      await axios.delete(`${BaseUrlApi}/projects/trash/clear`);
      await getAllTrashProjects();
      setOpen(false);
      toast.success("All projects deleted successfully");
    } catch (error) {
      toast.error(ErrorMessage(error) || "Failed to delete all projects");
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <SecondaryButton className="w-fit">
          <Trash2 className="mr-2 h-4 w-4" />
          Delete All
        </SecondaryButton>
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-background">
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete all your
            projects and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button
            variant="destructive"
            onClick={handleDeleteAllProjects}
            disabled={loading}
          >
            {loading ? "Deleting..." : "Delete All"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteAllButton;
