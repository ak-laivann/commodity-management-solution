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

// this can be used for dashboard as well.
// having each them separate for each product might be scalable. but since this is only an assignment,
// going in without the crud but rather only the R - the R!!
export interface TimeSeries_Product {
  productId: string;
  metric: string;
  data: { date: string; value: number }[];
  managerId: string;
  storeOwnerIds: string[];
}
