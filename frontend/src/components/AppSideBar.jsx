import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { DollarSign, ShoppingBag, User, LogOutIcon, Bell } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { useStaffStore } from "@/zustand";
import Profile from "./Profile";
import { useLogout } from "@/hooks/auth/useLogout";
import { toast } from "react-toastify";
import Loader from "./Loader";

export function AppSidebar() {
  const location = useLocation();
  const { staff } = useStaffStore();
  const { logout, loading } = useLogout();
  const navigate = useNavigate();

  const menuItems = [
    { title: "Orders", icon: <ShoppingBag />, url: "/" },
    { title: "Payments", icon: <DollarSign />, url: "/payments", role: "ADMIN"},
    { title: "Staff", icon: <User />, url: "/staff", role: "ADMIN" },
    { title: "Notifications", icon: <Bell />, url: "/notifications" }
  ];

  const handleLogout = async () => {
    const res = await logout();
    if (res.error) return toast.error(res.error);
    toast.success(res.message);
    navigate("/login");
  };

  // Filter menu items: only show if no role restriction OR matches staff.role
  const visibleMenuItems = menuItems.filter(
    (item) => !item.role || item.role === staff?.role
  );

  return (
    <Sidebar>
      <div className="p-3 border-b border-primary/20 mb-2">
        <h2 className="text-2xl font-semibold">TOMS</h2>
      </div>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {visibleMenuItems.map((item, index) => (
                <SidebarMenuItem key={index} className="rounded-md">
                  <SidebarMenuButton
                    asChild
                    className={`text-lg hover:bg-primary hover:text-background h-full transition-all ease-in duration-300 ${
                      location.pathname === item.url
                        ? "bg-primary text-background"
                        : ""
                    }`}
                  >
                    <Link to={item.url}>
                      <i>{item.icon}</i>
                      <p>{item.title}</p>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter />
      <div className="grid gap-3 m-3">
        {/* Profile inside Sidebar for consistency */}
        <SidebarMenuItem className="rounded-md">
          <Profile />
        </SidebarMenuItem>
        <Button
          className="text-lg cursor-pointer"
          variant="destructive"
          disabled={loading}
          onClick={handleLogout}
        >
          {loading ? (
            <Loader size="sm" />
          ) : (
            <>
              {" "}
              <LogOutIcon /> Logout{" "}
            </>
          )}
        </Button>
      </div>
    </Sidebar>
  );
}
