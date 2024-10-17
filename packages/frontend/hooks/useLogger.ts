import pino, { Logger } from "pino";
import { useMemo } from "react";

const useLogger = (componentName: string) => {
  const logger: Logger = useMemo(() => {
    const logger =
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
  }, [componentName]);
  return logger;
};

export default useLogger;
