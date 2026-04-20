import { motion } from "framer-motion";
import { itemVariants } from "../../../utils/MotionVariants";
import { Check, X } from "lucide-react";

export const PriceCard = ({ tier, price, bestFor, CTA, benefits }) => {
  return (
    <motion.div variants={itemVariants}>
      <div className="relative h-full w-full overflow-hidden rounded-2xl border border-zinc-200 p-6 shadow-sm dark:border-zinc-700 dark:bg-gradient-to-br dark:from-zinc-950/50 dark:to-zinc-900/80 dark:shadow-none">
        <div className="flex flex-col items-center border-b border-zinc-200 dark:border-zinc-700 pb-6">
          <span className="mb-6 inline-block text-zinc-600 dark:text-zinc-200">
            {tier}
          </span>
          <span className="mb-3 inline-block text-4xl font-bold text-zinc-800 dark:text-zinc-50">
            {price}
          </span>
          <span className="text-center text-zinc-500 dark:text-zinc-400">
            {bestFor}
          </span>
        </div>

        <div className="space-y-4 py-9">
          {benefits.map((b, i) => (
            <Benefit {...b} key={i} />
          ))}
        </div>

        {CTA}
      </div>
    </motion.div>
  );
};

const Benefit = ({ text, checked }) => {
  return (
    <div className="flex items-center gap-3">
      {checked ? (
        <span className="grid size-5 place-content-center rounded-full bg-ufo text-sm text-black">
          <Check className="h-3 w-3" />
        </span>
      ) : (
        <span className="grid size-5 place-content-center rounded-full bg-zinc-300 dark:bg-zinc-800 text-sm text-zinc-600 dark:text-zinc-400">
          <X className="h-3 w-3" />
        </span>
      )}
      <span className="text-sm text-zinc-700 dark:text-zinc-300">{text}</span>
    </div>
  );
};
