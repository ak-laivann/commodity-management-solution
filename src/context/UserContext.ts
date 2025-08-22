import { createContext } from "react";
import { type UserContextObject, UserRole } from "@/components/props";

export const UserContext = createContext<UserContextObject>({
  id: "",
  name: "",
  email: "",
  role: UserRole.Manager,
  managerId: "",
  isSignedIn: false,
  setUser: () => {},
});
