import { Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "../ui/input";
import { useState } from "react";
import { useSingleOrderStore } from "@/zustand";
import { useNavigate } from "react-router-dom";
import { useDeleteOrder } from "@/hooks/orders/useDeleteOrder";
import Loader from "../Loader";
import { toast } from "react-toastify";

const DeleteOrder = () => {
  const [password, setPassword] = useState("");
  const { order } = useSingleOrderStore();
  const { deleteOrder, loading } = useDeleteOrder();
  const navigate = useNavigate();

  const handleDelete = async () => {
    const res = await deleteOrder(order.id, password);
    if (res.error) return toast.error(res.error);
    toast.success(res.message);
    navigate("/orders");
  };

  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="destructive" className="cursor-pointer">
            <Trash2 />
            <span className="hidden md:flex">Delete</span>
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader className="grid gap-5">
            <DialogTitle>To confirm delete, enter your password</DialogTitle>
            <Input
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button onClick={handleDelete} disabled={loading}>
              {loading ? <Loader size="sm" /> : "Confirm"}
            </Button>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DeleteOrder;
