import { Button } from "src/components/ui/button";
import { ArrowLeft } from "lucide-react";
import PaymentReceipt from "../../../../components/Dashboard/Price/Payment/PaymentReceipt";
import { Link } from "react-router-dom";

export default function ReceiptPage() {
  // Your actual payment data
  const paymentData = {
    InvoiceId: 5821411,
    InvoiceStatus: "Paid",
    InvoiceReference: "2025243395",
    CustomerReference: "68489180b51bb85f417ae747",
    CreatedDate: "2025-06-10T23:11:46.01",
    ExpiryDate: "June 13, 2025",
    ExpiryTime: "23:11:46.010",
    InvoiceValue: 3.086,
    Comments: null,
    CustomerName: "khamis",
    CustomerMobile: "+965",
    CustomerEmail: "dckhamis10@gmail.com",
    UserDefinedField:
      '{"userId":"6841f8ddd99feef5c95dc442","planId":"6848026559188bd23f9c27f4","billingId":"68489180b51bb85f417ae747"}',
    InvoiceDisplayValue: "10.000 USD",
    DueDeposit: 3.019,
    DepositStatus: "Not Deposited",
    InvoiceItems: [
      {
        ItemName: "Basic Plan - 100 Credits",
        Quantity: 1,
        UnitPrice: 3.086,
        Weight: null,
        Width: null,
        Height: null,
        Depth: null,
      },
    ],
    InvoiceTransactions: [
      {
        TransactionDate: "2025-06-10T23:11:55.8866667",
        PaymentGateway: "VISA/MASTER",
        ReferenceId: "07075821411278493973",
        TrackId: "10-06-2025_2784939",
        TransactionId: "07075821411278493973",
        PaymentId: "07075821411278493973",
        AuthorizationId: "07075821411278493973",
        TransactionStatus: "Failed",
        TransationValue: "3.086",
        CustomerServiceCharge: "0.000",
        TotalServiceCharge: "0.104",
        DueValue: "3.090",
        PaidCurrency: "KD",
        PaidCurrencyValue: "3.090",
        VatAmount: "0.016",
        IpAddress: "41.235.206.128",
        Country: "Egypt",
        Currency: "KD",
        Error: "DECLINED : No such issuer",
        CardNumber: "424242xxxxxx4242",
        ErrorCode: "MF002",
        ECI: "05",
        Card: {
          NameOnCard: "Khamis",
          Number: "424242xxxxxx4242",
          PanHash:
            "477bba133c182267fe5f086924abdc5db71f77bfc27f01f2843f2cdc69d89f05",
          ExpiryMonth: "02",
          ExpiryYear: "27",
          Brand: "Visa",
          Issuer: "Test Bank",
          IssuerCountry: "KWT",
          FundingMethod: "credit",
        },
      },
      {
        TransactionDate: "2025-06-10T23:13:59.9633333",
        PaymentGateway: "GooglePay",
        ReferenceId: "516120287288",
        TrackId: "10-06-2025_2784940",
        TransactionId: "287288",
        PaymentId: "07075821411278494072",
        AuthorizationId: "287288",
        TransactionStatus: "Succss",
        TransationValue: "3.086",
        CustomerServiceCharge: "0.000",
        TotalServiceCharge: "0.062",
        DueValue: "3.090",
        PaidCurrency: "KD",
        PaidCurrencyValue: "3.090",
        VatAmount: "0.009",
        IpAddress: "41.235.206.128",
        Country: "Egypt",
        Currency: "KD",
        Error: null,
        CardNumber: "411111xxxxxx1111",
        ErrorCode: "",
        ECI: "05",
        Card: {
          NameOnCard: "",
          Number: "411111xxxxxx1111",
          PanHash:
            "9bbef19476623ca56c17da75fd57734dbf82530686043a6e491c6d71befe8f6e",
          ExpiryMonth: "12",
          ExpiryYear: "27",
          Brand: "Visa",
          Issuer: "Conotoxia Sp. Z O.O",
          IssuerCountry: "POL",
          FundingMethod: "debit",
        },
      },
    ],
    Suppliers: [],
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 py-8">
      <div className="container mx-auto">
        <div className="mb-6">
          <Button variant="ghost" asChild>
            <Link href="/payment/success" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Payment
            </Link>
          </Button>
        </div>

        <PaymentReceipt paymentData={paymentData} />
      </div>
    </div>
  );
}
