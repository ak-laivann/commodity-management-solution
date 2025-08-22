import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bell, LayoutDashboard, User as UserIcon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFetchUsers } from "@/hooks";
import { AsyncUIWrapper } from "@/components/custom";

export const Header = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const {
    users,
    selectedUser,
    setSelectedUser,
    loading,
    isError,
    error,
    toggleUsers,
  } = useFetchUsers();

  return (
    <header className="flex items-center justify-between px-4 py-8 bg-background border-b">
      <div className="flex items-center gap-2">
        <Input
          placeholder="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-64"
        />
        <Button onClick={() => console.log("Searching:", searchQuery)}>
          Search
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <AsyncUIWrapper isLoading={loading} isError={isError} error={error}>
          <Select
            value={selectedUser}
            onValueChange={(val) => setSelectedUser(val)}
            disabled={loading}
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select User" />
            </SelectTrigger>
            <SelectContent>
              {users.map((user) => (
                <SelectItem key={user.id} value={user.id}>
                  {user.name} - {user.role}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </AsyncUIWrapper>

        <LayoutDashboard className="cursor-pointer" />
        <Bell className="cursor-pointer" />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="cursor-pointer">
              <AvatarFallback>
                <UserIcon />
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={toggleUsers}>
              Change set of users
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
