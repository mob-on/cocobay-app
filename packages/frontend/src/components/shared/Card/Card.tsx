import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { IBuild } from "../../Build";
import { IBoost } from "../../Boosts";
import BuildCard from "./BuildCard";
import BoostCard from "./BoostCard";
import styles from "src/styles/components/shared/card/card.module.scss";
import TimeFormatter from "src/shared/lib/TimeFormatter";
import useSelfCorrectingTimeout from "src/shared/hooks/useSelfCorrectingTimeout";

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
    const [cooldown, setCooldown] = useState(0);
    const { cooldownUntil } = data;
    const cooldownTimestamp = cooldownUntil?.getTime() ?? 0;
    const timeoutId = useRef<NodeJS.Timeout>();
    const now = Date.now();
    timeoutId.current = useSelfCorrectingTimeout(
      useMemo(() => {
        return cooldownTimestamp > now
          ? () => {
              const now = Date.now();
              setCooldown(cooldownTimestamp - now);
            }
          : null;
      }, []),
      UPDATE_INTERVAL,
    );

    useEffect(() => {
      return () => clearTimeout(timeoutId.current);
    }, [data.cooldownUntil]);

    return (
      <div
        onClick={
          type === "custom" && typeof onClick === "function" && !disabled
            ? useCallback(() => onClick(data?.id), [data?.id])
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
          <BuildCard build={data as IBuild} onClick={onClick} />
        )}
        {type === "boost" && (
          <BoostCard boost={data as IBoost} onClick={onClick} />
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