"use client";

import { motion } from "framer-motion";
import FormField from "./../FormField";
import { containerVariants } from "../../../../utils/MotionVariants";

export default function TimelineStep({ formData, updateFormData }) {
  const timeframeOptions = [
    { value: "immediate", label: "فوري (خلال شهر)" },
    { value: "short_term", label: "قصير المدى (1-3 أشهر)" },
    { value: "medium_term", label: "متوسط المدى (3-6 أشهر)" },
    { value: "long_term", label: "طويل المدى (6-12 شهر)" },
    { value: "strategic", label: "استراتيجي (أكثر من سنة)" },
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <h2 className="text-2xl font-bold text-right">
        الوقت المتاح للنتائج (Timeline)
      </h2>

      <FormField
        label="الإطار الزمني"
        name="timeframe"
        type="select"
        value={formData.timeframe}
        onChange={(value) => updateFormData("timeframe", value)}
        placeholder="متى تتوقع رؤية نتائج أولية؟"
        options={timeframeOptions}
      />

      <FormField
        label="الفترات الموسمية أو المناسبة"
        name="seasonalPeriods"
        type="textarea"
        value={formData.seasonalPeriods}
        onChange={(value) => updateFormData("seasonalPeriods", value)}
        placeholder="هل هناك مواسم أو مناسبات خاصة تريد التركيز عليها؟"
        hint="مثل المناسبات الخاصة، أعياد، أو تخفيضات موسمية"
      />
    </motion.div>
  );
}
