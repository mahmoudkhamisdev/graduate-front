import React, { useEffect } from "react";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "src/components/ui/button";
import { Input } from "src/components/ui/input";
import { MouseMoveEffect } from "../../components/common/MouseMoveEffect";
import LoginPage from "./../Auth/LoginPage";
import { useNavigate } from "react-router-dom";
import { Rocket, BarChart, Zap, Users, ArrowRight } from "lucide-react";
import { cn } from "src/lib/utils";

const screens = [
  {
    title: "Welcome to UFO Marketing Platform",
    description: "Manage all your marketing campaigns in one place.",
    icon: Rocket,
  },
  {
    title: "Analytics Dashboard",
    description: "Track your marketing performance with real-time data.",
    icon: BarChart,
  },
  {
    title: "Campaign Builder",
    description: "Create and launch marketing campaigns easily.",
    icon: Zap,
  },
  {
    title: "Team Collaboration",
    description: "Work together with your marketing team seamlessly.",
    icon: Users,
  },
];

export function WelcomeScreens() {
  const [currentScreen, setCurrentScreen] = useState(
    Number(localStorage.getItem("welcomeScreen")) || 0
  );

  const handleNext = () => {
    setCurrentScreen((prev) => prev + 1);
  };

  useEffect(() => {
    localStorage.setItem("welcomeScreen", currentScreen);
  }, [currentScreen]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={currentScreen}
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -100 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="min-h-screen w-full"
      >
        <div className="min-h-screen w-full bg-transparent flex flex-col items-center justify-center gap-10">
          <div
            className={cn(
              "flex items-center justify-center",
              currentScreen !== screens.length - 1 && "h-64"
            )}
          >
            {React.createElement(screens[currentScreen].icon, {
              className: "w-24 h-24 text-main",
            })}
          </div>
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-white">
              {screens[currentScreen].title}
            </h1>
            <p className="text-lg text-muted-foreground ">
              {screens[currentScreen].description}
            </p>
          </div>
          {/* </div> */}

          {currentScreen === screens.length - 1 ? (
            <LoginPage />
          ) : (
            <div className="space-y-6 w-full max-w-sm mx-auto">
              <div className="flex justify-center space-x-2">
                {screens.map((_, index) => (
                  <div
                    key={index}
                    className={`h-2 rounded-full transition-all ${
                      index === currentScreen
                        ? "w-8 bg-main"
                        : "w-2 bg-zinc-700"
                    }`}
                  />
                ))}
              </div>
              <Button
                onClick={handleNext}
                className="w-full bg-main text-black hover:bg-main/90 h-12 text-lg"
              >
                Next
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
