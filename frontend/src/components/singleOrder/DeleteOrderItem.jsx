import { Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { useSingleOrderStore } from "@/zustand";
import { useDeleteItem } from "@/hooks/orders/useDeleteItem";
import { toast } from "react-toastify";
import Loader from "../Loader";

const DeleteOrderItem = ({ isSubOrder, itemId, subItemId }) => {
  const { order } = useSingleOrderStore();
  const { deleteItem, deleteSubOrderItem, loading } = useDeleteItem();

  const handleDelete = async () => {
    if (isSubOrder) {
      const res = await deleteSubOrderItem(order.id, itemId, subItemId);
      if (res?.error) return toast.error(res.error);
      return toast.success(res.message);
    }

    const res = await deleteItem(order.id, itemId);
    if (res?.error) return toast.error(res.error);
    toast.success(res.message);
  };

  return (
    <Button
      onClick={handleDelete}
      variant="destructive"
      className="cursor-pointer flex items-center gap-2"
      disabled={loading}
    >
      {loading && <Loader size="sm" />}
      <Trash2 className="h-4 w-4" />
      Delete
    </Button>
  );
};

export default DeleteOrderItem;