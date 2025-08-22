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

export interface UserContextObject extends User {
  setUser?: (u: User) => void;
}
