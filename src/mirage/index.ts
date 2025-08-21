import { faker } from "@faker-js/faker";
import { Model, createServer } from "miragejs";

type User = {
  id: string;
  name: string;
  email: string;
};

const ModelRegistry = {
  // [key: string]: Model.extend<any>({})
  user: Model.extend<Partial<User>>({}),
};

export function makeServer() {
  return createServer({
    models: ModelRegistry,
    routes() {
      this.urlPrefix = `http://localhost:3000/api/v1`;
      this.timing = 3000;
      this.get("/users", (schema) => {
        return schema.all("user");
      });
    },

    seeds(server) {
      // server.create("user", function() {})

      for (let i = 1; i <= 10; i++) {
        server.create("user", {
          id: faker.string.uuid(),
          name: faker.person.fullName(),
          email: faker.internet.email(),
        });
      }
    },
  });
}
