import { Button } from "../ui/button";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import { Card } from "../ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Mearsurements from "./Mearsurements";
import { useState } from "react";

const NewOrder = ({ newOrderOpen, setNewOrderOpen }) => {
  const [orderType, setOrderType] = useState("individual");
  const [orderItems, setOrderItems] = useState([
    {
      clothingType: "",
      amount: 0,
      subOrderItems: null,
    },
  ]);

  const handleSelectChange = (
    index,
    value,
    isSubOrder = false,
    subIndex = null
  ) => {
    const updated = [...orderItems];

    if (isSubOrder) {
      updated[index].subOrderItems[subIndex].clothingType = value;
    } else {
      updated[index].clothingType = value;
    }

    setOrderItems(updated);
  };

  const handleAmountChange = (index, value) => {
    const updated = [...orderItems];
    updated[index].amount = value;
    setOrderItems(updated);
  };

  const handleAddItem = () => {
    setOrderItems([
      ...orderItems,
      { clothingType: "", amount: 0, subOrderItems: null },
    ]);
  };

  const handleAddSubOrder = (index) => {
    const updated = [...orderItems];

    if (!updated[index].subOrderItems) {
      updated[index].subOrderItems = [];
    }

    updated[index].subOrderItems.push({ clothingType: "", amount: 0 });
    setOrderItems(updated);
  };

  return (
    <div
      className={`absolute top-0 left-0 bg-primary/50 w-full h-[100vh] z-10 ${
        newOrderOpen ? "overflow-x-hidden" : ""
      }`}
    >
      <div className="absolute top-[5%] left-[5%] w-[90%] h-[90vh] bg-background rounded-md p-5 md:px-10 overflow-x-hidden">
        <h3 className="font-semibold text-2xl">Create New Order</h3>
        <p className="my-2 text-muted-foreground">
          Add details for the new order
        </p>
        <Separator />
        <div className="my-5 grid gap-8">
          {/* ===== order type ===== */}
          <Card className="p-5">
            <h3 className="text-2xl font-semibold">Order Type</h3>
            <RadioGroup defaultValue="individual">
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="individual"
                  id="option-one"
                  onClick={() => setOrderType("individual")}
                />
                <Label htmlFor="option-one">Individual</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="group"
                  id="option-two"
                  onClick={() => setOrderType("group")}
                />
                <Label htmlFor="option-two">Group</Label>
              </div>
            </RadioGroup>
          </Card>

          {/* ===== Customer Info ===== */}
          <Card className="p-5">
            <h3 className="text-2xl font-semibold">Customer Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Input placeholder="Full Name" />
              <Input placeholder="Phone Number" />
            </div>
          </Card>

          {/* =====  Order Items ===== */}
          <Card className="p-5">
            <h3 className="text-2xl font-semibold">
              {orderType === "group" ? "Group Order" : "Order Items"}
            </h3>

            {orderItems.map((item, index) => (
              <div
                className="p-3 md:p-5 border-2 border-dashed rounded-md"
                key={index}
              >
                <p className="px-2 bg-muted-foreground rounded-full w-fit mb-3 text-background">
                  {index + 1}
                </p>
                <div className="grid gap-3 grid-cols-1 md:grid-cols-2">
                  <Select
                    onValueChange={(value) => handleSelectChange(index, value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Clothing Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="trouser">Trouser</SelectItem>
                      <SelectItem value="shirt">Shirt</SelectItem>
                      <SelectItem value="coat">Coat</SelectItem>
                      <SelectItem value="dress">Dress</SelectItem>
                      <SelectItem value="skirt">Skirt</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    type="number"
                    placeholder="Amount"
                    value={item.amount}
                    onChange={(e) => handleAmountChange(index, e.target.value)}
                  />
                </div>

                {/* ===== Dynamic Mearsurement Fields ===== */}
                <Mearsurements selectedItem={item.clothingType} />

                {/* ===== Sub Order ===== */}
                {item.subOrderItems &&
                  item.subOrderItems.map((subOrder, i) => (
                    <div className="mt-5 py-5 border-t rounded-md" key={i}>
                      <div className="grid gap-3 grid-cols-1 md:grid-cols-2">
                        <Select
                          onValueChange={(value) =>
                            handleSelectChange(index, value, true, i)
                          }
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Clothing Type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="trouser">Trouser</SelectItem>
                            <SelectItem value="shirt">Shirt</SelectItem>
                            <SelectItem value="coat">Coat</SelectItem>
                            <SelectItem value="dress">Dress</SelectItem>
                            <SelectItem value="skirt">Skirt</SelectItem>
                          </SelectContent>
                        </Select>
                        <Input
                          type="number"
                          placeholder="Amount"
                          value={subOrder.amount}
                          onChange={(e) =>
                            handleAmountChange(index, e.target.value, true, i)
                          }
                        />
                      </div>
                      {/* ===== Dynamic Mearsurement Fields ===== */}
                      <Mearsurements selectedItem={subOrder.clothingType} />
                    </div>
                  ))}

                {orderType != "group" ? null : (
                  <Button
                    variant="outline"
                    onClick={() => handleAddSubOrder(index)}
                  >
                    <Plus /> Add Sub Order
                  </Button>
                )}
              </div>
            ))}

            {/* ===== Add Item Button ===== */}
            <Button onClick={handleAddItem}>
              <Plus /> Add Item
            </Button>
          </Card>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="destructive" onClick={() => setNewOrderOpen(false)}>
            Cancel
          </Button>
          <Button>Create</Button>
        </div>
      </div>
    </div>
  );
};

export default NewOrder;
