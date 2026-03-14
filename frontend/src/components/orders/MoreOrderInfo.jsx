import React from "react";
import { Button } from "../ui/button";
import { Separator } from "@radix-ui/react-dropdown-menu";

const MoreOrderInfo = ({setMoreOrderInfoOpen}) => {
  return (
    <div className="absolute top-0 left-0 bg-primary/50 w-full h-[100vh] z-10">
      <div className="absolute top-[5%] left-[5%] w-[90%] h-[90vh] bg-background rounded-md p-5 md:px-10 overflow-x-hidden">
        <h3 className="py-5 border-b border-primary/20">Order Dettails</h3>
        <Separator />
        <div>Body</div>

        <div className="flex justify-end gap-2">
          <Button variant="destructive" onClick={() => setMoreOrderInfoOpen(false)}>
            Cancel
          </Button>
          <Button>Create</Button>
        </div>
      </div>
    </div>
  );
};

export default MoreOrderInfo;
