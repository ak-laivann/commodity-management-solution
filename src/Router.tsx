import { Navigate, Route, Routes } from "react-router-dom";
import { ProductRoutes } from "./routes/Product.routes";
import { DashboardRoutes } from "./routes/Dashboard.routes";

export const RootRouter = () => {
  return (
    <Routes>
      <Route index element={<Navigate to={"/dashboard"} />} />
      <Route path="/dashboard" element={<DashboardRoutes />} />
      <Route path="/products/*" element={<ProductRoutes />} />
      <Route path="*" element={<div>404 Not Found</div>} />
    </Routes>
  );
};
