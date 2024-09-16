import { Logger } from "pino";

import toISOString from "./toISOString";

const MAX_EVENT_BUFFER_SIZE = 3;

export enum TrackerEventTypes {
  NAVIGATION = "navigation",
  BOOST_USE = "boost_use",
  BOOST_UPGRADE = "boost_upgrade",
  BUILD_UPGRADE = "build_upgrade",
}

export interface ITrackerEvent {
  event: string;
  tags?: string[];
  url: string;
  title: string;
  ts: string;
}
export class Tracker {
  private buffer: ITrackerEvent[] = [];
  private href: string;
  private lastSendTimestamp: number;
  private timeoutController: number | undefined;
  private logger: Logger;

  constructor({ href, logger }: { href: string; logger: Logger }) {
    this.href = href;
    this.logger = logger;
  }

  /**
   * Add an event to the buffer of events to be sent to the server.
   *
   * @param event The event to be tracked.
   * @param tags An array of tags to be associated with the event.
   */
  track(event: ITrackerEvent["event"], ...tags: string[]): void {
    const bufferEvent: ITrackerEvent = {
      event,
      tags,
      url: window.location.href,
      title: document.title,
      ts: toISOString(new Date()),
    };
    this.buffer.push(bufferEvent);

    if (event === "click-link") this.handleNavigationOrTabClose();
    else this.report();
  }

  /**
   * Handle closing of the tab or navigation away from the current page.
   * This method will send all events in the buffer to the server.
   */
  private handleNavigationOrTabClose(): void {
    const { buffer } = this;
    this.buffer = [];

    if (!buffer.length) return;
    navigator.sendBeacon(this.href, JSON.stringify(buffer));
  }

  /**
   * Whether or not the buffer of events should be sent to the server.
   *
   * If the buffer has {MAX_EVENT_BUFFER_SIZE} or more events, or if the last send was more than 1000ms ago,
   * then the buffer should be sent.
   *
   * @returns Whether the buffer should be sent.
   */
  private shouldSend(): boolean {
    const { buffer, lastSendTimestamp } = this;
    if (!buffer.length) return false;
    const timestamp = Number(new Date());

    if (
      buffer.length >= MAX_EVENT_BUFFER_SIZE ||
      timestamp - lastSendTimestamp >= 1000
    )
      return true;
    else return false;
  }

  /**
   * Send all events in the buffer to the server.
   * If `force` is false, it will only send if `shouldSend()` returns true.
   *
   * @param force Whether to send the buffer regardless of `shouldSend()`.
   */
  report(force = false): void {
    const shouldSend = force ? true : this.shouldSend();
    const { buffer, href: path } = this;

    if (!shouldSend && buffer.length) {
      const { lastSendTimestamp } = this;
      clearTimeout(this.timeoutController);
      this.timeoutController = window.setTimeout(
        this.report,
        lastSendTimestamp - Number(new Date()) + 1000,
      );
      return;
    } else if (!shouldSend) {
      return;
    }

    this.lastSendTimestamp = Number(new Date());

    this.buffer = [];
    fetch(path, {
      method: "POST",
      body: JSON.stringify(buffer),
      headers: { "Content-Type": "application/json" },
    })
      .then((req) => {
        if (req.status !== 200) {
          this.buffer = [...this.buffer, ...buffer]; // Return data to buffer
          window.setTimeout(this.report, 1000);
        }
      })
      .catch((e) => {
        this.logger.error(e);
        this.buffer = [...this.buffer, ...buffer]; // Return data to buffer
        window.setTimeout(this.report, 1000);
      });
  }
}
