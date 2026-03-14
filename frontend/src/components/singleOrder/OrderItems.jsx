import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import { useSingleOrderStore } from "@/zustand/singleOrderStore";
import OrderItem from "./OrderItem";
import { useEffect, useRef } from "react";
import { useClothingTypeStore } from "@/zustand";
import { toast } from "react-toastify";
import { useAddNewOrder } from "@/hooks/singleOrder/useAddNewOrder";
import Loader from "../Loader";

const OrderItems = () => {
  const { order, addItem } =
    useSingleOrderStore();
  const { getClothingTypes, loading: clothingTypesLoading, error: clothingTypesError, types } = useClothingTypeStore();
  const {addNewOrder, loading} = useAddNewOrder()
  const hasLoadedClothingTypes = useRef(false);

  useEffect(() => {
    if (hasLoadedClothingTypes.current) return;
    hasLoadedClothingTypes.current = true;

    const loadClothingTypes = async () => {
      const res = await getClothingTypes();

      if (res?.error) {
        toast.error(res.error);
      }
    };

    loadClothingTypes();
  }, []);

  const handleAddNewOrder = async() => {
    const res = await addNewOrder()
    if(res.error) return toast.error(res.error)
    toast.success(res.message)
  }

  return (
    <div>
      <h1 className="text-4xl mb-5 font-semibold text-primary">Order Items</h1>
      <div className="grid gap-10">
        {clothingTypesLoading && <div>Loading clothing types...</div>}

        {!clothingTypesLoading && clothingTypesError && (
          <div className="text-red-500">
            Failed to load clothing types: {clothingTypesError}
          </div>
        )}

        {order.items?.length === 0 && <div>No order items found</div>}
        {order.items?.map((item, index) => (
          <OrderItem key={item.id} index={index} id={item.id} />
        ))}
        <div className="grid gap-3">
          <Button
            onClick={() => addItem()}
            variant="outline"
            disabled={clothingTypesLoading || types.length === 0}
          >
            <Plus /> Add New Item
          </Button>

          {order.id === "new" && order.items.length > 0 && (
            <Button
              onClick={handleAddNewOrder}
              disabled={loading || clothingTypesLoading || types.length === 0}
            >
              {loading ? <Loader size="sm" /> : "Save Order"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderItems;
