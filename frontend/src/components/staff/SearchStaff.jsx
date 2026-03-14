import { Search } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

const SearchStaff = () => {
  return (
    <div className="flex justify-center items-center gap-2 border rounded-md w-full md:w-1/4 lg:w-1/2">
      <Input
        className="border-none shadow-none focus-visible:border-none focus-visible:ring-0"
        placeholder="Search..."
        onChange=""
      />
      <Button onClick="">
        <Search />
      </Button>
    </div>
  );
};

export default SearchStaff;
