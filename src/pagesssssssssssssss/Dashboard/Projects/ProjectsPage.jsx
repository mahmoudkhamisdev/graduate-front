import Projects from "../../../components/Dashboard/Projects";
import { TranslatableText } from "../../../context/TranslationSystem";

export default function ProjectsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            <TranslatableText text="Projects" />
          </h1>
          <p className="text-muted-foreground">
            <TranslatableText text="Manage and organize your marketing projects" />
          </p>
        </div>
      </div>
      <Projects />
    </div>
  );
}
