import React, { memo, useCallback, useEffect, useMemo, useState } from "react";
import useSelfCorrectingTimeout from "src//shared/hooks/useSelfCorrectingTimeout";
import useTelegram from "src//shared/hooks/useTelegram";
import TimeFormatter from "src//shared/lib/TimeFormatter";
import styles from "src//styles/components/shared/card/card.module.scss";

import { IBoost } from "../../Boosts";
import { IBuild } from "../../Build";
import BoostCard from "./BoostCard";
import BuildCard from "./BuildCard";

export type ICardType = "build" | "boost" | "custom";
// variants affect the visual look of the card
export type ICardVariant = "default" | "special";

const UPDATE_INTERVAL = 1000;

interface ICardProps {
  data?: IBuild | IBoost | { cooldownUntil?: Date; id?: number }; // for type="build" and type="boost"
  onClick?: (id: number) => void;
  type?: ICardType;
  disabled?: boolean;
  secondary?: boolean;
  children?: JSX.Element; // for type="custom"
  className?: string;
  variant?: ICardVariant;
}

const Card: React.FC<ICardProps> = memo(
  ({
    data = {},
    onClick,
    type = "custom",
    children,
    variant = "default",
    disabled = false,
    className = "",
  }) => {
    const { cooldownUntil } = data;
    const cooldownTimestamp = cooldownUntil?.getTime() ?? 0;
    const [cooldown, setCooldown] = useState(cooldownTimestamp - Date.now());
    const [WebApp] = useTelegram();

    const now = Date.now();

    const updateCooldown = useMemo(() => {
      return cooldownTimestamp > now
        ? () => {
            const now = Date.now();
            setCooldown(cooldownTimestamp - now);
          }
        : null;
    }, []);

    const timeout = useSelfCorrectingTimeout(updateCooldown, UPDATE_INTERVAL);

    useEffect(() => {
      timeout.start();
    }, []);

    return (
      <div
        onClick={
          type === "custom" && typeof onClick === "function" && !disabled
            ? useCallback(() => {
                WebApp?.HapticFeedback?.impactOccurred("light");
                onClick(data?.id);
              }, [data?.id])
            : null // we pass onClick into boost/build cards instead
        }
        className={
          styles.card +
          ` ${disabled ? styles.cardDisabled : ""}` +
          ` ${cooldown > 0 ? styles.cardOnCooldown : ""} ${styles[variant]}` +
          ` ${typeof onClick !== "function" ? styles.nonInteractive : ""}` + // no active effects for cards without onClick
          ` ${className}`
        }
      >
        {type === "build" && (
          <BuildCard
            build={data as IBuild}
            onClick={(id: number) => {
              WebApp?.HapticFeedback?.impactOccurred("light");
              onClick(id);
            }}
          />
        )}
        {type === "boost" && (
          <BoostCard
            boost={data as IBoost}
            onClick={(id: number) => {
              WebApp?.HapticFeedback?.impactOccurred("light");
              onClick(id);
            }}
          />
        )}
        {type === "custom" && children}
        {cooldown > 0 && (
          <div suppressHydrationWarning className={styles.cooldown}>
            <h2>{TimeFormatter.format(cooldown)}</h2>
          </div>
        )}
      </div>
    );
  },
);

export default Card;
