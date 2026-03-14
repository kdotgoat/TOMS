import { useSingleOrderStore } from "@/zustand";
import { BanknoteArrowUp, Plus, RefreshCcw, Trash2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import { apiGet, apiPost } from "@/api";
import { toast } from "react-toastify";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription } from "../ui/alert";
import UpdatePayment from "./UpdatePayment";
import DeletePayment from "./DeletePayment";

const Payments = () => {
  const { order, orderDetailChange } = useSingleOrderStore();
  const [amount, setAmount] = useState(0);
  const [paymentMode, setPaymentMode] = useState("");
  const [refNumber, setRefNumber] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [payments, setPayments] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const [res, error] = await apiPost("/payments/", {
      orderId: order.id,
      amount: Number(amount),
      mode: paymentMode,
      reference: refNumber,
    });

    if (error) return setError(error);

    const totalPayments = order.totalPayments + amount;
    orderDetailChange("totalPayments", Number(totalPayments));

    setMessage(res.message);
  };

  const fetchPayments = async () => {
    const [res, error] = await apiGet(`/orders/${order.id}/payments`);

    if (error) return setError(error);

    setPayments(res.payments);
  };

  return (
    <div className="flex  items-center justify-between gap-3 text-lg border rounded-md p-1">
      <p className="flex items-center gap-3">
        <BanknoteArrowUp /> <span className="font-semibold">Paid:</span>{" "}
        {order.totalPayments}
      </p>

      <Sheet>
        <SheetTrigger asChild>
          <Button onClick={fetchPayments}>
            <Plus />
          </Button>
        </SheetTrigger>
        <SheetContent>
          <ScrollArea className="w-full h-screen">
            <SheetHeader>
              <SheetTitle>Add New Payment</SheetTitle>
            </SheetHeader>
            <div className="mx-3">
              <form className="grid gap-5" onSubmit={handleSubmit}>
                <Input
                  placeholder="Add amount"
                  type="number"
                  onChange={(e) => setAmount(e.target.value)}
                />
                <Select
                  value={paymentMode}
                  onValueChange={(value) => setPaymentMode(value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Choose payment mode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CASH">CASH</SelectItem>
                    <SelectItem value="MPESA">MPESA</SelectItem>
                    <SelectItem value="BANK_TRANSFER">BANK</SelectItem>
                  </SelectContent>
                </Select>
                {(paymentMode === "MPESA" ||
                  paymentMode === "BANK_TRANSFER") && (
                  <Input
                    placeholder="Reference number"
                    onChange={(e) => setRefNumber(e.target.value)}
                  />
                )}
                <Button>Confirm</Button>
              </form>
              {error && (
                <Alert variant="destructive" className="mt-3">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {message && (
                <Alert variant="success" className="mt-3">
                  <AlertDescription>{message}</AlertDescription>
                </Alert>
              )}
              <div className="my-5">
                <SheetTitle>Payment History</SheetTitle>
                <div className="grid gap-3 mt-3">
                  {payments.map((payment) => (
                    <div
                      key={payment.id}
                      className="border p-2 rounded-md grid gap-2"
                    >
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg">Amount: <span className="font-semibold">{payment.amount}</span></h3>
                        <div className="flex items-center gap-2">
                          <UpdatePayment
                            paymentId={payment.id}
                            amount={payment.amount} 
                            reference={payment.reference} 
                            mode={payment.mode}
                          />
                          <DeletePayment paymentId={payment.id} />
                        </div>
                      </div>
                      <p>
                        {payment.mode}{" "}
                        {payment.reference && (
                          <span>: {payment.reference}</span>
                        )}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {payment.updated_by.first_name}{" "}
                        {payment.updated_by.last_name} -{" "}
                        <span>
                          {
                            new Date(payment.updated_at)
                              .toISOString()
                              .split("T")[0]
                          }
                        </span>
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Payments;
