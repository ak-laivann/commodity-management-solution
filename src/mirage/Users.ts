import { faker } from "@faker-js/faker";
import type { Registry } from "miragejs";
import type { RouteHandler } from "miragejs/server";
import type { ModelRegistry } from "./MirageModels";

// this should be passed to props so that we can avoid circular dependency issues.
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  managerId?: string; // Optional property to link to a manager
  isSignedIn?: boolean; // Optional property to indicate if the user is signed in
}

export enum UserRole {
  StoreKeeper = "storekeeper",
  Manager = "manager",
}

const managerId = faker.database.mongodbObjectId();
const managerId_1 = faker.database.mongodbObjectId();

// since this is used inside seeds of miragejs, I am having isSignedIn as true.
// either way, we will go ahead with the login api and set this dynamically by then.
export function getStoreKeeper(isFirstSet: boolean): User {
  return {
    id: faker.database.mongodbObjectId(),
    name: faker.person.fullName(),
    email: faker.internet.email(),
    role: UserRole.StoreKeeper,
    isSignedIn: true,
    managerId: isFirstSet ? managerId : managerId_1,
  };
}

export function getManager(isFirstSet: boolean): User {
  return {
    id: isFirstSet ? managerId : managerId_1,
    name: faker.person.fullName(),
    email: faker.internet.email(),
    role: UserRole.Manager,
    isSignedIn: true,
  };
}

export const mockGetFirstSetOfUsers: RouteHandler<
  Registry<typeof ModelRegistry, any>
> = (schema, request) => {
  const users = schema.all("user").models;
  console.log(users);
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
