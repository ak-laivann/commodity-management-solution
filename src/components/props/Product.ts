import type { UploadFile } from "antd";

export interface Product {
  status: Product_Creation_Status;
  productName: string;
  productCategory: string;
  productDescription: string;
  tags: string[];
  pricing: Product_Pricing;
  managerId?: string;
  storeOwnerIds?: string[];
  file: {
    thumbnailfile: UploadFile[];
    previewimage: UploadFile[];
  };
  id?: string;
}

// additionally, we can add currency. but
// since this is an assessment I am not adding it.

interface Product_Pricing {
  price: number;
  discount: number;
  discounCategory: string;
}

export enum Product_Creation_Status {
  DRAFT = "draft",
  PUBLISHED = "published",
}
