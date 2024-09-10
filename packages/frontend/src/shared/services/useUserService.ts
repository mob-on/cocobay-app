import { useQuery } from "@tanstack/react-query";
import { TUseService } from "./types";

interface IUser {
  name: string;
  id: number;
  avatar: string;
}

const getUser = async <T>(): Promise<T> => {
  return {} as T;
};

const QUERY_KEY = "user";

const useUserService: TUseService<IUser> = () => {
  const query = useQuery<IUser>({ queryKey: [QUERY_KEY], queryFn: getUser });

  return [query, {}];
};

export default useUserService;
