"use client";

import { motion } from "framer-motion";
import FormField from "./../FormField";
import { containerVariants } from "../../../../utils/MotionVariants";

export default function CompetitorsStep({ formData, updateFormData }) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <h2 className="text-2xl font-bold text-right">نظرة على المنافسين</h2>

      <FormField
        label="المنافسون الأساسيون"
        name="mainCompetitors"
        type="textarea"
        value={formData.mainCompetitors}
        onChange={(value) => updateFormData("mainCompetitors", value)}
        placeholder="اذكر أسماء الشركات المنافسة مباشرة أو غير مباشرة"
      />

      <FormField
        label="استراتيجيات المنافسين"
        name="competitorStrategies"
        type="textarea"
        value={formData.competitorStrategies}
        onChange={(value) => updateFormData("competitorStrategies", value)}
        placeholder="صف كيفية تواجدهم على الإنترنت أو المنصات التي يستخدمونها"
      />
    </motion.div>
  );
}
