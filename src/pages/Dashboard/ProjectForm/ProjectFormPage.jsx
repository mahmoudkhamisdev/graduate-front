"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "src/components/ui/button";
import { Card } from "src/components/ui/card";
import { Loader2, Wand2, Download, Upload, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { usePresentation } from "../../../context/presentation-context";
import FormComplete from "./../../../components/Dashboard/ProjectForm/form-steps/FormComplete";
import ProjectInfoStep from "./../../../components/Dashboard/ProjectForm/form-steps/ProjectInfoStep";
import TargetAudienceStep from "./../../../components/Dashboard/ProjectForm/form-steps/TargetAudienceStep";
import MarketingGoalsStep from "./../../../components/Dashboard/ProjectForm/form-steps/MarketingGoalsStep";
import CurrentSituationStep from "./../../../components/Dashboard/ProjectForm/form-steps/CurrentSituationStep";
import USPStep from "./../../../components/Dashboard/ProjectForm/form-steps/USPStep";
import BrandVoiceStep from "./../../../components/Dashboard/ProjectForm/form-steps/BrandVoiceStep";
import BudgetStep from "./../../../components/Dashboard/ProjectForm/form-steps/BudgetStep";
import CompetitorsStep from "./../../../components/Dashboard/ProjectForm/form-steps/CompetitorsStep";
import TimelineStep from "./../../../components/Dashboard/ProjectForm/form-steps/TimelineStep";
import AdditionalQuestionsStep from "./../../../components/Dashboard/ProjectForm/form-steps/AdditionalQuestionsStep";
import FormEditAi from "./../../../components/Dashboard/ProjectForm/FormEditAi";
import { containerVariants, itemVariants } from "../../../utils/MotionVariants";
import FormProgress from "./../../../components/Dashboard/ProjectForm/FormProgress";
import { MainButton } from "../../../components/common/Customs/MainButton";
import { SecondaryButton } from "../../../components/common/Customs/SecondaryButton";
import MarketingChannelsStep from "./../../../components/Dashboard/ProjectForm/form-steps/MarketingChannelsStep";
import axios from "axios";
import { BaseUrlApi, ErrorMessage } from "./../../../lib/api";
import { useAuth } from "../../../context/AuthContext";
const steps = [
  { id: "project-info", title: "معلومات عن المشروع" },
  { id: "target-audience", title: "العملاء المستهدفين" },
  { id: "marketing-goals", title: "الأهداف التسويقية" },
  { id: "current-situation", title: "تحليل الوضع الحالي" },
  { id: "usp", title: "نقاط البيع الفريدة" },
  { id: "brand-voice", title: "صوت العلامة التجارية" },
  { id: "budget", title: "الميزانية المتاحة" },
  { id: "marketing-channels", title: "القنوات التسويقية" },
  { id: "competitors", title: "نظرة على المنافسين" },
  { id: "timeline", title: "الوقت المتاح للنتائج" },
  { id: "additional-questions", title: "أسئلة إضافية" },
];

export default function ProjectFormPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const { setSlides, setProject } = usePresentation();
  const { setCredits } = useAuth();

  const [currentStep, setCurrentStep] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const [formData, setFormData] = useState({
    // Project Info
    projectName: "Ai presentaion",
    businessField: "EdTech (Educational Technology)",
    projectDescription:
      "EduBoost is a smart academic advising platform designed to help university students plan and register for courses efficiently using AI-driven guidance.",
    visionMission:
      "To empower students through technology-driven academic planning tools that enhance success and reduce registration friction.",

    // Target Audience
    targetAudience: "University students aged 18–25",
    interestsBehaviors:
      "Tech-savvy, goal-oriented, time-conscious, prefers digital solutions",
    demographicGoals:
      "Focus on undergraduate students in information systems, engineering, and computer science departments",

    // Marketing Goals
    primaryGoal:
      "Increase platform sign-ups and user engagement during course registration periods",
    shortLongTermGoals:
      "Short-term: Reach 10,000 users in first year. Long-term: Partner with 15+ universities across MENA region",
    priorities:
      "Brand awareness, user acquisition, partnership with universities",

    // Current Situation
    digitalPresence:
      "Basic landing page and social media pages on Instagram and LinkedIn",
    previousMarketing:
      "Limited to word-of-mouth and university WhatsApp groups",
    strengthsWeaknesses:
      "Strengths: Unique value proposition and user-centric design. Weaknesses: Low brand recognition and limited initial budget",

    // USP
    competitiveAdvantages:
      "AI-powered academic planning, integration with student handbooks, visual course paths",
    uniqueTechnology:
      "Custom-built recommendation engine using prerequisite and GPA mapping logic",

    // Brand Voice
    generalDirection: "Friendly, supportive, and student-first",
    tonality: "Encouraging, knowledgeable, slightly informal but professional",

    // Budget
    financialAllocation:
      "Initial seed budget of $20,000 allocated across development, marketing, and hosting",
    budgetPriorities:
      "Digital advertising, influencer partnerships, campus ambassador program",

    // Marketing Channels
    channelSelection:
      "Instagram, YouTube, email newsletters, university events",
    mostEffectiveChannels:
      "Instagram Reels, peer-to-peer referrals, targeted Google Ads",

    // Competitors
    mainCompetitors: "Cialfo, Unibuddy, traditional academic advisors",
    competitorStrategies:
      "Content marketing, partnerships with schools, webinars and guides",

    // Timeline
    timeframe: "Soft launch in August 2025, full launch in September 2025",
    seasonalPeriods:
      "Peaks during course registration windows (Jan-Feb and Jul-Aug)",

    // Additional Questions
    productAdvantages:
      "Streamlined advising, real-time course eligibility checks, tailored suggestions",
    upcomingProducts:
      "Mobile app version, GPA tracker, peer study group finder",
    preferredCampaigns:
      "Success story spotlights, student ambassador content, giveaways",
    customerRelationship:
      "Active support on WhatsApp and email, in-app feedback prompts",
    contentPreferences: "Visual explainers, short videos, student testimonials",
    audienceInteractions: "Polls, Q&As, interactive planners",
    targetingStrategy:
      "Behavioral and interest-based targeting using social ads",
    audienceInterestsOutside: "Gaming, tech trends, career development",
    measurementPreferences:
      "Monthly performance dashboards, in-depth quarterly reviews",
    reportPreferences: "Google Data Studio + PDF executive summaries",
    previousChallenges: "Low visibility among students, limited feedback loops",
    expansionConcerns: "Adapting content and features for non-IS majors",
    customerSupport:
      "In-app chat, chatbot integration planned, email support within 24h",
    customerExperience:
      "Smooth onboarding, personalized dashboards, gamified planning",
    designPreferences:
      "Minimalist, youthful, modern UI with blue and green color palette",
    photographyStyle: "Candid student life photos, high-energy campus moments",
    peakPeriods: "Two weeks before and after registration opens",
    specificTimeframes:
      "Soft launch by August 15th, promotional blitz by September 1st",
    fiveYearVision:
      "To become the leading academic support platform in the MENA region",
    expansionPlans:
      "Integrate with 50+ universities, expand to include high school planning tools",
  });

  const updateFormData = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      // window.scrollTo(0, 0);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
      setIsComplete(false);
    }
  };

  // Export project data as JSON file
  const handleExportProject = () => {
    try {
      // Create a project object with form data and slides if available
      const projectData = {
        formData,
        slides: localStorage.getItem("currentProject")
          ? JSON.parse(localStorage.getItem("currentProject")).slides
          : [],
      };

      // Convert to JSON string
      const jsonString = JSON.stringify(projectData, null, 2);

      // Create a blob and download link
      const blob = new Blob([jsonString], { type: "application/json" });
      const url = URL.createObjectURL(blob);

      // Create download link and trigger click
      const a = document.createElement("a");
      a.href = url;
      a.download = `${formData.projectName.replace(/\s+/g, "-")}-project.json`;
      document.body.appendChild(a);
      a.click();

      // Clean up
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success("Success", {
        description: "Project exported successfully!",
      });
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Error", {
        description: "Failed to export project. Please try again.",
      });
    }
  };

  // Import project from JSON file
  const handleImportProject = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Handle file selection for import
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target.result);

        // Update form data if available
        if (importedData.formData) {
          setFormData(importedData.formData);
        }

        // Update slides if available
        if (importedData.slides && importedData.slides.length > 0) {
          // Create a project object
          const projectObj = {
            _id: Math.random().toString(36).substring(2),
            title: importedData.formData.projectName || "Imported Project",
            description: importedData.formData.projectDescription || "",
            themeName: "Default",
            slides: importedData.slides,
          };

          // Set the project and slides in the store
          //   setProject(projectObj);
          setSlides(importedData.slides);

          // Save to localStorage for persistence
          localStorage.setItem("currentProject", JSON.stringify(projectObj));

          toast.success("Success", {
            description: "Project imported successfully!",
          });

          // Navigate to the presentation page
          navigate(`/presentation/${projectObj._id}`);
        } else {
          toast.success("Success", {
            description: "Project form data imported successfully!",
          });
        }
      } catch (error) {
        console.error("Import error:", error);
        toast.error("Error", {
          description: "Failed to import project. Invalid file format.",
        });
      }
    };
    reader.readAsText(file);
  };

  const goBack = () => {
    navigate("/dashboard");
  };

  const handleSubmit = async () => {
    setIsGenerating(true);

    try {
      const prompt = `
      > You now have full access to all available business data retrieved, which includes detailed information about the brand, products, services, target audiences, marketing goals, pricing, targeting locations, and competitors. Additionally, you have the following custom information:

      > Project Name: ${formData.projectName}
      > Business Field: ${formData.businessField}
      > Project Description: ${formData.projectDescription}
      > Vision & Mission: ${formData.visionMission}
      > Target Audience: ${formData.targetAudience}
      > Interests & Behaviors: ${formData.interestsBehaviors}
      > Demographic Goals: ${formData.demographicGoals}
      > Primary Marketing Goal: ${formData.primaryGoal}
      > Short & Long Term Goals: ${formData.shortLongTermGoals}
      > Priorities: ${formData.priorities}
      > Digital Presence: ${formData.digitalPresence}
      > Previous Marketing: ${formData.previousMarketing}
      > Strengths & Weaknesses: ${formData.strengthsWeaknesses}
      > Competitive Advantages: ${formData.competitiveAdvantages}
      > Unique Technology: ${formData.uniqueTechnology}
      > Brand Voice Direction: ${formData.generalDirection}
      > Brand Tonality: ${formData.tonality}
      > Marketing Budget: ${formData.financialAllocation}
      > Budget Priorities: ${formData.budgetPriorities}
      > Marketing Channels: ${formData.channelSelection}
      > Most Effective Channels: ${formData.mostEffectiveChannels}
      > Main Competitors: ${formData.mainCompetitors}
      > Competitor Strategies: ${formData.competitorStrategies}
      > Timeframe: ${formData.timeframe}
      > Seasonal Periods: ${formData.seasonalPeriods}
      > Additional Information:
      > - Product Advantages: ${formData.productAdvantages}
      > - Upcoming Products: ${formData.upcomingProducts}
      > - Preferred Campaigns: ${formData.preferredCampaigns}
      > - Customer Relationship: ${formData.customerRelationship}
      > - Content Preferences: ${formData.contentPreferences}
      > - Audience Interactions: ${formData.audienceInteractions}
      > - Targeting Strategy: ${formData.targetingStrategy}
      > - Audience Interests Outside: ${formData.audienceInterestsOutside}
      > - Measurement Preferences: ${formData.measurementPreferences}
      > - Report Preferences: ${formData.reportPreferences}
      > - Previous Challenges: ${formData.previousChallenges}
      > - Expansion Concerns: ${formData.expansionConcerns}
      > - Customer Support: ${formData.customerSupport}
      > - Customer Experience: ${formData.customerExperience}
      > - Design Preferences: ${formData.designPreferences}
      > - Photography Style: ${formData.photographyStyle}
      > - Peak Periods: ${formData.peakPeriods}
      > - Specific Timeframes: ${formData.specificTimeframes}
      > - Five Year Vision: ${formData.fiveYearVision}
      > - Expansion Plans: ${formData.expansionPlans}
      >
      > **Your task is to:**
      > Carefully analyze all the provided data, deeply understand the brand and its ecosystem, then develop a complete, professional       marketing plan that includes:
      >
      > 1. **Current Situation Analysis**
      > 2. **Define the Ideal Target Audience** (Create Buyer Personas + Segments)
      > 3. **Set SMART Marketing Goals** (Specific, Measurable, Achievable, Relevant, Time-bound)
      > 4. **Content Strategy**, including:
      >    - Content Pillars
      >    - Post Ideas and Ad Ideas
      > 5. **Advertising Campaign Strategy**, covering:
      >    - Budget Allocation
      >    - Targeting (demographic, behavioral, interests)
      >    - Platforms Selection (e.g., Facebook, Instagram, TikTok, Google Ads)
      > 6. **Full Marketing Channels Plan**:
      >    - Social Media Channels
      >    - Offline Marketing Opportunities
      >    - Influencer Collaborations
      >    - Potential Partnerships
      > 7. **Clear KPIs** for measuring each goal and tracking performance
      > 8. **Solutions and Recommendations**:
      >    - Address any detected challenges or weaknesses
      >    - Provide proactive solutions and additional suggestions from your expertise to maximize success
      >
      > ✅ Make the marketing plan detailed, practical, and ready for real-world execution, with examples and action steps wherever possible.`;

      try {
        const { data } = await axios.post(`${BaseUrlApi}/projects`, {
          ...formData,
          prompt,
        });
        setCredits(data?.data?.remainingPoints);
        toast.success("Project generated successfully!");
        setProject({
          prompt: prompt,
          title: formData.projectName,
          description: formData.projectDescription,
          content: data?.data?.responseContent,
        });

        navigate(`/chat/${data?.data?.project?._id}`, {
          state: {
            prompt: prompt,
            title: formData.projectName,
            description: formData.projectDescription,
            content: data?.data?.responseContent,
          },
        });
      } catch (error) {
        toast.error(
          ErrorMessage(error) ||
            "Failed to parse the generated content. Please try again.",
        );
      }
    } catch (error) {
      ErrorMessage(error) ||
        toast.error("Failed to generate project. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const renderStep = () => {
    // if (isComplete)
    //   return <FormComplete output={generatedOutput} projectId={projectId} />;
    switch (currentStep) {
      case 0:
        return (
          <ProjectInfoStep
            formData={formData}
            updateFormData={updateFormData}
          />
        );
      case 1:
        return (
          <TargetAudienceStep
            formData={formData}
            updateFormData={updateFormData}
          />
        );
      case 2:
        return (
          <MarketingGoalsStep
            formData={formData}
            updateFormData={updateFormData}
          />
        );
      case 3:
        return (
          <CurrentSituationStep
            formData={formData}
            updateFormData={updateFormData}
          />
        );
      case 4:
        return <USPStep formData={formData} updateFormData={updateFormData} />;
      case 5:
        return (
          <BrandVoiceStep formData={formData} updateFormData={updateFormData} />
        );
      case 6:
        return (
          <BudgetStep formData={formData} updateFormData={updateFormData} />
        );
      case 7:
        return (
          <MarketingChannelsStep
            formData={formData}
            updateFormData={updateFormData}
          />
        );
      case 8:
        return (
          <CompetitorsStep
            formData={formData}
            updateFormData={updateFormData}
          />
        );
      case 9:
        return (
          <TimelineStep formData={formData} updateFormData={updateFormData} />
        );
      case 10:
        return (
          <AdditionalQuestionsStep
            formData={formData}
            updateFormData={updateFormData}
          />
        );
      default:
        return (
          <ProjectInfoStep
            formData={formData}
            updateFormData={updateFormData}
          />
        );
    }
  };

  // useEffect(() => {
  //   if (isComplete) navigate("/chat");
  // }, [isComplete]);

  return (
    <div className="container mx-auto py-10 px-4 max-w-5xl">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-8"
      >
        <div className="flex justify-between items-center">
          <SecondaryButton onClick={goBack} variant="outline" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </SecondaryButton>

          <div className="flex gap-2">
            <SecondaryButton
              onClick={handleExportProject}
              variant="outline"
              className="mb-4"
            >
              <Download className="mr-2 h-4 w-4" />
              Export Project
            </SecondaryButton>

            <SecondaryButton
              onClick={handleImportProject}
              variant="outline"
              className="mb-4"
            >
              <Upload className="mr-2 h-4 w-4" />
              Import Project
            </SecondaryButton>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".json"
              className="hidden"
            />
          </div>
        </div>

        <motion.div variants={itemVariants} className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-primary">Project Form</h1>
          <p className="text-muted-foreground">
            Fill out the form to generate a comprehensive presentation
          </p>
        </motion.div>

        <FormProgress
          currentStep={currentStep}
          totalSteps={steps.length}
          steps={steps}
        />

        <Card className="p-6 bg-zinc-900 border border-zinc-700">
          {renderStep()}

          <div className="flex justify-between mt-8">
            <SecondaryButton
              onClick={prevStep}
              variant="outline"
              disabled={currentStep === 0}
            >
              Previous
            </SecondaryButton>

            {currentStep < steps.length - 1 ? (
              <MainButton onClick={nextStep} className="ml-auto">
                Next
              </MainButton>
            ) : (
              <MainButton
                onClick={handleSubmit}
                className="ml-auto !bg-gradient-to-tr from-main to-subMain shadow-main/50 shadow-sm hover:shadow-lg hover:shadow-main/50"
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Wand2 className="mr-2 h-4 w-4" />
                    Generate Plan
                  </>
                )}
              </MainButton>
            )}
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
