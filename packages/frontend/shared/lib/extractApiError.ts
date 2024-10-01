import { AxiosError } from "axios";

export default (error: AxiosError<{ message?: string }>) => {
  return typeof error === "string"
    ? error
    : error.response?.data?.message || "Something went wrong!";
};
