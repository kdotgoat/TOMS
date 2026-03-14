import { Plus, RefreshCcw } from "lucide-react";
import { Button } from "../ui/button";
import { useSingleOrderStore } from "@/zustand";
import { toast } from "react-toastify";
import { useAddItem } from "@/hooks/orders/useAddItem";
import Loader from "../Loader";
import { useUpdateItem } from "@/hooks/orders/useUpdateItem";
import { isTempId } from "@/lib/isTemId";

const UpdateOrderItem = ({ isSubOrder, itemId, subItemId }) => {
  const { order } = useSingleOrderStore();
  const { addItem, addSubOrderItem, loading: newLoading } = useAddItem();
  const { updateOrderItem, updateSubOrderItem, loading: updateLoading } = useUpdateItem()
  const orderItem = order?.items?.find((item) => item.id === itemId);
  const subOrderItem = orderItem?.subOrder?.find(
    (subItem) => subItem.id === subItemId
  );

  const handleUpdate = async () => {
    if (isSubOrder) {
      const { clothingTypeId, measurements, price } = subOrderItem;
      if (isTempId(subOrderItem.id)) {
        const res = await addSubOrderItem(order.id, orderItem.id, {
          clothingTypeId,
          measurements,
          price,
        });
        if (res.error) return toast.error(res.error);
        toast.success(res.message);
        return;
      }

      const res = await updateSubOrderItem(order.id, itemId, subItemId, {
        clothingTypeId,
        measurements,
        price,
      });
      if (res.error) return toast.error(res.error);
      toast.success(res.message);
      return
    }

    const { clothingTypeId, measurements, price, items } = orderItem;
    if (!isTempId(order.id)) {
      const res = await addItem(order.id, {
        clothingTypeId,
        measurements,
        price,
        sbOrder: items
      });
      if (res.error) return toast.error(res.error);
      toast.success(res.message);
      return;
    }

    const res = await updateOrderItem(order.id, itemId, {
      clothingTypeId,
      measurements,
      price,
    });
    if (res.error) return toast.error(res.error);
    toast.success(res.message);
  };

  

  // Decide button label + icon
  const isNew =
    (isSubOrder && isTempId(subOrderItem?.id)) ||
    (!isSubOrder && isTempId(orderItem?.id));

  return (
    <Button
      onClick={handleUpdate}
      disabled={newLoading || updateLoading}
      className="cursor-pointer bg-green-500 text-white hover:bg-green-400 disabled:opacity-50"
    >
      {newLoading || updateLoading && <Loader size="sm" />}
      {isNew ? (
        <>
          <Plus className="mr-2 h-4 w-4" /> Create
        </>
      ) : (
        <>
          <RefreshCcw className="mr-2 h-4 w-4" /> Update
        </>
      )}
    </Button>
  );
};

export default UpdateOrderItem;
