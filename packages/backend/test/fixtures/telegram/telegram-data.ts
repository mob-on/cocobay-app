import { faker } from "@faker-js/faker/.";
import { ConfigService } from "@nestjs/config";
import { InitDataParsed, sign } from "@telegram-apps/init-data-node";

const testAppTokenSecret = "5768337691:AAH5YkoiEuPk8-FZa32hStHTqXiLPtAEhx8";
export const configureTelegramForSuccess = (configService: ConfigService) => {
  configService.set("telegram.webappDataExpirySeconds", 0);
  configService.set("telegram.appToken", testAppTokenSecret);
};

const validWebappInitDataStatic: InitDataParsed = {
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
  hash: "47cfa22e72b887cba90c9cb833c5ea0f599975b6ce7193741844b5c4a4228b40",
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
    addedToAttachmentMenu: false,
    allowsWriteToPm: false,
    firstName: "user-first-name",
    id: 222,
    isBot: true,
    isPremium: false,
    languageCode: "en",
    lastName: "user-last-name",
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
