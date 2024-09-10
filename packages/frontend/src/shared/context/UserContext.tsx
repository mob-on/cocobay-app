import { createContext, useContext, useEffect, useState } from "react";
import { IUser } from "../services/useUserService";
import { ILoadingContextResource, useLoading } from "./LoadingContext";

export interface IUserContext {
  data: IUser;
  setData: (data: IUser | ((data: IUser) => IUser)) => void;
}

const defaultLevelingData = {};

const UserContext = createContext({
  data: defaultLevelingData as IUser,
  setData: () => {},
} as IUserContext);

export const useUserData = () => useContext(UserContext);
export default UserContext;

export const UserContextProvider = ({
  children,
}: {
  children: React.JSX.Element;
}) => {
  const [data, setData] = useState<IUser>(defaultLevelingData as IUser);
  const loading = useLoading();
  const user: ILoadingContextResource<IUser> = loading.resources["user"];

  useEffect(() => {
    if (user?.data) {
      setData(user.data);
    }
    // fetch data and put it into the state.
  }, [user?.data]);
  return (
    <UserContext.Provider value={{ data, setData }}>
      {children}
    </UserContext.Provider>
  );
};
