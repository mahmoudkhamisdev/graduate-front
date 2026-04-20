import { Button } from "src/components/ui/button";
import PaymentStatus from "../../../../components/Dashboard/Price/Payment/PaymentStatus";
import { Link, Navigate, useLocation } from "react-router-dom";
import { MainButton } from "../../../../components/common/Customs/MainButton";
import { SecondaryButton } from "../../../../components/common/Customs/SecondaryButton";
import { useEffect, useState } from "react";
import axios from "axios";
import { BaseUrlApi, ErrorMessage } from "../../../../lib/api";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function PaymentFailed() {
  const location = useLocation();
  const PaymentId = new URLSearchParams(location.search).get("paymentId");
  const InvoiceId = localStorage.getItem("invoiceId");
  const PaymentUrl = localStorage.getItem("paymentUrl");

  const [paymentData, setPaymentData] = useState([]);
  const [loading, setLoading] = useState(true);
  const PaymentCallback = async () => {
    try {
      const { data } = await axios.post(
        `${BaseUrlApi}/billing/payment-callback`,
        {
          InvoiceId,
          PaymentId,
        }
      );
      setPaymentData(data?.paymentData);

      if (PaymentId) {
        const url = new URL(window.location);
        url.searchParams.delete("paymentId");
        url.searchParams.delete("Id");
        window.history.replaceState({}, document.title, url);
      }
    } catch (error) {
      toast.error(ErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (InvoiceId && PaymentId) {
      PaymentCallback();
    } else {
      setLoading(false);
    }
  }, []);

  if (paymentData.length === 0 && !loading)
    return <Navigate to="/dashboard" replace />;

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen text-primary">
        <Loader2 className="animate-spin size-10" />
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-rose-50 dark:from-zinc-900 dark:to-zinc-800 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <PaymentStatus paymentData={paymentData} />

        <div className="flex flex-col gap-3">
          <MainButton asChild className="w-full">
            <Link to={PaymentUrl}>Try Again</Link>
          </MainButton>
          <SecondaryButton variant="ghost" asChild className="w-full">
            <Link to="/dashboard">Back to Dashboard</Link>
          </SecondaryButton>
        </div>
      </div>
    </div>
  );
}
