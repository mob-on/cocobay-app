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

type ICardType = "build" | "boost" | "custom";

const UPDATE_INTERVAL = 1000;

const Card: React.FC<{
  data?: IBuild | IBoost; // for type="build" and type="boost"
  onClick: (id: number) => void;
  type: ICardType;
  secondary?: boolean;
  children?: JSX.Element; // for type="custom"
}> = memo(({ data = {}, onClick, type, children, secondary = false }) => {
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
        type === "custom"
          ? useCallback(() => onClick(data.id), [data.id])
          : null
      }
      className={
        styles.card +
        ` ${cooldown > 0 ? styles.cardOnCooldown : ""} ${secondary ? styles.cardSecondary : ""}`
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
});

export default Card;
