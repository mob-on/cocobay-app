import { UseQueryResult } from "@tanstack/react-query";

export type TUseService<T, M> = () => [UseQueryResult<T, Error>, M];
