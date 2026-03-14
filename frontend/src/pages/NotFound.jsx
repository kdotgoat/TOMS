import { Button } from "@/components/ui/button";

const NotFound = () => {
  return (
    <div className="w-full min-h-[100vh] flex justify-center items-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Page Not Found</h1>
        <Button>Home Page</Button>
      </div>
    </div>
  );
};

export default NotFound;
