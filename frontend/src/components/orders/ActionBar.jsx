import { Plus, Search } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSingleOrderStore } from "@/zustand";
import { useOrderStore } from "@/zustand/ordersStore";
import Filters from "./Filters";
import { useSearchOrder } from "@/hooks/orders/useSearchOrder";
import Loader from "../Loader";

const ActionBar = () => {
  const { newOrder } = useSingleOrderStore();
  const { loading } = useOrderStore();
  const { searchOrders } = useSearchOrder();
  const [searchQuery, setSearchQuery] = useState(null);
  
  return (
    <div className="flex justify-end md:justify-between items-center py-5 md:py-10 gap-3">
      <div className="hidden md:flex justify-center items-center gap-2 border rounded-md w-[50%]">
        <Input
          className="border-none shadow-none focus-visible:border-none focus-visible:ring-0"
          placeholder="Search..."
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Button disabled={loading} onClick={() => searchOrders(searchQuery)}>
          { loading ? <Loader size="sm"/> : <Search /> }
        </Button>
      </div>
      <div className="flex items-center gap-3">
        <Filters searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        <Link to={`/orders/new`} onClick={newOrder}>
          <Button variant="outline">
            <Plus /> New Order
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default ActionBar;
