"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "src/components/ui/button"
import { Card, CardContent } from "src/components/ui/card"
import { ArrowRight, Sparkles, Target, Zap, Users, BarChart3, Presentation } from "lucide-react"
import { MouseMoveEffect } from "../../components/common/MouseMoveEffect"
import LoginPage from "../Auth/LoginPage"
import { SignupPage } from "../Auth/SignupPage"
import { ForgotPasswordPage } from "../Auth/ForgotPasswordPage"
import { Onboarding } from "../Auth/Onboarding"
import { TranslatableText } from "../../context/TranslationSystem"

const features = [
  {
    icon: Target,
    title: "Smart Targeting",
    description: "AI-powered audience analysis and targeting recommendations",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Generate comprehensive marketing strategies in minutes",
  },
  {
    icon: BarChart3,
    title: "Data-Driven",
    description: "Insights backed by real market data and analytics",
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description: "Work together seamlessly with your marketing team",
  },
  {
    icon: Presentation,
    title: "Beautiful Presentations",
    description: "Create stunning presentations that convert",
  },
  {
    icon: Sparkles,
    title: "AI-Powered",
    description: "Leverage cutting-edge AI for marketing excellence",
  },
]

export default function WelcomeScreens() {
  const [currentView, setCurrentView] = useState("welcome")

  const renderView = () => {
    switch (currentView) {
      case "login":
        return <LoginPage />
      case "signup":
        return <SignupPage />
      case "forgot-password":
        return <ForgotPasswordPage onComplete={() => setCurrentView("login")} />
      case "on-boarding":
        return <Onboarding />
      default:
        return (
          <div className="w-full max-w-4xl mx-auto space-y-12">
            {/* Hero Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center space-y-6"
            >
              <div className="flex items-center justify-center mb-6">
                <div className="p-3 bg-main/20 rounded-full">
                  <Sparkles className="h-8 w-8 text-main" />
                </div>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight">
                <TranslatableText text="Welcome to" /> <span className="text-main">UFO</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                <TranslatableText text="Transform your marketing strategy with AI-powered insights and beautiful presentations that drive results." />
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                <Button
                  size="lg"
                  className="bg-main text-black hover:bg-main/90 text-lg px-8 py-3"
                  onClick={() => setCurrentView("login")}
                >
                  <TranslatableText text="Get Started" />
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="text-white border-zinc-700 hover:bg-zinc-800 text-lg px-8 py-3"
                  onClick={() => setCurrentView("signup")}
                >
                  <TranslatableText text="Create Account" />
                </Button>
              </div>
            </motion.div>

            {/* Features Grid */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 * index }}
                >
                  <Card className="bg-zinc-900 border-zinc-800 hover:border-zinc-700 transition-colors h-full">
                    <CardContent className="p-6 space-y-4">
                      <div className="p-2 bg-main/20 rounded-lg w-fit">
                        <feature.icon className="h-6 w-6 text-main" />
                      </div>
                      <h3 className="text-xl font-semibold text-white">
                        <TranslatableText text={feature.title} />
                      </h3>
                      <p className="text-muted-foreground">
                        <TranslatableText text={feature.description} />
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>

            {/* CTA Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-center space-y-6 bg-gradient-to-r from-zinc-900 to-zinc-800 rounded-2xl p-8 border border-zinc-700"
            >
              <h2 className="text-3xl font-bold text-white">
                <TranslatableText text="Ready to revolutionize your marketing?" />
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                <TranslatableText text="Join thousands of marketers who are already using UFO to create winning strategies and presentations." />
              </p>
              <Button
                size="lg"
                className="bg-main text-black hover:bg-main/90 text-lg px-8 py-3"
                onClick={() => setCurrentView("signup")}
              >
                <TranslatableText text="Start Your Journey" />
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </motion.div>
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-zinc-800 p-6 relative overflow-hidden">
      <MouseMoveEffect />
      <div className="relative z-10 flex items-center justify-center min-h-screen">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            {renderView()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
