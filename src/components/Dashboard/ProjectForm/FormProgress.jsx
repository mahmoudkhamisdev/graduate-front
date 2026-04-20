import { motion } from "framer-motion";
import { cn } from "src/lib/utils";

export default function FormProgress({ currentStep, totalSteps, steps }) {
  const progress = ((currentStep + 1) / totalSteps) * 100;

  return (
    <div className="w-full space-y-2">
      <div className="flex justify-between text-sm text-muted-foreground">
        <span>
          الخطوة {currentStep + 1} من {totalSteps}
        </span>
        <span>{steps[currentStep]?.title}</span>
      </div>
      <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-main from-50% to-subMain"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>
      <div className="flex justify-between mt-2">
        {steps.map((step, index) => (
          <div
            key={step.id}
            className={cn(
              "flex flex-col items-center",
              "transition-all duration-200",
              index <= currentStep ? "text-primary" : "text-muted-foreground"
            )}
          >
            <div
              className={cn(
                "w-3 h-3 rounded-full mb-1",
                index < currentStep
                  ? "bg-subMain"
                  : index === currentStep
                  ? "bg-main"
                  : "bg-muted-foreground/30"
              )}
            />
            {index === 0 ||
            index === totalSteps - 1 ||
            index === currentStep ? (
              <span className="text-xs hidden md:block">{step.title}</span>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
