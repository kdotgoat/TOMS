import {
  BanknoteX,
  Calendar,
  DollarSign,
  Loader,
  Phone,
  Star,
  Truck,
  User,
} from "lucide-react";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useSingleOrderStore } from "@/zustand/singleOrderStore";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Payments from "./Payments";
import DeleteOrder from "./DeleteOrder";
import UpdateOrder from "./UpdateOrder";

const OrderInfo = () => {
  const { orderDetailChange, order } = useSingleOrderStore();
  const location = useLocation();

  useEffect(() => {
    const id = location.pathname.split("/")[2];
    orderDetailChange("id", id);
  }, []);

  return (
    <div>
      <div className="mb-5 flex justify-between items-center">
        <h1 className="text-3xl md:text-4xl font-semibold text-primary">
          Order Summary
        </h1>
        {order.id !== "new" && (
          <div className="flex gap-2">
            <UpdateOrder />
            <DeleteOrder />
          </div>
        )}
      </div>
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        <div className="flex justify-between items-center gap-2 pl-2 border rounded-md">
          <p className="flex-5 flex gap-2 items-center">
            <User /> Order Name:
          </p>
          <Input
            className="flex-5 border-none shadow-none focus-visible:border-none focus-visible:ring-0"
            type="text"
            placeholder="Eg. John Doe"
            value={order.name}
            onChange={(e) => orderDetailChange("name", e.target.value)}
          />
        </div>
        <div className="flex justify-between items-center gap-2 pl-2 border rounded-md">
          <p className="flex-5 flex gap-2 items-center">
            <Phone />
            Phone Number:
          </p>
          <Input
            className="flex-5 border-none shadow-none focus-visible:border-none focus-visible:ring-0"
            type="text"
            placeholder="Eg. 0712345678"
            value={order.phoneNumber}
            onChange={(e) => orderDetailChange("phoneNumber", e.target.value)}
          />
        </div>
        <div className="flex justify-between items-center gap-2 pl-2 border rounded-md">
          <p className="flex-5 flex gap-2 items-center">
            <Star />
            Type:
          </p>
          <Select
            className="flex-5 border-none shadow-none focus-visible:border-none focus-visible:ring-0"
            value={order.type}
            onValueChange={(val) => orderDetailChange("type", val)}
          >
            <SelectTrigger className="w-1/2">
              <SelectValue
                placeholder={order.type ? order.type : "Select Order Type"}
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="INDIVIDUAL">INDIVIDUAL</SelectItem>
              <SelectItem value="GROUP">GROUP</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex justify-between items-center gap-2 pl-2 border rounded-md">
          <p className="flex-5 flex gap-2 items-center">
            <Loader /> Status
          </p>
          <Select
            className="flex-5 border-none shadow-none focus-visible:border-none focus-visible:ring-0"
            value={order.status}
            onValueChange={(val) => orderDetailChange("status", val)}
          >
            <SelectTrigger className="w-1/2">
              <SelectValue placeholder="Choose Order Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="COMPLETED">COMPLETED</SelectItem>
              <SelectItem value="IN_PROGRESS">IN PROGRESS</SelectItem>
              <SelectItem value="PENDING">PENDING</SelectItem>
              <SelectItem value="CANCELLED">CANCELLED</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex justify-between items-center gap-2 pl-2 border rounded-md">
          <p className="flex-5 flex gap-2 items-center">
            <Truck /> Delivery
          </p>
          <Select
            className="flex-5 border-none shadow-none focus-visible:border-none focus-visible:ring-0"
            value={order.delivery}
            onValueChange={(val) => orderDetailChange("delivery", val)}
          >
            <SelectTrigger className="w-1/2">
              <SelectValue placeholder="Choose Order Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="PENDING">PENDING</SelectItem>
              <SelectItem value="DELIVERED">DELIVERED</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex justify-between items-center gap-2 pl-2 border rounded-md">
          <p className="flex-5 flex gap-2 items-center">
            <Calendar /> Due Date
          </p>
          <Input
            className="flex-5 border-none shadow-none focus-visible:border-none focus-visible:ring-0"
            type="date"
            value={order.dueDate ? new Date(order.dueDate).toISOString().split("T")[0]: ""}
            min={new Date().toISOString().split("T")[0]}
            onChange={(e) => orderDetailChange("dueDate", e.target.value)}
          />
        </div>
        <div className="flex items-center gap-3 text-lg">
          <DollarSign />{" "}
          <p>
            <span className="font-semibold">Amount:</span>{" "}
            {Number(order.totalPrice)}
          </p>
        </div>
        {/* ===== Add and View Payments Histoty ===== */}
        <Payments />
        <div className="flex items-center gap-3 text-lg">
          <BanknoteX />{" "}
          <p>
            <span className="font-semibold">Balance:</span>{" "}
            {Number(order.totalPrice) - Number(order.totalPayments)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderInfo;
