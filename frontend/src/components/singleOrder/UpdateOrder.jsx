import { RefreshCcw } from "lucide-react";
import { Button } from "../ui/button";
import { useUpdateOrder } from "@/hooks/orders/useUpdateOrder";
import { toast } from "react-toastify";
import Loader from "../Loader";

const UpdateOrder = () => {
  const { updateOrder, loading } = useUpdateOrder();

  const handleUpdate = async (e) => {
    e.preventDefault();
    const res = await updateOrder();
    if (res.error) return toast.error(res.error);
    toast.success(res.message);
  };

  return (
    <div>
      <Button
        className="cursor-pointer bg-green-500 text-white hover:bg-green-400"
        onClick={handleUpdate}
        disbaled={loading}
      >
        {loading ? (
          <Loader size="sm" />
        ) : (
          <>
            <RefreshCcw />
            <span className="hidden md:flex">Update</span>
          </>
        )}
      </Button>
    </div>
  );
};

export default UpdateOrder;
