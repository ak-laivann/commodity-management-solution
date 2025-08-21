import { createServer } from "miragejs";
import {
  getManager,
  getStoreKeeper,
  mockGetFirstSetOfUsers,
  mockGetSecondSetOfUsers,
  type User,
} from "./Users";
import { ModelRegistry } from "./MirageModels";

export function makeServer() {
  return createServer({
    models: ModelRegistry,
    routes() {
      this.urlPrefix = `http://localhost:3000/api/v1`;
      this.timing = 3000;
      this.get("/users", mockGetFirstSetOfUsers);
      this.get("/users_1", mockGetSecondSetOfUsers);

      // this guy is useful in case we want to move to real api.
      // just set use mirage to false or remove it in the api call
      // and api calls will be made to the real api.
      // defaulting it to true so that we can use miragejs which can always be overwritten.
      this.passthrough(
        (request) =>
          !(
            request.queryParams?.useMirage ??
            request.requestHeaders?.useMirage ??
            true
          )
      );
    },

    seeds(server) {
      server.create("user", getManager(true));
      server.create("user_1", getManager(false));

      for (let i = 0; i < 3; i++) {
        server.create("user", getStoreKeeper(true));
        server.create("user_1", getStoreKeeper(false));
      }
    },
  });
}
