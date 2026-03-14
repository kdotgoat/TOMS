import ActionBar from "@/components/orders/ActionBar";
import OrdersTable from "@/components/orders/OrdersTable";
import Stats from "@/components/orders/Stats";

export default function Dashboard() {
  return (
    <div className="dashboard">
      <Stats />
      <ActionBar />
      <OrdersTable />
    </div>
  );
}
