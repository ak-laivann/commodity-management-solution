import { DashboardPage } from "@/pages";
import { Route, Routes } from "react-router-dom";

export const DashboardRoutes = () => {
  return (
    <Routes>
      <Route index element={<DashboardPage />} />
      <Route path="/*" element={<div>404 Not Found</div>} />
    </Routes>
  );
};
