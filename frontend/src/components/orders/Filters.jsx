import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import FilterDropdown from "./FilterDropdown";
import { useOrderStore } from "@/zustand/ordersStore";
import { useState } from "react";
import { Button } from "../ui/button";
import { Search, SlidersHorizontal } from "lucide-react";
import { Input } from "../ui/input";
import { useSearchOrder } from "@/hooks/orders/useSearchOrder";
import Loader from "../Loader";

const Filters = ({ searchQuery, setSearchQuery }) => {
  const [page, setPage] = useState(1)
  const { filterOrders, loading } = useOrderStore();
  const {searchOrders} = useSearchOrder()
  const [filterOptionsData, setFilterOptionsData] = useState({
    orderStatus: null,
    deliveryStatus: null,
    paymentStatus: null,
    orderType: null,
  });

  const onSelect = (field, value) => {
    setFilterOptionsData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFilterOrders = () => {
    const data = {};

    if (filterOptionsData.orderStatus !== null) {
      data.status = filterOptionsData.orderStatus;
    }
    if (filterOptionsData.deliveryStatus !== null) {
      data.delivery = filterOptionsData.deliveryStatus;
    }
    if (filterOptionsData.orderType !== null) {
      data.type = filterOptionsData.orderType;
    }

    filterOrders(page, data);
  };
  const filterOptionItems = [
    {
      title: "Order Status",
      field: "orderStatus",
      status: [
        { name: "Pending", value: "PENDING" },
        { name: "In Progress", value: "IN_PROGRESS" },
        { name: "Completed", value: "COMPLETED" },
        { name: "Cancelled", value: "CANCELLED" },
      ],
    },
    {
      title: "Delivery Status",
      field: "deliveryStatus",
      status: [
        { name: "Delivered", value: "DELIVERED" },
        { name: "Pending", value: "PENDING" },
      ],
    },
    {
      title: "Order Type",
      field: "orderType",
      status: [
        { name: "Individual", value: "INDIVIDUAL" },
        { name: "Group", value: "GROUP" },
      ],
    },
  ];

  return (
    <Sheet>
      <Button asChild>
        <SheetTrigger className="flex items-center gap-2">
          <SlidersHorizontal /> Filters
        </SheetTrigger>
      </Button>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Order Filters</SheetTitle>
          <div className="my-5 md:hidden flex justify-center items-center gap-2 p-1 border-[1px] border-primary/20 rounded-md w-full">
            <Input
              className="border-none shadow-none focus-visible:border-none focus-visible:ring-0"
              placeholder="Search..."
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button disabled={loading} onClick={() => searchOrders(searchQuery)}>
              { loading ? <Loader size="sm" /> : <Search /> }
            </Button>
          </div>
          {filterOptionItems.map((item, index) => (
            <FilterDropdown
              key={index}
              title={item.title}
              items={item.status}
              field={item.field}
              onSelect={onSelect}
            />
          ))}
        </SheetHeader>
        <Button className="mx-3" onClick={handleFilterOrders}>
          Apply Filters
        </Button>
      </SheetContent>
    </Sheet>
  );
};

export default Filters;
