import { Button } from "src/components/ui/button";

export function MainButton({ className = "", ...props }) {
  return (
    <Button
      {...props}
      className={`${className} bg-main text-black hover:bg-main/90 transition`}
    />
  );
}
