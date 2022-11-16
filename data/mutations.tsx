import { useMutation, useQueryClient } from "react-query";
import { useStore } from "../utils/firebase/useAuthentication";
import { updateUser } from "./api";

export const useUpdateUser = () => {
  const user = useStore((state) => state.user);
  const setUser = useStore((state) => state.setUser);
  const queryClient = useQueryClient();

  return useMutation((data) => updateUser(data), {
    onSuccess: (data) => {
      queryClient.invalidateQueries("currentUser");
      queryClient.invalidateQueries(user?.uid);
      setUser({ ...user, ...data });
    },
  });
};
