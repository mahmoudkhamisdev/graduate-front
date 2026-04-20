"use client"
import PaymentStatus from "../../../../components/Dashboard/Price/Payment/PaymentStatus"
import { Link, Navigate, useLocation } from "react-router-dom"
import { toast } from "sonner"
import { BaseUrlApi, ErrorMessage } from "../../../../lib/api"
import axios from "axios"
import { useEffect, useState } from "react"
import { MainButton } from "../../../../components/common/Customs/MainButton"
import { SecondaryButton } from "../../../../components/common/Customs/SecondaryButton"
import { Loader2 } from "lucide-react"
import { useAuth } from "../../../../context/AuthContext"
import { useAPI } from "../../../../context/ApiContext"
import { TranslatableText } from "../../../../context/TranslationSystem"

export default function PaymentSuccess() {
  const location = useLocation()
  const { getProfile } = useAuth()
  const { billingHistoryItems } = useAPI()
  const { getAllBillingHistory } = billingHistoryItems

  const PaymentId = new URLSearchParams(location.search).get("paymentId")
  const InvoiceId = localStorage.getItem("invoiceId")
  const PaymentUrl = localStorage.getItem("paymentUrl")

  const [paymentData, setPaymentData] = useState([])
  const [loading, setLoading] = useState(true)
  const PaymentCallback = async () => {
    setLoading(true)
    try {
      const { data } = await axios.post(`${BaseUrlApi}/billing/payment-callback`, {
        InvoiceId,
        PaymentId,
      })
      setPaymentData(data?.paymentData)
      localStorage.removeItem("invoiceId")

      if (PaymentId) {
        const url = new URL(window.location)
        url.searchParams.delete("paymentId")
        url.searchParams.delete("Id")
        window.history.replaceState({}, document.title, url)
      }
      getProfile()
      getAllBillingHistory()
    } catch (error) {
      toast.error(ErrorMessage(error))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (InvoiceId && PaymentId) {
      PaymentCallback()
    } else {
      setLoading(false)
    }
  }, [])

  if (paymentData.length === 0 && !loading) return <Navigate to="/dashboard" replace />

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen text-primary">
        <Loader2 className="animate-spin size-10" />
      </div>
    )

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-zinc-900 dark:to-zinc-800 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <PaymentStatus paymentData={paymentData} />

        <div className="flex flex-col gap-3">
          <MainButton asChild className="w-full">
            <Link to="/dashboard">
              <TranslatableText text="Continue to Dashboard" />
            </Link>
          </MainButton>
          <SecondaryButton variant="outline" asChild className="w-full">
            <Link to={PaymentUrl}>
              <TranslatableText text="View Receipt" />
            </Link>
          </SecondaryButton>
        </div>
      </div>
    </div>
  )
}
