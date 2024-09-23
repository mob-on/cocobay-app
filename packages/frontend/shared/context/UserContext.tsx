"use client";

import { User } from "@shared/src/interfaces";
import { createContext, useContext, useEffect, useState } from "react";

import useTelegram from "../hooks/useTelegram";
import { ILoadingContextResource, useLoading } from "./LoadingContext";

export interface IUserContext {
  data: User;
  setData: (data: User | ((data: User) => User)) => void;
}

const UserContext = createContext({
  data: {} as User,
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
  const loading = useLoading();
  const user: ILoadingContextResource<User> = loading.resources["user"];

  const [data, setData] = useState<User>(user?.data ?? ({} as User));

  useEffect(() => {
    if (user?.data) {
      setData((oldData) => ({ ...oldData, ...user.data }));
    }
  }, [user?.data]);

  useEffect(() => {
    if (WebApp) {
      setData(
        (oldData) => ({ ...oldData, ...WebApp.initDataUnsafe.user }) as User,
      );
    }
  }, [WebApp]);

  return (
    <UserContext.Provider value={{ data, setData }}>
      {children}
    </UserContext.Provider>
  );
};
