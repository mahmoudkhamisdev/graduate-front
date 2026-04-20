"use client";

import { motion } from "framer-motion";
import FormField from "./../FormField";
import { containerVariants } from "../../../../utils/MotionVariants";

export default function TargetAudienceStep({ formData, updateFormData }) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <h2 className="text-2xl font-bold text-right">العملاء المستهدفين</h2>

      <FormField
        label="الجمهور المستهدف"
        name="targetAudience"
        type="textarea"
        value={formData.targetAudience}
        onChange={(value) => updateFormData("targetAudience", value)}
        placeholder="صف الجمهور المستهدف (الفئة العمرية، النوع، الموقع الجغرافي)"
        required
        hint="مثال: شباب من عمر 18-35 سنة، ذكور وإناث، في المدن الرئيسية"
      />

      <FormField
        label="الاهتمامات والسلوكيات"
        name="interestsBehaviors"
        type="textarea"
        value={formData.interestsBehaviors}
        onChange={(value) => updateFormData("interestsBehaviors", value)}
        placeholder="اكتب عن اهتمامات وسلوكيات الجمهور المستهدف"
        hint="مثل الاهتمامات المشتركة، نوع المحتوى المفضل، أوقات التفاعل"
      />

      <FormField
        label="الأهداف الديموغرافية"
        name="demographicGoals"
        type="textarea"
        value={formData.demographicGoals}
        onChange={(value) => updateFormData("demographicGoals", value)}
        placeholder="حدد الأهداف الديموغرافية لمشروعك"
        hint="مثلاً: العائلات، الشباب، الموظفين، الرياضيين، إلخ"
      />
    </motion.div>
  );
}
