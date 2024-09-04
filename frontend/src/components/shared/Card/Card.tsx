import React, { memo, useEffect, useMemo, useRef, useState } from "react";
import { IBuild } from "../../Build";
import { IBoost } from "../../Boosts";
import BuildCard from "./BuildCard";
import BoostCard from "./BoostCard";
import styles from "src/styles/components/shared/card/card.module.scss";
import TimeFormatter from "src/shared/lib/TimeFormatter";
import useSelfCorrectingTimeout from "src/shared/hooks/useSelfCorrectingTimeout";

type ICardType = "build" | "boost";

const UPDATE_INTERVAL = 1000;

const Card: React.FC<{
  data: IBuild | IBoost;
  onClick: (id: number) => void;
  type: ICardType;
}> = memo(({ data, onClick, type }) => {
  const [cooldown, setCooldown] = useState(0);
  const { cooldownUntil } = data;
  const timeoutId = useRef<NodeJS.Timeout>();
  const now = Date.now();
  timeoutId.current = useSelfCorrectingTimeout(
    useMemo(() => {
      return cooldownUntil > now
        ? () => {
            const now = Date.now();
            setCooldown(cooldownUntil - now);
          }
        : null;
    }, []),
    UPDATE_INTERVAL,
  );

  useEffect(() => {
    return () => clearTimeout(timeoutId.current);
  }, [data.cooldownUntil]);

  return (
    <div className={styles.card}>
      {type === "build" && (
        <BuildCard build={data as IBuild} onClick={onClick} />
      )}
      {type === "boost" && (
        <BoostCard boost={data as IBoost} onClick={onClick} />
      )}
      {cooldown > 0 && (
        <div suppressHydrationWarning className={styles.cooldown}>
          <h2>{TimeFormatter.format(cooldown)}</h2>
        </div>
      )}
    </div>
  );
});

export default Card;
