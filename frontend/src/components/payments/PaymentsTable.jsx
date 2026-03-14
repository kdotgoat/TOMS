import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Button } from "../ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useFetchPayments } from "@/hooks/payments/useFetchPayments";
import Loader from "../Loader";

const PaymentsTable = () => {
  const { fetchPayments, loading } = useFetchPayments();
  const [payments, setPayments] = useState([]);
  const [pagination, setPagination] = useState({});
  const [page, setPage] = useState(1);

  const toggleNextPage = () => {
    setPage(page + 1);
  };

  const togglePrevPage = () => {
    setPage(page - 1);
  };

  const handleFetchPayments = async () => {
    const res = await fetchPayments(page);
    if (res.error) toast.error(res.error);
    setPayments(res.payments || []);
    setPagination(res.pagination);
  };

  useEffect(() => {
    handleFetchPayments();
  }, [page]);

  return (
    <div className="mt-10">
      <Table>
        <TableHeader className="bg-primary rounded-md">
          <TableRow>
            <TableHead>NAME</TableHead>
            <TableHead>MODE</TableHead>
            <TableHead>AMOUNT</TableHead>
            <TableHead>REFERENCE NO</TableHead>
            <TableHead>UPDATED BY</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading && (
            <TableRow>
              <TableCell colspan="5">
                <div className="flex justify-center items-center py-10">
                  <Loader size="lg" />
                </div>
              </TableCell>
            </TableRow>
          )}

          {!loading && payments.length <= 0 && (
            <TableRow>
              <TableCell colspan="5" className="text-center">
                No payments found
              </TableCell>
            </TableRow>
          )}

          {payments.map((payment) => (
            <TableRow key={payment.id}>
              <TableCell>{payment.order.name}</TableCell>
              <TableCell>{payment.mode}</TableCell>
              <TableCell>{payment.amount}</TableCell>
              <TableCell>{payment.reference}</TableCell>
              <TableCell>
                {payment.updated_by.first_name +
                  " " +
                  payment.updated_by.last_name}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {pagination && Object.keys(pagination).length > 0 && (
        <div className="flex justify-center text-center gap-2 my-10">
          <Button
            className="cursor-pointer"
            disabled={!pagination.hasPrevPage}
            onClick={togglePrevPage}
          >
            <ChevronLeft /> Prev
          </Button>
          <Button
            className="cursor-pointer"
            disabled={!pagination.hasNextPage}
            onClick={toggleNextPage}
          >
            Next <ChevronRight />
          </Button>
        </div>
      )}
    </div>
  );
};

export default PaymentsTable;
