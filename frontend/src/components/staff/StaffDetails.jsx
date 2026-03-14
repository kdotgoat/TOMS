import { EllipsisVertical, Plus } from "lucide-react";
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
import { useEffect, useState } from "react";
import { apiDelete, apiPatch } from "@/api";
import { toast } from "react-toastify";
import DeleteStaff from "./DeleteStaff";
import { useUpdateStaff } from "@/hooks/staff/useUpdateStaff";
import Loader from "../Loader";

const StaffDetails = ({ staff }) => {
  const [staffDetails, setStaffDetails] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    role: "",
  });
  const { updateStaff, loading } = useUpdateStaff();

  const handleSetStaff = () => {
    const { first_name, last_name, phone_number, role } = staff;
    setStaffDetails({
      firstName: first_name,
      lastName: last_name,
      phoneNumber: phone_number,
      role,
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStaffDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const res = await updateStaff(staff.id, staffDetails);
    if (res.error) return toast.error(res.error);
    toast.success(res.message);
  };

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button
          variant="outline"
          className="w-fit cursor-pointer"
          onClick={handleSetStaff}
        >
          <EllipsisVertical />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Staff Member Details</DrawerTitle>
        </DrawerHeader>
        <form
          className="p-5 mx-auto w-full md:w-[60%] grid gap-5"
          onSubmit={handleUpdate}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="grid gap-1">
              <p>First Name</p>
              <Input
                placeholder="John"
                name="firstName"
                value={staffDetails.firstName}
                onChange={handleChange}
              />
            </div>
            <div className="grid gap-1">
              <p>Last Name</p>
              <Input
                placeholder="Doe"
                name="lastName"
                value={staffDetails.lastName}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="grid gap-1">
            <p>Phone Number</p>
            <Input
              placeholder="0712345678"
              name="phoneNumber"
              value={staffDetails.phoneNumber}
              onChange={handleChange}
            />
          </div>
          <div className="grid gap-1">
            <p>Role</p>
            <Select
              name="role"
              value={staffDetails.role}
              onValueChange={handleChange}
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
          <div className="w-full flex justify-between gap-3">
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 cursor-pointer"
            >
              {loading ? <Loader size="md" /> : "Update"}
            </Button>
            <DeleteStaff staffId={staff.id} />
          </div>
        </form>
      </DrawerContent>
    </Drawer>
  );
};

export default StaffDetails;
