"use client";

import { motion } from "framer-motion";
import FormField from "./../FormField";
import { containerVariants } from "../../../../utils/MotionVariants";

export default function CurrentSituationStep({ formData, updateFormData }) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <h2 className="text-2xl font-bold text-right">
        تحليل الوضع الحالي للمشروع
      </h2>

      <FormField
        label="التواجد الرقمي"
        name="digitalPresence"
        type="textarea"
        value={formData.digitalPresence}
        onChange={(value) => updateFormData("digitalPresence", value)}
        placeholder="صف تواجدك الرقمي الحالي"
        hint="روابط حسابات وسائل التواصل الاجتماعي، الموقع الإلكتروني، قنوات البيع الحالية"
      />

      <FormField
        label="التسويق السابق"
        name="previousMarketing"
        type="textarea"
        value={formData.previousMarketing}
        onChange={(value) => updateFormData("previousMarketing", value)}
        placeholder="اذكر حملات أو استراتيجيات سابقة"
        hint="ما الذي نجح وما الذي لم ينجح في حملاتك السابقة"
      />

      <FormField
        label="نقاط القوة والضعف"
        name="strengthsWeaknesses"
        type="textarea"
        value={formData.strengthsWeaknesses}
        onChange={(value) => updateFormData("strengthsWeaknesses", value)}
        placeholder="حدد نقاط القوة والضعف في مشروعك"
        hint="من منظور العميل، مثل الميزات التنافسية أو التحديات التشغيلية"
      />
    </motion.div>
  );
}
