"use client";

import useSelfCorrectingTimeout from "@hooks/useSelfCorrectingTimeout";
import useTelegram from "@hooks/useTelegram";
import TimeFormatter from "@lib/TimeFormatter";
import { Boost, Build } from "@shared/src/interfaces";
import styles from "@styles/components/shared/card/card.module.css";
import React, { memo, useCallback, useEffect, useMemo, useState } from "react";

import BoostCard from "./BoostCard";
import BuildCard from "./BuildCard";

export type ICardType = "build" | "boost" | "custom";
// variants affect the visual look of the card
export type ICardVariant = "default" | "special";

const UPDATE_INTERVAL = 1000;

interface ICardProps {
  data?: Build | Boost | { cooldownUntil?: Date; id?: string }; // for type="build" and type="boost"
  onClick?: (id: string) => void;
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
    const id = data.id as string;
    const cooldownTimestamp = cooldownUntil
      ? (new Date(cooldownUntil)?.getTime() ?? 0)
      : 0;
    const [cooldown, setCooldown] = useState(cooldownTimestamp - Date.now());
    const [WebApp] = useTelegram();

    const renderedTimeStamp = useMemo(() => Date.now(), []);

    const updateCooldown = useMemo(() => {
      return cooldownTimestamp > renderedTimeStamp
        ? async () => {
            setCooldown(cooldownTimestamp - Date.now());
          }
        : null;
    }, [cooldownTimestamp, setCooldown, renderedTimeStamp]);

    const timeout = useSelfCorrectingTimeout(updateCooldown, UPDATE_INTERVAL);

    useEffect(() => {
      timeout.start();
      return () => timeout.stop();
    }, [timeout]);

    const clickCallback = useCallback(() => {
      if (id && onClick) {
        WebApp?.HapticFeedback?.impactOccurred("light");
        onClick(id);
      }
    }, [id, onClick, WebApp?.HapticFeedback]);

    return (
      <div
        onClick={
          type === "custom" && typeof onClick === "function" && !disabled
            ? clickCallback
            : undefined // we pass onClick into boost/build cards instead
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
            build={data as Build}
            onClick={(id: string) => {
              WebApp?.HapticFeedback?.impactOccurred("light");
              if (onClick) onClick(id);
            }}
          />
        )}
        {type === "boost" && (
          <BoostCard
            boost={data as Boost}
            onClick={(id: string) => {
              WebApp?.HapticFeedback?.impactOccurred("light");
              if (onClick) onClick(id);
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
Card.displayName = "Card";

export default Card;
