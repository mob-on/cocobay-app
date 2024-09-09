import { Controller, Get, NotFoundException, Param } from "@nestjs/common";
import { UserService } from "./user.service";

@Controller("/user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get("/:id")
  async getUser(@Param("id") id: number) {
    const user = await this.userService.findById(id);
    if (!user) throw new NotFoundException("User not found");
    return user;
  }
}
