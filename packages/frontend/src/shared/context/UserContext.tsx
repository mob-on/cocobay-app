import { createContext, useContext, useEffect, useState } from "react";
import { IUser } from "../services/useUserService";
import { ILoadingContextResource, useLoading } from "./LoadingContext";
import useTelegram from "../hooks/useTelegram";

export interface IUserContext {
  data: IUser;
  setData: (data: IUser | ((data: IUser) => IUser)) => void;
}

const defaultUserData = {};

const UserContext = createContext({
  data: defaultUserData as IUser,
  setData: () => {},
} as IUserContext);

export const useUserData = () => useContext(UserContext);
export default UserContext;

export const UserContextProvider = ({
  children,
}: {
  children: React.JSX.Element;
}) => {
  const [WebApp] = useTelegram();
  const [data, setData] = useState<IUser>(defaultUserData as IUser);
  const loading = useLoading();
  const user: ILoadingContextResource<IUser> = loading.resources["user"];

  useEffect(() => {
    if (user?.data) {
      setData((oldData) => ({ ...oldData, ...user.data }));
    }
    // fetch data and put it into the state.
  }, [user?.data]);

  useEffect(() => {
    if (WebApp) {
      setData((oldData) => ({ ...oldData, ...WebApp.initDataUnsafe.user }));
    }
  }, [WebApp]);

  return (
    <UserContext.Provider value={{ data, setData }}>
      {children}
    </UserContext.Provider>
  );
};
