import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useFetchData } from "./useFetch";
import type { User } from "@/components/props";

type UsersResponse = {
  manager: User[];
  storekeepers: User[];
};

export const useFetchUsers = () => {
  const [selectedUser, setSelectedUser] = useState("");
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

  const prevUseAlt = useRef(useAlt);

  const combinedUsers = useMemo(
    () =>
      useAlt
        ? [...altData.manager, ...altData.storekeepers]
        : [...mainData.manager, ...mainData.storekeepers],
    [useAlt, mainData, altData]
  );

  useEffect(() => {
    if (combinedUsers.length > 0) {
      if (!selectedUser) {
        setSelectedUser(combinedUsers[0].id);
        return;
      }

      if (prevUseAlt.current !== useAlt) {
        setSelectedUser(combinedUsers[0].id);
      }

      prevUseAlt.current = useAlt;
    }
  }, [combinedUsers, useAlt]);

  const toggleUsers = useCallback(async () => {
    setUseAlt((prev) => !prev);
    if (!useAlt) {
      await refetchAlt({ throwOnError: true });
    } else {
      await refetchMain({ throwOnError: true });
    }
  }, [useAlt, refetchAlt, refetchMain]);

  return {
    users: combinedUsers,
    selectedUser,
    setSelectedUser,
    loading: mainLoading || altLoading,
    isError: mainError || altError,
    error: mainErrObj || altErrObj,
    toggleUsers,
  };
};
