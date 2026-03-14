import Loader from "@/components/Loader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useGetNotifications } from "@/hooks/notifications/useGetNotifications";
import { useGetOrderById } from "@/hooks/singleOrder/useGetOrderById";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const Notifications = () => {
  const { getNotifications, loading, notifications, count } =
    useGetNotifications();
  const { getOrderById } = useGetOrderById();

  useEffect(() => {
    getNotifications();
  }, []);

  const handleGetOrderById = async (orderId) => {
    const res = await getOrderById(orderId);
    if (res.error) return toast.error(res.error);
  };

  return (
    <div className="grid gap-5">
      <div>
        <h3 className="text-3xl font-semibold mb-3">Notifications</h3>
        <p>You have {count} notifications today</p>
      </div>
      <Card className="grid gap-5">
        {loading && (
          <div className="flex justify-center items-center">
            <Loader size="lg" />
          </div>
        )}

        {notifications.length <= 0 && !loading && (
          <p className="flex justify-center items-center">
            No notifications for today
          </p>
        )}

        {notifications.map((notification) => (
          <p
            className={`flex justify-between flex-col md:flex-row gap-3 text-sm mx-3 md:mx-5 p-5 rounded-md text-black ${
              notification.overdue ? "bg-red-200" : "bg-blue-200"
            }`}
          >
            {notification.message}
            <Link to={`/orders/${notification.orderId}`}>
              <Button
                variant="outline"
                className="cursor-pointer"
                onClick={() => handleGetOrderById(notification.orderId)}
              >
                View
              </Button>
            </Link>
          </p>
        ))}
      </Card>
    </div>
  );
};

export default Notifications;
