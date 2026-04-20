"use client";

import { motion } from "framer-motion";
import FormField from "./../FormField";
import { containerVariants } from "../../../../utils/MotionVariants";

export default function BudgetStep({ formData, updateFormData }) {
  const budgetRangeOptions = [
    { value: "less_than_5000", label: "أقل من 5,000" },
    { value: "5000_to_10000", label: "5,000 - 10,000" },
    { value: "10000_to_25000", label: "10,000 - 25,000" },
    { value: "25000_to_50000", label: "25,000 - 50,000" },
    { value: "50000_to_100000", label: "50,000 - 100,000" },
    { value: "more_than_100000", label: "أكثر من 100,000" },
    { value: "not_specified", label: "غير محدد" },
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <h2 className="text-2xl font-bold text-right">
        الميزانية المتاحة للتسويق
      </h2>

      <FormField
        label="التقسيم المالي"
        name="financialAllocation"
        type="select"
        value={formData.financialAllocation}
        onChange={(value) => updateFormData("financialAllocation", value)}
        placeholder="اختر نطاق الميزانية المتاحة"
        options={budgetRangeOptions}
        hint="مقدار ما يمكن إنفاقه شهرياً أو سنوياً على التسويق"
      />

      <FormField
        label="الأولوية داخل الميزانية"
        name="budgetPriorities"
        type="textarea"
        value={formData.budgetPriorities}
        onChange={(value) => updateFormData("budgetPriorities", value)}
        placeholder="حدد أولويات الإنفاق ضمن الميزانية"
        hint="كالتوزيع بين التسويق على وسائل التواصل الاجتماعي والإعلانات المدفوعة أو التسويق بالمحتوى"
      />
    </motion.div>
  );
}
