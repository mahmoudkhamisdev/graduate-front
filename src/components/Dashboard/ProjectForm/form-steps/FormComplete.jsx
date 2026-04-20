"use client";

import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "src/components/ui/card";
import { Button } from "src/components/ui/button";
import { Download, Share, Presentation } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { containerVariants, itemVariants } from "../../../../utils/MotionVariants";

export default function FormComplete({ output, projectId }) {
  const navigate = useNavigate();

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([output], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "marketing-strategy.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

    toast.success("تم تنزيل الاستراتيجية بنجاح");
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: "استراتيجية التسويق",
          text: output,
        })
        .catch((error) => console.log("Error sharing:", error));
    } else {
      navigator.clipboard.writeText(output);
      toast.success("تم نسخ الاستراتيجية إلى الحافظة");
    }
  };

  const handleViewPresentation = () => {
    // Save the generated strategy to the store
    // setGeneratedStrategy(output);
    // Navigate to the presentation page
    navigate(`/presentation/${projectId}`);
    toast.success("جاري تحميل العرض التقديمي");
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <motion.div variants={itemVariants} className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-primary">
          تم إنشاء الاستراتيجية بنجاح!
        </h2>
        <p className="text-muted-foreground">
          يمكنك الآن مراجعة الاستراتيجية التسويقية المقترحة
        </p>
      </motion.div>

      <Card className="bg-primary/5 border-primary/20">
        <CardHeader>
          <CardTitle className="text-right">
            استراتيجية التسويق المقترحة
          </CardTitle>
          <CardDescription className="text-right">
            بناءً على المعلومات التي قدمتها
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-white dark:bg-gray-900 p-4 rounded-lg border text-right whitespace-pre-line">
            {output}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-center gap-4">
        <Button onClick={handleDownload} variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          تنزيل
        </Button>
        <Button onClick={handleShare} className="gap-2">
          <Share className="h-4 w-4" />
          مشاركة
        </Button>
        <Button
          onClick={handleViewPresentation}
          variant="default"
          className="gap-2 bg-primary"
        >
          <Presentation className="h-4 w-4" />
          عرض تقديمي
        </Button>
      </div>
    </motion.div>
  );
}
