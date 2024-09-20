import { getModelForClass, ReturnModelType } from "@typegoose/typegoose";
import { MongoExceptionMapper } from "src/common/database/mongodb/mongo-exception-mapping";
import { UniqueViolation } from "src/common/exception/db/unique-violation.exception";
import { createValidUser } from "test/fixtures/model/user.data";
import { DBSetup, setupDb } from "test/setup/setup";
import { User } from "../model/user.model";
import { UserRepository } from "./user.repository";

const mockUser = createValidUser();

describe("UserRepository", () => {
  let setup: DBSetup;
  let repository: UserRepository;
  let userModel: ReturnModelType<typeof User>;

  beforeAll(async () => {
    userModel = getModelForClass(User);

    setup = await setupDb([User], {
      providers: [
        {
          provide: UserRepository,
          useValue: new UserRepository(userModel, new MongoExceptionMapper()),
        },
      ],
    });

    repository = setup.module.get(UserRepository);
  });

  afterAll(async () => {
    await setup.stop();
  });

  beforeEach(async () => {
    await setup.clearModels();
  });

  it("should be defined", () => {
    expect(repository).toBeDefined();
  });

  it("should create a user when valid", async () => {
    await repository.create(mockUser);

    await expect(userModel.find({ id: mockUser.id })).resolves.not.toBeNull();
  });

  it("should return a valid user when found", async () => {
    await repository.create(mockUser);

    const user = await repository.findById(mockUser.id);

    expect(user).toMatchObject(mockUser);
  });

  it("should return an empty result when not found", async () => {
    await expect(repository.findById("0")).resolves.toBeNull();
  });

  it("should throw UniqueViolation when user already exists with the same ID", async () => {
    await repository.create(mockUser);

    await expect(repository.create(mockUser)).rejects.toThrow(UniqueViolation);
  });
});
