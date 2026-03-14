import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useFetchPaymentStats } from "@/hooks/payments/useFetchPaymentStats";
import { toast } from "react-toastify";
import { Skeleton } from "../ui/skeleton";

const Stats = () => {
  const months = [
    { name: "January", value: 1 },
    { name: "February", value: 2 },
    { name: "March", value: 3 },
    { name: "April", value: 4 },
    { name: "May", value: 5 },
    { name: "June", value: 6 },
    { name: "July", value: 7 },
    { name: "August", value: 8 },
    { name: "September", value: 9 },
    { name: "October", value: 10 },
    { name: "November", value: 11 },
    { name: "December", value: 12 },
  ];
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [paymentsInfo, setPaymentsInfo] = useState([
    { title: "Total", amount: 0 },
    { title: "Completed", amount: 0 },
    { title: "Pending", amount: 0 },
  ]);
  const { fetchPaymentStats, loading } = useFetchPaymentStats();
  
  const handleFetchPaymentStats = async () => {
    const res = await fetchPaymentStats(month);

    if (res.error) return toast.error(res.error);

    setPaymentsInfo([
      { title: "Total", amount: res.totalRevenue },
      { title: "Completed", amount: res.totalPayments },
      { title: "Pending", amount: res.pendingPayments },
    ]);
  };

  useEffect(() => {
    handleFetchPaymentStats();
  }, [month]);

  return (
    <div>
      <div className="flex justify-end">
        <Select
          value={month}
          onValueChange={(value) => setMonth(Number(value))}
        >
          <SelectTrigger className="w-45">
            <SelectValue placeholder="Month" />
          </SelectTrigger>
          <SelectContent>
            {months.map((month, index) => (
              <SelectItem key={index} value={Number(month.value)}>
                {month.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-5">
        {paymentsInfo.map((item, index) => (
          <Card key={index} className="px-3">
            <h5 className="text-xl text-muted-foregrounded">{item.title}</h5>
            <h1 className="text-3xl font-semibold">
              {loading ? (
                <Skeleton className="h-12.5 w-50" />
              ) : (
                item.amount
              )}
            </h1>
          </Card>
        ))}
      </div>
      <div className="mt-8 flex justify-center items-center gap-2 border rounded-md w-[50%]">
        <Input
          className="border-none shadow-none focus-visible:border-none focus-visible:ring-0"
          placeholder="Search..."
          onChange=""
        />
        <Button onClick="">
          <Search />
        </Button>
      </div>
    </div>
  );
};

export default Stats;
