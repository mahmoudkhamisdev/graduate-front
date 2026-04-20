import { Button } from "src/components/ui/button";

export function SecondaryButton({ className = "", ...props }) {
  return (
    <Button
      {...props}
      variant="outline"
      className={`${className} bg-zinc-900 border-zinc-800 text-white hover:bg-zinc-800 hover:text-white`}
    />
  );
}
