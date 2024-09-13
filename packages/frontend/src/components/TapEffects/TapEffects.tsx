import Image from "next/image";
import React from "react";
import { useTaps } from "src/shared/context/TapEffectsContext";
import styles from "src/styles/components/tapEffects/tapEffects.module.scss";

import CocoCoin from "/public/media/coco-coin.svg";

import { ITapEvent } from "../TapArea";

interface ITapEffectProps {
  tap: ITapEvent;
}

/**
 * Component that displays a floating number effect at the location of a tap event.
 *
 * @param {ITapEvent} tap - The tap event object containing the x and y coordinates
 *     of the tap event.
 * @return {JSX.Element} A div element with the class styles.floatingNumber at the
 *     location of the tap event.
 */
const TapEffect: React.FC<ITapEffectProps> = ({ tap }) => {
  const { x, y } = tap;

  return (
    <div style={{ left: x, top: y }} className={styles.floatingNumber}>
      <span>+1</span>
      <Image
        src={CocoCoin}
        alt="coin"
        width={24}
        height={24}
        className={styles.coin}
        priority
      />
    </div>
  );
};

/**
 * Component that displays tap effects (floating numbers).
 *
 * @return {JSX.Element} Component that displays a list of tap effects.
 */
const TapEffects: React.FC = () => {
  const { taps = [] } = useTaps();
  return (
    <div className={styles.tapEffects}>
      {taps.map((tap) => (
        <TapEffect key={tap.id} tap={tap} />
      ))}
    </div>
  );
};

export default TapEffects;
