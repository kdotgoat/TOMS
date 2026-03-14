import { useSingleOrderStore } from "@/zustand/singleOrderStore";
import { Input } from "../ui/input";
import { useClothingTypeStore } from "@/zustand";

const Mearsurements = ({ selectedClothItem, itemId, isSubOrder }) => {
  const { types } = useClothingTypeStore();
  const { updateMeasurement, order } = useSingleOrderStore();
  const { items: orderItems } = order;

  const findItem = (items, id, isSubOrder) => {
    for (const item of items) {
      if(item.id === id) return item

      if(isSubOrder && item.subOrder?.length) {
        const found = findItem(item.subOrder, id)

        if(found) return found
      }
    }
    return null
  }

  const item = findItem(orderItems, itemId, isSubOrder)

  // find clothing type definition
  const clothingType = types.find((t) => t.value === selectedClothItem);

  if (!clothingType || !clothingType.mearsurementConfig) return null;

  return (
    <div className="my-3">
      <h3 className="text-lg">Measurements</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {clothingType.mearsurementConfig.map((field, i) => {
          const value = item?.measurements?.[field] || "";

          return (
            <div
              key={i}
              className="bg-card flex justify-between items-center gap-2 px-2 border rounded-md"
            >
              <p className="flex-7">{field}:</p>
              <Input
                className="bg-none flex-3 border-none shadow-none focus-visible:border-none focus-visible:ring-0"
                type="number"
                placeholder="0"
                value={value}
                onChange={(e) =>
                  updateMeasurement(itemId, field, e.target.value)
                }
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Mearsurements;
