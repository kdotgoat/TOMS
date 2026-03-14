import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "../ui/button";
import PaymentStatusBadge from "./PaymentStatusBadge";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, Eye } from "lucide-react";
import { useOrderStore } from "@/zustand/ordersStore";
import { useGetAllOrders } from "@/hooks/orders/useGetAllOrders";
import Loader from "../Loader";
import { toast } from "react-toastify";
import { useGetOrderById } from "@/hooks/singleOrder/useGetOrderById";

const OrdersTable = () => {
  const [page, setPage] = useState(1);
  const { orders, pagination, loading } = useOrderStore();
  const { getOrderById } = useGetOrderById();
  const { getAllOrders } = useGetAllOrders();

  useEffect(() => {
    handleGetOrders();
  }, [page]);

  const handleGetOrders = async () => {
    const res = await getAllOrders(page);
    if (res.error) toast.error(res.error);
  };

  const nextPage = () => {
    setPage((prev) => prev + 1);
  };

  const prevPage = () => {
    setPage((prev) => prev - 1);
  };

  const handleGetOrderById = async (orderId) => {
    const res = await getOrderById(orderId);
    if (res.error) return toast.error(res.error);
  };

  return (
    <div>
      <h1 className="mb-5 mt-5 md:mt-0 text-2xl">Orders Summary</h1>
      <Table className="text-md">
        <TableHeader className="bg-primary text-background rounded-t-full">
          <TableRow>
            <TableHead className="text-background py-3">Order Name</TableHead>
            <TableHead className="text-background">Order Type</TableHead>
            <TableHead className="text-background">Order Status</TableHead>
            <TableHead className="text-background">Delivery Status</TableHead>
            <TableHead className="text-background">Payment Status</TableHead>
            <TableHead className="text-background"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading && orders.length !== 0 && (
            <TableRow>
              <TableCell colSpan={6} className="text-center">
                <div className="flex justify-center items-center py-6">
                  <Loader size="lg" />
                </div>
              </TableCell>
            </TableRow>
          )}

          {orders.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="text-center">
                No Orders found
              </TableCell>
            </TableRow>
          )}

          {orders.length > 0 &&
            orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{order.name}</TableCell>
                <TableCell>{order.type}</TableCell>
                <TableCell>{order.status}</TableCell>
                <TableCell>{order.delivery}</TableCell>
                <TableCell>
                  <PaymentStatusBadge
                    totalPrice={order.totalPrice}
                    totalPayments={order.totalPayments}
                  />
                </TableCell>
                <TableCell className="text-center">
                  <Link to={`/orders/${order.id}`}>
                    <Button
                      variant="link"
                      className="cursor-pointer"
                      onClick={() => handleGetOrderById(order.id)}
                    >
                      <Eye /> More
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
      {/* ===== Pagination ===== */}
      {pagination && Object.keys(pagination).length > 0 && (
        <div className="flex justify-center text-center gap-2 my-10">
          <Button
            className="cursor-pointer"
            disabled={!pagination.hasPrevPage}
            onClick={prevPage}
          >
            <ChevronLeft /> Prev
          </Button>
          <Button
            className="cursor-pointer"
            disabled={!pagination.hasNextPage}
            onClick={nextPage}
          >
            Next <ChevronRight />
          </Button>
        </div>
      )}
    </div>
  );
};

export default OrdersTable;
