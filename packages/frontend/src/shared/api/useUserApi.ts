import { useAxios } from "./main/useAxios";
import { UserDto } from "./dto/user.dto";

export const useUserApi = (baseUrl?: string) => {
  const { get, post } = useAxios(baseUrl);
  return {
    get: async (userId: number) => {
      try {
        const response = await get(`/v1/user/${userId}`);
        if (response.status !== 200) {
          throw new Error("Server responded with unexpected status code");
        }
        return response.data as UserDto;
      } catch (e: unknown) {
        throw new Error("Unable to retrieve user data", e);
      }
    },
    register: async (user: UserDto) => {
      try {
        const response = await post(`/v1/user/`, user);
        if (response.status !== 201) {
          throw new Error("Server responded with unexpected status code");
        }
        return response.data as UserDto;
      } catch (e: unknown) {
        throw new Error("Unable to create user", e);
      }
    },
  };
};
