import { useState, useEffect, useCallback } from "react";
import { useFetchData } from "./useFetch";
import type { User } from "@/components/props";

type UsersResponse = {
  manager: User[];
  storekeepers: User[];
};

export const useFetchUsers = () => {
  const [selectedUser, setSelectedUser] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [useAlt, setUseAlt] = useState(false);

  const {
    data: mainData = { manager: [], storekeepers: [] },
    isLoading: mainLoading,
    isError: mainError,
    error: mainErrObj,
    refetch: refetchMain,
  } = useFetchData<UsersResponse>("users", "users", { enabled: !useAlt });

  const {
    data: altData = { manager: [], storekeepers: [] },
    isFetching: altLoading,
    isError: altError,
    error: altErrObj,
    refetch: refetchAlt,
  } = useFetchData<UsersResponse>("users_1", "users_1", { enabled: useAlt });

  useEffect(() => {
    const combined = useAlt
      ? [...altData.manager, ...altData.storekeepers]
      : [...mainData.manager, ...mainData.storekeepers];
    setUsers(combined);
    if (combined.length > 0) setSelectedUser(combined[0].id);
  }, [mainData, altData, useAlt]);

  const toggleUsers = useCallback(async () => {
    setUseAlt((prev) => !prev);
    if (!useAlt) {
      await refetchAlt({ throwOnError: true });
    } else {
      await refetchMain({ throwOnError: true });
    }
  }, [useAlt, refetchAlt, refetchMain]);

  return {
    users,
    selectedUser,
    setSelectedUser,
    loading: mainLoading || altLoading,
    isError: mainError || altError,
    error: mainErrObj || altErrObj,
    toggleUsers,
  };
};
