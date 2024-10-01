"use client";
import { TelegramWebappAuthDto } from "@shared/src/dto/auth/telegram-webapp-auth.dto";
import { GameDataDto } from "@shared/src/dto/gameData.dto";
import { UserDto } from "@shared/src/dto/user.dto";
import { LoadingScreen } from "@src/components/LoadingScreen";
import { validate } from "class-validator";
import { createContext, useContext, useEffect, useState } from "react";

import { GAME_DATA_QUERY_KEY, useGameDataApi } from "../api/useGameDataApi";
import { useUserApi } from "../api/useUserApi";
import useLogger from "../hooks/useLogger";
import useTelegram from "../hooks/useTelegram";
import { Feature } from "../lib/FeatureFlags";
import { USER_QUERY_KEY } from "../services/useUserService";
import { useErrorContext } from "./ErrorContext";
import { useStoredApiUrl } from "./LocalStorageContext";

const MAX_TRIES = 3;

type ILoadingContextResourceStatus = "pending" | "loaded" | "errored";

export interface ILoadingContextResource<T> {
  status: ILoadingContextResourceStatus;
  data?: T;
}

export interface ILoadingContext {
  allLoaded: boolean;
  updateResourceStatus: (
    resourceName: string,
    status: ILoadingContextResourceStatus,
  ) => void;
  resources: ILoadingContextResources;
}

export interface ILoadingContextResources {
  [key: string]: ILoadingContextResource<any>;
}

interface ResourceToLoad<T> {
  name: string;
  fn: () => Promise<T>;
}

const LoadingContext = createContext({} as ILoadingContext);

export const LoadingProvider = ({ children }) => {
  const errorContext = useErrorContext();
  const [mainApiBaseUrl] = useStoredApiUrl();
  const [isDataRequested, setIsDataRequested] = useState(false);
  const [resources, setResources] = useState<ILoadingContextResources>({}); // { resource1: 'pending', resource2: 'loaded', ... }
  const logger = useLogger("LoadingProvider");
  const [WebApp] = useTelegram();
  const userApi = useUserApi();
  const gameDataApi = useGameDataApi();

  const login = async (tries = 0) => {
    if (tries >= MAX_TRIES) {
      errorContext.showErrorScreen({
        message: "Wasn't able to log in/register",
      });
      throw new Error("Too many tries");
    }

    let initDataRaw = WebApp?.initData;
    if (!initDataRaw) {
      if (Feature.DEV_MODE) {
        logger.warn(
          "No user information available, defaulting to user ID 1 (dev mode) and dummy bot token",
        );

        initDataRaw =
          "auth_date=1&can_send_after=10000&chat=%7B%22id%22%3A1%2C%22type%22%3A%22group%22%2C%22title%22%3A%22chat-title%22%2C%22photo_url%22%3A%22group%22%2C%22username%22%3A%22my-chat%22%7D&chat_instance=888&chat_type=sender&query_id=QUERY&receiver=%7B%22added_to_attachment_menu%22%3Afalse%2C%22allows_write_to_pm%22%3Atrue%2C%22first_name%22%3A%22receiver-first-name%22%2C%22id%22%3A991%2C%22is_bot%22%3Afalse%2C%22is_premium%22%3Atrue%2C%22language_code%22%3A%22ru%22%2C%22last_name%22%3A%22receiver-last-name%22%2C%22photo_url%22%3A%22receiver-photo%22%2C%22username%22%3A%22receiver-username%22%7D&start_param=debug&user=%7B%22added_to_attachment_menu%22%3Atrue%2C%22allows_write_to_pm%22%3Atrue%2C%22first_name%22%3A%22John%22%2C%22id%22%3A1%2C%22is_bot%22%3Afalse%2C%22is_premium%22%3Afalse%2C%22language_code%22%3A%22en%22%2C%22last_name%22%3A%22Doe%22%2C%22photo_url%22%3A%22user-photo%22%2C%22username%22%3A%22user-username%22%7D&hash=632c77eeb73df914625433cb07a7939e8f688524ad3957dfc91a0a1af5b7c983";
      } else {
        logger.error("No user information available");
        errorContext.showErrorScreen({
          message: "No user information available",
        });
        throw new Error("No user information available");
      }
    }

    try {
      const loginDto = await userApi.login(
        new TelegramWebappAuthDto({
          initDataRaw,
        }),
      );
      const userDto = new UserDto(loginDto.user);
      const userDtoErrors = await validate(userDto);
      if (userDtoErrors.length) {
        logger.error("Failed to validate user dto", userDtoErrors);
        throw new Error("Failed to validate user dto");
      }
      return loginDto.user;
    } catch (err) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return login(tries + 1);
    }
  };

  const updateResourceStatus = (
    resourceName: string,
    status: ILoadingContextResourceStatus,
    data?: any,
  ) => {
    setResources((prev) => {
      const current = prev[resourceName];
      if (current?.status === status && current?.data === data) {
        return prev; // No change, avoid state update
      }
      return {
        ...prev,
        [resourceName]: {
          ...(prev[resourceName] || {}),
          status,
          data,
        },
      };
    });
  };

  const initializeResources = async (resourceList: ResourceToLoad<any>[]) => {
    const initialResources = resourceList.reduce((acc, resource) => {
      acc[resource.name] = {
        status: "pending",
        data: null,
      };
      return acc;
    }, {} as ILoadingContextResources);

    setResources(initialResources);

    const updatedResources = { ...initialResources };

    // Load all resources concurrently
    await Promise.all(
      resourceList.map(async (resource) => {
        try {
          const data = await resource.fn();
          updatedResources[resource.name] = { status: "loaded", data };
        } catch (error) {
          logger.error(error);
          updatedResources[resource.name] = { status: "errored", data: null };
        }
      }),
    );

    // Batch update the state
    setResources(updatedResources);
  };

  // Initialize resources. If mainApiBaseUrl changes, we'll need to reload all resources.
  useEffect(() => {
    setIsDataRequested(false);
    const apiToLoad: ResourceToLoad<any>[] = [
      { fn: login, name: USER_QUERY_KEY } as ResourceToLoad<UserDto>,
      {
        fn: gameDataApi.get,
        name: GAME_DATA_QUERY_KEY,
      } as ResourceToLoad<GameDataDto>,
    ];
    // Initialize all resources we know for sure we'll need.
    initializeResources(apiToLoad);
    setIsDataRequested(true);
  }, [mainApiBaseUrl]);

  // if we haven't requested the data to load yet, our resource list might be empty.
  const allLoaded =
    isDataRequested &&
    Object.values(resources).every((resource) => resource.status === "loaded");

  return (
    <LoadingContext.Provider
      value={{ updateResourceStatus, allLoaded, resources }}
    >
      {allLoaded ? children : <LoadingScreen />}
    </LoadingContext.Provider>
  );
};

export const useLoading = () => useContext(LoadingContext) as ILoadingContext;
