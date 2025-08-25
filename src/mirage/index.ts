import { createServer } from "miragejs";
import {
  getManager,
  getStoreKeeper,
  mockAuthLogin,
  mockGetFirstSetOfUsers,
  mockGetSecondSetOfUsers,
} from "./Users";
import { ModelRegistry } from "./MirageModels";
import { faker } from "@faker-js/faker";
import {
  getProduct,
  getProductTimeSeries,
  mockGetProduct,
  mockGetProducts,
  mockPostProduct,
  mockPutProduct,
} from "./Product";
import { Product_Creation_Status } from "@/components/props";

export function makeServer() {
  return createServer({
    models: ModelRegistry,
    routes() {
      this.urlPrefix = `/api/v1`;
      this.timing = 3000;
      this.get("/users", mockGetFirstSetOfUsers);
      this.get("/users_1", mockGetSecondSetOfUsers);

      this.post("/auth/login", mockAuthLogin);

      this.get("/products", mockGetProducts);
      this.post("/products", mockPostProduct);
      this.put("/products/:id", mockPutProduct);
      this.get("/products/:id", mockGetProduct);

      // this guy is useful in case we want to move to real api.
      // just set use mirage to false or remove it in the api call
      // and api calls will be made to the real api.
      // defaulting it to true so that we can use miragejs which can always be overwritten.
      this.passthrough(
        (request) =>
          !(
            request.queryParams?.useMirage === "true" ||
            request.requestHeaders?.useMirage === "true"
          )
      );
    },

    seeds(server) {
      const managerId = faker.database.mongodbObjectId();
      const managerId_1 = faker.database.mongodbObjectId();

      const storeKeeperIds = [
        faker.database.mongodbObjectId(),
        faker.database.mongodbObjectId(),
        faker.database.mongodbObjectId(),
        faker.database.mongodbObjectId(),
        faker.database.mongodbObjectId(),
        faker.database.mongodbObjectId(),
      ];

      server.create("user", getManager(managerId));
      server.create("user_1", getManager(managerId_1));

      for (let i = 0; i < 3; i++) {
        server.create("user", getStoreKeeper(managerId, storeKeeperIds[i]));
        server.create(
          "user_1",
          getStoreKeeper(managerId_1, storeKeeperIds[i + 3])
        );

        for (let j = 0; j < 30; j++) {
          const productId = faker.database.mongodbObjectId();
          const productId_1 = faker.database.mongodbObjectId();
          const status = [
            Product_Creation_Status.PUBLISHED,
            Product_Creation_Status.DRAFT,
          ][faker.number.int({ min: 0, max: 1 })];
          server.create(
            "product",
            getProduct(managerId, storeKeeperIds.slice(0, 3), productId, status)
          );
          server.create(
            "product",
            getProduct(
              managerId_1,
              storeKeeperIds.slice(3, 6),
              productId_1,
              status
            )
          );

          if (status === Product_Creation_Status.PUBLISHED && i === 0) {
            ["SALES", "REVENUE", "VIEWS"].forEach((metric) => {
              server.create(
                "timeseriesproduct",
                getProductTimeSeries(productId, metric)
              );
              server.create(
                "timeseriesproduct",
                getProductTimeSeries(productId_1, metric)
              );
            });
          }
        }
      }
    },
  });
}
