import { Controller, Post, Body, Get } from "@nestjs/common";

@Controller("time")
export class TimeController {
  @Get()
  getServerTime() {
    return {
      serverTime: Date.now(),
    };
  }

  @Post("/sync")
  syncTime(@Body() clientData: { clientSendTime: number }): {
    serverTime: number;
    clientSendTime: number;
  } {
    const serverTime = Date.now(); // Capture server time when receiving the request
    return { serverTime, clientSendTime: clientData.clientSendTime }; // Send back server time and the client-sent time
  }
}
