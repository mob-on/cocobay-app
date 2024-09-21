import { useQuery } from "@tanstack/react-query";

import { TUseService } from "./types";

export interface IUser {
  firstName?: string;
  lastName?: string;
  id: number;
  avatar: string;
}

const getUser = async <T>(): Promise<T> => {
  return {} as T;
};

export const USER_QUERY_KEY = "user";

const useUserService: TUseService<IUser, object> = () => {
  const query = useQuery<IUser>({
    queryKey: [USER_QUERY_KEY],
    queryFn: getUser,
  });

  return [{} as IUser, {}];
};

export default useUserService;
