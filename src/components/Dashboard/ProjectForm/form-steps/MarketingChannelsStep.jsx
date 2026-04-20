"use client";

import { motion } from "framer-motion";
import FormField from "./../FormField";
import { containerVariants } from "../../../../utils/MotionVariants";

export default function MarketingChannelsStep({ formData, updateFormData }) {
  const primaryGoalOptions = [
    { value: "increase_sales", label: "زيادة المبيعات" },
    { value: "brand_awareness", label: "تعزيز الوعي بالعلامة التجارية" },
    { value: "audience_engagement", label: "زيادة التفاعل مع الجمهور" },
    { value: "market_expansion", label: "التوسع في السوق" },
    { value: "customer_loyalty", label: "تعزيز ولاء العملاء" },
    { value: "lead_generation", label: "توليد عملاء محتملين" },
    { value: "other", label: "أخرى" },
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <h2 className="text-2xl font-bold text-right">الأهداف التسويقية</h2>

      <FormField
        label="الهدف الرئيسي"
        name="primaryGoal"
        type="select"
        value={formData.primaryGoal}
        onChange={(value) => updateFormData("primaryGoal", value)}
        placeholder="اختر الهدف الرئيسي"
        options={primaryGoalOptions}
        required
        hint="مثل زيادة المبيعات، تعزيز التفاعل مع الجمهور، التوسع في السوق، تحسين الوعي بالعلامة التجارية"
      />

      <FormField
        label="الأهداف قصيرة وطويلة المدى"
        name="shortLongTermGoals"
        type="textarea"
        value={formData.shortLongTermGoals}
        onChange={(value) => updateFormData("shortLongTermGoals", value)}
        placeholder="حدد أهدافك قصيرة وطويلة المدى"
        hint="مثل زيادة المبيعات بنسبة 10% خلال 3 أشهر أو الوصول لعدد معين من المتابعين"
      />

      <FormField
        label="الأولويات"
        name="priorities"
        type="textarea"
        value={formData.priorities}
        onChange={(value) => updateFormData("priorities", value)}
        placeholder="حدد أولوياتك التسويقية"
        hint="مثلاً، زيادة التفاعل الاجتماعي قبل المبيعات، أو التركيز على القنوات الإعلانية"
      />
    </motion.div>
  );
}
