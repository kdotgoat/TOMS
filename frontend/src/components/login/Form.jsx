import { Eye, EyeOff, KeyRound, User } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useState } from "react";
import { Alert, AlertDescription } from "../../components/ui/alert";
import { useLogin } from "@/hooks/auth/useLogin";
import { toast } from "react-toastify";
import Loader from "../Loader";

const Form = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    phoneNumber: "",
    password: "",
  });
  const { login, loading } = useLogin();

  const handleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const loginFields = [
    {
      id: "phoneNumber",
      name: "phoneNumber",
      placeholder: "Phone Number",
      type: "text",
      icon: <User />,
    },
    {
      id: "password",
      name: "password",
      placeholder: "Password",
      type: showPassword ? "text" : "password",
      icon: <KeyRound />,
      icon2: showPassword ? <EyeOff /> : <Eye />,
      icon2Function: handleShowPassword,
    },
  ];

  const onChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const res = await login(formData);
    if (res.error) return toast.error(res.error);
    toast.success(res.message);
  };

  return (
    <form className="grid gap-3" onSubmit={onSubmit}>
      {loginFields.map((item) => (
        <div
          key={item.name}
          className="flex justify-center items-center gap-2 p-2 border border-primary/20 rounded-md"
        >
          <i>{item.icon}</i>
          <Input
            className="border-none shadow-none focus-visible:border-none focus-visible:ring-0"
            placeholder={item.placeholder}
            type={item.type}
            name={item.name}
            onChange={onChange}
          />
          {item.icon2 && (
            <i onClick={item.icon2Function} className="cursor-pointer">
              {item.icon2}
            </i>
          )}
        </div>
      ))}
      <Button type="submit" disabled={loading}>
        {loading ? <Loader size="sm" /> : "Login"}
      </Button>
    </form>
  );
};

export default Form;