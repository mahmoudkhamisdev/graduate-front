import { motion } from "framer-motion";
import { containerVariants } from "./../../utils/MotionVariants";
import { ProjectCard } from "./ProjectCard";

export default function Projects({ projects }) {  
  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {projects.map((project, id) => (
        <ProjectCard
          key={id}
          projectId={project?._id}
          title={project?.projectName}
          createdAt={project?.createdAt?.toString()}
          isDelete={project?.isDeleted}
          isPublic={project?.isPublic}
          slideData={project?.slides}
          views={project?.views}
        />
      ))}
    </motion.div>
  );
}
