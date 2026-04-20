import { motion } from "framer-motion";
import { itemVariants } from "../../../utils/MotionVariants";
import { CustomInput } from "../../common/Customs/CustomInput";
import { CustomSelect } from "../../common/Customs/CustomSelect";

export default function FormField({
  label,
  name,
  type,
  value,
  onChange,
  placeholder,
  options,
  required = false,
  hint,
}) {
  return (
    <motion.div className="space-y-2" variants={itemVariants}>
      <label htmlFor={name} className="text-right block font-medium text-sm">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      {type === "text" && (
        <CustomInput
          id={name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-right focus:outline-none focus:ring-2 focus:ring-amber-500"
          required={required}
        />
      )}

      {type === "textarea" && (
        <textarea
          id={name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex min-h-[100px] w-full rounded-md border border-input bg-zinc-900 border-zinc-800 text-white px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-zinc-900 file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
          required={required}
        />
      )}

      {type === "select" && options && (
        <CustomSelect
          value={value}
          onChange={onChange}
          required={required}
          options={options}
        />
      )}

      {hint && (
        <p className="text-sm text-muted-foreground text-right">{hint}</p>
      )}
    </motion.div>
  );
}
