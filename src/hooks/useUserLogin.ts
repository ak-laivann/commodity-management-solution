import { UserContext } from "@/context";
import { useMutateData } from "./useMutation";
import { useContext } from "react";
import { UserRole, type User } from "@/components/props";

export const useUserLogin = (signinMethod: string, onSuccess: () => void) => {
  const { setUser } = useContext(UserContext);
  const mutation = useMutateData<User, {}>(
    `/api/v1/auth/login?signinMethod=${signinMethod}`,
    {
      onSuccess: (data) => {
        setUser?.({
          id: data.id,
          name: data.name,
          email: data.email,
          role: UserRole.Manager,
          isSignedIn: true,
          managerId: data.managerId,
        });
        onSuccess();
      },
    }
  );

  return mutation;
};
