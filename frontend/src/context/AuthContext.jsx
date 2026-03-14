import { useGetCurrentUser } from "@/hooks/auth/useGetCurrentUser";
import { useStaffStore } from "@/zustand/staffStore";
import { useEffect, useState } from "react";
import { Outlet, Navigate } from "react-router-dom";
import Loader from "@/components/Loader";

const AuthContext = () => {
  const { staff } = useStaffStore();
  const { getCurrentUser } = useGetCurrentUser();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => { 
    const verifyUser = async () => {
      if (!staff) {
        // Wait for the API call to finish checking the cookies
        await getCurrentUser();
      }
      // Stop the loading state once the check is done
      setIsChecking(false);
    };

    verifyUser();
  }, []); // Run only once when the app mounts

  // Show a loading screen while we wait for the backend response
  if (isChecking) {
    return (
      <div className="w-full min-h-screen flex justify-center items-center">
        <Loader size="lg" />
      </div>
    );
  }

  // Once checking is done, decide where to route
  return staff ? <Outlet /> : <Navigate to="/login" replace />;
};

export default AuthContext;