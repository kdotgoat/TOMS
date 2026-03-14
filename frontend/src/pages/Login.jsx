import Form from "@/components/login/Form";
import { useStaffStore } from "@/zustand/staffStore";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { staff } = useStaffStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (staff) {
      navigate("/", { replace: true });
    }
  }, [staff]);

  return (
    <div className="w-full min-h-[100vh] flex justify-center items-center">
      <div className="w-[90%] md:w-[40%] p-5 md:p-10 text-center border-[2px] border-primary/20 rounded-md grid gap-3">
        <h1 className="font-semibold text-2xl">LOGIN TO YOUR ACCOUNT</h1>
        <Form />
      </div>
    </div>
  );
};

export default Login;
