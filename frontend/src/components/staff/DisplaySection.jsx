import { EllipsisVertical, Plus, Search, User } from "lucide-react";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import AddStaff from "./AddStaff";
import SearchStaff from "./SearchStaff";
import { useEffect, useState } from "react";
import { apiGet } from "@/api";
import StaffDetails from "./StaffDetails";
import Loader from "../Loader";
import { useFetchStaff } from "@/hooks/staff/useFetchStaff";

const DisplaySection = () => {
  const [staff, setStaff] = useState([]);
  const [pagination, setPagination] = useState({});
  const [page, setPage] = useState(1);
  const { fetchStaff, loading } = useFetchStaff();

  const handleFetchStaff = async () => {
    const res = await fetchStaff();
    if (res.error) return toast.error(res.error);
    setStaff(res.staff);
  };

  useEffect(() => {
    handleFetchStaff();
  }, [page]);

  return (
    <Card className="px-2 bg-accent mt-5 md:mt-10">
      <div className="grid md:flex justify-between gap-3 items-center ">
        <div className="flex items-center gap-2 w-full">
          <i className="p-2 border bg-background rounded-md">
            <User />
          </i>
          <h3>
            Total Employees: <b>{staff.length}</b>
          </h3>
        </div>

        <SearchStaff />
        <AddStaff />
      </div>

      <Table>
        <TableHeader className="bg-primary">
          <TableRow>
            <TableHead>NAME</TableHead>
            <TableHead>CONTACT</TableHead>
            <TableHead>ROLE</TableHead>
            <TableHead>JOINED ON</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading && (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-5">
                <Loader size="lg" />
              </TableCell>
            </TableRow>
          )}

          {!loading && staff.length <= 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-5">
                No staff found
              </TableCell>
            </TableRow>
          )}

          {staff.map((s) => (
            <TableRow>
              <TableCell>{s.first_name + " " + s.last_name}</TableCell>
              <TableCell>{s.phone_number}</TableCell>
              <TableCell>{s.role}</TableCell>
              <TableCell>
                {new Date(s.created_at).toISOString().split("T")[0]}
              </TableCell>
              <TableCell className="text-center">
                <StaffDetails staff={s} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

    </Card>
  );
};

export default DisplaySection;
