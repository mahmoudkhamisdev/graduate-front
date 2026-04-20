import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "src/components/ui/select";

export function CustomSelect({
  options,
  placeholder = "Select…",
  className = "",
  value,
  onChange,
}) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger
        className={`${className} bg-zinc-900 border-zinc-800 text-white`}
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className="bg-zinc-900 border-zinc-800">
        {options.map((opt) => {
          const val = typeof opt === "string" ? opt : opt.value;
          const label = typeof opt === "string" ? opt : opt.label;
          return (
            <SelectItem key={val} value={val} className="text-white">
              {label}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}
