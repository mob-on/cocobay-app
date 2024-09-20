import { UserDto } from "@shared/src/dto/user.dto";
import TestAgent from "supertest/lib/agent";

export const apiCreateUser = async (api: TestAgent, user: UserDto) => {
  return api.post("/v1/user").send(user);
};
