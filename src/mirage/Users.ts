import { faker } from "@faker-js/faker";
import { Response, type Registry } from "miragejs";
import type { RouteHandler } from "miragejs/server";
import type { ModelRegistry } from "./MirageModels";
import { UserRole, type User } from "@/components/props";

const managerId = "YouAreTheManager_1";
const managerId_1 = "YouAreTheManager_2";

// since this is used inside seeds of miragejs, I am having isSignedIn as true.
// either way, we will go ahead with the login api and set this dynamically by then.
export function getStoreKeeper(managerId: string, storeKeeperId: string): User {
  return {
    id: storeKeeperId ?? faker.database.mongodbObjectId(),
    name: faker.person.fullName(),
    email: faker.internet.email(),
    role: UserRole.StoreKeeper,
    isSignedIn: true,
    managerId: managerId,
  };
}

export function getManager(
  id: string,
  email?: string,
  isFirstSet?: boolean
): User {
  return {
    id,
    name: faker.person.fullName(),
    email: email ?? faker.internet.email(),
    role: UserRole.Manager,
    isSignedIn: true,
    managerId: isFirstSet ? "YouAreTheManager_1" : "YouAreTheManager_2",
  };
}

export const mockGetFirstSetOfUsers: RouteHandler<
  Registry<typeof ModelRegistry, any>
> = (schema, request) => {
  const users = schema.all("user").models;
  return {
    // @ts-ignore
    manager: users.filter((user) => user.attrs.role === UserRole.Manager),
    storekeepers: users.filter(
      // @ts-ignore
      (user) => user.attrs.role === UserRole.StoreKeeper
    ),
  };
};

export const mockGetSecondSetOfUsers: RouteHandler<
  Registry<typeof ModelRegistry, any>
> = (schema, request) => {
  const users = schema.all("user_1").models;
  return {
    // @ts-ignore
    manager: users.filter((user) => user.attrs.role === UserRole.Manager),
    storekeepers: users.filter(
      // @ts-ignore
      (user) => user.attrs.role === UserRole.StoreKeeper
    ),
  };
};

export const mockAuthLogin: RouteHandler<
  Registry<typeof ModelRegistry, any>
> = (schema, request) => {
  const signinMethod = request.queryParams.signinMethod || "signup";

  if (signinMethod === "signup" || signinMethod === "login") {
    const { email, password } = JSON.parse(request.requestBody);

    if (password !== "1000") {
      return new Response(401, {}, { error: "Invalid credentials" });
    }

    const manager = getManager(managerId, email, true);
    return {
      ...manager,
      token: "mock-jwt-token",
    };
  }

  if (signinMethod === "google" || signinMethod === "facebook") {
    const manager = getManager(managerId, undefined, true);
    return {
      ...manager,
      token: "mock-jwt-token",
    };
  }

  return new Response(400, {}, { error: "Unknown signin method" });
};
