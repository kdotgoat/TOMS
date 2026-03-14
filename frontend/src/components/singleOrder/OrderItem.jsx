import { Input } from "../ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../ui/select";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import { useSingleOrderStore } from "@/zustand/singleOrderStore";
import Mearsurements from "./Mearsurements";
import { useClothingTypeStore } from "@/zustand";
import UpdateOrderItem from "./UpdateOrderItem";
import DeleteOrderItem from "./DeleteOrderItem";
import { isTempId } from "@/lib/isTemId";

const OrderItem = ({ id, index, isSubOrder = false }) => {
  const { updateItem, addItem, order } = useSingleOrderStore();
  const { types: clothingTypeItems } = useClothingTypeStore();
  const { items: orderItems } = order;

  const findItem = (items, id, isSubOrder) => {
    for (const item of items) {
      if (item.id === id) return item;

      if (isSubOrder && item.subOrder?.length) {
        const found = findItem(item.subOrder, id);

        if (found) return found;
      }
    }
    return null;
  };

  const item = findItem(orderItems, id, isSubOrder);

  if (!item) {
    return <div>Item not found</div>;
  }

  const clothType = clothingTypeItems.find(
    (ct) => ct.value === item.clothingTypeId
  );

  return (
    <div className={`p-3 rounded-md grid gap-5 ${isSubOrder ? "" : "border"}`}>
      {!isSubOrder && (
        <div className="px-2 bg-primary w-fit rounded-md">{index + 1}</div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Select
          value={item.clothingTypeId}
          onValueChange={(val) => updateItem(item.id, "clothingTypeId", val)}
        >
          <SelectTrigger className="w-full">
            <SelectValue
              placeholder={clothType ? clothType.title : "Clothing Type"}
            />
          </SelectTrigger>
          <SelectContent>
            {clothingTypeItems.map((ct, idx) => (
              <SelectItem key={idx} value={ct.value}>
                {ct.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex justify-between items-center gap-2 px-2 border rounded-md">
          <p className="flex-7">Price:</p>
          <Input
            type="number"
            className="bg-none flex-1 border-none shadow-none focus-visible:border-none focus-visible:ring-0"
            placeholder="0"
            value={item.price}
            onChange={(e) =>
              updateItem(item.id, "price", Number(e.target.value))
            }
          />
        </div>
      </div>

      <Mearsurements
        selectedClothItem={item.clothingTypeId}
        itemId={item.id}
        isSubOrder={isSubOrder}
      />

      {!isTempId(order.id) && (
        <div className={`${isSubOrder ? "hidden" : "flex justify-end"}`}>
          <UpdateOrderItem isSubOrder={isSubOrder} itemId={item.id} />
        </div>
      )}

      {/* render children */}
      {item.subOrder?.map((subOrder) => (
        <div
          key={subOrder.id}
          className="py-5 border-t border-dashed border-black/50"
        >
          <OrderItem id={subOrder.id} index={null} isSubOrder={true} />

          {!isTempId(order.id) && (
            <div className="flex gap-2 justify-end">
              {!isTempId(order.id) && (
                <UpdateOrderItem
                  isSubOrder={true}
                  itemId={item.id}
                  subItemId={subOrder.id}
                />
              )}
              <DeleteOrderItem
                isSubOrder={true}
                itemId={item.id}
                subItemId={subOrder.id}
              />
            </div>
          )}
        </div>
      ))}

      {!isSubOrder && (
        <div className="w-full grid grid-cols-2 gap-5">
          <Button
            variant="secondary"
            className="cursor-pointer"
            onClick={() => addItem(item.id)}
          >
            <Plus /> Add Sub Order
          </Button>
          <DeleteOrderItem isSubOrder={isSubOrder} itemId={item.id} />
        </div>
      )}
    </div>
  );
};

export default OrderItem;
