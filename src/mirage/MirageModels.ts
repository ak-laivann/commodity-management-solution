import { Model } from "miragejs";
import type { Product, User, TimeSeries_Product } from "@/components/props";
import type { SubscriptionTimeSeries } from "./dashboard";

export const ModelRegistry = {
  user: Model.extend<Partial<User>>({}),
  // having two sets so that we can test the manager and storekeeper
  // with different sets of data.
  user_1: Model.extend<Partial<User>>({}),
  product: Model.extend<Partial<Product>>({}),
  timeseriesproduct: Model.extend<Partial<TimeSeries_Product>>({}),
  subscription: Model.extend<Partial<SubscriptionTimeSeries>>({}),
  sales: Model.extend<
    Partial<{
      productId: string;
      amount: number;
      customerMail: string;
      customerName: string;
    }>
  >({}),
};
