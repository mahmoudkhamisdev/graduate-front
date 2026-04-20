"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "src/components/ui/button";
import ProjectInfoStep from "../../../components/Dashboard/ProjectForm/form-steps/ProjectInfoStep";
import TargetAudienceStep from "../../../components/Dashboard/ProjectForm/form-steps/TargetAudienceStep";
import MarketingGoalsStep from "../../../components/Dashboard/ProjectForm/form-steps/MarketingGoalsStep";
import BudgetStep from "../../../components/Dashboard/ProjectForm/form-steps/BudgetStep";
import TimelineStep from "../../../components/Dashboard/ProjectForm/form-steps/TimelineStep";
import CompetitorsStep from "../../../components/Dashboard/ProjectForm/form-steps/CompetitorsStep";
import USPStep from "../../../components/Dashboard/ProjectForm/form-steps/USPStep";
import BrandVoiceStep from "../../../components/Dashboard/ProjectForm/form-steps/BrandVoiceStep";
import MarketingChannelsStep from "../../../components/Dashboard/ProjectForm/form-steps/MarketingChannelsStep";
import CurrentSituationStep from "../../../components/Dashboard/ProjectForm/form-steps/CurrentSituationStep";
import AdditionalQuestionsStep from "../../../components/Dashboard/ProjectForm/form-steps/AdditionalQuestionsStep";
import FormComplete from "../../../components/Dashboard/ProjectForm/form-steps/FormComplete";
import FormProgress from "../../../components/Dashboard/ProjectForm/FormProgress";
import { usePresentation } from "../../../context/presentation-context";
import { useNavigate } from "react-router-dom";
import { TranslatableText } from "../../../context/TranslationSystem";

const TOTAL_STEPS = 11;

const steps = [
  { id: 1, title: "Project Info", component: ProjectInfoStep },
  { id: 2, title: "Target Audience", component: TargetAudienceStep },
  { id: 3, title: "Marketing Goals", component: MarketingGoalsStep },
  { id: 4, title: "Budget", component: BudgetStep },
  { id: 5, title: "Timeline", component: TimelineStep },
  { id: 6, title: "Competitors", component: CompetitorsStep },
  { id: 7, title: "USP", component: USPStep },
  { id: 8, title: "Brand Voice", component: BrandVoiceStep },
  { id: 9, title: "Marketing Channels", component: MarketingChannelsStep },
  { id: 10, title: "Current Situation", component: CurrentSituationStep },
  { id: 11, title: "Additional Questions", component: AdditionalQuestionsStep },
];

export default function ProjectFormPage() {
  const navigate = useNavigate();
  const { project, setProject } = usePresentation();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    // Project Info
    name: "",
    field: "",
    description: "",

    // Target Audience
    targetAudience: "",
    audienceAge: "",
    audienceLocation: "",
    audienceInterests: "",

    // Marketing Goals
    primaryGoal: "",
    secondaryGoals: [],
    successMetrics: "",

    // Budget
    budget: "",
    budgetAllocation: "",

    // Timeline
    timeline: "",
    keyMilestones: "",

    // Competitors
    competitors: "",
    competitorAnalysis: "",

    // USP
    usp: "",
    valueProposition: "",

    // Brand Voice
    brandVoice: "",
    toneOfVoice: "",

    // Marketing Channels
    marketingChannels: [],
    channelStrategy: "",

    // Current Situation
    currentSituation: "",
    challenges: "",

    // Additional Questions
    additionalInfo: "",
    specificRequirements: "",
  });

  const updateFormData = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const nextStep = () => {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Create project object
      const projectData = {
        ...formData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        status: "draft",
      };

      // Set project in context
      setProject(projectData);

      // Navigate to completion step
      setCurrentStep(TOTAL_STEPS + 1);
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.name && formData.field && formData.description;
      case 2:
        return (
          formData.targetAudience &&
          formData.audienceAge &&
          formData.audienceLocation
        );
      case 3:
        return formData.primaryGoal && formData.successMetrics;
      case 4:
        return formData.budget;
      case 5:
        return formData.timeline;
      case 6:
        return formData.competitors;
      case 7:
        return formData.usp;
      case 8:
        return formData.brandVoice;
      case 9:
        return formData.marketingChannels.length > 0;
      case 10:
        return formData.currentSituation;
      case 11:
        return true; // Additional questions are optional
      default:
        return false;
    }
  };

  const renderCurrentStep = () => {
    if (currentStep > TOTAL_STEPS) {
      return (
        <FormComplete
          formData={formData}
          onStartOver={() => {
            setCurrentStep(1);
            setFormData({
              name: "",
              field: "",
              description: "",
              targetAudience: "",
              audienceAge: "",
              audienceLocation: "",
              audienceInterests: "",
              primaryGoal: "",
              secondaryGoals: [],
              successMetrics: "",
              budget: "",
              budgetAllocation: "",
              timeline: "",
              keyMilestones: "",
              competitors: "",
              competitorAnalysis: "",
              usp: "",
              valueProposition: "",
              brandVoice: "",
              toneOfVoice: "",
              marketingChannels: [],
              channelStrategy: "",
              currentSituation: "",
              challenges: "",
              additionalInfo: "",
              specificRequirements: "",
            });
          }}
        />
      );
    }

    const StepComponent = steps[currentStep - 1]?.component;
    if (!StepComponent) return null;

    return (
      <StepComponent
        formData={formData}
        updateFormData={updateFormData}
        onNext={nextStep}
        onPrev={prevStep}
      />
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <Button
              variant="ghost"
              onClick={() => navigate("/dashboard")}
              className="text-white hover:text-white/80"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              <TranslatableText text="Back to Dashboard" />
            </Button>
            <div className="text-white text-sm">
              <TranslatableText text="Step" />{" "}
              {Math.min(currentStep, TOTAL_STEPS)}{" "}
              <TranslatableText text="of" /> {TOTAL_STEPS}
            </div>
          </div>

          {/* Progress Bar */}
          <FormProgress
            currentStep={Math.min(currentStep, TOTAL_STEPS)}
            totalSteps={TOTAL_STEPS}
          />
        </div>

        {/* Form Content */}
        <div className="max-w-2xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderCurrentStep()}
            </motion.div>
          </AnimatePresence>

          {/* Navigation Buttons */}
          {currentStep <= TOTAL_STEPS && (
            <div className="flex justify-between mt-8">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="text-white border-zinc-700 hover:bg-zinc-800"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                <TranslatableText text="Previous" />
              </Button>

              {currentStep === TOTAL_STEPS ? (
                <Button
                  onClick={handleSubmit}
                  disabled={!isStepValid() || isSubmitting}
                  className="bg-main text-black hover:bg-main/90"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      <TranslatableText text="Creating..." />
                    </>
                  ) : (
                    <>
                      <TranslatableText text="Create Project" />
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              ) : (
                <Button
                  onClick={nextStep}
                  disabled={!isStepValid()}
                  className="bg-main text-black hover:bg-main/90"
                >
                  <TranslatableText text="Next" />
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
