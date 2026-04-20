"use client"

import { Loader2 } from "lucide-react"
import { cn } from "src/lib/utils"
import { motion } from "framer-motion"
import { containerVariants, itemVariants } from "../../../utils/MotionVariants"
import { PriceCard } from "../../../components/Dashboard/Price/PriceCard"
import PriceCardSkeleton from "../../../components/common/PriceCardSkeleton"
import { useAPI } from "../../../context/ApiContext"
import { BaseUrlApi, ErrorMessage } from "../../../lib/api"
import axios from "axios"
import { toast } from "sonner"
import { useState } from "react"
import { SecondaryButton } from "./../../../components/common/Customs/SecondaryButton"
import { TranslatableText } from "../../../context/TranslationSystem"

export const PricingPage = () => {
  const { plansItems } = useAPI()
  const { plans, loadingPlans } = plansItems

  const [loading, setLoading] = useState(false)
  const handleSendPayment = async (planId) => {
    setLoading(true)
    try {
      const { data } = await axios.post(`${BaseUrlApi}/billing/create-payment`, { planId })
      localStorage.setItem("invoiceId", data?.data?.invoiceId)
      localStorage.setItem("paymentUrl", data?.data?.paymentUrl)
      window.location.href = data?.data?.paymentUrl
    } catch (error) {
      toast.error(ErrorMessage(error))
      localStorage.removeItem("invoiceId")
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.section variants={containerVariants} initial="hidden" animate="visible">
      <div className="relative z-10 mx-auto max-w-5xl py-10">
        <motion.div variants={itemVariants} className="mb-12 space-y-3">
          <h2 className="text-center text-3xl font-semibold leading-tight sm:text-4xl md:text-5xl">
            <TranslatableText text="Pricing" />
          </h2>
          <p className="text-center text-base text-zinc-600 dark:text-zinc-400 md:text-lg">
            <TranslatableText text="Use it for free for yourself, upgrade when your team needs advanced control." />
          </p>
        </motion.div>

        <motion.div variants={containerVariants} className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {loadingPlans
            ? [1, 2, 3].map((_, i) => <PriceCardSkeleton key={i} />)
            : plans.map((plan) => (
                <PriceCard
                  key={plan._id}
                  tier={plan.name}
                  price={`$${plan.price}`}
                  bestFor={plan.description}
                  CTA={
                    <SecondaryButton
                      className={`w-full rounded-md h-12 text-lg font-semibold ${
                        plan.name === "Enterprise" ? "ring-1 ring-main shadow-lg shadow-main/50" : "border"
                      }`}
                      onClick={() => handleSendPayment(plan._id)}
                      disabled={loading}
                    >
                      {loading && <Loader2 className="animate-spin" />}
                      <TranslatableText text="Get started" />
                    </SecondaryButton>
                  }
                  benefits={plan.features.slice(0, 10).map((feature) => ({
                    text: feature.text,
                    checked: feature.checked,
                  }))}
                />
              ))}
        </motion.div>
      </div>
    </motion.section>
  )
}

const GhostButton = ({ children, className, ...rest }) => {
  return (
    <button
      className={cn(
        "rounded-md px-4 py-2 text-lg font-semibold text-zinc-700 dark:text-zinc-100 transition-all hover:scale-105 hover:bg-zinc-100 dark:hover:bg-zinc-800 active:scale-95",
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  )
}
