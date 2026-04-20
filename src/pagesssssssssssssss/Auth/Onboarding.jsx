"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "src/components/ui/card"
import { User, Snowflake, Loader } from "lucide-react"
import { AgeSelector } from "../../components/Auth/AgeSelector"
import { CustomInput } from "../../components/common/Customs/CustomInput"
import { CustomSelect } from "../../components/common/Customs/CustomSelect"
import { MainButton } from "../../components/common/Customs/MainButton"
import { SecondaryButton } from "../../components/common/Customs/SecondaryButton"
import { Navigate, useLocation, useNavigate } from "react-router-dom"
import { BaseUrlApi, ErrorMessage } from "../../lib/api"
import { toast } from "sonner"
import axios from "axios"
import { TranslatableText } from "../../context/TranslationSystem"

const marketingExperiences = [
  {
    id: "beginner",
    name: "Beginner",
    icon: "🌱",
    description: "Just getting started",
  },
  {
    id: "intermediate",
    name: "Intermediate",
    icon: "🌿",
    description: "1–2 years experience",
  },
  {
    id: "advanced",
    name: "Advanced",
    icon: "🌲",
    description: "3+ years managing campaigns",
  },
  {
    id: "expert",
    name: "Expert",
    icon: "🚀",
    description: "Master strategist",
  },
]
const locations = ["North America", "Europe", "Asia", "Other"]

export function Onboarding() {
  const navigate = useNavigate()
  const location = useLocation()

  const { email, password } = location.state || {}

  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(0)
  const [userData, setUserData] = useState({
    name: "",
    age: 25,
    experience: "",
    location: "",
  })

  const handleSubmit = async () => {
    try {
      setLoading(true)
      const { data } = await axios.post(`${BaseUrlApi}/auth/register`, {
        ...userData,
        email,
        password,
      })
      toast.success("Check your email to verify your account 📧")
      navigate("/", { replace: true })
    } catch (error) {
      const result = ErrorMessage(error)
      if (typeof result !== "object") {
        toast.error(result)
      }
    } finally {
      setLoading(false)
    }
  }

  const updateUserData = (key, value) => setUserData((prev) => ({ ...prev, [key]: value }))

  const nextStep = () => {
    if (step < 3) setStep((s) => s + 1)
    else handleSubmit()
  }
  const prevStep = () => setStep((s) => s - 1)

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <label htmlFor="name" className="text-white">
                <TranslatableText text="What's your name?" />
              </label>
              <CustomInput
                Icon={User}
                id="name"
                value={userData.name}
                onChange={(e) => updateUserData("name", e.target.value)}
                placeholder="Your name"
                className="ps-10"
              />
            </div>
          </div>
        )

      case 1:
        return (
          <AgeSelector
            value={userData.age}
            onChange={(age) => updateUserData("age", age)}
            onNext={nextStep}
            onBack={prevStep}
          />
        )

      case 2:
        return (
          <div className="grid grid-cols-2 gap-4">
            {marketingExperiences.map((exp) => (
              <motion.div key={exp.id} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="h-full">
                <Card
                  className={`cursor-pointer transition-colors h-full ${
                    userData.experience === exp.id
                      ? "bg-main/10 border-main"
                      : "bg-zinc-900 border-zinc-800 hover:border-zinc-700"
                  }`}
                  onClick={() => updateUserData("experience", exp.id)}
                >
                  <CardContent className="p-6 text-center space-y-2 flex flex-col justify-between h-full">
                    <div className="text-4xl">{exp.icon}</div>
                    <div>
                      <h3 className="font-medium text-white">
                        <TranslatableText text={exp.name} />
                      </h3>
                      <p className="text-sm text-muted-foreground ">
                        <TranslatableText text={exp.description} />
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <label className="text-white">
                <TranslatableText text="Select your location" />
              </label>
              <CustomSelect
                options={locations}
                value={userData.location}
                onChange={(val) => updateUserData("location", val)}
                placeholder="Choose a location"
              />
            </div>
          </div>
        )

      default:
        return null
    }
  }

  if ((!email, !password)) return <Navigate to="/" replace />

  return (
    <div className="max-w-md mx-auto space-y-8 relative z-10 py-6">
      {/* Progress */}
      <div>
        <div className="h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
          <div className="h-full bg-main rounded-full transition-all" style={{ width: `${((step + 1) / 4) * 100}%` }} />
        </div>
        <div className="mt-2 text-sm text-muted-foreground ">{step + 1}/4</div>
      </div>

      {/* Header */}
      <div className="flex items-center gap-2">
        <Snowflake className="h-6 w-6 text-main" />
        <div>
          <h2 className="text-2xl font-bold text-white">
            {step === 0 && <TranslatableText text="Welcome to UFO" />}
            {step === 1 && <TranslatableText text="Your Age" />}
            {step === 2 && <TranslatableText text="Your Experience Level" />}
            {step === 3 && <TranslatableText text="Your Location" />}
          </h2>
          <p className="text-muted-foreground ">
            {step === 0 && <TranslatableText text="Tell us who you are" />}
            {step === 1 && <TranslatableText text="How old are you?" />}
            {step === 2 && <TranslatableText text="How seasoned are you in marketing?" />}
            {step === 3 && <TranslatableText text="Where are you based?" />}
          </p>
        </div>
      </div>

      {/* Content */}
      <motion.div
        key={step}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        {renderStep()}
      </motion.div>

      {/* Navigation */}
      {step !== 1 && (
        <div className="flex justify-between gap-4">
          {step > 0 ? (
            <SecondaryButton onClick={prevStep} className="flex-1">
              <TranslatableText text="Back" />
            </SecondaryButton>
          ) : (
            <div className="flex-1" />
          )}
          <MainButton
            onClick={nextStep}
            className="flex-1"
            disabled={
              (step === 0 && !userData.name) ||
              (step === 2 && !userData.experience) ||
              (step === 3 && !userData.location) ||
              loading
            }
          >
            {loading && <Loader className="animate-spin" />}
            {step === 3 ? <TranslatableText text="Start" /> : <TranslatableText text="Next" />}
          </MainButton>
        </div>
      )}
    </div>
  )
}
