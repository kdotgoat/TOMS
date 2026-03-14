import { RefreshCcw } from "lucide-react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useState } from "react";
import { Input } from "../ui/input";
import { apiPatch } from "@/api";
import { toast } from "react-toastify";
import { Alert, AlertDescription } from "../ui/alert";

const UpdatePayment = ({ paymentId, amount, reference, mode }) => {
  const [paymentMode, setPaymentMode] = useState("");
  const [refNum, setRefNum] = useState("");
  const [inputAmount, setInputAmount] = useState(0);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {};

    if (paymentMode !== "") data.mode = paymentMode;
    if (refNum !== "") data.reference = refNum;
    if (inputAmount > 0) data.amount = inputAmount;

    const [res, error] = await apiPatch(`/payments/${paymentId}`, data);

    if (error) return setError(error);

    setMessage(res.message);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="cursor-pointer bg-green-500 text-white hover:bg-green-400">
          <RefreshCcw />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Payment Details</DialogTitle>
          <form className="grid gap-5" onSubmit={handleSubmit}>
            <Input
              placeholder="Add amount"
              value={inputAmount ? inputAmount : amount}
              type="number"
              onChange={(e) => setInputAmount(Number(e.target.value))}
            />
            <Select
              value={mode}
              onValueChange={(e) => setPaymentMode(e.target.value)}
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
            {(paymentMode === "MPESA" || paymentMode === "BANK_TRANSFER") && (
              <Input
                placeholder="Reference number"
                value={reference}
                onChange={(e) => setRefNum(e.target.value)}
              />
            )}
            <Button>Confirm</Button>
            <div className="mt-3">
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
            </div>
          </form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default UpdatePayment;
