import { motion } from "framer-motion";
import { Card, CardContent } from "src/components/ui/card";
import { XCircle, CreditCard, Calendar } from "lucide-react";

const draw = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: (i) => ({
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: {
        delay: i * 0.2,
        type: "spring",
        duration: 1.5,
        bounce: 0.2,
        ease: "easeInOut",
      },
      opacity: { delay: i * 0.2, duration: 0.2 },
    },
  }),
};

function AnimatedIcon({ status }) {
  const isSuccess = status === "success";
  const color = isSuccess ? "rgb(16 185 129)" : "rgb(239 68 68)";

  return (
    <motion.svg
      width={80}
      height={80}
      viewBox="0 0 100 100"
      initial="hidden"
      animate="visible"
      className="relative z-10"
    >
      <title>{isSuccess ? "Payment Success" : "Payment Failed"}</title>
      <motion.circle
        cx="50"
        cy="50"
        r="40"
        stroke={color}
        variants={draw}
        custom={0}
        style={{
          strokeWidth: 4,
          strokeLinecap: "round",
          fill: "transparent",
        }}
      />
      {isSuccess ? (
        <motion.path
          d="M30 50L45 65L70 35"
          stroke={color}
          variants={draw}
          custom={1}
          style={{
            strokeWidth: 4,
            strokeLinecap: "round",
            strokeLinejoin: "round",
            fill: "transparent",
          }}
        />
      ) : (
        <>
          <motion.path
            d="M35 35L65 65"
            stroke={color}
            variants={draw}
            custom={1}
            style={{
              strokeWidth: 4,
              strokeLinecap: "round",
              fill: "transparent",
            }}
          />
          <motion.path
            d="M65 35L35 65"
            stroke={color}
            variants={draw}
            custom={1.2}
            style={{
              strokeWidth: 4,
              strokeLinecap: "round",
              fill: "transparent",
            }}
          />
        </>
      )}
    </motion.svg>
  );
}

export default function PaymentStatus({ paymentData }) {
  // Safety checks
  if (
    !paymentData ||
    !paymentData.InvoiceTransactions ||
    paymentData.InvoiceTransactions.length === 0
  ) {
    return (
      <Card className="w-full max-w-md mx-auto p-6 min-h-[400px] flex flex-col justify-center bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl">
        <CardContent className="flex flex-col items-center justify-center">
          <p className="text-zinc-500 dark:text-zinc-400">
            No payment data available
          </p>
        </CardContent>
      </Card>
    );
  }

  // Find the latest transaction to determine status
  const latestTransaction =
    paymentData.InvoiceTransactions[paymentData.InvoiceTransactions.length - 1];
  const isSuccess =
    latestTransaction.TransactionStatus === "Succss" ||
    latestTransaction.TransactionStatus === "Success";
  const status = isSuccess ? "success" : "failed";

  const bgColor = isSuccess
    ? "bg-emerald-500/10 dark:bg-emerald-500/20"
    : "bg-red-500/10 dark:bg-red-500/20";
  const titleColor = isSuccess
    ? "text-emerald-600 dark:text-emerald-500"
    : "text-red-600 dark:text-red-500";

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Card className="w-full max-w-md mx-auto p-6 min-h-[400px] flex flex-col justify-center bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl">
      <CardContent className="space-y-6 flex flex-col items-center justify-center">
        <motion.div
          className="flex justify-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.4,
            ease: [0.4, 0, 0.2, 1],
            scale: {
              type: "spring",
              damping: 15,
              stiffness: 200,
            },
          }}
        >
          <div className="relative">
            <motion.div
              className={`absolute inset-0 blur-xl ${bgColor} rounded-full`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                delay: 0.2,
                duration: 0.8,
                ease: "easeOut",
              }}
            />
            <AnimatedIcon status={status} />
          </div>
        </motion.div>

        <motion.div
          className="space-y-4 text-center w-full"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.2,
            duration: 0.6,
            ease: [0.4, 0, 0.2, 1],
          }}
        >
          <motion.h2
            className={`text-2xl font-bold ${titleColor}`}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.4 }}
          >
            {isSuccess ? "Payment Successful!" : "Payment Failed"}
          </motion.h2>

          <motion.div
            className="bg-zinc-50 dark:bg-zinc-800/50 rounded-xl p-4 border border-zinc-200 dark:border-zinc-700/50"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              delay: 1.2,
              duration: 0.4,
              ease: [0.4, 0, 0.2, 1],
            }}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-600 dark:text-zinc-400 flex items-center gap-2">
                  <CreditCard className="w-4 h-4" />
                  Amount
                </span>
                <span className="font-semibold text-lg text-zinc-900 dark:text-zinc-100">
                  {paymentData.InvoiceDisplayValue}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-600 dark:text-zinc-400">
                  Invoice ID
                </span>
                <span className="font-mono text-sm text-zinc-700 dark:text-zinc-300">
                  #{paymentData.InvoiceReference}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-600 dark:text-zinc-400">
                  Customer
                </span>
                <span className="text-sm text-zinc-700 dark:text-zinc-300">
                  {paymentData.CustomerName}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-600 dark:text-zinc-400 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Date
                </span>
                <span className="text-sm text-zinc-700 dark:text-zinc-300">
                  {formatDate(latestTransaction.TransactionDate)}
                </span>
              </div>

              {latestTransaction.TransactionId && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-zinc-600 dark:text-zinc-400">
                    Transaction ID
                  </span>
                  <span className="font-mono text-sm text-zinc-700 dark:text-zinc-300">
                    {latestTransaction.TransactionId}
                  </span>
                </div>
              )}

              {isSuccess && (
                <div className="pt-2 border-t border-zinc-200 dark:border-zinc-700">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-zinc-600 dark:text-zinc-400">
                      Payment Method
                    </span>
                    <span className="text-sm text-zinc-700 dark:text-zinc-300">
                      {latestTransaction.Card.Brand} ••••{" "}
                      {latestTransaction.CardNumber.slice(-4)}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          <motion.p
            className="text-sm text-zinc-500 dark:text-zinc-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4, duration: 0.4 }}
          >
            {isSuccess
              ? "Your payment has been processed successfully. You will receive a confirmation email shortly."
              : "Your payment could not be processed. Please try again or contact support if the issue persists."}
          </motion.p>
        </motion.div>
      </CardContent>
    </Card>
  );
}
