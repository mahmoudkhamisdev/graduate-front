import DeleteAllButton from "../../../components/Dashboard/Trash/DeleteAllButton"
import { TranslatableText } from "../../../context/TranslationSystem"

export default function TrashPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            <TranslatableText text="Trash" />
          </h1>
          <p className="text-muted-foreground">
            <TranslatableText text="Deleted projects are stored here for 30 days" />
          </p>
        </div>
        <DeleteAllButton />
      </div>

      <div className="text-center py-12">
        <p className="text-muted-foreground">
          <TranslatableText text="No deleted projects found" />
        </p>
      </div>
    </div>
  )
}
