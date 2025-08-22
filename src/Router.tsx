import { Navigate, Route, Routes } from "react-router-dom";

export const RootRouter = () => {
  return (
    <Routes>
      <Route index element={<Navigate to={"/dashboard"} />} />
      <Route path="/dashboard" element={<div>Dashboard</div>} />
      <Route path="/products" element={<div>Products</div>} />
      <Route path="*" element={<div>404 Not Found</div>} />
    </Routes>
  );
};
