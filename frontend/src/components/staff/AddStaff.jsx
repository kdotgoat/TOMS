import { Plus } from "lucide-react";
import { Button } from "../ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "../ui/input";
import { toast } from "react-toastify";
import { useCreateStaff } from "@/hooks/staff/useCreateStaff";
import { useState } from "react";
import Loader from "../Loader";

const AddStaff = () => {
  const [staffDetails, setStaffDetails] = useState  ({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    role: "",
  });
  const { loading, createStaff } = useCreateStaff();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStaffDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddStaff = async (e) => {
    e.preventDefault();
    const { firstName, lastName, phoneNumber, role } = staffDetails;
    const res = await createStaff({ firstName, lastName, phoneNumber, role });
    if (res.error) return toast.error(res.error);
    toast.success(res.message);
  };

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline" className="w-fit">
          <Plus /> Add Staff
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Add New Staff Member</DrawerTitle>
        </DrawerHeader>
        <form className="p-5 mx-auto w-full md:w-[60%] grid gap-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="grid gap-1">
              <p>First Name</p>
              <Input
                placeholder="John"
                name="firstName"
                onChange={handleChange}
              />
            </div>
            <div className="grid gap-1">
              <p>Last Name</p>
              <Input
                placeholder="Doe"
                name="lastName"
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="grid gap-1">
            <p>Phone Number</p>
            <Input
              placeholder="0712345678"
              name="phoneNumber"
              onChange={handleChange}
            />
          </div>
          <div className="grid gap-1">
            <p>Role</p>
            <Select
              onValueChange={(value) =>
                setStaffDetails((prev) => ({ ...prev, role: value }))
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="BASIC">BASIC</SelectItem>
                <SelectItem value="ADMIN">ADMIN</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleAddStaff} disabled={loading}>
            {loading ? <Loader size="sm" /> : "Add New Staff"}
          </Button>
        </form>
      </DrawerContent>
    </Drawer>
  );
};

export default AddStaff;
