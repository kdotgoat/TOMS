import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { UserPen, User, Phone, Shield, Lock, Eye, EyeOff } from "lucide-react";
import { useStaffStore } from "@/zustand";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useState } from "react";
import { useChangePassword } from "@/hooks/auth/useChangePassword";
import { toast } from "react-toastify";
import { Card } from "./ui/card";
import Loader from "./Loader";

const Profile = () => {
  const { staff } = useStaffStore();
  const { changePassword, loading } = useChangePassword();
  const [passwordData, setPasswordData] = useState({
    password: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordFields, setPasswordFields] = useState([
    {
      title: "Current Password",
      placeholder: "Enter current password",
      name: "password",
      type: "password",
    },
    {
      title: "New Password",
      placeholder: "Enter new password",
      name: "newPassword",
      type: "password",
    },
    {
      title: "Confirm Password",
      placeholder: "Confirm new password",
      name: "confirmPassword",
      type: "password",
    },
  ]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const toggleShowPassword = (i) => {
    setPasswordFields((prev) =>
      prev.map((field, index) =>
        index === i
          ? { ...field, type: field.type === "password" ? "text" : "password" }
          : field
      )
    );
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return toast.error("New password and confirm password do not match");
    }

    const res = await changePassword(passwordData);
    if (res.error) return toast.error(res.error);
    toast.success(res.message);
  };

  const getRoleColor = (role) => {
    switch (role) {
      case "ADMIN":
        return "from-purple-500 to-pink-500";
      case "BASIC":
        return "from-green-500 to-emerald-500";
      default:
        return "from-gray-500 to-slate-500";
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger className="flex gap-2 items-center w-full py-1 px-3 text-lg hover:bg-primary hover:text-background rounded-md cursor-pointer">
        <UserPen className="w-5 h-5" />
        <p>Profile</p>
      </AlertDialogTrigger>

      <AlertDialogContent className="dark:bg-accent max-h-[90vh] overflow-y-auto">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-lg sm:text-xl font-bold text-center text-primary">
            View and Update Profile
          </AlertDialogTitle>
        </AlertDialogHeader>

        {/* ===== Staff info ===== */}
        <div className="space-y-3 px-2">
          {/* ===== Staff Name ===== */}
          <Card className="flex flex-row px-3 items-center gap-3">
            <div className="p-2 bg-primary rounded-lg flex-shrink-0">
              <User className=" w-6 h-6 text-background" />
            </div>
            <div className="">
              <label className="text-muted-foreground text-sm">Full Name</label>
              <p className="font-semibold">
                {staff?.firstName + " " + staff?.lastName}
              </p>
            </div>
          </Card>

          {/* ===== Phone Details =====  */}
          <Card className="flex flex-row px-3 items-center gap-3">
            <div className="p-2 bg-primary rounded-lg flex-shrink-0">
              <Phone className=" w-6 h-6 text-background" />
            </div>
            <div className="">
              <label className="text-muted-foreground text-sm">
                Phone Number
              </label>
              <p className="font-semibold">{staff.phoneNumber}</p>
            </div>
          </Card>

          {/* ===== Role Details ===== */}
          <Card className="flex flex-row px-3 items-center gap-3">
            <div className="p-2 bg-primary rounded-lg flex-shrink-0">
              <Shield className=" w-6 h-6 text-background" />
            </div>
            <div>
              <label className="text-muted-foreground">Role</label>
              <p
                className={`px-2 py-1 mt-1 rounded-md text-xs font-semibold bg-gradient-to-r text-background ${getRoleColor(
                  staff.role
                )}`}
              >
                {staff.role}
              </p>
            </div>
          </Card>

          {/* Password section */}
          <div className="h-[2px] my-5 border" />
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center gap-2 mb-2 sm:mb-3">
              <Lock className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" />
              <label className="text-sm sm:text-base">Change Password</label>
            </div>

            {passwordFields.map((field, index) => (
              <div className="relative" key={index}>
                <label
                  htmlFor={field.name}
                  className="text-xs sm:text-sm font-medium block mb-1 ml-3"
                >
                  {field.title}
                </label>
                <div className="relative">
                  <Input
                    id={field.name}
                    type={field.type}
                    name={field.name}
                    value={passwordData[field.name]}
                    onChange={handleChange}
                    placeholder={field.placeholder}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-2 sm:px-3 hover:bg-transparent"
                    onClick={() => toggleShowPassword(index)}
                  >
                    {field.type === "text" ? (
                      <EyeOff className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foteground" />
                    )}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <AlertDialogFooter className="gap-2 sm:gap-3 pt-4 sm:pt-6 px-2 flex-col sm:flex-row">
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction disabled={loading} onClick={handleChangePassword}>
            {loading ? <Loader /> : "Update"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default Profile;
