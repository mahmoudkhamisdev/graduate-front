import { Input } from "src/components/ui/input";

export function CustomInput({ className = "", Icon, ...props }) {
  return (
    <div className="relative">
      <Input
        {...props}
        className={`${className} bg-zinc-900 border-zinc-800 text-white`}
      />
      {Icon && (
        <Icon className="absolute inset-0 flex items-center justify-center h-full ms-2 text-muted-foreground " />
      )}
    </div>
  );
}
