"use client";

import { ITapEvent, useTapEffects } from "@contexts/TapEffects";
import styles from "@src/styles/components/tapEffects/tapEffects.module.css";
import React from "react";

import Cost from "../shared/Cost";

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
  const { x, y, pointCount = 1 } = tap;
  return (
    <div style={{ left: x, top: y }} className={styles.floatingNumber}>
      <Cost position="right" size={20}>
        <span>+{pointCount}</span>
      </Cost>
    </div>
  );
};

/**
 * Component that displays tap effects (floating numbers).
 *
 * @return {JSX.Element} Component that displays a list of tap effects.
 */
const TapEffects: React.FC = () => {
  const { taps = [] } = useTapEffects();
  return (
    <div className={styles.tapEffects}>
      {taps.map((tap) => (
        <TapEffect key={tap.id} tap={tap} />
      ))}
    </div>
  );
};

export default TapEffects;
