import { Model } from "miragejs";
import type { User } from "./Users";

export const ModelRegistry = {
  user: Model.extend<Partial<User>>({}),
  // having two sets so that we can test the manager and storekeeper
  // with different sets of data.
  user_1: Model.extend<Partial<User>>({}),
};
