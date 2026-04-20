"use client";

import { motion } from "framer-motion";
import FormField from "./../FormField";
import { containerVariants } from "../../../../utils/MotionVariants";

export default function BrandVoiceStep({ formData, updateFormData }) {
  const toneOptions = [
    { value: "formal", label: "رسمي" },
    { value: "friendly", label: "ودود" },
    { value: "professional", label: "احترافي" },
    { value: "casual", label: "غير رسمي" },
    { value: "humorous", label: "فكاهي" },
    { value: "authoritative", label: "موثوق" },
    { value: "inspirational", label: "ملهم" },
    { value: "educational", label: "تعليمي" },
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <h2 className="text-2xl font-bold text-right">
        صوت العلامة التجارية وأسلوبها (Tone of Voice)
      </h2>

      <FormField
        label="التوجه العام"
        name="generalDirection"
        type="select"
        value={formData.generalDirection}
        onChange={(value) => updateFormData("generalDirection", value)}
        placeholder="اختر التوجه العام للتواصل مع الجمهور"
        options={toneOptions}
        hint="هل التواصل مع الجمهور رسمي أم ودود؟ مرح أم جدي؟"
      />

      <FormField
        label="النبرة"
        name="tonality"
        type="textarea"
        value={formData.tonality}
        onChange={(value) => updateFormData("tonality", value)}
        placeholder="صف نبرة العلامة التجارية"
        hint="مثل فخامة، شباب، حماس، ثقة، إلخ، وهي التي تحدد طريقة الكتابة والتواصل مع الجمهور"
      />
    </motion.div>
  );
}
