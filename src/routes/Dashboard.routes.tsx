import { Route, Routes } from "react-router-dom";

export const DashboardRoutes = () => {
  return (
    <Routes>
      <Route index element={<div>Dashboard</div>} />
      <Route path="*" element={<div>404 Not Found</div>} />
    </Routes>
  );
};
