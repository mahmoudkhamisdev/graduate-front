import { Card, CardContent, CardHeader } from "src/components/ui/card";
import { Button } from "src/components/ui/button";
import { Separator } from "src/components/ui/separator";
import {
  Download,
  Mail,
  CreditCard,
  Calendar,
  User,
  ReceiptIcon,
} from "lucide-react";

export default function PaymentReceipt({ paymentData }) {
  const successfulTransaction = paymentData.InvoiceTransactions.find(
    (t) => t.TransactionStatus === "Succss" || t.TransactionStatus === "Success"
  );

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleDownload = () => {
    window.print();
  };

  const handleEmailReceipt = () => {
    // In a real app, this would trigger an email API
    alert("Receipt will be sent to " + paymentData.CustomerEmail);
  };

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-4">
      <Card className="print:shadow-none">
        <CardHeader className="text-center space-y-4 pb-6">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/20 rounded-full flex items-center justify-center">
              <ReceiptIcon className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
              Payment Receipt
            </h1>
            <p className="text-zinc-600 dark:text-zinc-400">
              Invoice #{paymentData.InvoiceReference}
            </p>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Customer Information */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <User className="w-4 h-4" />
                Customer Details
              </h3>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-zinc-600 dark:text-zinc-400">
                    Name:
                  </span>
                  <span className="ml-2 font-medium">
                    {paymentData.CustomerName}
                  </span>
                </div>
                <div>
                  <span className="text-zinc-600 dark:text-zinc-400">
                    Email:
                  </span>
                  <span className="ml-2 font-medium">
                    {paymentData.CustomerEmail}
                  </span>
                </div>
                <div>
                  <span className="text-zinc-600 dark:text-zinc-400">
                    Mobile:
                  </span>
                  <span className="ml-2 font-medium">
                    {paymentData.CustomerMobile}
                  </span>
                </div>
                <div>
                  <span className="text-zinc-600 dark:text-zinc-400">
                    Customer ID:
                  </span>
                  <span className="ml-2 font-mono text-xs">
                    {paymentData.CustomerReference}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Invoice Details
              </h3>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-zinc-600 dark:text-zinc-400">
                    Invoice ID:
                  </span>
                  <span className="ml-2 font-medium">
                    {paymentData.InvoiceId}
                  </span>
                </div>
                <div>
                  <span className="text-zinc-600 dark:text-zinc-400">
                    Status:
                  </span>
                  <span className="ml-2">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400">
                      {paymentData.InvoiceStatus}
                    </span>
                  </span>
                </div>
                <div>
                  <span className="text-zinc-600 dark:text-zinc-400">
                    Created:
                  </span>
                  <span className="ml-2 font-medium">
                    {formatDate(paymentData.CreatedDate)}
                  </span>
                </div>
                <div>
                  <span className="text-zinc-600 dark:text-zinc-400">
                    Expires:
                  </span>
                  <span className="ml-2 font-medium">
                    {paymentData.ExpiryDate}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Items */}
          <div className="space-y-3">
            <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
              Items
            </h3>
            <div className="space-y-2">
              {paymentData.InvoiceItems.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg"
                >
                  <div>
                    <div className="font-medium text-zinc-900 dark:text-zinc-100">
                      {item.ItemName}
                    </div>
                    <div className="text-sm text-zinc-600 dark:text-zinc-400">
                      Quantity: {item.Quantity}
                    </div>
                  </div>
                  <div className="font-semibold text-zinc-900 dark:text-zinc-100">
                    {item.UnitPrice.toFixed(3)} KD
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Payment Information */}
          {successfulTransaction && (
            <div className="space-y-3">
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <CreditCard className="w-4 h-4" />
                Payment Information
              </h3>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <div>
                    <span className="text-zinc-600 dark:text-zinc-400">
                      Payment Method:
                    </span>
                    <span className="ml-2 font-medium">
                      {successfulTransaction.PaymentGateway}
                    </span>
                  </div>
                  <div>
                    <span className="text-zinc-600 dark:text-zinc-400">
                      Card:
                    </span>
                    <span className="ml-2 font-medium">
                      {successfulTransaction.Card.Brand} ••••{" "}
                      {successfulTransaction.CardNumber.slice(-4)}
                    </span>
                  </div>
                  <div>
                    <span className="text-zinc-600 dark:text-zinc-400">
                      Cardholder:
                    </span>
                    <span className="ml-2 font-medium">
                      {successfulTransaction.Card.NameOnCard ||
                        paymentData.CustomerName}
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div>
                    <span className="text-zinc-600 dark:text-zinc-400">
                      Transaction ID:
                    </span>
                    <span className="ml-2 font-mono text-xs">
                      {successfulTransaction.TransactionId}
                    </span>
                  </div>
                  <div>
                    <span className="text-zinc-600 dark:text-zinc-400">
                      Reference ID:
                    </span>
                    <span className="ml-2 font-mono text-xs">
                      {successfulTransaction.ReferenceId}
                    </span>
                  </div>
                  <div>
                    <span className="text-zinc-600 dark:text-zinc-400">
                      Payment Date:
                    </span>
                    <span className="ml-2 font-medium">
                      {formatDate(successfulTransaction.TransactionDate)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <Separator />

          {/* Total */}
          <div className="space-y-3">
            <div className="flex justify-between items-center text-lg font-semibold">
              <span>Total Amount:</span>
              <span className="text-emerald-600 dark:text-emerald-400">
                {paymentData.InvoiceDisplayValue}
              </span>
            </div>
            {successfulTransaction && (
              <div className="text-sm text-zinc-600 dark:text-zinc-400 space-y-1">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>
                    {successfulTransaction.TransationValue}{" "}
                    {successfulTransaction.PaidCurrency}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>VAT:</span>
                  <span>
                    {successfulTransaction.VatAmount}{" "}
                    {successfulTransaction.PaidCurrency}
                  </span>
                </div>
                <div className="flex justify-between font-medium">
                  <span>Total Paid:</span>
                  <span>
                    {successfulTransaction.PaidCurrencyValue}{" "}
                    {successfulTransaction.PaidCurrency}
                  </span>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 print:hidden">
        <Button onClick={handleDownload} className="flex-1">
          <Download className="w-4 h-4 mr-2" />
          Download PDF
        </Button>
        <Button
          variant="outline"
          onClick={handleEmailReceipt}
          className="flex-1"
        >
          <Mail className="w-4 h-4 mr-2" />
          Email Receipt
        </Button>
      </div>
    </div>
  );
}
