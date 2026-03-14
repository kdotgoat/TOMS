import { SidebarTrigger } from "./ui/sidebar";
import { ModeToggle } from "./ui/mode-toggle";
import { useStaffStore } from "@/zustand/staffStore";

const Topbar = () => {
  const { staff } = useStaffStore();
  return (
    <nav className="flex justify-between items-center border-b-2 border-primary/20 w-full py-3 px-3 md:px-5">
      <div className="flex items-center">
        <SidebarTrigger className="" />
        <h3 className="font-semibold text-2xl">
          {staff.firstName} {staff.lastName}
        </h3>
      </div>
      <ModeToggle />
    </nav>
  );
};

export default Topbar;
