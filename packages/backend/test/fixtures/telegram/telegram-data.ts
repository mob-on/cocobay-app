import { faker } from "@faker-js/faker/.";
import { ConfigService } from "@nestjs/config";
import { InitData, sign } from "@telegram-apps/init-data-node";

const testAppTokenSecret = "5768337691:AAH5YkoiEuPk8-FZa32hStHTqXiLPtAEhx8";
export const configureTelegramForSuccess = (config: ConfigService) => {
  config.set("telegram.webappDataExpirySeconds", 0);
  config.set("telegram.appToken", testAppTokenSecret);
};

const validWebappInitDataStatic: InitData = {
  authDate: new Date(1000),
  canSendAfter: 10000,
  chat: {
    id: 1,
    type: "group",
    username: "my-chat",
    title: "chat-title",
    photoUrl: "chat-photo",
  },
  chatInstance: "888",
  chatType: "sender",
  queryId: "QUERY",
  hash: "632c77eeb73df914625433cb07a7939e8f688524ad3957dfc91a0a1af5b7c983",
  receiver: {
    addedToAttachmentMenu: false,
    allowsWriteToPm: true,
    firstName: "receiver-first-name",
    id: 991,
    isBot: false,
    isPremium: true,
    languageCode: "ru",
    lastName: "receiver-last-name",
    photoUrl: "receiver-photo",
    username: "receiver-username",
  },
  startParam: "debug",
  user: {
    addedToAttachmentMenu: true,
    allowsWriteToPm: true,
    firstName: "John",
    id: 1,
    isBot: false,
    isPremium: false,
    languageCode: "en",
    lastName: "Doe",
    photoUrl: "user-photo",
    username: "user-username",
  },
};

export const createValidWebappInitData = (
  userId: number = faker.number.int(),
) => {
  const signInput = {
    ...validWebappInitDataStatic,
    ...{
      user: {
        ...validWebappInitDataStatic.user,
        id: userId,
      },
    },
  };

  delete signInput.hash;
  delete signInput.authDate;

  const authDate = new Date(1000);

  const initDataRaw = sign(signInput, testAppTokenSecret, authDate);

  signInput.hash = new URLSearchParams(initDataRaw).get("hash");
  signInput.authDate = authDate;

  return {
    initDataRaw,
    initData: signInput,
  };
};
