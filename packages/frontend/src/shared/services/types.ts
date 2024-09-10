import { UseMutationResult, UseQueryResult } from "@tanstack/react-query";

export type TUseService<T> = () => [
  UseQueryResult<T, Error>,
  { [key: string]: UseMutationResult<T, Error, void, unknown> },
];
