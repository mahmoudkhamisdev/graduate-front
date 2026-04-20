import { Button } from "src/components/ui/button";

export function LinkButton({ className = "", ...props }) {
  return (
    <Button
      {...props}
      variant="link"
      className={`${className} text-muted-foreground  hover:text-main transition`}
    />
  );
}
