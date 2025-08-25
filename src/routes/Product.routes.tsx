import { ViewProductPage, AddProductPage, ProductListingPage } from "@/pages";
import { Navigate, Route, Routes } from "react-router-dom";

export const ProductRoutes = () => {
  return (
    <Routes>
      <Route index element={<Navigate to={"./all"} />} />
      <Route path="/all" element={<ProductListingPage />} />
      <Route path="/add" element={<AddProductPage />} />
      <Route path="/:id/edit" element={<ViewProductPage />} />
      <Route path="*" element={<div>404 Not Found</div>} />
    </Routes>
  );
};
