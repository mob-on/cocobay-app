class Logger {
  private componentName: string;
  private isDev = process.env.NEXT_PUBLIC_ENVIRONMENT === "local";

  constructor(componentName: string) {
    this.componentName = componentName;
  }

  private validateMessage(message: string) {
    if (!message) {
      console.trace("Message cannot be empty.");
      return false;
    }
    if (!this.componentName) {
      console.trace("Component name cannot be empty.");
      return false;
    }
    if (typeof this.componentName !== "string") {
      console.trace("Component name must be a string.");
      return false;
    }
    return true;
  }

  private populateMessage(message: string) {
    const timestamp = new Date().toISOString();
    const transformedMessage =
      typeof message === "string" ? message : JSON.stringify(message);
    return `[${timestamp}] [${this.componentName}] ${transformedMessage}`;
  }

  // TODO: add tests

  debug = (message: string) => {
    if (!this.isDev || !this.validateMessage(message)) return;
    console.debug(`%c[DEBUG] ${this.populateMessage(message)}`, "color: green");
  };

  log = (message: string) => {
    if (!this.validateMessage(message)) return;
    console.log(`%c[LOG] ${this.populateMessage(message)}`, "color: blue");
  };

  warn = (message: string) => {
    if (!this.validateMessage(message)) return;
    console.warn(`%c[WARN] ${this.populateMessage(message)}`, "color: orange");
  };

  error = (message: string) => {
    if (!this.validateMessage(message)) return;
    console.error(`%c[ERROR] ${this.populateMessage(message)}`, "color: red");
  };
}

export default Logger;
