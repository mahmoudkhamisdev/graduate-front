import { motion } from "framer-motion";
import FormField from "./../FormField";
import { containerVariants } from "../../../../utils/MotionVariants";

export default function USPStep({ formData, updateFormData }) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <h2 className="text-2xl font-bold text-right">
        نقاط البيع الفريدة (Unique Selling Points)
      </h2>

      <FormField
        label="الميزات التنافسية"
        name="competitiveAdvantages"
        type="textarea"
        value={formData.competitiveAdvantages}
        onChange={(value) => updateFormData("competitiveAdvantages", value)}
        placeholder="ما الذي يجعل مشروعك مميزاً عن المنافسين؟"
        required
      />

      <FormField
        label="التكنولوجيا أو المكونات الفريدة"
        name="uniqueTechnology"
        type="textarea"
        value={formData.uniqueTechnology}
        onChange={(value) => updateFormData("uniqueTechnology", value)}
        placeholder="إذا كان المنتج يعتمد على تقنيات أو موارد فريدة"
      />
    </motion.div>
  );
}
