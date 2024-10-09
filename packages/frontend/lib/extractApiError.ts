import { AxiosError } from "axios";

export class ErrorWithMessage extends Error {
  instance: Error;
  message: string;

  constructor(error: Error | AxiosError<{ message?: string }>) {
    const message =
      error instanceof AxiosError
        ? error.response?.data.message || error.message
        : "Something went wrong";

    super(message);

    this.instance = error;
    this.message = message;
  }
}

export function extractApiError(
  error: AxiosError<{ message?: string }> | Error,
): ErrorWithMessage {
  console.log("error", error);
  return new ErrorWithMessage(error);
}

export function parseErrorMessage(error: unknown) {
  if (error instanceof Error || error instanceof ErrorWithMessage) {
    return error.message;
  }
  return "Something went wrong";
}
