import pino, { Logger } from "pino";

const useLogger = (componentName: string) => {
  const logger: Logger =
    process.env.NEXT_PUBLIC_ENVIRONMENT === "prod"
      ? // JSON in production
        pino({ level: "warn" })
      : // Pretty print in development
        pino({
          transport: {
            target: "pino-pretty",
            options: {
              colorize: true,
            },
          },
          level: "debug",
        });
  return logger.child({ module: componentName });
};

export default useLogger;
