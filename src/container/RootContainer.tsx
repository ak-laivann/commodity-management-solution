import { Route, Routes } from "react-router-dom";
import { HomeContainer } from "./HomeContainer";
import { LoginPage } from "../pages";
import { UserContext } from "../context/UserContext";
import { useState } from "react";
import { UserRole, type User } from "@/components/props";

export const RootContainer = () => {
  const [user, setUser] = useState<User>({
    id: "",
    name: "",
    email: "",
    role: UserRole.Manager,
    managerId: "",
    isSignedIn: false,
  });

  console.log("User State:", user);

  return (
    <UserContext.Provider value={{ ...user, setUser }}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/*" element={<HomeContainer />} />
      </Routes>
    </UserContext.Provider>
  );
};
