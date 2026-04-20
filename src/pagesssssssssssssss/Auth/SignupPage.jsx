"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Input } from "src/components/ui/input"
import { Checkbox } from "src/components/ui/checkbox"
import { Snowflake, ArrowLeft, Loader } from "lucide-react"
import { MouseMoveEffect } from "../../components/common/MouseMoveEffect"
import { BaseUrlApi, ErrorMessage } from "../../lib/api"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { MainButton } from "../../components/common/Customs/MainButton"
import { SecondaryButton } from "../../components/common/Customs/SecondaryButton"
import { TranslatableText } from "../../context/TranslationSystem"

export function SignupPage() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleCheckboxChange = (checked) => {
    setFormData((prev) => ({ ...prev, agreeTerms: checked }))

    if (errors.agreeTerms) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors.agreeTerms
        return newErrors
      })
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = "Name is required"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid"
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    if (!formData.agreeTerms) {
      newErrors.agreeTerms = "You must agree to the terms and conditions"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (validateForm()) {
      try {
        setLoading(true)
        setErrors({})
        const { data } = await axios.post(`${BaseUrlApi}/auth/register`, formData)
        toast.success("Check your email to verify your account 📧")
        navigate("/")
      } catch (error) {
        const result = ErrorMessage(error)
        if (typeof result !== "object") {
          toast.error(result)
        }
        setErrors(result)
      } finally {
        setLoading(false)
      }
    }
  }

  const onBack = () => navigate(-1)

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-zinc-800 p-6 relative overflow-hidden">
      <MouseMoveEffect />
      <div className="max-w-md mx-auto space-y-8 relative z-10">
        {/* Back */}
        <SecondaryButton onClick={onBack} className="border-none !bg-transparent hover:!text-white/50 p-0">
          <ArrowLeft className="h-4 w-4 mr-2" /> <TranslatableText text="Back to login" />
        </SecondaryButton>

        <div className="flex items-center gap-2">
          <Snowflake className="h-6 w-6 text-main" />
          <div>
            <h2 className="text-2xl font-bold text-white">
              <TranslatableText text="Create your account" />
            </h2>
            <p className="text-muted-foreground ">
              <TranslatableText text="Join the UFO community" />
            </p>
          </div>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="name" className="text-white">
                <TranslatableText text="Full Name" />
              </label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="bg-zinc-800 border-zinc-700 text-white"
                placeholder="John Doe"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">
                  <TranslatableText text={errors.name} />
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-white">
                <TranslatableText text="Email" />
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="bg-zinc-800 border-zinc-700 text-white"
                placeholder="you@example.com"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  <TranslatableText text={errors.email} />
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-white">
                <TranslatableText text="Password" />
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                className="bg-zinc-800 border-zinc-700 text-white"
                placeholder="••••••••"
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  <TranslatableText text={errors.password} />
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="text-white">
                <TranslatableText text="Confirm Password" />
              </label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="bg-zinc-800 border-zinc-700 text-white"
                placeholder="••••••••"
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">
                  <TranslatableText text={errors.confirmPassword} />
                </p>
              )}
            </div>

            <div className="flex items-start space-x-2">
              <Checkbox
                id="terms"
                checked={formData.agreeTerms}
                onCheckedChange={handleCheckboxChange}
                className="data-[state=checked]:bg-main data-[state=checked]:text-black border border-main"
              />
              <div className="grid gap-1.5 leading-none">
                <label
                  htmlFor="terms"
                  className="text-sm font-medium leading-none text-muted-foreground  peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  <TranslatableText text="I agree to the" />{" "}
                  <a href="#" className="text-main hover:underline">
                    <TranslatableText text="terms and conditions" />
                  </a>
                </label>
                {errors.agreeTerms && (
                  <p className="text-red-500 text-xs">
                    <TranslatableText text={errors.agreeTerms} />
                  </p>
                )}
              </div>
            </div>
            <MainButton type="submit" className="w-full h-12 text-lg" disabled={loading}>
              {loading && <Loader className="animate-spin size-5" />}
              <TranslatableText text="Create Account" />
            </MainButton>
          </form>
        </motion.div>
      </div>
    </div>
  )
}
