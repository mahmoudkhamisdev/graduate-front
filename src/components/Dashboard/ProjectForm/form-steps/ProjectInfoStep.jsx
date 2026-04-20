import { motion } from "framer-motion";
import FormField from "./../FormField";
import { containerVariants } from "../../../../utils/MotionVariants";

export default function ProjectInfoStep({ formData, updateFormData }) {
  const businessFields = [
    { value: "retail", label: "تجزئة" },
    { value: "education", label: "تعليم" },
    { value: "health", label: "صحة" },
    { value: "technology", label: "تكنولوجيا" },
    { value: "restaurants", label: "مطاعم" },
    { value: "fashion", label: "أزياء" },
    { value: "beauty", label: "تجميل" },
    { value: "fitness", label: "لياقة بدنية" },
    { value: "entertainment", label: "ترفيه" },
    { value: "other", label: "أخرى" },
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <h2 className="text-2xl font-bold text-right">معلومات عن المشروع</h2>

      <FormField
        label="اسم المشروع"
        name="projectName"
        type="text"
        value={formData.projectName}
        onChange={(value) => updateFormData("projectName", value)}
        placeholder="أدخل اسم المشروع"
        required
      />

      <FormField
        label="مجال العمل"
        name="businessField"
        type="select"
        value={formData.businessField}
        onChange={(value) => updateFormData("businessField", value)}
        placeholder="اختر مجال العمل"
        options={businessFields}
        required
        hint="مثل: تجزئة، تعليم، صحة، تكنولوجيا، مطاعم، إلخ"
      />

      <FormField
        label="وصف مختصر للمشروع"
        name="projectDescription"
        type="textarea"
        value={formData.projectDescription}
        onChange={(value) => updateFormData("projectDescription", value)}
        placeholder="اكتب وصفاً مختصراً عن مشروعك"
        required
      />

      <FormField
        label="الرؤية والرسالة"
        name="visionMission"
        type="textarea"
        value={formData.visionMission}
        onChange={(value) => updateFormData("visionMission", value)}
        placeholder="اكتب رؤية ورسالة مشروعك - تساعد على فهم طبيعة العلامة والقيم الأساسية"
        hint="تساعد على فهم طبيعة العلامة والقيم الأساسية"
      />
    </motion.div>
  );
}
