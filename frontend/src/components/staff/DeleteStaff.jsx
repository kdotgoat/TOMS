import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "../ui/input";
import { useState } from "react";
import { useDeleteStaff } from "@/hooks/staff/useDeleteStaff";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Loader from "../Loader";

const DeleteStaff = ({ staffId }) => {
  const [password, setPassword] = useState("");
  const { loading, deleteStaff } = useDeleteStaff();
  const navigate = useNavigate()

  const handleDelete = async () => {
    const res = await deleteStaff(staffId, password);
    const { error, message } = res;
    if (error) return toast.error(error);

    toast.success(message);
    navigate(0)
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive" className="flex-1 cursor-pointer">
          Delete
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>To confirm delete, input password</DialogTitle>
        </DialogHeader>
        <Input
          placeholder="Password"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button variant="destructive" disabled={loading} onClick={handleDelete}>
          {loading ? <Loader size="sm" /> : "Confirm"}
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteStaff;
