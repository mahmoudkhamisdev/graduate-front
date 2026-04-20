import { TranslatableText } from "../../../context/TranslationSystem"

export default function SharedPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          <TranslatableText text="Shared Projects" />
        </h1>
        <p className="text-muted-foreground">
          <TranslatableText text="Projects that have been shared with you" />
        </p>
      </div>

      <div className="text-center py-12">
        <p className="text-muted-foreground">
          <TranslatableText text="No shared projects found" />
        </p>
      </div>
    </div>
  )
}
