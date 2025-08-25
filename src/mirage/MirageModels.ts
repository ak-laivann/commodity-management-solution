import { Model } from "miragejs";
import type { Product, User } from "@/components/props";
import type { TimeSeries_Product } from "./Product";

export const ModelRegistry = {
  user: Model.extend<Partial<User>>({}),
  // having two sets so that we can test the manager and storekeeper
  // with different sets of data.
  user_1: Model.extend<Partial<User>>({}),
  product: Model.extend<Partial<Product>>({}),
  timeseriesproduct: Model.extend<Partial<TimeSeries_Product>>({}),
};
