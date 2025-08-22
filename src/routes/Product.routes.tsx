import { Navigate, Route, Routes } from "react-router-dom";

export const ProductRoutes = () => {
  return (
    <Routes>
      <Route index element={<Navigate to={"./all"} />} />
      <Route path="/all" element={<div>ALL PRODUCTS</div>} />
      <Route path="/add" element={<div>Add New Product</div>} />
      <Route path="/:id/edit" element={<div>Edit Product</div>} />
      <Route path="*" element={<div>404 Not Found</div>} />
    </Routes>
  );
};
