"use client";

import { motion } from "framer-motion";
import FormField from './../FormField';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "src/components/ui/accordion";
import { containerVariants } from "../../../../utils/MotionVariants";

export default function AdditionalQuestionsStep({ formData, updateFormData }) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <h2 className="text-2xl font-bold text-right">أسئلة إضافية</h2>
      <p className="text-muted-foreground text-right">
        هذه الأسئلة اختيارية ولكنها ستساعدنا في فهم مشروعك بشكل أفضل
      </p>

      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="products">
          <AccordionTrigger className="text-right">
            بخصوص المشروع والمنتجات
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <FormField
                label="هل المنتج أو الخدمة يقدم ميزة معينة غير متوفرة في السوق حالياً؟"
                name="productAdvantages"
                type="textarea"
                value={formData.productAdvantages}
                onChange={(value) => updateFormData("productAdvantages", value)}
                placeholder="اذكر الميزات الفريدة لمنتجك أو خدمتك"
              />

              <FormField
                label="هل هناك منتجات أو خدمات أخرى مخطط إطلاقها قريباً؟"
                name="upcomingProducts"
                type="textarea"
                value={formData.upcomingProducts}
                onChange={(value) => updateFormData("upcomingProducts", value)}
                placeholder="اذكر المنتجات أو الخدمات المستقبلية"
              />
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="marketing">
          <AccordionTrigger className="text-right">
            تفضيلات وأساليب التسويق
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <FormField
                label="هل تفضل نوعاً معيناً من الحملات؟"
                name="preferredCampaigns"
                type="textarea"
                value={formData.preferredCampaigns}
                onChange={(value) =>
                  updateFormData("preferredCampaigns", value)
                }
                placeholder="مثلاً، حملات الفيديو، الإعلانات التفاعلية، التسويق بالمؤثرين"
              />

              <FormField
                label="هل تود التركيز على بناء علاقة طويلة الأمد مع العملاء أم على تحقيق مكاسب سريعة؟"
                name="customerRelationship"
                type="textarea"
                value={formData.customerRelationship}
                onChange={(value) =>
                  updateFormData("customerRelationship", value)
                }
                placeholder="اشرح استراتيجيتك في بناء العلاقات مع العملاء"
              />

              <FormField
                label="ما هي المنصات أو أنواع المحتوى التي تعتقد أنها تنسجم مع قيم العلامة التجارية؟"
                name="contentPreferences"
                type="textarea"
                value={formData.contentPreferences}
                onChange={(value) =>
                  updateFormData("contentPreferences", value)
                }
                placeholder="اذكر المنصات وأنواع المحتوى المفضلة"
              />
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="audience">
          <AccordionTrigger className="text-right">
            توجهات الجمهور وتفاعلهم
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <FormField
                label="هل لديكم معلومات حول أسباب اختيار العملاء لكم عن المنافسين؟"
                name="audienceInteractions"
                type="textarea"
                value={formData.audienceInteractions}
                onChange={(value) =>
                  updateFormData("audienceInteractions", value)
                }
                placeholder="اذكر أسباب تفضيل العملاء لمنتجاتك أو خدماتك"
              />

              <FormField
                label="هل هناك فئة معينة داخل الجمهور المستهدف تتطلب استهدافاً خاصاً أو استراتيجية مخصصة؟"
                name="targetingStrategy"
                type="textarea"
                value={formData.targetingStrategy}
                onChange={(value) => updateFormData("targetingStrategy", value)}
                placeholder="صف الفئات الخاصة واستراتيجيات استهدافها"
              />

              <FormField
                label="ما هي اهتمامات الجمهور المستهدف خارج نطاق منتجاتك؟"
                name="audienceInterestsOutside"
                type="textarea"
                value={formData.audienceInterestsOutside}
                onChange={(value) =>
                  updateFormData("audienceInterestsOutside", value)
                }
                placeholder="مثل هوايات، فعاليات، محتوى معين"
              />
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="measurement">
          <AccordionTrigger className="text-right">
            القياس والتقييم
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <FormField
                label="كيف تفضل أن تتم متابعة وقياس النجاح؟"
                name="measurementPreferences"
                type="textarea"
                value={formData.measurementPreferences}
                onChange={(value) =>
                  updateFormData("measurementPreferences", value)
                }
                placeholder="ما هي المؤشرات الأساسية التي تود التركيز عليها؟"
              />

              <FormField
                label="هل تفضل تقارير دورية محددة مثل أسبوعية أو شهرية؟"
                name="reportPreferences"
                type="textarea"
                value={formData.reportPreferences}
                onChange={(value) => updateFormData("reportPreferences", value)}
                placeholder="حدد تفضيلاتك للتقارير الدورية"
              />
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="challenges">
          <AccordionTrigger className="text-right">
            العقبات والتحديات
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <FormField
                label="ما هي أبرز التحديات التي واجهتك في التسويق سابقاً؟"
                name="previousChallenges"
                type="textarea"
                value={formData.previousChallenges}
                onChange={(value) =>
                  updateFormData("previousChallenges", value)
                }
                placeholder="سواء كانت مالية أو تقنية أو لوجستية"
              />

              <FormField
                label="هل هناك مخاوف معينة بشأن التوسع في السوق أو استهداف جمهور جديد؟"
                name="expansionConcerns"
                type="textarea"
                value={formData.expansionConcerns}
                onChange={(value) => updateFormData("expansionConcerns", value)}
                placeholder="اذكر مخاوفك بشأن التوسع أو استهداف جمهور جديد"
              />
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="customer_service">
          <AccordionTrigger className="text-right">
            خدمات العملاء وتجربة الشراء
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <FormField
                label="كيف يتم دعم العملاء بعد الشراء؟"
                name="customerSupport"
                type="textarea"
                value={formData.customerSupport}
                onChange={(value) => updateFormData("customerSupport", value)}
                placeholder="هل هناك نظام للاحتفاظ بالعملاء وإعادة استهدافهم؟"
              />

              <FormField
                label="هل لديكم إجراءات معينة لتحسين تجربة العملاء أو إدارة ملاحظاتهم وشكاويهم؟"
                name="customerExperience"
                type="textarea"
                value={formData.customerExperience}
                onChange={(value) =>
                  updateFormData("customerExperience", value)
                }
                placeholder="صف إجراءات تحسين تجربة العملاء"
              />
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="design">
          <AccordionTrigger className="text-right">
            تفضيلات خاصة بالصورة والمظهر العام
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <FormField
                label="هل تفضل ألواناً أو تصميماً معيناً يعبر عن العلامة التجارية؟"
                name="designPreferences"
                type="textarea"
                value={formData.designPreferences}
                onChange={(value) => updateFormData("designPreferences", value)}
                placeholder="صف الألوان والتصاميم المفضلة"
              />

              <FormField
                label="هل هناك أسلوب معين للتصوير أو عرض المنتج تريد الحفاظ عليه؟"
                name="photographyStyle"
                type="textarea"
                value={formData.photographyStyle}
                onChange={(value) => updateFormData("photographyStyle", value)}
                placeholder="صف أسلوب التصوير المفضل"
              />
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="timeline">
          <AccordionTrigger className="text-right">
            الجدول الزمني للتطوير
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <FormField
                label="هل هناك فترات ذروة للمنتجات أو مواسم معينة للتسويق تود التركيز عليها؟"
                name="peakPeriods"
                type="textarea"
                value={formData.peakPeriods}
                onChange={(value) => updateFormData("peakPeriods", value)}
                placeholder="حدد فترات الذروة والمواسم المهمة"
              />

              <FormField
                label="هل هناك وقت محدد لتحقيق أهداف معينة؟"
                name="specificTimeframes"
                type="textarea"
                value={formData.specificTimeframes}
                onChange={(value) =>
                  updateFormData("specificTimeframes", value)
                }
                placeholder="حدد الأوقات المحددة لتحقيق أهدافك"
              />
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="future">
          <AccordionTrigger className="text-right">
            التوقعات وأهداف المستقبل
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <FormField
                label="ما هو تصورك للعلامة التجارية بعد خمس سنوات؟"
                name="fiveYearVision"
                type="textarea"
                value={formData.fiveYearVision}
                onChange={(value) => updateFormData("fiveYearVision", value)}
                placeholder="مثلاً، أن تصبح مشهورة محلياً أو عالمياً"
              />

              <FormField
                label="هل لديك نية للتوسع في خدمات أخرى أو أسواق جديدة؟"
                name="expansionPlans"
                type="textarea"
                value={formData.expansionPlans}
                onChange={(value) => updateFormData("expansionPlans", value)}
                placeholder="صف خطط التوسع المستقبلية"
              />
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </motion.div>
  );
}
