import { apiGet } from "@/api";
import StatCard from "../StatCard";
import { useEffect, useState } from "react";

const Stats = () => {
  const [statsInfo, setStatsInfo] = useState([]);
  const [error, setError] = useState(null);


  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    const [res, error] = await apiGet("/orders/stats");

    if (error) return setError(error);

    setStatsInfo([
      { title: "Total Orders", quantity: res.totalOrders },
      { title: "Completed", quantity: res.completed },
      { title: "In Progress", quantity: res.inProgress },
      { title: "Delivered", quantity: res.delivered },
      { title: "Pending Delivery", quantity: res.pendingDelivery },
    ]);
  };
  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-5">
        {statsInfo.map((item, index) => (
          <StatCard key={index} title={item.title} quantity={item.quantity} />
        ))}
      </div>
    </>
  );
};

export default Stats;
